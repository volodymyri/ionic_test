Ext.define('criterion.controller.ess.career.Certification', function() {

    return {

        alias : 'controller.criterion_selfservice_career_certification',

        extend : 'criterion.controller.person.Certification',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.Workflow',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.WorkflowHighlight'
        ],

        WORKFLOW_TYPE_CODE : criterion.Consts.WORKFLOW_TYPE_CODE.PERSON_CERTIFICATION,
        RECALL_URL : criterion.consts.Api.API.PERSON_CERTIFICATION_RECALL,

        init() {
            this.callParent(arguments);
            this.connectIsPendingWorkflow();
        },

        handleRecordLoad(record) {
            this.doLoadRecord(record);

            this.callParent(arguments);
        },

        getEmployerId() {
            return this.getViewModel().get('employerId')
        }
    };
});
