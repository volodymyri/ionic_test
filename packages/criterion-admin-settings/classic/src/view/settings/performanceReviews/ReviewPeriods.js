Ext.define('criterion.view.settings.performanceReviews.ReviewPeriods', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_periods',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.reviewTemplate.Periods',
            'criterion.view.settings.performanceReviews.ReviewPeriod',
            'criterion.controller.settings.performanceReviews.ReviewPeriods'
        ],

        title : i18n.gettext('Review Periods'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_performance_reviews_review_periods',
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_performance_reviews_review_period',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_review_template_periods'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Period Name'),
                flex : 1,
                minWidth : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Template Name'),
                flex : 1,
                minWidth : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'reviewTemplateName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Workflow Name'),
                flex : 1,
                minWidth : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'workflowName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee Count'),
                flex : 1,
                minWidth : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'employeeCount'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Frequency'),
                flex : 1,
                minWidth : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'frequencyCode',
                renderer : function(value, metaData, record) {
                    return value === criterion.Consts.REVIEW_PERIOD_FREQUENCY.CUSTOM ? i18n.gettext('Custom') : i18n.gettext('Recurring') + ' (' + record.get('duration') + ' Months)';
                }
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Active'),
                dataIndex : 'isActive',
                width : 120,
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No')
            }
        ]
    };

});
