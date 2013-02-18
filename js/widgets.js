/*global define: false, document: false */
/**
 * Code for initializing widgets (modal dialogs, spinners, etc.)
 * @module widgets
 * @requires jquery
 * @requires bootstrap
 * @requires libs/spinner
 */
define(['jquery', 'bootstrap', 'libs/spinner'], function ($) {

    var widgets = {};

    /**
     * Create a modal dialog from a hidden div on the page.
     * @param {String} id The ID of the div which will be used for the dialog
     * @param {String} title The title shown for the dialog
     * @param {Number} width The dialog's preferred width in pixels (0 to use
     *     default)
     * @param {String} abort_text The label for the button to just close the
     *     dialog ('Cancel' or 'No')
     * @param {String} action_text The label for the button to perform an
     *     action ('OK', 'Yes', or undefined)
     * @param {Function} action The function to call when the action button is
     *     clicked
     */
    widgets.create_dialog = function (id, title, width, abort_text,
                                      action_text, action) {
        var button,
            div = $('#' + id),
            footer = $('<div class="modal-footer"></div>'),
            header = $('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div>'),
            primary;
        header.append($('<h4></h4>').html(title));
        div.prepend(header);
        if (action_text) {
            button = $('<a href="#" class="btn"></a>').text(action_text);
            if (action_text === 'OK') {
                primary = 'OK';
                button.addClass('btn-primary');
            }
            button.on('click', action);
            footer.append(button);
        }
        button = $('<a href="#" class="btn"></a>').text(abort_text);
        if (!primary) {
            button.addClass('btn-primary');
        }
        button.on('click', function () {
            $('#' + id).modal('hide');
            return false;
        });
        footer.append(button);
        div.append(footer);
        div.modal({
            show: false
        });
        if (width > 0) {
            div.css({
                width: function () {
                    return Math.min(width, $(document).width()) + 'px';
                },
                left: function () {
                    return ($(document).width() - Math.min(width, $(document).width())) / 2 + 'px';
                },
                margin: 'auto'
            });
        }
    };

    /**
     * Do the grunge work of setting up a Fuel UX spinner widget.
     * @param {String} selector The selector the div(s) to be turned into a
     *     spinner
     * @param {Object} options The options for the spinner widget
     */
    widgets.create_spinner = function (selector, options) {
        var buttons = '<div class="spinner-buttons btn-group btn-group-vertical"></div>',
            buttonsDiv,
            upButton = '<button class="btn spinner-up"><i class="icon-chevron-up"></i></button>',
            downButton = '<button class="btn spinner-down"><i class="icon-chevron-down"></i></button>',
            divs = $(selector),
            input = '<input type="text" class="input-mini spinner-input" />';
        divs.each(function (index, div) {
            div = $(div);
            div.append($(input));
            buttonsDiv = $(buttons);
            buttonsDiv.append($(upButton));
            buttonsDiv.append($(downButton));
            div.append(buttonsDiv);
            div.spinner(options);
        });
    };

    return widgets;
});
