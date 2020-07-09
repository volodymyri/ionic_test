Ext.define('criterion.view.settings.Payroll', function() {

    return {
        alias : 'widget.criterion_settings_payroll',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.settings.payroll.*',
            'criterion.view.settings.benefits.*',
            'criterion.view.settings.incomes.*'
        ],

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('Payroll Administration'),

        items : [
            {
                xtype : 'criterion_payroll_settings_payroll_schedules',
                reference : 'schedules'
            },
            {
                xtype : 'criterion_payroll_settings_incomes',
                title : i18n.gettext('Incomes'),
                reference : 'incomes'
            },
            {
                xtype : 'criterion_settings_deductions',
                reference : 'deductions'
            },
            {
                xtype : 'criterion_settings_deduction_frequencies',
                reference : 'deductionFrequency'
            },
            {
                xtype : 'criterion_settings_pay_groups',
                reference : 'payGroups'
            },
            {
                xtype : 'criterion_settings_timesheet_layouts',
                reference : 'timesheetLayouts'
            },
            {
                xtype : 'criterion_settings_tax_rates',
                reference : 'taxRates'
            },
            {
                xtype : 'criterion_payroll_settings_bank_informations',
                title : i18n.gettext('Bank Accounts'),
                reference : 'bankAccounts'
            },
            {
                xtype : 'criterion_payroll_settings_gl_accounts',
                title : i18n.gettext('GL Accounts'),
                reference : 'GLAccounts'
            },
            {
                xtype : 'criterion_payroll_settings_time_clocks',
                title : i18n.gettext('Time Clock'),
                reference : 'timeClock'
            },
            {
                xtype : 'criterion_payroll_settings_gl_account_maps',
                title : i18n.gettext('GL Account Map'),
                reference : 'GLAccountMap'
            },
            {
                xtype : 'criterion_payroll_settings_workers_compensations',
                reference : 'workersCompensations'
            },
            {
                xtype : 'criterion_payroll_settings_shift_rates',
                reference : 'shiftRates'
            },
            {
                xtype : 'criterion_payroll_settings_certified_rates',
                reference : 'certifiedRates'
            }
        ]
    };

});
