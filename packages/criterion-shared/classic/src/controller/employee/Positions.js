Ext.define('criterion.controller.employee.Positions', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_employee_positions',

        requires : [
            'criterion.model.Assignment',
            'criterion.view.employee.Position'
        ],

        editor : {
            xtype : 'criterion_employee_position',
            plugins : [
                {
                    ptype : 'criterion_sidebar',
                    modal : false
                }
            ],

            hideDeleteBind : criterion.SecurityManager.getComplexSecurityFormula({
                append : 'hideDelete ||',
                rules : [
                    {
                        key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_POSITIONS,
                        actName : criterion.SecurityManager.DELETE,
                        reverse : true
                    }
                ]
            }),
            hideNewActionBtnBind : criterion.SecurityManager.getComplexSecurityFormula({
                append : 'hideEdit ||',
                rules : [
                    {
                        key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_POSITION_NEW_ACTION,
                        actName : criterion.SecurityManager.ACT,
                        reverse : true
                    }
                ]
            }),
            hideEditBtnBind : criterion.SecurityManager.getComplexSecurityFormula({
                append : 'hideEdit ||',
                rules : [
                    {
                        key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_POSITIONS,
                        actName : criterion.SecurityManager.UPDATE,
                        reverse : true
                    }
                ]
            }),
            hideTerminateBtnBind : criterion.SecurityManager.getComplexSecurityFormula({
                append : 'hideTerminate ||',
                rules : [
                    {
                        key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_POSITION_TERMINATE,
                        actName : criterion.SecurityManager.ACT,
                        reverse : true
                    }
                ]
            })
        },

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        loadRecordOnEdit : false,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,

        onEmployeeChange : function() {
            this.updateViewModel();
            this.callParent(arguments);
        },

        handleActivate : function() {
            this.updateViewModel();
            this.callParent(arguments);
        },

        cancelEdit : function(record) {
            if (!record) {
                return;
            }

            var vm = this.getViewModel(),
                assignments = vm.get('assignments');

            if (record && record.phantom && !record.$relatedPhantom) {
                assignments.each(function(rec) {
                    rec.phantom && assignments.remove(rec);
                });
            }

            if (record && !record.phantom) {
                record.reject();
            }
        },

        updateViewModel : function() {
            var me = this,
                viewModel = me.getViewModel(),
                employee = me.identity.employee;

            if (!me.checkViewIsActive() || !me.getEmployeeId()) {
                return;
            }

            viewModel.set({
                isTerminated : !employee.get('isActive')
            });
        },

        createEditor : function(editorCf, record) {
            var employer = this.identity.employer,
                editor = this.callParent(arguments),
                editorVm = editor.getViewModel();

            editorVm.set({
                employee : this.identity.employee,
                employerId : employer && employer.getId(),
                showPositionReporting : employer && employer.get('isPositionWorkflow'),
                isPositionControl : employer && employer.get('isPositionControl'),
                isPrimary : false
            });

            return editor;
        }
    };
});

