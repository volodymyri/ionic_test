Ext.define('criterion.view.ess.benefits.Plans', function() {

    var renderAmountPercent = function(value, metaData, record) {
        if (!value) {
            return ''
        }

        var deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
            dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, criterion.consts.Dict.DEDUCTION_CALC_METHOD),
            dedRecCode = dedRec && dedRec.get('code'),
            isPercent,
            DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES;

        if (dedRecCode === DEDUCTION_CALC_METHOD_CODES.GARNISHMENT) {
            return value;
        } else {
            isPercent = dedRecCode && (
                dedRecCode === DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS ||
                dedRecCode === DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH
            );

            return isPercent ? Ext.util.Format.percent(value, '0.###') : criterion.LocalizationManager.currencyFormatter(value);

        }
    };

    return {
        alias : 'widget.criterion_selfservice_benefits_plans',

        extend : 'criterion.view.employee.benefit.Benefits',

        readOnlyMode : true,

        requires : [
            'criterion.controller.ess.benefits.Plans',
            'criterion.view.ess.benefits.Plan'
        ],

        controller : {
            type : 'criterion_selfservice_benefits_plans',
            baseRoute : criterion.consts.Route.SELF_SERVICE.BENEFITS_PLANS,
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : true,
            editor : {
                xtype : 'criterion_selfservice_benefits_plan'
            }
        },

        viewModel : {
            data : {
                showApproved : true
            }
        },

        tbar : null,

        header : {

            title : i18n.gettext('Benefit Plans'),

            items : [
                {
                    xtype : 'tbfill'
                },
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
                    xtype : 'tbspacer'
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

        selType : null,

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Plan Name'),
                flex : 1,
                dataIndex : 'planName'
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Effective Date'),
                flex : 1,
                dataIndex : 'effectiveDate'
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Expiration Date'),
                flex : 1,
                dataIndex : 'expirationDate'
            },
            {
                xtype : 'criterion_currencycolumn',
                text : i18n.gettext('Employee Contribution'),
                flex : 1,
                dataIndex : 'employeeContribution',
                renderer : function(value, metaData, record) {
                    if (Ext.Array.contains([criterion.Consts.COST_VISIBILITY.EMPLOYEE, criterion.Consts.COST_VISIBILITY.EMPLOYEE_AND_EMPLOYER],
                            record.get('costVisibilityCode'))) {
                        return renderAmountPercent(value, metaData, record);
                    } else {
                        return '-';
                    }
                }
            },
            {
                xtype : 'criterion_currencycolumn',
                text : i18n.gettext('Employer Contribution'),
                flex : 1,
                dataIndex : 'employerContribution',
                renderer : function(value, metaData, record) {
                    if (record.get('costVisibilityCode') === criterion.Consts.COST_VISIBILITY.EMPLOYEE_AND_EMPLOYER) {
                        return renderAmountPercent(value, metaData, record);
                    } else {
                        return '-';
                    }
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Frequency'),
                flex : 1,
                dataIndex : 'rateUnitDescription'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'status',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Option 1'),
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
            }
        ]
    };

});
