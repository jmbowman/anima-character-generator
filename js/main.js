/*global document: false, require: false */
/**
 * Main script loaded by RequireJS to start the application.
 * @module main
 * @requires jquery
 * @requires render
 * @requires dialogs
 * @requires pubsub
 * @requires spinner
 * @requires validate
 */

require.config({
    paths: {
        bootstrap: 'libs/bootstrap.min',
        jquery: 'libs/jquery-1.9.1.min',
        pubsub: 'libs/jq.pubsub',
        validate: 'libs/jquery.validate.min'
    },
    shim: {
        bootstrap: ['jquery'],
        pubsub: ['jquery'],
        validate: ['jquery']
    }
});

require(['jquery', 'render', 'dialogs', 'pubsub', 'validate'],
function ($, render) {
    $(document).ready(function () {
        render.render($('.container'));
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
