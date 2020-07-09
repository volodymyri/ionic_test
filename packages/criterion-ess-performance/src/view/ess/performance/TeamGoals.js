Ext.define('criterion.view.ess.performance.TeamGoals', function() {
    return {
        alias : 'widget.criterion_selfservice_performance_team_goals',

        extend : 'criterion.view.ess.performance.MyGoals',

        requires : [
            'criterion.controller.ess.performance.TeamGoals',
            'criterion.view.ess.performance.TeamGoal',
            'criterion.store.employee.TeamGoals'
        ],

        controller : {
            type : 'criterion_selfservice_performance_team_goals',

            editor : {
                xtype : 'criterion_selfservice_performance_team_goal'
            }
        },

        viewModel : {
            data : {
                employeeName : ''
            },

            stores : {
                teamEmployees : {
                    type : 'store'
                }
            }
        },

        store : {
            type : 'criterion_employee_team_goals',
            groupField : 'employeeId',
            sorters : [
                {
                    property : 'reviewId',
                    direction : 'ASC'
                }
            ]
        },

        features : [
            {
                ftype : 'grouping',
                showSummaryRow : true,

                groupHeaderTpl : [
                    i18n.gettext('Employee'),
                    ': {children:this.formatName}',
                    {
                        formatName : name => name.length ? name[0].get('fullName') : ''
                    }
                ]
            }
        ],

        cls : 'criterion-selfservice-team-goals',

        title : i18n.gettext('Team Goals'),

        header : {
            items : [
                {
                    xtype : 'criterion_search_field',
                    cls : 'criterion-search-field-side-bg-color',
                    emptyText : i18n.gettext('Employee'),
                    checkChangeBuffer : 1000,
                    bind : {
                        value : '{employeeName}'
                    },
                    listeners : {
                        change : 'handleChangeEmployeeName'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'combobox',
                    bind : {
                        store : '{employeeReviews}',
                        value : '{reviewId}',
                        hidden : '{!employeeReviews.count}'
                    },
                    queryMode : 'local',
                    editable : true,
                    valueField : 'id',

                    tpl : Ext.create(
                        'Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item {list-cls}">{reviewPeriodName} <div class="criterion-darken-gray fs-07">({periodStart:date("m/d/Y")} to {periodEnd:date("m/d/Y")})</div></div>',
                        '</tpl>'
                    ),
                    displayTpl : Ext.create(
                        'Ext.XTemplate',
                        '<tpl for=".">',
                        '{reviewPeriodName} ({periodStart:date("m/d/Y")} to {periodEnd:date("m/d/Y")})',
                        '</tpl>'
                    ),

                    listeners : {
                        beforeselect : 'handleBeforeReviewSelect',
                        change : 'handleReviewChange'
                    },
                    triggers : {
                        clear : {
                            type : 'clear',
                            cls : 'criterion-clear-trigger',
                            hideWhenEmpty : true
                        }
                    },
                    emptyText : i18n.gettext('Select Review')
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'import',
                    text : i18n.gettext('Import'),
                    ui : 'feature',
                    handler : 'handleImportGoals'
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'addButton',
                    text : i18n.gettext('Add'),
                    ui : 'feature',
                    handler : 'handleAddClick'
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
                    handler : 'handleRefreshClick'
                }
            ]
        }

    }
});
