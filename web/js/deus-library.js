/**
 * Created by jpasdeloup on 27/01/16.
 */

jQuery.noConflict();

// Innitiate Main Menu
jQuery(document).ready(function() {

    var waiting = jQuery("#waiting").html();

    jQuery(".startSimu").on("click", function(e){
        e.preventDefault();
        jQuery("#snapshots").html(waiting);
        jQuery(".startSimu")
            .css('font-weight', 'normal')
            .css('text-decoration', 'none');
        jQuery(this)
            .css('font-weight', 'bold')
            .css('text-decoration', 'underline');

        jQuery.ajax({
            url: jQuery(this).attr('href')
        })
        .done(function(data){
            jQuery("#snapshots").html(data);
            if(jQuery(".startSnap").length == 1) {
                jQuery(".startSnap").click();
            }
        })
        ;
    });

    jQuery(".startSnap").live("click", function(e){
        e.preventDefault();
        jQuery("#objects").html(waiting);
        jQuery.ajax({
                url: jQuery(this).attr('href')
            })
            .done(function(data){
                jQuery("#objects").html(data);
                if(jQuery(".startObject").length == 1) {
                    jQuery(".startObject").click();
                }
            });
        jQuery.ajax({
                url: jQuery(this).attr('data-properties')
            })
            .done(function(data){
                jQuery("#geometry_properties").html(data);
            });
        jQuery(".startSnap")
            .css('font-weight', 'normal')
            .css('text-decoration', 'none');
        jQuery(this)
            .css('font-weight', 'bold')
            .css('text-decoration', 'underline');
    });

    jQuery(".startObject").live("click", function(e){
        e.preventDefault();
        jQuery("#files").html(waiting);
        jQuery.ajax({
                url: jQuery(this).attr('href')
            })
            .done(function(data){
                jQuery("#files").html(data);
            });
        jQuery(".startObject")
            .css('font-weight', 'normal')
            .css('text-decoration', 'none');
        jQuery(this)
            .css('font-weight', 'bold')
            .css('text-decoration', 'underline');
    });

    jQuery("#more_files a").live("click", function(e){
        e.preventDefault();
        jQuery("#more_files").html(waiting);
        jQuery.ajax({
                url: jQuery(this).attr('href')
            })
            .done(function(data){
                jQuery("#more_files").replaceWith(data);
            });
    });
});
