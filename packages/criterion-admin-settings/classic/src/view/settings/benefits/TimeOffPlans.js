Ext.define('criterion.view.settings.benefits.TimeOffPlans', function() {

    var DICT = criterion.consts.Dict,
        ACCRUAL_PERIOD_CODE = criterion.Consts.ACCRUAL_PERIOD_CODE,
        ACCRUAL_METHOD_TYPE_CODE = criterion.Consts.ACCRUAL_METHOD_TYPE_CODE;

    return {

        alias : 'widget.criterion_employer_time_off_plans',

        allowDelete : true,

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.benefits.TimeOffPlans',
            'criterion.store.employer.TimeOffPlans',
            'criterion.view.employer.TimeOffPlan'
        ],

        store : {
            type : 'criterion_employer_time_off_plans'
        },

        controller : {
            type : 'criterion_employer_time_off_plans',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_employer_time_off_plan',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                listeners : {
                    afterSave : function() {
                        criterion.Utils.toast(i18n.gettext('Time Off Plan saved.'));
                    }
                }
            }
        },

        viewModel : {
            data : {
                disableAccrue : true
            }
        },
        reference : 'grid',
        title : i18n.gettext('Time Off Plans'),

        selType : 'checkboxmodel',
        selModel : {
            checkOnly : true,
            mode : 'MULTI',
            listeners : {
                scope : 'controller',
                selectionchange : 'handleSelectionChange'
            }
        },

        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                context : 'criterion_settings'
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Accrue'),
                cls : 'criterion-btn-feature',
                disabled : true,
                bind : {
                    disabled : '{disableAccrue}'
                },
                handler : 'handleAccrue'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAddClick'
            },
            {
                xtype : 'toggleslidefield',
                labelWidth: 100,
                fieldLabel : i18n.gettext('Show inactive'),
                reference : 'showInactive',
                inputValue : '1',
                listeners : {
                    change : 'handleChangeShowInactive'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Code'),
                dataIndex : 'code'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Name'),
                dataIndex : 'name'
            },
            {
                xtype : 'criterion_codedatacolumn',
                flex : 1,
                text : i18n.gettext('Accrual Method'),
                dataIndex : 'accrualMethodTypeCd',
                codeDataId : DICT.ACCRUAL_METHOD_TYPE
            },
            {
                xtype : 'datecolumn',
                width : 140,
                text : i18n.gettext('Accrual Date'),
                dataIndex : 'accrualDate'
            },
            {
                xtype : 'gridcolumn',
                width : 140,
                text : i18n.gettext('Year End'),
                dataIndex : 'yearEndYear',
                renderer : function(value, metaData, record) {
                    var accrualMethodTypeCode = record.get('accrualMethodTypeCode'),
                        accrualPeriodCode = record.get('accrualPeriodCode'),
                        yearEndDate = record.get('yearEndDate'),
                        yearEndYear = record.get('yearEndYear');

                    /*
                    1) For Accrual method = Fiscal, Accrual Period = Weekly | Bi-Weekly:
                        ‘Year End’ = Year-Month-Day (for example, ‘2018-12-31’)
                    2) For Accrual method = Fiscal, Accrual Period = Annual | Monthly | Semi-Monthly:
                        ‘Year End’ = Month-Day (for example, ‘12-31’)
                     */

                    if (accrualMethodTypeCode === ACCRUAL_METHOD_TYPE_CODE.FISCAL) {

                        if (Ext.Array.indexOf([ACCRUAL_PERIOD_CODE.WEEKLY, ACCRUAL_PERIOD_CODE.BI_WEEKLY], accrualPeriodCode) !== -1) {
                            return yearEndYear + '-' + Ext.Date.format(yearEndDate, criterion.consts.Api.DATE_MONTH_DAY);
                        }

                        if (Ext.Array.indexOf([ACCRUAL_PERIOD_CODE.ANNUAL, ACCRUAL_PERIOD_CODE.MONTHLY, ACCRUAL_PERIOD_CODE.SEMI_MONTHLY], accrualPeriodCode) !== -1) {
                            return Ext.Date.format(yearEndDate, criterion.consts.Api.DATE_MONTH_DAY);
                        }

                    }

                    return '';
                }
            }
        ]
    };
});
