Ext.define('criterion.view.ess.performance.TeamReviews', function() {

    return {

        alias : 'widget.criterion_selfservice_performance_team_reviews',

        extend : 'criterion.view.ess.performance.Reviews',

        requires : [
            'criterion.controller.ess.performance.TeamReviews'
        ],

        controller : {
            type : 'criterion_selfservice_performance_team_reviews'
        },

        viewModel : {
            data : {
                managerMode : true,
                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Employee'),
                        dataIndex : 'employeeFullName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Type'),
                        flex : 1,
                        dataIndex : 'reviewTypeName'
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Review Date'),
                        dataIndex : 'reviewDate',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    }
                ]
            },

            stores : {
                reviewPeriods : {
                    type : 'criterion_review_template_periods',
                    proxy : {
                        extraParams : {
                            employeeId : '{employeeId}',
                            manager : true
                        }
                    }
                }
            },

            formulas : {
                pageTitle : function(data) {
                    return i18n.gettext('Team Reviews');
                }
            }
        },

        userCls : 'with-top-bar',

        header : {

            title : {
                minimizeWidth : true
            },

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'criterion_search_field',
                    checkChangeBuffer : 1000,
                    emptyText : i18n.gettext('Employee'),
                    reference : 'employee',
                    hidden : true,
                    bind : {
                        hidden : '{!reviewPeriod.selection}'
                    },
                    listeners : {
                        change : 'loadReviews'
                    }
                }
            ]
        }

    }
});
