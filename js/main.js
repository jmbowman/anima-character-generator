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
        $('#XP').spinner({min: -100, max: 9999});
        $('#main_form').validate();
        $('#Gender, #Race, #first_class').change(function () { $(this).blur(); });
        render.render($('.container'));
        $('#update_display').click(render.update_display);
        $('#save_button').click(dialogs.save);
        $('#load_button').click(dialogs.load);
        $('#update_level').click(render.update_level);
        $.subscribe('cp_changed', render.update_cp);
        $.subscribe('level_data_changed', render.update_level);
        $.subscribe('data_loaded', render.load_data);
    });
});
