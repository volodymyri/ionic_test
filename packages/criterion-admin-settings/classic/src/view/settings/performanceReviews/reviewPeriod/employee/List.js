Ext.define('criterion.view.settings.performanceReviews.reviewPeriod.employee.List', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_period_employee_list',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.reviewTemplate.period.Employees',
            'criterion.controller.settings.performanceReviews.reviewPeriod.employee.List'
        ],

        controller : {
            type : 'criterion_settings_performance_reviews_review_period_employee_list'
        },

        viewModel : {
            stores : {
                reviewTemplatePeriodEmployees : {
                    type : 'criterion_review_template_period_employees',
                    proxy : {
                        extraParams : {
                            reviewPeriodId : '{reviewPeriodId}'
                        }
                    }
                }
            }
        },

        bind : {
            store : '{reviewTemplatePeriodEmployees}'
        },

        tbar : [
            '->',
            {
                xtype : 'criterion_splitbutton',
                width : 120,
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                menu : [
                    {
                        text : i18n.gettext('Add All'),
                        listeners : {
                            click : 'handleAddAll'
                        }
                    }
                ]
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee'),
                flex : 1,
                minWidth : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'employeeName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Type'),
                flex : 1,
                dataIndex : 'is360',
                renderer : function(value, metaData, record) {
                    return value ? i18n.gettext('360°') : record.get('reviewType');
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Reviewer'),
                flex : 1,
                minWidth : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'reviewerName',
                bind : {
                    hidden : '{is360}'
                }
            },

            {
                xtype : 'datecolumn',
                dataIndex : 'periodStart',
                text : i18n.gettext('Period Start'),
                width : 130
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'periodEnd',
                text : i18n.gettext('Period End'),
                width : 130
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'reviewDate',
                text : i18n.gettext('Review Date'),
                width : 130
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'reviewDeadline',
                text : i18n.gettext('Review Deadline'),
                width : 130
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Status'),
                flex : 1,
                minWidth : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'status'
            }
        ],

        getEmployeesData() {
            return this.getController().getEmployeesData();
        }

    };

});
