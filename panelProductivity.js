Module.add( 'panelProductivity', ()=>{

let ProductivityPanelLayout = (function(root) {

	let graphRect = () => {
		let xMargin = 0.05;
		let yMargin = 0.05;
		let wOuter = 0.95;
		let hOuter = 0.85;
		return {
			x: root.width*xMargin,
			y: root.height*((1-hOuter)+yMargin),
			width: root.width*(wOuter-xMargin*2),
			height: root.height*(hOuter-yMargin*2)
		}
	}
	let baseRect = () => {
		let g = graphRect();
		let top = (g.y+g.height)-(g.height*0.25);
		return {
			x: g.x,
			y: top,
			yMid: top + (root.height-top)*0.5,
			width: g.width*0.70,
			height: root.height-top
		}
	}

	let body = () => {
		let g = graphRect();
		let b = baseRect();
		let xSpan = b.width / 5;
		let ySpan = (g.height-b.height)*0.50;
		return {
			x: g.x,
			y: g.y,
			width: g.width,
			height: b.y-g.y,
			bottom: b.y,
			xSpan: xSpan,
			ySpan: ySpan,
			row: (rowIndex) => b.y-ySpan*rowIndex,
			col: (colIndex) => b.x + xSpan*(colIndex+0.5)
		}
	}

	this.xLegend = (e,colIndex,scale=1) => {
		e.x = body().col(colIndex);
		e.y = baseRect().yMid;
		e.scaleToWidth( Math.min(body().xSpan*0.70,baseRect().height) );
		e.scale *= scale;
	}

	this.line = (e,rowIndex) => {
		let b = body();
		e.x = b.x;
		e.y = b.row(rowIndex);
		e.ex = b.x+b.width;
		e.ey = e.y;
		return e;
	}

	this.title = (e) => {
		e.x = root.width * 0.5;
		e.y = graphRect().y * 0.5;
		e.textHeight = Math.floor(graphRect().y * 0.50);
	}

	this.yLegend = (e,rowIndex) => {
		e.xAnchor = 0;
		e.x = graphRect().x+graphRect().width + root.width*0.01;
		e.y = body().row(rowIndex)
		e.textHeight = root.height*0.07;
	}

	this.bar = (e,colIndex,xScale,floor,ceiling,useArrows=true) => {
		let image		= !useArrows ? 'icons/vertBar.png' : floor==ceiling ? 'icons/vertBar.png' : floor < ceiling ? 'icons/arrowUp.png' : 'icons/arrowDn.png';
		let yFloor		= body().row(floor);
		let yCeiling	= body().row(ceiling);
		if( yFloor == yCeiling ) {
			yFloor -= 2;
			yCeiling += 2;
		}
		e.image = image;
		e.x = body().col(colIndex);
		e.y = Math.max( yFloor, yCeiling );
		e.xScale = (root.width * 0.05)/e.naturalWidth * xScale * 1.5;	// the 1.5 just makes em thicker
		e.yScale = Math.abs(yFloor-yCeiling)/e.naturalHeight;
		e.yAnchor = 1.0;
 	}
 	return this;
});

return {
	ProductivityPanelLayout: ProductivityPanelLayout
}

})
