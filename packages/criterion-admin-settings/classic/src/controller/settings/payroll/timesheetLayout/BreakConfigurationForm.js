Ext.define('criterion.controller.settings.payroll.timesheetLayout.BreakConfigurationForm', function() {

    var DICT = criterion.consts.Dict,
        INCOME_CALC_METHOD = criterion.Consts.INCOME_CALC_METHOD;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_payroll_timesheet_layout_break_configuration_form',

        init : function() {
            var codeDataStore = criterion.CodeDataManager.getStore(DICT.INCOME_CALC_METHOD);

            if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                criterion.CodeDataManager.load([
                    DICT.INCOME_CALC_METHOD
                ]);
            }
        },

        handleRecordLoad : function() {
            var view = this.getView();

            this.callParent(arguments);

            view.setLoading(true);

            this.getStore('incomeLists').loadWithPromise({
                params : {
                    employerId : criterion.Api.getEmployerId(),
                    incomeCalcMethodCd : [
                        criterion.CodeDataManager.getCodeDetailRecord('code', INCOME_CALC_METHOD.HOURLY, DICT.INCOME_CALC_METHOD).getId()
                    ]
                }
            }).always(function() {
                view.setLoading(false);
            });
        }

    };

});