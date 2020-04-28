Module.add( 'panelMidbar', ()=>{

let PanelMidbar = {};

PanelMidbar.Layout = (function(root) {

	let marginPct	= 0.05;
	let yTitlePct	= 0.14;
	let yFloorPct	= 0.58;
	let yInfoPct	= 0.90;
	let yMidlinePct = (yFloorPct+yTitlePct)*0.5;
	let body		= ()=> ({
		x: root.width*marginPct,
		y: root.height*yTitlePct,
		width: root.width*0.90,
		height: root.height*(yFloorPct-yTitlePct)
	});
	let xCenter		= ()=>root.width*0.50;
	let yFloor  	= ()=>root.height*yFloorPct;
	let xCol		= (colIndex)=>body().x+body().width*0.25*(colIndex+0.5);
	let yMidline	= ()=>root.height*yMidlinePct;

	this.title = (v) => {
		v.x = xCenter();
		v.y = root.height * (yTitlePct*0.5);
		v.textHeight = Math.floor(root.height * yTitlePct * 0.90);
	}

	this.info = (v) => {
		v.x = xCenter();
		v.y = root.height*(1.0+yInfoPct)*0.5;
		v.textHeight = Math.floor(root.height * (1-yInfoPct) * 0.90);
	}

	this.icon = (v,colIndex) => {
		[v.x,v.y] = [xCol(colIndex),root.height*(yFloorPct+yInfoPct)*0.5];
		v.scaleToHeight(root.height*(yInfoPct-yFloorPct)*0.50);
	}

	this.midLine = (v,index) => {
		[v.x,v.y]   = [body().x,yMidline()];
		[v.ex,v.ey] = [body().x+body().width,yMidline()];
	}

	this.leastLine = (v,pct) => {
		v.dash = [5,5];
		[v.x,v.y]   = [body().x,yMidline()+(yFloor()-yMidline())*(-pct)];
		[v.ex,v.ey] = [body().x+body().width,v.y];
	}

	this.bar = (v,colIndex,pct) => {
		v.x = xCol(colIndex);
		v.y = yMidline();
		v.yAnchor = 1.0;
		v.xScale = (body().width*0.25*0.70)/v.naturalWidth * 1.5;	// the 1.5 just makes em thicker
		v.yScale = Math.abs(yFloor()-yMidline())/v.naturalHeight*pct;
		if( Math.abs(v.yScale) <= 2 ) {
			v.yScale = 3;
			v.y += 1;
		}
 	}

	this.time = (v,colIndex,details) => {
		v.color = details.color;
		v.setText(details.text);
		[v.x,v.y] = [xCol(colIndex),root.height*(yMidlinePct+yTitlePct)*0.5];
		v.textHeight = Math.floor( root.height*0.10 );
	}


	return this;
});

PanelMidbar.Visuals = function (root) {
	console.assert( root && root.layout && root.data );
	let layout = root.layout;
	let data   = root.data;

	// everything gets a layout fun, so...
	return {
		title:		[ new Visual.Text('white','Wellbeing'), (v) => layout.title(v) ],
		info:		[ new Visual.Text('white',''), (v) => { layout.info(v); v.setText(data.info); } ],

		food:		[ new Visual.Sprite('icons/food.png'),		(v) => layout.icon(v,0) ],
		water:		[ new Visual.Sprite('icons/water.png'),		(v) => layout.icon(v,1) ],
		rest:		[ new Visual.Sprite('icons/rest.png'),		(v) => layout.icon(v,2) ],
		health:		[ new Visual.Sprite('icons/health.png'),	(v) => layout.icon(v,3) ],

		midLine:	[ new Visual.Line('gray',1),	(v) => layout.midLine(v) ],
		leastLine:	[ new Visual.Line('gray',1),	(v) => layout.leastLine(v,data.value) ],

		b0:			[ new Visual.Sprite('icons/vertBar.png'), (v) => layout.bar(v,0,data.food) ],
		b1:			[ new Visual.Sprite('icons/vertBar.png'), (v) => layout.bar(v,1,data.water) ],
		b2:			[ new Visual.Sprite('icons/vertBar.png'), (v) => layout.bar(v,2,data.rest) ],
		b3:			[ new Visual.Sprite('icons/vertBar.png'), (v) => layout.bar(v,3,data.health) ],

		timeFood:	[ new Visual.Text('white',''),	(v) => layout.time(v,0,data.time('food')) ],
		timeWater:	[ new Visual.Text('white',''),	(v) => layout.time(v,1,data.time('water')) ],
		timeRest:	[ new Visual.Text('white',''),	(v) => layout.time(v,2,data.time('rest')) ],
		timeHealth:	[ new Visual.Text('white',''),	(v) => layout.time(v,3,data.time('health')) ],

	}
}

PanelMidbar.Elements = function(root) {
	console.assert( root && root.visual && root.data );
	let visual	= root.visual;
	let data	= root.data;

	visual.food.link('iconButton')
		.on('click',()=>{ data.food -= 0.1; })
		.on('mouseover',()=>data.analyze('food'))
		.on('mouseout',()=>data.info='')
	;
	visual.water.link('iconButton')
		.on('click',()=>{})
		.on('mouseover',()=>data.analyze('water'))
		.on('mouseout',()=>data.info='')
	;
	visual.rest.link('iconButton')
		.on('click',()=>{})
		.on('mouseover',()=>data.analyze('rest'))
		.on('mouseout',()=>data.info='')
	;
	visual.health.link('iconButton')
		.on('click',()=>{})
		.on('mouseover',()=>data.analyze('health'))
		.on('mouseout',()=>data.info='')
	;
}

return {
	PanelMidbar: PanelMidbar
}

});