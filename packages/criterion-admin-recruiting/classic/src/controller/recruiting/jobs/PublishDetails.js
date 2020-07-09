Ext.define('criterion.controller.recruiting.jobs.PublishDetails', function() {

    return {

        extend : 'criterion.controller.FormView',

        requires : [],

        alias : 'controller.criterion_recruiting_jobs_publish_details',

        handleClose : function() {
            this.getView().destroy();
        },

        handleCopyToClipboardClick : function(btn) {
            var textareaField = btn.up().down('textarea'),
                textareaEl = textareaField.el.query('textarea')[0];

            textareaEl.select();

            try {
                document.execCommand('copy');
                criterion.Utils.toast(i18n.gettext('URL copied to clipboard.'));
                Ext.defer(function() {
                    window.getSelection().removeAllRanges();
                }, 10);
            } catch (e) {
                criterion.Utils.toast(i18n.gettext('Current browser doesn\'t support this operation'));
            }

        }
    };
});
