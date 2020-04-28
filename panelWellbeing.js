Module.add( 'panelWellbeing', ()=>{

let PanelWellbeing = {};

PanelWellbeing.Layout = (function(root) {

	let pieRot		= Math.PI*1.5;	// North
	let trans		= 'rgba(0,0,0,0)';

	let yTitle		= 0.14;			// the title's bottom
	let yBodyTop	= 0.20;
	let yBodyBtm	= 0.95;
	let yBodySpan	= (yBodyBtm-yBodyTop)/6;
	let xPointer	= 0.06;
	let xPie		= 0.15;
	let xIssue		= 0.20;
	let xIssueWidth	= 0.30;
	let xBarrel		= 0.70;
	let xBarrelSpan	= 0.10;
	let yBarrel		= 0.60;
	let yBarrelKey  = 0.80;

	let w = (pct) => root.width*pct;
	let h = (pct) => root.height*pct;

	let row			= rowIndex => h(yBodyTop + yBodySpan*(rowIndex+0.5));
	let colBarrel	= rowIndex => w(xBarrel + xBarrelSpan*(rowIndex+0.5));
	let colorFor	= (pct) => {
		let c= pct==0 ? '2' : '6789ABCD'.charAt(Math.clamp(Math.floor(pct*8),0,7));
		return '#'+c+c+c; }

	this.title = (v) => {
		v.x = w(0.50);
		v.y = h(yTitle*0.5);
		v.textHeight = Math.floor(h(yTitle * 0.90));
	}

	this.pointer = (v,rowIndex) => {
		if( rowIndex === null ) {
			v.visible = false;
			return;
		}
		v.x = w(xPointer);
		v.y = row(rowIndex);
		v.scaleToHeight(h(yBodySpan));
	}

	this.pie = (v,rowIndex,pct) => {
		v.x = w(xPie);
		v.y = row(rowIndex);
		v.inner = 0;
		v.outer = h(yBodySpan * (0.50*0.80));
		v.start = pieRot+0;
		v.end   = pieRot+Math.PI*2*pct;
		v.noLineOnEmptyAndFull = true;
		v.color			= pct==0 ? trans : colorFor(pct);
		v.fill			= pct==0 ? trans : colorFor(pct);
		v.backgroundFill= pct==0 ? null  : colorFor(0);
		v.hint = rowIndex;
	}

	this.issue = (v,rowIndex,pct) => {
		v.x = w(xIssue);
		v.y = row(rowIndex);
		v.xAnchor = 0.0;
		v.color = colorFor(pct);
		v.textHeight = h(yBodySpan*0.80);
	}

	this.barrel = (v,colIndex) => {
		v.x = w(xBarrel+xBarrelSpan*colIndex);
		v.y = h(yBarrel);
		v.alpha = 0.50;
		v.scaleToHeight(h(0.20));
	}

	this.barrelKey = (v,colIndex) => {
		v.x = w(xBarrel+xBarrelSpan*colIndex);
		v.y = h(yBarrelKey);
		v.scaleToHeight(h(0.10));
	}

	this.barrelText = (v,colIndex,text) => {
		v.x = w(xBarrel+xBarrelSpan*colIndex);
		v.y = h(yBarrel);
		v.textHeight = h(0.10);
		v.text = text;
	}

	return this;
});

PanelWellbeing.Visuals = function (root) {
	console.assert( root && root.layout && root.data );
	let layout = root.layout;
	let data   = root.data;

	// everything gets a layout fun, so...
	let visuals = {};

	visuals.title   = [ new Visual.Text('white','Town Wellbeing'), (v) => layout.title(v) ];
	visuals.pointer = [ new Visual.Sprite('icons/pointer.png'), (v) => layout.pointer(v,data.worst.index) ];

	data.wbList.forEach( (wb,rowIndex) => {
		visuals[wb+'Pie']   = [ new Visual.Arc(), (v) => layout.pie(v,rowIndex,data[wb]) ];
		visuals[wb+'Issue'] = [ new Visual.Text(null,String.capitalize(wb)), (v) => layout.issue(v,rowIndex,data[wb]) ];
	});

	visuals.ba0 = [ new Visual.Sprite('icons/barrel.png'), (v) => layout.barrel(v,0) ];
	visuals.bt0 = [ new Visual.Text(), (v) => layout.barrelText(v,0,data.barrelText(0)) ];
	visuals.bk0 = [ new Visual.Sprite('icons/food.png'), (v) => layout.barrelKey(v,0) ];

	visuals.ba1 = [ new Visual.Sprite('icons/barrel.png'), (v) => layout.barrel(v,1) ];
	visuals.bt1 = [ new Visual.Text(), (v) => layout.barrelText(v,1,data.barrelText(1)) ];
	visuals.bk1 = [ new Visual.Sprite('icons/water.png'), (v) => layout.barrelKey(v,1) ];

	return visuals;
}
PanelWellbeing.Elements = function(root) {
	console.assert( root && root.visual && root.data );
	let visual	= root.visual;
	let data	= root.data;
}

return {
	PanelWellbeing: PanelWellbeing
}

});