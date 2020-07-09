Ext.define('criterion.controller.settings.system.workflow.WorkflowForm', function() {

    let WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES,
        usedTimeOffTypes = null;

    return {

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.view.settings.system.workflow.Track'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        alias : 'controller.criterion_settings_workflow_form',

        employerId : null,

        getEmployerId : function() {
            return this.employerId;
        },

        onBeforeEmployerChange : function(employer) {
            this.employerId = employer ? employer.getId() : null;
            usedTimeOffTypes = null;
        },

        handleRecordUpdate : function() {
            var vm = this.getViewModel(),
                workflow = vm.get('record'),
                stepsStore = this.lookupReference('steps').getStore(),
                escalations = 0;

            // check Escalation step
            if (workflow.get('escalationDays')) {
                // If escalation_days is not empty, we should require user to add the escalation step
                stepsStore.each(step => {
                    if (step.get('stateCode') === WORKFLOW_STATUSES.ESCALATION) {
                        escalations++;
                    }
                });

                if (escalations > 1) {
                    criterion.Msg.warning(i18n.gettext('Workflow must contain only one escalation step'));
                    return;
                }
            }

            this.lookup('employeeGroupCombo').collapse();
            workflow.set('employerId', this.getEmployerId());
            workflow.saveWithPromise().then({
                scope : this,
                success : record => {
                    vm.set('record', record);
                    this.lookupReference('employeeGroupCombo').saveValuesForRecord(vm.get('record')).then(() => {
                        this.syncSteps();
                    });
                }
            })
        },

        syncSteps : function() {
            var store = this.lookupReference('steps').getStore(),
                vm = this.getViewModel(),
                view = this.getView(),
                workflow = vm.get('record');

            if (store.getModifiedRecords().length || store.getRemovedRecords().length) {
                store.each(function(step) {
                    step.set('workflowId', workflow.getId())
                });

                store.sync({
                    scope : this,
                    success : () => {
                        this.onAfterSave(view, workflow);
                    }
                })
            } else {
                this.onAfterSave(view, workflow);
            }
        },

        handleAfterRecordLoad : function(record) {
            let employeeGroupCombo = this.lookupReference('employeeGroupCombo'),
                vm = this.getViewModel(),
                stepsView = this.lookupReference('steps'),
                steps = stepsView.getStore();

            vm.set('record', record);

            employeeGroupCombo.loadValuesForRecord(record);

            steps.on('datachanged', store => {
                let containEscalationSteps = false,
                    containApprovedStep = false;

                store.each(step => {
                    let statusCode = step.get('stateCode');
                    if (statusCode === WORKFLOW_STATUSES.ESCALATION) {
                        containEscalationSteps = true;
                    } else if (statusCode === WORKFLOW_STATUSES.APPROVED) {
                        containApprovedStep = true;
                    }
                });

                vm.set({
                    isShowEscalationDays : containEscalationSteps,
                    isShowAutoActionDays : containApprovedStep
                });
            });

            stepsView.getController().load(record);
        },

        onWorkflowTypeChange : function(cmp, value) {
            if (value && cmp.getSelectedRecord().get('code') === criterion.Consts.WORKFLOW_TYPE_CODE.TIME_OFF) {
                if (!usedTimeOffTypes) {
                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.USED_TIME_OFF_TYPES,
                        method : 'GET',
                        params : {
                            employerId : this.employerId
                        }
                    }).then(response => {
                        usedTimeOffTypes = response && response['ids'] || null;
                    });
                }
            }
        },

        onTimeOffTypeComboShow : function(boundlist) {
            let parentCombo = boundlist.ownerCmp;

            if (!usedTimeOffTypes) {
                return;
            }

            boundlist.store.clearFilter();

            parentCombo.suspendEvents(false);

            boundlist.store.setFilters([
                {
                    property : 'id',
                    value : usedTimeOffTypes,
                    operator : 'notin'
                }
            ]);

            parentCombo.resumeEvents();
        },

        close : function() {
            this.lookupReference('employeeGroupCombo').collapse();
            this.callParent(arguments);
        },

        onTrackClick : function() {
            var me = this,
                trackWindow,
                vm = this.getViewModel();

            trackWindow = Ext.create('criterion.view.settings.system.workflow.Track', {
                viewModel : {
                    data : {
                        wfRecord : vm.get('record'),
                        employeeId : criterion.Application.getEmployee().getId()
                    }
                }
            });
            trackWindow.on('close', () => {
                this.setCorrectMaskZIndex(false);
                trackWindow.destroy();
            });
            trackWindow._connectedView = this.getView();
            trackWindow.show();
            this.setCorrectMaskZIndex(true);
        }
    }

});
