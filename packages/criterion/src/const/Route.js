Ext.define('criterion.consts.Route', function() {

    var HR = 'HR',
        HR_REPORTS = HR + '/reports',
        HR_POSITIONS = HR + '/positions',
        PAYROLL = 'Payroll',
        PAYROLL_BATCH = PAYROLL + '/batch',
        PAYROLL_REPORTS = PAYROLL + '/reports',
        SELF_SERVICE = 'SelfService',
        RECRUITING = 'Recruiting',
        SCHEDULING = 'Scheduling',
        REPORTS = '/reports/generateDelayed',
        REPORTS_MEMORIZED = '/reports/generateMemorizedDelayed',
        RECRUITING_REPORTS = RECRUITING + '/reports',
        SCHEDULING_REPORTS = SCHEDULING + '/reports',
        SETTINGS_MAIN = 'settings',
        prevRoute = null;

    var SETTINGS = {
        MAIN : SETTINGS_MAIN,
        GENERAL : SETTINGS_MAIN + '/general',
        PAYROLL : SETTINGS_MAIN + '/payroll',
        RECRUITING : SETTINGS_MAIN + '/recruiting',
        PERFORMANCE_REVIEWS : SETTINGS_MAIN + '/performanceReviews',
        SYSTEM : SETTINGS_MAIN + '/system',
        HR : SETTINGS_MAIN + '/hr',
        INCOME_AND_BENEFITS : SETTINGS_MAIN + '/incomeAndBenefits',
        LEARNING_MANAGEMENT : SETTINGS_MAIN + '/learningManagement'
    };

    return {
        singleton : true,

        getDirect : function(path) {
            switch (criterion.appName) {
                case 'admin':
                    if (path.indexOf(HR) === 0 || path.indexOf(PAYROLL) === 0 || path.indexOf(RECRUITING) === 0 || path.indexOf(SCHEDULING) === 0) {
                        return (criterion.PRODUCTION ? '/ui/admin/#' : '#') + path;
                    } else {
                        return (criterion.PRODUCTION ? '/ui/' : '/ui/src/ess/#') + path.replace(SELF_SERVICE, '').replace(/^\//, '');
                    }
                    break;
                case 'ess':
                    if (path.indexOf(HR) === 0 || path.indexOf(PAYROLL) === 0 || path.indexOf(RECRUITING) === 0 || path.indexOf(SCHEDULING) === 0) {
                        return (criterion.PRODUCTION ? '/ui/admin/#' : '/ui/src/web/#') + path;
                    } else {
                        return (criterion.PRODUCTION ? '/ui/#' : '/ui/src/ess/#') + path.replace(SELF_SERVICE, '').replace(/^\//, '');
                    }
                    break;
            }

        },

        setPrevRoute : function(value) {
            prevRoute = value || null;
        },

        getPrevRoute : function() {
            return prevRoute;
        },

        // HR
        HR : {
            MAIN : HR,
            DASHBOARD : HR + '/dashboard',
            EMPLOYEES : HR + '/employees',
            EMPLOYEE : HR + '/employee',
            EMPLOYEE_BENEFITS_BENEFIT_PLANS : HR + '/employee/{0}/benefits/benefitPlans',
            EMPLOYEE_BASIC_DEMOGRAPHICS : HR + '/employee/{0}/profile/basicDemographics',
            EMPLOYEE_ONBOARDING : HR + '/employee/{0}/advancedProfile/onboarding',
            WIZARD : HR + '/addEmployee',
            POSITIONS : HR_POSITIONS,
            POSITIONS_COPY : HR_POSITIONS + '/copy',
            ORGANIZATION : HR + '/organization',
            HELP : HR + '/support',

            REPORTS : {
                MAIN : HR_REPORTS,
                MEMORIZED : HR_REPORTS + '/memorized',
                DATA_GRID : HR_REPORTS + '/dataGrid',
                DATA_TRANSFER : HR_REPORTS + '/dataTransfer'
            },
            SETTINGS : SETTINGS
        },

        // Payroll
        PAYROLL : {
            MAIN : PAYROLL,
            EMPLOYEES : PAYROLL + '/employees',
            EMPLOYEE : PAYROLL + '/employee',
            WIZARD : PAYROLL + '/addEmployee',
            BATCH : {
                MAIN : PAYROLL_BATCH,
                ENTRY : PAYROLL_BATCH + '/:id/entry',
                APPROVAL : PAYROLL_BATCH + '/:id/approval'
            },

            PAYROLL : PAYROLL + '/payroll',
            PAY_PROCESSING : PAYROLL + '/payProcessing',
            REPORTS : {
                MAIN : PAYROLL_REPORTS,
                MEMORIZED : PAYROLL_REPORTS + '/memorized',
                DATA_GRID : PAYROLL_REPORTS + '/dataGrid',
                DATA_TRANSFER : PAYROLL_REPORTS + '/dataTransfer'
            },
            SETTINGS : SETTINGS,
            HELP : PAYROLL + '/support'
        },

        // SelfService
        SELF_SERVICE : {
            MAIN : SELF_SERVICE,
            DASHBOARD : 'dashboard',
            DASHBOARD_INBOX : 'dashboard/inbox',
            DASHBOARD_TASK : 'dashboard/task',
            PERSONAL_INFORMATION : 'personalInformation',
            PERSONAL_INFORMATION_BASIC_DEMOGRAPHICS : 'personalInformation/basicDemographics',
            PERSONAL_INFORMATION_ADDRESS : 'personalInformation/address',
            PERSONAL_INFORMATION_EMPLOYMENT : 'personalInformation/employment',
            PERSONAL_INFORMATION_POSITION : 'personalInformation/position',
            PERSONAL_INFORMATION_POSITIONS : 'personalInformation/positions',
            PERSONAL_INFORMATION_ASSIGNMENT_HISTORY : 'personalInformation/positionHistory',
            PERSONAL_INFORMATION_DEPENDENTS_AND_CONTACTS : 'personalInformation/dependentsAndContacts',
            RECRUITING : 'recruiting',
            LEARNING : 'learning',
            LEARNING_ACTIVE : 'learning/active',
            LEARNING_COMPLETED : 'learning/completed',
            LEARNING_MY_TEAM : 'learning/myTeam',
            LEARNING_INSTRUCTOR_PORTAL : 'learning/instructorPortal',
            RECRUITING_JOB_POSTINGS : 'recruiting/jobPostings',
            RECRUITING_CAREERS : 'recruiting/careers',
            BENEFITS : 'benefits',
            BENEFITS_PLANS : 'benefits/plans',
            BENEFITS_OPEN_ENROLLMENTS : 'benefits/openEnrollments',
            TIME : 'time',
            TIME_TIMESHEETS : 'time/timesheets',
            TIME_TEAM_TIME_OFFS : 'time/teamTimeOffs',
            TIME_TIMESHEET_DASHBOARD : 'time/timesheetDashboard',
            TIME_TIMESHEETS_CURRENT : 'time/timesheets/current',
            TIME_ATTENDANCE_DASHBOARD : 'time/attendanceDashboard',
            TIME_TIME_OFF_ADD : 'time/timeOffDashboard/new',
            TIME_TIME_OFF_DASHBOARD : 'time/timeOffDashboard',
            TIME_AVAILABILITY : 'time/availability',
            TIME_AVAILABILITY_MANAGER : 'time/availabilityManager',
            TIME_MY_SHIFT_ASSIGNMENTS : 'time/myShiftAssignments',
            CALENDAR_EVENTS : 'calendar/events',
            PAYROLL : 'payroll',
            PAYROLL_PAY_HISTORY : 'payroll/payHistory',
            PAYROLL_PAY_HISTORY_LAST : 'payroll/payHistory/last',
            PAYROLL_BANK_ACCOUNTS : 'payroll/bankAccounts',
            PAYROLL_TAXES : 'payroll/taxes',
            PAYROLL_DEDUCTIONS : 'payroll/deductions',
            PAYROLL_INCOMES : 'payroll/incomes',
            RESOURCES : 'resources',
            CALENDAR : 'calendar',
            RESOURCES_MY_DOCUMENTS : 'resources/myDocuments',
            RESOURCES_COMPANY_DOCUMENTS : 'resources/companyDocuments',
            RESOURCES_TEAM_DOCUMENTS : 'resources/teamDocuments',
            RESOURCES_COMPANY_VIDEOS : 'resources/companyVideos',
            RESOURCES_COMPANY_DIRECTORY : 'resources/companyDirectory',
            RESOURCES_TEAM : 'resources/team',
            RESOURCES_FORMS : 'resources/forms',
            PERFORMANCE : 'performance',
            PERFORMANCE_JOURNAL_ENTRY : 'performance/journalEntry',
            PERFORMANCE_TEAM_JOURNALS : 'performance/teamJournals',
            PERFORMANCE_MY_JOURNALS : 'performance/myJournals',
            PERFORMANCE_REVIEWS : 'performance/reviews',
            PERFORMANCE_TEAM_REVIEWS : 'performance/teamReviews',
            PERFORMANCE_MY_GOALS : 'performance/myGoals',
            PERFORMANCE_TEAM_GOALS : 'performance/teamGoals',
            PREFERENCES : 'preferences',
            PREFERENCES_SECURITY : 'preferences/security',
            PREFERENCES_LOOK_AND_FEEL : 'preferences/lookAndFeel',
            PREFERENCES_CALENDAR : 'preferences/calendar',
            PREFERENCES_DELEGATION : 'preferences/delegation',
            PREFERENCES_TEAM_DELEGATION : 'preferences/teamDelegation',
            CAREER : 'career',
            CAREER_EDUCATION : 'career/education',
            CAREER_SKILLS : 'career/skills',
            CAREER_CERTIFICATIONS : 'career/certifications',

            RESOURCES_REPORTS : {
                MAIN : 'resources/reports'
            }
        },

        RECRUITING : {
            MAIN : RECRUITING,
            JOBS : RECRUITING + '/jobs',
            CANDIDATES : RECRUITING + '/candidates',
            POSITIONS : RECRUITING + '/positions',
            REPORTS : {
                MAIN : RECRUITING_REPORTS,
                MEMORIZED : RECRUITING_REPORTS + '/memorized',
                DATA_GRID : RECRUITING_REPORTS + '/dataGrid',
                DATA_TRANSFER : RECRUITING_REPORTS + '/dataTransfer'
            },
            SETTINGS : SETTINGS,
            HELP : RECRUITING + '/support'
        },

        SCHEDULING : {
            MAIN : SCHEDULING,
            SHIFT : SCHEDULING + '/shift',
            ASSIGNMENT : SCHEDULING + '/assignment',
            POPULATION : SCHEDULING + '/population',
            SETTINGS : SETTINGS,
            REPORTS : {
                MAIN : SCHEDULING_REPORTS,
                MEMORIZED : SCHEDULING_REPORTS + '/memorized',
                DATA_GRID : SCHEDULING_REPORTS + '/dataGrid',
                DATA_TRANSFER : SCHEDULING_REPORTS + '/dataTransfer'
            }
        },

        SETTINGS : SETTINGS,

        REPORTS : REPORTS,

        REPORTS_MEMORIZED : REPORTS_MEMORIZED
    };
});
