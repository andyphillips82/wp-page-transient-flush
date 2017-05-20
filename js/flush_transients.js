
// This JS file ensures that a particular query string ('sourcequery'), persists on links for scores page

var WPPlugins = window.WPPlugins || {};
WPPlugins.TransientPageFlush = {

    insertButton: function() {
        var canvas = $('#debug-menu-target-Debug_Bar_Object_Cache');
        var button = $('<input class="transient_page_flush" type="button" value="Flush Page Cache"/>');
        this.button = button;
        canvas.append(button);
        this.setClickEvents();
    },

    fireApiCall: function( transients ) {
        function markedFlushed ( data ) {
            for (var property in data ) {
                $('#object-cache-stats ul li').each(function( index ) {
                    var unparsed = $( this ).text();
                    if (unparsed.indexOf(property) != -1) {
                        if (data[property]) {
                            $( this ).append('<span style="color: green; font: bold">  -- FLUSHED</span>');
                        } else {
                            $( this ).append(' <span style="color: red; font: bold">  -- DID NOT FLUSH</span>');
                        }
                    } 
                }); 
            }
        }

        $.ajax({
           url: '/wp-json/snapi/v.01/transients/delete',
           type: "POST",
           data: JSON.stringify(transients),                      
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           error: function() {

           },
           success: function( data ) {
                markedFlushed( data )
           }       
        });
    },

    setClickEvents: function() {
        var button = $('#debug-menu-target-Debug_Bar_Object_Cache .transient_page_flush');
        var that = this;
        button.on('click', function() {
            that.parseTransients();
        })
    },

    parseTransients: function() {
        var parsed_transients = [];
        $('#object-cache-stats ul li').each(function( index ) {
            var unparsed = $( this ).text();
            var start_pos = unparsed.indexOf(':') + 1;
            var end_pos = unparsed.lastIndexOf('-');
            var parsed = unparsed.substring(start_pos,end_pos).trim();
            parsed_transients.push(parsed);
        });
        this.fireApiCall(parsed_transients);  
    },  

    init: function() {
        this.insertButton();
    },   
}
setTimeout(function(){
 WPPlugins.TransientPageFlush.init()   
}, 3000);