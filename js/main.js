/*global document: false, require: false */
require({
    paths: {
        jqueryui: 'libs/jqueryui',
        pubsub: 'libs/jq.pubsub',
        spinner: 'libs/ui.spinner.min',
        validate: 'libs/jquery.validate.min'
    }
}, ['jquery', 'dialogs', 'render', 'pubsub', 'spinner', 'validate'], function ($, dialogs, render) {
    $(document).ready(function () {
        $('label').parent().addClass('label-parent');
        $('.characteristic').spinner({min: 4, max: 10});
        $('#Appearance').spinner({min: 1, max: 10});
        $('#XP').spinner({min: -1, max: 9999});
        $('form').validate();
        render.render($('.container'));
        $('#update_display').click(render.update_display);
        $('#update_level').click(render.update_level);
        $.subscribe('cp_changed', render.update_cp);
        $.subscribe('level_data_changed', render.update_level);
    });
});
