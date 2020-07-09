Ext.define('criterion.view.employee.Benefits', {
    alias : 'widget.criterion_employee_benefits',

    extend : 'criterion.ux.Panel',

    requires : [
        'criterion.view.employee.benefit.Benefits',
        'criterion.view.employee.timeOffPlan.Accruals'
    ],

    layout : {
        type : 'card'
    },

    defaults : {
        header : false,
        autoScroll : true
    },

    plugins : [
        {
            ptype : 'criterion_security_items',
            secureByDefault : true
        }
    ],

    items : [
        {
            xtype : 'criterion_person_benefits',
            itemId : 'benefitPlans',
            title : i18n.gettext('Benefit Plans'),
            viewModel : {
                data : {
                    showApproved : false
                }
            },
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_BENEFIT_PLANS, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_timeoffplan_accruals',
            itemId : 'timeOffPlans',
            title : i18n.gettext('Time Off Plans'),
            controller : {
                suppressIdentity : ['employeeGlobal']
            },
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF_PLANS, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_benefit_time_off',
            itemId : 'timeOff',
            title : i18n.gettext('Time Off'),
            controller : {
                suppressIdentity : ['employeeGlobal']
            },
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF, criterion.SecurityManager.READ)
        }
    ]

});
