Ext.define('criterion.controller.Preferences', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_preferences',

        requires : [
            'criterion.model.person.Settings'
        ],

        onShow : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            criterion.model.person.Settings.load(criterion.Api.getCurrentPerson().id, {
                scope : this,
                success : function(record, operation, success) {
                    vm.set('record', record);
                    view.setLoading(false);
                }
            });
        },

        onSave : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                needToReload = false;

            view.setLoading(true, null);

            if (vm.get('password') && vm.get('newPassword') && (vm.get('rePassword') === vm.get('newPassword'))) {
                criterion.Api.request({
                    url : criterion.consts.Api.API.PERSON_CHANGE_PASSWORD,
                    method : 'POST',
                    jsonData : Ext.JSON.encode({
                        personId : criterion.Api.getCurrentPerson().id,
                        oldPassword : vm.get('password'),
                        newPassword : vm.get('newPassword')
                    }),
                    scope : this,
                    silent : true,
                    success : function() {
                        criterion.Utils.toast(i18n.gettext('Password successfully changed.'));
                        view.destroy();
                    },
                    failure : function(response) {
                        var resp = Ext.decode(response.responseText);

                        if (resp.code == criterion.consts.Error.RESULT_CODES.INCORRECT_OLD_PASSWORD) {
                            vm.set('oldPasswordIsCorrect', false);
                        } else {
                            criterion.Msg.error(resp.message);
                        }
                    },
                    callback : function() {
                        view.setLoading(false, null);
                    }
                });
            } else {
                record.save({
                    scope : this,
                    callback : function() {
                        if (needToReload) {
                            criterion.Msg.confirm(
                                i18n.gettext('Apply settings'),
                                i18n.gettext('You need to reload page in order to apply settings. <br>Reload Now?'),
                                function(btn, text) {
                                    if (btn == 'yes') {
                                        window.location.reload();
                                    } else {
                                        view.destroy();
                                    }
                                }
                            );
                        } else {
                            view.destroy();
                        }
                    }
                });
            }


        },

        onClose : function() {
            this.getView().destroy();
        }
    };
});
