(function($) { function render_map( $el ) {
    // var
    var $markers = $el.find('.marker');
    // vars
    var args = {
        mapTypeControl: false,
        navigationControl: false,
        zoom		: 11,
        center		: new google.maps.LatLng(0, 0),
        mapTypeId	: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false
    };
    // create map
    var map = new google.maps.Map( $el[0], args);
    // add a markers reference
    map.markers = [];

    // add markers
    $markers.each(function(){
        add_marker( $(this), map );
    });
    // center map
    center_map( map );
    }

    function add_marker( $marker, map ) {
    // var
    var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );

    // create marker
    var marker = new google.maps.Marker({
        position	: latlng,
        map			: map
    });

    // add to array
    map.markers.push( marker );
    // if marker contains HTML, add it to an infoWindow
    if( $marker.html() )
    {
        // create info window
        var infowindow = new google.maps.InfoWindow({
            content		: $marker.html()
        });

        // show info window when marker is clicked
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open( map, marker );
        });
    }
}

function center_map( map ) {
    // vars
    var bounds = new google.maps.LatLngBounds();

    // loop through all markers and create bounds
    $.each( map.markers, function( i, marker ){

        var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );

        bounds.extend( latlng );

    });

    // only 1 marker?
    if( map.markers.length == 1 )
    {
        // set center of map
        map.setCenter( bounds.getCenter() );
        map.setZoom( 16 );
    }
    else
    {
        // fit to bounds
        map.fitBounds( bounds );
    }
}

$(document).ready(function () {
    $('.list-map').each(function () {
        render_map( $(this) );
    });
});
})(jQuery);