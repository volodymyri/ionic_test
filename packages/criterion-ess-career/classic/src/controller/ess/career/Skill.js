Ext.define('criterion.controller.ess.career.Skill', function() {

    return {

        alias : 'controller.criterion_selfservice_career_skill',

        extend : 'criterion.controller.FormView',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.Workflow',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.WorkflowHighlight'
        ],

        WORKFLOW_TYPE_CODE : criterion.Consts.WORKFLOW_TYPE_CODE.PERSON_SKILL,
        RECALL_URL : criterion.consts.Api.API.PERSON_SKILL_RECALL,

        init() {
            this.callParent(arguments);
            this.connectIsPendingWorkflow();
        },

        handleRecordLoad(record) {
            this.doLoadRecord(record);

            this.callParent(arguments);
        },

        formDataIsReady(record) {
            // add text data for the approving form
            record.set('skill', this.lookup('skillField').getSelection().get('name'));

            return true;
        }
    };
});
