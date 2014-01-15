function DatePanel(){
	
};


DatePanel.prototype.getPanel = function(data){
	var dates = new Array();
	var dataStore = new Array();
	for (i in data){
		for (date in data[i]){
			if (dates[date] == null){
				dates[date] = true;
				dataStore.push(
						{
							date : Number(date)
						}
				);
			}
		}
	}
	dataStore.sort(function(a,b){return Number(a.date)-Number(b.date);});
	this.store = Ext.create('Ext.data.Store', {
	    fields	: ['date'],
	    data	: dataStore
	});
	
	return Ext.create('Ext.grid.Panel', {
	    store: this.store,
	    columns: [
	        { text: 'date',  dataIndex: 'date', flex: 1, renderer : function(val, y, sample){ return  moment(val.toString(), "YYYYMMDD").format("Do MMM YY") } }
	    ],
	    width			: 200,
	  
		viewConfig			:{
				stripeRows	: true,
					listeners : {
					     cellclick : function( grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
							CONTROLLER.openTab(record.raw.date);
					    }
					}
			}
		});
};




function DayPlotPanel(){
	this.id = CONTROLLER.id();
	this.width = Ext.getBody().getWidth() - 200;
	this.height = Ext.getBody().getHeight() - 100;
};


DayPlotPanel.prototype.getPanel = function(data){
	var _this = this;
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'hbox'
	    },
	    flex		: 1,
	    border		: 1,
	    style		: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
	    defaults	: {
	        labelWidth	: 80,
	        xtype		: 'datefield',
	        flex		: 1,
	        style		: {
	            padding: '10px'
	        }
	    },
	    listeners : {
	        afterrender : function(thisCmp) {
	        	var biosaxsLoggerWS = new BiosaxsLogger(_this.id + '_WS', 
	        			{
	        				width 	:  (_this.width- 55),
	        				height 	:  (_this.height/4 - 30),
	        				title	: 'WebServices' 
	        			}
	        	
	        	);
	        	
	        	biosaxsLoggerWS.draw([data.WS],  3500)
	        	
	        	Ext.getCmp("south").removeAll();
	        	var stats = biosaxsLoggerWS.getStats([data.WS])
	        	var legend = biosaxsLoggerWS.createLegend(_this.id + '_WS_legend', stats );
	        	if (legend != null){
		        	Ext.getCmp("south").add( {
	                  	html: "<table>" + legend.innerHTML + "</table>"
	                  });
	        	}
	        	
	        	
	        	
	        	var biosaxsLoggerUI =  new BiosaxsLogger(_this.id + '_UI', 
	        			{
	        				width 	:  (_this.width- 55),
	        				height 	:  (_this.height/4 - 30),
	        				title	: 'WUI' 
	        			}
	        	
	        	);
	        	biosaxsLoggerUI.draw([data.UI],  3500);
	        	
	        	var legend = biosaxsLoggerUI.createLegend(_this.id + '_UI_legend', biosaxsLoggerUI.getStats([data.UI]) );
	        	if (legend != null){
		        	Ext.getCmp("south").add( {
	                  	html: "<table>" + legend.innerHTML + "</table>"
	                  });
	        	}
	        	
	        	/** mobile **/
	        	var biosaxsLoggerMOBILE = new BiosaxsLogger(_this.id + '_MOBILE', 
	        			{
	        				width 	:  (_this.width- 55),
	        				height 	:  (_this.height/4 - 30),
	        				title	: 'Mobile' 
	        			}
	        	
	        	);
	        	biosaxsLoggerMOBILE.draw([data.MOBILE],  500);
	        	
	        	var legend = biosaxsLoggerMOBILE.createLegend(_this.id + '_MOBILE_legend', biosaxsLoggerMOBILE.getStats([data.MOBILE]) );
	        	if (legend != null){
		        	Ext.getCmp("south").add( {
	                  	html: "<table>" + legend.innerHTML + "</table>"
	                  });
	        	}
	        	
	        	var biosaxsLoggerError = new BiosaxsLogger(_this.id + '_ERROR', 
	        			{
				        		width 	:  (_this.width- 55),
				        		height 	:  (_this.height/4 - 30),
				        		title	: 'Errors' 
	        			}
	        	
	        	);
	        	biosaxsLoggerError.draw([data.ERROR],  3500);
	        	
	        	var legend = biosaxsLoggerError.createLegend(_this.id + '_ERROR_legend',  biosaxsLoggerError.getStats([data.ERROR]));
	        	if (legend != null){
		        	Ext.getCmp("south").add( {
	                  	html: "<table>" + legend.innerHTML + "</table>"
	                  });
	        	}
	        	
	        	
//	        	var legend = createLegend(_this.id + '_UI_legend', getStats([data.UI]));
//	        	if (legend != null){
//	        	Ext.getCmp("south").add( {
//                  	html: "<table>" + legend.innerHTML + "</table>"
//                  })
//	        	}
//	        	var legend = createLegend(_this.id + '_ERROR_legend', getStats([data.ERROR]));
//	        	if (legend != null){
//	        	Ext.getCmp("south").add( {
//                  	html: "<table>" + legend.innerHTML + "</table>"
//                  })
//	        	}
//	        	var legend = createLegend(_this.id + '_MOBILE_legend', getStats([data.MOBILE]));
//	        	if (legend != null){
//	        	Ext.getCmp("south").add( {
//                  	html: "<table>" + legend.innerHTML + "</table>"
//                  })
//	        	}
	        	
//	        	Ext.getCmp("south").removeAll();
	    	}
	    },
	    items: [ {
		        	xtype 	: 'container',
		        	type	: 'vbox',
		        	padding	: '0 0 0 10',
		        	items	:[
								{
									html : '<div id="' + this.id + '_WS"/>',
									width : this.width,
									height : this.height/4
								},
								{
									html : '<div id="' + this.id + '_UI"/>',
									width : this.width,
									height : this.height/4
								},
								{
									html : '<div id="' + this.id + '_MOBILE"/>',
									width : this.width,
									height : this.height/4
								},
								{
									html : '<div id="' + this.id + '_ERROR"/>',
									width : this.width,
									height : this.height/4
								}
					]
        		}
        		
	    ]
	});
};