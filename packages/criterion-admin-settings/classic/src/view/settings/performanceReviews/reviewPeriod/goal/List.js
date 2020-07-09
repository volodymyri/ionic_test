Ext.define('criterion.view.settings.performanceReviews.reviewPeriod.goal.List', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_period_goal_list',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.reviewTemplate.period.Goals',
            'criterion.controller.settings.performanceReviews.reviewPeriod.goal.List'
        ],

        controller : {
            type : 'criterion_settings_performance_reviews_review_period_goal_list'
        },

        viewModel : {
            stores : {
                reviewTemplatePeriodGoals : {
                    type : 'criterion_review_template_period_goals',
                    proxy : {
                        extraParams : {
                            reviewPeriodId : '{reviewPeriodId}'
                        }
                    }
                }
            }
        },

        bind : {
            store : '{reviewTemplatePeriodGoals}'
        },

        tbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAddClick'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Import'),
                cls : 'criterion-btn-feature',
                handler : 'handleImportGoals'
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee'),
                dataIndex : 'fullName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Goal Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                dataIndex : 'description',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Review'),
                dataIndex : 'reviewPeriodName',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                encodeHtml : false,
                renderer : (value, metaData, record) => value + '<div class="criterion-darken-gray fs-07">' + Ext.Date.format(record.get('reviewPeriodStart'), criterion.consts.Api.SHOW_DATE_FORMAT) + ' ' + i18n.gettext('to') + ' ' + Ext.Date.format(record.get('reviewPeriodEnd'), criterion.consts.Api.SHOW_DATE_FORMAT) + '</div>'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Weight'),
                dataIndex : 'weightInPercent',
                width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH,
                renderer : value => {
                    if (value === null) {
                        return '';
                    }

                    return Ext.util.Format.percent(value / 100);
                }
            }
        ]

    };

});
