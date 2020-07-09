Ext.define('criterion.view.employee.payroll.Deductions', function() {

    const DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES;

    const renderEmployeeAmountPercent = (value, metaData, record) => {
        if (!value) {
            return ''
        }

        let deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
            dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, criterion.consts.Dict.DEDUCTION_CALC_METHOD),
            code = dedRec && dedRec.get('code'),
            isPercent,
            DEDUCTION_CALC_METHOD_CODES = DEDUCTION_CALC_METHOD_CODES;

        if (code === DEDUCTION_CALC_METHOD_CODES.GARNISHMENT) {
            return value;
        } else {
            isPercent = code && Ext.Array.contains([DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS, DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH, DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT], code);

            return isPercent ? Ext.util.Format.percent(value) : Ext.util.Format.currency(value);
        }
    };

    const renderEmployerAmountMatchPercent = (value, metaData, record) => {
        let deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
            dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, criterion.consts.Dict.DEDUCTION_CALC_METHOD),
            code = dedRec && dedRec.get('code'),
            employerMatch = record.get('employerMatch');

        switch (code) {
            case DEDUCTION_CALC_METHOD_CODES.AMOUNT:
            case DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE:
            case DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_AMOUNT:
                return Ext.util.Format.currency(value);

            case DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS:
            case DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT:
                return Ext.util.Format.percent(value);

            case DEDUCTION_CALC_METHOD_CODES.AMOUNT_MATCH:
                return employerMatch;

            case DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH:
                return employerMatch;

            default:
                return value
        }
    };

    return {

        alias : 'widget.criterion_employee_payroll_deductions',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.employee.payroll.Deductions',
            'criterion.view.employee.payroll.form.DeductionForm',
            'criterion.store.employee.Deductions',
            'criterion.store.CalcMethod',
            'criterion.ux.grid.column.Currency'
        ],

        controller : {
            type : 'criterion_employee_payroll_deductions',
            editor : {
                xtype : 'criterion_employee_payroll_form_deduction',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        title : i18n.gettext('Deductions'),

        store : {
            type : 'criterion_employee_deduction'
        },

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
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DEDUCTIONS, criterion.SecurityManager.CREATE, true)
                }
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
                text : i18n.gettext('Deduction Code'),
                dataIndex : 'deduction',
                renderer : function(value) {
                    return value ? value.code : '';
                },
                sorter : criterion.Utils.nestedFieldSorter('deduction', 'code'),
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Deduction Title'),
                dataIndex : 'deduction',
                renderer : function(value) {
                    return value ? value.description : '';
                },
                sorter : criterion.Utils.nestedFieldSorter('deduction', 'description'),
                flex : 2
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Deduction Limit'),
                dataIndex : 'deductionLimitCd',
                codeDataId : criterion.consts.Dict.DEDUCTION_LIMIT,
                flex : 1
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
                text : i18n.gettext('Employer Amount'),
                dataIndex : 'employerAmount',
                flex : 1,
                renderer : renderEmployerAmountMatchPercent
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee Amount'),
                dataIndex : 'employeeAmount',
                flex : 1,
                renderer : renderEmployeeAmountPercent
            }
        ]

    };
});
