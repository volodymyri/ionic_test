Ext.define('criterion.controller.ess.preferences.TeamDelegation', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_preferences_team_delegation',

        requires : [
            'criterion.model.employee.subordinate.Delegation',
            'criterion.store.employee.subordinate.TeamMembers'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        onEmployeeChange : Ext.emptyFn,

        handleSearchEmployee : function() {
            var picker,
                vm = this.getViewModel();

            picker = Ext.create('criterion.view.employee.EmployeePicker', {
                isActive : true,
                employerId : this.getEmployerId(),
                columns : [
                    {
                        text : i18n.gettext('Last Name'),
                        dataIndex : 'lastName',
                        flex : 1,
                        filter : true
                    },
                    {
                        text : i18n.gettext('First Name'),
                        dataIndex : 'firstName',
                        flex : 1,
                        filter : true
                    },
                    {
                        text : i18n.gettext('Employee Number'),
                        dataIndex : 'employeeNumber',
                        flex : 1
                    },
                    {
                        text : i18n.gettext('Hire Date'),
                        dataIndex : 'hireDate',
                        renderer : Ext.util.Format.dateRenderer(criterion.consts.Api.DATE_FORMAT),
                        flex : 1
                    },
                    {
                        text : i18n.gettext('Title'),
                        dataIndex : 'positionTitle',
                        flex : 1,
                        filter : true
                    }
                ],
                storeClass : 'criterion.store.employee.subordinate.TeamMembers'
            });

            picker.show();
            picker.on('select', function(employeeRecord) {
                var employeeId = employeeRecord.get('employeeId');

                vm.set({
                    delegatedByEmployeeId : employeeId,
                    delegatedByEmployeeName : employeeRecord.get('employeeName')
                });

                this.loadEmployeeDelegation(employeeId);
            }, this)
        },

        loadEmployeeDelegation : function(employeeId) {
            var view = this.getView(),
                vm = this.lookup('delegation').getViewModel();

            view.setLoading(true);

            vm.set({
                record : null,
                enableDelegation : false
            });

            criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_DELEGATION + '?employeeId=' + employeeId,
                    method : 'GET'
                }
            ).then({
                success : function(result) {
                    var record;

                    if (result) {
                        record = Ext.create('criterion.model.employee.subordinate.Delegation', result);
                    } else {
                        record = Ext.create('criterion.model.employee.subordinate.Delegation', {
                            delegatedByEmployeeId : employeeId
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
            var vm = this.lookup('delegation').getViewModel(),
                delegatedByEmployeeId = this.getViewModel().get('delegatedByEmployeeId'),
                record = vm.get('record'),
                enableDelegation = vm.get('enableDelegation'),
                view = this.getView();

            if (!enableDelegation && !record.phantom) {
                record.eraseWithPromise().then(function() {
                    criterion.Utils.toast(i18n.gettext('Successfully saved.'));
                    vm.set('record', Ext.create('criterion.model.employee.subordinate.Delegation', {
                        delegatedByEmployeeId : delegatedByEmployeeId
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
