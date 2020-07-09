Ext.define('criterion.view.employee.Miscellaneous', {

    alias : 'widget.criterion_employee_miscellaneous',

    extend : 'criterion.ux.Panel',

    title : i18n.gettext('Miscellaneous'),

    requires : [
        'criterion.view.worker.Compensations',
        'criterion.view.employee.Security',
        'criterion.view.employee.Groups'
    ],

    layout : 'card',

    defaults : {
        header : false
    },

    plugins : [
        {
            ptype : 'criterion_security_items',
            secureByDefault : true
        }
    ],

    items : [
        {
            xtype : 'criterion_worker_compensations',
            itemId : 'compensations',
            title : i18n.gettext('Workers Compensation'),
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_WORKERS_COMPENSATION, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_security',
            itemId : 'security',
            title : i18n.gettext('Security'),
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SECURITY, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_groups',
            itemId : 'groups',
            title : i18n.gettext('Groups'),
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GROUPS, criterion.SecurityManager.READ)
        }
    ]

});
