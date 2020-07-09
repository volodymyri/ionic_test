Ext.define('criterion.controller.employee.Incomes', function() {

    return {
        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_employee_payroll_incomes',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        suppressIdentity : ['employeeGlobal'],

        createEditor : function(editorCfg, record) {
            var editor = this.callParent(arguments),
                me = this;

            editor.on('afterSave', function() {
                criterion.Utils.toast(i18n.gettext('Income Override saved.'));
            });
            editor.on('afterDelete', function() {
                me.load();
            });
            return editor;
        },

        load : function(opts = {}) {
            let mergeOptions = {},
                showInactive = this.lookup('showInactive');

            if (showInactive && !showInactive.getValue()) {
                mergeOptions.params = {
                    isActive : true
                };
            }

            return this.callParent([Ext.apply({}, Ext.merge(opts, mergeOptions))]);
        },

        handleChangeShowInactive : function() {
            this.load();
        }
    };
});
