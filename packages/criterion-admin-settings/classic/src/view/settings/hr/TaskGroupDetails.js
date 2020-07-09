Ext.define('criterion.view.settings.hr.TaskGroupDetails', function() {

    return {
        alias : 'widget.criterion_settings_task_group_details',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.hr.TaskGroupDetails',
            'criterion.view.settings.hr.TaskGroupDetail'
        ],

        margin : '5 0 0 0',
        flex : 2,

        viewModel : {
            formulas : {
                percentSum : {
                    bind : {
                        bindTo : '{record}',
                        deep : true
                    },
                    get : function(record) {
                        return record && Ext.util.Format.percent(record.details().sum('allocation') / 100);
                    }
                }
            }
        },

        controller : {
            type : 'criterion_settings_task_group_details',
            connectParentView : false,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_settings_task_group_detail',
                allowDelete : false
            }
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddTaskGroupDetail'
                },
                bind : {
                    disabled : '{disableAdd}'
                }
            },
            '->',
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Show Inactive'),
                reference : 'showInactive',
                bind : {
                    hidden : '{isPhantom}'
                },
                listeners : {
                    change : 'handleChangeShowInactive'
                }
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                bind : {
                    hidden : '{isPhantom}'
                },
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Auto Allocate'),
                dataIndex : 'autoAllocate',
                align : 'center',
                trueText : '✓',
                falseText : '-',
                flex : 1
            },
            {
                xtype : 'numbercolumn',
                dataIndex : 'allocation',
                align : 'center',
                flex : 1,
                renderer : value => {
                    if (value === null) {
                        return '';
                    }

                    return Ext.util.Format.percent(value / 100);
                },
                bind : {
                    text : i18n.gettext('Allocation') + ' ({percentSum})'
                }
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'startDate',
                text : i18n.gettext('Start Date'),
                flex : 1
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'endDate',
                text : i18n.gettext('End Date'),
                flex : 1
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };
});
