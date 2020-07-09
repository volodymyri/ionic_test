Ext.define('criterion.controller.ess.dashboard.SignForm', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_dashboard_sign_form',

        onSave : function() {
            var signaturePad = this.lookupReference('signaturePad'),
                signature = signaturePad.getValue();

            if (signature) {
                this.getView().fireEvent('save', signature);
                this.getView().close();
            } else {
                criterion.Msg.error(i18n.gettext('Please provide signature first.'));
            }
        },

        onClear : function() {
            var signaturePad = this.lookupReference('signaturePad');

            signaturePad.clear();
        },

        onCancel : function() {
            this.getView().close();
        }
    }
});