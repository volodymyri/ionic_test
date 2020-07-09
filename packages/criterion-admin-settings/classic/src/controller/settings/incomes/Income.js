Ext.define('criterion.controller.settings.incomes.Income', function() {

    return {
        alias : 'controller.criterion_payroll_settings_payroll_income',

        extend : 'criterion.controller.FormView',

        handleAfterRecordLoad : function(record) {
            this.callParent(arguments);
            this.lookupReference('employerIncomeListLabelsCombo').loadValuesForRecord(record);
        },

        onAfterSave : function(view, record) {
            var me = this;

            this.lookupReference('employerIncomeListLabelsCombo').saveValuesForRecord(record).then(function() {
                view.fireEvent('afterSave', view, record);
                me.close();
            });
        }
    }
});
