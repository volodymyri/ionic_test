Ext.define('criterion.view.settings.benefits.openEnrollment.StepForm', function() {

    return {
        alias : 'widget.criterion_settings_open_enrollment_step_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.benefits.openEnrollment.StepForm',
            'criterion.store.employer.BenefitPlans',
            'criterion.store.employer.openEnrollment.StepBenefits'
        ],

        title : i18n.gettext('Step'),

        modelValidation : true,

        controller : {
            type : 'criterion_settings_open_enrollment_step_form'
        },

        viewModel : {
            data : {
                loadingState : false,
                stepBenefits : null
            },
            stores : {
                benefitPlans : {
                    type : 'employer_benefit_plans'
                }
            }
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'container',

                items : [
                    {
                        xtype : 'container',

                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        padding : 10,

                        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

                        items : [
                            {
                                xtype : 'component',
                                html : '<span class="blink-text">' + i18n.gettext('Loading...') + '</span>',
                                margin : '10 0 20 0',
                                hidden : true,
                                bind : {
                                    hidden : '{!loadingState}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                name : 'name',
                                bind : {
                                    value : '{record.name}',
                                    hidden : '{loadingState}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                reference : 'benefitType',
                                disableDirtyCheck : true,
                                codeDataId : criterion.consts.Dict.BENEFIT_TYPE,
                                fieldLabel : i18n.gettext('Benefit Types'),
                                allowBlank : false,
                                editable : false,
                                listeners : {
                                    change : 'onBenefitTypeChange'
                                },
                                bind : {
                                    hidden : '{loadingState}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'gridpanel',
                reference : 'benefitPlansGrid',
                cls : 'criterion-grid-panel',

                padding : '0 0 30',

                bind : {
                    store : '{benefitPlans}',
                    hidden : '{loadingState}'
                },

                tbar : [
                    {
                        xtype : 'button',
                        reference : 'addButton',
                        text : i18n.gettext('Add Plan'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddClick'
                        }
                    }
                ],

                scrollable : 'vertical',
                disableSelection : true,

                listeners : {
                    removeaction : 'onBenefitRemove'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'name',
                        text : i18n.gettext('Plan Name'),
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'code',
                        text : i18n.gettext('Plan Code'),
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'carrierName',
                        text : i18n.gettext('Plan Carrier'),
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
            },
            {
                xtype: 'htmleditor',
                reference: 'description',
                enableAlignments: false,
                fieldLabel : i18n.gettext('Step Description'),
                padding: '10 25',
                height: 300,
                resizable: true,
                resizeHandles: 's',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HTMLEDITOR_WIDTH,
                bind : {
                    value : '{record.description}',
                    hidden : '{loadingState}'
                },
                allowBlank : false
            }
        ]
    };

});
