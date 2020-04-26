Module.add( 'gui', ()=> {

let Gui = {
	layout: function(layoutList) {
		Object.each( layoutList, (layout,divId) => {
			Object.each( layout, (fn,key) => {
				let me = $(divId);
				if( me.length ) {
					let value = fn($(divId));
					me[key](value);
					//console.log( 'Set '+divId+'.'+key+' = '+value );
				}
			});
		});
	}
}


return {
	Gui: Gui
}

});
