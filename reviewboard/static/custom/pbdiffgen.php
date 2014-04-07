<?php

function verifyInput( $value, $msg='') {
  $value = trim($value);
  $value = stripslashes($value);
  $value = htmlspecialchars($value);
  if ($msg && strlen($value) == 0) {
     returnError( $msg );
  }
  return $value;
}

function returnError( $errMsg ) {
  print($errMsg);
  exit();
}

set_time_limit(200); //200 seconds

$date = date_create();

$RB_URL        = "<HOST_NAME>";
$RB_USER       = "<USER_NAME>";
$RB_PASSWORD   = "<PASSWORD>";
$RB_SUBMITBY   = "";
$RB_REPO_TYPE  = "clearcase";
$RB_REPO_NAME  = "";
$RB_BRANCH     = "";
$RB_FILENAME   = "/tmp/t".date_timestamp_get($date).".diff";


$RB_REQ_ID   = $_POST[ "reviewid"];

if( !empty( $RB_REQ_ID ) ){
$RB_SUBMITBY = verifyInput( $_POST["username"], "Required Field Missing!" );
$RB_BRANCH = verifyInput( $_POST["pbname"], "Please Provide PB Name" );
}
else{
$RB_SUBMITBY = verifyInput( $_POST["username"], "Required Field Missing!" );
$RB_REPO_NAME= verifyInput( $_POST["reponame"], "Please Select Repository" );
$RB_BRANCH   = verifyInput( $_POST["pbname"],   "Please Provide PB Name" );
}
$ListOfFiles = "cleartool find -avobs -branch 'brtype(".$RB_BRANCH.")' -print";
$ListOfFiles = shell_exec( $ListOfFiles );

if( empty( $ListOfFiles ) ){
    returnError( "Can't find any checked in file ");
}

$ListOfFiles = explode(PHP_EOL, $ListOfFiles);

/* Now we have list for file, for each file, generate diff */
foreach ( $ListOfFiles as $File ) {
    if (!empty($File)) {
        shell_exec( "diff -uN ".$File."/0 ".$File."/LATEST >> ".$RB_FILENAME." ");
    }
}

if( !empty( $RB_REQ_ID ) ){
$RB_POST = "rbt post --diff-filename=".$RB_FILENAME." --username=".$RB_USER." --password=".$RB_PASSWORD." ";
$RB_POST.= "--review-request-id=".$RB_REQ_ID." --server=".$RB_URL." ";
}
else{
$RB_POST = "rbt post --diff-filename=".$RB_FILENAME." --username=".$RB_USER." --password=".$RB_PASSWORD." ";
$RB_POST.= " --server=".$RB_URL." --repository-type=".$RB_REPO_TYPE." --repository-url=".$RB_REPO_NAME." --branch=".$RB_BRANCH." ";
}
$result = shell_exec( "cd <VOBS_LOCATION> ".$RB_POST." " );

if( !empty( $RB_FILENAME ) ){
   shell_exec( "rm ".$RB_FILENAME." " );
}

print $result;

?>
