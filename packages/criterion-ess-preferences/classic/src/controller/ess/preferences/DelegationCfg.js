Ext.define('criterion.controller.ess.preferences.DelegationCfg', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_preferences_delegation_cfg',

        requires : [
            'criterion.store.employee.subordinate.TeamMembers',
            'criterion.store.search.EmployeesDelegation'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        onEmployeeChange : Ext.emptyFn,

        handleSearchEmployee : function() {
            var picker,
                vm = this.getViewModel(),
                delegatedByEmployeeId = vm.get('delegatedByEmployeeId'),
                extraParams;

            if (delegatedByEmployeeId) {
                extraParams = {
                    excludeEmployeeId : delegatedByEmployeeId
                };
            }

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
                extraParams : extraParams,
                storeClass : 'criterion.store.search.EmployeesDelegation'
            });

            picker.show();
            picker.on('select', function(employeeRecord) {
                vm.get('record').set({
                    delegatedToEmployeeId : employeeRecord.get('employeeId'),
                    delegatedToEmployeeName : employeeRecord.get('employeeName')
                })
            }, this)
        }
    };
});
