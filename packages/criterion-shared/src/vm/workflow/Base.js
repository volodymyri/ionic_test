Ext.define('criterion.vm.workflow.Base', {

    extend : 'Ext.app.ViewModel',

    alias : 'viewmodel.criterion_workflow_base',

    data : {
        readOnly : false
    },

    formulas : {

        isPendingWorkflow : data => Ext.Array.contains([criterion.Consts.WORKFLOW_STATUSES.PENDING_APPROVAL, criterion.Consts.WORKFLOW_STATUSES.VERIFIED], data('record.statusCode')),

        hideDeleteBtn : data => data('hideDeleteInt') || data('isPendingWorkflow'),

        submitText : data => data('isPendingWorkflow') ? i18n._('Reviewing') : i18n._('Submit'),

        workflowMessage : data => {
            let record = data('record'),
                workflowLog = record && Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
                message;

            if (workflowLog && workflowLog.get('requestType') === criterion.Consts.WORKFLOW_REQUEST_TYPE.DELETE) {
                message = i18n._('Record has been recently removed and is pending approval.');
            } else {
                message = '<span>&nbsp;</span> ' + i18n._('Highlighted fields were recently changed and being reviewed.');
            }

            return message;
        },

        allowRecallBtn : data => data('record.canRecall')
    }

});
