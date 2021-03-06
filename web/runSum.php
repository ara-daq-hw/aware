<? 
ob_start("ob_gzhandler"); 
header("Connection: keep-alive");
?>
<!DOCTYPE html>
<html>
<head>
<link rel="StyleSheet" href="styles/jquery-ui-1.10.3.custom.min.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/aware.css" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/base.css" type="text/css" media="screen">
<link rel="StyleSheet" href="styles/help.css" type="text/css" media="screen" >
<link rel="StyleSheet" href="styles/local.css" type="text/css" media="screen" >

<title>AWARE Run Summary</title><META http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<script type="text/javascript" src="src/awareUtils.js"></script>
<script type="text/javascript" src="src/awareHk.js"></script>
<script src="src/jqueryui/js/jquery.min.js"></script>
<script src="src/jqueryui/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="src/flot/jquery.flot.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.errorbars.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.time.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.canvas.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.selection.min.js.gz"></script>
<script type="text/javascript" src="src/flot/jquery.flot.resize.min.js.gz"></script>
<script type="text/javascript">

  $(function() {
      initialiseRunSummary();
  });  

</script>
</head>



<body>


<div class="heading">
<div id="titleContainer">
<h1>AWARE Run Summary</h1>
</div>
</div>
<div class=middle>

<div id="runSummary" class="runSummary" ></div>

<div id="plot-holder-1" class="plot-holder"  >
<div id="plot-header-1" class="plot-header">
<h3>Run Summary</h3>
</div>
<div id="plot-content-1" class="plot-content" style="width:100%; height:96% ; "></div>
</div>
<div id="debugContainer"></div>

</div> 

<div class="leftBar" id="leftbar">
<?php
include("leftRun.php");
?>
</div>

<div id="openStationHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/stationHelp.php";
?>
</div>
</div>



<div id="openHkTypeHelp" class="helpDialog">
  <div>
<a href="#close" title="Close" class="close">X</a>
<?php
include "help/hkTypeHelp.php";
?>
</div>
</div>

</body></html>

