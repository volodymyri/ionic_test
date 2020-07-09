Ext.define('criterion.view.settings.system.dataImport.Main', function() {

    const CONSTS = criterion.Consts,
        API = criterion.consts.Api.API,
        DATA_IMPORT_ACTIONS = CONSTS.DATA_IMPORT_ACTIONS,
        DATA_IMPORT_MODULES = CONSTS.DATA_IMPORT_MODULES;

    return {

        alias : 'widget.criterion_settings_data_import',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.system.dataImport.Main',
            'criterion.view.settings.system.dataImport.*'
        ],

        controller : {
            type : 'criterion_settings_data_import'
        },

        viewModel : {
            data : {
                module : null,
                template : null,
                action : null,
                employer : null,
                employerId : null,
                actionsFilterValues : null
            },
            formulas : {
                actionsFilterValues : {
                    bind : {
                        bindTo : '{template.actions}',
                        deep : true
                    },
                    get : function(actions) {
                        return actions;
                    }
                },
                submitButtonText : {
                    bind : {
                        bindTo : '{action}',
                        deep : true
                    },
                    get : function(action) {
                        if (action && action.getId() === DATA_IMPORT_ACTIONS.VALIDATE) {
                            return i18n.gettext('Activate');
                        }

                        return i18n.gettext('Import');
                    }
                },
                isEmployerComboHidden : function(get) {
                    let template = get('template'),
                        view = this.getView(),
                        employerCombo = view.lookup('employerCombo'),
                        employers = employerCombo.getStore();

                    if (employers.getCount() === 1) {
                        return true;
                    }

                    return !template || template.get('isEmployerIndependent');
                }
            },
            stores : {
                modules : {
                    fields : ['id', 'text'],
                    data : [
                        {
                            id : DATA_IMPORT_MODULES.SYSTEM,
                            text : i18n.gettext('System')
                        },
                        {
                            id : DATA_IMPORT_MODULES.CORE,
                            text : i18n.gettext('Core')
                        },
                        {
                            id : DATA_IMPORT_MODULES.BENEFITS,
                            text : i18n.gettext('Benefits')
                        },
                        {
                            id : DATA_IMPORT_MODULES.TIME_AND_ATTENDANCE,
                            text : i18n.gettext('Time & Attendance')
                        },
                        {
                            id : DATA_IMPORT_MODULES.PAYROLL,
                            text : i18n.gettext('Payroll')
                        },
                        {
                            id : DATA_IMPORT_MODULES.GENERAL,
                            text : i18n.gettext('General')
                        },
                        {
                            id : DATA_IMPORT_MODULES.LEARNING_MANAGEMENT,
                            text : i18n.gettext('Learning management')
                        },
                        {
                            id : DATA_IMPORT_MODULES.RECRUITING,
                            text : i18n.gettext('Recruiting')
                        }
                    ],
                    sorters : [
                        {
                            property : 'id',
                            direction : 'ASC'
                        }
                    ]
                },
                templates : {
                    fields : [
                        'moduleId',
                        'templateIndex',
                        'text',
                        'isEmployerIndependent',
                        'actions',
                        'templateUrl',
                        'disableUpload',
                        'defaultsUrl',
                        {
                            name : 'id',
                            convert : (value, record) => record.get('moduleId') + record.get('templateIndex')
                        },
                        {
                            name : 'templateIndexName',
                            convert : (value, record) => value || record.get('templateIndex')
                        }
                    ],
                    filters : [
                        {
                            property : 'moduleId',
                            disabled : '{!module}',
                            value : '{module.id}',
                            exactMatch : true
                        }
                    ],
                    data : [
                        {
                            moduleId : DATA_IMPORT_MODULES.SYSTEM,
                            templateIndex : 'A',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Code Tables'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.CODE_TABLES_IMPORT_TEMPLATE_DOWNLOAD,
                            defaultsUrl : API.CODE_TABLES_IMPORT_DEFAULTS_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.SYSTEM,
                            templateIndex : 'B',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Employers'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.EMPLOYERS_IMPORT_TEMPLATE_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.SYSTEM,
                            templateIndex : 'C',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Job Codes'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.JOB_CODES_IMPORT_TEMPLATE_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.SYSTEM,
                            templateIndex : 'D',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Data Package'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            disableUpload : true
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.SYSTEM,
                            templateIndex : 'E',
                            isEmployerIndependent : true,
                            text : i18n.gettext('ESS Help'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.ESS_HELP_IMPORT_TEMPLATE_DOWNLOAD,
                            defaultsUrl : API.ESS_HELP_IMPORT_DEFAULTS_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.SYSTEM,
                            templateIndex : 'F',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Publish Site'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.PUBLISH_SITE_IMPORT_TEMPLATE_DOWNLOAD,
                            defaultsUrl : API.PUBLISH_SITE_IMPORT_DEFAULTS_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.SYSTEM,
                            templateIndex : 'G',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Security Profile'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.SECURITY_PROFILE_IMPORT_TEMPLATE_DOWNLOAD,
                            defaultsUrl : API.SECURITY_PROFILE_IMPORT_DEFAULTS_DOWNLOAD
                        },

                        {
                            moduleId : DATA_IMPORT_MODULES.CORE,
                            templateIndex : 'A',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Demographics'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.DEMOGRAPHICS_IMPORT_TEMPLATE_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.CORE,
                            templateIndex : 'B',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Employment Information'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.EMPLOYMENT_IMPORT_TEMPLATE_DOWNLOAD,
                            templateDownloadParams : ['usePositions']
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.CORE,
                            templateIndex : 'C',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Incomes'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.INCOMES_IMPORT_TEMPLATE_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.CORE,
                            templateIndex : 'D',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Employee Incomes'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.EMPLOYEE_INCOMES_IMPORT_TEMPLATE_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.CORE,
                            templateIndex : 'E',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Organization Chart'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.ORGANIZATION_CHART_IMPORT_TEMPLATE_DOWNLOAD
                        },

                        {
                            moduleId : DATA_IMPORT_MODULES.BENEFITS,
                            templateIndex : 'A',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Benefit Plans'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.BENEFIT_PLANS_IMPORT_TEMPLATE_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.BENEFITS,
                            templateIndex : 'B',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Employee Benefit Plans'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.BENEFITS_DEDUCTIONS_IMPORT_TEMPLATE_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.BENEFITS,
                            templateIndex : 'C',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Benefit Rates'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : Ext.String.format(API.BENEFITS_RATES_IMPORT_TEMPLATE_DOWNLOAD, false)
                        },

                        {
                            moduleId : DATA_IMPORT_MODULES.TIME_AND_ATTENDANCE,
                            templateIndex : 'A',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Time Off Plans'),
                            actions : [],
                            templateUrl : API.TIME_OFF_PLANS_IMPORT_TEMPLATE_DOWNLOAD
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.TIME_AND_ATTENDANCE,
                            templateIndex : 'B',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Employee Time Off Balances'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.BALANCES_IMPORT_TEMPLATE_DOWNLOAD
                        },

                        {
                            moduleId : DATA_IMPORT_MODULES.PAYROLL,
                            templateIndex : 'A',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Payroll Setup'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.PAYROLL_IMPORT_SETUP_TEMPLATE
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.PAYROLL,
                            templateIndex : 'B',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Payroll Employee'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.PAYROLL_IMPORT_EMPLOYEE_TEMPLATE
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.PAYROLL,
                            templateIndex : 'C',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Payroll Data'),
                            actions : [
                                DATA_IMPORT_ACTIONS.IMPORT,
                                DATA_IMPORT_ACTIONS.VALIDATE
                            ],
                            templateUrl : API.PAYROLL_IMPORT_DATA_TEMPLATE,
                            beforeDownloadTemplateMethod : 'downloadTemplateHandler5C'
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.PAYROLL,
                            templateIndex : 'CL',
                            templateIndexName : 'C', // override
                            isEmployerIndependent : false,
                            text : i18n.gettext('Payroll Data (Legacy)'),
                            actions : [
                                DATA_IMPORT_ACTIONS.IMPORT,
                                DATA_IMPORT_ACTIONS.VALIDATE
                            ],
                            templateUrl : API.PAYROLL_IMPORT_DATA_LEGACY_TEMPLATE
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.PAYROLL,
                            templateIndex : 'D',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Payroll GL'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.PAYROLL_IMPORT_GL_TEMPLATE
                        },

                        {
                            moduleId : DATA_IMPORT_MODULES.GENERAL,
                            templateIndex : 'A',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Pay Rate Revisions'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.PAY_RATE_REVISION_DOWNLOAD_TEMPLATE
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.GENERAL,
                            templateIndex : 'B',
                            isEmployerIndependent : false,
                            text : i18n.gettext('Employee Time Off Accruals'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.EMPLOYEE_TIME_OFF_ACCRUALS_DOWNLOAD_TEMPLATE
                        },

                        {
                            moduleId : DATA_IMPORT_MODULES.LEARNING_MANAGEMENT,
                            templateIndex : 'A',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Courses By Employer'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.COURSES_BY_EMPLOYER_IMPORT_DOWNLOAD_TEMPLATE
                        },
                        {
                            moduleId : DATA_IMPORT_MODULES.LEARNING_MANAGEMENT,
                            templateIndex : 'B',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Courses By Employee'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.COURSES_BY_EMPLOYEE_IMPORT_DOWNLOAD_TEMPLATE
                        },

                        {
                            moduleId : DATA_IMPORT_MODULES.RECRUITING,
                            templateIndex : 'A',
                            isEmployerIndependent : true,
                            text : i18n.gettext('Job Postings'),
                            actions : [DATA_IMPORT_ACTIONS.IMPORT],
                            templateUrl : API.JOB_POSTINGS_IMPORT_DOWNLOAD_TEMPLATE
                        }
                    ]
                },
                actions : {
                    fields : ['id', 'text'],
                    filters : [
                        {
                            property : 'id',
                            operator : 'in',
                            disabled : '{!template}',
                            value : '{actionsFilterValues}'
                        }
                    ],
                    data : [
                        {
                            id : DATA_IMPORT_ACTIONS.IMPORT,
                            text : i18n.gettext('Import')
                        },
                        {
                            id : DATA_IMPORT_ACTIONS.VALIDATE,
                            text : i18n.gettext('Validate')
                        }
                    ],
                    listeners : {
                        filterchange : 'handleActionsFilterChange'
                    }
                }
            }
        },

        title : i18n.gettext('Data Import'),

        bodyPadding : 25,

        defaultType : 'container',
        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        listeners : {
            afterrender : 'handleAfterRender'
        },

        items : [
            {
                flex : 1,
                layout : {
                    type : 'vbox'
                },
                defaults : {
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                    minWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
                },
                items : [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Module'),
                        bind : {
                            store : '{modules}',
                            selection : '{module}'
                        },
                        displayField : 'text',
                        valueField : 'id',
                        editable : false,
                        sortByDisplayField : false,
                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '<div class="x-boundlist-item">{id}. {text}</div>',
                            '</tpl>'
                        ),
                        displayTpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '{id}. {text}',
                            '</tpl>'
                        )
                    },
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Template Name'),
                        hidden : true,
                        bind : {
                            store : '{templates}',
                            selection : '{template}',
                            hidden : '{!module}'
                        },
                        displayField : 'text',
                        valueField : 'templateIndex',
                        editable : false,
                        sortByDisplayField : false,
                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '<div class="x-boundlist-item">{moduleId}{templateIndexName} - {text}</div>',
                            '</tpl>'
                        ),
                        displayTpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '{moduleId}{templateIndexName} - {text}',
                            '</tpl>'
                        )
                    },
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        reference : 'employerCombo',
                        hidden : true,
                        bind : {
                            hidden : '{isEmployerComboHidden}',
                            selection : '{employer}',
                            value : '{employerId}'
                        },
                        isValid : function(value) {
                            if (this.hidden) {
                                return true;
                            }
                            return this.superclass.isValid.apply(this);
                        }
                    },
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Action'),
                        reference : 'actionCombo',
                        hidden : true,
                        bind : {
                            store : '{actions}',
                            selection : '{action}',
                            hidden : '{!template.actions.length}'
                        },
                        allowBlank : false,
                        valueField : 'value',
                        editable : false,
                        sortByDisplayField : false,
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                        minWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH,
                        listeners : {
                            select : 'handleActionSelect'
                        }
                    },
                    {
                        xtype : 'panel',
                        hidden : true,
                        bind : {
                            hidden : '{!template}'
                        },
                        layout : {
                            type : 'vbox',
                            align : 'right'
                        },
                        items : [
                            {
                                xtype : 'panel',
                                layout : {
                                    type : 'hbox'
                                },
                                items : [
                                    {
                                        xtype : 'panel',
                                        defaults : {
                                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                                            minWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
                                        },
                                        items : [
                                            {
                                                xtype : 'filefield',
                                                fieldLabel : i18n.gettext('Template'),
                                                itemId : 'templateFileField',
                                                buttonText : i18n.gettext('Browse'),
                                                buttonConfig : {
                                                    cls : 'criterion-btn-feature'
                                                },
                                                bind : {
                                                    disabled : '{!template.actions.length || template.disableUpload}',
                                                    hidden : '{template.disableUpload}'
                                                },
                                                emptyText : i18n.gettext('Drop File here or browse'),
                                                buttonOnly : false,
                                                allowBlank : false,
                                                listeners : {
                                                    change : 'handleSelectTemplateFile'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'button',
                                        glyph : criterion.consts.Glyph['ios7-cloud-download'],
                                        tooltip : i18n.gettext('Download Template'),
                                        margin : '0 0 20 20',
                                        cls : 'criterion-btn-primary',
                                        hidden : true,
                                        allowBlank : false,
                                        bind : {
                                            hidden : '{!template.templateUrl}',
                                            templateUrl : '{template.templateUrl}',
                                            beforeDownloadTemplateMethod : '{template.beforeDownloadTemplateMethod}'
                                        },
                                        handler : 'downloadTemplateHandler',
                                        setTemplateUrl : function(url) {
                                            this.templateUrl = url;
                                        },
                                        setBeforeDownloadTemplateMethod : function(method) {
                                            this.beforeDownloadTemplateMethod = method;
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        glyph : criterion.consts.Glyph['ios7-download'],
                                        tooltip : i18n.gettext('Download Defaults'),
                                        margin : '0 0 20 20',
                                        cls : 'criterion-btn-primary',
                                        hidden : true,
                                        allowBlank : false,
                                        bind : {
                                            hidden : '{!template.defaultsUrl}',
                                            defaultsUrl : '{template.defaultsUrl}'
                                        },
                                        handler : 'downloadDefaultsHandler',
                                        setDefaultsUrl : function(url) {
                                            this.defaultsUrl = url;
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'component',
                        autoEl : 'hr',
                        cls : 'criterion-horizontal-ruler',
                        margin : '0 0 20 0',
                        bind : {
                            hidden : '{!template}'
                        }
                    },
                    {
                        xtype : 'panel',
                        layout : 'card',
                        reference : 'templateOptionsPanel',
                        hidden : true,
                        bind : {
                            hidden : '{!action}'
                        },
                        items : [
                            {
                                xtype : 'criterion_settings_data_import_code_tables',
                                reference : 'template_0A'
                            },
                            {
                                xtype : 'criterion_settings_data_import_employers',
                                reference : 'template_0B'
                            },
                            {
                                xtype : 'criterion_settings_data_import_job_codes',
                                reference : 'template_0C'
                            },
                            {
                                xtype : 'criterion_settings_data_import_data_package',
                                reference : 'template_0D'
                            },
                            {
                                xtype : 'criterion_settings_data_import_ess_help',
                                reference : 'template_0E'
                            },
                            {
                                xtype : 'criterion_settings_data_import_publish_site',
                                reference : 'template_0F'
                            },
                            {
                                xtype : 'criterion_settings_data_import_security_profile',
                                reference : 'template_0G'
                            },

                            {
                                xtype : 'criterion_settings_data_import_demographics',
                                reference : 'template_1A'
                            },
                            {
                                xtype : 'criterion_settings_data_import_employment',
                                reference : 'template_1B'
                            },
                            {
                                xtype : 'criterion_settings_data_import_incomes',
                                reference : 'template_1C'
                            },
                            {
                                xtype : 'criterion_settings_data_import_employee_incomes',
                                reference : 'template_1D'
                            },
                            {
                                xtype : 'criterion_settings_data_import_organization_chart',
                                reference : 'template_1E'
                            },

                            {
                                xtype : 'criterion_settings_data_import_benefit_plans',
                                reference : 'template_2A'
                            },
                            {
                                xtype : 'criterion_settings_data_import_benefits_deductions',
                                reference : 'template_2B'
                            },
                            {
                                xtype : 'criterion_settings_data_import_benefit_rates',
                                reference : 'template_2C'
                            },

                            {
                                xtype : 'criterion_settings_data_import_balances',
                                reference : 'template_3B'
                            },

                            {
                                xtype : 'criterion_settings_data_import_payroll_setup',
                                reference : 'template_5A'
                            },
                            {
                                xtype : 'criterion_settings_data_import_payroll_employee',
                                reference : 'template_5B'
                            },
                            {
                                xtype : 'criterion_settings_data_import_payroll_data',
                                reference : 'template_5C'
                            },
                            {
                                xtype : 'criterion_settings_data_import_payroll_data',
                                reference : 'template_5CL',

                                importURL : criterion.consts.Api.API.PAYROLL_IMPORT_DATA_LEGACY_IMPORT,
                                errorsURL : criterion.consts.Api.API.PAYROLL_IMPORT_DATA_LEGACY_ERRORS,
                                dataURL : criterion.consts.Api.API.PAYROLL_IMPORT_DATA_LEGACY,
                                discrepanciesURL : criterion.consts.Api.API.PAYROLL_IMPORT_DATA_LEGACY_DISCREPANCIES
                            },
                            {
                                xtype : 'criterion_settings_data_import_payroll_gl',
                                reference : 'template_5D'
                            },

                            {
                                xtype : 'criterion_settings_data_import_courses_by_employer',
                                reference : 'template_6A'
                            },
                            {
                                xtype : 'criterion_settings_data_import_courses_by_employee',
                                reference : 'template_6B'
                            },

                            {
                                xtype : 'criterion_settings_data_import_job_postings',
                                reference : 'template_7A'
                            },

                            {
                                xtype : 'criterion_settings_data_import_pay_rate_revisions',
                                reference : 'template_9A'
                            },
                            {
                                xtype : 'criterion_settings_data_import_employee_timeoff_accruals',
                                reference : 'template_9B'
                            }
                        ]
                    }
                ]
            }
        ],
        buttons : [
            '->',
            {
                xtype : 'button',
                reference : 'submitButton',
                text : i18n.gettext('Import'),
                cls : 'criterion-btn-primary',
                handler : 'handleSubmit',
                hidden : true,
                bind : {
                    hidden : '{!action}',
                    text : '{submitButtonText}'
                }
            },
            {
                xtype : 'button',
                reference : 'cancel',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel'
            }
        ]
    };
});
