Ext.define('criterion.view.person.Reviews', function() {

    function rendererIfAggregated(value, metaData, record, rowIndex, colIndex) {
        var columnHeader;

        if (record.get('isAggregated')) {
            return '';
        } else {
            columnHeader = this.getColumnManager().getHeaderAtIndex(colIndex);
            return columnHeader.defaultRenderer ? columnHeader.defaultRenderer(value) : value;
        }
    }

    return {
        alias : 'widget.criterion_person_reviews',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.person.Reviews',
            'criterion.store.employee.ReviewsAggregated',
            'criterion.ux.grid.plugin.RowWidgetSync'
        ],

        uses : [
            'criterion.view.person.Review'
        ],

        viewModel : {
            stores : {
                employeeReviewsAggregated : {
                    type : 'criterion_employee_reviews_aggregated'
                }
            }
        },

        bind : {
            store : '{employeeReviewsAggregated}'
        },

        controller : {
            type : 'criterion_person_reviews',
            reloadAfterEditorSave : true,
            loadRecordOnEdit : false,
            editor : null //Will be set in controller
        },

        title : i18n.gettext('Reviews'),

        tbar : [
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        plugins : [
            {
                ptype : 'criterion_row_widget_sync',
                allowExpander : function(record) {
                    return record.get('isAggregated');
                },
                widget : {
                    xtype : 'grid',
                    autoLoad : false,
                    scrollable : false,
                    bind : {
                        store : '{record.reviews}'
                    },
                    border : false,
                    cls : 'sub-grid',
                    hideHeaders : true,
                    listeners : {
                        beforecellclick : 'handleSubGridBeforeCellClick'
                    },
                    columns : Ext.Array.clean([
                        {
                            xtype : 'gridcolumn',
                            dataIndex : '__internalWidthSync__',
                            sortable : false,
                            menuDisabled : true,
                            resizable : false,
                            width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Review Period'),
                            dataIndex : 'reviewPeriodName',
                            flex : 1
                        },
                        {
                            xtype : 'codedatacolumn',
                            text : i18n.gettext('Type'),
                            dataIndex : 'reviewTypeCd',
                            codeDataId : criterion.consts.Dict.REVIEW_TYPE,
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                            renderer : rendererIfAggregated
                        },
                        {
                            xtype : 'datecolumn',
                            text : i18n.gettext('Period Start'),
                            dataIndex : 'periodStart',
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                        },
                        {
                            xtype : 'datecolumn',
                            text : i18n.gettext('Period End'),
                            dataIndex : 'periodEnd',
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                        },
                        {
                            xtype : 'datecolumn',
                            text : i18n.gettext('Review Date'),
                            dataIndex : 'reviewDate',
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                            renderer : rendererIfAggregated
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Reviewed by'),
                            dataIndex : 'reviewerFullName',
                            width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                            renderer : rendererIfAggregated
                        },
                        {
                            xtype : 'booleancolumn',
                            header : i18n.gettext('Published'),
                            align : 'center',
                            dataIndex : 'isPublished',
                            trueText : '✓',
                            falseText : '',
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                        },
                        {
                            xtype : 'booleancolumn',
                            header : i18n.gettext('Viewed'),
                            align : 'center',
                            dataIndex : 'isViewed',
                            trueText : '✓',
                            falseText : '',
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                        }
                    ])
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Review Period'),
                dataIndex : 'reviewPeriodName',
                flex : 1
            },
            {
                xtype : 'codedatacolumn',
                text : i18n.gettext('Type'),
                dataIndex : 'reviewTypeCd',
                codeDataId : criterion.consts.Dict.REVIEW_TYPE,
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                renderer : rendererIfAggregated
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Period Start'),
                dataIndex : 'periodStart',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Period End'),
                dataIndex : 'periodEnd',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Review Date'),
                dataIndex : 'reviewDate',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                renderer : rendererIfAggregated
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Reviewed by'),
                dataIndex : 'reviewerFullName',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                renderer : rendererIfAggregated
            },
            {
                xtype : 'booleancolumn',
                header : i18n.gettext('Published'),
                align : 'center',
                dataIndex : 'isPublished',
                trueText : '✓',
                falseText : '',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'booleancolumn',
                header : i18n.gettext('Viewed'),
                align : 'center',
                dataIndex : 'isViewed',
                trueText : '✓',
                falseText : '',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            }
        ]
    };

});
