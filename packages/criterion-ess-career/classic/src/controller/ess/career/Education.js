Ext.define('criterion.controller.ess.career.Education', function() {

    return {

        alias : 'controller.criterion_selfservice_career_education',

        extend : 'criterion.controller.FormView',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.Workflow',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.WorkflowHighlight'
        ],

        WORKFLOW_TYPE_CODE : criterion.Consts.WORKFLOW_TYPE_CODE.PERSON_EDUCATION,
        RECALL_URL : criterion.consts.Api.API.PERSON_EDUCATION_RECALL,

        init() {
            this.callParent(arguments);
            this.connectIsPendingWorkflow();
        },

        handleRecordLoad(record) {
            this.doLoadRecord(record);

            this.callParent(arguments);
        }
    };
});
