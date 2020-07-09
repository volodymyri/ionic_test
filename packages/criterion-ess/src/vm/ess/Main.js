Ext.define('criterion.vm.ess.Main', {
    extend : 'Ext.app.ViewModel',

    alias : 'viewmodel.criterion_ess_main',

    data : {
        employerId : null,
        employeeId : null,
        employerName : '',
        employeeName : '',
        employeeFullName : '',
        calendarsCount : 0,
        subordinatesCount : 0
    },

    formulas : {
        showCalendarMenu : {
            bind : {
                bindTo : '{security}',
                deep : true
            },
            get : function(security) {
                return (
                    this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.CALENDAR_MENU, false, true)) &&
                    this.get('calendarsCount') > 0
                ) || this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.EVENTS, false, true))
            }
        },

        showPerformanceMenu : {
            bind : {
                bindTo : '{security}',
                deep : true
            },
            get : function(security) {
                return this.get('subordinatesCount') > 0 ?
                    (
                        this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.MY_JOURNALS, false, true)) ||
                        this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.JOURNAL_ENTRY, false, true)) ||
                        this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.TEAM_JOURNALS, false, true)) ||
                        this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.REVIEWS, false, true)) ||
                        this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.TEAM_REVIEWS, false, true))
                    ) :
                    (
                        this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.REVIEWS, false, true)) ||
                        this.get(criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.TEAM_REVIEWS, false, true))
                    );
            }
        },

        usingExternalAuth : () => criterion.Api.getUsingExternalAuth(),
        showInternalCareers : () => criterion.SecurityManager.showInternalCareers()
    },

    constructor() {
        this.callParent(arguments);

        this.setSecurityData();
    },

    setSecurityData() {
        let sm = criterion.SecurityManager,
            KEYS = sm.ESS_KEYS,
            getESSAccess = sm.getESSAccess;

        this.set('subordinatesCount', criterion.Api.getSubordinatesCount());
        this.set('security', sm.getSecurityObject());

        this.set('securityPlusMenu', getESSAccess([KEYS.TIMESHEET, KEYS.MY_TIME_OFFS, KEYS.PAY_HISTORY]));
        this.set('securityBenefitsMenu', getESSAccess([KEYS.BENEFITS_PLANS, KEYS.OPEN_ENROLLMENT]));
        this.set('securityTimeMenu', getESSAccess([KEYS.MY_TIME_OFFS, KEYS.TIMESHEET, KEYS.MY_AVAILABILITY, KEYS.MY_SHIFT_ASSIGNMENTS]) || getESSAccess([KEYS.TEAM_TIMESHEETS, KEYS.TEAM_ATTENDANCE, KEYS.TEAM_AVAILABILITY]));
        this.set('securityTimeManagementMenu', getESSAccess([KEYS.MY_TIME_OFFS, KEYS.TIMESHEET, KEYS.MY_AVAILABILITY, KEYS.MY_SHIFT_ASSIGNMENTS]));
        this.set('securityTimeTeamMenu', getESSAccess([KEYS.TEAM_TIMESHEETS, KEYS.TEAM_ATTENDANCE, KEYS.TEAM_AVAILABILITY]));
        this.set('securityEventMenu', getESSAccess([KEYS.EVENTS]));
        this.set('securitySchedulingMenuModern', getESSAccess([KEYS.MY_AVAILABILITY, KEYS.MY_SHIFT_ASSIGNMENTS]));
        this.set('securityPayMenu', getESSAccess([KEYS.TAXES, KEYS.BANK_ACCOUNTS, KEYS.PAY_HISTORY]));
        this.set('securityResourcesMenu', getESSAccess([KEYS.MY_DOCUMENTS, KEYS.COMPANY_DOCUMENTS, KEYS.COMPANY_VIDEOS, KEYS.REPORTS, KEYS.COMPANY_DIRECTORY, KEYS.ORGANIZATION_VIEW]));
        this.set('securityLearningMenu', getESSAccess([KEYS.LEARNING_ACTIVE, KEYS.LEARNING_COMPLETE, KEYS.MY_TEAM, KEYS.INSTRUCTOR_PORTAL]));
        this.set('securityLearningClassesMenu', getESSAccess([KEYS.LEARNING_ACTIVE, KEYS.LEARNING_COMPLETE]));
        this.set('securityLearningMyTeamMenu', getESSAccess([KEYS.MY_TEAM]));
        this.set('securityCalendarMenu', getESSAccess([KEYS.CALENDAR_MENU]));
        this.set('securityDocumentsMenu', getESSAccess([KEYS.MY_DOCUMENTS, KEYS.COMPANY_DOCUMENTS, KEYS.COMPANY_VIDEOS, KEYS.REPORTS]));
        this.set('securityReportsMenu', getESSAccess([KEYS.COMPANY_DIRECTORY, KEYS.ORGANIZATION_VIEW]));
        this.set('securityPersonalMenu', getESSAccess([KEYS.DEMOGRAPHICS, KEYS.ADDRESS, KEYS.DEPENDENTS_CONTACTS]));
        this.set('securityProfileMenu', getESSAccess([KEYS.DEMOGRAPHICS, KEYS.ADDRESS, KEYS.DEPENDENTS_CONTACTS]));
        this.set('securityProfileMenuModern', getESSAccess([KEYS.DEMOGRAPHICS, KEYS.ADDRESS, KEYS.DEPENDENTS_CONTACTS]));
        this.set('securityEmploymentMenu', getESSAccess([KEYS.EMPLOYMENT_INFORMATION, KEYS.PRIMARY_POSITION, KEYS.ADDITIONAL_POSITIONS, KEYS.POSITION_HISTORY]));
        this.set('securitySettingsMenu', getESSAccess([KEYS.SECURITY, KEYS.LOOK_AND_FEEL, KEYS.CALENDAR, KEYS.DELEGATION, KEYS.TEAM_DELEGATION]));
        this.set('securitySettingsTeamMenu', getESSAccess([KEYS.TEAM_DELEGATION]));
        this.set('securityPerformanceTeamMenu', getESSAccess([KEYS.TEAM_REVIEWS]));
        this.set('securityCareerMenu', getESSAccess([KEYS.EDUCATION, KEYS.CERTIFICATION, KEYS.SKILL]));

        this.notify();
    }

});
