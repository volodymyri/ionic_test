Ext.define('criterion.view.ess.performance.MyGoals', function() {
    return {
        alias : 'widget.criterion_selfservice_performance_my_goals',

        extend : 'criterion.view.person.Goals',

        requires : [
            'criterion.controller.ess.performance.MyGoals',
            'criterion.view.ess.performance.Goal'
        ],

        controller : {
            type : 'criterion_selfservice_performance_my_goals',

            editor : {
                xtype : 'criterion_selfservice_performance_goal'
            }
        },

        viewModel : {
            data : {
                canSubmit : false,
                checkIsPendingWorkflow : true,

                reviewId : null
            },

            stores : {
                employeeReviews : {
                    type : 'store'
                },
                submitWorkflows : {
                    type : 'criterion_workflows'
                }
            }
        },

        frame : true,

        tbar : null,

        fbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Submit'),
                handler : 'handleSubmitWeights',
                disabled : true,
                bind : {
                    disabled : '{!canSubmit}'
                }
            }
        ],

        header : {
            items : [
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
