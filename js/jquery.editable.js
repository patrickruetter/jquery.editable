/*!
 * Adds inline editing functionality
 *
 * Authors: Patrick Rütter, Martin Haas
 *
 * Plugin structure based on jQuery Boilerplate's Basic Plugin Boilerplate
 * (https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js)
 */

;
(function ($, window, document, undefined) {

    var pluginName = "editable",
        defaults = {
            onSave: function () {
            },
            onCancel: function () {
            }
        };

    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        currentHtml: "",
        init: function () {
            var editable = this;
            var $editableElement = $(this.element);

            $editableElement.click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                // save current content
                var html = $.trim($editableElement.html());
                this.currentHtml = html;

                // add editable controls
                var $editableControls = $('<div class="editable-controls"></div>');

                $editableElement.after($editableControls);

                var $textArea = $("<textarea>")
                    .val(html)
                    .width("100%")
                    .height($editableElement.height())
                    .keyup(function (event) {
                        if (e.keyCode == 27) { // escape key
                            editable.cancelHandler(event, editable);
                        }
                    });
                var $okButton = $("<button>")
                    .text("OK")
                    .addClass("editable-ok")
                    .click(function (event) {
                        editable.okHandler(event, editable);
                    });
                var $cancelButton = $("<button>")
                    .text("Cancel")
                    .addClass("editable-cancel")
                    .click(function (event) {
                        editable.cancelHandler(event, editable);
                    });

                $editableControls
                    .append($textArea)
                    .append($okButton)
                    .append($cancelButton);

                $editableElement.hide();

            });
        },

        okHandler: function (event, editable) {
            var $editableElement = $(editable.element);
            var $editableControls = $editableElement.next('.editable-controls');
            var $editableNewContent = $editableControls.find('textarea');

            editable.currentHtml = $editableNewContent.val();
            $editableElement.html(editable.currentHtml);
            $editableControls.remove();
            $editableElement.show();
            console.log(editable)

            editable.options.onSave();
        },

        cancelHandler: function (event, editable) {
            var $editableElement = $(editable.element);
            var $editableControls = $editableElement.next('.editable-controls');

            $editableElement.show();
            $editableControls.remove();

            editable.options.onCancel();
        }

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
