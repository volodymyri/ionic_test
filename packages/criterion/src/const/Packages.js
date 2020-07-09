Ext.define('criterion.consts.Packages', function() {

    const ROUTES = criterion.consts.Route;

    return {

        singleton : true,

        ADMIN : {
            HR : {
                NAME : 'criterion-admin-hr',
                ROUTE : ROUTES.HR.MAIN,
                BASE_COMPONENT : 'criterion_hr'
            },
            PAYROLL : {
                NAME : 'criterion-admin-payroll',
                ROUTE : ROUTES.PAYROLL.MAIN,
                BASE_COMPONENT : 'criterion_payroll'
            },
            RECRUITING : {
                NAME : 'criterion-admin-recruiting',
                ROUTE : ROUTES.RECRUITING.MAIN,
                BASE_COMPONENT : 'criterion_recruiting'
            },
            SCHEDULING : {
                NAME : 'criterion-admin-scheduling',
                ROUTE : ROUTES.SCHEDULING.MAIN,
                BASE_COMPONENT : 'criterion_scheduling'
            }
        },

        SELF_SERVICE : {
            DASHBOARD : {
                NAME : 'criterion-ess-dashboard',
                ROUTE : ROUTES.SELF_SERVICE.DASHBOARD,
                BASE_COMPONENT : 'criterion_selfservice_dashboard'
            },
            BENEFITS : {
                NAME : 'criterion-ess-benefit',
                ROUTE : ROUTES.SELF_SERVICE.BENEFITS,
                BASE_COMPONENT : 'criterion_selfservice_benefit'
            },
            TIME : {
                NAME : 'criterion-ess-time',
                ROUTE : ROUTES.SELF_SERVICE.TIME,
                BASE_COMPONENT : 'criterion_selfservice_time'
            },
            PAYROLL : {
                NAME : 'criterion-ess-payroll',
                ROUTE : ROUTES.SELF_SERVICE.PAYROLL,
                BASE_COMPONENT : 'criterion_selfservice_payroll'
            },
            RESOURCES : {
                NAME : 'criterion-ess-resources',
                ROUTE : ROUTES.SELF_SERVICE.RESOURCES,
                BASE_COMPONENT : 'criterion_selfservice_resources'
            },
            CALENDAR : {
                NAME : 'criterion-ess-calendar',
                ROUTE : ROUTES.SELF_SERVICE.CALENDAR,
                BASE_COMPONENT : 'criterion_selfservice_calendar'
            },
            PERSONAL_INFORMATION : {
                NAME : 'criterion-ess-personal-information',
                ROUTE : ROUTES.SELF_SERVICE.PERSONAL_INFORMATION,
                BASE_COMPONENT : 'criterion_selfservice_personal_information'
            },
            RECRUITING : {
                NAME : 'criterion-ess-recruiting',
                ROUTE : ROUTES.SELF_SERVICE.RECRUITING,
                BASE_COMPONENT : 'criterion_selfservice_recruiting'
            },
            PERFORMANCE : {
                NAME : 'criterion-ess-performance',
                ROUTE : ROUTES.SELF_SERVICE.PERFORMANCE,
                BASE_COMPONENT : 'criterion_selfservice_performance'
            },
            LEARNING : {
                NAME : 'criterion-ess-learning',
                ROUTE : ROUTES.SELF_SERVICE.LEARNING,
                BASE_COMPONENT : 'criterion_selfservice_learning'
            },
            PREFERENCES : {
                NAME : 'criterion-ess-preferences',
                ROUTE : ROUTES.SELF_SERVICE.PREFERENCES,
                BASE_COMPONENT : 'criterion_selfservice_preferences'
            },
            CAREER : {
                NAME : 'criterion-ess-career',
                ROUTE : ROUTES.SELF_SERVICE.CAREER,
                BASE_COMPONENT : 'criterion_selfservice_career'
            }
        }
    }
});
