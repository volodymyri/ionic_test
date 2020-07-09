Ext.define('criterion.view.ess.Payroll', function() {

    return {
        alias : 'widget.criterion_selfservice_payroll',

        extend : 'criterion.ux.Panel',

        layout : {
            type : 'card',
            deferredRender : true
        },

        requires : [
            'criterion.controller.ess.Payroll',
            'criterion.view.ess.payroll.PayHistory',
            'criterion.view.ess.payroll.BankAccounts',
            'criterion.view.ess.payroll.Taxes',
            'criterion.view.ess.payroll.Deductions',
            'criterion.view.ess.payroll.Incomes'
        ],

        controller : {
            type : 'criterion_selfservice_payroll'
        },

        viewModel : {
            data : {}
        },

        listeners : {
            activate : 'handleActivate'
        },

        plugins : [
            {
                ptype : 'criterion_security_items'
            },
            {
                ptype : 'criterion_lazyitems',

                items : [
                    {
                        xtype : 'criterion_selfservice_payroll_taxes',
                        itemId : 'taxes',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TAXES)
                    },
                    {
                        xtype : 'criterion_selfservice_payroll_deductions',
                        itemId : 'deductions',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.DEDUCTION)
                    },
                    {
                        xtype : 'criterion_selfservice_payroll_incomes',
                        itemId : 'incomes',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.INCOME)
                    },
                    {
                        xtype : 'criterion_selfservice_payroll_bank_accounts',
                        itemId : 'bankAccounts',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.BANK_ACCOUNTS)
                    },
                    {
                        xtype : 'criterion_selfservice_payroll_pay_history',
                        itemId : 'payHistory',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.PAY_HISTORY)
                    }
                ]
            }
        ]
    };

});
