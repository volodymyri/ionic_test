Ext.define('criterion.view.person.Review', function() {

    return {
        alias : 'widget.criterion_person_review',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.person.Review',
            'criterion.store.reviewTemplate.Periods',
            'criterion.store.employee.ReviewDetails',
            'criterion.store.reviewScale.Details',
            'criterion.store.ReviewCompetencies',
            'criterion.view.CustomFieldsContainer'
        ],

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.Review
                 */
                record : null,

                /**
                 * @type criterion.model.reviewTemplate.Period
                 */
                reviewPeriod : null
            },
            stores : {
                reviewPeriods : {
                    type : 'criterion_review_template_periods'
                },
                reviewDetails : {
                    type : 'criterion_employee_review_details'
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
                    grouper : {
                        property : 'reviewCompetencyGroupCd',
                        sortProperty : 'groupSequence',
                        transform : function(sequence) {
                            return parseInt(sequence, 10) || Number.MAX_VALUE
                        }
                    }
                }
            },
            formulas : {
                isPublishDisallowed : function(data) {
                    return !data('record.reviewDate') || data('record.isViewed') || !data('isApproved') || data('record.isAggregatedReviewDetail') || data('record.isPublished');
                },

                isPublishForReviewerDisallowed : function(data) {
                    return !data('record.reviewDate') || !data('isApproved') || data('record.isAggregatedReviewDetail');
                },

                isPublishForManagerDisallowed : function(data) {
                    return !data('record.reviewDate') || !data('isApproved') || data('record.isAggregatedReviewDetail');
                },

                isApproved : function(data) {
                    return data('record.reviewStatusCode') === criterion.Consts.WORKFLOW_STATUSES.APPROVED;
                },
                showSave : {
                    bind : {
                        bindTo : '{record}',
                        deep : true
                    },
                    get : function(record) {
                        if (!record) {
                            return false;
                        }

                        return (record.modified ? (
                                    (typeof record.modified['isPublished'] === 'boolean') ||
                                    (typeof record.modified['isPublishedForReviewer'] === 'boolean') ||
                                    (typeof record.modified['isPublishedForManager'] === 'boolean'))
                                : false) &&
                            this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_REVIEWS, criterion.SecurityManager.UPDATE, false, true));
                    }
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_REVIEWS, criterion.SecurityManager.DELETE, false, true));
                },

                allowReviewedField : function(get) {
                    var anonymousLevel = get('record.anonymousLevel'),
                        manager = true, // is in HR
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

        controller : {
            type : 'criterion_person_review',
            externalUpdate : false
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        setButtonConfig : function() {
            var buttons = [];

            if (this.getAllowDelete()) {
                buttons.push(
                    {
                        xtype : 'button',
                        reference : 'delete',
                        text : i18n.gettext('Delete'),
                        cls : 'criterion-btn-remove',
                        listeners : {
                            click : 'handleDeleteClick'
                        },
                        hidden : true,
                        bind : {
                            disabled : '{disableDelete}',
                            hidden : '{hideDelete}'
                        }
                    },
                    '->'
                )
            }

            buttons.push(
                '->',
                {
                    xtype : 'button',
                    text : i18n.gettext('Download'),
                    handler : 'handleDownload'
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
                },
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    handler : 'handleSubmitClick',
                    text : i18n.gettext('Save'),
                    hidden : true,
                    bind : {
                        hidden : '{!showSave}'
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
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Publish'),
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{record.isPublished}',
                                    disabled : '{isPublishDisallowed}',
                                    hidden : '{record.isAggregatedReviewDetail}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Publish to Reviewer'),
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{record.isPublishedForReviewer}',
                                    disabled : '{isPublishForReviewerDisallowed}',
                                    hidden : '{!isApproved || record.isAggregatedReviewDetail}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Publish to Manager'),
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{record.isPublishedForManager}',
                                    disabled : '{isPublishForManagerDisallowed}',
                                    hidden : '{!isApproved || record.isAggregatedReviewDetail}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Viewed'),
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{record.isViewed}',
                                    hidden : '{record.isAggregatedReviewDetail}'
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
            {
                xtype : 'criterion_panel',
                reference : 'competencies',
                margin : '0 15 0 15',
                defaults : {
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    }
                },
                hidden : true,
                bind : {
                    hidden : '{!isApproved}'
                },
                items : [
                    // filled dynamically
                ]
            },

            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                bind : {
                    hidden : '{isPhantom}'
                }
            },
            {
                xtype : 'criterion_customfields_container',
                reference : 'customfieldsReview',
                entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_REVIEW,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                hideTopBlock : true,
                hideBottomBlock : true,
                suppressCaption : true,
                readOnly : true,
                bind : {
                    hidden : '{isPhantom}'
                }
            },

            //goals
            {
                xtype : 'criterion_panel',
                title : i18n.gettext('Goals'),
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                reference : 'goals',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                hidden : true,
                bind : {
                    hidden : '{!isApproved}'
                },
                items : []
            },
            // score
            {
                xtype : 'criterion_panel',
                title : i18n.gettext('Score'),
                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                hidden : true,
                bind : {
                    hidden : '{!isApproved}'
                },
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
