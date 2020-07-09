Ext.define('criterion.store.app.PayrollTimesheetImport', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_app_payroll_timesheet_import',

        model : 'criterion.model.App',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.APP,
            extraParams : {
                buttonCd : criterion.Consts.APP_BUTTON_TYPES.PAYROLL_IMPORT
            }
        },

        listeners : {
            load : function(store, records, success) {
                if (success) {
                    store.add(Ext.create('criterion.model.App', {
                        id : criterion.Consts.PAYROLL_SETTINGS_TYPE_CRITERION_ID,
                        name : i18n.gettext('Criterion')
                    }));
                }
            }
        }
    };
});
