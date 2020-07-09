Ext.define('criterion.view.reports.DataTransferOptions', function() {

    return {

        alias : 'widget.criterion_reports_data_transfer_options',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.reports.DataTransferOptions'
        ],

        controller : {
            type : 'criterion_reports_data_transfer_options'
        },

        viewModel : {

        },

        bodyPadding : 10,

        layout : {
            type : 'hbox'
        },

        plugins : [
            'criterion_responsive_column'
        ],

        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

        scrollable : true,

        items : [
            {
                reference : 'pane1'
            },
            {
                reference : 'pane2'
            }
        ],

        loadTransferOptions : function(transferId, optionValues) {
            this.getController().loadTransferOptions(transferId, optionValues);
        },

        isValidForm : function() {
            return this.getForm().isValid();
        },

        getReportParams : function() {
            return Ext.Array.pluck(this.query('[xtype=criterion_report_parameter]'), 'parameterRecord');
        },

        getFormItems : function() {
            return this.getForm().getFields().items
        }

    }
});
