Module.add( 'panelMorale', ()=> {

let PanelMorale = {};

PanelMorale.Layout = (function(root) {

	let degAtOne  = Math.PI*0.50;
	let deg180    = Math.PI*2*0.50;
	let arcInner  = 0.12;
	let arcRadius = 0.28;
	let arcFace   = (arcInner+arcRadius) * 0.50;
	let arcIcons  = 0.36;
	let floorTip  = 0.03;

	let xCenter = ()=>root.width*0.50;
	let yCenter = ()=>root.height*0.80;
	let yFloor  = ()=>yCenter()+root.height*0.04;
	let pctToRadians = (pct) => deg180+(degAtOne*pct);
	let xHalf   = ()=>root.width * (arcRadius+floorTip);
	let arcPt   = (pct,radius) => ([
		xCenter() + Math.cos(pctToRadians(pct)) * radius * root.width,
		yCenter() + Math.sin(pctToRadians(pct)) * radius * root.width
	]);

	this.title = (v) => {
		v.x = xCenter();
		v.y = root.height * 0.08;
		v.textHeight = Math.floor(root.height * 0.08);
	}

	this.info = (v) => {
		v.x = xCenter();
		v.y = (yFloor()+root.height)*0.5;
		v.textHeight = Math.floor(root.height * 0.06);
	}

	this.iconMid = (v,startPct,endPct) => {
		[v.x,v.y] = arcPt( (startPct+endPct)*0.5, arcIcons );
		v.scaleToWidth(root.width*0.07);
	}

	this.iconFace = (v,pct) => {
		[v.x,v.y] = arcPt( pct, arcFace );
		v.scaleToWidth(root.width*0.10);
	}

	this.arc = (v,startPct,endPct)=> {
		v.x		 = xCenter();
		v.y		 = yCenter();
		v.inner  = root.width * arcInner;
		v.outer  = root.width * arcRadius;
		v.start  = pctToRadians(startPct);
		v.end    = pctToRadians(endPct);
		console.assert( Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.inner) && Number.isFinite(v.outer) && Number.isFinite(v.start) && Number.isFinite(v.end) );
		v.thickness = 2;
		v.color = '#010101';
		v.fill  = 'gray';
	}

	this.lineBase = (v) => {
		v.x  = xCenter()-xHalf();
		v.y  = yFloor();
		v.ex = xCenter()+xHalf();
		v.ey = v.y;
	}

	this.lineVert = (v) => {
		[v.x,v.y]   = arcPt(1.0,arcRadius-0.02);
		[v.ex,v.ey] = arcPt(1.0,arcRadius+0.02);
		v.thickness = 3;
	}

	return this;
});

PanelMorale.Visuals = function(root) {
	console.assert( root && root.layout && root.data );
	let layout = root.layout;
	let data   = root.data;

	// everything gets a layout fun, so...
	return {
		title:			[ new Visual.Text('white','Morale'),	(v) => layout.title(v) ],
		info:			[ new Visual.Text('white',''),			(v) => { layout.info(v); v.setText(data.info); } ],

		leadership:		[ new Visual.Sprite('icons/leadership.png'),	(v) => layout.iconMid(v,0.0,data.rot(0)) ],
		security: 		[ new Visual.Sprite('icons/security.png'),		(v) => layout.iconMid(v,data.rot(0),data.rot(1)) ],
		entertainment:	[ new Visual.Sprite('icons/entertainment.png'),	(v) => layout.iconMid(v,data.rot(1),data.rot(2)) ],
		children:		[ new Visual.Sprite('icons/child.png'),			(v) => layout.iconMid(v,data.rot(2),data.rot(3)) ],
		
		arc0:			[ new Visual.Arc(),	(v) => layout.arc(v,0.0,data.rot(0)) ],
		arc1: 			[ new Visual.Arc(),	(v) => layout.arc(v,data.rot(0),data.rot(1)) ],
		arc2:			[ new Visual.Arc(),	(v) => layout.arc(v,data.rot(1),data.rot(2)) ],
		arc3:			[ new Visual.Arc(),	(v) => layout.arc(v,data.rot(2),data.rot(3)) ],

		face0:			[ new Visual.Sprite('icons/moraleLow.png'),	(v) => layout.iconFace(v,1.0-0.70) ],
		face2:			[ new Visual.Sprite('icons/morale.png'),	(v) => layout.iconFace(v,1.0+0.70) ],

		L0:				[ new Visual.Line('white',2),	(v) => layout.lineBase(v) ],
		L1:				[ new Visual.Line('white',1),	(v) => layout.lineVert(v) ],

//		one:			[ new Visual.Text('white','1.0'),	(v) => layout.textOne(v,1.0) ],
	}
}

PanelMorale.Elements = (function(root) {
	console.assert( root && root.visual && root.data );
	let visual	= root.visual;
	let data	= root.data;

	visual.leadership.link('iconButton')
		.on('click',()=>data.leadership -= 0.1)
		.on('mouseover',()=>data.analyze('leadership'))
		.on('mouseout',()=>data.info='')
	;
	visual.security.link('iconButton')
		.on('click',()=>{ data.security -= 0.1; })
		.on('mouseover',()=>data.analyze('security'))
		.on('mouseout',()=>data.info='')
	;
	visual.entertainment.link('iconButton')
		.on('click',()=>{ data.entertainment -= 0.1; })
		.on('mouseover',()=>data.analyze('entertainment'))
		.on('mouseout',()=>data.info='')
	;
	visual.children.link('iconButton')
		.on('click',()=>{ data.children -= 0.1; })
		.on('mouseover',()=>data.analyze('children'))
		.on('mouseout',()=>data.info='')
	;
});

return {
	PanelMorale: PanelMorale
}

});
