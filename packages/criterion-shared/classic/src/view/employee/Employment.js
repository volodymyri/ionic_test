Ext.define('criterion.view.employee.Employment', {

    alias : 'widget.criterion_employee_employment',

    extend : 'criterion.ux.Panel',

    requires : [
        'criterion.view.employee.demographic.Employment',
        'criterion.view.employee.Positions',
        'criterion.view.employee.Position',
        'criterion.view.person.EmploymentHistory',
        'criterion.view.employee.AssignmentHistory',
        'criterion.view.employee.Tasks'
    ],

    layout : 'card',

    defaults : {
        header : false,
        autoScroll : true
    },

    bodyPadding : 0,

    plugins : [
        {
            ptype : 'criterion_security_items',
            secureByDefault : true
        }
    ],

    items : [
        {
            xtype : 'criterion_employee_demographic_employment',
            itemId : 'info',
            title : i18n.gettext('Employment Information'),
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_position',
            itemId : 'position',
            title : i18n.gettext('Position'),
            multiPositionTitle : i18n.gettext('Primary Position'),
            controller : {
                suppressIdentity : ['employeeGlobal']
            },
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_PRIMARY_POSITION, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_positions',
            itemId : 'positions',
            title : i18n.gettext('Additional Positions'),
            isMultiPositionMode : true,
            controller : {
                suppressIdentity : ['employeeGlobal'],
                editor : {
                    controller : {
                        suppressIdentity : ['employeeGlobal']
                    }
                }
            },
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_POSITIONS, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_person_assignment_history',
            itemId : 'positionHistory',
            title : i18n.gettext('Position History'),
            controller : {
                suppressIdentity : ['employeeGlobal'],
                editor : {
                    controller : {
                        suppressIdentity : ['employeeGlobal']
                    }
                }
            },
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_POSITION_HISTORY, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_person_employment_history',
            itemId : 'history',
            title : i18n.gettext('Employment History')
        },
        {
            xtype : 'criterion_employee_tasks',
            itemId : 'tasks',
            title : i18n.gettext('Tasks'),
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TASKS, criterion.SecurityManager.READ)
        }
    ]
});
