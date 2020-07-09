Ext.define('criterion.view.settings.performanceReviews.ReviewTemplate', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_template',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.ReviewCompetencies',
            'criterion.store.reviewTemplate.Competencies',
            'criterion.store.reviewTemplate.CompetenciesTree',
            'criterion.store.ReviewScales',
            'criterion.controller.settings.performanceReviews.ReviewTemplate'
        ],

        controller : {
            type : 'criterion_settings_performance_reviews_review_template',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                reviewTemplateCompetenciesTree : {
                    type : 'criterion_review_template_competencies_tree'
                },
                reviewCompetencies : {
                    type : 'criterion_review_competencies',
                    proxy : {
                        extraParams : {
                            activeOnly : true
                        }
                    }
                },
                reviewTemplateDetails : {
                    type : 'criterion_review_template_competencies',
                    sorters : [{
                        property : 'sequence',
                        direction : 'ASC'
                    }],
                    listeners : {
                        datachanged : 'handleReviewTemplateDetailsChange'
                    }
                },
                reviewScales : {
                    type : 'criterion_review_scales'
                }
            },

            formulas : {
                totalCompetencyWeights : data => {
                    let total = 0,
                        recalculate = data('_recalculate'),
                        weights = data('record.weights');

                    weights.each(function(cWeight) {
                        total += cWeight.get('weightInPercent');
                    });

                    return total;
                },

                disableSave : data => data('blockedState') || data('totalCompetencyWeights') !== 100,

                validationTotal : data => data('totalCompetencyWeights') !== 100 ? '<br><span class="criterion-red">' + i18n._('Total weight for groups should be 100%') + '</span>' : '',

                goalWeight : {
                    get : function(get) {
                        let goalWeight = get('record.goalWeight');

                        return goalWeight * 100;
                    },

                    set : function(value) {
                        this.set('record.goalWeight', value / 100);
                    }
                }
            }
        },

        bodyPadding : 0,

        header : {
            title : i18n._('Review Template Details')
        },

        initComponent : function() {

            this.items = [
                {
                    xtype : 'criterion_panel',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                    bodyPadding : '0 10',

                    layout : 'hbox',
                    plugins : [
                        'criterion_responsive_column'
                    ],

                    items : [
                        {
                            items : [
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Template Name'),
                                    name : 'name',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'textarea',
                                    fieldLabel : i18n._('Description'),
                                    name : 'description',
                                    flex : 1
                                },
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n._('Review Scale'),
                                    queryMode : 'local',
                                    allowBlank : false,
                                    name : 'reviewScaleId',
                                    displayField : 'name',
                                    valueField : 'id',
                                    bind : {
                                        store : '{reviewScales}'
                                    }
                                }
                            ]
                        },
                        {
                            defaults : {
                                labelWidth : 300
                            },
                            items : [
                                {
                                    xtype : 'component',
                                    bind : {
                                        html : '{validationTotal}'
                                    }
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n._('Active'),
                                    name : 'isActive'
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n._('Recruiting Template'),
                                    name : 'isRecruiting',
                                    bind : '{record.isRecruiting}'
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n._('Allow Manual Competency Rating'),
                                    name : 'isCompetencyManualRating'
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n._('Allow Manual Goal Rating'),
                                    bind : {
                                        hidden : '{record.isRecruiting}',
                                        disabled : '{record.isRecruiting}'
                                    },
                                    name : 'isGoalManualRating'
                                }
                            ]
                        }
                    ]
                },

                {
                    xtype : 'criterion_panel',
                    layout : 'hbox',
                    title : i18n._('Goals'),
                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                    plugins : [
                        'criterion_responsive_column'
                    ],
                    bind : {
                        hidden : '{record.isRecruiting}'
                    },
                    margin : '0 0 20 0',
                    items : [
                        {
                            items : [
                                {
                                    xtype : 'label',
                                    cls : 'x-form-item-label x-form-item-label-default x-unselectable',
                                    html : '<span class="x-form-item-label-inner x-form-item-label-inner-default">' + i18n._('Balance') + '&nbsp;</span>',
                                    margin : '0 0 0 10'
                                },
                                {
                                    xtype : 'container',
                                    layout : 'hbox',
                                    margin : '0 0 0 10',
                                    items : [
                                        {
                                            bind : {
                                                html : i18n._('Competencies') + '<br>{record.competencyWeightInPercent}%'
                                            },
                                            margin : '7 15 0 0'
                                        },
                                        {
                                            xtype : 'slider',
                                            flex : 1,
                                            bind : {
                                                value : '{goalWeight}',
                                                disabled : '{record.isRecruiting}'
                                            }
                                        },
                                        {
                                            bind : {
                                                html : i18n._('Goals') + '<br>{record.goalWeightInPercent}%'
                                            },
                                            margin : '7 0 0 15'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n._('Goal Scale'),
                                    queryMode : 'local',
                                    allowBlank : false,
                                    name : 'goalReviewScaleId',
                                    displayField : 'name',
                                    valueField : 'id',
                                    margin : '30 0 0 0',
                                    bind : {
                                        store : '{reviewScales}',
                                        disabled : '{record.isRecruiting}'
                                    }
                                }
                            ]
                        }
                    ]
                },

                {
                    xtype : 'treepanel',
                    reference : 'tree',
                    reserveScrollbar : true,
                    useArrows : true,
                    rootVisible : false,
                    multiSelect : false,
                    animate : false,

                    tbar : {
                        style : {
                            'border-bottom' : '1px solid #CCC !important'
                        },
                        items : [
                            '->',
                            {
                                xtype : 'button',
                                reference : 'addButton',
                                text : i18n._('Add'),
                                cls : 'criterion-btn-feature',
                                listeners : {
                                    scope : this.getController(),
                                    click : 'handleModifyTemplateDetails'
                                }
                            },
                            {
                                xtype : 'button',
                                text : i18n._('Weights'),
                                cls : 'criterion-btn-feature',
                                maxWidth : 200,
                                listeners : {
                                    click : 'handleManageGroups'
                                }
                            }
                        ]
                    },

                    bind : {
                        store : '{reviewTemplateCompetenciesTree}'
                    },

                    hideHeaders : true,
                    viewConfig : {
                        plugins : {
                            ptype : 'treeviewdragdrop',
                            containerScroll : true
                        }
                    },
                    listeners : {
                        beforedrop : 'handleDropCompetencyItem',
                        removeaction : 'handleRemoveCompetency'
                    },
                    columns : [
                        {
                            xtype : 'treecolumn',
                            dataIndex : 'name',
                            flex : 1,
                            sortable : true
                        },
                        {
                            xtype : 'criterion_actioncolumn',
                            width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                            tdCls : 'x-unselectable',
                            items : [
                                {
                                    glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                    tooltip : i18n.gettext('Delete'),
                                    action : 'removeaction',
                                    getClass : (v, m, record) => (record && !record.get('leaf')) && 'hidden-el',
                                    isActionDisabled : (view, rowIndex, colIndex, item, rec) => rec && !rec.get('leaf')
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    };

});
