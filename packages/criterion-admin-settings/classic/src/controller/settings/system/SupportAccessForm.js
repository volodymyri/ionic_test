Ext.define('criterion.controller.settings.system.SupportAccessForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_system_support_access_form',

        handleSaveClick : function() {
            let view = this.getView();

            if (!view.isValid()) {
                return;
            }

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                method : 'POST',
                url : criterion.consts.Api.API.SUPPORT_USER_SET_EXPIRATION,
                jsonData : {
                    supportUserId : this.getRecord().getId(),
                    expireIn : this.lookup('expireIn').getValue()
                }
            }).then(() => {
                view.fireEvent('afterSave');
                view.close();
            }).otherwise(() => {
                view.setLoading(false);
            });
        }
    };

});
