Ext.define('criterion.view.settings.benefits.Deductions', function() {

    const DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES,
        DEDUCTION_CALC_METHOD = criterion.consts.Dict.DEDUCTION_CALC_METHOD;

    return {

        alias : 'widget.criterion_settings_deductions',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.Deductions',
            'criterion.view.settings.benefits.Deduction',
            'criterion.controller.employer.GridView'
        ],

        title : i18n.gettext('Deductions'),

        store : {
            type : 'employer_deductions'
        },

        controller : {
            type : 'criterion_employer_gridview',
            connectParentView : {
                parentForSpecified : true
            },
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_deduction',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : '60%'
                    }
                ]
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Code'),
                dataIndex : 'code'
            },
            {
                xtype : 'gridcolumn',
                flex : 2,
                text : i18n.gettext('Description'),
                dataIndex : 'description'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Employee Contribution'),
                dataIndex : 'employeeAmount',
                renderer : (value, metaData, record) => {
                    if (!value) {
                        return ''
                    }

                    let deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
                        dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, DEDUCTION_CALC_METHOD),
                        code = dedRec && dedRec.get('code'),
                        isPercent;

                    if (code === DEDUCTION_CALC_METHOD_CODES.GARNISHMENT) {
                        return value;
                    } else {
                        isPercent = code && Ext.Array.contains([DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS, DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH, DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT], code);

                        return isPercent ? Ext.util.Format.percent(value) : Ext.util.Format.currency(value);

                    }
                }
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Employer Contribution'),
                dataIndex : 'employerAmount',
                renderer : (value, metaData, record) => {
                    let deductionCalcMethodCd = record.get('deductionCalcMethodCd'),
                        dedRec = criterion.CodeDataManager.getCodeDetailRecord('id', deductionCalcMethodCd, DEDUCTION_CALC_METHOD),
                        code = dedRec && dedRec.get('code'),
                        employerMatch = record.get('employerMatch');

                    switch (code) {
                        case DEDUCTION_CALC_METHOD_CODES.AMOUNT:
                        case DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_AMOUNT:
                            return Ext.util.Format.currency(value);

                        case DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS:
                            return Ext.util.Format.percent(value);

                        case DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT:
                            return Ext.util.Format.percent(value);

                        case DEDUCTION_CALC_METHOD_CODES.AMOUNT_MATCH:
                            return employerMatch;

                        case DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH:
                            return employerMatch;

                        default:
                            return value
                    }
                }
            },
            {
                xtype : 'criterion_codedatacolumn',
                flex : 1,
                text : i18n.gettext('Deduction Limit'),
                dataIndex : 'deductionLimitCd',
                codeDataId : criterion.consts.Dict.DEDUCTION_LIMIT
            },
            {
                xtype : 'criterion_codedatacolumn',
                flex : 1,
                text : i18n.gettext('Calc Method'),
                dataIndex : 'deductionCalcMethodCd',
                codeDataId : DEDUCTION_CALC_METHOD
            },
            {
                xtype : 'booleancolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No'),
                text : i18n.gettext('Active'),
                dataIndex : 'isActive'
            }
        ]

    };

});

