Module.add( 'visual', () => {

let ImgCache = {};

class Visual extends ListManager {
	constructor() {
		super();
		this.parent = null;
		this.x = 0;
		this.y = 0;
		this.layoutFn = null;
		this.elementFn = null;
	}
	get root() {
		return this.parent || this;
	}
	get width() {
	}
	get height() {
	}
	add(visual) {
		super.add(visual);
		visual.parent = this;
		return visual;
	}
	align() {
		let r = this.rect;
		this.element.style.left = r.x;
		this.element.style.top = r.y;
		this.element.style.width = r.width;
		this.element.style.height = r.height;
	}
	link(className,elementFn,eventFn) {
		let e = this.root.addElement(this,className,elementFn);
		if( eventFn ) {
			eventFn(e);
		}
	}
	lay() {
		if( this.layoutFn ) {
			this.layoutFn(this);
		}
		if( this.element && !this.elementFn ) {
			this.align();
		}
		if( this.elementFn ) {
			this.elementFn(this);
		}
		this.traverse( visual => visual.lay() );
	}
	tick(dt) {
		this.traverse( visual => visual.tick(dt) );
	}
	render() {
		this.traverse( visual => visual.render() );
	}
}

Visual.Line = class extends Visual {
	constructor(color,thickness=1) {
		super();
		this.color = color;
		this.thickness = thickness;
	}
	render() {
		var ctx = this.root.context;
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth	= this.thickness;
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.ex, this.ey);
		ctx.stroke();
		this.traverse( element => element.render() );
	}
}


Visual.Sprite = class extends Visual {
	constructor(imageUrl) {
		super();
		this._image = null;
		this.image = imageUrl;
		this.scale = 1.0;
		this.xScale = null;
		this.yScale = null;
		this.xAnchor = 0.5;
		this.yAnchor = 0.5;
	}
	set image(url) {
		if( url === null ) return;
		if( !ImgCache[url] ) {
			ImgCache[url] = new Image();
			ImgCache[url].src = url;
			ImgCache[url].onload = () => ImgCache[url].loaded = true;
		}
		this._image = ImgCache[url];
	}
	get rect() {
		return {
			x: this.x-this.xAnchor*this.width,
			y: this.y-this.yAnchor*this.height,
			width: this.width,
			height: this.height
		}
	}
	get image() {
		return this._image;
	}
	get naturalWidth() {
		return this.loaded ? this.image.naturalWidth : 1.0;
	}
	get naturalHeight() {
		return this.loaded ? this.image.naturalHeight : 1.0;
	}
	get width() {
		return this.naturalWidth*(this.xScale ? this.xScale : this.scale);
	}
	get height() {
		return this.naturalHeight*(this.yScale ? this.yScale : this.scale);
	}
	scaleToWidth(w) {
		this.scale = w / this.naturalWidth;
	}
	scaleToHeight(w) {
		if( this.image.loaded ) {
			this.scale = w / this.naturalWidth;
		}
	}
	render() {
		if( this._image.loaded ) {
			this.root.context.drawImage(
				this.image,
				this.x-this.xAnchor*this.width,
				this.y-this.yAnchor*this.height,
				this.width,
				this.height
			);
		}
		super.render();
	}
}

Visual.Text = class extends Visual {
	constructor(color,text) {
		super();
		this.color = color;
		this.text = text;
		this.xAnchor = 0.5;
		this.yAnchor = 0.3;
		this.textWidth = null
		this.textHeight = null;
	}
	textWidthAt(px) {
		this.root.context.font = ''+px+'px Arial';
		return this.root.context.measureText(this.text).width;
	}
	render() {
		console.assert( this.textWidth!==null || this.textHeight!==null );
		let fontSize = Math.floor( this.textHeight ? this.textHeight : this.textWidthAt(100)/100*this.textWidth );
		this.root.context.fillStyle = this.color;
		this.root.context.strokeStyle = this.color;
		this.root.context.font = ''+fontSize+'px Arial';
		let w = this.textWidthAt(fontSize);
		this.root.context.fillText( this.text, this.x-this.xAnchor*w, this.y+this.yAnchor*fontSize );
		super.render();
	}
}


Visual.Canvas = class extends Visual{
	constructor(rootDiv,LayoutSpecification) {
		super();

		window.addEventListener('resize', () => {
			this.sizeToDiv();
		});

		this.visuals = {};

		this.canvas  = document.createElement("canvas");                 // Create a <li> node
		this.canvas.style.position = 'absolute';
		this.context = this.canvas.getContext('2d');

		this.div = document.getElementById(rootDiv);
		this.div.style.position = "absolute";
		this.div.style.width = "100%";

		this.div.appendChild(this.canvas);

		this.overlay = document.createElement("div");
		this.overlay.style.position = 'absolute';
		this.overlay.style.zIndex = (this.canvas.style.zIndex||0)+1;

		this.div.insertBefore(this.overlay,this.canvas)

		this.sizeToDiv();

		this.layout = new LayoutSpecification(this);
	}
	get pixelRatio() {
		var ctx = document.createElement('canvas').getContext('2d');
		let dpr = window.devicePixelRatio || 1;
		let bsr = ctx.webkitBackingStorePixelRatio ||
			ctx.mozBackingStorePixelRatio ||
			ctx.msBackingStorePixelRatio ||
			ctx.oBackingStorePixelRatio ||
			ctx.backingStorePixelRatio ||
			1;
		return dpr / bsr;
	}
	sizeToDiv() {
		let [w, h] = [this.div.clientWidth, this.div.clientHeight];
		this.canvas.width = w * this.pixelRatio;
		this.canvas.height = h * this.pixelRatio;
		this.canvas.style.height = h+'px';
		this.canvas.style.width  = w+'px';

		this.overlay.style.width = this.canvas.style.width;
		this.overlay.style.height = this.canvas.style.height;

		// Throw an incredibly weird wrinkle, this.context is wrong unless you gge the context yourself by hand.
	    this.canvas.getContext('2d').scale(this.pixelRatio, this.pixelRatio);
		this.lay();
	}
	get width() {
		return parseInt(this.canvas.style.width);
	}
	get height() {
		return parseInt(this.canvas.style.height);
	}
	addVisuals(hash) {
		Object.each( hash, (pair,id) => {
			this.visuals[id] = pair[0];
			pair[0].id = id;
			pair[0].layoutFn = pair[1]
			this.add(pair[0]);
		});
	}
	addElement(visual,className,elementFn) {
		let e = document.createElement("div");
		e.style.position = "absolute";
		e.classList.add(className);
		this.overlay.appendChild(e);
		visual.element   = e;
		visual.elementFn = elementFn;
		return e;
	}
	tick(dt) {
		super.tick(dt);
		this.lay();
	}
	render() {
		this.context.fillStyle = 'black';
		this.context.fillRect(0,0,this.width,this.height);
		super.render();
	}
}

return {
	Visual: Visual
}

})
