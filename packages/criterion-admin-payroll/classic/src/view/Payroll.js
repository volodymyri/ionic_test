Ext.define('criterion.view.Payroll', function() {

    var ROUTES = criterion.consts.Route,
        PAYROLL = ROUTES.PAYROLL;

    return {
        alias : 'widget.criterion_payroll',

        extend : 'criterion.view.Module',

        requires : [
            'criterion.view.SearchEmployee',
            'criterion.view.Help',
            'criterion.view.payroll.Batches',
            'criterion.view.payroll.PayProcessing',
            'criterion.view.Reports',
            'criterion.view.payroll.Batch',
            'criterion.view.payroll.Employee',
            'criterion.view.payroll.Settings',
            'criterion.view.payroll.Toolbar',
            'criterion.view.employee.Wizard'
        ],

        controller : {
            type : 'criterion_module',
            baseCardToken : PAYROLL.MAIN
        },

        tbar : {
            xtype : 'criterion_payroll_toolbar'
        },

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('Payroll'),

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                eagerInstantiation : true,
                items : [
                    {
                        xtype : 'criterion_search_employee',
                        reference : 'employees',
                        gridStateId : 'payrollEmployeesGrid',
                        title : i18n.gettext('Employee Maintenance'),
                        parentPage : 'Payroll',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_payroll_batches',
                        reference : 'payroll',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_payroll_employee',
                        reference : 'employee',
                        title : i18n.gettext('Employee'),
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_payroll_pay_processing',
                        reference : 'payProcessing',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAY_PROCESSING, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_reports',
                        title : i18n.gettext('Reports'),
                        reference : 'reports',
                        mainRoute : criterion.consts.Route.PAYROLL.REPORTS,
                        controller : {
                            moduleId : criterion.Consts.REPORT_MODULE.PAYROLL
                        },
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_payroll_batch',
                        reference : 'batch',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_employee_wizard',
                        reference : 'addEmployee',
                        parentPage : 'Payroll',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.CREATE)
                    },
                    {
                        xtype : 'criterion_help',
                        reference : 'support'
                    },
                    {
                        xtype : 'criterion_settings',
                        reference : 'settings',
                        moduleId : PAYROLL.MAIN
                    }
                ]
            }
        ]
    }
});
