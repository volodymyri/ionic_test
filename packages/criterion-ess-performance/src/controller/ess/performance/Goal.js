Ext.define('criterion.controller.ess.performance.Goal', function() {

    const WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'criterion.controller.person.Goal',

        alias : 'controller.criterion_selfservice_performance_goal',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.WorkflowHighlight'
        ],

        highlightMapping : {
            weightInPercent : 'weight'
        },

        getCurrentEmployerId() {
            return this.getViewModel().get('employerId');
        },

        afterLoadRecord(record) {
            let vm = this.getViewModel(),
                reviewId = vm.get('reviewId'),
                workflowLog = Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
                isPendingWorkflow = workflowLog && workflowLog.isModel && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], workflowLog.get('stateCode'));
            
            if (record.phantom && reviewId) {
                record.set('reviewId', reviewId);
            }

            if (record.phantom || !isPendingWorkflow) {
                vm.set('readOnly', false);
            } else if (isPendingWorkflow) {
                vm.set('readOnly', true);
            }

            this.highlightWorkflowLogFields(workflowLog);
        },

        updateRecord(record, handler) {
            let me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                employeeId = vm.get('employeeId'),
                workflowVmIdent = me.getWorkflowVmIdent(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL),
                workflowField = me.lookup('workflowField'),
                workflowData = workflowField.getSelection().data,
                args = arguments;

            if (record.phantom) {
                me.callParent(args);
            } else {
                vm.set(workflowVmIdent, workflowData.isActive ? Ext.clone(workflowData) : null);

                // delay for correct find the mask element
                Ext.defer(function() {
                    me.setCorrectMaskZIndex(true);
                }, 10);

                me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL).then(function(signature) {
                    view.setLoading(true);
                    me.setCorrectMaskZIndex(false);

                    if (signature) {
                        record.set('signature', signature);
                    }

                    me.getLinkToBaseUpdateRecordMethod().apply(me, args);
                }).otherwise(function() {
                    view.setLoading(false);
                });
            }
        },

        getLinkToBaseUpdateRecordMethod() {
            return this.superclass.updateRecord;
        }
    }
});
