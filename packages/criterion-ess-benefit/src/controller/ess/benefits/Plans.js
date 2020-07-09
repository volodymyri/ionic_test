Ext.define('criterion.controller.ess.benefits.Plans', function() {

    return {
        extend : 'criterion.controller.employee.Benefits',

        alias : 'controller.criterion_selfservice_benefits_plans',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        createEditor : function(editorCfg, record) {
            var editor = this.callParent(arguments);

            editor.getViewModel().set({
                person : this.identity.person,
                employee : this.identity.employee
            });

            return editor;
        }
    };
});
