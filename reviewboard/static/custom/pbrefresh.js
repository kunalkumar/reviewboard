$( function(){
    $( "#upload-diff-link" ).click( addPBFields );
});

function addPBFields(){
    setTimeout( function(){
        $( "div.modalbox" )
            .find( "form" )
                .find( "table tr" )
                    .first()
                    .before(
                        "<tr>" +
                        "  <td class=\"label\"><label for=\"id_pbupdate\" class=\"required\">Private Branch:</label></td>" +
                        "  <td><input type=\"text\" name=\"pbname\" id=\"id_pbname\">" +
                        "  <input type=\"button\" id=\"id_refreshpb\" value=\"Use PB\"/></td>" +
                        "  <td><ul class=\"errorlist\" style=\"display: none;\"></ul></td>" +
                        "</tr>" );

        bindEventForPB();
    }, 1);
}

function bindEventForPB(){

    var value = $( "span#branch" ).text();

    if(  $( "#branch-value-cell") .find( "input" ).eq(0).is( ":visible" ) ){
        value =  $( "#branch-value-cell") .find( "input" ).eq(0).val();
    }

    $( "#id_pbname" ).val( value );

    $( "#id_refreshpb" )
        .click( initUpdateDiff );
}


function initUpdateDiff(){

   $( "#id_refreshpb" )
                .prop( "value", "Requesting..." )
                .attr( "disable", "disable" );

                 $( "#activity-indicator ").show();
   $.post(
       "/static/custom/pbdiffgen.php",
       { username: gUserName, reviewid: gReviewRequestId, pbname : $( "#id_pbname" ).val() })
    .done(function( data ) {
        debugger;
                if ( data && data.indexOf( location.protocol + "//" + location.hostname ) ){
                        location.replace( data.substring(
                    data.indexOf( location.protocol + "//" + location.hostname ), data.length - 1 ) );
                }
                else{
                        alert( "Error " + data );
                }
                $( "#id_refreshpb" )
                        .prop( "value", "Use PB" )
                        .removeAttr( "disabled" );
                        
                         $( "#activity-indicator ").hide();
   });
}
