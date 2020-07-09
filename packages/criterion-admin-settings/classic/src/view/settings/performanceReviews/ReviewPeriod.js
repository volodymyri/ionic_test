Ext.define('criterion.view.settings.performanceReviews.ReviewPeriod', function() {

    const REVIEW_TYPE_STATUSES = criterion.Consts.REVIEW_TYPE_STATUSES,
        REVIEW_PERIOD_FREQUENCY = criterion.Consts.REVIEW_PERIOD_FREQUENCY;

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_period',

        extend : 'criterion.ux.BreadcrumbPanel',

        requires : [
            'criterion.store.ReviewTemplates',
            'criterion.store.Workflows',
            'criterion.controller.settings.performanceReviews.ReviewPeriod',
            'criterion.view.settings.performanceReviews.reviewPeriod.Employees',
            'criterion.view.settings.performanceReviews.reviewPeriod.Goals'
        ],

        defaults : {
            labelWidth : 200,
            bodyPadding : '0 10'
        },

        bodyPadding : 0,
        cls : 'criterion-form',
        scrollable : 'vertical',

        controller : {
            type : 'criterion_settings_performance_reviews_review_period',
            externalUpdate : false
        },

        viewModel : {
            data : {
                record : null, // must be defined as inner form will create it's own object
                workflowEmployerId : null, // for sync with goal pages
                isPhantom : true,
                selectedEmployee : null,
                selectedEmployeeName : null,
                selectedGoalId : null,

                isInLoading : false
            },
            stores : {
                reviewTemplates : {
                    type : 'criterion_review_templates'
                },
                workflows : {
                    type : 'criterion_workflows'
                },
                goalEmployees : {
                    type : 'store'
                }
            },
            formulas : {
                filterByCodes : data => data('record.is360') ? [] : [REVIEW_TYPE_STATUSES.SELF, REVIEW_TYPE_STATUSES.MANAGER],
                isCustomFrequency : data => data('record.frequencyCode') === REVIEW_PERIOD_FREQUENCY.CUSTOM,
                isRecurringFrequency : data => data('record.frequencyCode') === REVIEW_PERIOD_FREQUENCY.RECURRING,
                isFirstCard : data => data('activeViewIndex') === 0,
                isLastCard : function(get) {
                    return get('activeViewIndex') && get('activeViewIndex') === this.getView().items.length - 1 || get('isPhantom');
                },
                extraInfo : data => data('templateName'),
                selectedGoalIsPhantom : data => data('selectedGoalId') < 0,
                blockedState : data => data('isInLoading')
            }
        },

        dockedItems : [
            {
                dock : 'bottom',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                hidden : true,
                bind : {
                    hidden : '{selectedEmployeeName || selectedGoalId}'
                },
                items : [
                    {
                        xtype : 'container',
                        cls : 'buttons-container',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        flex : 1,
                        padding : '5 10',
                        items : [
                            {
                                xtype : 'button',
                                reference : 'delete',
                                text : i18n.gettext('Delete'),
                                cls : 'criterion-btn-remove',
                                listeners : {
                                    click : 'handleDeleteClick'
                                },
                                minWidth : 100,
                                bind : {
                                    disabled : '{blockedState}',
                                    hidden : '{isPhantom}'
                                }
                            },
                            {
                                flex : 1
                            },
                            {
                                xtype : 'button',
                                reference : 'previous',
                                text : i18n.gettext('Previous'),
                                cls : 'criterion-btn-primary',
                                minWidth : 100,
                                listeners : {
                                    click : 'handlePrevClick'
                                },
                                margin : '0 0 0 10',
                                bind : {
                                    disabled : '{blockedState}',
                                    hidden : '{isFirstCard}'
                                }
                            },
                            {
                                xtype : 'button',
                                reference : 'cancel',
                                text : i18n.gettext('Cancel'),
                                cls : 'criterion-btn-light',
                                minWidth : 100,
                                listeners : {
                                    click : 'handleCancelClick'
                                },
                                margin : '0 0 0 10',
                                bind : {
                                    disabled : '{blockedState}',
                                    hidden : '{hideCancel}'
                                }
                            },
                            {
                                xtype : 'button',
                                reference : 'next',
                                text : i18n.gettext('Next'),
                                cls : 'criterion-btn-primary',
                                minWidth : 100,
                                listeners : {
                                    click : 'handleNextClick'
                                },
                                margin : '0 0 0 10',
                                bind : {
                                    disabled : '{blockedState}',
                                    hidden : '{isLastCard}'
                                }
                            },
                            {
                                xtype : 'button',
                                reference : 'submit',
                                text : i18n.gettext('Save'),
                                cls : 'criterion-btn-primary',
                                minWidth : 100,
                                listeners : {
                                    click : 'handleSubmitClick'
                                },
                                margin : '0 0 0 10',
                                bind : {
                                    disabled : '{blockedState}',
                                    hidden : '{!isLastCard}'
                                }
                            }
                        ]
                    }
                ]
            },

            // for employee form
            {
                dock : 'bottom',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                hidden : true,
                bind : {
                    hidden : '{!selectedEmployeeName}'
                },
                items : [
                    {
                        xtype : 'container',
                        cls : 'buttons-container',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        flex : 1,
                        padding : '5 10',
                        items : [
                            {
                                xtype : 'button',
                                text : i18n.gettext('Delete Employee'),
                                cls : 'criterion-btn-remove',
                                handler : 'handleDeleteEmployee',
                                minWidth : 100
                            },
                            {
                                flex : 1
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Back'),
                                cls : 'criterion-btn-light',
                                minWidth : 100,
                                handler : 'handleBackFromEmployee',
                                margin : '0 0 0 10'
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Save'),
                                cls : 'criterion-btn-primary',
                                minWidth : 100,
                                handler : 'handleSaveEmployee',
                                margin : '0 0 0 10'
                            }
                        ]
                    }
                ]
            },

            // for goal form
            {
                dock : 'bottom',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                hidden : true,
                bind : {
                    hidden : '{!selectedGoalId}'
                },
                items : [
                    {
                        xtype : 'container',
                        cls : 'buttons-container',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        flex : 1,
                        padding : '5 10',
                        items : [
                            {
                                xtype : 'button',
                                text : i18n.gettext('Delete Goal'),
                                cls : 'criterion-btn-remove',
                                handler : 'handleDeleteGoal',
                                minWidth : 100,
                                bind : {
                                    hidden : '{selectedGoalIsPhantom}'
                                }
                            },
                            {
                                flex : 1
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Back'),
                                cls : 'criterion-btn-light',
                                minWidth : 100,
                                handler : 'handleBackFromGoal',
                                margin : '0 0 0 10'
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Save'),
                                cls : 'criterion-btn-primary',
                                minWidth : 100,
                                handler : 'handleSaveGoal',
                                margin : '0 0 0 10'
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.getViewModel().set('record', record);
            this.getController().handleAfterRecordLoad(record);
        },

        onBeforeHideForm : function() {
            this.getController().handleCancelClick();

            return false;
        },

        getRecord : function() {
            return this.getViewModel().get('record');
        },

        getDeleteConfirmMessage : function(record) {
            return Ext.util.Format.format(i18n.gettext('Do you want to delete the record?'));
        },

        updateRecord : Ext.emptyFn,

        initComponent : function() {
            let me = this;

            criterion.detectDirtyForms && Ext.GlobalEvents.on('beforeHideForm', me.onBeforeHideForm, me);

            this.items = [
                {
                    xtype : 'criterion_form',
                    reference : 'periodForm',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    title : i18n.gettext('Review Period'),
                    header : {
                        hidden : true
                    },
                    minHeight : 450,

                    items : [
                        {
                            xtype : 'criterion_panel',
                            layout : 'hbox',

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                            plugins : [
                                'criterion_responsive_column'
                            ],

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Period Name'),
                                            allowBlank : false,
                                            bind : {
                                                value : '{record.name}'
                                            }
                                        },
                                        {
                                            xtype : 'combobox',
                                            reference : 'reviewTemplateField',
                                            fieldLabel : i18n.gettext('Template'),
                                            bind : {
                                                value : '{record.reviewTemplateId}',
                                                store : '{reviewTemplates}'
                                            },
                                            displayField : 'name',
                                            valueField : 'id',
                                            editable : false,
                                            allowBlank : false,
                                            queryMode : 'local',
                                            emptyText : i18n.gettext('Not Selected'),
                                            listeners : {
                                                change : 'onTemplateChange'
                                            },
                                            /* eslint-disable */
                                            // @formatter:off
                                            tpl : Ext.create(
                                                'Ext.XTemplate',
                                                '<ul class="x-list-plain">',
                                                '<tpl for=".">',
                                                '<li role="option" class="x-boundlist-item item-enab-{isActive}">{name}</li>',
                                                '</tpl>',
                                                '</ul>'
                                            )
                                            // @formatter:on
                                            /* eslint-enable */
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field_multi_select',
                                            codeDataId : criterion.consts.Dict.REVIEW_TYPE,
                                            fieldLabel : i18n.gettext('Type'),
                                            allowBlank : false,
                                            reference : 'reviewType',
                                            sortByDisplayField : false,
                                            editable : false,
                                            bind : {
                                                filterByCodes : '{filterByCodes}'
                                            }
                                        },
                                        {
                                            xtype : 'combobox',
                                            reference : 'workflowField',
                                            fieldLabel : i18n.gettext('Workflow'),
                                            bind : {
                                                store : '{workflows}',
                                                value : '{record.workflowId}'
                                            },
                                            forceSelection : true,
                                            displayField : 'name',
                                            valueField : 'id',
                                            editable : false,
                                            allowBlank : false,
                                            queryMode : 'local',
                                            emptyText : i18n.gettext('Not Selected'),
                                            listeners : {
                                                change : 'handleWorkflowChange'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field_multi_select',
                                            codeDataId : criterion.consts.Dict.REVIEW_TYPE,
                                            fieldLabel : i18n.gettext('Anonymous Type'),
                                            reference : 'anonymousType',
                                            sortByDisplayField : false,
                                            editable : false,
                                            bind : {
                                                filterByCodes : '{filterByCodes}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Active'),
                                            name : 'isActive',
                                            bind : {
                                                value : '{record.isActive}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('360&deg; Review'),
                                            inputValue : true,
                                            disabled : true,
                                            name : 'is360',
                                            bind : {
                                                disabled : '{!isPhantom}',
                                                value : '{record.is360}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Aggregate Reviews'),
                                            inputValue : true,
                                            name : 'isAggregatedReview',
                                            bind : {
                                                value : '{record.isAggregatedReview}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Show Aggregated Overall Score'),
                                            inputValue : true,
                                            disabled : true,
                                            hidden : true,
                                            name : 'isAggregatedOverallScoreDisplayed',
                                            bind : {
                                                disabled : '{!record.isAggregatedReview}',
                                                value : '{record.isAggregatedOverallScoreDisplayed}',
                                                hidden : '{!record.isAggregatedReview}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.gettext('Organization'),
                                            codeDataId : criterion.consts.Dict.ORG_STRUCTURE,
                                            editable : false,
                                            forceSelection : true,
                                            allowBlank : false,
                                            store : {
                                                sorters : [{
                                                    property : 'attribute1',
                                                    direction : 'ASC'
                                                }]
                                            },
                                            bind : {
                                                value : '{record.orgStructureCd}'
                                            }
                                        },
                                        {
                                            xtype : 'combobox',
                                            fieldLabel : i18n.gettext('Anonymous Level'),
                                            store : Ext.create('Ext.data.Store', {
                                                fields : ['text', 'value'],
                                                data : Ext.Object.getValues(criterion.Consts.ANONYMOUS_LEVEL),
                                            }),
                                            displayField : 'text',
                                            valueField : 'value',
                                            queryMode : 'local',
                                            forceSelection : true,
                                            autoSelect : true,
                                            bind : {
                                                value : '{record.anonymousLevel}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },

                        //
                        {
                            xtype : 'criterion_panel',
                            layout : 'hbox',
                            style : {
                                'border-top' : '1px solid #e8e8e8 !important'
                            },

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                            plugins : [
                                'criterion_responsive_column'
                            ],

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.gettext('Frequency'),
                                            codeDataId : criterion.consts.Dict.REVIEW_FREQUENCY,
                                            editable : false,
                                            forceSelection : true,
                                            allowBlank : false,
                                            name : 'frequencyCd',
                                            listeners : {
                                                change : 'handleChangeFrequency'
                                            },
                                            bind : {
                                                value : '{record.frequencyCd}'
                                            }
                                        },

                                        // for custom
                                        {
                                            xtype : 'datefield',
                                            fieldLabel : i18n.gettext('Period Start'),
                                            allowBlank : false,
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                value : '{record.periodStart}',
                                                disabled : '{!isCustomFrequency}',
                                                hidden : '{!isCustomFrequency}'
                                            }
                                        },
                                        {
                                            xtype : 'datefield',
                                            fieldLabel : i18n.gettext('Period End'),
                                            allowBlank : false,
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                value : '{record.periodEnd}',
                                                disabled : '{!isCustomFrequency}',
                                                hidden : '{!isCustomFrequency}'
                                            }
                                        },
                                        // for recurring
                                        {
                                            xtype : 'textarea',
                                            fieldLabel : i18n.gettext('Period Start'),
                                            allowBlank : false,
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                value : '{record.periodStartStr}',
                                                disabled : '{!isRecurringFrequency}',
                                                hidden : '{!isRecurringFrequency}'
                                            }
                                        },
                                        {
                                            xtype : 'textarea',
                                            fieldLabel : i18n.gettext('Period End'),
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                hidden : '{!isRecurringFrequency}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        // for custom
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Duration (months)'),
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                hidden : '{!isCustomFrequency}'
                                            }
                                        },
                                        {
                                            xtype : 'datefield',
                                            fieldLabel : i18n.gettext('Review Date'),
                                            allowBlank : false,
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                value : '{record.reviewDate}',
                                                disabled : '{!isCustomFrequency}',
                                                hidden : '{!isCustomFrequency}'
                                            }
                                        },
                                        {
                                            xtype : 'datefield',
                                            fieldLabel : i18n.gettext('Review Deadline'),
                                            allowBlank : false,
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                value : '{record.reviewDeadline}',
                                                disabled : '{!isCustomFrequency}',
                                                hidden : '{!isCustomFrequency}'
                                            }
                                        },
                                        // for recurring
                                        {
                                            xtype : 'combobox',
                                            fieldLabel : i18n.gettext('Duration (months)'),
                                            store : Ext.create('Ext.data.Store', {
                                                fields : ['id', 'text'],
                                                data : Ext.Array.map(criterion.Utils.range(1, 12), function(val) {
                                                    return {
                                                        id : val,
                                                        text : val
                                                    };
                                                })
                                            }),
                                            allowBlank : false,
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                value : '{record.duration}',
                                                disabled : '{!isRecurringFrequency}',
                                                hidden : '{!isRecurringFrequency}'
                                            },
                                            queryMode : 'local',
                                            valueField : 'id',
                                            displayField : 'text',
                                            forceSelection : true,
                                            autoSelect : true,
                                            editable : false,
                                            name : 'duration'
                                        },
                                        {
                                            xtype : 'textarea',
                                            fieldLabel : i18n.gettext('Review Date'),
                                            allowBlank : false,
                                            disabled : true,
                                            hidden : true,
                                            bind : {
                                                value : '{record.reviewDateStr}',
                                                disabled : '{!isRecurringFrequency}',
                                                hidden : '{!isRecurringFrequency}'
                                            }
                                        },
                                        {
                                            xtype : 'textarea',
                                            fieldLabel : i18n.gettext('Review Deadline'),
                                            disabled : true,
                                            hidden : true,
                                            allowBlank : false,
                                            bind : {
                                                value : '{record.reviewDeadlineStr}',
                                                disabled : '{!isRecurringFrequency}',
                                                hidden : '{!isRecurringFrequency}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },

                {
                    xtype : 'criterion_form',
                    reference : 'employeePanel',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    title : i18n.gettext('Employees'),
                    bodyPadding : 0,
                    header : {
                        hidden : true
                    },
                    scrollable : 'vertical',

                    items : [
                        {
                            xtype : 'criterion_settings_performance_reviews_review_period_employees',
                            reference : 'reviewPeriodEmployees',
                            bind : {
                                reviewPeriodId : '{record.id}',
                                is360 : '{record.is360}'
                            },
                            listeners : {
                                changeSelectEmployee : 'handleChangeSelectEmployee',
                                beforeLoadData : 'onBeforeLoadData',
                                afterLoadData : 'onAfterLoadData'
                            }
                        }
                    ]
                },

                {
                    xtype : 'criterion_form',
                    reference : 'goalPanel',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    title : i18n.gettext('Goals'),
                    bodyPadding : 0,
                    header : {
                        hidden : true
                    },
                    scrollable : 'vertical',

                    items : [
                        {
                            xtype : 'criterion_settings_performance_reviews_review_period_goals',
                            reference : 'reviewPeriodGoals',
                            bind : {
                                reviewPeriodId : '{record.id}'
                            },
                            listeners : {
                                changeSelectGoal : 'handleChangeSelectGoal',
                                beforeLoadData : 'onBeforeLoadData',
                                afterLoadData : 'onAfterLoadData'
                            }
                        }
                    ]
                }

            ];

            this.callParent(arguments);
            this.setKeyNavigation();
        },

        destroy() {
            Ext.destroy(this.keyNav);
            this.callParent();
        },

        setKeyNavigation() {
            let controller = this.getController();

            this.keyNav = new Ext.util.KeyMap({
                target : window,
                binding : [
                    {
                        key : Ext.event.Event.ESC,
                        handler : controller.navCancelHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.DELETE,
                        handler : controller.navDeleteHandler,
                        scope : controller
                    }
                ]
            });
        }
    };

});

