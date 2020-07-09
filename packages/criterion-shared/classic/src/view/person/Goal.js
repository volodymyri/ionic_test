Ext.define('criterion.view.person.Goal', function() {

    return {

        alias : 'widget.criterion_person_goal',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.person.Goal',
            'criterion.store.employee.ReviewsList',
            'criterion.store.reviewScale.Details',
            'criterion.store.Workflows'
        ],

        viewModel : {
            data : {
                hidePlaceholder : false,
                readOnly : false,
                selectedPeriod : null,
                reviewScaleId : null
            },
            stores : {
                reviews : {
                    type : 'criterion_employee_reviews_list'
                },
                goalReviewScaleDetails : {
                    type : 'criterion_review_scale_details',
                    sorters : [
                        {
                            property : 'rating',
                            direction : 'ASC'
                        }
                    ]
                },
                workflows : {
                    type : 'criterion_workflows'
                }
            },

            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GOALS, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GOALS, criterion.SecurityManager.DELETE, false, true));
                },

                status : function(data) {
                    let period = data('selectedPeriod');

                    return !period && data('isPhantom') ||
                            period && period.get('isActive') && (!period.get('reviewDeadline') || period.get('reviewDeadline').getTime() > Ext.Date.clearTime(new Date())) ? i18n.gettext('Active') : i18n.gettext('Not Active');
                },

                weightInPercent : {
                    get : function(get) {
                        return get('record.weightInPercent');
                    },

                    set : function(value) {
                        let floatValue = Ext.Number.parseFloat(value);

                        this.set('record.weight', isNaN(floatValue) ? 0 : floatValue / 100);
                    }
                },

                workflowReadOnly : data => data('readOnly') || !data('isPhantom'),
                workflowAllowBlank : data => data('workflowReadOnly'),
                disableRating : data => !data('reviewScaleId') || !data('goalReviewScaleDetails.count')
            }
        },

        controller : {
            type : 'criterion_person_goal',
            externalUpdate : false
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaultType : 'container',

        initComponent() {
            this.items = [
                {
                    layout : 'hbox',

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                    defaultType : 'container',

                    items : [
                        {
                            items : [
                                ...this.getAdditionalFields(),
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Name'),
                                    bind : {
                                        value : '{record.name}',
                                        readOnly : '{readOnly}'
                                    },
                                    allowBlank : false
                                },
                                {
                                    xtype : 'textarea',
                                    fieldLabel : i18n.gettext('Description'),
                                    bind : {
                                        value : '{record.description}',
                                        readOnly : '{readOnly}'
                                    },
                                    allowBlank : false
                                },
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.gettext('Review'),
                                    reference : 'reviewField',
                                    bind : {
                                        store : '{reviews}',
                                        value : '{record.reviewId}',
                                        readOnly : '{readOnly}'
                                    },
                                    listeners : {
                                        change : 'onReviewChange'
                                    },
                                    queryMode : 'local',
                                    forceSelection : true,
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

                                    editable : false,
                                    allowBlank : false
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel : i18n.gettext('Status'),
                                    bind : '{status}',
                                    margin : '0 0 8 0'
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Due Date'),
                                    bind : {
                                        value : '{record.dueDate}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_placeholder_field',
                                    height : 10,
                                    hidden : true,
                                    bind : {
                                        hidden : '{hidePlaceholder}'
                                    }
                                },
                                {
                                    xtype : 'container',
                                    layout : {
                                        type : 'hbox',
                                        align : 'stretch'
                                    },
                                    items : [
                                        {
                                            xtype : 'numberfield',
                                            flex : 1,
                                            fieldLabel : i18n.gettext('Weight'),
                                            minValue : 0,
                                            maxValue : 100,
                                            bind : {
                                                value : '{weightInPercent}',
                                                readOnly : '{readOnly}'
                                            }
                                        },
                                        {
                                            xtype : 'component',
                                            html : '%',
                                            margin : '7 0 0 10'
                                        }
                                    ]
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
                    layout : 'hbox',

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                    defaultType : 'container',

                    items : [
                        {
                            items : [
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.gettext('Rating'),
                                    reference : 'ratingCombo',
                                    disabled : true,
                                    bind : {
                                        store : '{goalReviewScaleDetails}',
                                        value : '{record.reviewScaleDetailId}',
                                        readOnly : '{readOnly}',
                                        disabled : '{disableRating}',
                                        filters : {
                                            property : 'reviewScaleId',
                                            value : '{reviewScaleId}',
                                            exactMatch : true
                                        }
                                    },
                                    queryMode : 'local',
                                    sortByDisplayField : false,
                                    displayField : 'name',
                                    valueField : 'id',
                                    forceSelection : true,
                                    editable : false,
                                    autoSelect : true
                                },
                                {
                                    xtype : 'textarea',
                                    fieldLabel : i18n.gettext('Review Description'),
                                    bind : {
                                        value : '{record.reviewComments}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Completed Date'),
                                    bind : {
                                        value : '{record.completedDate}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'combobox',
                                    reference : 'workflowField',
                                    fieldLabel : i18n.gettext('Workflow'),
                                    bind : {
                                        store : '{workflows}',
                                        value : '{record.workflowId}',
                                        readOnly : '{workflowReadOnly}',
                                        allowBlank : '{workflowAllowBlank}'
                                    },
                                    displayField : 'name',
                                    valueField : 'id',
                                    editable : true,
                                    queryMode : 'local',
                                    forceSelection : true,
                                    allowBlank : false
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        },

        getAdditionalFields() {
            return [];
        },

        loadRecord(record) {
            this.lookupController().loadRecord(record);
        }
    };

});
