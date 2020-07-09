Ext.define('criterion.view.settings.HR', function() {

    return {
        alias : 'widget.criterion_settings_hr',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.settings.hr.*',
            'criterion.view.settings.incomes.*',
            'criterion.view.settings.benefits.*'
        ],

        layout : {
            type : 'card',
            deferredRender : false
        },

        title : i18n.gettext('HR Administration'),

        items : [
            {
                xtype : 'criterion_settings_employee_groups',
                reference : 'employeeGroups'
            },
            {
                xtype : 'criterion_settings_company_events',
                reference : 'companyEvents'
            },
            {
                xtype : 'criterion_settings_salary_grades',
                reference : 'salaryGrades'
            },
            {
                xtype : 'criterion_settings_tasks',
                reference : 'tasks'
            },
            {
                xtype : 'criterion_settings_task_groups',
                reference : 'taskGroups'
            },
            {
                xtype : 'criterion_settings_projects',
                reference : 'projects'
            },
            {
                xtype : 'criterion_settings_carriers',
                reference : 'carriers'
            },
            {
                xtype : 'criterion_settings_work_locations',
                reference : 'workLocations'
            },
            {
                xtype : 'criterion_settings_holidays',
                reference : 'holidays'
            },
            {
                xtype : 'criterion_settings_aca',
                reference : 'aca'
            },
            {
                xtype : 'criterion_settings_benefits',
                reference : 'benefits'
            },
            {
                xtype : 'criterion_employer_time_off_plans',
                reference : 'timeOffPlans'
            },
            {
                xtype : 'criterion_settings_open_enrollments',
                reference : 'openEnrollments'
            },
            {
                xtype : 'criterion_settings_jobs',
                reference : 'jobs'
            },
            {
                xtype : 'criterion_settings_work_periods',
                reference : 'workPeriods'
            },
            {
                xtype : 'criterion_settings_onboardings',
                reference : 'onboardings'
            },
            {
                xtype : 'criterion_settings_screenings',
                reference : 'screening'
            }
        ]
    };

});
