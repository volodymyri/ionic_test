Ext.define('criterion.view.settings.benefits.openEnrollment.OpenEnrollmentSetup', function() {

    return {
        alias : 'widget.criterion_settings_open_enrollment_setup',

        extend : 'criterion.ux.form.Panel',

        title : i18n.gettext('Open Enrollment Setup'),

        requires : [
            'criterion.controller.settings.benefits.openEnrollment.OpenEnrollmentSetup',
            'criterion.store.employeeGroup.OpenEnrollments',
            'criterion.store.employer.BenefitPlans',
            'criterion.store.employer.IncomeLists'
        ],

        controller : {
            type : 'criterion_settings_open_enrollment_setup'
        },

        viewModel : {
            data : {
                record : null
            },

            formulas : {
                isPhantom : function(data) {
                    return data('record') && data('record').phantom
                }
            },

            stores : {
                employeeGroupOpenEnrollments : {
                    type : 'criterion_employee_group_open_enrollments',
                    autoSync : false
                },
                benefitPlans : {
                    type : 'employer_benefit_plans'
                },
                incomeLists : {
                    type : 'employer_income_lists'
                }
            }
        },

        buttons : [
            {
                xtype : 'button',
                reference : 'delete',
                text : i18n.gettext('Delete'),
                cls : 'criterion-btn-remove',
                listeners : {
                    click : 'handleDeleteClick'
                },
                bind : {
                    hidden : '{isPhantom}'
                }
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancelClick'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Next'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleNextClick'
                }
            }
        ],

        scrollable : true,

        modelValidation : true,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION,
                items : [
                    {
                        plugins : [
                            'criterion_responsive_column'
                        ],
                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'criterion_employer_combo',
                                        fieldLabel : i18n.gettext('Employer'),
                                        name : 'employerId',
                                        disabled : true,
                                        hideTrigger : true,
                                        bind : '{record.employerId}'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Name'),
                                        bind : '{record.name}'
                                    },
                                    {
                                        xtype : 'criterion_employee_group_combobox',
                                        reference : 'employeeGroupCombo',
                                        objectParam : 'openEnrollmentId',
                                        bind : {
                                            valuesStore : '{employeeGroupOpenEnrollments}',
                                            value : '{openEnrollmentEmployeeGroupIds}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Cafe Plan'),
                                        displayField : 'name',
                                        valueField : 'id',
                                        queryMode : 'local',
                                        bind : {
                                            store : '{benefitPlans}',
                                            value : '{record.cafeBenefitPlanId}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Cafe Plan Balance'),
                                        displayField : 'description',
                                        valueField : 'id',
                                        queryMode : 'local',
                                        bind : {
                                            store : '{incomeLists}',
                                            value : '{record.cafeBalanceIncomeListId}'
                                        }
                                    }
                                ]
                            },
                            {
                                defaults : {
                                    labelWidth : 200
                                },
                                items : [
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Open Enrollment Start Date'),
                                        bind : '{record.startDate}'
                                    },
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Open Enrollment End Date'),
                                        bind : '{record.endDate}'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Benefit Plan Start Date'),
                                        bind : '{record.benefitPlanStartDate}'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        flex : 1,
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        plugins : [
                            'criterion_responsive_column'
                        ],
                        items : [
                            {
                                xtype : 'container',
                                flex : 4,
                                layout : 'fit',
                                items : [
                                    {
                                        xtype : 'htmleditor',
                                        reference : 'description',
                                        enableAlignments : false,
                                        fieldLabel : i18n.gettext('Open Enrollment Welcome Page text'),
                                        padding : '10 0 25 0',
                                        bind : {
                                            value : '{record.description}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

        initComponent : function() {
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
