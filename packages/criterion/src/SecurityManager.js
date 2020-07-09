/**
 * @singleton
 */
Ext.define('criterion.SecurityManager', function() {

    const SECURITY_DOMAIN_ESS_FUNCTION = 'essFunction',
        SECURITY_DOMAIN_HR_FUNCTION = 'hrFunction',
        SECURITY_DOMAIN_ROLE = 'role',
        SECURITY_MODULES = criterion.Consts.SECURITY_MODULES,
        ACT = 'a',
        CREATE = 'c',
        READ = 'r',
        UPDATE = 'u',
        DELETE = 'd';

    let domains = {},
        origESSFunctions,
        hasSandbox = false,
        showInternalCareers = false;

    const ESS_KEYS = {
        ADDRESS : 'ADDR',
        ADDITIONAL_POSITIONS : 'AP',
        TEAM_ATTENDANCE : 'ATTENDANCE',
        MY_AVAILABILITY : 'AVAIL',
        TEAM_AVAILABILITY : 'AVAILMAN',
        BANK_ACCOUNTS : 'BA',
        BENEFITS_PLANS : 'BP',
        CALENDAR : 'CAL',
        CALENDAR_MENU : 'CALMENU',
        COMPANY_DIRECTORY : 'CDIR',
        COMPANY_DOCUMENTS : 'CDOC',
        CERTIFICATION : 'CERT',
        COMPANY_VIDEOS : 'CV',
        DEPENDENTS_CONTACTS : 'DC',
        DEDUCTION : 'DEDUCT',
        DEMOGRAPHICS : 'DEMOG',
        DELEGATION : 'DLG',
        EDUCATION : 'EDUC',
        EMPLOYMENT_INFORMATION : 'EI',
        FORM : 'FORM',
        INCOME : 'INCM',
        JOURNAL_ENTRY : 'JE',
        JOB_POSTINGS : 'JP',
        LOOK_AND_FEEL : 'LAF',
        LEARNING_ACTIVE : 'LEA',
        LEARNING_COMPLETE : 'LEC',
        INSTRUCTOR_PORTAL : 'LEIP',
        MY_TEAM : 'LEMT',
        MY_DOCUMENTS : 'MD',
        EVENTS : 'ME',
        MY_GOALS : 'MG',
        MY_JOURNALS : 'MJ',
        MY_SHIFT_ASSIGNMENTS : 'MSA',
        OPEN_ENROLLMENT : 'OE',
        PAY_HISTORY : 'PAYH',
        POSITION_HISTORY : 'POSH',
        PRIMARY_POSITION : 'PP',
        REPORTS : 'REP',
        REVIEWS : 'REVIEWS',
        SECURITY : 'SEC',
        SKILL : 'SKILL',
        TAXES : 'TAX',
        TEAM_DELEGATION : 'TDLG',
        ORGANIZATION_VIEW : 'TEAM',
        TEAM_DOCUMENTS : 'TEAMDOC',
        TEAM_REVIEWS : 'TEAM_REVIEWS',
        TEAM_TIME_OFFS : 'TEAM_TO_DASH',
        TEAM_GOALS : 'TG',
        MY_TIME_OFFS : 'TIMEOFFDASHBOARD',
        TIME_ENTRY : 'TIME_ENTRY',
        TEAM_JOURNALS : 'TJ',
        TIMESHEET : 'TS',
        TEAM_TIMESHEETS : 'TSD'
    };

    const HR_KEYS = {
        DASHBOARD : 'DASHBOARD',
        DASHBOARD_ITEM : 'DASHBOARD_ITEM',

        EMPLOYEE : 'EMPLOYEE',
        EMPLOYEE_REHIRE : 'EMPLOYEE_REHIRE',
        EMPLOYEE_ADD_EMPLOYER : 'EMPLOYEE_ADD_EMPLOYER',
        EMPLOYEE_TRANSFER : 'EMPLOYEE_TRANSFER',
        EMPLOYEE_TERMINATION : 'EMPLOYEE_TERMINATION',
        EMPLOYEE_UNDO_TERMINATION : 'EMPLOYEE_UNDO_TERMINATION',
        EMPLOYEE_RESUBMIT : 'EMPLOYEE_RESUBMIT',
        EMPLOYEE_PERSON : 'EMPLOYEE_PERSON',
        EMPLOYEE_ADDRESS : 'EMPLOYEE_ADDRESS',
        EMPLOYEE_PRIMARY_POSITION : 'EMPLOYEE_PRIMARY_POSITION',
        EMPLOYEE_PRIMARY_POSITION_NEW_ACTION : 'EMPLOYEE_PRIMARY_POSITION_NEW_ACTION',
        EMPLOYEE_ADDITIONAL_POSITIONS : 'EMPLOYEE_ADDITIONAL_POSITIONS',
        EMPLOYEE_ADDITIONAL_POSITION_NEW_ACTION : 'EMPLOYEE_ADDITIONAL_POSITION_NEW_ACTION',
        EMPLOYEE_ADDITIONAL_POSITION_TERMINATE : 'EMPLOYEE_ADDITIONAL_POSITION_TERMINATE',
        EMPLOYEE_POSITION_HISTORY : 'EMPLOYEE_POSITION_HISTORY',
        EMPLOYEE_TASKS : 'EMPLOYEE_TASKS',
        EMPLOYEE_BENEFIT_PLANS : 'EMPLOYEE_BENEFIT_PLANS',
        EMPLOYEE_TIMEOFF_PLANS : 'EMPLOYEE_TIMEOFF_PLANS',
        EMPLOYEE_TIMEOFF : 'EMPLOYEE_TIMEOFF',
        EMPLOYEE_TAXES : 'EMPLOYEE_TAXES',
        EMPLOYEE_INCOMES : 'EMPLOYEE_INCOMES',
        EMPLOYEE_DEDUCTIONS : 'EMPLOYEE_DEDUCTIONS',
        EMPLOYEE_BANK_ACCOUNTS : 'EMPLOYEE_BANK_ACCOUNTS',
        EMPLOYEE_DOCUMENTS : 'EMPLOYEE_DOCUMENTS',
        EMPLOYEE_DEPENDENTS_CONTACTS : 'EMPLOYEE_DEPENDENTS_CONTACTS',
        EMPLOYEE_ADDITIONAL_DEMOGRAPHICS : 'EMPLOYEE_ADDITIONAL_DEMOGRAPHICS',
        EMPLOYEE_ADDITIONAL_ADDRESS : 'EMPLOYEE_ADDITIONAL_ADDRESS',
        EMPLOYEE_PRIOR_EMPLOYMENT : 'EMPLOYEE_PRIOR_EMPLOYMENT',
        EMPLOYEE_SOCIAL_MEDIA : 'EMPLOYEE_SOCIAL_MEDIA',
        EMPLOYEE_EDUCATION : 'EMPLOYEE_EDUCATION',
        EMPLOYEE_SKILLS : 'EMPLOYEE_SKILLS',
        EMPLOYEE_CERTIFICATIONS : 'EMPLOYEE_CERTIFICATIONS',
        EMPLOYEE_COURSES : 'EMPLOYEE_COURSES',
        EMPLOYEE_GOALS : 'EMPLOYEE_GOALS',
        EMPLOYEE_REVIEWS : 'EMPLOYEE_REVIEWS',
        EMPLOYEE_JOURNAL_ENTRIES : 'EMPLOYEE_JOURNAL_ENTRIES',
        EMPLOYEE_WORKERS_COMPENSATION : 'EMPLOYEE_WORKERS_COMPENSATION',
        EMPLOYEE_SECURITY : 'EMPLOYEE_SECURITY',
        EMPLOYEE_GROUPS : 'EMPLOYEE_GROUPS',
        EMPLOYEE_TEAM_GROUPS : 'EMPLOYEE_TEAM_GROUPS',

        POSITION : 'POSITION',
        POSITION_CLASSIFICATION : 'POSITION_CLASSIFICATION',
        POSITION_RECRUTING : 'POSITION_RECRUTING',
        POSITION_ASSIGNMENTS : 'POSITION_ASSIGNMENTS',

        ORGANIZATION : 'ORGANIZATION',
        ORGANIZATION_EXPORT : 'ORGANIZATION_EXPORT',

        REPORTS : 'REPORTS',
        REPORTS_DATA_GRID : 'REPORTS_DATA_GRID',
        REPORTS_DATA_TRANSFER : 'REPORTS_DATA_TRANSFER',

        SETTINGS_HRADMIN : 'SETTINGS_HRADMIN',
        SETTINGS_PAYADMIN : 'SETTINGS_PAYADMIN',
        SETTINGS_RECADMIN : 'SETTINGS_RECADMIN',
        SETTINGS_SCHEDADMIN : 'SETTINGS_SCHEDADMIN',
        SETTINGS_GEN : 'SETTINGS_GEN',
        SETTINGS_LEARNMAN : 'SETTINGS_LEARNMAN',
        SETTINGS_PERF : 'SETTINGS_PERF',
        SETTINGS_ENGAGE : 'SETTINGS_ENGAGE',
        SYSTEM_CONFIGURATION : 'SYSTEM_CONFIGURATION',

        PAYROLL_BATCH : 'PAYROLL_BATCH',
        PAYROLL_BATCH_UNAPPROVE : 'PAYROLL_BATCH_UNAPPROVE',
        PAYROLL_BATCH_ADD_EMPLOYEE : 'PAYROLL_BATCH_ADD_EMPLOYEE',
        PAYROLL_BATCH_MANAGE_INCOMES : 'PAYROLL_BATCH_MANAGE_INCOMES',
        PAYROLL_BATCH_DETAILS : 'PAYROLL_BATCH_DETAILS',
        PAYROLL_BATCH_IMPORT : 'PAYROLL_BATCH_IMPORT',
        PAYROLL_BATCH_CALCULATE : 'PAYROLL_BATCH_CALCULATE',
        PAYROLL_BATCH_EXPORT : 'PAYROLL_BATCH_EXPORT',

        PAY_PROCESSING : 'PAY_PROCESSING',
        PAY_PROCESSING_COMPLETE_BATCH : 'PAY_PROCESSING_COMPLETE_BATCH',
        PAY_PROCESSING_TAX_FILING_PAYMENTS : 'PAY_PROCESSING_TAX_FILING_PAYMENTS',
        PAY_PROCESSING_TAX_FILING_PAYMENTS_GENERATE : 'PAY_PROCESSING_TAX_FILING_PAYMENTS_GENERATE',
        PAY_PROCESSING_GENERAL_LEDGER : 'PAY_PROCESSING_GENERAL_LEDGER',
        PAY_PROCESSING_GENERAL_LEDGER_DOWNLOAD : 'PAY_PROCESSING_GENERAL_LEDGER_DOWNLOAD',
        PAY_PROCESSING_GENERAL_LEDGER_TRANSMIT : 'PAY_PROCESSING_GENERAL_LEDGER_TRANSMIT',

        RECRUITING_JOB : 'RECRUITING_JOB',
        RECRUITING_JOB_CANDIDATES : 'RECRUITING_JOB_CANDIDATES',
        RECRUITING_JOB_ACTIVITY : 'RECRUITING_JOB_ACTIVITY',
        RECRUITING_JOB_ACTIVITY_DOWNLOAD_CALENDAR : 'RECRUITING_JOB_ACTIVITY_DOWNLOAD_CALENDAR',
        RECRUITING_JOB_POSITION : 'RECRUITING_JOB_POSITION',
        RECRUITING_JOB_PUBLISH : 'RECRUITING_JOB_PUBLISH',

        RECRUITING_CANDIDATE : 'RECRUITING_CANDIDATE',
        RECRUITING_CANDIDATE_WRITE_EMAIL : 'RECRUITING_CANDIDATE_WRITE_EMAIL',
        RECRUITING_CANDIDATE_NOTES : 'RECRUITING_CANDIDATE_NOTES',
        RECRUITING_CANDIDATE_INTERVIEW : 'RECRUITING_CANDIDATE_INTERVIEW',
        RECRUITING_CANDIDATE_INTERVIEW_DOWNLOAD : 'RECRUITING_CANDIDATE_INTERVIEW_DOWNLOAD',
        RECRUITING_CANDIDATE_INTERVIEW_DOWNLOAD_CALENDAR : 'RECRUITING_CANDIDATE_INTERVIEW_DOWNLOAD_CALENDAR',
        RECRUITING_CANDIDATE_PROFILE : 'RECRUITING_CANDIDATE_PROFILE',
        RECRUITING_CANDIDATE_JOBS : 'RECRUITING_CANDIDATE_JOBS',
        RECRUITING_CANDIDATE_JOBS_ADD_ACTIVITY : 'RECRUITING_CANDIDATE_JOBS_ADD_ACTIVITY',
        RECRUITING_CANDIDATE_JOBS_CHANGE_STATUS : 'RECRUITING_CANDIDATE_JOBS_CHANGE_STATUS',
        RECRUITING_CANDIDATE_RESUME : 'RECRUITING_CANDIDATE_RESUME',
        RECRUITING_CANDIDATE_RESUME_DOWNLOAD : 'RECRUITING_CANDIDATE_RESUME_DOWNLOAD',
        RECRUITING_CANDIDATE_RESUME_PARSE : 'RECRUITING_CANDIDATE_RESUME_PARSE',
        RECRUITING_CANDIDATE_COVER_LETTER : 'RECRUITING_CANDIDATE_COVER_LETTER',
        RECRUITING_CANDIDATE_COVER_LETTER_DOWNLOAD : 'RECRUITING_CANDIDATE_COVER_LETTER_DOWNLOAD',
        RECRUITING_CANDIDATE_ATTACHMENT : 'RECRUITING_CANDIDATE_ATTACHMENT',
        RECRUITING_CANDIDATE_ATTACHMENT_DOWNLOAD : 'RECRUITING_CANDIDATE_ATTACHMENT_DOWNLOAD',
        RECRUITING_CANDIDATE_ACTIVITY : 'RECRUITING_CANDIDATE_ACTIVITY',
        RECRUITING_CANDIDATE_ACTIVITY_DOWNLOAD_CALENDAR : 'RECRUITING_CANDIDATE_ACTIVITY_DOWNLOAD_CALENDAR',
        RECRUITING_CANDIDATE_FORM : 'RECRUITING_CANDIDATE_FORM',

        SCHEDULING_SHIFT : 'SCHEDULING_SHIFT',
        SCHEDULING_ASSIGNMENT : 'SCHEDULING_ASSIGNMENT',
        SCHEDULING_SHIFT_ASSIGN : 'SCHEDULING_SHIFT_ASSIGN',
        SCHEDULING_POPULATION : 'SCHEDULING_POPULATION'
    };

    return {

        singleton : true,

        ACT : ACT,
        CREATE : CREATE,
        READ : READ,
        UPDATE : UPDATE,
        DELETE : DELETE,

        SECURITY_DOMAIN_ESS_FUNCTION : SECURITY_DOMAIN_ESS_FUNCTION,
        SECURITY_DOMAIN_HR_FUNCTION : SECURITY_DOMAIN_HR_FUNCTION,

        ESS_KEYS : ESS_KEYS,
        HR_KEYS : HR_KEYS,

        isReady : false,

        constructor() {
            Ext.GlobalEvents.on('authenticated', this.init, this);
            Ext.GlobalEvents.on('employeeChanged', this.onEmployeeChanged, this);
        },

        init(authResult) {
            if (authResult['isTerminated'] && criterion.Application.isAdmin()) { // see CRITERION-5279
                return
            }

            domains[SECURITY_DOMAIN_HR_FUNCTION] = Ext.clone(authResult['functions']);
            domains[SECURITY_DOMAIN_ESS_FUNCTION] = Ext.clone(authResult['essFunctions']);
            domains[SECURITY_DOMAIN_ROLE] = authResult['role'];

            this.fillEmptyValues();

            origESSFunctions = Ext.clone(domains[SECURITY_DOMAIN_ESS_FUNCTION]);

            hasSandbox = Ext.isDefined(authResult['hasSandbox']) ? authResult['hasSandbox'] : false;
            showInternalCareers = Ext.isDefined(authResult['showInternalCareers']) ? authResult['showInternalCareers'] : false;

            Ext.GlobalEvents.fireEvent('securityConfigIsReady');
            this.isReady = true;
        },

        fillEmptyValues() {
            Ext.Object.each(HR_KEYS, (_, key) => {
                if (!domains[SECURITY_DOMAIN_HR_FUNCTION][key]) {
                    // by default all rules in false state [ACRUD]
                    // this used for correct working vm formulas
                    domains[SECURITY_DOMAIN_HR_FUNCTION][key] = [false, false, false, false, false];
                }
            });
        },

        onEmployeeChanged(employee) {
            if (!this.isReady || !employee) {
                return
            }

            const DICT_SECURITY_ESS_FUNCTION = criterion.consts.Dict.SECURITY_ESS_FUNCTION;

            let myDocumentsAccess,
                payHistoryAccess,
                benefitPlansAccess,
                openEnrollmentAccess,
                origMD,
                origPAYH,
                origBP,
                origOE,
                terminationDate = employee.get('terminationDate'),
                today = Ext.Date.clearTime(new Date());

            if (terminationDate && (today > terminationDate) && !criterion.Application.isAdmin()) {
                origMD = domains[SECURITY_DOMAIN_ESS_FUNCTION][ESS_KEYS.MY_DOCUMENTS];
                origPAYH = domains[SECURITY_DOMAIN_ESS_FUNCTION][ESS_KEYS.PAY_HISTORY];
                origBP = domains[SECURITY_DOMAIN_ESS_FUNCTION][ESS_KEYS.BENEFITS_PLANS];
                origOE = domains[SECURITY_DOMAIN_ESS_FUNCTION][ESS_KEYS.OPEN_ENROLLMENT];

                // switch to false for all ess security objects
                Ext.Object.each(domains[SECURITY_DOMAIN_ESS_FUNCTION], function(key, value, obj) {
                    obj[key] = false;
                });

                // check codedetails values
                myDocumentsAccess = criterion.CodeDataManager.getCodeDetailRecord('code', ESS_KEYS.MY_DOCUMENTS, DICT_SECURITY_ESS_FUNCTION).get('attribute1');
                payHistoryAccess = criterion.CodeDataManager.getCodeDetailRecord('code', ESS_KEYS.PAY_HISTORY, DICT_SECURITY_ESS_FUNCTION).get('attribute1');
                benefitPlansAccess = criterion.CodeDataManager.getCodeDetailRecord('code', ESS_KEYS.BENEFITS_PLANS, DICT_SECURITY_ESS_FUNCTION).get('attribute1');
                openEnrollmentAccess = criterion.CodeDataManager.getCodeDetailRecord('code', ESS_KEYS.OPEN_ENROLLMENT, DICT_SECURITY_ESS_FUNCTION).get('attribute1');

                domains[SECURITY_DOMAIN_ESS_FUNCTION][ESS_KEYS.MY_DOCUMENTS] = myDocumentsAccess ? (!!parseInt(myDocumentsAccess, 10) && origMD) : false;
                domains[SECURITY_DOMAIN_ESS_FUNCTION][ESS_KEYS.PAY_HISTORY] = payHistoryAccess ? (!!parseInt(payHistoryAccess, 10) && origPAYH) : false;
                domains[SECURITY_DOMAIN_ESS_FUNCTION][ESS_KEYS.BENEFITS_PLANS] = benefitPlansAccess ? (!!parseInt(benefitPlansAccess, 10) && origBP) : false;
                domains[SECURITY_DOMAIN_ESS_FUNCTION][ESS_KEYS.OPEN_ENROLLMENT] = openEnrollmentAccess ? (!!parseInt(openEnrollmentAccess, 10) && origOE) : false;

                Ext.GlobalEvents.fireEvent('updateEss');
            } else if (!criterion.Application.isAdmin()) {
                // return ess function for the situation: switch terminated employee to normal employee
                domains[SECURITY_DOMAIN_ESS_FUNCTION] = Ext.clone(origESSFunctions);

                Ext.GlobalEvents.fireEvent('updateEss');
            }
        },

        ifReady() {
            let dfd = Ext.create('Ext.Deferred');

            if (this.isReady) {
                dfd.resolve();
            } else {
                Ext.GlobalEvents.on('securityConfigIsReady', function() {
                    dfd.resolve();
                }, this, {single : true});
            }

            return dfd.promise;
        },

        /**
         * @private
         * @param descriptor
         * @param level
         * @returns {*|boolean}
         */
        getCrudAccessRight(descriptor, level) {
            let index;

            switch (level) {
                case ACT:
                    index = 0;
                    break;

                case CREATE:
                    index = 1;
                    break;

                case READ:
                    index = 2;
                    break;

                case UPDATE:
                    index = 3;
                    break;

                case DELETE:
                    index = 4;
                    break;
            }

            return descriptor[index] || false;
        },

        /**
         * @private
         * @param descriptor
         * @param level
         * @returns {*}
         */
        getBitAccessRight(descriptor, level) {
            switch (level) {
                case READ:
                    return descriptor;

                case ACT:
                case CREATE:
                case UPDATE:
                case DELETE:
                default:

                    return false;
            }
        },

        getRoleAccess(role) {
            let roles = domains[SECURITY_DOMAIN_ROLE];

            return !!(role.value & roles);
        },

        getAccess(domain, key, level) {
            let descriptor, result,
                me = criterion.SecurityManager;

            switch (domain) {
                case SECURITY_DOMAIN_ESS_FUNCTION :
                    descriptor = criterion.consts.Api.OVERRIDE_SECURITY_RULES[domain][key];
                    if (Ext.isBoolean(descriptor)) {
                        result = me.getBitAccessRight(descriptor, level);
                    } else {
                        descriptor = domains[domain] && domains[domain][key];
                        result = descriptor ? me.getBitAccessRight(descriptor, level) : false;
                    }

                    break;

                case SECURITY_DOMAIN_HR_FUNCTION :
                    descriptor = criterion.consts.Api.OVERRIDE_SECURITY_RULES[domain][key];
                    if (descriptor) {
                        result = me.getCrudAccessRight(descriptor, level);
                    } else {
                        descriptor = domains[domain] && domains[domain][key];
                        result = descriptor ? me.getCrudAccessRight(descriptor, level) : false;
                    }

                    break;

                case SECURITY_DOMAIN_ROLE :
                    result = me.getRoleAccess(key);
                    break;

                default :
                    console && console.warn('unknown domain', arguments);
                    result = false;
                    break;
            }

            return result;
        },

        getESSAccess(key) {
            let me = criterion.SecurityManager,
                result = false;

            if (Ext.isArray(key)) {
                Ext.Array.each(key, k => {
                    result = result || me.getAccess(SECURITY_DOMAIN_ESS_FUNCTION, k, READ);
                });

                return result;
            }

            return me.getAccess(SECURITY_DOMAIN_ESS_FUNCTION, key, READ);
        },

        getSecurityObject(domain) {
            let me = this,
                securityObject = {
                    allow : true, // global consts
                    deny : false
                };

            if (!domain || domain === SECURITY_DOMAIN_ESS_FUNCTION) {
                securityObject[SECURITY_DOMAIN_ESS_FUNCTION] = {};

                Ext.Object.each(domains[SECURITY_DOMAIN_ESS_FUNCTION], (key, value) => {
                    //<debug>
                    let descriptor = criterion.consts.Api.OVERRIDE_SECURITY_RULES[SECURITY_DOMAIN_ESS_FUNCTION][key];

                    if (Ext.isBoolean(descriptor)) {
                        // override
                        value = descriptor;
                    }
                    //</debug>
                    securityObject[SECURITY_DOMAIN_ESS_FUNCTION][key] = {
                        //read : me.getBitAccessRight(value, READ) // kill after 01/07/20
                    }
                    securityObject[SECURITY_DOMAIN_ESS_FUNCTION][key][READ] = me.getBitAccessRight(value, READ);
                });
            }

            if (!domain || domain === SECURITY_DOMAIN_HR_FUNCTION) {
                securityObject[SECURITY_DOMAIN_HR_FUNCTION] = {};

                Ext.Object.each(domains[SECURITY_DOMAIN_HR_FUNCTION], (key, value) => {
                    securityObject[SECURITY_DOMAIN_HR_FUNCTION][key] = {};

                    Ext.Array.each([ACT, CREATE, READ, UPDATE, DELETE], rule => {
                        securityObject[SECURITY_DOMAIN_HR_FUNCTION][key][rule] = me.getCrudAccessRight(value, rule);
                    });
                });
            }

            if (!domain || domain === SECURITY_DOMAIN_ROLE) {
                securityObject[SECURITY_DOMAIN_ROLE] = {};

                Ext.Object.each(criterion.Consts.SECURITY_RESTRICTIONS_ROLES, (key, role) => {
                    securityObject[SECURITY_DOMAIN_ROLE][key] = me.getRoleAccess(role);
                });
            }

            return securityObject;
        },

        /**
         * Helper for passing security from record to field via straight bind.
         *
         * @param recordName
         * @param token
         */
        generateSecurityFormula(recordName, token) {
            return {
                bind : {
                    bindTo : '{' + recordName + '}',
                    deep : true
                },
                get : function(record) {
                    return record && record.getSecurityAccess && record.getSecurityAccess(token);
                }
            }
        },

        /**
         * @private
         */
        _securityFormula(domain, key, rule, reverse) {
            let descriptor,
                formula,
                flag = reverse ? '!' : '';

            descriptor = criterion.consts.Api.OVERRIDE_SECURITY_RULES[domain][key];
            if (descriptor) {
                // override
                formula = flag + (this.getCrudAccessRight(descriptor, rule) ? 'security.allow' : 'security.deny');
            } else {
                formula = flag + 'security.' + domain + '.' + key + '.' + rule;
            }

            return formula;
        },

        /**
         * sample : '{!security.hrFunction.EMPLOYEE.create}'
         */
        getSecurityHRFormula(key, rule, reverse, withoutBracket) {
            let flag = reverse ? '!' : '';

            return criterion.Application.isAdmin() ?
                (withoutBracket ? '' : '{') + this._securityFormula(SECURITY_DOMAIN_HR_FUNCTION, key, rule, reverse) + (withoutBracket ? '' : '}')
                :
                (withoutBracket ? '' : '{') + flag + 'security.allow' + (withoutBracket ? '' : '}');
        },

        /**
         * sample : '{!security.essFunction.EDUC.r}'
         */
        getSecurityESSFormula(key, reverse, withoutBracket) {
            return (withoutBracket ? '' : '{') + this._securityFormula(SECURITY_DOMAIN_ESS_FUNCTION, key, READ, reverse) + (withoutBracket ? '' : '}');
        },

        /**
         * @param cfg
         *  cfg = {
         *       withoutBracket : true,
         *       append : '',
         *       rules : {
         *           OR : [
         *               {
         *                   key : '',
         *                   actName : '',
         *                   reverse : true
         *               }
         *           ],
         *           AND : [
         *               {
         *                   key : '',
         *                   actName : '',
         *                   reverse : true
         *               }
         *           ]
         *       }
         *   }
         */
        getComplexSecurityFormula(cfg) {
            let domain = SECURITY_DOMAIN_HR_FUNCTION,
                rules = cfg.rules,
                append = cfg.append || '',
                withoutBracket = cfg['withoutBracket'],
                formula = this._complexFormulaBuilder(domain, rules);

            return criterion.Application.isAdmin() ?
                (withoutBracket ? '' : '{') + append + ' ' + formula + (withoutBracket ? '' : '}')
                :
                (withoutBracket ? '' : '{') + append + ' ' + 'security.allow' + (withoutBracket ? '' : '}');
        },

        getComplexSecurityESSFormula(cfg) {
            let domain = SECURITY_DOMAIN_ESS_FUNCTION,
                rules = cfg.rules,
                append = cfg.append || '',
                withoutBracket = cfg['withoutBracket'],
                formula = this._complexFormulaBuilder(domain, rules);

            return (withoutBracket ? '' : '{') + append + ' ' + formula + (withoutBracket ? '' : '}');
        },

        /**
         * @private
         */
        _complexFormulaBuilder(domain, rules) {
            let me = this,
                orParts = [], andParts = [],
                formula = '';

            if (Ext.isObject(rules)) {
                if (rules.OR) {
                    Ext.Array.each(rules.OR, function(rule) {
                        orParts.push(me._securityFormula(domain, rule.key, rule.actName, rule.reverse));
                    });
                }

                if (rules.AND) {
                    Ext.Array.each(rules.AND, function(rule) {
                        andParts.push(me._securityFormula(domain, rule.key, rule.actName, rule.reverse));
                    });
                }

                if (orParts.length) {
                    formula += orParts.join(' || ');
                }

                if (andParts.length) {
                    formula += (formula !== '' ? ' && ' : '') + andParts.join(' && ');
                }
            } else if (Ext.isArray(rules)) {
                Ext.Array.each(rules, function(rule) {
                    andParts.push(me._securityFormula(domain, rule.key, rule.actName, rule.reverse));
                });

                formula += andParts.join(' && ');
            }

            return formula;
        },

        getSecurityHRAccessFn(key, rule) {
            return criterion.Application.isAdmin() ? Ext.Function.pass(this.getAccess, [SECURITY_DOMAIN_HR_FUNCTION, key, rule], null) : true;
        },

        getSecurityESSAccessFn(key) {
            return Ext.Function.pass(this.getAccess, [SECURITY_DOMAIN_ESS_FUNCTION, key, READ], null);
        },

        hasSandbox() {
            return hasSandbox;
        },

        showInternalCareers() {
            return showInternalCareers;
        },

        isAllowedModule(moduleName) {
            let modules = criterion.Api.getPersonModules(),
                security;

            security = SECURITY_MODULES[moduleName];

            if (!security) {
                return 0;
            }

            return security.value & modules;
        }

    };

});
