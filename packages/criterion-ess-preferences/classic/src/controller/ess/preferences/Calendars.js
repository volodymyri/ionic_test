Ext.define('criterion.controller.ess.preferences.Calendars', function() {

    return {
        alias : 'controller.criterion_ess_preferences_calendars',

        extend : 'criterion.controller.employee.GridView',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,

        handleAfterSave : function() {
            this.callParent(arguments);
            Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.ESS_EMPLOYEE_CALENDARS.storeId).reload();
        },

        handleAfterDelete : function() {
            this.callParent(arguments);
            Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.ESS_EMPLOYEE_CALENDARS.storeId).reload();
        }
    }
});
