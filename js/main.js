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
        render.render($('.container'));
        $('#save_button').click(dialogs.save);
        $('#load_button').click(dialogs.load);
        $('#proceed').click(render.start_attributes);
        $('#choose_essential_abilities').click(render.start_essential_abilities);
        $('#choose_characteristics').click(render.start_characteristics);
        $('#choose_advantages').click(render.start_advantages).attr('disabled', 'disabled');
        $('#choose_abilities').click(render.start_abilities).attr('disabled', 'disabled');
        $.subscribe('essential_abilities_changed', render.update_essential_abilities);
        $.subscribe('cp_changed', render.update_cp);
        $.subscribe('level_data_changed', render.update_level);
        $.subscribe('data_loaded', render.load_data);
    });
});
