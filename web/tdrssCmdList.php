<?php
class mFile
{
    public $name, $time, $size;
}

foreach (glob("output/ANITA3/cmdSend/tdrss/*.json") as $curFilename)
{
    $curFileObj = new mFile;
    $curFileObj->name = $curFilename;
    $curFileObj->time = date("d/m/Y - H:i", filectime($curFilename));
    $curFileObj->size = filesize($curFilename);
    $fileArray[] = $curFileObj;
}
printf("%s", json_encode($fileArray));
?> 