Ext.define('criterion.view.ess.payroll.Deductions', function() {

    return {

        alias : 'widget.criterion_selfservice_payroll_deductions',

        extend : 'criterion.view.employee.payroll.Deductions',

        requires : [
            'criterion.controller.ess.payroll.Deductions'
        ],

        controller : {
            type : 'criterion_selfservice_payroll_deductions',
            baseRoute : criterion.consts.Route.SELF_SERVICE.PAYROLL_DEDUCTIONS
        },

        header : {
            title : i18n.gettext('Deductions'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                }
            ]
        },

        cls : 'criterion-grid-panel-simple-list',

        tbar : null,

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Deduction'),
                dataIndex : 'deduction',
                renderer : function(value) {
                    return value ? value.description : '';
                },
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Effective Date'),
                dataIndex : 'effectiveDate',
                width : 150
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Expiration Date'),
                dataIndex : 'expirationDate',
                width : 160
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer Amount'),
                dataIndex : 'employerAmount',
                flex : 1,
                renderer : function(value, metaData, record) {
                    if (record.get('costVisibilityCode') !== criterion.Consts.COST_VISIBILITY.EMPLOYEE_AND_EMPLOYER) {
                        return '-';
                    }

                    var deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
                        dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, criterion.consts.Dict.DEDUCTION_CALC_METHOD),
                        dedRecCode = dedRec && dedRec.get('code'),
                        employerMatch = record.get('employerMatch'),
                        val;

                    switch (dedRecCode) {
                        case criterion.Consts.DEDUCTION_CALC_METHOD_CODES.AMOUNT:
                        case criterion.Consts.DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE:
                            val = Ext.util.Format.currency(value, null, 2);
                            break;

                        case criterion.Consts.DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS:
                        case criterion.Consts.DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT:
                            val = Ext.util.Format.percent(value, '0.##');
                            break;

                        case criterion.Consts.DEDUCTION_CALC_METHOD_CODES.AMOUNT_MATCH:
                            val = employerMatch;
                            break;

                        case criterion.Consts.DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH:
                            val = employerMatch;
                            break;

                        default:
                            val = value;
                            break;
                    }

                    return val + '/' + record.get('deductionFrequency');
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee Amount'),
                dataIndex : 'employeeAmount',
                flex : 1,
                renderer : function(value, metaData, record) {
                    if (!value) {
                        return '';
                    }

                    if (!Ext.Array.contains([
                                criterion.Consts.COST_VISIBILITY.EMPLOYEE, criterion.Consts.COST_VISIBILITY.EMPLOYEE_AND_EMPLOYER
                            ],
                            record.get('costVisibilityCode'))) {
                        return '-';
                    }

                    var deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
                        dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, criterion.consts.Dict.DEDUCTION_CALC_METHOD),
                        dedRecCode = dedRec && dedRec.get('code'),
                        isPercent = dedRecCode && (
                                dedRecCode === criterion.Consts.DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS ||
                                dedRecCode === criterion.Consts.DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH ||
                                dedRecCode === criterion.Consts.DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH
                            );

                    return (isPercent ? Ext.util.Format.percent(value, '0.##') : Ext.util.Format.currency(value, null, 2)) + '/' + record.get('deductionFrequency');
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Limit'),
                dataIndex : 'employeeLimit',
                flex : 1,
                renderer : function(value, metaData, record) {
                    if (!value) {
                        return ''
                    }

                    return value + '/' + record.get('deductionLimitDescription');
                }
            }
        ]
    }
});
