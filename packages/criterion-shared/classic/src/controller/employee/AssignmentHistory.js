Ext.define('criterion.controller.employee.AssignmentHistory', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_employee_assignment_history',

        requires : [
            'criterion.view.employee.PositionsView',
            'criterion.view.employee.Position',
            'criterion.model.Assignment'
        ],

        editor : {
            xtype : 'criterion_employee_positions_view'
        },

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        loadRecordOnEdit : false,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,

        createEditor : function(editorCfg, record) {
            var me = this,
                vm = this.getViewModel(),
                assignments = this.getStore('assignments'),
                editor = this.callParent(arguments);

            editor.getViewModel().set({
                security : vm.get('security'),
                employee : this.identity.employee,
                employer : this.identity.employer,
                employerId : this.identity.employer.getId(),
                positions : assignments,
                currentIndex : assignments.indexOf(record)
            });

            editor.on('afterDeleteAssignmentDetail', function() {
                me.load();
            });

            return editor;
        },

        load : function() {
            this.getView().down('tableview').prevGroupClass = null;
            this.callParent(arguments);
        },

        onLoad : function(store, records, successful) {
            var vm = this.getViewModel(),
                notIsPrimary;

            if (successful) {
                notIsPrimary = Ext.Array.findBy(records, function(item) {
                    return !item.get('isPrimary');
                });

                vm.set('hideTypeColumn', Ext.Object.isEmpty(notIsPrimary));
            }
        },

        handleEditAssignmentAction : function(record) {
            var assignmentId = record.get('assignmentId'),
                detailId = record.getId(),
                employer = this.identity.employer;

            this.startEdit(
                Ext.create('criterion.model.Assignment', {id : assignmentId}),
                {
                    xtype : 'criterion_employee_position',
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            modal : false
                        }
                    ],

                    activeDetailId : record.getId(),

                    controller : {
                        suppressIdentity : ['employeeGlobal']
                    },

                    viewModel : {
                        data : {
                            editMode : true,
                            isPrimary : false,
                            blockPositionChange : true,
                            isPositionEditable : false,
                            isPositionControl : employer && employer.get('isPositionControl'),
                            showPositionReporting : employer && employer.get('isPositionWorkflow')
                        },
                        formulas : {
                            isDisabled : function(data) {
                                return false;
                            },
                            hideSave : function(data) {
                                return data('isPendingWorkflow') && !data('editMode');
                            },
                            isPendingWorkflow : function(get) {
                                var assignment = get('assignment'),
                                    workflowLog = assignment && assignment.getWorkflowLog();

                                if (workflowLog) {
                                    var request = workflowLog.get('request'),
                                        disableEdit = Ext.Array.contains(['PENDING_APPROVAL', 'VERIFIED'], workflowLog.get('stateCode'));

                                    this.set('isDisabled', disableEdit);

                                    this.set('disableByWorkflow', disableEdit);
                                    if (disableEdit && request && request.assignmentDetails && request.assignmentDetails.length && request.assignmentDetails[0].id !== detailId) {
                                        return false;
                                    }

                                    return disableEdit;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }
            );
        }

    };
});
