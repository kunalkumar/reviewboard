function prepareUIFields(){
    $( "tr.row_basedir" )
        .last()
        .after(
            "<tr class=\"custom_row_pbname\" style=\"display: table-row;\"> " +
              "<td><label for=\"id_pbname\">Private Branch:</label></td>" +
                          "<td><input id=\"id_pbname\" type=\"text\" name=\"pbname\" size=\"62\">" +
              "    <input id=\"id_usepb\" type=\"button\" value=\"Use PB\"/></td>" +
              "<td></td>" +
            "</tr>");

    bindEventForPB();
}

function bindEventForPB(){
    $( "#id_usepb" )
        .bind( "click", submitPBRequest );
}

function submitPBRequest(){

   var selection = $( "#id_repository" ).get(0);
   var selectedId = selection.options[ selection.selectedIndex ].text

   $( "#id_usepb" )
                .prop( "value", "Requesting..." )
                .attr( "disable", "disable" );
                
    $( "#activity-indicator ").show();

   $.post(
       "/static/custom/pbdiffgen.php",
       { username: gUserName, reponame: selectedId, pbname : $( "#id_pbname" ).val() })
    .done(function( data ) {
                if ( data && data.indexOf( location.protocol + "//" + location.hostname ) !== -1  ){
                        location.replace( data.substring(
                    data.indexOf( location.protocol + "//" + location.hostname ), data.length - 1 ) );
                }
                else{
                        alert( "Error " + data );
                }
                $( "#id_usepb" )
                        .prop( "value", "Use PB" )
                        .removeAttr( "disabled" );
                
                 $( "#activity-indicator ").hide();
   });
}


$( function(){
    prepareUIFields();
});
