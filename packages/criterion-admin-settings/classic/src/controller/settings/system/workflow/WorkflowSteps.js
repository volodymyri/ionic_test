Ext.define('criterion.controller.settings.system.workflow.WorkflowSteps', function() {

    function updateRecordsOrder(store, fieldName) {
        Ext.each(store.getRange(), function(record, index) {
            record.set(fieldName, index + 1);
        })
    }

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_workflow_steps',

        requires : [
            'criterion.view.settings.system.workflow.WorkflowStepForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        editor : 'criterion.view.settings.system.workflow.WorkflowStepForm',

        handleActivate : Ext.emptyFn, // parent controller take care of it

        load : function(workflow) {
            var view = this.getView(),
                vm = this.getViewModel(),
                store = view.getStore();

            if (workflow) {
                vm.set('workflow', workflow);
                !workflow.phantom && this.callParent([{
                    params : {
                        workflowId : workflow.getId()
                    }
                }]);
            } else {
                workflow = Ext.create('criterion.model.Workflow');
                vm.set('workflow', workflow);
                store.removeAll();
            }

            var wfActorStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_ACTOR),
                wfStateStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE),
                wfStructureStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.WF_STRUCTURE),
                cdStores = [];

            if (!wfActorStore.isLoaded()) {
                cdStores.push(criterion.consts.Dict.WORKFLOW_ACTOR);
            }
            if (!wfStateStore.isLoaded()) {
                cdStores.push(criterion.consts.Dict.WORKFLOW_STATE);
            }
            if (!wfStructureStore.isLoaded()) {
                cdStores.push(criterion.consts.Dict.WF_STRUCTURE);
            }

            if (cdStores.length) {
                Ext.Deferred.all([criterion.CodeDataManager.load(cdStores)])
                    .then(function() {
                        workflow.phantom && store.add({
                            actorCd : wfActorStore.findRecord('code', criterion.Consts.WORKFLOW_ACTOR.INITIATOR).getId(),
                            stateCd : wfStateStore.findRecord('code', criterion.Consts.WORKFLOW_STATUSES.PENDING_APPROVAL).getId(),
                            sequence : 1,
                            performer : 'Initiator'
                        })
                    })
            } else {
                workflow.phantom && store.add({
                    actorCd : wfActorStore.findRecord('code', criterion.Consts.WORKFLOW_ACTOR.INITIATOR).getId(),
                    stateCd : wfStateStore.findRecord('code', criterion.Consts.WORKFLOW_STATUSES.PENDING_APPROVAL).getId(),
                    sequence : 1,
                    performer : 'Initiator'
                })
            }
        },

        createEditor : function(editor, record) {
            var me = this,
                vm = this.getViewModel(),
                editorCr = Ext.create(editor),
                editorController = editorCr.getController(),
                workflow = vm.get('workflow');

            editorCr.setTitle((record.phantom ? i18n.gettext('Add') : i18n.gettext('Edit')) + ' ' + editorCr.getTitle());

            if (!workflow.phantom) {
                editorCr.getViewModel().set('employer', Ext.StoreManager.lookup('Employers').getById(workflow.get('employerId')));
            } else {
                editorCr.getViewModel().set('employer', Ext.StoreManager.lookup('Employers').getById(this.getEmployerId()));
            }

            if (Ext.isFunction(editorController.handleRecordLoad)) {
                editorCr.getController().handleRecordLoad.call(editorController, record);
            }

            editorCr.on({
                destroy : function(form, record) {
                    me.handleAfterEdit();
                },
                close : function(form, record) {
                    me.setCorrectMaskZIndex(false);
                },
                scope : me
            });

            editorCr.show();

            me.setCorrectMaskZIndex(true);

            return editorCr;
        },

        handleMoveUpAction : function(record, grid) {
            var store = grid.getStore(),
                range = store.getRange(),
                rangeIdx = Ext.Array.indexOf(range, record),
                filters = store.getFilters();

            if (rangeIdx > 0) {
                if (filters.length) {
                    store.clearFilter();
                }

                var targetIdx = store.indexOf(range[rangeIdx - 1]);
                store.remove(record);
                store.insert(targetIdx, record);

                if (filters.length) {
                    store.setFilters(filters);
                }

                updateRecordsOrder(store, grid.orderField);
            }
        },

        handleMoveDownAction : function(record, grid) {
            var store = grid.getStore(),
                range = store.getRange(),
                rangeIdx = Ext.Array.indexOf(range, record),
                filters = store.getFilters();

            if (rangeIdx < range.length - 1) {
                if (filters.length) {
                    store.clearFilter();
                }

                var targetIdx = store.indexOf(range[rangeIdx + 1]);
                store.remove(record);
                store.insert(targetIdx, record);

                if (filters.length) {
                    store.setFilters(filters);
                }

                updateRecordsOrder(store, grid.orderField);
            }
        },

        handleAfterEdit : function() {
            var view = this.getView();

            updateRecordsOrder(view.getStore(), view.orderField);
            view.reconfigure();
            this.correctSequence();
        },

        correctSequence : function() {
            var view = this.getView(),
                store = view.getStore(),
                wfStateStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE),
                approvedRecord = store.findRecord('stateCd', wfStateStore.findRecord('code', criterion.Consts.WORKFLOW_STATUSES.APPROVED).getId(), 0, false, false, true),
                escalationRecord = store.findRecord('stateCd', wfStateStore.findRecord('code', criterion.Consts.WORKFLOW_STATUSES.ESCALATION).getId(), 0, false, false, true),
                orderField = view.orderField;

            if (approvedRecord) {
                approvedRecord.set(orderField, store.last().get(orderField) + 1);
            }
            if (escalationRecord) {
                escalationRecord.set(orderField, store.last().get(orderField) + 1);
            }

            store.sort(orderField, 'ASC');

            store.each(function(rec, index) {
                rec.set(orderField, index + 1);
            });
        },

        onCancel : function() {
            this.getView().fireEvent('cancel');
        },

        getEmptyRecord : function() {
            var view = this.getView(),
                store = view.getStore(),
                newSequence = store.max('sequence') + 1,
                newRecordData = {
                    employerId : this.getEmployerId(),
                    sequence : newSequence
                };

            return Ext.apply(this.callParent(arguments), newRecordData);
        }
    }
});
