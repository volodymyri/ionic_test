Ext.define('criterion.view.settings.System', function() {

    return {
        alias : 'widget.criterion_settings_system',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.employer.Companies',
            'criterion.view.settings.system.*'
        ],

        layout: {
            type: 'card',
            deferredRender: true
        },

        title : i18n.gettext('System Configuration'),

        plugins : [
            {
                ptype : 'criterion_security_items'
            }
        ],

        items: [
            {
                xtype : 'criterion_settings_password_policies',
                title : i18n.gettext('Password Policies'),
                reference : 'passwordPolicies',
                securityAccess : true
            },
            {
                xtype : 'criterion_employer_companies',
                title : i18n.gettext('Employers'),
                reference : 'employers',
                securityAccess : true
            },
            {
                xtype : 'criterion_employer_custom_fields',
                reference : 'interfaceT4',
                securityAccess : true,
                title : i18n.gettext('Payroll Interface T4 Settings'),
                entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_PAYROLL_INTERFACE_T4_SETTINGS
            },
            {
                xtype : 'criterion_settings_general_ledger',
                title : i18n.gettext('General Ledger'),
                reference : 'generalLedger',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_custom_fields',
                reference : 'customFields',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_system_custom_field_formats',
                reference : 'customFieldFormats',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_custom_reports',
                reference : 'customReports',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_code_tables',
                reference : 'codeTables',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_classification_codes',
                reference : 'classificationCodes',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_security_profiles',
                reference : 'securityProfiles',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_field_configuration',
                reference : 'fieldConfiguration',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_static_tokens',
                reference : 'staticTokens',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_workflows',
                reference : 'workflow',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_task_schedules',
                reference : 'taskScheduler',
                securityAccess : true
            },
            {
                xtype : 'criterion_payroll_settings_pay_settings',
                reference : 'paySettings',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_system_tax_engine',
                reference : 'taxEngine',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_system_overtime_rules',
                reference : 'overtimeRules',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_system_custom_localizations',
                reference : 'customLocalizations',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_custom_transfers',
                reference : 'customTransfers',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_system_ess_help',
                reference : 'essHelp',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_data_import',
                reference : 'dataImport',
                securityAccess : true
            },
            {
                xtype : 'criterion_report_settings_form',
                title : i18n.gettext('Report Settings'),
                reference : 'reportSettings',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_sandbox',
                title : i18n.gettext('Sandbox'),
                reference : 'sandboxSettings',
                securityAccess : function() {
                    return criterion.SecurityManager.hasSandbox();
                }
            },
            {
                xtype : 'criterion_settings_external_systems',
                title : i18n.gettext('External Systems'),
                reference : 'externalSystems',
                securityAccess : true
            },
            {
                xtype : 'criterion_payroll_settings_system_compensation_types',
                title : i18n.gettext('Compensation Type'),
                reference : 'compensationTypes',
                securityAccess : true
            },
            {
                xtype : 'criterion_payroll_settings_system_deduction_types',
                title : i18n.gettext('Deduction Type'),
                reference : 'deductionTypes',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_system_email_layouts',
                reference : 'emailLayouts',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_system_apps',
                title : i18n.gettext('Apps'),
                reference : 'apps',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_ess_widgets',
                title : i18n.gettext('ESS Widgets'),
                reference : 'essWidgets',
                securityAccess : true
            },
            {
                xtype : 'criterion_settings_system_support_access',
                reference : 'supportAccess',
                securityAccess : true
            }

        ]
    };

});
