Ext.define('criterion.view.ess.dashboard.ReviewForm', function() {

    var REVIEW_TYPE_STATUSES = criterion.Consts.REVIEW_TYPE_STATUSES;

    return {
        alias : 'widget.criterion_selfservice_dashboard_review_form',

        extend : 'criterion.ux.form.Panel',

        cls : 'criterion-ess-panel',

        requires : [
            'criterion.controller.ess.dashboard.ReviewForm',
            'criterion.store.employee.ReviewDetails',
            'criterion.store.employee.Goals',
            'criterion.store.reviewTemplate.Periods',
            'criterion.store.reviewScale.Details',
            'criterion.store.ReviewCompetencies',

            'criterion.view.CustomFieldsContainer'
        ],

        controller : {
            type : 'criterion_selfservice_dashboard_review_form'
        },

        viewModel : {
            data : {
                record : null,
                selectedPeriod : null,
                reviewGoalsCount : 0
            },
            stores : {
                reviewDetails : {
                    type : 'criterion_employee_review_details'
                },
                reviewGoals : {
                    type : 'criterion_employee_goals'
                },
                reviewPeriods : {
                    type : 'criterion_review_template_periods'
                },
                reviewScaleDetails : {
                    type : 'criterion_review_scale_details',
                    sorters : [{
                        property : 'rating',
                        direction : 'ASC'
                    }]
                },
                reviewCompetencies : {
                    type : 'criterion_review_competencies',
                    sorters : [{
                        property : 'sequence',
                        direction : 'ASC'
                    }],
                    grouper : {
                        property : 'reviewCompetencyGroupCd',
                        sortProperty : 'groupSequence'
                    }
                }
            },
            formulas : {
                showGoals : {
                    get : function(data) {
                        var goalsCount = data('reviewGoalsCount'),
                            codeRecord = criterion.CodeDataManager.getCodeDetailRecord('id', data('record.reviewTypeCd'), criterion.consts.Dict.REVIEW_TYPE),
                            stateCode = codeRecord ? codeRecord.get('code') : null;

                        return goalsCount > 0 && stateCode &&
                            (Ext.Array.indexOf([REVIEW_TYPE_STATUSES.SELF, REVIEW_TYPE_STATUSES.MANAGER], stateCode) !== -1);
                    }
                },
                allowReviewedField : function(get) {
                    var anonymousLevel = get('record.anonymousLevel'),
                        manager = true, // dashboard form showed only for the manager
                        admin = !!criterion.Api.getAuthResult().isSystemAdministrator;

                    if (manager && anonymousLevel >= 2) {
                        return false;
                    }
                    if (admin && anonymousLevel === 3) {
                        return false;
                    }

                    return true;
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : {
            bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'criterion_panel',
                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                reference : 'periodCombo',
                                fieldLabel : i18n.gettext('Review Period'),
                                bind : {
                                    store : '{reviewPeriods}',
                                    value : '{record.reviewPeriodId}'
                                },
                                queryMode : 'local',
                                displayField : 'name',
                                valueField : 'id',
                                readOnly : true
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
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Review Deadline'),
                                readOnly : true,
                                bind : {
                                    value : '{record.reviewDeadline}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Review type'),
                                codeDataId : criterion.consts.Dict.REVIEW_TYPE,
                                bind : {
                                    value : '{record.reviewTypeCd}'
                                },
                                readOnly : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Reviewed By'),
                                readOnly : true,
                                hidden : true,
                                bind : {
                                    value : '{record.reviewerFullName}',
                                    hidden : '{!allowReviewedField}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Review Date'),
                                readOnly : true,
                                bind : {
                                    value : '{record.reviewDate}',
                                    visible : '{record.reviewDate}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_form',

                header : {
                    title : i18n.gettext('Goals'),
                    padding : '15 25 0'
                },

                style : {
                    'border-top' : '1px solid #f2f2f2 !important'
                },

                reference : 'goals',

                hidden : true,
                bind : {
                    hidden : '{!showGoals}'
                },

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                defaults : {
                    bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM
                },

                items : [
                    // filled dynamically
                ]
            },
            {
                xtype : 'criterion_form',

                reference : 'competencies',

                bodyPadding : 0,

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                defaults : {
                    bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM
                },

                items : [
                    // filled dynamically
                ]
            },
            {
                xtype : 'criterion_form',

                style : {
                    'border-top' : '1px solid #f2f2f2 !important'
                },

                header : {
                    title : i18n.gettext('Custom'),
                    padding : '15 25 0'
                },

                bodyPadding : '0 20',

                items : [
                    {
                        xtype : 'criterion_customfields_container',
                        defaults : {
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            flex : 1
                        },
                        reference : 'customfieldsReview',
                        entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_REVIEW,
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                        hideTopBlock : true,
                        hideBottomBlock : true,
                        suppressCaption : true,
                        isResponsive : false,
                        bind : {
                            readOnly : '{needApprove}'
                        }
                    }
                ]
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
                                border : 1,
                                tbar : null,
                                bind : {
                                    store : '{record.competencyGroupScores}'
                                },
                                flex : 1,
                                columns : {
                                    items : [
                                        {
                                            xtype : 'criterion_codedatacolumn',
                                            dataIndex : 'reviewCompetencyGroupCd',
                                            codeDataId : criterion.consts.Dict.REVIEW_COMPETENCY_GROUP,
                                            flex : 1,
                                            text : i18n.gettext('Competency Group')
                                        },
                                        {
                                            width : 100,
                                            dataIndex : 'scoreInPercent',
                                            text : i18n.gettext('Score'),
                                            renderer : function(value) {
                                                return Ext.util.Format.format('{0}%', value);
                                            }
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
                                readOnly : true,
                                labelWidth : 180,
                                bind : {
                                    value : '{record.competencyScoreInPercent}%'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Total Goal Score'),
                                readOnly : true,
                                labelWidth : 180,
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

        loadReview : function(opts) {
            return this.getController().loadReview(opts);
        },

        getReviewData : function() {
            return this.getController().getReviewData();
        },

        getReviewCustomData : function() {
            return this.getController().getReviewCustomData();
        },

        submitReview : function() {
            return this.getController().submitReview();
        }
    }

});
