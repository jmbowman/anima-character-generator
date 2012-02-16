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
        $('#add_xp').hide();
        $('.characteristic, #Appearance').change(render.update_basics);
        $('#main_form').validate();
        $('input.characteristic, #Appearance, #Gender, #Race, #first_class, #XP').nextAll('span.display').hide();
        $('#Gender, #Race, #first_class').change(function () { $(this).blur(); render.update_basics(); });
        $('#Name').change(render.update_name);
        render.render($('.container'));
        $('#choose_advantages').click(render.start_advantages).attr('disabled', 'disabled');
        $('#save_button').click(dialogs.save);
        $('#load_button').click(dialogs.load);
        $('#choose_abilities').click(render.start_abilities).attr('disabled', 'disabled');
        $.subscribe('cp_changed', render.update_cp);
        $.subscribe('level_data_changed', render.update_level);
        $.subscribe('data_loaded', render.load_data);
    });
});
