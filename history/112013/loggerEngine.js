
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1, g = f, b = 0; break;
        case 1: r = q, g = 1, b = 0; break;
        case 2: r = 0, g = 1, b = f; break;
        case 3: r = 0, g = q, b = 1; break;
        case 4: r = f, g = 0, b = 1; break;
        case 5: r = 1, g = 0, b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}



function showStats( method, value, stats) {
	if (stats.counts[method] == null){
		stats.counts[method] = 1;
	}
	else{
		stats.counts[method] = stats.counts[method] + 1;
	}
	
	/** MAX **/
	if (stats.max[method] == null){
		stats.max[method] = parseFloat(value);
	}
	else{
		if (stats.max[method] < parseFloat(value)){
			stats.max[method] = parseFloat(value);
		}
	}
	
	/** MIN **/
	if (stats.minstats[method] == null){
		stats.minstats[method] = parseFloat(value);
	}
	else{
		if (stats.minstats[method] > parseFloat(value)){
			stats.minstats[method] = parseFloat(value);
		}
	}
	
	/** avg **/
	if (stats.values[method] == null){
		stats.values[method] = new Array();
	}
	stats.values[method].push(parseFloat(value));
	
	var total = 0;
	for ( var i = 0; i < stats.values[method].length; i++) {
		total = total + stats.values[method][i]; 
	}
	var avg = total;
	if (total != 0){
		avg = parseFloat(total / stats.values[method].length).toFixed(0);
		stats.avg[method] = avg;
	}
	
	/** Standard deviation **/
	var dv = 0;
	for ( var i = 0; i < stats.values[method].length; i++) {
		dv = total + Math.pow(stats.values[method][i] - avg, 2); 
	}
		
	if (dv != 0){
		dv = Math.sqrt(dv/stats.values[method].length);
	}
	
	
//	if (document.getElementById(targetId + method+ "_count") != null){
//		document.getElementById(targetId + method+ "_count").innerHTML = stats.counts[method];
//		document.getElementById(targetId + method+ "_max").innerHTML = stats.max[method] + " ms";
//		document.getElementById(targetId + method+ "_min").innerHTML = stats.minstats[method] + " ms";
//		document.getElementById(targetId + method+ "_avg").innerHTML =  avg + " ms";
//		document.getElementById(targetId + method+ "_std").innerHTML =  parseFloat(dv).toFixed(0) + " ms";
//	}
	
	
	return stats;
}

function drawZoom(title, hour, maxTime){
	var id = 'zoomPanel';
	var panel = document.getElementById(id);
	panel.innerHTML = "";

	var json = BIOSAXS_UI()[ title ];
	
	var d = document.createElement("div");
	d.setAttribute("id", id + "_viz");
	var h = document.createElement("h5");
	h.innerHTML = title;
	panel.appendChild(h);
	panel.appendChild(d);

	
	drawVisualization(title, id, json, {height:300, width:10000, maxTime: maxTime, legend:false, minRange: Number(hour) - 2, maxRange:Number(hour) +2,  scale:'1,1'})
}


    

BiosaxsLogger.prototype.notRedrawLine = function(color, height, posX){
	posX = (Math.round(posX));
	if ((this.drawObjects[color + "_" + height + "_" + posX] == null)){
		this.drawObjects[color + "_" + height + "_" + posX] = true;
		
		for(var i = 1; i < 20; i++){
			this.drawObjects[color + "_" + height + "_" + (posX + i)] = true;
			
		}
//		this.drawObjects[color + "_" + height + "_" + (posX + 2)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 3)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 4)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 5)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 5)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 6)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 7)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 8)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 9)] = true;
//		this.drawObjects[color + "_" + height + "_" + (posX + 10)] = true;
		
		return true;
	}
	console.log("not drawing");
	return false;
};

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();
	reader.onload = (function(theFile) {
	
	return function(e) {
		document.getElementById("mainPanel").innerHTML = "";
		parseFile(e.target.result, theFile.name);
      	};
      	
    })(f);
    reader.readAsText(f);
  }
}


function parseFile(content, fileName) {
  	var lines = content.split("\n");	

  	var data = new Array();
	for(var i = 0; i < lines.length; i++){
		if ((lines[i].indexOf("[STOREDATAANALYSISRESULTBYMEASUREMENTID]") != -1)||(lines[i].indexOf("[SAVEFRAME]") != -1)||(lines[i].indexOf("[CREATEEXPERIMENT]") != -1)){
			data.push([lines[i].split(" ")[0], lines[i].split(" ")[6], lines[i].split(" ")[10]]);
		}

		if (lines[i].indexOf("Exception") != -1){
			data.push([lines[i].split(" ")[0], "ERROR", lines[i]]);
		}
	}

	 fillcontent([[fileName, data]]); 
}



function BiosaxsLogger(targetId, args) {
	this.targetId = targetId;
	
	this.width = 30;
	this.height = 30;
	this.title = "None";
	
	if (args != null){
		if (args.width != null){
			this.width = args.width;
		}
		if (args.height != null){
			this.height = args.height;
		}
		if (args.title != null){
			this.title = args.title;
		}
	}
};

BiosaxsLogger.prototype.draw = function(jsons, maxTime){
	if (jsons[0] == null) return;
	/** From hashmap to array **/
	var array = new Array();
	var titles = new Array();
	
	this.methodsHash = new Object();
	this.methodsArray = new Array();
	
	for (var json in jsons){
		titles.push(json);
		array.push(jsons[json]);
		for (var record in jsons[json]){
			method =(jsons[json][record].method);
			if (this.methodsHash[method] == null ){
				this.methodsHash[method] = "color";
				this.methodsArray.push(method);
			}
		}
	}

	
	array = array.reverse().slice(0, 10);
	titles = titles.reverse().slice(0, 10);
	
	
	/** Creating the table **/
	var table = document.createElement("table");
	table.setAttribute("class", "visualization");
	table.setAttribute("id", this.targetId +"_snapshots_visualization");
	var tr = document.createElement("tr");
	var j = 0;
	table.appendChild(tr);
	document.getElementById(this.targetId).appendChild(table);
	
	for ( var j = 0; j < array.length; j++) {
		var id = this.targetId + "snapshot_visualization_" + j;
		var td = document.createElement("td");
		td.setAttribute("class", "visualization");
		td.setAttribute("id", id);
		tr.appendChild(td);
		
		var d = document.createElement("div");
		d.setAttribute("id", id + "_viz");
		d.setAttribute("class", "svg_panel");
		
		var titlediv = document.createElement("div");
		titlediv.setAttribute("class", "title_panel");
		var h = document.createElement("h4");
		titlediv.appendChild(h);
		
		h.innerHTML = this.title;
		td.appendChild(titlediv);
		td.appendChild(d);
//		td.appendChild(createLegend(id));
		this.drawVisualization([this.title], id, array[j], {height:this.height, width:this.width, maxTime: maxTime, legend:true, scale:'1,1'});
	}
};
	


BiosaxsLogger.prototype.getStats = function( loggerData, args) {
	loggerData = loggerData[0]
	if (loggerData == null) {
		var stats = new Object();
		stats.counts = new Object();
		stats.max = new Object();
		stats.minstats = new Object();
		stats.avg = new Object();
		stats.values = new Object();
		return stats;
	};
	var data = new Array();
	
	
	var stats = new Object();
	stats.counts = new Object();
	stats.max = new Object();
	stats.minstats = new Object();
	stats.avg = new Object();
	stats.values = new Object();

	for(var i = 0; i< loggerData.length; i++){
		var date = loggerData[i].time.split(",")[0].split(":");
		if (date.length < 3){
			continue;
		}
		var hour = date[0];
		var min = date[1];
		var ss = date[2];

		var method =  loggerData[i].method;
		if ((method !=  "GETEXPERIMENT")&&(method != "GETANALYSISINFORMATIONBYEXPERIMENTID")&&(method != "GETIMAGE")){	
			 stats = showStats( method, loggerData[i].duration, stats);
		}
	}
	

	return stats;
}

BiosaxsLogger.prototype.getColors = function() {
	var colors = new Object();
	var i = 0;
	for (var method in this.methodsHash){
		colors[method] = rainbow(this.methodsArray.length/2, i)
		i ++;
	}
	return colors;
};



BiosaxsLogger.prototype.drawVisualization = function(title, targetId, loggerData, args) {
	this.drawObjects = new Object();
	var maxWidth = args.width;
	var maxHeight = args.height;
	var maxTime = args.maxTime;
	
	
	var width = maxWidth;
	var height = maxHeight - 10;
	
	
    var svg = SVG.createSVGCanvas(document.getElementById( targetId + "_viz"), [ ["height", maxHeight], ["width", maxWidth], ["cursor", "pointer"]]);
    
    svg = SVG.drawGroup(svg, [["transform", "scale(" +  args.scale+ "), translate(0)"]]);
    SVG.drawLine(0, height, width, height, svg, [["stroke", "black"], ["stroke-width",1] ]);
    SVG.drawLine(0, height, 0, 0, svg, [["stroke", "black"], ["stroke-width",1] ]);

	// Drawing lines of temporal
	//15 min.
	var lines = (24*4);
	if (args.minRange != null){
		lines = (args.maxRange - args.minRange)*4; 
	}
	var spaceBetweenLines = width/lines;
   	for(var i = 0; i< lines; i++){
   		var x =  i*spaceBetweenLines;
   		SVG.drawLine(x, height, x ,height - 5, svg, [["stroke", "black"], ["stroke-width",1] ]);
   	}
   	//30mmin
	var lines = (24*2);
	var spaceBetweenLines = width/lines;
   	for(var i = 0; i< lines; i++){
   		var x =  i*spaceBetweenLines;
   		SVG.drawLine(x, height, x,height - 7, svg, [["stroke", "black"], ["stroke-width",1] ]);
   	}

    //1h
	var lines = (24);
	var spaceBetweenLines = width/lines;
   	for(var i = 0; i<= lines; i++){
   		var x =  i*spaceBetweenLines;
   		SVG.drawLine(x, height, x,height - 10, svg, [["stroke", "black"], ["stroke-width",2] ]);
   		SVG.drawText(maxWidth - x, maxHeight , i + "h", svg, [["fill", "blue"], ["font-size", "xx-small"]]);
   	}


	var data = new Array();
	var secondsPerDay = 24*60*60;    
	var maxTime = maxTime;
	
	//Axe Y
	var space = height/maxTime;
	for(var i = 1; i< 10; i++){
		var t = (maxTime/10)*i;
		var tLabel = parseFloat((maxTime/10)*(10-i)).toFixed(0) + " ms";
		SVG.drawLine(0, t*space, width,  t*space, svg, [["stroke", "gray"], ["stroke-width",0.5] ]);
		SVG.drawText(2, t*space -2, tLabel, svg, [["fill", "black"], ["font-size", "x-small"]]);
	}  


	var stats = new Object();
	stats.counts = new Object();
	stats.max = new Object();
	stats.minstats = new Object();
	stats.avg = new Object();
	stats.values = new Object();
	
	var posYdangerTime = (5000/maxTime) * height;
	SVG.drawRectangle(40, height - posYdangerTime , width, 3, svg, [["fill", "red"], ["fill-opacity", "0.4"]]);
	
	var posYdangerTime = (3000/maxTime) * height;
	SVG.drawRectangle(40, height - posYdangerTime , width, 1, svg, [["fill", "red"], ["fill-opacity", "0.4"]]);
	
	/** Massive methods **/
	var massiveMethods = new Object();
	massiveMethods["GETEXPERIMENT"] = true;
	massiveMethods["GETANALYSISINFORMATIONBYEXPERIMENTID"] = true;
	massiveMethods["GETIMAGE"] = true;
	
	/** First massive methods **/
	for(var i = 0; i< loggerData.length; i++){
		var date = loggerData[i].time.split(",")[0].split(":");
		if (date.length < 3){
			continue;
		}
		var hour = date[0];
		var min = date[1];
		var ss = date[2];
		var method =  loggerData[i].method;
		if (massiveMethods[method] != null){	
			var toSeconds = parseFloat(hour*60*60) + parseFloat(min*60) + parseFloat(ss);
			var posX = maxWidth - (toSeconds/secondsPerDay)*width;
			var posY = (loggerData[i].duration/maxTime) * height;
			
			if ((method.indexOf("SETEXPERIMENTABORTED") != -1)){
				var translate = "translate("+ posX + "," + 10 + "), rotate(360)";
				SVG.drawLine(posX, 0 , posX, height, svg, [["stroke", this.getColors()[method]], ["stroke-width",1], ["fill-opacity", 0.15 ] ]);
				SVG.drawText(0,0, "Aborted", svg, [["fill", this.getColors()[method]], ["font-size", "10px"], ["transform",translate]]);
			}
			else{
				if (this.notRedrawLine(this.getColors()[method], height, posX)){
					SVG.drawLine(posX, height - posY , posX, height, svg, [["stroke", this.getColors()[method]], ["stroke-width",1], ["stroke-opacity", 0.15] ]);
				}
			}
		}
	}
	
	var logonVerticalHigh = 1;
	for(var i = 0; i< loggerData.length; i++){
		var date = loggerData[i].time.split(",")[0].split(":");
		if (date.length < 3){
			continue;
		}
		var hour = date[0];
		var min = date[1];
		var ss = date[2];

		var method =  loggerData[i].method;
		
		if (massiveMethods[method] == null){	
			var toSeconds = parseFloat(hour*60*60) + parseFloat(min*60) + parseFloat(ss);
			var posX = maxWidth - (toSeconds/secondsPerDay)*width;
			var posY = (loggerData[i].duration/maxTime) * height;
			
			
			if ((method.indexOf("logon") != -1)){
				var user = JSON.parse(loggerData[i].user);
				if ((user.proposalType.trim() == "MB")||(user.proposalType.trim() == "BX")){
					var y  = 10 + ((height - 10)/16)*(logonVerticalHigh%16);//height; //200 - ((logonVerticalHigh%16))*15 ;
					SVG.drawLine(posX, y , posX, height, svg, [["stroke", 'green'], ["stroke-width",1], ["opacity", 0.3 ] ]);
					var transform = ["transform", "translate(" + posX +", " +  y + "), rotate(0) "];
					var properties = new Array();
					properties.push(transform);
					properties.push(["style", 'font-size: 11; fill:green']);
					SVG.drawText(0, 0, ">" + user.user, svg, properties);
					logonVerticalHigh = logonVerticalHigh + 1;
					
				}
				continue;
				//SVG.drawText(0,0, "Aborted", svg, [["fill", this.getColors()[method]], ["font-size", "10px"], ["transform",translate]]);
				
			}
			if ((method.indexOf("Logoff") != -1)){
				var user = JSON.parse(loggerData[i].user);
				//if ((user.proposalType.trim() == "MB")||(user.proposalType.trim() == "BX")){
//					SVG.drawLine(posX, 0 , posX, height, svg, [["stroke", 'blue'], ["stroke-width",1], ["fill-opacity", 0.15 ] ]);
					var y  = 125 - ((logonVerticalHigh%8))*25 + 45;
					var transform = ["transform", "translate(" + posX +", " +  y + "), rotate(0) "];
					var properties = new Array();
					properties.push(transform);
					properties.push(["style", 'font-size: 11; fill:red']);
//					SVG.drawText(0, 0, ">" + user.user, svg, properties);
					logonVerticalHigh = logonVerticalHigh + 1;
					
				//}
				continue;
			}
			
			if (loggerData[i].duration != -1){
				if ((method.indexOf("SETEXPERIMENTABORTED") != -1)){
					var translate = "translate("+ posX + "," + 10 + "), rotate(360)";
					SVG.drawLine(posX, 0 , posX, height, svg, [["stroke", this.getColors()[method]], ["stroke-width",1], ["fill-opacity", 1 ] ]);
					SVG.drawText(0,0, "Aborted", svg, [["fill", this.getColors()[method]], ["font-size", "10px"], ["transform",translate]]);
					
				}
				else{
					if (this.notRedrawLine(this.getColors()[method], height, posX)){
						SVG.drawLine(posX, height - posY , posX, height, svg, [["stroke", this.getColors()[method]], ["stroke-width",1], ["stroke-opacity", 1] ]);
					}
				}
			}
			else{
				if (this.notRedrawLine("red", height, posX)){
					SVG.drawCircle(posX,  50, 3, svg, [["stroke", "red"], ["stroke-width",1], ["stroke-opacity", 1], ["onclick", "CONTROLLER.showError('" + method + "','"+ loggerData[i].cause + "','" + loggerData[i].message +"')"] ]);
				}
			}
		}
	}
};






BiosaxsLogger.prototype.createLegend = function(id, stats) {
	var legend = document.createElement("table");
	legend.setAttribute("class", "legend");
	
	var row = document.createElement("tr");
	
	var column = document.createElement("th");
	column.appendChild(document.createTextNode("Method"));
	row.appendChild(column);
	
	column = document.createElement("th");
	column.setAttribute("style", "width:50px")
	column.appendChild(document.createTextNode("Count "));
	row.appendChild(column);
	
	column = document.createElement("th");
	column.appendChild(document.createTextNode("Max"));
	column.setAttribute("style", "width:50px")
	row.appendChild(column);
	
	column = document.createElement("th");
	column.appendChild(document.createTextNode("Min"));
	column.setAttribute("style", "width:50px")
	column.setAttribute("id",  id + "_min");
	row.appendChild(column);
	
	column = document.createElement("th");
	column.appendChild(document.createTextNode("Mean"));
	column.setAttribute("style", "width:50px")
	column.setAttribute("id",  id + "_min");
	row.appendChild(column);
//	
//	column = document.createElement("th");
//	column.appendChild(document.createTextNode("Std Deviation"));
//	column.setAttribute("id",  id + "_std");
//	row.appendChild(column);
//	row.appendChild(column);

	legend.appendChild(row);
	if (stats == null) return;
	for (var color in this.getColors()){
		if (stats.counts[color] == null){
			stats.counts[color] = "NA";
		}
		if (stats.max[color] == null){
			stats.max[color] = "NA";
		}
		
		if (stats.minstats[color] == null){
			stats.minstats[color] = "NA";
		}
		
		if (stats.avg[color] == null){
			stats.avg[color] = "";
		}
//		
//		if (stats.stv  != null){
//			if (stats.stv[color] == null){
//				stats.stv[color] = "";
//			}
//		}
//		else{
//			stats.stv = new Object();
//			stats.stv[color] = "";
//		}
		
		var row = document.createElement("tr");
		/** Color **/
		var column = document.createElement("td");
		column.setAttribute("class", "legend");
		column.setAttribute("style", "color:" + this.getColors()[color]);
		column.appendChild(document.createTextNode(color));
		
		row.appendChild(column);
		
		/** Count **/
		column = document.createElement("td");
		column.setAttribute("class", "legend");
		column.appendChild(document.createTextNode(stats.counts[color]));

		//		column.setAttribute("id",  id + color + "_count");
		row.appendChild(column);
		
		/** Max **/
		column = document.createElement("td");
		column.setAttribute("class", "legend");
		column.appendChild(document.createTextNode(stats.max[color]));
		column.setAttribute("id",  id  + color + "_max");
		row.appendChild(column);
		
		/** Min **/
		column = document.createElement("td");
		column.setAttribute("class", "legend");
		column.appendChild(document.createTextNode(stats.minstats[color]));
		column.setAttribute("id",  id  + color + "_min");
		row.appendChild(column);
		
		/** Avg **/
		column = document.createElement("td");
		column.setAttribute("class", "legend");
		column.appendChild(document.createTextNode(stats.avg[color]));
		column.setAttribute("id",  id  + color + "_avg");
		row.appendChild(column);
//		
//		
//		/** Std **/
//		column = document.createElement("td");
//		column.setAttribute("class", "legend");
//		column.appendChild(document.createTextNode(stats.stv[color]));
//		column.setAttribute("id",  id  + color + "_std");
//		row.appendChild(column);
		
		legend.appendChild(row);
	} 
	return legend;
}
