Ext.define('criterion.consts.Error', function() {

    const RESULT_CODES = {
            // Generic
            UNKNOWN_EXCEPTION : 'UNKNOWN_EXCEPTION',
            SYSTEM_ERROR : 'SYSTEM_ERROR',
            NO_ERROR_CODE : 'NO_ERROR_CODE',
            SESSION_WAS_EXPIRED : 'SESSION_WAS_EXPIRED',
            MULTIPLE_VALIDATION_ERRORS : 'MULTIPLE_VALIDATION_ERRORS',

            // Person / employee
            VALIDATION_PERSON_EMAIL_EXISTS : 'VALIDATION_PERSON_EMAIL_EXISTS',
            INCORRECT_OLD_PASSWORD : 'INCORRECT_OLD_PASSWORD',

            // Expressions
            BENEFIT_COVERAGE_FORMULA_NOT_VALID : 'BENEFIT_COVERAGE_FORMULA_NOT_VALID',
            BENEFIT_PREMIUM_FORMULA_NOT_VALID : 'BENEFIT_PREMIUM_FORMULA_NOT_VALID',
            BENEFIT_DEPENDENT_FORMULA_NOT_VALID : 'BENEFIT_DEPENDENT_FORMULA_NOT_VALID',
            BENEFIT_EE_CONTRIBUTION_FORMULA_NOT_VALID : 'BENEFIT_EE_CONTRIBUTION_FORMULA_NOT_VALID',
            BENEFIT_ELIGIBILITY_FORMULA_NOT_VALID : 'BENEFIT_ELIGIBILITY_FORMULA_NOT_VALID',
            BENEFIT_EFFECTIVE_FORMULA_NOT_VALID : 'BENEFIT_EFFECTIVE_FORMULA_NOT_VALID',
            BENEFIT_EXPIRE_FORMULA_NOT_VALID : 'BENEFIT_EXPIRE_FORMULA_NOT_VALID',
            SHIFT_END_BEFORE_START : 'SHIFT_END_BEFORE_START',
            RECURRING_END_DATE_TOO_EARLY : 'RECURRING_END_DATE_TOO_EARLY',
            RECURRING_END_DATE_BEFORE_START : 'RECURRING_END_DATE_BEFORE_START',
            RECURRING_END_DATE_TOO_LATE : 'RECURRING_END_DATE_TOO_LATE',
            EMPLOYEE_COURSE_MAX_ENROLLMENT_LIMIT_REACHED : 'EMPLOYEE_COURSE_MAX_ENROLLMENT_LIMIT_REACHED',
            EMPLOYEE_CLASS_MAX_ENROLLMENT_LIMIT_REACHED : 'EMPLOYEE_CLASS_MAX_ENROLLMENT_LIMIT_REACHED',

            //File Upload
            MAX_FILE_SIZE_EXCEEDED : 'MAX_FILE_SIZE_EXCEEDED',

            //Payments processing
            PAYMENT_SELECTION_REQUIRED : 'PAYMENT_SELECTION_REQUIRED',
            UNPROCESSED_PAYMENTS_FOUND : 'UNPROCESSED_PAYMENTS_FOUND',
            BATCH_SHOULD_BE_TRANSMITTED : 'BATCH_SHOULD_BE_TRANSMITTED'
        },

        MESSAGE_LEVEL = {
            ERROR : 1,
            WARNING : 2,
            INFO : 3,
            ERRORS : 4
        };

    let ERRORS = {
        // Common
        SYSTEM_ERROR : {
            description : i18n.gettext("An internal error occurred ({0}). Please contact Criterion support and provide this number."),
            level : MESSAGE_LEVEL.ERROR
        },
        UNKNOWN_EXCEPTION : {
            description : i18n.gettext("Unknown error occurred ({0})."),
            level : MESSAGE_LEVEL.ERROR
        },
        SESSION_WAS_EXPIRED : {
            description : i18n.gettext("Your session has timed-out. Please login to continue."),
            level : MESSAGE_LEVEL.ERROR
        }
    };

    return {

        singleton : true,

        RESULT_CODES : RESULT_CODES,

        constructor() {
            if (!CRITERION_ERRORS_STORE_DATA) {
                console.error('errors file is absent');
                return;
            }

            Ext.each(CRITERION_ERRORS_STORE_DATA.errors, error => {
                ERRORS[error.code] = {
                    description : error.message,
                    level : error.level
                }
            });
        },

        getServerErrorsObject() {
            return ERRORS;
        },

        getErrorInfo(error) {
            let hostnameParts = window.location.hostname.split('.'),
                hostnameTenant = (hostnameParts[0] !== 'www' ? hostnameParts[0] : hostnameParts[1]).toLowerCase(),
                code, fields, description,
                SERVER_ERRORS = this.getServerErrorsObject();

            if (Ext.isString(error)) {
                code = error;
                fields = [];
            } else {
                code = error.code || error.message;
                fields = error.fields;
            }

            if (code === RESULT_CODES.MULTIPLE_VALIDATION_ERRORS) {
                let descriptions = Ext.Array.map(error.errors, _error => {
                    if (new RegExp('{.*:.*}').test([SERVER_ERRORS[_error.code].description])) {
                        return criterion.Utils.fatFormat([SERVER_ERRORS[_error.code].description], _error.fields);
                    } else {
                        return Ext.util.Format.format.apply(
                            this,
                            Ext.Array.insert([SERVER_ERRORS[_error.code].description], 1, _error.fields)
                        );
                    }
                });

                return {
                    description : '<BR/>' + descriptions.join('<BR/><BR/>'),
                    level : MESSAGE_LEVEL.ERRORS,
                    code : code
                }
            } else {
                if (!code || !Ext.Array.contains(Ext.Object.getKeys(SERVER_ERRORS), code)) {
                    fields = [code || RESULT_CODES.NO_ERROR_CODE];
                    code = RESULT_CODES.UNKNOWN_EXCEPTION;
                } else if (code === RESULT_CODES.SYSTEM_ERROR) {
                    fields = (!criterion.PRODUCTION || hostnameTenant === criterion.Consts.TURING_IDENT) ? [] : [error.hash];
                    description = (!criterion.PRODUCTION || hostnameTenant === criterion.Consts.TURING_IDENT) ? error.message : null;
                }

                if (!description) {
                    if (new RegExp('{.*:.*}').test([SERVER_ERRORS[code].description])) {
                        description = criterion.Utils.fatFormat([SERVER_ERRORS[code].description], fields);
                    } else {
                        description = Ext.util.Format.format.apply(
                            this,
                            Ext.Array.insert([SERVER_ERRORS[code].description], 1, fields)
                        );
                    }
                }

                return {
                    description : description,
                    level : SERVER_ERRORS[code].level,
                    code : code
                }
            }
        },

        showMessage(error) {
            let info = this.getErrorInfo(error);

            return this.showMessageBox(info.description, info.level, info.code);
        },

        showMessageBox(message, level, code, fn) {
            switch (level) {
                case MESSAGE_LEVEL.INFO:
                    return criterion.Msg.info(message);

                case MESSAGE_LEVEL.WARNING:
                    return criterion.Msg.warning(message);

                case MESSAGE_LEVEL.ERROR:
                case MESSAGE_LEVEL.ERRORS:
                default:
                    let title;

                    if (typeof criterion.Msg === 'undefined' || typeof criterion.Msg.error === 'undefined' || typeof i18n.gettext === 'undefined') {
                        localStorage.setItem(criterion.Consts.AUTH_FAILURE, message);
                        criterion.Api.logout();

                        return;
                    }

                    if (Ext.Array.contains([RESULT_CODES.UNKNOWN_EXCEPTION, RESULT_CODES.SYSTEM_ERROR], code)) {
                        title = i18n.gettext('System Error');
                    } else {
                        title = level === MESSAGE_LEVEL.ERROR ? i18n.gettext('Validation Error') : i18n.gettext('Validation Errors');
                    }

                    return criterion.Msg.error({
                        message : Ext.util.Format.format('<strong>{0}: </strong>{1}', title, message),
                        fn : fn
                    });
            }
        },

        show502Error() {
            if (typeof criterion.Msg === 'undefined' || typeof criterion.Msg.error === 'undefined' || typeof i18n.gettext === 'undefined') {
                localStorage.setItem(criterion.Consts.AUTH_FAILURE, 'Server Not Available, please contact Customer Support.');
                criterion.Api.logout();

                return;
            }

            return this.showMessageBox(i18n.gettext('Server Not Available, please contact Customer Support'), MESSAGE_LEVEL.ERROR, RESULT_CODES.SYSTEM_ERROR);
        }

    }

});
