Ext.define('criterion.view.employee.timeOffPlan.Accruals', function() {

    return {

        alias : 'widget.criterion_employee_timeoffplan_accruals',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employee.TimeOffPlans',
            'criterion.store.employer.TimeOffPlans',
            'criterion.controller.employee.timeOffPlan.Accruals',
            'criterion.view.employee.timeOffPlan.Accrual'
        ],

        store : {
            type : 'criterion_employee_time_off_plans'
        },

        controller : {
            type : 'criterion_employee_timeoffplan_accruals',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_employee_timeoffplan_accrual',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        viewModel : {
            stores : {
                timeOffPlans : {
                    type : 'criterion_employer_time_off_plans'
                }
            }
        },

        title : i18n.gettext('Time Off Plans'),

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF_PLANS, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'toggleslidefield',
                labelWidth : 100,
                fieldLabel : i18n.gettext('Show Inactive'),
                reference : 'showInactive',
                listeners : {
                    change : 'handleChangeShowInactive'
                }
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Plan Code'),
                dataIndex : 'planCode'
            },
            {
                xtype : 'datecolumn',
                width : 120,
                text : i18n.gettext('Start Date'),
                dataIndex : 'startDate'
            },
            {
                xtype : 'datecolumn',
                width : 120,
                text : i18n.gettext('End Date'),
                dataIndex : 'endDate'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Potential'),
                dataIndex : 'potential',
                renderer : function(value, cell, record) {
                    if (record && record.get('showPotential')) {
                        return Ext.util.Format.employerAmountPrecision(value);
                    }

                    return '';
                }
            },
            {
                xtype : 'datecolumn',
                width : 140,
                text : i18n.gettext('Accrual Date'),
                dataIndex : 'accrualDate'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Net Carryover'),
                dataIndex : 'carryoverNet',
                renderer : Ext.util.Format.employerAmountPrecisionRenderer()
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Accrued'),
                dataIndex : 'accrued',
                renderer : Ext.util.Format.employerAmountPrecisionRenderer()
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Used'),
                dataIndex : 'totalUsed',
                renderer : Ext.util.Format.employerAmountPrecisionRenderer()
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Net'),
                dataIndex : 'totalNet',
                renderer : Ext.util.Format.employerAmountPrecisionRenderer()
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Status'),
                renderer : function(value, cell, record) {
                    var isClosed = record.get('isClosed'),
                        isActive = record.get('isActive'),
                        status = '';

                    if (isClosed) {
                        status = i18n.gettext('Closed');
                    }

                    if (!isClosed && isActive) {
                        status = i18n.gettext('Active');
                    }

                    if (!isClosed && !isActive) {
                        status = i18n.gettext('Inactive');
                    }

                    return status;
                }

            }
        ]
    };
});

