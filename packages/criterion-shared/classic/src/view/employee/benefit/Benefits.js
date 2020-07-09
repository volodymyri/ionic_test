Ext.define('criterion.view.employee.benefit.Benefits', function() {

    var isPercent = function(record) {
        var deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
            dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, criterion.consts.Dict.DEDUCTION_CALC_METHOD),
            dedRecCode = dedRec && dedRec.get('code'),
            DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES;

        return dedRecCode ? Ext.Array.contains([
            DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS,
            DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH,
            DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT
        ], dedRecCode) : false;
    };

    var renderAmountPercent = function(value, metaData, record) {
        if (!value) {
            return ''
        }

        var deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
            dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, criterion.consts.Dict.DEDUCTION_CALC_METHOD),
            dedRecCode = dedRec && dedRec.get('code'),
            DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES;

        if (dedRecCode === DEDUCTION_CALC_METHOD_CODES.GARNISHMENT) {
            return value;
        } else {
            return isPercent(record) ? Ext.util.Format.percent(value, '0.###') : criterion.LocalizationManager.currencyFormatter(value);

        }
    };

    return {

        alias : 'widget.criterion_person_benefits',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employee.Benefits',
            'criterion.controller.employee.Benefits',
            'criterion.view.employee.benefit.BenefitForm'
        ],

        controller : {
            type : 'criterion_employee_benefits',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_employee_benefit_benefit_form',
                controller : {
                    externalUpdate : false
                }
            }
        },

        title : i18n.gettext('Benefit Plans'),

        viewModel : {
            data : {
                showApproved : true
            },
            stores : {
                employeeBenefits : {
                    type : 'criterion_employee_benefits',
                    sorters : [
                        {
                            property : 'effectiveDate',
                            direction : 'ASC'
                        },
                        {
                            property : 'planCode',
                            direction : 'ASC'
                        }
                    ],
                    proxy : {
                        extraParams : {
                            showApproved : '{showApproved}'
                        }
                    }
                }
            }
        },

        bind : {
            store : '{employeeBenefits}'
        },

        stateId : 'employee_benefit_benefits',
        stateful : true,

        selType : 'checkboxmodel',

        selModel : {
            checkOnly : true,
            headerActive : false
        },

        tbar : [
            {
                xtype : 'criterion_splitbutton',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                width : 120,
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_BENEFIT_PLANS, criterion.SecurityManager.CREATE, true)
                },
                menu : [
                    {
                        text : i18n.gettext('Auto Add'),
                        listeners : {
                            click : 'handleAutoAdd'
                        }
                    }
                ]
            },
            '->',
            {
                xtype : 'toggleslidefield',
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
                text : i18n.gettext('Benefit code'),
                flex : 1,
                dataIndex : 'planCode'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Benefit Plan Name'),
                hidden : true,
                sortable : false,
                menuDisabled : true,
                flex : 1,
                renderer : function(value, metaData, record) {
                    var plan = record && record.getPlan && record.getPlan();

                    return plan ? plan.get('name') : '';
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Premium'),
                flex : 1,
                dataIndex : 'premium',
                renderer : function(value, metaData, record) {
                    return isPercent(record) ? '-' : criterion.LocalizationManager.currencyFormatter(value);
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee Contribution'),
                flex : 1,
                dataIndex : 'employeeContribution',
                renderer : renderAmountPercent
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer Contribution'),
                flex : 1,
                dataIndex : 'employerContribution',
                renderer : renderAmountPercent
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Effective Date'),
                dataIndex : 'effectiveDate',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Expiration Date'),
                dataIndex : 'expirationDate',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Option 1'),
                hidden : true,
                flex : 1,
                dataIndex : 'optionName1'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Option 2'),
                hidden : true,
                flex : 1,
                dataIndex : 'optionName2'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Option 3'),
                hidden : true,
                flex : 1,
                dataIndex : 'optionName3'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Option 4'),
                hidden : true,
                flex : 1,
                dataIndex : 'optionName4'
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Manual'),
                width : 140,
                dataIndex : 'isManualOverride',
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No')
            }
        ]

    }
});
