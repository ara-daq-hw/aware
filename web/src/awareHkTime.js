//////////////////////////////////////////////////////////////////////////////
/////                                                                    /////
/////   awareHkTime.js                                                   /////
/////                                                                    /////
/////   Simple javascript for getting housekeeping data in JSON format   /////
/////   and plotting using the flot library.                             /////
/////                                                                    /////
/////   March 2013, r.nichol@ucl.ac.uk                                   /////
//////////////////////////////////////////////////////////////////////////////



/* Globals */
var thisHkType;
var globCanName;
var thisTimeType;
var instrumentName;
var startRun;
var endRun;
var year=2013;
var datecode=123;
var timesWaited=0;
var plotName;
var plotLabel;
var startTime;
var duration;

var timeList;// = new Array();
var varList;
var datasets = new Object();
    
var timeArray=[];


///Here are the UI thingies
function getStartRunFromForm() {
    startRun=document.getElementById("runInput").value;
    return startRun;
} 

function setStartRunOnForm(thisRun) {
    startRun=thisRun;
    document.getElementById("runInput").value=thisRun;
} 

function getEndRunFromForm() {
    endRun=document.getElementById("endRunInput").value;
    return endRun;
} 


function setEndRunOnForm(thisRun) {
    endRun=thisRun;
    document.getElementById("endRunInput").value=thisRun;
} 

function getNextStartRun(nextFunction) {
    startRun=document.getElementById("runInput").value;
    startRun++;
    document.getElementById("runInput").value=startRun;
    nextFunction();
}

function getPreviousStartRun(nextFunction) {
    startRun=document.getElementById("runInput").value;
    startRun--;
    document.getElementById("runInput").value=startRun;
    nextFunction();
}

function getNextEndRun(nextFunction) {
    endRun=document.getElementById("endRunInput").value;
    endRun++;
    document.getElementById("endRunInput").value=endRun;
    nextFunction();
}

function getPreviousEndRun(nextFunction) {
    endRun=document.getElementById("endRunInput").value;
    endRun--;
    document.getElementById("endRunInput").value=endRun;
    nextFunction();
}


function getInstrumentNameFromForm() {
    instrumentName=document.getElementById("instrumentForm").value;
    return instrumentName;
}

function getPlotNameFromForm() {
    plotName=document.getElementById("plotForm").value;
    plotLabel=document.getElementById("plotForm").label;
    return plotName;
}


function setHkTypeAndCanName(hkType,canName,timeType) {
    thisHkType=hkType;
    globCanName=canName;
    thisTimeType=timeType;
}

function updateTimeType(timeType) {
    thisTimeType=timeType;
}

function updateTimeTypeFromForm() {
    thisTimeType=document.getElementById("timeForm").value;

}


function fillFullTimeArray(jsonObject) {
    for(var index=0;index<jsonObject.full.timeList.length;index++) {
	var timePoint=jsonObject.full.timeList[index];
	timeArray.push(timePoint*1000); ///< Javascript needs the number in milliseconds
    }
}


function addFullVariableToDataset(jsonObject) {
    
//    var canContainer = $("#titleContainer"); 

    var varPoint=jsonObject.full;
    var varName=varPoint.name;
    var dataList = new Object();
    dataList.label=varPoint.label;
    dataList.data= new Array();

//    canContainer.append("<p>");
    var varTimeList=varPoint.timeList;	    
    for(var index=0;index<varTimeList.length;index++) {
	var dataPoint=varTimeList[index];
	dataList.data.push([timeArray[index],dataPoint,0]); ///< No stdDev for full files
//	canContainer.append("{"+timeArray[index]+","+dataPoint+"},");
    }
//    canContainer.append("</p>");
    datasets[ varName ]=dataList;

}


function drawSimpleHkTime(varNameKey) {
    for(var index=0;index<timeList.length;index++) {
	var timePoint=timeList[index];
	timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
    }

    
    for(var varIndex=0;varIndex<varList.length;varIndex++) {
	var varPoint=varList[varIndex];
	var varName = new String(varPoint.name);
	var varLabel = new String(varPoint.label);
	//	document.write(varName+"<br>");
	if(varName.indexOf(varNameKey)>=0) {
	    //	    document.write(varNameKey);
	    ///Got a variable
	    var dataList = new Object();
	    dataList.label=varLabel;
	    dataList.data= new Array();
	    
	    var varTimeList=varPoint.timeList;	    
	    for(var index=0;index<varTimeList.length;index++) {
		var dataPoint=varTimeList[index];
		dataList.data.push([timeArray[index],dataPoint.mean,dataPoint.stdDev]); ///< Need to add stdDev
	    }
	    datasets[ varName ]=dataList;
	}
	
    }


//    var canContainer = $("#titleContainer"); 
//    canContainer.append("<p>In drawSimpleHkTime</p>");

    actuallyDrawTheStuff();
}


function actuallyDrawTheStuff() {
    var i = 0;
    $.each(datasets, function(key, val) {
	val.color = i;
//	var point={ show: true, radius: 0,  errorbars: "y", yerr: {show:true}  }
//	val.points = point;
	++i;
    });
    
    var canContainer = $("#titleContainer"); 
    canContainer.append("<p>The plot has "+timeArray.length+" time points</p>");

    var plotCan=$("#"+globCanName);
    // insert checkboxes 
    var countNum=0;
    var choiceContainer = $("#choices");
    $.each(datasets, function(key, val) {
	       if(countNum%4==0) {
		   choiceContainer.append("<br />");
	       }
	       choiceContainer.append("<input type='checkbox' name='" + key +
				      "' checked='checked' id='id" + key + "'></input>" +
				      "<label for='id" + key + "'>"
				      + val.label + "</label>");
	       countNum++;
	   });
    
    choiceContainer.find("input").click(plotAccordingToChoices);

    var options = {
	yaxis: { },
	xaxis: {mode: "time"},
	lines: { show: false },
	points: { show: true },
	legend:{container: $("#divLabel")},
	selection : { mode : "xy" }
    }
    var plot;	

    function plotAccordingToChoices() {

	var data = [];

	choiceContainer.find("input:checked").each(function () {
	    var key = $(this).attr("name");
	    if (key && datasets[key]) {
		data.push(datasets[key]);
	    }
	});
	
	if (data.length > 0) {
	    plot=$.plot(plotCan, data, options);
	}

    }
    
    
    plotCan.bind("plotselected", function (event, ranges) {
	options.xaxis.min=ranges.xaxis.from;
	options.xaxis.max=ranges.xaxis.to;
	options.yaxis.min=ranges.yaxis.from;
	options.yaxis.max=ranges.yaxis.to;
	plotAccordingToChoices();
    });

    plotCan.bind("plotunselected", function (event, ranges) {
	var newxaxis= { mode: "time"};
	options.xaxis = newxaxis;
	var newyaxis = {};
	options.yaxis=newyaxis;
	plotAccordingToChoices();
    });
	
  

    plotAccordingToChoices();


}


function setTimeAndVarList(jsonObject) {
    timeList=jsonObject.timeSum.timeList;
    varList=jsonObject.timeSum.varList;
}

function drawSimpleHkTimePlot() {
    getRunInstrumentDateAndPlot(simpleHkPlotDrawer);
}

function updatePlotTitle(jsonObject) {
    //Also update the page URL
    var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
    //    var currentUrl = window.location.href;
    currentUrl=currentUrl+"?run="+startRun+"&endrun="+endRun+"&instrument="+instrumentName+"&plot="+plotName+"&timeType="+thisTimeType+"&hkType="+thisHkType;
    var stateObj = { foo: "bar" };
    history.replaceState(stateObj, "page 2", currentUrl);

    var canContainer = $("#titleContainer"); 
    canContainer.empty();
    canContainer.append("<h1>"+instrumentName+" -- Run "+startRun+"</h1>");
    canContainer.append("<h2> Start Time "+jsonObject.timeSum.startTime+"</h2>");
    canContainer.append("<h2> Plot "+plotName+"</h2>");
    
}

function handleAjaxFileError(jqXHR, exception) {
    
    var canContainer = $("#titleContainer"); 
    if (jqXHR.status === 0) {
        canContainer.append('Not connect.\n Verify Network.');
    } else if (jqXHR.status == 404) {
        canContainer.append('Requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        canContainer.append('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        canContainer.append('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        canContainer.append('Time out error.');
    } else if (exception === 'abort') {
            canContainer.append('Ajax request aborted.');
    } else {
        canContainer.append('Uncaught Error.\n' + jqXHR.responseText);
    }
}


function simpleHkPlotDrawer() {
    var simpleHkTimeUrl=getHkTimeName(instrumentName,startRun,year,datecode,thisHkType);

    function handleHkTimeJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject);
	datasets = new Object();	
	var choiceContainer = $("#choices");
	choiceContainer.empty();
	
	//Set the time and var list
	setTimeAndVarList(jsonObject);

	//Actual do the drawing
	drawSimpleHkTime(plotName);
    }


    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json", 
	success: handleHkTimeJsonFile,
	error: handleAjaxFileError
    }); 
    
}


function drawFullHkTimePlot() {
    getRunInstrumentDateAndPlot(fullHkPlotDrawer);
}

function fullHkPlotDrawer() {
    var simpleHkTimeUrl=getHkTimeName(instrumentName,startRun,year,datecode,thisHkType);

    function handleHkTimeJsonFile(jsonObject) {
	//Preparation by emptying things and writing labels
	updatePlotTitle(jsonObject);
	var choiceContainer = $("#choices");
	choiceContainer.empty();
	
	//Set the time and var list
	setTimeAndVarList(jsonObject);

	//Actual do the drawing
	fetchFullHkTime(plotName);
    }

    $.ajax({
	url: simpleHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleHkTimeJsonFile,
	error: handleAjaxFileError
    }); 
    
}


function fetchFullHkTime(varNameKey) {
    

//    var canContainer = $("#titleContainer"); 
    var fullHkTimeUrl=getFullHkTimeName(instrumentName,startRun,year,datecode,thisHkType);
//    canContainer.append("<p>"+fullHkTimeUrl+"</p>");
    

    var countFilesNeeded=0;
    function handleFullHkTimeJsonFile(jsonObject) { 
	///First step is fill the full time list
	fillFullTimeArray(jsonObject);
//	canContainer.append("<p>"+timeArray.length+"</p>");

	for(var varIndex=0;varIndex<varList.length;varIndex++) {
	    var varPoint=varList[varIndex];
	    var varName = new String(varPoint.name);
	    var varLabel = new String(varPoint.label);
	    if(varName.indexOf(varNameKey)>=0) {
		var fullHkUrl=getFullHkName(instrumentName,startRun,year,datecode,varName,thisHkType);
//		canContainer.append("<p>"+fullHkUrl+"</p>");	
		countFilesNeeded++;

		$.ajax({
		    url: fullHkUrl,
		    type: "GET",
		    dataType: "json",
		    success: handleFullHkJsonFile,
		    error: handleFullHkError
		}); 
	
	    }	
	}
    }

    var countFilesGot=0;
    function handleFullHkError() {
	countFilesGot++; ///For now will just do this silly thing	
	if(countFilesNeeded==countFilesGot) {

//	    var canContainer = $("#titleContainer"); 
//	    canContainer.append("<p>In handleFullHkError</p>");
	    actuallyDrawTheStuff();
	}
    }

    function handleFullHkJsonFile(jsonObject) { 
	countFilesGot++;
	addFullVariableToDataset(jsonObject);
//	canContainer.append("<p>"+countFilesNeeded+ "    "+countFilesGot+"</p>");	
	if(countFilesNeeded==countFilesGot) {
//	    var canContainer = $("#titleContainer"); 
//	    canContainer.append("<p>In handleFullHkJsonFile</p>");
	    actuallyDrawTheStuff();
	}
	
    }


    $.ajax({
	url: fullHkTimeUrl,
	type: "GET",
	dataType: "json",
	success: handleFullHkTimeJsonFile,
	error: handleAjaxFileError
    }); 
}


function getRunInstrumentDateAndPlot(plotFunc) {
    startRun=getStartRunFromForm();
    plotName=getPlotNameFromForm();    
    instrumentName=getInstrumentNameFromForm();
    var runListFile=getRunListName(instrumentName,startRun);
    function handleRunList(jsonObject) {
	var gotRun=0;
	for(var i=0;i<jsonObject.runList.length;i++) {
	    if(jsonObject.runList[i][0]==startRun) {
		year=jsonObject.runList[i][1];
		datecode=jsonObject.runList[i][2]; ///RJN need to zero pad the string
		gotRun=1;
		plotFunc();
		break;
	    }
	}
	if(gotRun==0 && thisTimeType.indexOf("simple")>=0) {
	    var plotCan=$("#"+globCanName);
	    plotCan.empty();
	    plotCan.append("<h2>Don't have data for run "+startRun+"</h2>");
	}
	
    }
    

    $.ajax({
	url: runListFile,
	type: "GET",
	dataType: "json",
	success: handleRunList,
	error: handleAjaxFileError
    });
}


function doMultiRunPlot() {
    
    plotName=getPlotNameFromForm();    
    instrumentName=getInstrumentNameFromForm();
    startRun=getStartRunFromForm();
    endRun=getEndRunFromForm();
    if(endRun<=startRun) {
	return drawSimpleHkTimePlot();	
    }


    var lastRunListFile;

    var countFilesNeeded=0;
    for(var thisRun=startRun;thisRun<=endRun;thisRun++) {	
	var runListFile=getRunListName(instrumentName,thisRun);
	
	function handleRunList(jsonObject) {
	    for(var i=0;i<jsonObject.runList.length;i++) {
		if(jsonObject.runList[i][0]>=startRun && jsonObject.runList[i][0]<=endRun) {
		    year=jsonObject.runList[i][1];
		    datecode=jsonObject.runList[i][2]; ///RJN need to zero pad the string  	    
		    var hkFileName=getHkTimeName(instrumentName,jsonObject.runList[i][0],year,datecode,thisHkType);
		    countFilesNeeded++;		
	
		    $.ajax({
			url: hkFileName,
			type: "GET",
			dataType: "json",
			success: addHkTimeFileToArrays,
			error: errorHkTimeFile
		    });
		    //Get simple hk files
		    //Add to some arrays
		    //Fill variables for plot   		    
		}
	    }
	}
	if(runListFile!=lastRunListFile) {
//	    canContainer.append("<p>"+runListFile+"</p>");
	    $.ajax({
		url: runListFile,
		type: "GET",
		dataType: "json",
		success: handleRunList
	    });
	}
	lastRunListFile=runListFile;
    }

    var countFilesGot=0;
    function errorHkTimeFile() {
	countFilesGot++;
	if(countFilesNeeded==countFilesGot) {
	    //	    canContainer.append("<p>"+countFilesNeeded+"  "+countFilesGot+"</p>");

//	    var canContainer = $("#titleContainer"); 
//	    canContainer.append("<p>In errorHkTimeFile</p>");
	    actuallyDrawTheStuff();
	}
    }

    function addHkTimeFileToArrays(jsonObject) {
	countFilesGot++;
	if(countFilesGot==1) updatePlotTitle(jsonObject);
	var varNameKey=plotName;
	var timeList=jsonObject.timeSum.timeList;
	var tempTimeArray = new Array();
	var varList=jsonObject.timeSum.varList;
	for(var index=0;index<timeList.length;index++) {
	    var timePoint=timeList[index];
	    timeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
	    tempTimeArray.push(timePoint.startTime*1000); ///< Javascript needs the number in milliseconds
	    //	    canContainer.append("<p>"+timeArray[timeArray.length-1]+"</p>")
	}

	//	canContainer.append("<p>"+countFilesGot+"</p>");
	//	canContainer.append("<p>"+timeArray.length+" "+tempTimeArray.length+"</p>");

	
	for(var varIndex=0;varIndex<varList.length;varIndex++) {
	    var varPoint=varList[varIndex];
	    var varName = new String(varPoint.name);
	    var varLabel = new String(varPoint.label);
	    //	document.write(varName+"<br>");
	    if(varName.indexOf(varNameKey)>=0) {
		if(varName in datasets) {
		//		canContainer.append("<p>Got"+varName+"</p>");
		}
		else {
		    //	    document.write(varNameKey);
		    ///Got a variable
		    var dataSetsIndex=$.inArray(varName, datasets);
		    //		canContainer.append("<p>Not got"+varName+"</p>");
		    if(dataSetsIndex<0) {
			
			var dataList = new Object();
			dataList.label=varLabel;
			dataList.data= new Array();
			
			
			datasets[varName]=dataList;
		    }
		}
	    
		var varTimeList=varPoint.timeList;	    
		for(var index=0;index<varTimeList.length;index++) {
		    var dataPoint=varTimeList[index];
		    datasets[varName].data.push([tempTimeArray[index],dataPoint.mean,dataPoint.stdDev]); ///< Need to add stdDev 
		    //		    canContainer.append("<p>"+index+" "+tempTimeArray[index]+" "+dataPoint.mean+"</p>");
		}
	    
	    //	    canContainer.append("<p>"+varName+" "+datasets[varName].data.length+" "+timeList.length+"</p>");
	    
	    }
	}
	
	if(countFilesNeeded==countFilesGot) {
	    //	    canContainer.append("<p>"+countFilesNeeded+"  "+countFilesGot+"</p>");

//	    var canContainer = $("#titleContainer"); 
//	    canContainer.append("<p>In addHkTimeFileToArrays</p>");
	    actuallyDrawTheStuff();
	}
    }

}





function drawPlot() {   
    timeArray.length=0;
    var plotCan=$("#"+globCanName);
    var choiceContainer = $("#choices");
    var labelContainer= $("#divLabel");
    var titleContainer=$("#titleContainer"); 
    titleContainer.empty();
    plotCan.empty();
    plotCan.append("<h2>Loading</h2>");
    choiceContainer.empty();
    labelContainer.empty();
    datasets = new Object();

    if(thisTimeType.indexOf("simple")>=0) drawSimpleHkTimePlot();
    else if(thisTimeType.indexOf("full")>=0) drawFullHkTimePlot();
    else if(thisTimeType.indexOf("multiRun")>=0) doMultiRunPlot();
	    
}

