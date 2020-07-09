Ext.define('criterion.controller.ess.preferences.TwoFA', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_preferences_2_fa',

        onShow() {
            this.lookup('qrCode').setSrc(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.PERSON_GET_QR_CODE + '?_dc=' + (+Date.now())));
        },

        getActualSeed() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            criterion.Api.request({
                url : criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.PERSON_GET_FA_SEED),
                method : 'GET',
                scope : this,
                callback : function(options, success, response) {
                    view.setLoading(false);

                    let value = Ext.decode(response.responseText);

                    vm.set('seed', value.success ? value.result : '');
                }
            });
        },

        handleEnable() {
            let view = this.getView(),
                vm = this.getViewModel(),
                totp = vm.get('totp');

            view.setLoading(true);

            criterion.Api.request({
                url : Ext.String.format(criterion.consts.Api.API.PERSON_SET_2FA_ENABLED, totp),
                method : 'GET',
                scope : this,
                callback : function(options, success, response) {
                    let value = Ext.decode(response.responseText);

                    if (value.success) {
                        criterion.Utils.toast(i18n.gettext('Enabled Successfully'));
                    } else {
                        criterion.Utils.toast(i18n.gettext('Something went wrong'));
                    }
                    view.setLoading(false);
                    view.close();
                }
            });
        },

        handle2FAImageRendered(img) {
            let me = this;

            img.getEl().dom.onload = function() {
                me.getActualSeed();
            }
        }
    };
});
