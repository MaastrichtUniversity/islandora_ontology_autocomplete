Drupal.behaviors.autocomplete = {
    attach: function (context, settings) {

        // Initiate autocomplete and add constructor options.
        jQuery.each(settings.autocomplete, function (i, name) {
            var container = '#edit-' + name,
                table = container + '-table';

            jQuery(table, context).once('processed', function () {

            })
        });
    }
};
