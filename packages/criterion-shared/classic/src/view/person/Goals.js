Ext.define('criterion.view.person.Goals', function() {

    return {
        alias : 'widget.criterion_person_goals',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.person.Goals',
            'criterion.store.reviewScale.Details',
            'criterion.store.employee.Goals',
            'criterion.view.person.Goal',
            'criterion.ux.grid.feature.Summary'
        ],

        cls : 'criterion-person-goals',

        uses : [
            'criterion.view.person.Goal'
        ],

        viewModel : {
            data : {
                checkIsPendingWorkflow : false
            },

            stores : {
                reviewScaleDetails : {
                    type : 'criterion_review_scale_details'
                }
            }
        },

        store : {
            type : 'criterion_employee_goals'
        },

        controller : {
            type : 'criterion_person_goals',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_person_goal',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GOALS, criterion.SecurityManager.CREATE, true)
                }
            },
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

        title : i18n.gettext('Goals'),

        features : [
            {
                ftype : 'criterion_summary'
            }
        ],

        disableGrouping : true,

        viewConfig : {
            getRowClass : function(record, rowIndex, rowParams, store) {
                let reviewIds = [];

                // Store.each() crashes when add grouping in Team Goals
                store.getRange().forEach(rec => {
                    reviewIds.push(rec.get('reviewId'));
                });

                reviewIds = Ext.Array.unique(reviewIds);

                return 'bg-color-' + (Ext.Array.indexOf(reviewIds, record.get('reviewId')) + 1);
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1,
                summaryType : Ext.emptyFn
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Review'),
                dataIndex : 'reviewPeriodName',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                encodeHtml : false,
                renderer : (value, metaData, record) => value + '<div class="criterion-darken-gray fs-07">' + Ext.Date.format(record.get('reviewPeriodStart'), criterion.consts.Api.SHOW_DATE_FORMAT) + ' ' + i18n.gettext('to') + ' ' + Ext.Date.format(record.get('reviewPeriodEnd'), criterion.consts.Api.SHOW_DATE_FORMAT) + '</div>',
                summaryType : function(recs) {
                    let reviews = {};

                    Ext.Array.each(recs, rec => {
                        let reviewId = rec.get('reviewId');

                        if (!reviews[reviewId]) {
                            reviews[reviewId] = rec.get('reviewPeriodName');
                        }
                    });

                    return Ext.Object.getValues(reviews);
                },
                summaryRenderer : periodNames => Ext.Array.map(periodNames, name => '<div class="summary-item">' + name + '</div>').join('')
            },
            {
                xtype : 'criterion_widgetcolumn',
                widget : {
                    xtype : 'numberfield',
                    listeners : {
                        change : 'handleChangeWeight'
                    },
                    selectOnFocus : false,
                    readOnly : true,
                    bind : {
                        readOnly : '{checkIsPendingWorkflow && record.isPendingWorkflow}'
                    }
                },
                text : i18n.gettext('Weight, %'),
                width : 210,
                tdCls : 'weight-in-percent',
                dataIndex : 'weightInPercent',
                encodeHtml : false,
                summaryType : function(recs) {
                    let weights = {};

                    Ext.Array.each(recs, rec => {
                        let reviewId = rec.get('reviewId');

                        if (!weights[reviewId]) {
                            weights[reviewId] = 0;
                        }

                        weights[reviewId] += rec.get('weightInPercent');
                    });

                    return weights;
                },
                summaryRenderer : function(weights) {
                    let values = Ext.Object.getValues(weights),
                        total = Ext.Array.sum(values),
                        count = values.length,
                        summary = '';

                    if (count) {
                        summary = Ext.Array.map(values, weight => {
                            let classes = ['summary-item'];

                            if (weight !== 100) {
                                classes.push('criterion-red');
                            }

                            return '<div class="' + classes.join(' ') + '">' + weight + '%</div>';
                        }).join('');

                        if (total !== (100 * count)) {
                            summary += '<div class="fs-07 criterion-red">' + i18n.gettext('Warning: please check') + ' ' + i18n.ngettext('value', 'values', count) + '<br/>' + i18n.gettext('should be 100%') + '</div>';
                        }
                    }

                    return summary;
                }
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Due Date'),
                dataIndex : 'dueDate',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                summaryType : Ext.emptyFn
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Completed Date'),
                dataIndex : 'completedDate',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                summaryType : Ext.emptyFn
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Rating'),
                dataIndex : 'reviewScaleDetailId',
                renderer : 'scaleRenderer',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                summaryType : Ext.emptyFn
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'status',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                summaryType : Ext.emptyFn
            }
        ]
    };

});
