Ext.application({
    name: 'Biosaxs Logger',
    launch: function() {
        Ext.create('Ext.container.Viewport', {
        	 layout: 'border',
        	 items: [
//	         {
//                 region		: 'north',
//                 html		: '<h1 class="x-panel-header">Biosaxs Logger</h1>',
//                 border		: false,
//                 margins	: '0 0 5 0'
//                
//             },
             {
                 region			: 'west',
                 collapsible	: true,
                 title			: 'Navigation',
                 width			: 150,
                 items 			: [
                       			   new DatePanel().getPanel([BIOSAXS_WS(), BIOSAXS_UI(), _ERROR(), BIOSAXS_MOBILE()])
                ]
             }, 
             {
                 region: 'east',
                 title: 'Stats',
                 collapsible: true,
                 items : [
                	 ],
                 split: true,
                 width: 400,
                 minWidth: 400,
                 id	: 'south'
             },
//             , {
//                 region: 'east',
//                 title: 'East Panel',
//                 collapsible: true,
//                 split: true,
//                 width: 150
//             },
             {
                 region		: 'center',
                 xtype		: 'tabpanel',
                 id			: 'tabs',
                 activeTab: 0,
                 items: {
                     title: 'Default Tab',
                     closable : true,
                     html: 'Welcome to BioSAXS logger for ISPyB'
                 }
             }]
        });
    }
});


var CONTROLLER = {
	 id : function(){
    	    var text = "";
    	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	    for( var i=0; i < 5; i++ )
    	        text += possible.charAt(Math.floor(Math.random() * possible.length));

    	    return text;
    },
    showError : function(method, cause, message){
        
        Ext.create('Ext.Window', {
            title		: 'Error  ',
            width		: 800,
            height		: 600,
            plain		: true,
            headerPosition: 'top',
            layout: 'fit',
            items: [
				{
					html : "<h3>" + method +"</h3><br/><span>" + cause +"</span><br/><br/><span>" + message +"</span>"
				}
            ]
        }).show();

    },
	openTab : function(date){
		Ext.getCmp("tabs").removeAll();
		Ext.getCmp("tabs").add({
            closable: true,
            title: moment(date.toString(), "YYYYMMDD").format("Do MMM YY"),
            items : [
            	new DayPlotPanel().getPanel({
            		WS	: BIOSAXS_WS()[date],
            		UI	: BIOSAXS_UI()[date],
            		ERROR	: _ERROR()[date],
            		MOBILE	: BIOSAXS_MOBILE()[date]
            	})
            ]
        }).show();
	}
};