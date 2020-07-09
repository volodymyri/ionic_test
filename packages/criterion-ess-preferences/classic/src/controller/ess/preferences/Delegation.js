Ext.define('criterion.controller.ess.preferences.Delegation', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_preferences_delegation',

        requires : [
            'criterion.model.employee.Delegation'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        onEmployeeChange : Ext.emptyFn,

        onShow : function() {
            var me = this,
                view = this.getView(),
                vm = this.lookup('delegation').getViewModel();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_DELEGATION,
                    method : 'GET'
                }
            ).then({
                success : function(result) {
                    var record;

                    if (result) {
                        record = Ext.create('criterion.model.employee.Delegation', result);
                    } else {
                        record = Ext.create('criterion.model.employee.Delegation', {
                            delegatedByEmployeeId : me.getEmployeeId()
                        });
                    }

                    vm.set({
                        record : record,
                        enableDelegation : !record.phantom
                    });
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleSave : function() {
            var me = this,
                vm = this.lookup('delegation').getViewModel(),
                record = vm.get('record'),
                enableDelegation = vm.get('enableDelegation'),
                view = this.getView();

            if (!enableDelegation && !record.phantom) {
                record.eraseWithPromise().then(function() {
                    criterion.Utils.toast(i18n.gettext('Successfully saved.'));
                    vm.set('record', Ext.create('criterion.model.employee.Delegation', {
                        delegatedByEmployeeId : me.getEmployeeId()
                    }));
                });
            } else if (enableDelegation && view.isValid()) {
                record.saveWithPromise().then(function() {
                    criterion.Utils.toast(i18n.gettext('Successfully saved.'));
                });
            }
        }
    };
});
