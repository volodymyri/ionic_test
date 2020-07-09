Ext.define('criterion.view.ess.performance.Reviews', function() {

    return {

        alias : 'widget.criterion_selfservice_performance_reviews',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.store.employee.ReviewsAggregated',
            'criterion.store.reviewTemplate.Periods',
            'criterion.store.reviewScale.Details',
            'criterion.store.ReviewCompetencies',
            'criterion.store.employee.ReviewDetails',
            'criterion.store.employee.Goals',
            'criterion.controller.ess.performance.Reviews',
            'criterion.view.CustomFieldsContainer'
        ],

        viewModel : {
            data : {
                managerMode : false,
                hideScore : true,

                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Reviewer'),
                        dataIndex : 'reviewerFullName'
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
                        flex : 1,
                        dataIndex : 'reviewDate',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Approver'),
                        dataIndex : 'approverFullName'
                    }
                ]
            },
            stores : {
                reviewPeriods : {
                    type : 'criterion_review_template_periods',
                    proxy : {
                        extraParams : {
                            employeeId : '{employeeId}'
                        }
                    }
                },
                employeeReviews : {
                    type : 'criterion_employee_reviews_aggregated',
                    proxy : {
                        extraParams : {
                            employeeId : '{employeeId}'
                        }
                    }
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
                pageTitle : function(data) {
                    return i18n.gettext('Performance Review for ') + data('employeeFullName');
                }
            }
        },

        bind : {
            title : '{pageTitle}'
        },

        layout : {
            type : 'card'
        },

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        controller : {
            type : 'criterion_selfservice_performance_reviews'
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        frame : true,

        ui : 'no-footer',

        items : [
            {
                xtype : 'container',
                reference : 'reviewGrid',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        xtype : 'container',
                        layout : {
                            type : 'hbox'
                        },
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Review Period'),
                                reference : 'reviewPeriod',
                                bind : {
                                    store : '{reviewPeriods}'
                                },
                                flex : 1,
                                displayField : 'name',
                                valueField : 'id',
                                tpl : Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item">{name} ({periodStart:date(criterion.consts.Api.SHOW_DATE_FORMAT)} &mdash; {periodEnd:date(criterion.consts.Api.SHOW_DATE_FORMAT)})</li>',
                                    '</tpl></ul>'),
                                displayTpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{name} ({periodStart:date(criterion.consts.Api.SHOW_DATE_FORMAT)} - {periodEnd:date(criterion.consts.Api.SHOW_DATE_FORMAT)})',
                                    '</tpl>'
                                ),
                                queryMode : 'local',
                                editable : false,
                                margin : '0 0 20 0',
                                listeners : {
                                    change : 'handleReviewPeriodChange'
                                }
                            },
                            {
                                flex : 1
                            }
                        ]
                    },

                    {
                        xtype : 'criterion_gridpanel',

                        bind : {
                            store : '{employeeReviews}',
                            columns : '{columns}'
                        },

                        frame : true,

                        padding : 0,

                        listeners : {
                            itemclick : 'handleReviewView'
                        }
                    }
                ]
            },

            // form
            {
                xtype : 'criterion_panel',

                reference : 'reviewForm',

                frame : true,

                ui : 'clean',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                viewModel : {
                    data : {
                        /**
                         * @type criterion.model.employee.Review
                         */
                        record : null,

                        reviewGoalsCount : 0
                    },

                    formulas : {
                        showGoals : function(get) {
                            var goalsCount = get('reviewGoalsCount'),
                                codeRecord = criterion.CodeDataManager.getCodeDetailRecord('id', get('record.reviewTypeCd'), criterion.consts.Dict.REVIEW_TYPE),
                                stateCode = codeRecord ? codeRecord.get('code') : null,
                                REVIEW_TYPE_STATUSES = criterion.Consts.REVIEW_TYPE_STATUSES;

                            return goalsCount > 0 && stateCode &&
                                (Ext.Array.indexOf([REVIEW_TYPE_STATUSES.SELF, REVIEW_TYPE_STATUSES.MANAGER], stateCode) !== -1);
                        },
                        allowReviewedField : function(get) {
                            var anonymousLevel = get('record.anonymousLevel'),
                                manager = get('managerMode'),
                                admin = !!criterion.Api.getAuthResult().isSystemAdministrator,
                                employee = !manager && !admin;

                            if (employee && anonymousLevel !== 0) {
                                return false;
                            }
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

                defaults : {
                    bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM
                },

                bodyPadding : 0,

                scrollable : true,

                bbar : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Download'),
                        listeners : {
                            click : 'handleDownload'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Close'),
                        ui : 'light',
                        listeners : {
                            click : 'handleClose'
                        }
                    }
                ],

                items : [
                    {
                        xtype : 'criterion_panel',
                        layout : 'hbox',
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        ui : 'clean',

                        items : [
                            {
                                xtype : 'container',

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
                                    }
                                ]
                            },
                            {
                                xtype : 'container',

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

                        ui : 'clean',

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

                        defaults : {
                            ui : 'clean'
                        },

                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        items : [
                            // filled dynamically
                        ]
                    },
                    {
                        xtype : 'criterion_form',

                        ui : 'clean',

                        reference : 'competencies',

                        bodyPadding : 0,

                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        defaults : {
                            ui : 'clean'
                        },

                        items : [
                            // filled dynamically
                        ]
                    },
                    {
                        xtype : 'component',
                        autoEl : 'hr',
                        cls : 'criterion-horizontal-ruler'
                    },
                    {
                        xtype : 'criterion_customfields_container',
                        reference : 'customfieldsReview',
                        entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_REVIEW,
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                        hideTopBlock : true,
                        hideBottomBlock : true,
                        suppressCaption : true,
                        readOnly : true
                    },
                    // score
                    {
                        xtype : 'criterion_panel',
                        title : i18n.gettext('Score'),
                        layout : 'hbox',
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        ui : 'clean',

                        items : [
                            {
                                xtype : 'container',

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
                                xtype : 'container',

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
                ]
            },
            {
                xtype : 'criterion_panel',

                reference : 'reviewAggregatedForm',

                cls : 'criterion-person-review-aggregated',

                frame : true,

                ui : 'clean',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                viewModel : {
                    data : {
                        record : null,
                        employeeId : null
                    }
                },

                defaults : {
                    bodyPadding : 10
                },

                bodyPadding : 0,

                scrollable : true,

                bbar : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Download'),
                        listeners : {
                            click : 'handleDownloadAggregated'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Close'),
                        ui : 'light',
                        listeners : {
                            click : 'handleClose'
                        }
                    }
                ],

                items : []
            }
        ]
    }
});
