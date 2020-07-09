Ext.define('criterion.ux.form.trigger.Copy', {

    extend : 'criterion.ux.form.trigger.Clear',
    alias : 'trigger.copy',

    handler : function(cmp) {
        cmp.inputEl.dom.select && cmp.inputEl.dom.select();

        try {
            var copied = document.execCommand('copy');

            if (copied) {
                criterion.Utils.toast(i18n.gettext('Copied to clipboard'));
            }
        } catch (e) {}
    }

});
