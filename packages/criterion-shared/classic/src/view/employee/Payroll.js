Ext.define('criterion.view.employee.Payroll', {

    alias : 'widget.criterion_person_payroll',

    extend : 'criterion.ux.Panel',

    title : i18n.gettext('Payroll'),

    requires : [
        'criterion.view.employee.payroll.Incomes',
        'criterion.view.employee.payroll.Deductions',
        'criterion.view.person.BankAccounts',
        'criterion.view.employee.Taxes'
    ],

    layout : 'card',

    defaults : {
        header : false
    },

    plugins : [
        {
            ptype : 'criterion_security_items'
        }
    ],

    items : [
        {
            xtype : 'criterion_employee_taxes',
            itemId : 'taxes',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TAXES, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_payroll_incomes',
            itemId : 'incomes',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_INCOMES, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_payroll_deductions',
            itemId : 'deductions',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DEDUCTIONS, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_person_bank_accounts',
            itemId : 'bankAccounts',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_BANK_ACCOUNTS, criterion.SecurityManager.READ)
        }
    ]

});
