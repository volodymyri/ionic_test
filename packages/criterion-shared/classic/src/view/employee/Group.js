Ext.define('criterion.view.employee.Group', function() {

    return {

        alias : 'widget.criterion_employee_group',

        extend : 'criterion.view.FormView',

        controller : {
            externalUpdate : false
        },

        title : i18n.gettext('Employee to a Group'),

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GROUPS, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GROUPS, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        items : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Group'),
                bind : {
                    store : '{employeeGroupsFiltered}'
                },
                name : 'employeeGroupId',
                queryMode : 'local',
                displayField : 'name',
                valueField : 'id',
                editable : false,
                allowBlank : false
            }
        ]
    };

});
