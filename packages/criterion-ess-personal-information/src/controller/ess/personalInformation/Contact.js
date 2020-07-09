Ext.define('criterion.controller.ess.personalInformation.Contact', function() {

    return {

        alias : 'controller.criterion_selfservice_personal_information_contact',

        extend : 'criterion.controller.person.Contact',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.WorkflowHighlight',
            'criterion.controller.mixin.Workflow',
        ],

        WORKFLOW_TYPE_CODE : criterion.Consts.WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS,
        RECALL_URL : criterion.consts.Api.API.PERSON_CONTACT_RECALL,

        workflowLogFieldsIsReadyForHighlight : false,

        init() {
            this.callParent(arguments);
            this.connectIsPendingWorkflow();
        },

        handleRecordLoad(record) {
            this.doLoadRecord(record);

            this.callParent(arguments);
        },

        afterCustomFieldsLoaded : function() {
            let record = this.getViewModel().get('record'),
                workflowLog = Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog();

            this.workflowLogFieldsIsReadyForHighlight = true;

            this.highlightWorkflowLogFields(workflowLog);
        },

        handleChangeEmergency : function(cmp, value) {
            let vm = this.getViewModel(),
                record = vm.get('record'),
                presentIsEmergency = record.store.checkPresentIsEmergency();

            if (!cmp.disabled && value && presentIsEmergency !== false && presentIsEmergency !== record.getId()) {
                criterion.Msg.confirm(
                    i18n.gettext('Warning'),
                    i18n.gettext('There is already an emergency contact. Set the new contact as the emergency contact?'),
                    function(btn) {
                        if (btn !== 'yes') {
                            cmp.setValue(!value);
                        }
                    },
                    this
                );
            }
        },

        handleWorkflowSubmit : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                customValues = view.lookupReference('customfieldsDependents').getController().getChanges(record.getId()),
                workPhone = me.lookupReference('workPhone');

            record.setCustomValues(customValues);

            if (!me.checkDependentAndEmergency()) {
                criterion.Msg.warning(i18n.gettext('Contact should be Dependent, Emergency or both of them'));

                return;
            }

            if (me.isEmergencyPhoneRequired()) {
                criterion.Msg.warning(i18n.gettext('Emergency contact should has at least one phone number'));
                workPhone.focus();
                return;
            }

            if (view.isValid()) {
                // creation of dependents and contacts don't needed if nothing changed
                if (record.dirty) {
                    me.doWorkflowSubmit(record);
                } else {
                    me.close();
                }
            }
        }

    }
});
