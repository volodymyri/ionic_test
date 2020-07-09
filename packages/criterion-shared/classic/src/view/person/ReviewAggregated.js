Ext.define('criterion.view.person.ReviewAggregated', function() {

    return {
        alias : 'widget.criterion_person_review_aggregated',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.person.ReviewAggregated',
            'criterion.store.reviewScale.Details',
            'criterion.store.reviewTemplate.Periods'
        ],

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.ReviewAggregated
                 */
                record : null,
                hideScore : true
            },
            stores : {
                reviewPeriods : {
                    type : 'criterion_review_template_periods'
                },
                reviewScaleDetails : {
                    type : 'criterion_review_scale_details',
                    sorters : [{
                        property : 'rating',
                        direction : 'ASC'
                    }]
                }
            },
            formulas : {
                hideDelete : function() {
                    return true;
                },
                hideSave : function() {
                    return true;
                },
                isPublishDisallowed : function(data) {
                    return data('record.isViewed');
                }
            }
        },

        controller : {
            type : 'criterion_person_review_aggregated',
            externalUpdate : false
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        setButtonConfig : function() {
            var buttons = [];

            buttons.push(
                '->',
                {
                    xtype : 'button',
                    text : i18n.gettext('Download'),
                    handler : 'handleDownloadAggregated'
                },
                {
                    xtype : 'button',
                    reference : 'cancel',
                    cls : 'criterion-btn-light',
                    handler : 'handleCancelClick',
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                }
            );

            this.buttons = buttons;
        },

        defaultType : 'container',

        items : [
            {
                xtype : 'criterion_panel',
                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Review Period'),
                                readOnly : true,
                                bind : {
                                    value : '{record.reviewPeriodName}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Period Start'),
                                readOnly : true,
                                bind : {
                                    value : '{record.periodStart}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Period End'),
                                readOnly : true,
                                bind : {
                                    value : '{record.periodEnd}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Review Date'),
                                readOnly : true,
                                bind : {
                                    value : '{record.reviewDate}',
                                    visible : '{record.reviewDate}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Publish'),
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{record.isPublished}',
                                    disabled : '{isPublishDisallowed}',
                                    hidden : '{!record.isAggregatedReview}'
                                },
                                listeners : {
                                    change : 'onPublishChange'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Publish to Reviewer'),
                                hidden : true,
                                bind : {
                                    value : '{record.isPublishedForReviewer}',
                                    disabled : '{isPublishDisallowed}',
                                    hidden : '{!record.isAggregatedReview}'
                                },
                                listeners : {
                                    change : 'onPublishForReviewerChange'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Publish to Manager'),
                                hidden : true,
                                bind : {
                                    value : '{record.isPublishedForManager}',
                                    disabled : '{isPublishDisallowed}',
                                    hidden : '{!record.isAggregatedReview}'
                                },
                                listeners : {
                                    change : 'onPublishForManagerChange'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Viewed'),
                                disabled : true,
                                bind : {
                                    value : '{record.isViewed}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr'
            },
            //goals
            {
                xtype : 'criterion_panel',
                title : i18n.gettext('Goals'),
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                hidden : true,
                reference : 'goals',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                items : []
            },
            {
                xtype : 'component',
                autoEl : 'hr'
            },
            {
                xtype : 'criterion_panel',
                title : i18n.gettext('Score'),
                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_gridview',
                                sortableColumns : false,
                                reference : 'competencyGroupsGrid',
                                border : 1,
                                tbar : null,
                                flex : 1,
                                store : Ext.create('Ext.data.Store'),
                                columns : {
                                    items : [
                                        {
                                            xtype : 'gridcolumn',

                                            text : i18n.gettext('Competency Group'),

                                            dataIndex : 'competencyName'
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Total Competency Score'),
                                labelWidth : 180,
                                readOnly : true,
                                bind : {
                                    value : '{record.competencyScoreInPercent}%'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Total Goal Score'),
                                labelWidth : 180,
                                readOnly : true,
                                bind : {
                                    value : '{record.goalScoreInPercent}%'
                                }
                            },
                            {
                                xtype : 'container',
                                flex : 1,
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Overall Score'),
                                        labelWidth : 180,
                                        readOnly : true,
                                        width : 265,
                                        bind : {
                                            value : '{record.overallScoreInPercent}%'
                                        }
                                    },
                                    {
                                        xtype : 'textfield',
                                        bind : {
                                            value : '{record.overallRatingReviewScaleName}'
                                        },
                                        flex : 1,
                                        readOnly : true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.getController() && this.getController().loadRecord(record);
        }
    };

});
