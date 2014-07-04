
<div class="formDiv">
<?php
  //First up include the really static links
include("leftMain.php");
?>


<form class="runForm" id="runForm" action=" javascript:void(0);">  
<?php
 //Load the defaults
$defaults_array = parse_ini_file("config/defaultValues.ini", true);
$realDefaults = array();
foreach($defaults_array as $ignore => $properties){
  $realDefaults["instrument"]=$properties[instrument];
  $realDefaults["hkType"]=$properties[hkType];
  $realDefaults["timeType"]=$properties[timeType];
}

$instrument=$_GET["instrument"];
if($_GET["instrument"] === null) {
  $instrument=$realDefaults[instrument];
 }

$run=$_GET["run"];
if($_GET["run"] === null) {
  $run=1667; //This number is never really used
 }

$hkType=$_GET["hkType"];
if($_GET["hkType"] === null) {
  $hkType=$realDefaults[hkType];
 }
$timeType=$_GET["timeType"];
if($_GET["timeType"] === null) {
  $timeType=$realDefaults[timeType];
 }

echo "<fieldset>";     
echo "<legend>Update Plot</legend>";
///Load the instrument array config file
$inst_array = parse_ini_file("config/instrumentList.ini", true);
echo '<label>Instrument:</label> <select id="instrumentForm" >';
foreach($inst_array as $inst => $properties){
  $key=$properties[name];
  $value=$properties[title];
  $pos = strpos($instrument,$key);
  if($pos !== false) {
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }         
}
echo "</select>";
echo "<a href=\"#openStationHelp\">?</a>";
echo "<br>";

//Load the hkType array config file
$hkType_array = parse_ini_file("config/$instrument/hkTypeList.ini", true);
echo 'Hk. Type:<br> <select id="hkTypeForm">';
foreach($hkType_array as $inst => $properties){
  $key=$properties[name];
  $value=$properties[title];
  $pos = strpos($hkType,$key);
  if($pos !== false) {
  echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";
echo "<a href=\"#openHkTypeHelp\">?</a>";

echo "<br>";

echo "Plot:<br> <select id=\"plotForm\"></select>";
echo "<br>";


//Load the timeType array config file
$timeType_array = parse_ini_file("config/$instrument/timeTypeList.ini", true);
echo 'Type:<br> <select id="timeForm">';
foreach($timeType_array as $inst => $properties){
  $key=$properties[name];
  $value=$properties[title];
  $pos = strpos($timeType,$key);  
  if($pos !== false) {
    echo "<option value=$key selected=\"selected\" label=\"$value\">$value</option>";
  }
  else {
    echo "<option value=$key label=\"$value\">$value</option>";    
  }    
}
echo "</select>";
echo "<a href=\"#openTimeTypeHelp\">?</a>";
echo "<br>";
echo "</fieldset>";
echo "</form>";
echo "</div>";
echo "<div class=\"formDiv\">";
echo "<form class=\"runForm\" id=\"runForm2\" action=\" javascript:void(0);\">";
echo "<fieldset>";
echo "<legend>Run Range</legend>";
echo "<label>Start:</label>";
echo "<input type=\"number\" name=\"runInput\" id=\"runInput\" value=\"$run\" max=\"100000\" min=\"0\"  >";
?>
<div id="endRunDiv">
<label>End:</label>
<input type="number" name="endRunInput" id="endRunInput" value="" min="0" max="100000" step="1" >
</div>
</fieldset>
<div id="timeRangeDiv">
<fieldset>
<legend>Time Range</legend>
<label>Start:</label><input type="text" name="startDate" id="startDate" value="">
<label>End:</label><input type="text" name="endDate" id="endDate" value="">
<button type="button" id="setRunRange">Get Run Range</button>
</fieldset>
</div>
<div id="fullMaxDiv">
<fieldset>
<legend>Plot Points</legend>
<label>Time:</label><input type="number"id="maxTimePointsForm" value="100" step="1" >
<label>Histo:</label><input type="number"id="maxProjPointsForm" value="100" step="1" >
</fieldset>
<fieldset>
<button type="button" id="showScaleButton">Show Scale Options</button>
</fieldset>
</div>
</form>
</div>


<div id="yScaleDiv" class="formDiv" >
<form id="yScaleForm" class="scaleForm">
<fieldset>
<legend>y-axis</legend>
<ul>
<li>
<label for = "yAutoScale">Auto Scale</label>
<input type = "checkbox"
  id = "yAutoScale"
  value = "yAutoScale"
  checked>
</li>
<li>
<label>y-min:</label>
<input type="number" name="yMin" id="yMinInput" value="0" step="any" disabled> 
</li>
<li>
<label>y-max:</label>
<input type="number" name="yMax" id="yMaxInput" value="0" step="any" disabled>
</li>
</ul>
</fieldset>
</form>
</div>
<div class="formDiv" id="xScaleDiv">
<form id="xScaleForm" class="scaleForm">
<fieldset>
<legend>x-axis</legend>
<ul>
<li>
<label for = "xAutoScale">Auto Scale</label>
<input type = "checkbox"
  id = "xAutoScale"
  value = "xAutoScale"
  checked >
</li>
<li>
<label>x-min:</label>
<input type="date" name="xMinDate" id="xMinDateInput" value="" disabled>
<input type="time" name="xMinTime" id="xMinTimeInput" step="1" value="" disabled> 
</li>
<li>
<label>x-max:</label>
<input type="date" name="xMaxDate" id="xMaxDateInput" value="" disabled> 
<input type="time" name="xMaxTime" id="xMaxTimeInput" step="1" value="" disabled> 
</li>
</ul>
</fieldset>
<fieldset>
<button type="button" id="refreshButton">Refresh</button>
</fieldset>
</form>
</div>




 
