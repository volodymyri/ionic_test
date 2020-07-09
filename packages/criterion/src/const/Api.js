/* eslint-disable no-use-before-define, no-implicit-globals */
// don't remove! it fixes js error when app building.
var criterion = criterion || {},
    i18n = i18n || {gettext : Ext.emptyFn},
    mainApiPrefix = criterion.API_URL_PREFIX ? criterion.API_URL_PREFIX : '/api';
/* eslint-enable no-use-before-define, no-implicit-globals */

Ext.define('criterion.consts.Api', function() {
    function getApiRoot(noPrefix) {
        let basePath;

        if (criterion.DIRECT_AUTH) { // mobile application
            var url = document.createElement('a');

            url.href = criterion.API_TENANT_URL;
            basePath = url.origin + mainApiPrefix;
        } else {
            basePath = mainApiPrefix;
        }

        if (noPrefix) {
            return basePath;
        }

        if (criterion.appName === 'admin') {
            return basePath + '/hr';
        }

        return basePath + '/ess';
    }

    const API_ROOT = getApiRoot(),
        NO_PREFIX_ROOT = getApiRoot(true),
        API_MOCK = '/api-mock'; // eslint-disable-line no-unused-vars

    /**
     * Api urls
     */
    const API = {
        ROOT : API_ROOT
        //<debug>
        ,
        MOCK_ROOT : API_MOCK
        //</debug>
    };

    /**
     * API Imitations for testing/development purposes
     *
     * or URLS regexp or add {_fkApi_ : true} to request's params
     *
     * add {_fkDelayed_ : true, _delay_ : 2000} to request's params to call proxy URL (BE imitation)
     * /{API_IMITATION_CFG.prefix}/delayedProxyUrl?_delay_=2000&_fkDelayed_=true&origUrl=%2Fapi-local%2Fhr%2Femployer
     *
     * const express = require('express');
     * const app = express();
     * const http = require('http');
     * const request = require('request');
     * const bodyParser = require('body-parser');
     *
     * app.use(bodyParser.json())
     *
     * const delayedProxy = (time, pref = 'api-local', path) => (req, res) => {
     *    const reqPath = path ? `http://criterionhcm.local${path}` : `http://criterionhcm.local/${pref}/${reqPath}`;
     *    const options = {
     *       url : reqPath,
     *       qs : req.query,
     *       headers : {
     *         authorization : req.headers.authorization,
     *         employerid : req.headers.employerid
     *       }
     *    };
     *
     *    setTimeout(() => {
     *      request(options).pipe(res);
     *    }, time || 0);
     * }
     *
     * app.get('/delayedProxyUrl', (req, res) => {
     *    delayedProxy(req.query['_delay_'], null, req.query.origUrl)(req, res);
     * });
     */
    const API_IMITATION_CFG = {
        URLS : [
            //</debug>
            // for example: /(hr|ess)\/employee\/[\d]/

            //</debug>
        ],
        prefix : 'api-fake'
    };

    // for dev purposes
    const OVERRIDE_CODETABLE_CFG = {
        //<debug>
        /* for example:
        COMP_TYPE_CD : {
            "name" : "COMP_TYPE_CD",
            "data" : [
                {
                    "id" : 1,
                    "codeTableId" : 200,
                    "code" : "CASH_SUBJECT_TAXABLE",
                    "description" : "Cash Subject Taxable",
                    "isDefault" : false,
                    "isActive" : true
                }
            ]
        }
        */

        //</debug>
    };

    // for dev purposes
    const OVERRIDE_SECURITY_RULES = {
        hrFunction : {
            // in format FUNCTION_NAME : [bool, bool, bool, bool, bool] [act create read update delete]
            // example RECRUITING_CANDIDATE_INTERVIEW : [true, true, true, true, true]
            //<debug>

            //</debug>
        },

        essFunction : {
            // in format ESS_FUNCTION_NAME : bool
            // example ADDR : true
            //<debug>

            //</debug>
        }
    };

    // Login services
    Ext.apply(API, {
        AUTHENTICATE_REMEMBERED : API_ROOT + '/authenticateRemembered'
    });

    // Testing services
    Ext.apply(API, {
        TESTING_UPDATE_DATABASE : NO_PREFIX_ROOT + '/testing/update-database'
    });

    // Core services
    Ext.apply(API, {
        CODE_TABLE : API_ROOT + '/codeTable',
        CODE_TABLE_DETAIL : API_ROOT + '/codeTable/detail',
        CODE_TABLE_DETAIL_LOCAL : API_ROOT + '/codeTable/detail/local',

        CUSTOM_FIELD : API_ROOT + '/customField',
        CUSTOM_FORM : API_ROOT + '/customForm',
        CUSTOM_VALUE : API_ROOT + '/customValue',
        EMPLOYER : API_ROOT + '/employer',
        EVENT_TYPE : API_ROOT + '/eventType',
        PERSON : API_ROOT + '/person',
        EMPLOYEE : API_ROOT + '/employee',
        MOBILE_EMPLOYEE : API_ROOT + '/mobile/employee',
        EMPLOYEE_DEDUCTION : API_ROOT + '/employee/deduction',
        ASSETS_IMAGES : API_ROOT + '/assets/images',
        SEARCH : API_ROOT + '/search',
        ASSIGNMENT : API_ROOT + '/assignment',
        BENEFIT : API_ROOT + '/benefit',
        PAYROLL : API_ROOT + '/payroll',
        TIMEOFF : API_ROOT + '/timeOff',
        EMPLOYMENT : API_ROOT + '/employment',
        DEMOGRAPHICS : API_ROOT + '/demographics',
        BENEFITS_DEDUCTIONS : API_ROOT + '/benefitsDeductions',
        CALC_METHOD : API_ROOT + '/calculationMethod',
        DEDUCTION_FREQUENCY : API_ROOT + '/deductionFrequency',
        SALARY_GRADE : API_ROOT + '/salaryGrade',
        FIELD_FORMAT_TYPE : API_ROOT + '/fieldFormat',
        FIELD_FORMAT_CUSTOM : API_ROOT + '/fieldFormatCustom',
        META_TABLE : API_ROOT + '/metaTable',
        META_FIELD : API_ROOT + '/metaField',
        SKILL : API_ROOT + '/skill',
        DASHBOARD : API_ROOT + '/dashboard',
        WORKFLOW : API.ROOT + '/workflow',
        TAX : API_ROOT + '/tax',
        SECURITY_REPORT : API_ROOT + '/security/report',
        SECURITY_FIELD : API_ROOT + '/security/field',
        SECURITY_PROFILE : API_ROOT + '/security/profile',
        SECURITY_USER : API_ROOT + '/security/user',
        SECURITY_EMPLOYER : API_ROOT + '/security/employer',
        SECURITY_ROLE_GROUP : API_ROOT + '/security/roleGroup',
        TIMESHEET_TYPE : API_ROOT + '/timesheetType',
        TIMESHEET_TYPE_BREAK : API_ROOT + '/timesheetType/break',
        TE_DEDUCTION : API_ROOT + '/teDeduction',
        TE_RECIPROCITY : API_ROOT + '/teReciprocity',
        TE_ALTERNATE_CALCULATION_DROPDOWN : API_ROOT + '/teAlternateCalculation/dropdown',
        STATIC_TOKEN : API_ROOT + '/staticToken',
        PUBLISH_SITE : API_ROOT + '/publishSite',
        REVIEW : API_ROOT + '/review',
        REVIEW_SCALE : API_ROOT + '/reviewScale',
        REVIEW_SCALE_DETAIL : API_ROOT + '/reviewScale/detail',
        REVIEW_TEMPLATE : API_ROOT + '/reviewTemplate',
        REVIEW_COMPETENCY : API_ROOT + '/reviewCompetency',
        FORM : API_ROOT + '/form',
        WEBFORM : API_ROOT + '/webform',
        DATAFORM : API_ROOT + '/dataform',
        EMPLOYEE_GROUP : API_ROOT + '/employeeGroup',
        GL_EXPORT : API_ROOT + '/glExport',
        COMMUNITY : API_ROOT + '/community',
        PASSWORD_POLICY : API_ROOT + '/passwordPolicy',
        EMAIL_LAYOUT : API_ROOT + '/emailLayout',
        WEEK_EVENT : API_ROOT + '/weekEvents',
        TE_INCOME : API_ROOT + '/teIncome',
        TE_TAX : API_ROOT + '/teTax',
        TE_TAX_SEARCH : API_ROOT + '/teTax/tax/search',
        CUSTOM_LOCALIZATION : API_ROOT + '/customLocalization',
        TIME_CLOCK : API_ROOT + '/timeClock',
        TIME_CLOCK_LOGO : API_ROOT + '/timeClock/logo',
        EMPLOYEE_TIME_CLOCK : API_ROOT + '/employee/timeClock',
        WORK_LOCATION : API_ROOT + '/workLocation',
        DOCUMENT_LOCATION : API_ROOT + '/documentLocation',
        JOB : API_ROOT + '/job',
        ESS_HELP : API_ROOT + '/essHelp',
        REPORT_SETTINGS : API_ROOT + '/reportSettings',
        SANDBOX : API_ROOT + '/sandbox',
        EXTERNAL_SYSTEM : API_ROOT + '/externalSystem',
        LEARNING : API_ROOT + '/learning',
        SUBORDINATE_LEARNING : API_ROOT + '/subordinate/learning',
        GEOCODE : API_ROOT + '/geocode',
        APP : API_ROOT + '/app',
        APP_AVAILABLE : API_ROOT + '/app/available',
        APP_UPLOAD : API_ROOT + '/app/upload',
        APP_INSTALL : API_ROOT + '/app/install',
        APP_UNINSTALL : API_ROOT + '/app/uninstall',
        APP_INVOKE : API_ROOT + '/app/invokeByCustomButton?appTriggerId={0}',
        APP_LOG : API_ROOT + '/appLog',
        APP_DOWNLOAD_TRACE_LOG : API_ROOT + '/appLog/downloadTraceLog?appLogId={0}',
        DELAYED_TASK_CHECK : API_ROOT + '/delayedTask/check',
        SUPPORT_USER : API_ROOT + '/supportUser',
        SUPPORT_USER_SET_EXPIRATION : API_ROOT + '/supportUser/setExpiration'
    });

    // geocode
    Ext.apply(API, {
        GEOCODE_SEARCH : API.GEOCODE + '/search',
        GEOCODE_EMPLOYEE_FIX : API.GEOCODE + '/employee/fix',
        GEOCODE_EMPLOYER_FIX : API.GEOCODE + '/employer/fix'
    });

    // forms
    Ext.apply(API, {
        FORM_AVAILABLE : API.FORM + '/available',
        FORM_ASSIGN : API.FORM + '/assign'
    });

    // mass login
    Ext.apply(API, {
        MASS_LOGIN : API_ROOT + '/massLogin',
        MASS_LOGIN_SEARCH : API_ROOT + '/massLogin/search',
        MASS_LOGIN_RESET_PASSWORD : API_ROOT + '/massLogin/resetPassword',
        MASS_LOGIN_UNLOCK_LOGIN : API_ROOT + '/massLogin/unlockLogin'
    });

    // Employee screening services
    Ext.apply(API, {
        EMPLOYEE_BACKGROUND : API_ROOT + '/employeeBackground',
        EMPLOYEE_BACKGROUND_SEARCH : API_ROOT + '/employeeBackground/search',
        EMPLOYEE_BACKGROUND_SYNC : API_ROOT + '/employeeBackground/sync?employerId={0}'
    });

    // Employers for Wizard
    Ext.apply(API, {
        EMPLOYER_ELIGIBLE_FOR_HIRE : API.EMPLOYER + '/eligibleForHire',
        EMPLOYER_ELIGIBLE_FOR_REHIRE : API.EMPLOYER + '/eligibleForRehire',
        EMPLOYER_ELIGIBLE_FOR_TRANSFER : API.EMPLOYER + '/eligibleForHire'
    });

    // Hire

    Ext.apply(API, {
        EMPLOYEE_HIRE_NEW : API.EMPLOYEE + '/hireNew',
        EMPLOYEE_HIRE_EXISTING : API.EMPLOYEE + '/hireExisting',
        EMPLOYEE_TRANSFER : API.EMPLOYEE + '/transfer?employeeId={0}',
        EMPLOYEE_REHIRE : API.EMPLOYEE + '/rehire'
    });

    // Work Location service
    Ext.apply(API, {
        WORK_LOCATION_AREA : API.WORK_LOCATION + '/area',
        WORK_LOCATION_TASK : API.WORK_LOCATION + '/task',

        WORK_LOCATION_EMPLOYEE : API.WORK_LOCATION + '/employee',
        WORK_LOCATION_EMPLOYEE_AVAILABLE : API.WORK_LOCATION + '/employee/available',
        WORK_LOCATION_EMPLOYER : API.WORK_LOCATION + '/employer'
    });

    // Social service
    Ext.apply(API, {
        AUTHENTICATE_FROM_LINKEDIN : API_ROOT + '/authenticate/criterionLinkedin',
        LOAD_CURRENT_PERSON_LINKEDIN_PROFILE : API_ROOT + '/profile'
    });

    // Assignment services
    Ext.apply(API, {
        ASSIGNMENT_DETAIL : API.ASSIGNMENT + '/detail',
        ASSIGNMENT_HISTORY : API.ASSIGNMENT + '/history',
        ASSIGNMENT_ADDITIONAL : API.ASSIGNMENT + '/additional',
        ASSIGNMENT_PRIMARY : API.ASSIGNMENT + '/primary',
        ASSIGNMENT_TERMINATE : API.ASSIGNMENT + '/terminate',
        ASSIGNMENT_DETAIL_PAYMENT_DETAILS : API.ASSIGNMENT + '/detail/paymentDetails'
    });

    // Event type services
    Ext.apply(API, {
        EVENT_TYPE_CATEGORY : API.EVENT_TYPE + '/category'
    });

    // Recruiting Email services
    Ext.apply(API, {
        EMAIL_LAYOUT_PREVIEW : API.EMAIL_LAYOUT + '/preview',
        EMAIL_LAYOUT_SEND : API.EMAIL_LAYOUT + '/send'
    });

    // Search services
    Ext.apply(API, {
        SEARCH_PERSON : API.SEARCH + '/person',
        SEARCH_PERSON_BY_NAME : API.SEARCH + '/personByName',
        SEARCH_POSITIONS_BY_POSITION_OR_PERSON : API.EMPLOYER + '/position/searchByPositionOrPerson',
        SEARCH_ESS_USERS : API.SEARCH + '/essPerson'
    });

    // Employer services
    Ext.apply(API, {
        EMPLOYER_WORK_LOCATION : API.EMPLOYER + '/workLocation',
        EMPLOYER_TIME_OFF_PLAN : API.EMPLOYER + '/timeOffPlan',
        EMPLOYER_TIME_OFF_PLAN_TYPE : API.EMPLOYER + '/timeOffPlan/type',
        EMPLOYER_TIME_OFF_PLAN_TYPE_ACTIVE : API.EMPLOYER + '/timeOffPlan/type/active',
        EMPLOYER_TIME_OFF_PLAN_ACCRUAL : API.EMPLOYER + '/timeOffPlan/accrual/{0}',
        EMPLOYER_TIME_OFF_PLANS_ACCRUAL : API.EMPLOYER + '/timeOffPlan/accrual',
        EMPLOYER_POSITION : API.EMPLOYER + '/position',
        EMPLOYER_LOGO : API.EMPLOYER + '/logo',
        EMPLOYER_DOCUMENT : API.EMPLOYER + '/document',
        EMPLOYER_DOCUMENT_DELETE_ITEM : API.EMPLOYER + '/document/deleteItem',
        EMPLOYER_DOCUMENT_MOVE_ITEM : API.EMPLOYER + '/document/move',
        EMPLOYER_DOCUMENT_TREE : API.EMPLOYER + '/document/tree',
        EMPLOYER_DATAFORM : API.EMPLOYER + '/dataform',
        EMPLOYER_DATAFORM_ID : API.EMPLOYER + '/dataform/{0}',
        EMPLOYER_FORM_TREE : API.EMPLOYER + '/form/tree',
        EMPLOYER_DOCUMENT_ADD_FOLDER : API.EMPLOYER + '/document/addFolder',
        EMPLOYER_DOCUMENT_MAX_FILE_SIZE : API.EMPLOYER + '/document/maxFileSize',
        EMPLOYER_PREVIEW_LOGO : API.EMPLOYER + '/previewLogo',
        EMPLOYER_TAX : API.EMPLOYER + '/tax',
        EMPLOYER_VIDEO : API.EMPLOYER + '/video',
        EMPLOYER_OVERTIME : API.EMPLOYER + '/overtime',
        EMPLOYER_GL_SETUP : API.EMPLOYER + '/glSetup',
        EMPLOYER_REQUIRED_COVERAGE : API.EMPLOYER + '/requiredCoverage',
        EMPLOYER_POPULATION_COUNT : API.EMPLOYER + '/populationCount',
        EMPLOYER_PAY_GROUP : API.EMPLOYER + '/payGroup',
        EMPLOYER_CARRIER : API.EMPLOYER + '/carrier',
        EMPLOYER_ESS_LINK : API.EMPLOYER + '/essLink',
        EMPLOYER_ESS_LINK_GET_SAML2_FORM : API.EMPLOYER + '/essLink/getSaml2Form',
        WORKERS_COMPENSATION : API.EMPLOYER + '/workerCompensation',
        EMPLOYER_SCHEDULE : API.EMPLOYER + '/schedule',
        ACTIVE_EMPLOYEES_COUNT : API.EMPLOYER + '/{0}/activeEmployeesCount',
        EMPLOYER_RECRUITING_SETTINGS : API.EMPLOYER + '/recruitingSetting',
        EMPLOYER_ONBOARDING : API.EMPLOYER + '/onboarding',
        EMPLOYER_ONBOARDING_ASSIGN : API.EMPLOYER + '/onboarding/assign',
        EMPLOYER_ONBOARDING_DETAIL_ASSIGN : API.EMPLOYER + '/onboarding/detail/assign',

        EMPLOYER_ESS_WIDGETS : API.EMPLOYER + '/essWidgets',

        EMPLOYER_DEDUCTION : API.EMPLOYER + '/deduction',
        EMPLOYER_DEDUCTION_LABEL : API.EMPLOYER + '/deduction/label',
        EMPLOYER_INCOME_LIST : API.EMPLOYER + '/incomeList',
        EMPLOYER_INCOME_LIST_LABEL : API.EMPLOYER + '/incomeList/label',

        EMPLOYER_CLASSIFICATION : API.EMPLOYER + '/classification',
        EMPLOYER_TASK : API.EMPLOYER + '/task',
        EMPLOYER_TASK_CLASSIFICATION : API.EMPLOYER + '/task/classification',
        EMPLOYER_TASK_GROUP : API.EMPLOYER + '/taskGroup',

        EMPLOYER_PROJECT : API.EMPLOYER + '/project'
    });

    // Employer holiday services
    Ext.apply(API, {
        EMPLOYER_HOLIDAY : API.EMPLOYER + '/holiday',
        EMPLOYER_HOLIDAY_CLONE : API.EMPLOYER + '/holiday/{0}/clone',
        EMPLOYER_HOLIDAY_DETAIL : API.EMPLOYER + '/holiday/detail',
        EMPLOYER_HOLIDAY_DETAIL_FOR_EMPLOYEE : API.EMPLOYER + '/holiday/detail/forEmployee'
    });

    // Employer attachment services
    Ext.apply(API, {
        EMPLOYER_DOCUMENT_UPLOAD : API.EMPLOYER_DOCUMENT + '/upload',
        EMPLOYER_DOCUMENT_DOWNLOAD : API.EMPLOYER_DOCUMENT + '/download/'
    });

    // Employer position services
    Ext.apply(API, {
        EMPLOYER_POSITION_CREATE_WITH_JOB : API.EMPLOYER_POSITION + '/createWithJob',
        EMPLOYER_POSITION_TERMINATE : API.EMPLOYER_POSITION + '/{0}/{1}/terminate',
        EMPLOYER_POSITION_REINSTATE : API.EMPLOYER_POSITION + '/{0}/{1}/reinstate',
        EMPLOYER_POSITION_FULL_REPORTS : API.EMPLOYER_POSITION_FULL_REPORT =
            API.EMPLOYER_POSITION + '/fullReports',
        EMPLOYER_POSITION_DIRECT_REPORT : API.EMPLOYER_POSITION_DIRECT_REPORT =
            API.EMPLOYER_POSITION + '/directReports',
        EMPLOYER_POSITION_ROOT_REPORTS : API.EMPLOYER_POSITION_ROOT_REPORT =
            API.EMPLOYER_POSITION + '/rootReports',
        EMPLOYER_POSITION_COMPANY_REPORTS : API.EMPLOYER_POSITION_COMPANY_REPORT =
            API.EMPLOYER_POSITION + '/companyReports',
        EMPLOYER_POSITION_TEAM_REPORTS : API.EMPLOYER_POSITION_TEAM_REPORT =
            API.EMPLOYER_POSITION + '/teamReports',
        EMPLOYER_POSITION_ASSIGNED : API.EMPLOYER_POSITION + '/assigned',
        EMPLOYER_POSITION_WITH_JOB : API.EMPLOYER_POSITION + '/withJob',
        EMPLOYER_POSITION_SEARCH : API.EMPLOYER_POSITION + '/search',
        EMPLOYER_POSITION_SEARCH_REMAINING_FTE : API.EMPLOYER_POSITION + '/getRemainingFTE',
        EMPLOYER_POSITION_SKILL : API.EMPLOYER_POSITION + '/skill'
    });

    // Employer Overtimes
    Ext.apply(API, {
        EMPLOYER_OVERTIME_DETAIL : API.EMPLOYER_OVERTIME + '/detail'
    });

    // Attendance - Work Period
    Ext.apply(API, {
        EMPLOYER_WORK_PERIOD : API.EMPLOYER + '/attendance/workPeriod'
    });

    // T4
    Ext.apply(API, {
        EMPLOYER_T4_GENERATE_PDF : API.EMPLOYER + '/t4/generatePdf',
        EMPLOYER_T4_GENERATE_ZIP : API.EMPLOYER + '/t4/generateZip'
    });

    // Person services
    Ext.apply(API, {
        PERSON_DISABLE : API.PERSON + '/disable',
        PERSON_ENABLE : API.PERSON + '/enable',
        PERSON_RESET_PASSWORD : API.PERSON + '/resetPassword',
        PERSON_GENERATE_PASSWORD : API.PERSON + '/generatePassword',
        PERSON_CHANGE_PASSWORD : API.PERSON + '/changePassword',
        PERSON_VALIDATE_EMAIL : API.PERSON + '/validateEmail',
        PERSON_VALIDATE_EMAIL_UPDATE : API.PERSON + '/validateEmailUpdate',
        PERSON_PHONE : API.PERSON + '/phone',
        PERSON_CERTIFICATION : API.PERSON + '/certification',
        PERSON_CERTIFICATION_RECALL : API.PERSON + '/certification/recall/{0}',
        PERSON_EDUCATION : API.PERSON + '/education',
        PERSON_EDUCATION_RECALL : API.PERSON + '/education/recall/{0}',
        PERSON_SKILL : API.PERSON + '/skill',
        PERSON_SKILL_RECALL : API.PERSON + '/skill/recall/{0}',
        PERSON_CONTACT : API.PERSON + '/contact',
        PERSON_CONTACT_RECALL : API.PERSON + '/contact/recall/{0}',
        PERSON_EMPLOYMENT_HISTORY : API.PERSON + '/employmentHistory',
        PERSON_EMPLOYMENT_HISTORY_COUNT : API.PERSON + '/employmentHistory/count',
        PERSON_BANK_ACCOUNT : API.PERSON + '/bankAccount',
        PERSON_BANK_ACCOUNT_IS_USE_PRESETS : API.PERSON + '/bankAccount/isUsePresets',
        PERSON_BANK_ACCOUNT_RECALL : API.PERSON + '/bankAccount/recall/{0}',

        WORKER_COMPENSATION_CLAIM : API.EMPLOYEE + '/wcclaim',
        PERSON_DEMOGRAPHICS_RECALL : API.PERSON + '/recall/{0}',
        PERSON_ADDRESS : API.PERSON + '/address',
        PERSON_ADDRESS_RECALL : API.PERSON + '/address/recall/{0}',
        EMPLOYEE_SEARCH : API.EMPLOYEE + '/search',
        EMPLOYEE_SEARCH_DELEGATION : API.EMPLOYEE + '/searchDelegation',
        EMPLOYEE_SEARCH_NEIGHBORS : API.EMPLOYEE + '/searchNeighbors?employeeId={0}',
        EMPLOYEE_AVAILABLE_SUPERVISORS : API.EMPLOYEE + '/availableSupervisors',
        EMPLOYEE_TASK : API.EMPLOYEE + '/task',
        PERSON_PRIOR_EMPLOYMENT : API.PERSON + '/priorEmployment',
        PERSON_COMMUNICATION : API.PERSON + '/communication',

        PERSON_PREVIEW_PHOTO : API.PERSON + '/previewPhoto/',
        PERSON_LOGO : API.PERSON + '/photo',
        PERSON_PHOTO_THUMB : API.PERSON + '/photo/thumb',
        PERSON_LOGO_MAX_FILE_SIZE : API.PERSON + '/photo/maxFileSize',
        PERSON_PREFERENCES : API.PERSON + '/preferences',
        PERSON_FIRST_ASSIGNED_POSITION : API.PERSON + '/firstAssignedPosition',
        PERSON_ASSIGNED_POSITIONS : API.PERSON + '/assignedPositions',

        EMPLOYEE_DEDUCTION_CHECK_WARNINGS : API.EMPLOYEE_DEDUCTION + '/checkWarnings',
        EMPLOYEE_GENERATE_EMPLOYEE_NUMBER : API.EMPLOYEE + '/generateEmployeeNumber',
        PERSON_IS_LOGIN_ENABLE : API.PERSON + '/isLoginEnable',
        PERSON_IS_2FA_ENABLED : API.PERSON + '/is2faEnabled?personId={0}',
        PERSON_SET_2FA_ENABLED : API.PERSON + '/set2faEnabled?totp={0}',
        PERSON_SET_2FA_DISABLED : API.PERSON + '/set2faDisabled',
        PERSON_GET_QR_CODE : API.PERSON + '/qr',
        PERSON_GET_FA_SEED : API.PERSON + '/secondFaSeed',
        PERSON_FORMAT_PHONE : API.PERSON + '/formatPhone',
        PERSON_VALIDATE_PHONE : API.PERSON + '/validatePhone',
        PERSON_SET_LOGIN_ENABLE : API.PERSON + '/setLoginEnable?employeeId={0}&enable={1}&authenticationTypeCd={2}&login={3}&is2faEnabled={4}&isExternal={5}',
        PERSON_UNLOCK_LOGIN : API.PERSON + '/unlockLogin?personId={0}',
        EMPLOYEE_WORK_LOCATION : API.EMPLOYEE + '/workLocation',
        PERSON_DIRECTORY_SEARCH : API.PERSON + '/directorySearch',
        EMPLOYEE_COURSE : API.EMPLOYEE + '/course',
        EMPLOYEE_COURSE_ATTACHMENT : API.EMPLOYEE + '/course/{0}/attachment',
        EMPLOYEE_COURSE_ATTACHMENT_UPLOAD : API.EMPLOYEE + '/course/{0}/attachment/upload',
        EMPLOYEE_COURSE_ATTACHMENT_DOWNLOAD : API.EMPLOYEE + '/course/{0}/attachment/download',

        EMPLOYEE_GOAL : API.EMPLOYEE + '/goal',
        EMPLOYEE_GOAL_IMPORT_DOWNLOAD_TEMPLATE : API.EMPLOYEE + '/goal/import/downloadTemplate',
        EMPLOYEE_GOAL_IMPORT_UPLOAD : API.EMPLOYEE + '/goal/import/upload',
        EMPLOYEE_GOAL_IMPORT_MAXFILESIZE : API.EMPLOYEE + '/goal/import/maxFileSize',

        EMPLOYEE_GOAL_IMPORT_ERRORS : API.EMPLOYEE + '/goal/import/errors/{0}',
        EMPLOYEE_GOAL_IMPORT : API.EMPLOYEE + '/goal/import/{0}',

        EMPLOYEE_TEAM_GOAL : API.EMPLOYEE + '/goal/team',

        EMPLOYEE_REVIEW : API.EMPLOYEE + '/review',
        EMPLOYEE_REVIEW_LIST : API.EMPLOYEE + '/review/list',
        EMPLOYEE_REVIEW_AGGREGATED : API.EMPLOYEE + '/review/aggregated',
        EMPLOYEE_REVIEW_SUBORDINATE_AGGREGATED : API.EMPLOYEE + '/review/subordinateAggregated',
        EMPLOYEE_REVIEW_AGGREGATED_SET_PUBLISHED : API.EMPLOYEE + '/review/aggregated/setPublished',
        EMPLOYEE_REVIEW_AGGREGATED_SET_PUBLISHED_FOR_REVIEWER : API.EMPLOYEE + '/review/aggregated/setPublishedForReviewer',
        EMPLOYEE_REVIEW_AGGREGATED_SET_PUBLISHED_FOR_MANAGER : API.EMPLOYEE + '/review/aggregated/setPublishedForManager',
        EMPLOYEE_REVIEW_JOURNAL : API.EMPLOYEE + '/reviewJournal',
        EMPLOYEE_REVIEW_DETAIL : API.EMPLOYEE + '/review/detail',
        EMPLOYEE_REVIEW_SUBMIT : API.EMPLOYEE + '/review/submit',
        EMPLOYEE_REVIEW_SET_VIEWED : API.EMPLOYEE + '/review/setViewed',
        EMPLOYEE_REVIEW_DOWNLOAD : API.EMPLOYEE + '/review/{0}/download',
        EMPLOYEE_REVIEW_AGGREGATED_DOWNLOAD : API.EMPLOYEE + '/review/{0}/aggregatedDownload?employeeId={1}',
        EMPLOYEE_TEAM_MEMBERS : API.EMPLOYEE + '/teamMembers',
        EMPLOYEE_UNAVAILABLE_BLOCK : API.EMPLOYEE + '/unavailableBlock',
        EMPLOYEE_ORG_CHART : API.EMPLOYEE + '/orgChart',
        EMPLOYEE_ORG_CHART_ALL_STRUCTURES : API.EMPLOYEE + '/orgChartAllStructures',
        EMPLOYEE_ORG_CHART_DOWNLOAD : API.EMPLOYEE + '/downloadChart',
        EMPLOYEE_ORG_TREE : API.EMPLOYEE + '/orgTree',
        EMPLOYEE_TERMINATE : API.EMPLOYEE + '/terminate/{0}',
        EMPLOYEE_UNTERMINATE : API.EMPLOYEE + '/unterminate/{0}',
        EMPLOYEE_RESUBMIT : API.EMPLOYEE + '/resubmit/{0}',
        EMPLOYEE_CHANGE_SUPERVISOR : API.EMPLOYEE + '/changeSupervisor',
        EMPLOYEE_DELEGATION : API.EMPLOYEE + '/delegation',
        EMPLOYEE_SUBORDINATE_DELEGATION : API.EMPLOYEE + '/subordinate/delegation',
        EMPLOYEE_SUBORDINATE_TEAM_MEMBERS : API.EMPLOYEE + '/subordinate/teamMembers',
        EMPLOYEE_ONBOARDING : API.EMPLOYEE + '/onboarding'
    });

    // Employee onboarding form service
    Ext.apply(API, {
        EMPLOYEE_ONBOARDING_DATAFORM_FIELDS : API.EMPLOYEE_ONBOARDING + '/dataformFields/{0}',
        EMPLOYEE_ONBOARDING_WEBFORM_FIELDS : API.EMPLOYEE_ONBOARDING + '/webformFields/{0}',
        EMPLOYEE_ONBOARDING_DOWNLOAD : API.EMPLOYEE_ONBOARDING + '/download/',
        EMPLOYEE_ONBOARDING_NOTIFY : API.EMPLOYEE_ONBOARDING + "/notify"
    });

    // Employee Pay check download service
    Ext.apply(API, {
        EMPLOYEE_DOWNLOAD_PAY_CHECK_REPORT : API.EMPLOYEE + '/downloadPayCheckReport?payDate={0}&showSSN={1}&id={2}'
    });

    // Employee attendance service
    Ext.apply(API, {
        EMPLOYEE_ATTENDANCE_DASHBOARD : API.EMPLOYEE + '/attendance/dashboard',
        EMPLOYEE_ATTENDANCE_OVERTIME : API.EMPLOYEE + '/attendance/overtime',
        EMPLOYEE_ATTENDANCE_WORK_PERIOD_EXCEPTION : API.EMPLOYEE + '/attendance/workPeriodException'
    });

    // Employee team time offs service
    Ext.apply(API, {
        EMPLOYEE_TEAM_TIME_OFF : API.EMPLOYEE + '/teamTimeOff',
        EMPLOYEE_TEAM_TIME_OFF_DETAIL : API.EMPLOYEE + '/teamTimeOff/detail'
    });

    // Worker compensation claim services
    Ext.apply(API, {
        WORKER_COMPENSATION_CLAIM_COST : API.WORKER_COMPENSATION_CLAIM + '/cost',
        WORKER_COMPENSATION_CLAIM_LOG : API.WORKER_COMPENSATION_CLAIM + '/log'
    });

    // Employee time off plan services
    Ext.apply(API, {
        EMPLOYEE_TIME_OFF_PLAN : API.EMPLOYEE + '/timeOffPlan',
        EMPLOYEE_TIME_OFF_PLAN_AVAILABLE : API.EMPLOYEE + '/timeOffPlan/available',
        EMPLOYEE_TIME_OFF_PLAN_ACTIVE : API.EMPLOYEE + '/timeOffPlan/active',
        EMPLOYEE_TIME_OFF_PLAN_ACCRUAL : API.EMPLOYEE + '/timeOffPlan/accrual',
        EMPLOYEE_TIME_OFF_PLAN_PERIODS : API.EMPLOYEE + '/timeOffPlan/period',
        EMPLOYEE_TIME_OFF_PLAN_ADJUSTMENT : API.EMPLOYEE + '/timeOffPlan/adjustAccruedValue',
        EMPLOYEE_TIME_OFF_PLAN_HAS_ACTIVE_PLANS : API.EMPLOYEE + '/timeOffPlan/hasActivePlans'
    });

    Ext.apply(API, {
        EMPLOYEE_TIME_OFF : API.EMPLOYEE + '/timeOff',
        EMPLOYEE_TIME_OFF_SUBMIT : API.EMPLOYEE + '/timeOff/submit',
        EMPLOYEE_TIME_OFF_RECALL : API.EMPLOYEE + '/timeOff/recall/{0}',
        EMPLOYEE_TIME_OFF_DETAIL : API.EMPLOYEE + '/timeOff/detail',
        EMPLOYEE_TIME_OFF_AVAILABLE_TYPES : API.EMPLOYEE + '/timeOff/availableTypes',
        EMPLOYEE_TIME_OFF_TIME_BALANCES : API.EMPLOYEE + '/timeOff/timeBalances',
        EMPLOYEE_TIME_OFF_CHECK_SPLITTING : API.EMPLOYEE + '/timeOff/checkSplitting',
        EMPLOYEE_TIME_OFF_SPLIT_AND_CREATE : API.EMPLOYEE + '/timeOff/splitAndCreate',

        EMPLOYEE_TIME_OFF_UPLOAD_ATTACHMENT : API.EMPLOYEE + '/timeOff/uploadAttachment',
        EMPLOYEE_TIME_OFF_DOWNLOAD_ATTACHMENT : API.EMPLOYEE + '/timeOff/downloadAttachment/{0}'
    });
    // mobile part
    Ext.apply(API, {
        MOBILE_EMPLOYEE_TIME_OFF : API.MOBILE_EMPLOYEE + '/timeOff',
        MOBILE_EMPLOYEE_TIME_OFF_DETAIL : API.MOBILE_EMPLOYEE + '/timeOff/detail',
        MOBILE_EMPLOYEE_TIME_OFF_SUBMIT : API.MOBILE_EMPLOYEE + '/timeOff/submit',
        MOBILE_EMPLOYEE_TIME_OFF_CHECK_SPLITTING : API.MOBILE_EMPLOYEE + '/timeOff/checkSplitting',
        MOBILE_EMPLOYEE_TIME_OFF_SPLIT_AND_CREATE : API.EMPLOYEE + '/timeOff/splitAndCreate',
        MOBILE_SECURITY_ENABLE_BIOMETRIC : API.MOBILE_EMPLOYEE + '/security/enableBiometric',
        MOBILE_SECURITY_BIOMETRIC_IS_ENABLED : API.MOBILE_EMPLOYEE + '/security/biometricIsEnabled'
    });

    // Employee timesheet
    Ext.apply(API, {
        EMPLOYEE_TIMESHEET : API.EMPLOYEE + '/timesheet',
        EMPLOYEE_TIMESHEET_TASK : API.EMPLOYEE + '/timesheet/task',
        EMPLOYEE_TIMESHEET_HORIZONTAL : API.EMPLOYEE + '/timesheet/horizontal',
        EMPLOYEE_TIMESHEET_VERTICAL : API.EMPLOYEE + '/timesheet/hourly',
        EMPLOYEE_TIMESHEET_VERTICAL_TASK_DETAIL : API.EMPLOYEE + '/timesheet/hourly/detail',
        EMPLOYEE_TIMESHEET_VERTICAL_SPLIT : API.EMPLOYEE + '/timesheet/hourly/split/{0}',
        EMPLOYEE_TIMESHEET_SUBORDINATE_TIME : API.EMPLOYEE + '/teamMembersTimesheetStatistics',
        EMPLOYEE_TIMESHEET_TASK_DETAIL : API.EMPLOYEE + '/timesheet/task/detail',
        EMPLOYEE_TIMESHEET_TASK_BY_DATE : API.EMPLOYEE + '/timesheet/task/byDates',
        EMPLOYEE_TIMESHEET_SUBMIT : API.EMPLOYEE + '/timesheet/submit',
        EMPLOYEE_TIMESHEET_RECALL : API.EMPLOYEE + '/timesheet/recall/{0}',
        EMPLOYEE_TIMESHEET_PAYCODES : API.EMPLOYEE + '/timesheet/availablePaycodes',
        EMPLOYEE_TIMESHEET_INCOME_CODES : API_ROOT + '/employee/timesheet/availableIncomeCodes',
        EMPLOYEE_TIMESHEET_AVAILABLE_ASSIGNMENTS : API_ROOT + '/employee/timesheet/availableAssignments',
        EMPLOYEE_TIMESHEET_AVAILABLE_TASKS : API_ROOT + '/employee/timesheet/availableTasks',
        EMPLOYEE_TIMESHEET_AVAILABLE_PROJECTS : API_ROOT + '/employee/timesheet/availableProjects',
        EMPLOYEE_TIMESHEET_SAVE_NOTE : API.EMPLOYEE + '/timesheet/setNotes/{0}',

        EMPLOYEE_TIMESHEET_TASK_START : API.EMPLOYEE + '/timesheet/task/start/{0}',
        EMPLOYEE_TIMESHEET_TASK_STOP : API.EMPLOYEE + '/timesheet/task/stop/{0}',

        EMPLOYEE_HAS_STARTED_TIMESHEET_TASK : API.EMPLOYEE + '/timesheet/task/isStarted',
        EMPLOYEE_TIMESHEET_IN : API.EMPLOYEE + '/chromeExtension/in',
        EMPLOYEE_TIMESHEET_OUT : API.EMPLOYEE + '/chromeExtension/out',

        MOBILE_EMPLOYEE_TIMESHEET_TASK_DETAIL : API.MOBILE_EMPLOYEE + '/timesheet/task/detail',
        DASHBOARD_SUBORDINATE_TIMESHEETS : API_ROOT + '/dashboard/subordinateTimesheets',
        DASHBOARD_SUBORDINATE_TIMESHEETS_NEIGHBORS : API_ROOT + '/dashboard/subordinateTimesheetsNeighbors',
        DASHBOARD_SUBORDINATE_TIMESHEETS_GRID : API_ROOT + '/dashboard/subordinateTimesheets/grid',
        DASHBOARD_SUBORDINATE_TIMESHEETS_GRID_DATES_RANGES : API_ROOT + '/dashboard/subordinateTimesheets/gridDatesRanges',
        EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_INCOME_CODES : API.EMPLOYEE + '/subordinate/timesheet/availableIncomeCodes',
        EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_TASKS : API.EMPLOYEE + '/subordinate/timesheet/availableTasks',
        EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_PROJECTS : API.EMPLOYEE + '/subordinate/timesheet/availableProjects',
        EMPLOYEE_SUBORDINATE_TIMESHEET_VERTICAL : API.EMPLOYEE + '/subordinate/timesheet/hourly',
        EMPLOYEE_SUBORDINATE_TIMESHEET_HORIZONTAL : API.EMPLOYEE + '/subordinate/timesheet/horizontal',
        EMPLOYEE_SUBORDINATE_TIMESHEET_HORIZONTAL_TASK : API.EMPLOYEE + '/subordinate/timesheet/task',
        EMPLOYEE_SUBORDINATE_TIMESHEET_AGGREGATE : API.EMPLOYEE + '/subordinate/timesheet/aggregate',
        EMPLOYEE_SUBORDINATE_TIMESHEET_AGGREGATE_CALC_FTE_MULTIPLIER : API.EMPLOYEE + '/subordinate/timesheet/aggregate/calcFTEMultiplier',
        DASHBOARD_SUBORDINATE_TIMESHEETS_TEAM_PUNCH : API_ROOT + '/dashboard/subordinateTimesheets/teamPunch',
        DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_PAY_CODES : API_ROOT + '/dashboard/subordinateTimesheets/availablePayCodes',
        DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_WORK_LOCATIONS : API_ROOT + '/dashboard/subordinateTimesheets/availableWorkLocations',
        DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_AREAS : API_ROOT + '/dashboard/subordinateTimesheets/availableAreas',
        DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_PROJECTS : API_ROOT + '/dashboard/subordinateTimesheets/availableProjects',
        DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_TASKS : API_ROOT + '/dashboard/subordinateTimesheets/availableTasks',
        DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_DATA : API_ROOT + '/dashboard/subordinateTimesheets/availableData',

        DASHBOARD_SUBORDINATE_TIMESHEETS_MASS_SUBMIT : API_ROOT + '/dashboard/subordinateTimesheets/massSubmit',

        DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_UPLOAD : API_ROOT + '/dashboard/subordinateTimesheets/import/upload',
        DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_MAXFILESIZE : API_ROOT + '/dashboard/subordinateTimesheets/import/maxFileSize',
        DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_DOWNLOAD_TEMPLATE : API_ROOT + '/dashboard/subordinateTimesheets/import/downloadTemplate',

        DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_ERRORS : API_ROOT + '/dashboard/subordinateTimesheets/import/errors/{0}',
        DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT : API_ROOT + '/dashboard/subordinateTimesheets/import/{0}',
        DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_FROM_EXTERNAL_SYSTEM : API_ROOT + '/dashboard/subordinateTimesheets/importFromExternalSystem',
        DASHBOARD_SUBORDINATE_TIMESHEETS_DOWNLOAD : API_ROOT + '/dashboard/subordinateTimesheets/download',

        EMPLOYEE_TIMESHEET_AGGREGATE : API.EMPLOYEE + '/timesheet/aggregate',
        CALC_FTE_MULTIPLIER : API.EMPLOYEE + '/timesheet/aggregate/calcFTEMultiplier',
        HAS_TRACKABLE_INCOMES : API.EMPLOYEE + '/hasTrackableIncomes',

        EMPLOYEE_TIMESHEET_TYPE : API.EMPLOYEE + '/timesheetType'
    });

    // Employee attachment services

    Ext.apply(API, {
        EMPLOYEE_DOCUMENT : API.EMPLOYEE + '/document',
        EMPLOYEE_DOCUMENT_TREE : API.EMPLOYEE + '/document/tree',
        EMPLOYEE_DOCUMENT_ADD_FOLDER : API.EMPLOYEE + '/document/addFolder',
        EMPLOYEE_DOCUMENT_DELETE_ITEM : API.EMPLOYEE + '/document/deleteItem',
        EMPLOYEE_DOCUMENT_MOVE : API.EMPLOYEE + '/document/move',
        EMPLOYEE_DOCUMENT_MAX_FILE_SIZE : API.EMPLOYEE + '/document/maxFileSize'
    });

    Ext.apply(API, {
        EMPLOYEE_DOCUMENT_UPLOAD : API.EMPLOYEE_DOCUMENT + '/upload',
        EMPLOYEE_DOCUMENT_MASS_UPLOAD : API.EMPLOYEE_DOCUMENT + '/massUpload',
        EMPLOYEE_DOCUMENT_DOWNLOAD : API.EMPLOYEE_DOCUMENT + '/download/'
    });

    // Employee Review Journal services

    Ext.apply(API, {
        EMPLOYEE_REVIEW_JOURNAL_MAX_FILE_SIZE : API.EMPLOYEE_REVIEW_JOURNAL + '/maxFileSize', // bytes
        EMPLOYEE_REVIEW_JOURNAL_UPLOAD : API.EMPLOYEE_REVIEW_JOURNAL + '/upload',
        EMPLOYEE_REVIEW_JOURNAL_DOWNLOAD : API.EMPLOYEE_REVIEW_JOURNAL + '/download'
    });

    // Assets services
    Ext.apply(API, {
        EMPLOYEE_NO_PHOTO : API.ASSETS_IMAGES + '/no-employee-photo.jpg',
        EMPLOYEE_NO_PHOTO_90 : API.ASSETS_IMAGES + '/no-employee-photo-90.jpg',
        EMPLOYEE_NO_PHOTO_120 : API.ASSETS_IMAGES + '/no-employee-photo-120.jpg',
        EMPLOYER_NO_LOGO : API.ASSETS_IMAGES + '/no-employer-logo.jpg'
    });

    // Payroll services
    Ext.apply(API, {
        PAYROLL_RECALCULATE : API.PAYROLL + '/recalculate',
        PAYROLL_INCOME : API.PAYROLL + '/income',
        PAYROLL_DETAILS : API.PAYROLL + '/getDetails',
        PAYROLL_PAY_DATE_YEARS : API.PAYROLL + '/payDateYears',
        PAYROLL_NEXT_PAY_DATE : API.PAYROLL + '/nextPayDate',
        PAYROLL_GROSS_UP : API.PAYROLL + '/grossUp',
        PAYROLL_YEARS : API.PAYROLL + '/years',

        PRINT_CHECK : API.PAYROLL + '/generateCheck',
        CHECK_BANK_ACCOUNT_REPORT : API.PAYROLL + '/checkBankAccountReport?bankAccountId={0}',
        LAST_PAY_DATES : API.PAYROLL + '/lastPayDates',
        CHANGE_PAYMENT : API.PAYROLL + '/changePayment',
        VOID_PAYMENT : API.PAYROLL + '/voidPayment',
        PAYROLL_REVERSE : API.PAYROLL + '/reverse',
        PAYROLL_AVAILABLE_PROJECTS : API.PAYROLL + '/availableProjects',
        PAYROLL_TASKS_AVAILABLE : API.PAYROLL + '/availableTasks',
        PAYROLL_ASSIGNMENT_AVAILABLE : API.PAYROLL + '/assignment/available',

        PAYROLL_GENERATE_SUMMARY_REPORT : API.PAYROLL + '/generateSummaryReport?name={0}&options={1}',
        PAYROLL_DOWNLOAD_GENERATED_SUMMARY_REPORT : API.PAYROLL + '/downloadGeneratedSummaryReport?batchId={0}&fileId={1}',

        PAYROLL_PAYMENT_DEPOSIT : API.PAYROLL + '/payment/deposit'
    });

    // Employer payroll Batch
    Ext.apply(API, {
        EMPLOYER_PAYROLL_BATCH : API.EMPLOYER + '/payrollBatch',
        EMPLOYER_PAYROLL_BATCH_COMPLETE : API.EMPLOYER + '/payrollBatch/complete/{0}',
        EMPLOYER_PAYROLL_BATCH_APPROVE : API.EMPLOYER + '/payrollBatch/approve/{0}',
        EMPLOYER_PROCESSING_PAYROLL_BATCH : API.EMPLOYER + '/processingPayrollBatch',
        EMPLOYER_PAYROLL_BATCH_UNAPPROVE : API.EMPLOYER + '/payrollBatch/unapprove/{0}',
        EMPLOYER_PAYROLL_BATCH_ADD_EMPLOYEE : API.EMPLOYER + '/payrollBatch/addEmployees',
        EMPLOYER_PAYROLL_BATCH_REMOVE_EMPLOYEE : API.EMPLOYER + '/payrollBatch/removeEmployee',
        EMPLOYER_PAYROLL_BATCH_ADD_INCOME : API.EMPLOYER + '/payrollBatch/addIncomeList',
        EMPLOYER_PAYROLL_BATCH_REMOVE_INCOME : API.EMPLOYER + '/payrollBatch/removeIncomeList',
        EMPLOYER_PAYROLL_BATCH_CHANGE_INCOME_LISTS : API.EMPLOYER + '/payrollBatch/changeIncomeLists',
        EMPLOYER_PAYROLL_BATCH_CALCULATE : API.EMPLOYER + '/payrollBatch/calculate',
        EMPLOYER_PAYROLL_BATCH_RECALCULATE : API.EMPLOYER + '/payrollBatch/recalculate',
        EMPLOYER_PAYROLL_BATCH_DETAIL : API.EMPLOYER + '/payrollBatch/details',
        EMPLOYER_PAYROLL_BATCH_DETAIL_VIEW_DETAIL : API.EMPLOYER + '/payrollBatch/detail/viewDetails',
        EMPLOYER_PAYROLL_BATCH_SUMMARY : API.EMPLOYER + '/payrollBatch/summary',
        EMPLOYER_PAYROLL_BATCH_PAY_SUMMARY : API.EMPLOYER + '/payrollBatch/paySummary',
        EMPLOYER_PAYROLL_BATCH_GENERATE_ACH : API.EMPLOYER + '/payrollBatch/transmissionFile/generateACH',
        EMPLOYER_PAYROLL_BATCH_GENERATE_CERIDIAN_CHECK : API.EMPLOYER + '/payrollBatch/transmissionFile/generateCeridianCheck',
        EMPLOYER_PAYROLL_BATCH_ACH_PAYMENTS : API.EMPLOYER + '/payrollBatch/achPayments',
        EMPLOYER_PAYROLL_BATCH_CERIDIAN_CHECK_PAYMENTS : API.EMPLOYER + '/payrollBatch/ceridianCheckPayments',
        EMPLOYER_PAYROLL_BATCH_DOWNLOAD_FILE : API.EMPLOYER + '/payrollBatch/transmissionFile/download?id=',
        EMPLOYER_PAYROLL_BATCH_EXPORT_TWN : API.EMPLOYER + '/payrollBatch/transmissionFile/exportTWN',

        EMPLOYER_PAYROLL_BATCH_GENERATE_PERIODIC_CERIDIAN_XML : API.EMPLOYER + '/payrollBatch/transmissionFile/generatePeriodicCeridianXml',
        EMPLOYER_PAYROLL_BATCH_GENERATE_QUARTERLY_CERIDIAN_XML : API.EMPLOYER + '/payrollBatch/transmissionFile/generateQuarterlyCeridianXml',
        EMPLOYER_PAYROLL_BATCH_GENERATE_ANNUAL_CERIDIAN_XML : API.EMPLOYER + '/payrollBatch/transmissionFile/generateAnnualCeridianXml',
        EMPLOYER_PAYROLL_BATCH_GENERATE_EMPLOYEE_CERIDIAN_XML : API.EMPLOYER + '/payrollBatch/transmissionFile/generateEmployeeCeridianXml',
        EMPLOYER_PAYROLL_BATCH_TRANSMISSION_FILE : API.EMPLOYER + '/payrollBatch/transmissionFile',
        EMPLOYER_PAYROLL_BATCH_GENERATE_T4 : API.EMPLOYER + '/payrollBatch/transmissionFile/generateT4',

        EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS_DOWNLOAD_TEMPLATE : API.EMPLOYER + '/payrollBatch/import/deductions/downloadTemplate?payrollBatchId={0}',
        EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS_UPLOAD : API.EMPLOYER + '/payrollBatch/import/deductions/upload',
        EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS_MAXFILESIZE : API.EMPLOYER + '/payrollBatch/import/deductions/maxFileSize',
        EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS_ERRORS : API.EMPLOYER + '/payrollBatch/import/deductions/errors/{0}',
        EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS : API.EMPLOYER + '/payrollBatch/import/deductions/{0}',

        EMPLOYER_PAYROLL_SCHEDULE : API.EMPLOYER + '/payrollSchedule',
        EMPLOYER_PAYROLL_SCHEDULE_PAYROLL_PERIOD : API.EMPLOYER + '/payrollSchedule/payrollPeriod',
        EMPLOYER_PAYROLL_BATCH_SEARCH_PERSON : API.EMPLOYER + '/payrollBatch/search/person',
        EMPLOYER_PAYROLL_BATCH_AVAILABLE_EMPLOYEES : API.EMPLOYER + '/payrollBatch/employee/available',
        EMPLOYER_PAYROLL_BATCH_INCOME_LIST : API.EMPLOYER + '/payrollBatch/incomeList',
        EMPLOYER_PAYROLL_SETTINGS : API.EMPLOYER + '/payrollSetting'
    });

    // certified rate
    Ext.apply(API, {
        CERTIFIED_RATE : API.EMPLOYER + '/certifiedRate',
        CERTIFIED_RATE_DOWNLOAD_TEMPLATE : API.EMPLOYER + '/certifiedRate/downloadTemplate?employerId={0}',
        CERTIFIED_RATE_IMPORT : API.EMPLOYER + '/certifiedRate/import',
        CERTIFIED_RATE_DEDUCTION : API.EMPLOYER + '/certifiedRate/deduction'
    });

    // GL account
    Ext.apply(API, {
        EMPLOYER_GL_ACCOUNT : API.EMPLOYER + '/glAccount',
        EMPLOYER_GL_ACCOUNT_MAP : API.EMPLOYER + '/glAccountMap',
        EMPLOYER_GL_ACCOUNT_MAP_VALIDATE : API.EMPLOYER + '/glAccountMap/validate',
        EMPLOYER_GL_ACCOUNT_MAP_ERRORS_DOWNLOAD : API.EMPLOYER + '/glAccountMap/errors/download/{0}',
        EMPLOYER_GL_ACCOUNT_MAP_ERRORS : API.EMPLOYER + '/glAccountMap/errors/{0}'
    });

    // Employer Shift Rates services
    Ext.apply(API, {
        EMPLOYER_SHIFT_RATE : API.EMPLOYER + '/shiftRate'
    });

    Ext.apply(API, {
        EMPLOYER_SHIFT_RATE_DETAIL : API.EMPLOYER_SHIFT_RATE + '/detail'
    });

    // Payroll Import Service
    Ext.apply(API, {
        PAYROLL_IMPORT : API_ROOT + '/import/payroll'
    });

    Ext.apply(API, {
        PAYROLL_IMPORT_SETUP : API.PAYROLL_IMPORT + '/setup/{0}',
        PAYROLL_IMPORT_SETUP_IMPORT : API.PAYROLL_IMPORT + '/setup/import',
        PAYROLL_IMPORT_SETUP_TEMPLATE : API.PAYROLL_IMPORT + '/setup/downloadTemplate',
        PAYROLL_IMPORT_SETUP_ERRORS : API.PAYROLL_IMPORT + '/setup/errors/{0}'
    });

    Ext.apply(API, {
        PAYROLL_IMPORT_EMPLOYEE : API.PAYROLL_IMPORT + '/employee/{0}?employerId={1}',
        PAYROLL_IMPORT_EMPLOYEE_IMPORT : API.PAYROLL_IMPORT + '/employee/import',
        PAYROLL_IMPORT_EMPLOYEE_TEMPLATE : API.PAYROLL_IMPORT + '/employee/downloadTemplate',
        PAYROLL_IMPORT_EMPLOYEE_ERRORS : API.PAYROLL_IMPORT + '/employee/errors/{0}'
    });

    Ext.apply(API, {
        PAYROLL_IMPORT_DATA : API.PAYROLL_IMPORT + '/data/{0}',
        PAYROLL_IMPORT_DATA_IMPORT : API.PAYROLL_IMPORT + '/data/import',
        PAYROLL_IMPORT_DATA_TEMPLATE : API.PAYROLL_IMPORT + '/data/downloadTemplate',
        PAYROLL_IMPORT_DATA_ERRORS : API.PAYROLL_IMPORT + '/data/errors/{0}',
        PAYROLL_IMPORT_DATA_DISCREPANCIES : API.PAYROLL_IMPORT + '/data/discrepancies/{0}'
    });

    // legacy payroll import
    Ext.apply(API, {
        PAYROLL_IMPORT_DATA_LEGACY : API.PAYROLL_IMPORT + '/data/legacy/{0}',
        PAYROLL_IMPORT_DATA_LEGACY_IMPORT : API.PAYROLL_IMPORT + '/data/legacy/import',
        PAYROLL_IMPORT_DATA_LEGACY_TEMPLATE : API.PAYROLL_IMPORT + '/data/legacy/downloadTemplate',
        PAYROLL_IMPORT_DATA_LEGACY_ERRORS : API.PAYROLL_IMPORT + '/data/legacy/errors/{0}',
        PAYROLL_IMPORT_DATA_LEGACY_DISCREPANCIES : API.PAYROLL_IMPORT + '/data/legacy/discrepancies/{0}'
    });

    Ext.apply(API, {
        PAYROLL_IMPORT_GL : API.PAYROLL_IMPORT + '/gl/{0}',
        PAYROLL_IMPORT_GL_IMPORT : API.PAYROLL_IMPORT + '/gl/import',
        PAYROLL_IMPORT_GL_TEMPLATE : API.PAYROLL_IMPORT + '/gl/downloadTemplate',
        PAYROLL_IMPORT_GL_ERRORS : API.PAYROLL_IMPORT + '/gl/errors/{0}'
    });

    Ext.apply(API, {
        PAYROLL_IMPORT_UPLOAD : API.PAYROLL_IMPORT + '/upload',
        PAYROLL_IMPORT_MAX_FILE_SIZE : API.PAYROLL_IMPORT + '/maxFileSize',
        PAYROLL_IMPORT_TIMESHEET : API.PAYROLL_IMPORT + '/timesheets',
        PAYROLL_IMPORT_DETAIL : API.PAYROLL_IMPORT + '/detail',
        PAYROLL_IMPORT_SAVE_TO_BATCH : API.PAYROLL_IMPORT + '/saveToBatch',
        PAYROLL_IMPORT_GET_ERRORS_CSV : API.PAYROLL_IMPORT + '/errors/download'
    });

    // Code Tables Import Service
    Ext.apply(API, {
        CODE_TABLES_IMPORT : API_ROOT + '/import/system/codeTables'
    });

    Ext.apply(API, {
        CODE_TABLES_IMPORT_UPDATE : API.CODE_TABLES_IMPORT + '/{0}',
        CODE_TABLES_IMPORT_TEMPLATE_DOWNLOAD : API.CODE_TABLES_IMPORT + '/downloadTemplate',
        CODE_TABLES_IMPORT_DEFAULTS_DOWNLOAD : API.CODE_TABLES_IMPORT + '/downloadDefaults',
        CODE_TABLES_IMPORT_ERRORS : API.CODE_TABLES_IMPORT + '/errors/{0}'
    });

    // ESS Help Import Service
    Ext.apply(API, {
        ESS_HELP_IMPORT : API_ROOT + '/import/system/essHelp'
    });

    Ext.apply(API, {
        ESS_HELP_IMPORT_UPDATE : API.ESS_HELP_IMPORT + '/{0}',
        ESS_HELP_IMPORT_TEMPLATE_DOWNLOAD : API.ESS_HELP_IMPORT + '/downloadTemplate',
        ESS_HELP_IMPORT_DEFAULTS_DOWNLOAD : API.ESS_HELP_IMPORT + '/downloadDefaults',
        ESS_HELP_IMPORT_ERRORS : API.ESS_HELP_IMPORT + '/errors/{0}'
    });

    // Publish Site Import Service
    Ext.apply(API, {
        PUBLISH_SITE_IMPORT : API_ROOT + '/import/system/publishSite'
    });

    Ext.apply(API, {
        PUBLISH_SITE_IMPORT_UPDATE : API.PUBLISH_SITE_IMPORT + '/{0}',
        PUBLISH_SITE_IMPORT_TEMPLATE_DOWNLOAD : API.PUBLISH_SITE_IMPORT + '/downloadTemplate',
        PUBLISH_SITE_IMPORT_DEFAULTS_DOWNLOAD : API.PUBLISH_SITE_IMPORT + '/downloadDefaults',
        PUBLISH_SITE_IMPORT_ERRORS : API.PUBLISH_SITE_IMPORT + '/errors/{0}'
    });

    // Security Profile Service
    Ext.apply(API, {
        SECURITY_PROFILE_CLONE : API.SECURITY_PROFILE + '/{0}/clone'
    });

    // Security Profile Import Service
    Ext.apply(API, {
        SECURITY_PROFILE_IMPORT : API_ROOT + '/import/system/securityProfile'
    });

    Ext.apply(API, {
        SECURITY_PROFILE_IMPORT_UPDATE : API.SECURITY_PROFILE_IMPORT + '/{0}',
        SECURITY_PROFILE_IMPORT_TEMPLATE_DOWNLOAD : API.SECURITY_PROFILE_IMPORT + '/downloadTemplate',
        SECURITY_PROFILE_IMPORT_DEFAULTS_DOWNLOAD : API.SECURITY_PROFILE_IMPORT + '/downloadDefaults',
        SECURITY_PROFILE_IMPORT_ERRORS : API.SECURITY_PROFILE_IMPORT + '/errors/{0}'
    });

    // Job Codes Import Service
    Ext.apply(API, {
        JOB_CODES_IMPORT : API_ROOT + '/import/system/jobCodes'
    });

    Ext.apply(API, {
        JOB_CODES_IMPORT_UPDATE : API.JOB_CODES_IMPORT + '/{0}',
        JOB_CODES_IMPORT_TEMPLATE_DOWNLOAD : API.JOB_CODES_IMPORT + '/downloadTemplate',
        JOB_CODES_IMPORT_ERRORS : API.JOB_CODES_IMPORT + '/errors/{0}'
    });

    // Employers Import Service
    Ext.apply(API, {
        EMPLOYERS_IMPORT : API_ROOT + '/import/system/employers'
    });

    Ext.apply(API, {
        EMPLOYERS_IMPORT_UPDATE : API.EMPLOYERS_IMPORT + '/{0}',
        EMPLOYERS_IMPORT_TEMPLATE_DOWNLOAD : API.EMPLOYERS_IMPORT + '/downloadTemplate',
        EMPLOYERS_IMPORT_ERRORS : API.EMPLOYERS_IMPORT + '/errors/{0}'
    });

    // Timesheet Balances Import Service
    Ext.apply(API, {
        BALANCES_IMPORT : API_ROOT + '/import/timeAndAttendance/balances'
    });

    Ext.apply(API, {
        BALANCES_IMPORT_TEMPLATE_DOWNLOAD : API.BALANCES_IMPORT + '/downloadTemplate',
        BALANCES_IMPORT_UPDATE : API.BALANCES_IMPORT + '/{0}?employerId={1}&employeeId={2}&validateAccruals={3}',
        BALANCES_IMPORT_ERRORS : API.BALANCES_IMPORT + '/errors/{0}'
    });

    // Employment Information Import Service
    Ext.apply(API, {
        EMPLOYMENT_IMPORT : API_ROOT + '/import/core/employment'
    });

    Ext.apply(API, {
        EMPLOYMENT_IMPORT_UPDATE : API.EMPLOYMENT_IMPORT + '/{0}?employerId={1}',
        EMPLOYMENT_IMPORT_TEMPLATE_DOWNLOAD : API.EMPLOYMENT_IMPORT + '/downloadTemplate',
        EMPLOYMENT_IMPORT_ERRORS : API.EMPLOYMENT_IMPORT + '/errors/{0}'
    });

    // Demographics Import Service
    Ext.apply(API, {
        DEMOGRAPHICS_IMPORT : API_ROOT + '/import/core/demographics'
    });

    Ext.apply(API, {
        DEMOGRAPHICS_IMPORT_UPDATE : API.DEMOGRAPHICS_IMPORT + '/{0}',
        DEMOGRAPHICS_IMPORT_TEMPLATE_DOWNLOAD : API.DEMOGRAPHICS_IMPORT + '/downloadTemplate',
        DEMOGRAPHICS_IMPORT_ERRORS : API.DEMOGRAPHICS_IMPORT + '/errors/{0}'
    });

    // Organization Chart Import Service
    Ext.apply(API, {
        ORGANIZATION_CHART_IMPORT : API_ROOT + '/import/core/organizationChart'
    });

    Ext.apply(API, {
        ORGANIZATION_CHART_IMPORT_UPDATE : API.ORGANIZATION_CHART_IMPORT + '/{0}',
        ORGANIZATION_CHART_IMPORT_TEMPLATE_DOWNLOAD : API.ORGANIZATION_CHART_IMPORT + '/downloadTemplate',
        ORGANIZATION_CHART_IMPORT_ERRORS : API.ORGANIZATION_CHART_IMPORT + '/errors/{0}'
    });

    // Incomes Import Service
    Ext.apply(API, {
        INCOMES_IMPORT : API_ROOT + '/import/core/incomes'
    });

    Ext.apply(API, {
        INCOMES_IMPORT_UPDATE : API.INCOMES_IMPORT + '/{0}',
        INCOMES_IMPORT_TEMPLATE_DOWNLOAD : API.INCOMES_IMPORT + '/downloadTemplate',
        INCOMES_IMPORT_ERRORS : API.INCOMES_IMPORT + '/errors/{0}'
    });

    // Employee Incomes Import Service
    Ext.apply(API, {
        EMPLOYEE_INCOMES_IMPORT : API_ROOT + '/import/core/employeeIncomes'
    });

    Ext.apply(API, {
        EMPLOYEE_INCOMES_IMPORT_UPDATE : API.EMPLOYEE_INCOMES_IMPORT + '/{0}?employerId={1}',
        EMPLOYEE_INCOMES_IMPORT_TEMPLATE_DOWNLOAD : API.EMPLOYEE_INCOMES_IMPORT + '/downloadTemplate',
        EMPLOYEE_INCOMES_IMPORT_ERRORS : API.EMPLOYEE_INCOMES_IMPORT + '/errors/{0}'
    });

    // Benefit Plans Import Service
    Ext.apply(API, {
        BENEFITS_PLANS_IMPORT : API_ROOT + '/import/benefits/plans'
    });

    Ext.apply(API, {
        BENEFIT_PLANS_IMPORT_TEMPLATE_DOWNLOAD : API.BENEFITS_PLANS_IMPORT + '/downloadTemplate'
    });

    Ext.apply(API, {
        BENEFITS_PLANS_IMPORT_UPDATE : API.BENEFITS_PLANS_IMPORT + '/{0}?employerId={1}',
        BENEFITS_PLANS_IMPORT_ERRORS : API.BENEFITS_PLANS_IMPORT + '/errors/{0}'
    });

    // Time Off Plans Import Service
    Ext.apply(API, {
        TIME_OFF_PLANS_IMPORT_TEMPLATE_DOWNLOAD : API.ROOT + '/import/timeAndAttendance/plans/downloadTemplate'
    });

    // Benefits And Deductions Import Service
    Ext.apply(API, {
        BENEFITS_DEDUCTIONS_IMPORT : API_ROOT + '/import/benefits/benefitsDeductions'
    });

    Ext.apply(API, {
        BENEFITS_DEDUCTIONS_IMPORT_TEMPLATE_DOWNLOAD : API.BENEFITS_DEDUCTIONS_IMPORT + '/downloadTemplate',
        BENEFITS_DEDUCTIONS_IMPORT_UPDATE : API.BENEFITS_DEDUCTIONS_IMPORT + '/{0}?employerId={1}',
        BENEFITS_DEDUCTIONS_IMPORT_ERRORS : API.BENEFITS_DEDUCTIONS_IMPORT + '/errors/{0}',
        BENEFITS_DEDUCTIONS_IMPORT_DISCREPANCIES : API.BENEFITS_DEDUCTIONS_IMPORT + '/discrepancies/{0}'
    });

    // Benefit Rates Import Service
    Ext.apply(API, {
        BENEFITS_RATES_IMPORT : API_ROOT + '/import/benefits/benefitRates'
    });

    Ext.apply(API, {
        BENEFITS_RATES_IMPORT_TEMPLATE_DOWNLOAD : API.BENEFITS_RATES_IMPORT + '/downloadTemplate?generate={0}'
    });

    Ext.apply(API, {
        BENEFITS_RATES_IMPORT_GENERATE : API.BENEFITS_RATES_IMPORT + '/generate',
        BENEFITS_RATES_IMPORT_UPDATE : API.BENEFITS_RATES_IMPORT + '/{0}?employerId={1}',
        BENEFITS_RATES_IMPORT_ERRORS : API.BENEFITS_RATES_IMPORT + '/errors/{0}'
    });

    // Payroll Settings Service
    Ext.apply(API, {
        EMPLOYER_PAYROLL_SETTINGS_UPLOAD : API.EMPLOYER_PAYROLL_SETTINGS + '/upload',
        EMPLOYER_PAYROLL_SETTINGS_DOWNLOAD : API.EMPLOYER_PAYROLL_SETTINGS + '/download'
    });

    // Employee Time Off Accruals Import Service
    Ext.apply(API, {
        EMPLOYEE_TIME_OFF_ACCRUALS_IMPORT : API_ROOT + '/import/timeOff/accruals'
    });

    Ext.apply(API, {
        EMPLOYEE_TIME_OFF_ACCRUALS_DOWNLOAD_TEMPLATE : API.EMPLOYEE_TIME_OFF_ACCRUALS_IMPORT + '/downloadTemplate',
        EMPLOYEE_TIME_OFF_ACCRUALS_ERRORS : API.EMPLOYEE_TIME_OFF_ACCRUALS_IMPORT + '/errors/{0}',
        EMPLOYEE_TIME_OFF_ACCRUALS_IMPORT_PROCESS : API.EMPLOYEE_TIME_OFF_ACCRUALS_IMPORT + '/{0}?employerId={1}&employeeId={2}&accrualDate={3}'
    });

    // Pay Rate Revisions Import/Export Service
    Ext.apply(API, {
        PAY_RATE_REVISION_IMPORT : API_ROOT + '/import/payRateRevision'
    });

    Ext.apply(API, {
        PAY_RATE_REVISION_DOWNLOAD_TEMPLATE : API.PAY_RATE_REVISION_IMPORT + '/downloadTemplate',
        PAY_RATE_REVISION_ERRORS : API.PAY_RATE_REVISION_IMPORT + '/errors/{0}',
        PAY_RATE_REVISION_IMPORT_PROCESS : API.PAY_RATE_REVISION_IMPORT + '/{0}?employerId={1}&performerId={2}&actionCd={3}&effectiveDate={4}'
    });

    // Courses by employer Import/Export Service
    Ext.apply(API, {
        COURSES_BY_EMPLOYER_IMPORT : API_ROOT + '/import/lms/coursesByEmployer'
    });

    Ext.apply(API, {
        COURSES_BY_EMPLOYER_IMPORT_DOWNLOAD_TEMPLATE : API.COURSES_BY_EMPLOYER_IMPORT + '/downloadTemplate',
        COURSES_BY_EMPLOYER_IMPORT_ERRORS : API.COURSES_BY_EMPLOYER_IMPORT + '/errors/{0}',
        COURSES_BY_EMPLOYER_IMPORT_PROCESS : API.COURSES_BY_EMPLOYER_IMPORT + '/{0}'
    });

    // Courses by employee Import/Export Service
    Ext.apply(API, {
        COURSES_BY_EMPLOYEE_IMPORT : API_ROOT + '/import/lms/coursesByEmployee'
    });

    Ext.apply(API, {
        COURSES_BY_EMPLOYEE_IMPORT_DOWNLOAD_TEMPLATE : API.COURSES_BY_EMPLOYEE_IMPORT + '/downloadTemplate',
        COURSES_BY_EMPLOYEE_IMPORT_ERRORS : API.COURSES_BY_EMPLOYEE_IMPORT + '/errors/{0}',
        COURSES_BY_EMPLOYEE_IMPORT_PROCESS : API.COURSES_BY_EMPLOYEE_IMPORT + '/{0}'
    });

    Ext.apply(API, {
        JOB_POSTINGS_IMPORT : API_ROOT + '/import/recruiting/jobPostings',
        CAREERS_JOB_PORTAL : API_ROOT + '/career?EmployerId={0}&Authorization={1}'
    });

    Ext.apply(API, {
        JOB_POSTINGS_IMPORT_UPLOAD : API.JOB_POSTINGS_IMPORT + '/import',
        JOB_POSTINGS_IMPORT_MAX_FILE_SIZE : API.JOB_POSTINGS_IMPORT + '/maxFileSize',
        JOB_POSTINGS_IMPORT_DOWNLOAD_TEMPLATE : API.JOB_POSTINGS_IMPORT + '/downloadTemplate',
        JOB_POSTINGS_IMPORT_ERRORS : API.JOB_POSTINGS_IMPORT + '/errors/{0}',
        JOB_POSTINGS_IMPORT_PROCESS : API.JOB_POSTINGS_IMPORT + '/{0}'
    });

    // Courses by employee Import/Export Service
    Ext.apply(API, {
        DATA_PACKAGE_IMPORT : API_ROOT + '/import/system/dataPackage'
    });

    // Employee Tax
    Ext.apply(API, {
        EMPLOYEE_TAX : API.EMPLOYEE + '/tax'
    });
    Ext.apply(API, {
        EMPLOYEE_TAX_EXPIRE : API.EMPLOYEE_TAX + '/expireTax',
        EMPLOYEE_TAX_RECALL : API.EMPLOYEE_TAX + '/recall/{0}'
    });

    // Employee Income Override
    Ext.apply(API, {
        EMPLOYEE_INCOME : API.EMPLOYEE + '/income'
    });

    // Employer Jobs services
    Ext.apply(API, {
        EMPLOYER_JOB_POSTING : API_ROOT + '/employer/jobPosting',
        EMPLOYER_JOB_POSTING_CANDIDATE : API_ROOT + '/employer/jobPosting/candidate',
        EMPLOYER_JOB_POSTING_CANDIDATE_GRID : API_ROOT + '/employer/jobPosting/candidate/grid',
        EMPLOYER_JOB_POSTING_DOWNLOAD_APPLICATION_FORM_PDF : API_ROOT + '/employer/jobPosting/{0}/downloadApplicationFormPdf',
        EMPLOYER_JOB_POSTING_CANDIDATE_NOTES : API_ROOT + '/employer/jobPosting/candidate/notes',
        EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW : API_ROOT + '/employer/jobPosting/candidate/interview',
        EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW_REVIEW : API_ROOT + '/employer/jobPosting/candidate/interview/review',
        EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW_DOWNLOAD : API_ROOT + '/employer/jobPosting/candidate/interview/download',
        EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW_ICS : API_ROOT + '/employer/jobPosting/candidate/interview/ics/{0}',
        EMPLOYER_JOB_POSTING_CANDIDATE_DOCUMENT : API_ROOT + '/employer/jobPosting/candidate/document',
        EMPLOYER_JOB_POSTING_CANDIDATE_DOCUMENT_DOWNLOAD : API_ROOT + '/employer/jobPosting/candidate/document/download',
        EMPLOYER_JOB_POSTING_CANDIDATE_WEBFORM_DOWNLOAD : API_ROOT + '/employer/jobPosting/candidate/document/webform/download/',
        EMPLOYER_JOB_POSTING_CANDIDATE_DOCUMENT_SEND : API_ROOT + '/employer/jobPosting/candidate/document/webform/send',
        EMPLOYER_JOB_POSTING_CANDIDATE_MASS_REJECT : API_ROOT + '/employer/jobPosting/candidate/massReject',
        EMPLOYER_JOB_POSTING_CANDIDATE_PREBOARDING : API_ROOT + '/employer/jobPosting/candidate/preboarding',
        EMPLOYER_JOB_POSTING_HAS_MANAGER : API_ROOT + '/employer/jobPosting/hasHiringManager',
        EMPLOYER_JOB_POSTING_UPDATE_MANAGER : API_ROOT + '/employer/jobPosting/updateHiringManager',
        EMPLOYER_PUBLISHING_SITE : API_ROOT + '/employer/publishSite'
    });

    // Employer Bank Account
    Ext.apply(API, {
        EMPLOYER_BANK_ACCOUNT : API.EMPLOYER + '/bankAccount',
        EMPLOYER_BANK_ACCOUNT_UPLOAD : API.EMPLOYER + '/bankAccount/upload',
        EMPLOYER_BANK_ACCOUNT_MAX_FILE_SIZE : API.EMPLOYER + '/bankAccount/maxFileSize',
        EMPLOYER_BANK_ACCOUNT_GENERATE_PRE_NOTE : API.EMPLOYER + '/bankAccount/generatePreNote'
    });

    // Candidate
    Ext.apply(API, {
        CANDIDATE : API_ROOT + '/candidate',
        CANDIDATE_AWARD : API_ROOT + '/candidate/award',
        CANDIDATE_CERTIFICATION : API_ROOT + '/candidate/certification',
        CANDIDATE_EDUCATION : API_ROOT + '/candidate/education',
        CANDIDATE_EXPERIENCE : API_ROOT + '/candidate/experience',
        CANDIDATE_SKILL : API_ROOT + '/candidate/skill',
        CANDIDATE_RESUME_SHOW : API_ROOT + '/candidate/resume/show',
        CANDIDATE_RESUME_DOWNLOAD : API_ROOT + '/candidate/resume/download',
        CANDIDATE_RESUME_UPLOAD : API_ROOT + '/candidate/resume/upload',
        CANDIDATE_RESUME_PARSE : API_ROOT + '/candidate/resume/parse',
        CANDIDATE_RESUME_STATUS : API_ROOT + '/candidate/resume/status',
        CANDIDATE_COVER_LETTER_SHOW : API_ROOT + '/candidate/coverLetter/show',
        CANDIDATE_COVER_LETTER_DOWNLOAD : API_ROOT + '/candidate/coverLetter/download',
        CANDIDATE_COVER_LETTER_UPLOAD : API_ROOT + '/candidate/coverLetter/upload',
        CANDIDATE_COVER_LETTER_PARSE : API_ROOT + '/candidate/coverLetter/parse',
        CANDIDATE_COVER_LETTER_UPDATE_TEXT : API_ROOT + '/candidate/coverLetter/updateText/{0}',
        CANDIDATE_CREATE_EMPLOYEE : API_ROOT + '/candidate/createEmployee',
        CANDIDATE_BACKGROUND : API_ROOT + '/candidate/background'
    });

    // Candidate Attachment HCM Service
    Ext.apply(API, {
        CANDIDATE_ATTACHMENT : API.CANDIDATE + '/attachment'
    });
    Ext.apply(API, {
        CANDIDATE_ATTACHMENT_UPLOAD : API.CANDIDATE_ATTACHMENT + '/upload',
        CANDIDATE_ATTACHMENT_DOWNLOAD : API.CANDIDATE_ATTACHMENT + '/download',
        CANDIDATE_ATTACHMENT_MAX_FILE_SIZE : API.CANDIDATE_ATTACHMENT + '/maxFileSize'
    });

    // Report services
    Ext.apply(API, {
        REPORT_GROUP : API_ROOT + '/reportGroup',
        REPORT : API_ROOT + '/report',
        REPORTS : API_ROOT + '/reports',
        MEMORIZED_REPORT : API_ROOT + '/report/memorized'
    });
    Ext.apply(API, {
        REPORT_GROUP_TREE : API.REPORT_GROUP + '/tree',
        REPORT_DOWNLOAD : API.REPORT + '/download/{0}',
        REPORT_DOWNLOAD_BY_NAME : API.REPORT + '/downloadByName?name={0}&options={1}',
        REPORT_CHECK_ACCESS : API.REPORT + '/checkAccess',
        REPORT_UPLOAD : API.REPORT + '/upload',
        REPORT_REQUEST : API.REPORT + '/request',
        REPORT_CANCEL : API.REPORT + '/cancel',
        REPORT_STATUS : API.REPORT + '/status',
        REPORT_OPTIONS : API.REPORT + '/options',
        REPORT_AVAILABLE_OPTIONS : API.REPORT + '/availableOptions',
        MEMORIZED_REPORT_REQUEST : API.MEMORIZED_REPORT + '/request',
        MEMORIZED_REPORT_CANCEL : API.MEMORIZED_REPORT + '/cancel',
        MEMORIZED_REPORT_STATUS : API.MEMORIZED_REPORT + '/status',
        MEMORIZED_REPORT_OPTIONS : API.MEMORIZED_REPORT + '/options',
        MEMORIZED_REPORT_AVAILABLE_OPTIONS : API.MEMORIZED_REPORT + '/availableOptions',
        MEMORIZED_REPORT_DOWNLOAD : API.MEMORIZED_REPORT + '/download/{0}'
    });

    Ext.apply(API, {
        DATA_GRID : API_ROOT + '/dataGrid',
        DATA_GRID_TO_EXCEL : API_ROOT + '/dataGrid/toExcel',
        DATA_GRID_TO_CSV : API_ROOT + '/dataGrid/toCSV'
    });
    Ext.apply(API, {
        DATA_GRID_MEMORIZED : API_ROOT + '/dataGrid/memorized',
        DATA_GRID_MEMORIZED_CLONE : API_ROOT + '/dataGrid/memorized/clone',
        DATA_GRID_AVAILABLE_TABLES : API.DATA_GRID + '/availableTables',
        DATA_GRID_VALIDATE_SQL : API.DATA_GRID + '/validateSQL',
        DATA_GRID_LOAD_SQL : API.DATA_GRID + '/loadSQL',
        DATA_GRID_LOAD_WEB_FORM : API.DATA_GRID + '/loadWebform',
        DATA_GRID_LOAD_DATA_FORM : API.DATA_GRID + '/loadDataform',
        DATA_GRID_LOAD_MODULE : API.DATA_GRID + '/loadModule',
        DATA_GRID_LOAD_TABLES : API.DATA_GRID + '/loadTables',
        DATA_GRID_DATA_FORM : API.DATA_GRID + '/dataform',
        DATA_GRID_WEB_FORM : API.DATA_GRID + '/webform',
        DATA_GRID_MODULE : API.DATA_GRID + '/module',
        DATA_GRID_ADD_TABLE : API.DATA_GRID + '/addTable',
        DATA_GRID_UPDATE_RELATION : API.DATA_GRID + '/updateRelation',
        DATA_GRID_REMOVE_TABLE : API.DATA_GRID + '/removeTable'
    });

    // Data Transfer service
    Ext.apply(API, {
        TRANSFER : API_ROOT + '/dataTransfer'
    });
    Ext.apply(API, {
        TRANSFER_UPLOAD : API.TRANSFER + '/upload',
        TRANSFER_OBJECT_PARAMETERS : API.TRANSFER + '/objectParameters/{0}',
        TRANSFER_EXECUTE : API.TRANSFER + '/execute/{0}',
        TRANSFER_DOWNLOAD : API.TRANSFER + '/download?fileName={0}&hash={1}',
        GET_BY_ALIAS : API.TRANSFER + '/getByAlias?alias={0}'
    });

    // Acumatica service
    Ext.apply(API, {
        ACUMATICA : API_ROOT + '/acumatica'
    });
    Ext.apply(API, {
        ACUMATICA_BRANCH : API.ACUMATICA + '/branch'
    });

    // Employer benefits services
    Ext.apply(API, {
        EMPLOYER_BENEFIT_PLAN : API.EMPLOYER + '/benefitPlan',
        EMPLOYER_BENEFIT_PLAN_CLONE : API.EMPLOYER + '/benefitPlan/{0}/clone/{1}',
        EMPLOYER_BENEFIT_PLAN_AUTO_ADD : API.EMPLOYER + '/benefitPlan/autoAdd?benefitPlanIds={0}&employerId={1}',
        EMPLOYER_BENEFIT_TYPE : API.EMPLOYER + '/benefitType',
        EMPLOYER_BENEFIT_PLAN_CALCULATE_EMPLOYEE_PLANS : API.EMPLOYER + '/benefitPlan/calculateEmployeePlans',

        EMPLOYER_BENEFIT_PLAN_UPLOAD : API.EMPLOYER + '/benefitPlan/upload',
        EMPLOYER_BENEFIT_PLAN_DOWNLOAD : API.EMPLOYER + '/benefitPlan/download/{0}',

        EMPLOYER_BENEFIT_PLAN_ELIGIBLE_EMPLOYEE : API.EMPLOYER + '/benefitPlan/eligibleFor',
        EMPLOYER_BENEFIT_PLAN_ENROLL : API.EMPLOYER + '/benefitPlan/enroll'
    });

    Ext.apply(API, {
        EMPLOYER_BENEFIT_PLAN_OPTION : API.EMPLOYER_BENEFIT_PLAN + '/option',
        EMPLOYER_BENEFIT_PLAN_RATE : API.EMPLOYER_BENEFIT_PLAN + '/rate'
    });

    // EMPLOYEE benefits services
    Ext.apply(API, {
        EMPLOYEE_BENEFIT : API.EMPLOYEE + '/benefit',
        EMPLOYEE_BENEFIT_CALCULATE : API.EMPLOYEE + '/benefit/calculate',
        EMPLOYEE_BENEFIT_AUTO_ADD : API.EMPLOYEE + '/benefit/autoAdd',
        EMPLOYEE_BENEFIT_HAS_ACTIVE : API.EMPLOYEE + '/benefit/hasActiveBenefits/{0}'
    });

    Ext.apply(API, {
        EMPLOYEE_BENEFIT_DEPENDENT : API.EMPLOYEE_BENEFIT + '/dependent',
        EMPLOYEE_BENEFIT_BENEFICIARY : API.EMPLOYEE_BENEFIT + '/beneficiary',
        EMPLOYEE_BENEFIT_OPTION : API.EMPLOYEE_BENEFIT + '/option',
        EMPLOYEE_BENEFIT_DOCUMENT : API.EMPLOYEE_BENEFIT + '/document',
        EMPLOYEE_BENEFIT_DOCUMENT_UPLOAD : API.EMPLOYEE_BENEFIT + '/document/upload',
        EMPLOYEE_BENEFIT_DOCUMENT_DOWNLOAD : API.EMPLOYEE_BENEFIT + '/document/download/{0}',
        EMPLOYEE_BENEFIT_WEBFORM_FIELDS : API.EMPLOYEE_BENEFIT + '/webformFields',
        EMPLOYEE_BENEFIT_WEBFORM_DOWNLOAD : API.EMPLOYEE_BENEFIT + '/webform/download?employeeBenefitId={0}',

        EMPLOYEE_CALENDAR : API.EMPLOYEE + '/calendar',
        EMPLOYEE_CALENDAR_ICS_JSON : API.EMPLOYEE + '/calendar/ics/json'
    });

    Ext.apply(API, {
        EMPLOYEE_BENEFIT_EVENT : API.EMPLOYEE_BENEFIT + '/event'
    });

    // Vertex Service
    Ext.apply(API, {
        VERTEX : API.ROOT + '/vertex'
    });

    Ext.apply(API, {
        VERTEX_CALC_METHODS_FOR_SUP : API.VERTEX + '/calcMethodsForSup',
        VERTEX_FILING_STATUS : API.ROOT + '/teFilingStatus',
        VERTEX_FILING_STATUS_VALUES : API.ROOT + '/teFilingStatus/values'
    });

    // ACA services
    Ext.apply(API, {
        EMPLOYER_ACA : API.EMPLOYER + '/aca',
        EMPLOYER_ACA_MONTH : API.EMPLOYER + '/aca/month',
        EMPLOYER_ACA_MEMBER : API.EMPLOYER + '/aca/member',
        EMPLOYER_ACA_GENERATE : API.EMPLOYER + '/aca/generate',
        EMPLOYEE_ACA : API.EMPLOYEE + '/aca',
        EMPLOYER_ACA_GENERATE_PDF : API.EMPLOYER + '/aca/generatePdf',
        EMPLOYER_ACA_TRANSMISSION : API.EMPLOYER + '/aca/transmission',
        EMPLOYER_ACA_TRANSMISSION_SEND : API.EMPLOYER + '/aca/transmission/send',
        EMPLOYER_ACA_TRANSMISSION_SEND_ACK : API.EMPLOYER + '/aca/transmission/sendAck'
    });

    // Claim
    Ext.apply(API, {
        TYPE_OF_CLAIM : API.ROOT + '/typeOfClaim',
        NATURE_OF_CLAIM : API.ROOT + '/natureOfClaim'
    });

    // dashboard values & charts
    Ext.apply(API, {
        DASHBOARD_PERSON_TOTAL_EMPLOYED : API_ROOT + '/person/totalEmployed',
        DASHBOARD_PERSON_TOTAL : API_ROOT + '/person/total',
        DASHBOARD_PERSON_COMPLETE : API_ROOT + '/person/complete',

        DASHBOARD_PERSON_STATS : API_ROOT + '/person/stats',
        DASHBOARD_PERSON_TOTAL_EMPLOYED_HISTORY : API_ROOT + '/person/totalEmployedHistory',
        DASHBOARD_MONTHLY_HIRES_AND_TERMINATION : API.DASHBOARD + '/monthlyHiresAndTermination',
        DASHBOARD_GROUPED_PERSONS_BY_GENDER : API.DASHBOARD + '/groupedPersonsByGender',
        DASHBOARD_GROUPED_PERSONS_BY_ETHNICITY : API.DASHBOARD + '/groupedPersonsByEthnicity',
        DASHBOARD_EMPLOYEE_COUNT_BY_DEPARTMENT : API.DASHBOARD + '/employeeCountByDepartment',

        DASHBOARD_REVENUE_TO_FTE : API.DASHBOARD + '/revenueToFTE',
        DASHBOARD_TURNOVER_RATE : API.DASHBOARD + '/turnoverRate',
        DASHBOARD_AVERAGE_AGE : API.DASHBOARD + '/averageAge',
        DASHBOARD_ABSENCE_RATE : API.DASHBOARD + '/absenceRate',
        DASHBOARD_AVERAGE_MONTHLY_BENEFIT_COST : API.DASHBOARD + '/averageMonthlyBenefitCost',
        DASHBOARD_ACTIVE_EMPLOYEES : API.DASHBOARD + '/activeEmployees',
        DASHBOARD_ACTIVE_POSITIONS : API.DASHBOARD + '/activePositions',
        DASHBOARD_OVERTIME_HOURS_MONTHLY : API.DASHBOARD + '/overtimeHoursMTD',
        DASHBOARD_OVERTIME_HOURS_YEARLY : API.DASHBOARD + '/overtimeHoursYTD',
        DASHBOARD_COMPENSATION_CLAIMS : API.DASHBOARD + '/workersCompClaimYTD',
        DASHBOARD_INJURY_LOST_HOURS : API.DASHBOARD + '/hoursLostDueToInjuryYTD',
        DASHBOARD_COMPENSATION_COSTS : API.DASHBOARD + '/workersCompCostsYTD',

        //ess dashboard
        DASHBOARD_WIDGETS : API.DASHBOARD + '/widgets',
        DASHBOARD_ATTENDANCE : API.DASHBOARD + '/attendance',
        DASHBOARD_UPCOMING_TIMEOFF : API.DASHBOARD + '/upcomingTimeoff',
        DASHBOARD_LAST_NEXT_PAYDATE : API.DASHBOARD + '/lastNextPayDate',
        DASHBOARD_UPCOMING_EVENTS : API.DASHBOARD + '/upcomingEvents',
        DASHBOARD_INFOBOX : API.DASHBOARD + '/infobox',
        DASHBOARD_ONBOARDING_TASKS : API.DASHBOARD + '/onboardingTasks',
        DASHBOARD_ONBOARDING_TASKS_COMPLETED : API.DASHBOARD + '/onboardingTasks/completed/{0}',

        DASHBOARD_ONBOARDING_EMPLOYER_OVERDUES_COUNT : API.DASHBOARD + '/onboarding/employerOverduesCount',
        DASHBOARD_ONBOARDING_EMPLOYEE_OVERDUES_COUNT : API.DASHBOARD + '/onboarding/employeeOverduesCount'
    });

    // pay groups
    Ext.apply(API, {
        PAY_GROUP_INCOME : API.EMPLOYER_PAY_GROUP + '/income',
        PAY_GROUP_EMPLOYEE : API.EMPLOYER_PAY_GROUP + '/employee'
    });

    // workflow operations
    Ext.apply(API, {
        WORKFLOW_DETAIL : API.WORKFLOW + '/detail',

        WORKFLOW_TRANSACTION : API.WORKFLOW + '/transaction',

        WORKFLOW_TRANSACTION_PURGE : API.WORKFLOW + '/transaction/purge',
        WORKFLOW_TRANSACTION_STEPS : API.WORKFLOW + '/transaction/step',
        WORKFLOW_TRANSACTION_APPROVE : API.WORKFLOW + '/transaction/approve',
        WORKFLOW_TRANSACTION_SAVE : API.WORKFLOW + '/transaction/save',
        WORKFLOW_TRANSACTION_REJECT : API.WORKFLOW + '/transaction/reject',
        WORKFLOW_TRANSACTION_RECALL : API.WORKFLOW + '/transaction/recall',
        WORKFLOW_TRANSACTION_DELEGATE : API.WORKFLOW + '/transaction/delegate',
        WORKFLOW_TRANSACTION_RESET : API.WORKFLOW + '/transaction/reset',
        WORKFLOW_TRANSACTION_LOAD_SAVED : API.WORKFLOW + '/transaction/loadSaved',

        WORKFLOW_TRANSACTION_LOG : API.WORKFLOW + '/transaction/log',
        WORKFLOW_TRANSACTION_LOG_PENDING_APPROVAL : API.WORKFLOW + '/transaction/log/pendingApproval',
        WORKFLOW_TRANSACTION_LOG_APPROVE : API.WORKFLOW + '/transaction/log/approve/{0}',
        WORKFLOW_TRANSACTION_LOG_RECALL : API.WORKFLOW + '/transaction/log/recall/{0}',
        WORKFLOW_TRANSACTION_LOG_REJECT : API.WORKFLOW + '/transaction/log/reject',
        WORKFLOW_TRANSACTION_FORM_SUBMIT : API.WORKFLOW + '/form/submit/{0}',
        WORKFLOW_TRANSACTION_ONBOARDING_SUBMIT : API.WORKFLOW + '/onboarding/submit/{0}',

        WORKFLOW_FOR_EMPLOYEE : API.WORKFLOW + '/forEmployee',
        USED_TIME_OFF_TYPES : API.WORKFLOW + '/usedTimeOffTypes'
    });

    // open enrollment
    Ext.apply(API, {
        EMPLOYEE_OPEN_ENROLLMENT : API.EMPLOYEE + '/openEnrollment',
        EMPLOYEE_OPEN_ENROLLMENT_STEP : API.EMPLOYEE + '/openEnrollment/step',
        EMPLOYEE_OPEN_ENROLLMENT_STEP_WEBFORM_FIELDS : API.EMPLOYEE + '/openEnrollment/step/webformFields/{0}',
        EMPLOYEE_OPEN_ENROLLMENT_STEP_WEBFORM_DOWNLOAD : API.EMPLOYEE + '/openEnrollment/step/webform/download/{0}',
        EMPLOYEE_OPEN_ENROLLMENT_SUBMIT : API.EMPLOYEE + '/openEnrollment/submit',
        EMPLOYEE_OPEN_ENROLLMENT_CALCULATE : API.EMPLOYEE + '/openEnrollment/calculate',
        EMPLOYEE_OPEN_ENROLLMENT_DOCUMENT : API.EMPLOYEE + '/openEnrollment/document',
        EMPLOYEE_OPEN_ENROLLMENT_DOCUMENT_DOWNLOAD : API.EMPLOYEE + '/openEnrollment/document/download/{0}',
        EMPLOYEE_OPEN_ENROLLMENT_RECALL : API.EMPLOYEE + '/openEnrollment/recall/{0}',
        EMPLOYER_OPEN_ENROLLMENT : API.EMPLOYER + '/openEnrollment',
        EMPLOYER_OPEN_ENROLLMENT_CLONE : API.EMPLOYER + '/openEnrollment/{0}/clone/{1}',
        EMPLOYER_OPEN_ENROLLMENT_ANNOUNCEMENT : API.EMPLOYER + '/openEnrollment/announcement',
        EMPLOYER_OPEN_ENROLLMENT_STEP : API.EMPLOYER + '/openEnrollment/step',
        EMPLOYER_OPEN_ENROLLMENT_STEP_BENEFIT : API.EMPLOYER + '/openEnrollment/step/benefit',
        EMPLOYER_OPEN_ENROLLMENT_STEP_CURRENT_PLAN : API.EMPLOYER + '/openEnrollment/step/currentPlan',

        EMPLOYER_OPEN_ENROLLMENT_ROLLOVER : API.EMPLOYER + '/openEnrollment/rollover',
        EMPLOYER_OPEN_ENROLLMENT_REPLACEMENT_BENEFIT_PLANS : API.EMPLOYER + '/openEnrollment/replacementBenefitPlans',
        EMPLOYER_OPEN_ENROLLMENT_ROLLOVER_VALIDATE : API.EMPLOYER + '/openEnrollment/rollover/validate'
    });

    // Shift service
    Ext.apply(API, {
        EMPLOYER_SHIFT_GROUP : API.EMPLOYER + '/shiftGroup',
        EMPLOYER_SHIFT_OCCURRENCE : API.EMPLOYER + '/shiftOccurrence',
        EMPLOYER_SHIFT_OCCURRENCE_START_DATA : API.EMPLOYER + '/shiftOccurrence/listStartData',
        EMPLOYER_SHIFT_OCCURRENCE_PREVIOUS_SHIFTS : API.EMPLOYER + '/shiftOccurrence/listPreviousShifts',
        EMPLOYER_SHIFT_OCCURRENCE_COPY_FROM : API.EMPLOYER + '/shiftOccurrence/listCopyFrom',
        EMPLOYER_SHIFT_OCCURRENCE_ROTATE : API.EMPLOYER + '/shiftOccurrence/listRotate',
        EMPLOYER_SHIFT_OCCURRENCE_GET_EMPLOYEE : API.EMPLOYER + '/shiftOccurrence/getShiftOccurrenceEmployee',

        // @deprecated
        EMPLOYER_SHIFT_CERTIFICATION : API.EMPLOYER + '/shift/certification',
        EMPLOYER_SHIFT_OCCURRENCE_EMPLOYEE : API.EMPLOYER + '/shift/occurrence/employee',
        EMPLOYER_SHIFT_OCCURRENCE_EMPLOYEE_BY_DETAIL : API.EMPLOYER + '/shift/occurrence/employeesByDetail',
        EMPLOYER_SHIFT_OCCURRENCE_EMPLOYEE_ELIGIBLE : API.EMPLOYER + '/shift/occurrence/employee/eligible',
        EMPLOYER_SHIFT_SKILL : API.EMPLOYER + '/shift/skill',
        EMPLOYER_SHIFT_OCCURRENCE_DETAIL : API.EMPLOYER + '/shift/occurrence/detail',
        EMPLOYER_SHIFT_OCCURRENCE_SCHEDULE : API.EMPLOYER + '/shift/occurrence/schedule'
    });

    // learning
    Ext.apply(API, {
        EMPLOYEE_COURSE_PLAYER : API_ROOT + '/lms/course/player',
        EMPLOYEE_COURSE_PREVIEW : API_ROOT + '/lms/course/preview',
        EMPLOYEE_COURSE_UPDATE_AICC : API_ROOT + '/lms/course/updateAICC/{0}?employerId={1}',
        EMPLOYER_COURSE : API.EMPLOYER + '/course',
        EMPLOYER_COURSE_NAMES : API.EMPLOYER + '/course/listCoursesNames',
        INSTRUCTOR : API_ROOT + '/instructor',
        EMPLOYER_JOB_COURSE : API.EMPLOYER + '/jobCourse',
        EMPLOYEE_GROUP_COURSE : API_ROOT + '/employeeGroup/course',
        EMPLOYER_CERTIFICATION : API.EMPLOYER + '/certification',
        EMPLOYER_CERTIFICATION_COURSE : API.EMPLOYER + '/certification/course',
        EMPLOYER_LEARNING_PATH : API.EMPLOYER + '/learningPath',
        EMPLOYER_LEARNING_PATH_COURSE : API.EMPLOYER + '/learningPath/course'
    });

    // Courses
    Ext.apply(API, {
        EMPLOYER_COURSE_CLASS : API.EMPLOYER_COURSE + '/class',
        EMPLOYER_COURSE_CLASS_ATTENDEES : API.EMPLOYER_COURSE + '/class/getCourses',
        EMPLOYER_COURSE_CLASS_APPLY_ACTIONS : API.EMPLOYER_COURSE + '/class/applyActions',
        EMPLOYER_COURSE_CLASS_ATTACHMENTS : API.EMPLOYER_COURSE + '/class/{0}/attachment',
        EMPLOYER_COURSE_CLASS_ATTACHMENT_DOWNLOAD : API.EMPLOYER_COURSE + '/class/attachment/{0}/download',
        EMPLOYER_COURSE_SKILL : API.EMPLOYER_COURSE + '/skill',
        LEARNING_COURSE_CONTENT_UPLOAD : API.EMPLOYER_COURSE + '/content/upload',
        LEARNING_COURSE_CONTENT_DOWNLOAD : API.EMPLOYER_COURSE + '/content/download',
        LEARNING_COURSE_CONTENT_MAX_FILE_SIZE : API.EMPLOYER_COURSE + '/content/maxFileSize',
        EMPLOYER_COURSE_CLASS_REQUEST_REVIEW : API.EMPLOYER_COURSE + '/class/requestReview/{0}',
        EMPLOYER_COURSE_CLASS_DOWNLOAD_REVIEWS : API.EMPLOYER_COURSE + '/class/downloadReviews/{0}'
    });

    // questions
    Ext.apply(API, {
        EMPLOYER_QUESTION_SET : API.EMPLOYER + '/questionSet',
        EMPLOYER_QUESTION : API.EMPLOYER + '/questionSet/question',
        EMPLOYER_QUESTION_VALUE : API.EMPLOYER + '/questionSet/question/value'
    });

    // companyEvents
    Ext.apply(API, {
        EMPLOYER_COMPANY_EVENT : API.EMPLOYER + '/companyEvent',
        EMPLOYER_COMPANY_EVENT_FOR_EMPLOYEE : API.EMPLOYER + '/companyEvent/forEmployee',
        EMPLOYER_COMPANY_EVENT_DETAIL : API.EMPLOYER + '/companyEvent/detail',
        EMPLOYER_COMPANY_EVENT_DETAIL_FOR_EMPLOYEE : API.EMPLOYER + '/companyEvent/detail/forEmployee'
    });

    // pdf
    Ext.apply(API, {
        SIGNATURE_PDF : API.ROOT + '/signaturePdf',
        SIGNATURE_PDF_IMAGE : API.ROOT + '/signaturePdf/image'
    });

    // Tax
    Ext.apply(API, {
        TAX_SEARCH : API.TAX + '/search'
    });

    // custom fields actions
    Ext.apply(API, {
        CUSTOM_FIELD_UP : API.CUSTOM_FIELD + '/{0}/up',
        CUSTOM_FIELD_DOWN : API.CUSTOM_FIELD + '/{0}/down'
    });

    // publish sites
    Ext.apply(API, {
        PUBLISH_SITE_JOB_POSTING : API.PUBLISH_SITE + '/jobPosting'
    });

    // reviews
    Ext.apply(API, {
        REVIEW_REVIEWER : API.REVIEW + '/reviewer',
        REVIEW_EMPLOYEE : API.REVIEW + '/employee'
    });

    Ext.apply(API, {
        REVIEW_TEMPLATE_COMPETENCY : API.REVIEW_TEMPLATE + '/competency',
        REVIEW_TEMPLATE_PERIOD : API.REVIEW_TEMPLATE + '/period',
        REVIEW_TEMPLATE_PERIOD_EMPLOYEE : API.REVIEW_TEMPLATE + '/period/employee',
        REVIEW_TEMPLATE_PERIOD_AVAILABLE_EMPLOYEE : API.REVIEW_TEMPLATE + '/period/employee/available',
        REVIEW_TEMPLATE_PERIOD_EMPLOYEE_ADD_ALL : API.REVIEW_TEMPLATE + '/period/employee/addAll',
        REVIEW_TEMPLATE_PERIOD_EMPLOYEE_REVIEWER : API.REVIEW_TEMPLATE + '/period/employee/reviewer',

        REVIEW_TEMPLATE_PERIOD_GOAL : API.REVIEW_TEMPLATE + '/period/goal'
    });

    // External System Services
    Ext.apply(API, {
        EXTERNAL_SYSTEM : API.ROOT + '/externalSystem',
        EXTERNAL_SYSTEM_STATUS : API.ROOT + '/externalSystem/status',
        EXTERNAL_SYSTEM_STATUS_CALLBACK : API.ROOT + '/externalSystem/status/callback',
        EXTERNAL_SYSTEM_REQUEST_BACKGROUND : API.ROOT + '/externalSystem/requestBackground',
        EXTERNAL_SYSTEM_ACUMATICA_SYNC_EMPLOYEES : API.ROOT + '/externalSystem/acumatica/syncEmployees',
        EXTERNAL_SYSTEM_ACUMATICA_SYNC_CRITERION_DATA : API.ROOT + '/externalSystem/acumatica/syncCriterionData',
        EXTERNAL_SYSTEM_INTACCT_SYNC_CRITERION_DATA : API.ROOT + '/externalSystem/intacct/syncCriterionData',
        EXTERNAL_SYSTEM_INTACCT_SYNC_EMPLOYEES : API.ROOT + '/externalSystem/intacct/syncEmployees'
    });

    // employee group
    Ext.apply(API, {
        EMPLOYEE_GROUP_MEMBER : API.EMPLOYEE_GROUP + '/member',
        EMPLOYEE_GROUP_VALIDATE_FORMULA : API.EMPLOYEE_GROUP + '/validateFormula', // 'api-mock/validateFormula'
        EMPLOYEE_GROUP_MEMBER_SEARCH : API.EMPLOYEE_GROUP + '/member/search',
        EMPLOYEE_GROUP_WORKFLOW : API.EMPLOYEE_GROUP + '/workflow',
        EMPLOYEE_GROUP_TIMESHEET_TYPE : API.EMPLOYEE_GROUP + '/timesheetType',
        EMPLOYEE_GROUP_OPEN_ENROLLMENT : API.EMPLOYEE_GROUP + '/openEnrollment',
        EMPLOYEE_GROUP_PAY_GROUP : API.EMPLOYEE_GROUP + '/payGroup',
        EMPLOYEE_GROUP_HOLIDAY : API.EMPLOYEE_GROUP + '/holiday',
        EMPLOYEE_GROUP_TIME_CLOCK : API.EMPLOYEE_GROUP + '/timeClock',
        EMPLOYEE_GROUP_BY_MEMBER : API.EMPLOYEE_GROUP + '/byMember',
        EMPLOYEE_GROUP_COMMUNITY : API.EMPLOYEE_GROUP + '/community',
        EMPLOYEE_GROUP_COMPANY_EVENT : API.EMPLOYEE_GROUP + '/companyEvent',
        EMPLOYEE_GROUP_COMPANY_AVAILABLE : API.EMPLOYEE_GROUP + '/available',
        EMPLOYEE_GROUP_LEARNING_PATH : API.EMPLOYEE_GROUP + '/learningPath',
        EMPLOYEE_GROUP_SHIFT_RATE : API.EMPLOYEE_GROUP + '/shiftRate',
        EMPLOYEE_GROUP_OVERTIME : API.EMPLOYEE_GROUP + '/overtime',
        EMPLOYEE_GROUP_EMPLOYER_DOCUMENT : API.EMPLOYEE_GROUP + '/employerDocument'
    });

    Ext.apply(API, {
        ZENDESK : API.ROOT + '/zenDesk'
    });

    Ext.apply(API, {
        ZENDESK_ARTICLES_SEARCH : API.ZENDESK + '/articles/search',
        ZENDESK_ARTICLES_LIST : API.ZENDESK + '/articles/list',
        ZENDESK_REQUEST : API.ZENDESK + '/requests',
        ZENDESK_REQUESTS_LIST : API.ZENDESK + '/requests/list',
        ZENDESK_REQUESTS_SEARCH : API.ZENDESK + '/requests/search',
        ZENDESK_REQUESTS_COMMENTS : API.ZENDESK + '/requests/comments',
        ZENDESK_REQUESTS_COMMENTS_LIST : API.ZENDESK + '/requests/comments/list',
        ZENDESK_GO_TO_EXTERNAL_URL : API.ZENDESK + '/goExternal',
        ZENDESK_CONTACT_US : API.ZENDESK + '/contactUs',
        ZENDESK_POST_LIST : API.ZENDESK + '/posts/list',
        ZENDESK_POST : API.ZENDESK + '/posts',
        ZENDESK_GET_PARTNER : API.ZENDESK + '/partner',
        ZENDESK_RELEASE_NOTES : API.ZENDESK + '/releaseNotes'
    });

    // Gl export
    Ext.apply(API, {
        GL_EXPORT_EXPORT : API.GL_EXPORT + '/export',
        GL_EXPORT_EXPORT_INTACCTAPI : API.GL_EXPORT + '/export/intacctapi',
        GL_EXPORT_EXPORT_FILE : API.GL_EXPORT + '/export/file',
        GL_EXPORT_PREVIEW : API.GL_EXPORT + '/preview',
        GL_EXPORT_DOWNLOAD : API.GL_EXPORT + '/download'
    });

    // Community services
    Ext.apply(API, {
        COMMUNITY_FOR_EMPLOYEE : API.COMMUNITY + '/forEmployee',
        COMMUNITY_COUNT_EMPLOYEES : API.COMMUNITY + '/countEmployees',
        COMMUNITY_USERS : API.COMMUNITY + '/users',
        COMMUNITY_POSTING : API.COMMUNITY + '/posting',
        COMMUNITY_POSTING_FOR_EMPLOYEE : API.COMMUNITY + '/posting/forEmployee',
        COMMUNITY_POSTING_ATTACHMENT : API.COMMUNITY + '/posting/attachment',
        COMMUNITY_POSTING_ATTACHMENT_DOWNLOAD : API.COMMUNITY + '/posting/attachment/download/{0}',
        COMMUNITY_POSTING_ATTACHMENT_UPLOAD : API.COMMUNITY + '/posting/attachment/upload',
        COMMUNITY_POSTING_ATTACHMENT_MAX_FILE_SIZE : API.COMMUNITY + '/posting/attachment/maxFileSize',
        COMMUNITY_POSTING_REACTION : API.COMMUNITY + '/posting/reaction',
        COMMUNITY_BADGE : API.COMMUNITY + '/badge',
        COMMUNITY_BADGE_EARNED : API.COMMUNITY + '/badge/earned',
        COMMUNITY_BADGE_IMAGE : API.COMMUNITY + '/badge/image',
        COMMUNITY_BADGE_IMAGE_UPLOAD : API.COMMUNITY + '/badge/image/upload',
        COMMUNITY_ICON : API.COMMUNITY + '/icon',
        COMMUNITY_ICON_IMAGE : API.COMMUNITY + '/icon/image',
        COMMUNITY_ICON_IMAGE_UPLOAD : API.COMMUNITY + '/icon/image/upload',
        COMMUNITY_EMPLOYEE : API.COMMUNITY + '/employee',
        COMMUNITY_PERSON : API.COMMUNITY + '/person'
    });

    // Employee Time Entry
    Ext.apply(API, {
        TIME_ENTRY_START_DATA : API.EMPLOYEE_TIME_CLOCK + '/getStartData',
        TIME_ENTRY_START : API.EMPLOYEE_TIME_CLOCK + '/start',
        TIME_ENTRY_STOP : API.EMPLOYEE_TIME_CLOCK + '/stop'
    });

    // Webform
    Ext.apply(API, {
        WEBFORM_COPY : API.WEBFORM + '/copy/{0}',
        EMPLOYEE_DOCUMENT_WEBFORM_FIELDS : API_ROOT + '/employee/document/webformFields/{0}',
        CANDIDATE_DOCUMENT_WEBFORM_FIELDS : API_ROOT + '/employee/document/candidate/webformFields/{0}',
        DOCUMENT_WEBFORM_ASSIGN : API_ROOT + '/employee/document/webform/assign',
        DOCUMENT_DATAFORM_ASSIGN : API_ROOT + '/employee/document/dataform/assign',
        DOCUMENT_WEBFORM_ATTACHMENT_DOWNLOAD : API_ROOT + '/employee/document/attachment/download/{0}',
        DOCUMENT_WEBFORM_ATTACHMENT_DELETE : API_ROOT + '/employee/document/attachment/{0}',
        WEBFORM_EXPORT : API.WEBFORM + '/export/{0}',
        WEBFORM_IMPORT : API.WEBFORM + '/import',
        WEBFORM_TARGET_FIELDS : API.WEBFORM + '/targetFields',
        WEBFORM_ASSIGN : API.WEBFORM + '/assign',
        WEBFORM_EMPLOYEE_FOR_ASSIGN : API.WEBFORM + '/employeeForAssign'
    });

    // dataform
    Ext.apply(API, {
        DATAFORM_COPY : API.DATAFORM + '/copy/{0}',
        EMPLOYEE_DOCUMENT_DATAFORM_FIELDS : API_ROOT + '/employee/document/dataformFields/{0}',
        DATAFORM_ASSIGN : API.DATAFORM + '/assign',
        DATAFORM_EMPLOYEE_FOR_ASSIGN : API.DATAFORM + '/employeeForAssign'
    });

    // learning
    Ext.apply(API, {
        LEARNING_ACTIVE : API.LEARNING + '/active',

        LEARNING_COURSE_FOR_ENROLL : API.LEARNING + '/courseForEnroll',
        LEARNING_COURSE_CLASS_FOR_ENROLL : API.LEARNING + '/courseClassesForEnroll',

        LEARNING_COMPLETE : API.LEARNING + '/complete',
        LEARNING_MY_TEAM : API.SUBORDINATE_LEARNING + '/myTeam',
        LEARNING_COURSE_BY_EMPLOYEE : API.SUBORDINATE_LEARNING + '/courseByEmployee',

        LEARNING_EMPLOYEE_BY_COURSE : API.SUBORDINATE_LEARNING + '/employeeByCourse',
        LEARNING_EMPLOYEE_BY_COURSE_CLASS : API.SUBORDINATE_LEARNING + '/employeeByCourseClass',

        LEARNING_COURSE_ENROLL_COURSE : API.LEARNING + '/course/enrollForCourse/{0}',
        LEARNING_COURSE_ENROLL_COURSE_CLASS : API.LEARNING + '/course/enrollForCourseClass/{0}',

        LEARNING_COURSE_START : API.LEARNING + '/course/start/{0}',
        LEARNING_COURSE_RESUME : API.LEARNING + '/course/resume/{0}',
        LEARNING_COURSE_VIEW : API.LEARNING + '/course/view/{0}',
        LEARNING_COURSE_DOWNLOAD : API.LEARNING + '/course/download/{0}',

        LEARNING_COURSE_REGISTER : API.LEARNING + '/course/register/{0}',
        LEARNING_COURSE_CANCEL : API.LEARNING + '/course/cancel/{0}',
        LEARNING_COURSE_ATTEND : API.LEARNING + '/course/attend/{0}',
        LEARNING_COURSE_UNENROLL : API.LEARNING + '/course/unenroll/{0}',

        LEARNING_COURSE_GET_EMPLOYEES_FOR_COURSE : API.SUBORDINATE_LEARNING + '/course/getEmployeesForCourse',
        LEARNING_COURSE_GET_EMPLOYEES_FOR_COURSE_CLASS : API.SUBORDINATE_LEARNING + '/course/getEmployeesForCourseClass',

        LEARNING_COURSE_GET_COURSES_FOR_EMPLOYEE : API.SUBORDINATE_LEARNING + '/course/getCoursesForEmployee',
        LEARNING_COURSE_GET_COURSE_CLASSES_FOR_EMPLOYEE : API.SUBORDINATE_LEARNING + '/course/getCourseClassesForEmployee',

        LEARNING_COURSE_REPORT_EMPLOYEES_BY_COURSE : API.SUBORDINATE_LEARNING + '/course/report/employeesByCourse',
        LEARNING_COURSE_REPORT_EMPLOYEES_BY_COURSE_CLASS : API.SUBORDINATE_LEARNING + '/course/report/employeesByCourseClass',
        LEARNING_COURSE_REPORT_COURSES_BY_EMPLOYEE : API.SUBORDINATE_LEARNING + '/course/report/coursesByEmployee',

        LEARNING_COURSE_ADD_EMPLOYEE_TO_COURSE : API.SUBORDINATE_LEARNING + '/course/addEmployeeToCourse',
        LEARNING_COURSE_ADD_EMPLOYEE_TO_COURSE_CLASS : API.SUBORDINATE_LEARNING + '/course/addEmployeeToCourseClass',

        LEARNING_COURSE_ADD_COURSE_TO_EMPLOYEE : API.SUBORDINATE_LEARNING + '/course/addCourseToEmployee',
        LEARNING_COURSE_ADD_COURSE_CLASS_TO_EMPLOYEE : API.SUBORDINATE_LEARNING + '/course/addCourseClassToEmployee',

        LERNING_INSTRUCTOR_PORTAL : '/instructor#hideHeader'
    });

    // Sandbox
    Ext.apply(API, {
        SANDBOX_STATUS : API.SANDBOX + '/status',
        SANDBOX_SYNC : API.SANDBOX + '/sync'
    });

    // Report Settings service
    Ext.apply(API, {
        REPORT_SETTINGS_LOGO : API.REPORT_SETTINGS + '/logo',
        REPORT_SETTINGS_PREVIEW_LOGO : API.REPORT_SETTINGS + '/previewLogo'
    });

    return {
        singleton : true,

        /**
         * The name of the property which contains a response message
         */
        CODE_PROPERTY : 'code',

        /**
         * The name of the property which contains a response message
         */
        MESSAGE_PROPERTY : 'message',

        /**
         * The name of the property from which to retrieve the success
         * attribute, the value of which indicates whether a given request
         * succeeded or failed.
         */
        SUCCESS_PROPERTY : 'success',

        /**
         * Property holding security access descriptor object.
         */
        SECURITY_PROPERTY : 'securityFields',

        /**
         * Token expires each 30 minutes. So refresh time is one minute less.
         * Set value to 0 to disable token refreshing.
         */
        REFRESH_TOKEN_TIMEOUT : 29 * 60 * 1000,

        /**
         * The name of the property which contains the data items.
         */
        DATA_ROOT : 'result',

        DATE_YEAR_FORMAT : 'Y',
        DATE_FORMAT : 'Y.m.d',
        SHOW_DATE_FORMAT : 'm/d/Y',
        SHOW_TIME_FORMAT : 'h:ia',
        SHORT_TIME_FORMAT : 'ga',
        SHORT_DATE_FORMAT : 'm/d',
        DATE_FORMAT_US : 'm/d/Y',
        DATE_FORMAT_ISO : 'Y-m-d',
        DATE_TIME_FORMAT_US : 'm/d/Y h:ia',
        DATE_AND_TIME_FORMAT : 'm/d/Y h:ia',
        DATE_MONTH_DAY : 'm-d',
        DATE_MONTH_NUMERIC : 'n',
        DATE_MONTH : 'F',
        DATE_MONTH_YEAR_LONG : 'F Y',
        DATE_MONTH_YEAR_SHORT : 'M Y',
        DATE_TIME_FORMAT : 'c',
        RAW_DATE_TIME_FORMAT : 'Y-m-d H:i:s',
        TIME_FORMAT : 'H:i',
        TIME_FORMAT_FULL : 'H:i:s',
        TIME_FORMAT_US : 'h:ia',
        TIMESTAMP : 'time',
        ZENDESK_DATE_TIME_FORMAT : 'c',
        WEEK_DATE_FORMAT : 'M j',
        WEEK_EVENT_DATE_FORMAT : 'm/d/Y',
        WEEK_EVENT_SHORT_DATE_FORMAT : 'm/d',
        TEXTUAL_MONTH_DATE_FORMAT : 'F d, Y',

        HEADER : {
            AUTHORIZATION : 'Authorization',
            EMPLOYER_ID : 'EmployerId',
            TENANT_ID : 'TenantId',

            CRITERION_RECONNECT_ATTEMPT : 'CR-Reconnect-Attempt',
            CRITERION_WAITING_SERVICE_ATTEMPT : 'CR-Waiting-Service-Attempt'
        },

        API,
        API_IMITATION_CFG,
        OVERRIDE_CODETABLE_CFG,
        OVERRIDE_SECURITY_RULES
    };
});
