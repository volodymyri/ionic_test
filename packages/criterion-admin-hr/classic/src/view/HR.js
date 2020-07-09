Ext.define('criterion.view.HR', function() {

    var ROUTES = criterion.consts.Route,
        HR = ROUTES.HR;

    return {
        extend : 'criterion.view.Module',

        alias : 'widget.criterion_hr',

        requires : [
            'criterion.controller.Module',
            'criterion.view.OrgChart',
            'criterion.view.SearchEmployee',

            'criterion.view.hr.Dashboard',
            'criterion.view.hr.Employee',
            'criterion.view.common.Positions',
            'criterion.view.Reports',
            'criterion.view.hr.Settings',
            'criterion.view.hr.Toolbar',
            'criterion.view.employee.Wizard'
        ],

        controller : {
            type : 'criterion_module',
            baseCardToken : HR.MAIN
        },

        tbar : {
            xtype : 'criterion_hr_toolbar'
        },

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('HR'),

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        xtype : 'criterion_hr_dashboard',
                        title : i18n.gettext('Dashboard'),
                        reference : 'dashboard',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.DASHBOARD, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_search_employee',
                        title : i18n.gettext('Employees'),
                        parentPage : 'HR',
                        reference : 'employees',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_positions',
                        title : i18n.gettext('Positions'),
                        reference : 'positions',
                        mainRoute : criterion.consts.Route.HR.POSITIONS,
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.POSITION, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_orgchart',
                        title : i18n.gettext('Organization'),
                        reference : 'organization',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.ORGANIZATION, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_reports',
                        title : i18n.gettext('Reports'),
                        reference : 'reports',
                        mainRoute : criterion.consts.Route.HR.REPORTS,
                        controller : {
                            moduleId : criterion.Consts.REPORT_MODULE.HR
                        },
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_hr_employee',
                        title : i18n.gettext('Employee'),
                        reference : 'employee',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_employee_wizard',
                        reference : 'addEmployee',
                        parentPage : 'HR',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.CREATE)
                    },
                    {
                        xtype : 'criterion_settings',
                        reference : 'settings',
                        moduleId : HR.MAIN
                    }
                ]
            }
        ]
    }
});
