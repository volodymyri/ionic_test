Ext.define('criterion.controller.settings.system.workflow.WorkflowStepForm', function() {

    var WORKFLOW_ACTOR = criterion.Consts.WORKFLOW_ACTOR;

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_workflow_step_form',

        requires : [
            'criterion.view.PositionPicker',
            'criterion.view.employee.EmployeePicker'
        ],

        onPerformerTypeChange : function(cmp, value, oldValue) {
            var record = this.getViewModel().get('record'),
                selection = cmp.getSelection(),
                orgStructureCombo = this.lookupReference('orgStructureCombo'),
                orgLevelField = this.lookupReference('orgLevelField'),
                positionContainer = this.lookupReference('positionContainer'),
                employeeContainer = this.lookupReference('employeeContainer');

            // disable all
            orgStructureCombo.setDisabled(true);
            orgLevelField.setDisabled(true);
            positionContainer.down('textfield').setDisabled(true);
            employeeContainer.down('textfield').setDisabled(true);

            // hide all
            orgStructureCombo.hide();
            orgLevelField.hide();
            positionContainer.hide();
            employeeContainer.hide();

            switch (selection && selection.get('code')) {
                case WORKFLOW_ACTOR.INITIATOR:
                    break;
                case WORKFLOW_ACTOR.ORG_TYPE:
                    orgStructureCombo.show();
                    orgLevelField.show();
                    orgStructureCombo.setDisabled(false);
                    orgLevelField.setDisabled(false);
                    break;
                case WORKFLOW_ACTOR.POSITION:
                    positionContainer.show();
                    positionContainer.down('textfield').setDisabled(false);
                    break;
                case WORKFLOW_ACTOR.EMPLOYEE:
                    employeeContainer.show();
                    employeeContainer.down('textfield').setDisabled(false);
                    break;
            }

            if (oldValue !== null) {
                // for the initial set do not flush values
                record.set({
                    orgType : null,
                    orgLevel : null,
                    positionId : null,
                    performer : null
                });
            }
        },

        onPositionSearch : function() {
            var view = this.getView(),
                picker = Ext.create('criterion.view.PositionPicker');

            view.hide();
            picker.show();
            picker.on('select', function(positionRecord) {
                this.getViewModel().get('record').set({
                    positionId : positionRecord.getId(),
                    performer : positionRecord.get('title')
                });
            }, this);
            picker.on('destroy', function() {
                view.show();
            });
        },

        onEmployeeSearch : function() {
            var view = this.getView(),
                picker = Ext.create('criterion.view.employee.EmployeePicker');

            view.hide();
            picker.show();
            picker.on('select', function(employee) {
                this.getViewModel().get('record').set({
                    employeeId : employee.get('employeeId'),
                    performer : employee.get('fullName')
                });
            }, this);
            picker.on('destroy', function() {
                view.show();
            });
        },

        handleRecordUpdate : function(record) {
            switch (record.get('actorCode')) {
                case WORKFLOW_ACTOR.INITIATOR:
                    record.set('performer', 'Initiator');
                    break;
                case WORKFLOW_ACTOR.ORG_TYPE:
                    record.set('performer',
                        this.lookupReference('orgStructureCombo').getStore().findRecord('attribute1', record.get('orgType')).get('description') +
                        ' - Level ' + record.get('orgLevel')
                    );
                    break;
                case WORKFLOW_ACTOR.POSITION:
                    record.set('performer', this.lookupReference('positionContainer').down('textfield').getValue());
                    break;
                case WORKFLOW_ACTOR.POS_STRUCT1:
                case WORKFLOW_ACTOR.POS_STRUCT2:
                    var selection = this.lookupReference('performerField').getSelection();

                    selection && record.set('performer', selection.get('description'));
                    break;
            }

            this.callParent(arguments);
        },

        handleCancelClick : function() {
            var me = this,
                form = me.getView(),
                record = this.getRecord();

            if (record.get('sequence') != 1) {
                if (!record.phantom) {
                    record.reject();
                }

                form.fireEvent('cancel', form, record);
            }

            me.close();
        }

    }
});
