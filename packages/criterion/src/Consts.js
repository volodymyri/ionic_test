Ext.define('criterion.Consts', function() {

    Ext.USE_NATIVE_JSON = true;
    Ext.enableAriaButtons = false;
    criterion.detectDirtyForms = true;

    criterion.MODERN = {
        version : '3.6.0'
    };

    const PREFIX = 'criterion';

    const LABEL_WIDTH = 130,
        LABEL_NARROW_WIDTH = 80,
        LABEL_WMID_WIDTH = 160,
        LABEL_WIDER_WIDTH = 200,
        LABEL_WIDE_WIDTH = 220,
        FORM_ITEM_WIDTH = 540,
        ITEM_WIDE_WIDTH = 750,
        BREAKPOINT_WIDTH_MEDIUM = 1280,
        BREAKPOINT_WIDTH_WIDE = 1470,
        BREAKPOINT_WIDTH_MINIMAL = 1024,
        DATE_INPUT_DEFAULT_WIDTH = 175,
        FORM_ITEM_HEIGHT = 36,

        TWO_COL_FORM = {
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            flex : 2,
            padding : '15 40 0 15',
            defaults : {
                labelWidth : LABEL_WIDTH
            }
        },

        ONE_COL_FORM_LIKE_TWO_COL_FORM = {
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            flex : 2,
            padding : '0 50 20 25'
        },

        TWO_COL_ACCORDION = {
            bodyPadding : 10,

            layout : 'hbox',
            defaultType : 'container',

            defaults : TWO_COL_FORM
        };

    return {

        singleton : true,

        requires : [
            'criterion.consts.*',
            'criterion.data.validator.Range',
            'criterion.data.validator.EmailList'
        ],

        AUTH_URL : criterion.AUTH_URL,

        AUTH_FAILURE : 'AUTH_FAILURE',

        TURING_IDENT : 'turing',

        /**
         * Cookies to store info.
         */
        COOKIE : {
            API_TENANT_URL : PREFIX + '-tenant_url',
            THEME : PREFIX + '-theme',
            SESSION : PREFIX + '-session',
            LOCALE : PREFIX + '-locale',

            CURRENT_EMPLOYER_ID : PREFIX + '-employer_id',
            CURRENT_EMPLOYEE_ID : PREFIX + '-employee_id',

            PROFILE_OVERRIDE : PREFIX + '-profile-override'
        },

        GLOBAL_STORES : {
            WORKFLOW_PENDING_LOGS : {
                storeId : 'WorkflowPendingLogs',
                type : 'criterion_workflow_log_pending_logs',
                groupField : 'workflowTypeDesc'
            },
            ESS_EMPLOYEE_CALENDARS : {
                storeId : 'EssCalendars',
                type : 'criterion_employee_calendars',
                sorters : [
                    {
                        property : 'name',
                        direction : 'ASC'
                    }
                ]
            },
            ESS_USER_WIDGET_EMPLOYER_LOCATIONS : {
                storeId : 'ESS_USER_WIDGET_EMPLOYER_LOCATIONS',
                type : 'employer_work_locations'
            },
            FIELD_FORMAT : {
                storeId : 'FIELD_FORMAT',
                type : 'criterion_field_types'
            },
            FIELD_FORMAT_CUSTOM : {
                storeId : 'FIELD_FORMAT_CUSTOM',
                type : 'criterion_custom_field_formats'
            },
            DOCUMENT_LOCATIONS : {
                storeId : 'DOCUMENT_LOCATIONS',
                type : 'criterion_document_locations'
            }
        },

        PAGE_SIZE : {
            NONE : 0,
            DEFAULT : 25,
            DATA_GRID_DEFAULT : 100,
            ZENDESK_DEFAULT : 100,
            BUFFERED_STORE_DEFAULT : 50,

            VALUES : [10, 25, 50, 100],
            DATA_GRID_VALUES : [10, 50, 100, 500]
        },

        BUFFERED_STORE : {
            DEFAULT_LEADING_BUFFER_ZONE : 25
        },

        UI_DEFAULTS : {
            LABEL_WIDTH : LABEL_WIDTH,
            LABEL_NARROW_WIDTH : LABEL_NARROW_WIDTH,
            FORM_ITEM_WIDTH : FORM_ITEM_WIDTH,
            FORM_ITEM_HEIGHT : FORM_ITEM_HEIGHT,
            DATE_ITEM_WIDTH : DATE_INPUT_DEFAULT_WIDTH + LABEL_WIDTH,
            LABEL_WIDER_WIDTH : LABEL_WIDER_WIDTH,
            LABEL_WMID_WIDTH : LABEL_WMID_WIDTH,
            ITEM_WIDE_WIDTH : ITEM_WIDE_WIDTH,
            LABEL_WIDE_WIDTH : LABEL_WIDE_WIDTH,
            LABEL_WIDER_ESS_WIDTH : 170,

            COL_ITEM_WIDTH : 250,
            COL_NARROW_WIDTH : 150,
            COL_SMALL_WIDTH : 100,
            ACTION_COL_ITEM_WIDTH : 42,

            ESS_COMPONENT_WIDE_WIDTH : 800,

            MODAL_WIDE_WIDTH : 1000,
            MODAL_MEDIUM_WIDTH : 757,
            MODAL_MEDIUM_2_WIDTH : 800,
            MODAL_NARROW_WIDTH : 450,
            MODAL_ESS_NARROW_WIDTH : 365,
            MODAL_NARROWER_WIDTH : 250,
            MODAL_SCREEN_WIDTH : '95%',
            MODAL_NORMAL_WIDTH : '90%',
            MODAL_MEDIUM_HTMLEDITOR_WIDTH : 680,
            POPUP_WINDOW_WIDTH : 270,

            MODAL_NORMAL_HEIGHT : '90%',
            MODAL_MEDIUM_HEIGHT : '85%',
            MODAL_HALF_HEIGHT : '50%',
            MODAL_MEDIUM_FIXED_HEIGHT : 350,
            POPUP_WINDOW_HEIGHT : 250,

            TABBAR_MIN_WIDTH : 225,
            MIN_BUTTON_WIDTH : 100,
            MIN_TOUCH_VIEWPORT_WIDTH : 1500,
            MIN_TOUCH_VIEWPORT_HEIGHT : 1500,
            TOUCH_DEVICE_LOW_HEIGHT : Ext.getBody().getHeight() < 800,

            CUSTOM_FIELD_ROW_HEIGHT : 56,
            CUSTOM_FIELDS_FORM_NONSCROLLABLE_HEIGHT : 96,

            TEXT_AREA : {
                VERTICAL_PADDINGS : 18,
                HORISONTAL_PADDINGS : 26,
                LINE_HEIGHT : 15
            },

            PADDING : {
                SIMPLE_FORM : 35,
                // Form with child containers that add 15px paddings
                ONE_TIER_FORM : 20,
                // Form with two level containers that add 25px paddings in total
                TWO_TIER_FORM : 10,
                TWO_COL_ACCORDION_CONTAINER : '20 0 35 20',
                TWO_COL_CONDENSED : '20 20 20 10'
            },

            SEARCH_CHANGE_BUFFER : 300
        },

        /**
         *
         */
        UI_CONFIG : {
            RESPONSIVE : {
                BREAKPOINT : {
                    WIDE : BREAKPOINT_WIDTH_WIDE
                },
                RULE : {
                    WIDER : 'width >= ' + BREAKPOINT_WIDTH_WIDE,
                    WIDE : 'width < ' + BREAKPOINT_WIDTH_WIDE,
                    MEDIUM : 'width <= ' + BREAKPOINT_WIDTH_MEDIUM,
                    MTMEDIUM : 'width > ' + BREAKPOINT_WIDTH_MEDIUM,
                    MINIMAL : 'width <= ' + BREAKPOINT_WIDTH_MINIMAL,
                    MTMINIMAL : 'width > ' + BREAKPOINT_WIDTH_MINIMAL,
                    FULL_PAGE_MODE : 'essFullPageMode'
                }
            },

            /**
             * Defaults for two-column form layout. Suits for full-width pages.
             */
            TWO_COL_FORM : TWO_COL_FORM,

            /**
             * Defaults for one-column between two-column form layouts. Suits for full-width pages.
             */
            ONE_COL_FORM_LIKE_TWO_COL_FORM : ONE_COL_FORM_LIKE_TWO_COL_FORM,

            /**
             * Defaults for condensed two-column form layout. Suits for modal windows or other smaller containers.
             * @type {Object}
             */
            TWO_COL_CONDENSED : Ext.Object.merge({}, TWO_COL_FORM, {
                margin : '0 20 0 10'
            }),

            TWO_COL_ACCORDION : TWO_COL_ACCORDION,

            TWO_COL_ACCORDION_WIDER : Ext.Object.merge({}, TWO_COL_ACCORDION, {
                defaults : {
                    defaults : {
                        labelWidth : LABEL_WIDER_WIDTH
                    }
                }
            }),

            TWO_COL_ACCORDION_WIDE : Ext.Object.merge({}, TWO_COL_ACCORDION, {
                defaults : {
                    defaults : {
                        labelWidth : LABEL_WIDE_WIDTH
                    }
                }
            }),

            TWO_COL_FORM_WIDER : Ext.Object.merge({}, TWO_COL_FORM, {
                defaults : {
                    labelWidth : LABEL_WIDER_WIDTH
                }
            }),

            TWO_COL_FORM_WIDE : Ext.Object.merge({}, TWO_COL_FORM, {
                defaults : {
                    labelWidth : LABEL_WIDE_WIDTH
                }
            }),

            TWO_COL_FORM_WIDER_NO_PADDING : Ext.Object.merge({}, TWO_COL_FORM, {
                padding : '0 15 0 15',
                defaults : {
                    labelWidth : LABEL_WIDER_WIDTH
                }
            }),

            ONE_COL_FORM : {
                padding : '0 40 0 15',
                labelWidth : LABEL_WIDTH,
                maxWidth : FORM_ITEM_WIDTH
            },

            ONE_COL_FORM_WIDER : {
                padding : '0 40 0 15',
                labelWidth : LABEL_WIDER_WIDTH,
                maxWidth : FORM_ITEM_WIDTH
            },
            ONE_COL_FORM_WIDE : {
                padding : '0 40 0 15',
                labelWidth : LABEL_WIDE_WIDTH,
                maxWidth : ITEM_WIDE_WIDTH
            }
        },

        UI_CLS : {
            WORKFLOW_HIGHLIGHTED : 'criterion-workflow-field-highlighted',
            WORKFLOW_HIGHLIGHTED_BOX : 'criterion-workflow-field-highlighted-box'
        },

        /**
         * Date formats for UI
         */
        UI_DATE_FORMAT : {
            SHORT_DATE : 'm/d/Y'
        },

        CLONE_PREFIX : '_CLONE',

        /**
         * Templates.
         * Dont use this list directly cause some properties should be
         * instance of Ext.XTemplate.
         * E.g. {@link Ext.form.Labelable#afterLabelTextTpl}
         *
         * Use {@see criterion.Utils.getTpl} instead.
         */
        TPL : {
            TITLE : '{title}',

            TRAINING_STATUS : [
                '<div class="x-btn-default-small {colorClass}" style="color:white; width:90px; text-align: center;">{text}</div>'
            ],

            BULLED_MENU_ITEM : [
                '<span class="x-bull">{[values.checked ? "&bull;" : "&nbsp;"]}</span>&nbsp;{text}'
            ]
        },

        CLASSIFICATION_TYPES : {
            TASKS : 1
        },

        POSITION_MANAGEMENT_ACTIONS : {
            CREATE : 'create',
            EDIT : 'edit',
            CLONE : 'clone',
            FILL_POSITION : 'fill_position'
        },

        // Employer View Settings
        VIEW_SETTING : {
            HR_EMPLOYER_TAB_VISIBLE : 'hrEmployerTabVisible',
            PAYROLL_EMPLOYER_TAB_VISIBLE : 'payrollEmployerTabVisible'
        },

        REPORT_MODULE : {
            RECRUITING : 1,
            PAYROLL : 2,
            HR : 4,
            SCHEDULING : 8,
            SELF_SERVICE : 16
        },

        INSTRUCTOR : {
            TYPE : {
                INTERNAL : {
                    ID : 1,
                    LABEL : i18n.gettext('Internal')
                },
                EXTERNAL : {
                    ID : 2,
                    LABEL : i18n.gettext('External')
                }
            }
        },

        THEMES : {
            DEFAULT : 'default',
            AVAILABLE : {
                default : i18n.gettext('Criterion Classic')
            }
        },

        // Security settings
        SECURITY_RESTRICTIONS_ROLES : {
            FULL : {
                name : i18n.gettext('Full Access'),
                value : true
            },
            LIMIT : {
                name : i18n.gettext('Limited Access'),
                value : false
            }
        },

        ACCESS_TYPES : {
            FULL_ACCESS : 'FULL_ACCESS',
            LIMITED_ACCESS : 'LIMITED_ACCESS',
            TIME_CLOCK_MANAGEMENT : 'TIME_CLOCK_MANAGEMENT'
        },

        SECURITY_ROLES : {
            SELF : 'SELF',
            FULL : 'FULL',
            ORGANIZATION : 'ORGANIZATION',
            EMPLOYEE_GROUP : 'EMPLOYEE_GROUP'
        },

        SECURITY_MODULES : {
            HR : {
                name : i18n.gettext('HR'),
                value : 4
            },
            Payroll : {
                name : i18n.gettext('Payroll'),
                value : 2
            },
            Recruiting : {
                name : i18n.gettext('Recruiting'),
                value : 1
            },
            Scheduling : {
                name : i18n.gettext('Scheduling'),
                value : 8
            }
        },

        PASSWORD_COMPLEXITY : {
            UPPER : {
                name : i18n.gettext('Upper Case'),
                value : 1
            },
            LOWER : {
                name : i18n.gettext('Lower Case'),
                value : 2
            },
            NUMERIC : {
                name : i18n.gettext('Numeric'),
                value : 4
            },
            NON_ALPHANUMERIC : {
                name : i18n.gettext('Non-alphanumeric'),
                value : 8
            }
        },

        getValidator : function() {
            return {
                NON_EMPTY : {
                    type : 'length',
                    min : 1,
                    minOnlyMessage : i18n.gettext('This field is required')
                },
                PRESENCE : {
                    type : 'presence'
                },
                POSITIVE_OR_ZERO : {
                    type : 'range',
                    min : 0,
                    minOnlyMessage : i18n.gettext('Should be a positive number or zero')
                },
                POSITIVE_ONLY : {
                    type : 'criterion_range',
                    min : 0,
                    excludeMin : true,
                    excludeMinMessage : i18n.gettext('Should be a positive number')
                },
                YEAR : {
                    type : 'format',
                    matcher : /\d{4}/,
                    message : i18n.gettext('Should be a year, ex. 2015')
                },
                SHOULD_HAVE_RELATED : {
                    type : 'criterion_relation',
                    relationFn : function(value, relationValue) {
                        return !(value && !relationValue);
                    },
                    message : i18n && i18n.gettext('Should be present.')
                },
                HOURS_PER_DAY : {
                    type : 'criterion_range',
                    min : 0,
                    max : 24,
                    excludeMin : true,
                    excludeMinMessage : i18n.gettext('Should be more than 0 and less or equal 24'),
                    bothMessage : i18n.gettext('Should be more than 0 and less or equal 24')
                },
                DAYS_PER_WEEK : {
                    type : 'criterion_range',
                    min : 0,
                    max : 7,
                    excludeMin : true,
                    excludeMinMessage : i18n.gettext('Should be more than 0 and less or equal 7'),
                    bothMessage : i18n.gettext('Should be more than 0 and less or equal 7')
                },
                WEEKS_PER_YEAR : {
                    type : 'criterion_range',
                    min : 0,
                    max : 52,
                    excludeMin : true,
                    excludeMinMessage : i18n.gettext('Should be more than 0 and less or equal 52'),
                    bothMessage : i18n.gettext('Should be more than 0 and less or equal 52')
                },
                PREDEFINED_RANGE : function(min, max) {
                    return {
                        type : 'criterion_range',
                        min : min,
                        max : max,
                        bothMessage : Ext.String.format(i18n.gettext('Should be between {0} and {1}'), min, max)
                    };
                },
                EMAIL_LIST : {
                    type : 'criterion_email_list',
                    allowNull : true
                }
            };
        },

        /**
         * Generic messages; for error messages use criterion.LocalizationManager
         */
        getMessage : function() {
            return {
                genericError : i18n.gettext('Something\'s gone wrong'),
                genericBusy : i18n.gettext('Loading…'),

                authenticate : i18n.gettext('Authentication…'),
                authenticate2fa : i18n.gettext('Verifying code…'),
                credentials : i18n.gettext('Invalid credentials'),

                109 : i18n.gettext('Invalid credentials'),
                110 : i18n.gettext('Login disabled')
            };
        },

        getCustomizableEntities : function() {
            return {
                CUSTOMIZABLE_ENTITY_EMPLOYER : {
                    code : 'EMPLOYER',
                    title : i18n.gettext('Employer Custom Fields'),
                    description : i18n.gettext('Employer Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_ASSIGNMENT_DETAIL : {
                    code : 'ASSIGNMENT_DETAIL',
                    title : i18n.gettext('Assignment Detail Custom Fields'),
                    description : i18n.gettext('Primary Position Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_POSITION : {
                    code : 'POSITION',
                    title : i18n.gettext('Position Custom Fields'),
                    description : i18n.gettext('Position Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_DEMOGRAPHICS : {
                    code : 'DEMOGRAPHICS',
                    title : i18n.gettext('Employee Demographics'),
                    description : i18n.gettext('Employee Demographics Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_ADDL_DEMOGRAPHICS : {
                    code : 'ADDL_DEMOGRAPHICS',
                    title : i18n.gettext('Employee Additional Demographics'),
                    description : i18n.gettext('Employee Additional Demographics Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_EMPLOYEE : {
                    code : 'EMPLOYEE',
                    title : i18n.gettext('Employee Custom Fields'),
                    description : i18n.gettext('Employment Information Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_BENEFIT_PLAN : {
                    code : 'BENEFIT_PLAN',
                    title : i18n.gettext('Benefit Plan Custom Fields'),
                    description : i18n.gettext('Benefit Plan Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_EMPLOYEE_BENEFIT : {
                    code : 'EMPLOYEE_BENEFIT',
                    title : i18n.gettext('Employee Benefit Custom Fields'),
                    description : i18n.gettext('Employee Benefit Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_EMPLOYEE_FORM : {
                    code : 'FORM',
                    title : i18n.gettext('Employee Custom Form'),
                    description : i18n.gettext('Employee Form Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_TIMESHEET_DETAIL : {
                    code : 'TIMESHEET',
                    title : i18n.gettext('Timesheet Detail'),
                    description : i18n.gettext('Timesheet Detail Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_EMPLOYEE_COURSE : {
                    code : 'EMPLOYEE_COURSE',
                    title : i18n.gettext('Employee Course'),
                    description : i18n.gettext('Employee Course Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_DEPENDENTS : {
                    code : 'DEPENDENTS',
                    title : i18n.gettext('Dependents'),
                    description : i18n.gettext('Dependents Custom Fields')
                },
                CUSTOMIZABLE_REVIEW : {
                    code : 'REVIEW',
                    title : i18n.gettext('Custom'),
                    description : i18n.gettext('Review Custom Fields')
                },
                CUSTOMIZABLE_ENTITY_PAYROLL_INTERFACE_T4_SETTINGS : {
                    code : 'PAYROLL_INTERFACE_T4_SETTINGS',
                    title : i18n.gettext('Payroll Interface Settings'),
                    description : i18n.gettext('Payroll T4 Interface Custom Fields')
                }
            };
        },

        EVENT_TYPES : {
            NEW_HIRE : {
                code : 'NEW_HIRE',
                message : i18n.gettext('{0} hired on {1}'),
                redirectTo : criterion.consts.Route.HR.EMPLOYEE
            },
            TERMINATION : {
                code : 'TERMINATION',
                message : i18n.gettext('{0} terminated on {1}'),
                redirectTo : criterion.consts.Route.HR.EMPLOYEE
            },
            POSITION_RATE_CHANGES : {
                code : 'POSITION_RATE_CHANGES',
                message : i18n.gettext('{0} has a {1} effective {2}'),
                redirectTo : criterion.consts.Route.HR.EMPLOYEE
            },
            TIMEOFF_STARTING : {
                code : 'TIMEOFF_STARTING',
                message : i18n.gettext('{0} has time off for {1} starting {2}'),
                redirectTo : criterion.consts.Route.HR.EMPLOYEE
            },
            EE_BIRTHDAY : {
                code : 'EE_BIRTHDAY',
                message : i18n.gettext('{0} has a birthday on {1}'),
                redirectTo : criterion.consts.Route.HR.EMPLOYEE
            },
            EE_ANNIVERSARY : {
                code : 'EE_ANNIVERSARY',
                message : i18n.gettext('{0} has a work anniversary on {1}'),
                redirectTo : criterion.consts.Route.HR.EMPLOYEE
            },
            PERFORMANCE_REVIEW_DEADLINE : {
                code : 'PERFORMANCE_REVIEW_DEADLINE',
                message : i18n.gettext('{0} deadline on {1}')
            },
            COMPENSATION_CLAIM_FILLED : {
                code : 'COMPENSATION_CLAIM_FILLED',
                message : i18n.gettext('{0} filed a worker\'s compensation claim on {1}'),
                redirectTo : criterion.consts.Route.HR.EMPLOYEE
            },
            NEW_JOB_OPENING_POSTED : {
                code : 'NEW_JOB_OPENING_POSTED',
                message : i18n.gettext('Job {0} posted on {1}'),
                redirectTo : criterion.consts.Route.RECRUITING.JOBS
            },
            COMPANY_HOLIDAY : {
                code : 'COMPANY_HOLIDAY',
                message : i18n.gettext('{0} holiday on {1}'),
                redirectTo : criterion.consts.Route.HR.MAIN + '/settings/hr/holidays'
            },
            OPEN_ENROLLMENT_CLOSING : {
                code : 'OPEN_ENROLLMENT_CLOSING',
                message : i18n.gettext('{0} ends {1}'),
                redirectTo : criterion.consts.Route.HR.MAIN + '/settings/hr/openEnrollments'
            }
        },

        ZEN_DESC_SUGGESTION_STATUS : {
            planned : i18n.gettext('Planned'),
            not_planned : i18n.gettext('Not Planned'), // eslint-disable-line camelcase
            answered : i18n.gettext('Answered'),
            completed : i18n.gettext('Completed')
        },

        /**
         * UI constants (e.g date and time formats)
         */
        UI : {
            SHORT_DATE_FORMAT : 'm/d/Y'
        },

        /**
         * Field types
         */
        FIELD_TYPES : {
            SSN : 1,
            PHONES : 2
        },

        TERMINATE_REINSTATE_TYPES : {
            TERMINATE : 'terminate',
            REINSTATE : 'reinstate'
        },

        DEDUCTION_CALC_METHOD_CODES : {
            AMOUNT : '1',
            PERCENT_OF_GROSS : '2',
            AMOUNT_MATCH : '3',
            PERCENT_OF_GROSS_MATCH : '4',
            GARNISHMENT : '5',
            FORMULA : '6',
            CERTIFIED_RATE : '7',
            CERTIFIED_RATE_PERCENT : '8',
            CERTIFIED_RATE_AMOUNT : '9'
        },

        PAY_TYPE_CODES : {
            REGULAR : 'r',
            SUPPLEMENTAL : 's',
            REGULAR_AND_SUPPLEMENTAL : 'r+s',
            REIMBURSEMENT : 'rei',
            CUSTOM : 'c'
        },

        PERSON_CONTACT_TYPE_EMERGENCY_CONTACT_CODE : 'EMERG',

        CODETABLE_FIELDS_CONFIG : {
            attribute1Caption : {
                dataIndex : 'attribute1',
                columnType : 'gridcolumn',
                fieldType : 'textfield'
            },
            attribute2Caption : {
                dataIndex : 'attribute2',
                columnType : 'gridcolumn',
                fieldType : 'textfield'
            },
            attribute3Caption : {
                dataIndex : 'attribute3',
                columnType : 'gridcolumn',
                fieldType : 'textfield'
            },
            attribute4Caption : {
                dataIndex : 'attribute4',
                columnType : 'gridcolumn',
                fieldType : 'textfield'
            },
            attribute5Caption : {
                dataIndex : 'attribute5',
                columnType : 'gridcolumn',
                fieldType : 'textfield'
            }
        },

        REPORT_FILTER_TYPE : {
            FILTER_STRING : 'string',
            FILTER_TIMESTAMP : 'zoneddatetime',
            FILTER_DATE_TIME : 'localdatetime',
            FILTER_LOCAL_DATE : 'localdate',
            FILTER_DATE : 'date',
            FILTER_TIME : 'time',
            FILTER_CD : 'cd',
            FILTER_BOOLEAN : 'boolean',
            FILTER_DOUBLE : 'double',
            FILTER_INTEGER : 'integer'
        },

        FILLABLE_FORM_FIELD_TYPE : {
            FIELD_TYPE_TEXT : 'FIELD_TYPE_TEXT',
            FIELD_TYPE_COMBO : 'FIELD_TYPE_COMBO',
            FIELD_TYPE_LIST : 'FIELD_TYPE_LIST',
            FIELD_TYPE_SIGNATURE : 'FIELD_TYPE_SIGNATURE',
            FIELD_TYPE_CHECKBOX : 'FIELD_TYPE_CHECKBOX',
            FIELD_TYPE_RADIOBUTTON : 'FIELD_TYPE_RADIOBUTTON',
            FIELD_TYPE_COMB_TEXT : 'FIELD_TYPE_COMB_TEXT',
            FIELD_TYPE_MULTILINE_TEXT : 'FIELD_TYPE_MULTILINE_TEXT'
        },

        /**
         * @var criterion.Consts.DATA_TYPE
         */
        DATA_TYPE : {
            TEXT : 'TEXT',
            STRING : 'STRING',
            NUMBER : 'NUMBER',
            DATE : 'DATE',
            CHECKBOX : 'CHECKBOX',
            DROPDOWN : 'DROPDOWN',
            MEMO : 'MEMO',
            CURRENCY : 'CURRENCY',
            INTEGER : 'INTEGER'
        },

        INCOME_CALC_METHOD : {
            AMOUNT : '1',
            HOURLY : '2',
            SALARY : '3',
            UNIT : '4',
            FTE : '5',
            FORMULA : '6'
        },

        USER_PHOTO_SIZE : {
            MIN_WIDTH : 90,
            MIN_HEIGHT : 90,
            MAX_FILE_SIZE_MB : 5,

            TOOLBAR_ICON_WIDTH : 32,
            TOOLBAR_ICON_HEIGHT : 32,

            ORG_CHART_ICON_WIDTH : 78,
            ORG_CHART_ICON_HEIGHT : 78,

            COMMUNITY_ICON_WIDTH : 42,
            COMMUNITY_ICON_HEIGHT : 42,

            PERFORMANCE_REVIEW_ICON_WIDTH : 35,
            PERFORMANCE_REVIEW_ICON_HEIGHT : 35
        },

        REPORT_SETTINGS_LOGO_SIZE : {
            MIN_WIDTH : 100,
            MIN_HEIGHT : 40,
            MAX_FILE_SIZE_MB : 5
        },

        FEED_IMAGE_SIZE : {
            MAX_WIDTH : 1280,
            MAX_HEIGHT : 1024,
            MAX_FILE_SIZE_MB : 5
        },

        ATTACHMENTS_CONFIG : {
            BYTES_IN_MB : 1048576,
            MAX_FILE_SIZE_MB : 10,
            MODE_PERSON : 'person',
            MODE_ADMIN : 'admin',

            SHARE_FLAG_YES : 'yes',
            SHARE_FLAG_NO : 'no'
        },

        WORKFLOW_STATUSES : {
            NOT_SUBMITTED : 'NOT_SUBMITTED',
            REJECTED : 'REJECTED',
            APPROVED : 'APPROVED',
            PENDING_APPROVAL : 'PENDING_APPROVAL',
            VERIFIED : 'VERIFIED',
            SAVED : 'SAVED',
            ESCALATION : 'ESCALATION'
        },

        PAYMENT_TYPE : {
            PAID_BY_CHECK : 'PAID_BY_CHECK',
            PAID_BY_ACH : 'PAID_BY_ACH'
        },

        BATCH_STATUSES : {
            PENDING_APPROVAL : 'PENDING_APPROVAL',
            TO_BE_PAID : 'TO_BE_PAID',
            PAID : 'PAID',
            COMPLETE : 'COMPLETE',
            REVERSAL : 'REVERSAL',
            REVERSAL_COMPLETE : 'REVERSAL_COMPLETE'
        },

        BATCH_AGGREGATED_STATUSES : {
            COMPLETED : 'COMPLETED',
            OPEN : 'OPEN'
        },

        REVIEW_TYPE_STATUSES : {
            SELF : 'SELF',
            PEER : 'PEER',
            DIRECT_REPORTS : 'DIRECT_REPORTS',
            MANAGER : 'MANAGER'
        },

        REVIEW_SCALE_RATING : {
            NOT_APPLICABLE : 0,
            LOWEST : 1
        },

        WORKFLOW_ACTOR : {
            INITIATOR : 'INITIATOR',
            ORG_TYPE : 'ORG_TYPE',
            POSITION : 'POSITION',
            EMPLOYEE : 'EMPLOYEE',
            POS_STRUCT1 : 'POS_STRUCT1',
            POS_STRUCT2 : 'POS_STRUCT2'
        },

        ACCRUAL_METHOD_TYPE_CODE : {
            FISCAL : 'FISCAL',
            ANNIV : 'ANNIV',
            NA : 'NA'
        },

        ACCRUAL_PERIOD_CODE : {
            MONTHLY : 'M',
            WEEKLY : 'W',
            BI_WEEKLY : 'B',
            SEMI_MONTHLY : 'S',
            QUARTERLY : 'Q',
            ANNUAL : 'A'
        },

        PRORATE_FIRST_PERIOD_TYPE : [
            {
                value : 0,
                text : i18n.gettext('Full Accrual')
            },
            {
                value : 1,
                text : i18n.gettext('Prorated Accrual')
            },
            {
                value : 2,
                text : i18n.gettext('No Accrual')
            }
        ],

        PERIOD_TYPE : {
            CALENDAR : 'CALENDAR',
            FISCAL : 'FISCAL',
            PERIOD_FORWARD : 'PERIOD_FORWARD',
            PERIOD_BACKWARD : 'PERIOD_BACKWARD'
        },

        WORKFLOW_TYPE_CODE : {
            TIME_OFF : 'TIME_OFF', // Time Off Request
            PERSON_ADDRESS : 'PERSON_ADDRESS', // Address Change
            PERSON : 'PERSON', // Demographic Change
            TIMESHEET : 'TIMESHEET', // Timesheet Submission
            EMPLOYEE_TAX : 'EMPLOYEE_TAX', // Employee Tax
            EMPLOYEE_OPEN_ENROLLMENT : 'EMPLOYEE_OPEN_ENROLLMENT', // Open Enrollment
            FORM : 'EMPLOYEE_DOCUMENT', // Form (BE leave old value in code)
            EMPLOYEE_REVIEW : 'EMPLOYEE_REVIEW', // Performance Review
            EMPLOYEE_GOAL : 'EMPLOYEE_GOAL', // Employee goal
            PERSON_BANK_ACCOUNT : 'PERSON_BANK_ACCOUNT', // Person Bank Account
            RELATIONSHIP : 'RELATIONSHIP', // Reporting Relationship
            EMPLOYEE_TERM : 'EMPLOYEE_TERM', // Employee Termination
            ASSIGNMENT : 'ASSIGNMENT', // Assignment
            DEPENDENTS_CONTACTS : 'DEPCONTACT', // Dependents and Contacts
            POSITION : 'POSITION', // Position
            EE_BENEFIT : 'EE_BENEFIT', // Employee Benefit
            EMPLOYEE_ONBOARDING : 'EMPLOYEE_ONBOARDING', // Employee Onboarding
            PERSON_EDUCATION : 'PERSON_EDUCATION', // Person Education
            PERSON_CERTIFICATION : 'PERSON_CERTIFICATION', // Person Certification
            PERSON_SKILL : 'PERSON_SKILL' // Person Skills
        },

        WORKFLOW_REQUEST_TYPE : {
            CREATE : 'create',
            UPDATE : 'update',
            SUBMIT : 'submit',
            DELETE : 'delete',
            CANCEL : 'cancel',
            RECALL : 'recall',
            EMPLOYEE_HIRE : 'employee_hire'
        },

        QUESTION_TYPE_CODE : {
            TEXT : 'TEXT',
            TEXTAREA : 'TEXTAREA',
            SELECT : 'SELECT',
            MULTISELECT : 'MULTISELECT',
            DATE : 'DATE',
            FILE_ATTACHMENT : 'FILE_ATTACHMENT',
            SUB_QUESTION_SET : 'SUB_QUESTION_SET'
        },

        CANDIDATE_STATUS : {
            NEW_APPLICANT : 'NEW_APPLICANT',
            CONTACTED : 'CONTACTED',
            REJECTED : 'REJECTED',
            OFFERED : 'OFFERED',
            HIRED : 'HIRED',
            INTERVIEWING : 'INTERVIEWING'
        },

        INTERVIEW_DURATIONS : [
            {
                minutes : 15,
                text : i18n.gettext('15 minutes')
            },
            {
                minutes : 30,
                text : i18n.gettext('30 minutes')
            },
            {
                minutes : 60,
                text : i18n.gettext('1 hour')
            },
            {
                minutes : 120,
                text : i18n.gettext('2 hour')
            }
        ],

        GL_ACCOUNT_TYPE : {
            INCOME : 'INCOME',
            DEDUCTION_EE : 'DEDUCTION_EE',
            DEDUCTION_ER : 'DEDUCTION_ER',
            TAX_EE : 'TAX_EE',
            TAX_ER : 'TAX_ER',
            TIME_OFF : 'TIME_OFF',
            NET_PAY : 'NET_PAY',
            ROUNDING : 'ROUNDING',
            SUSPENSE_ACCOUNT : 'SUSPENSE_ACCOUNT'
        },

        WF_STRUCTURE : {
            WF1 : 'WF1',
            WF2 : 'WF2'
        },

        CONTRIBUTION_TYPE : {
            EE : 'EE',
            ER : 'ER',
            EEER : 'EEER'
        },

        PAY_FREQUENCY_CODE : {
            MONTHLY : 'M',
            WEEKLY : 'W',
            BI_WEEKLY : 'B',
            SEMI_MONTHLY : 'S',
            QUARTERLY : 'Q',
            ANNUAL : 'A',
            CUSTOM : 'C'
        },

        PAY_CODE : {
            INCOME : 1,
            TIME_OFF : 2,
            HOLIDAY : 3,
            BREAK : 4
        },

        DAYS_OF_WEEK : {
            Sunday : 1,
            Monday : 2,
            Tuesday : 3,
            Wednesday : 4,
            Thursday : 5,
            Friday : 6,
            Saturday : 7
        },

        DAYS_OF_WEEK_ARRAY : [
            i18n.gettext('Sunday'),
            i18n.gettext('Monday'),
            i18n.gettext('Tuesday'),
            i18n.gettext('Wednesday'),
            i18n.gettext('Thursday'),
            i18n.gettext('Friday'),
            i18n.gettext('Saturday')
        ],

        MONTHS_ARRAY : [
            i18n.gettext('January'),
            i18n.gettext('February'),
            i18n.gettext('March'),
            i18n.gettext('April'),
            i18n.gettext('May'),
            i18n.gettext('June'),
            i18n.gettext('July'),
            i18n.gettext('August'),
            i18n.gettext('September'),
            i18n.gettext('October'),
            i18n.gettext('November'),
            i18n.gettext('December')
        ],

        MONTHS_SHORT_NUMBERS : {
            Jan : 0,
            Feb : 1,
            Mar : 2,
            Apr : 3,
            May : 4,
            Jun : 5,
            Jul : 6,
            Aug : 7,
            Sep : 8,
            Oct : 9,
            Nov : 10,
            Dec : 11
        },

        DOCUMENT_FILE_TYPE : {
            DOCUMENT : 1,
            COMPANY_FORM : 2
        },

        DOCUMENT_LOCATION_TYPE : {
            COMPANY_DOCUMENT : -100,
            COMPANY_FORM : -200
        },

        EMPLOYER_DOCUMENT_ACCESS_TYPE : {
            FULL : {
                value : 0,
                glyph : 'ios7-person-outline',
                tooltip : i18n.gettext('Non-restricted')
            },
            PARTIAL : {
                value : 1,
                glyph : 'ios7-unlocked-outline',
                tooltip : i18n.gettext('Restricted')
            },
            DENIED : {
                value : 2,
                glyph : 'ios7-locked-outline',
                tooltip : i18n.gettext('Restricted to all')
            }
        },

        DOCUMENT_RECORD_TYPE_CODE : {
            COVER : 'COVER',
            RESUME : 'RESUME',
            CANDIDATE_RESUME : 'CANDIDATE_RESUME',
            CANDIDATE_COVER_LETTER : 'CANDIDATE_COVER_LETTER',
            COURSE_REVIEW : 'COURSE_REVIEW'
        },

        RESUME_PARSE_STATUSES : {
            NOT_STARTED : -1,
            IN_PROGRESS : 1,
            DONE : 2
        },

        DOCUMENT_LOCATION_TYPE_CODE : {
            ONBOARDING : 'ONBOARDING'
        },

        JOB_COURSE_TYPE : {
            COURSE : '1',
            LEARNING_PATH : '2'
        },

        COURSE_CONTENT_TYPE : {
            AICC : 'AICC',
            SCORM : 'SCORM',
            FILE : 'FILE',
            URL : 'URL'
        },

        FIELD_FORMAT_TYPE : {
            SSN : 1,
            ZIP : 2
        },

        FIELD_FORMAT_TYPE_DEFINITIONS : {
            '#' : '[0-9]',
            '9' : '[0-9]',
            'a' : '[A-Za-z]',
            'A' : '[A-Z]',
            '*' : '[A-Za-z0-9]'
        },

        SUPPL_METH : {
            REGULAR_AND_SUPPLEMENTAL : 0,
            REGULAR : 1,
            SUPPLEMENTAL : 2
        },

        TIMESHEET_LAYOUT_ENTRY_TYPE : {
            MANUAL : 0,
            BUTTON : 1,
            MANUAL_AND_BUTTON : 2,
            MANUAL_DAY : 3
        },

        SEPARATORS : [' ', ',', '.', "'"],

        PAYCODE : {
            INCOME : 1,
            TIME_OFF : 2,
            HOLIDAY : 3,
            BREAK : 4
        },

        TIMESHEET_FORMAT : {
            HORIZONTAL : 'HORIZ',
            VERTICAL : 'VERT',
            AGGREGATE : 'AGGR'
        },

        EMAIL_LAYOUT_CODE : {
            RECRUITING_REJECTION : 'RECRUITING_REJECTION',
            RECRUITING_APPOINTMENT : 'RECRUITING_APPOINTMENT',
            RECRUITING_MASS_REJECTION : 'RECRUITING_MASS_REJECTION'
        },

        MAX_COUNT_CANDIDATES_FOR_MASS_REJECTION : 100,

        DATA_IMPORT_ACTIONS : {
            IMPORT : 0,
            VALIDATE : 1
        },

        DATA_IMPORT_MODULES : {
            SYSTEM : 0,
            CORE : 1,
            BENEFITS : 2,
            TIME_AND_ATTENDANCE : 3,
            LEARNING_MANAGEMENT : 6,
            PAYROLL : 5,
            RECRUITING : 7,
            GENERAL : 9
        },

        INCOME_EXCLUSION_TYPES : {
            SALARY : 1,
            EXEMPT : 2
        },

        WEBFORM_DATA_TYPE : {
            TEXT_BLOCK : 'TEXT_BLOCK',
            IMAGE : 'IMAGE',
            TEXT : 'TEXT',
            NUMBER : 'NUMBER',
            DATE : 'DATE',
            CHECKBOX : 'CHECKBOX',
            DROPDOWN : 'DROPDOWN',
            MEMO : 'MEMO',
            RADIO : 'RADIO',
            SIG : 'SIG',
            EMAIL : 'EMAIL',
            ATTACH : 'ATTACH',
            SHAPE : 'SHAPE'
        },

        WEBFORM_DATA_SIZES : {
            TEXT_BLOCK : {
                width : 120,
                height : 48
            },
            IMAGE : {
                width : 120,
                height : 120
            },
            TEXT : {
                width : 222,
                height : 38
            },
            NUMBER : {
                width : 222,
                height : 38
            },
            DATE : {
                width : 222,
                height : 38
            },
            CHECKBOX : {
                width : 15,
                height : 15
            },
            DROPDOWN : {
                width : 222,
                height : 38
            },
            MEMO : {
                width : 222,
                height : 64
            },
            RADIO : {
                width : 15,
                height : 15
            },
            SIG : {
                width : 200,
                height : 200
            },
            EMAIL : {
                width : 222,
                height : 38
            },
            ATTACH : {
                width : 222,
                height : 48
            },
            SHAPE : {
                width : 1,
                height : 1
            }
        },

        WEBFORM_DPI : {
            DESKTOP : 72,
            PRINT : 150
        },

        WEBFORM_FIELD_STYLE : {
            MIN_FONT_SIZE : 6,
            MIN_FIELD_HEIGHT : '10px',
            ADDED_LINE_HEIGHT : 2
        },

        JOB_LISTING_FORMATS : {
            BY_DEPARTMENT : 1,
            BY_WORK_LOCATION : 2,
            BY_DEPARTMENT_WORK_LOCATION : 3,
            BY_WORK_LOCATION_DEPARTMENT : 4,
            GRID : 5
        },

        REPORT_TYPE : {
            REPORT : 'REPORT',
            CHECK_LAYOUT : 'CHECK_LAYOUT'
        },

        REPORT_FORMAT : {
            DEFAULT : 'pdf',
            INLINE_DISPLAY : 'inline=true',
            INLINE_FORMATS : ['pdf', 'html']
        },

        TRANSFER_TYPE : {
            DATA_TRANSFER : 'DATA_TRANSFER',
            ACH : 'ACH',
            BUTTON : 'BUTTON',
            GL : 'GL',
            NOT_USED : 'NOT_USED'
        },

        DEFAULT_TRANSFER_NAME : i18n.gettext('Standard GL'),

        DEPOSIT_TYPE : {
            AMOUNT : 'AMOUNT',
            PERCENT : 'PERCENT',
            BALANCE : 'BALANCE'
        },

        GL_INTERFACE_EXPORT_TYPE : {
            INTACCTAPI : 'INTACCTAPI',
            ACUMATICA : 'ACUMATICA',
            FILE : 'FILE'
        },

        GL_INTERFACE_EXPORT_TYPE_FILE_ID : -1,
        PAYROLL_SETTINGS_TYPE_CRITERION_ID : -1,

        GL_RESPONSE_FORMAT : {
            XML : 1,
            JSON : 2,
            CSV : 3
        },

        DEPOSIT_ORDER : {
            MIN : 1,
            MAX : 1000
        },

        RECURRENCE_TYPES : {
            ONE_TIME : 'ONE_TIME',
            DAILY : 'DAILY',
            WEEKLY : 'WEEKLY',
            BI_WEEKLY : 'BI_WEEKLY',
            MONTHLY : 'MONTHLY',
            YEARLY : 'YEARLY',
            INTERVAL : 'INTERVAL'
        },

        TASK_SCHEDULE_LAST_RUN_STATUS : {
            SUCCESS : 0,
            SYSTEM_ERROR : 1,
            VALIDATION_ERROR : 2
        },

        TASK_FILTER_TYPES : {
            TASK : 'task',
            GROUP : 'group',
            PROJECT : 'project'
        },

        MONTH_PATTERN_TYPE : {
            DAY : {
                value : 5,
                text : i18n.gettext('Day')
            },
            FIRST : {
                value : 1,
                text : i18n.gettext('First')
            },
            SECOND : {
                value : 2,
                text : i18n.gettext('Second')
            },
            THIRD : {
                value : 3,
                text : i18n.gettext('Third')
            },
            FOURTH : {
                value : 4,
                text : i18n.gettext('Fourth')
            },
            LAST : {
                value : 6,
                text : i18n.gettext('Last')
            }
        },

        SCHEDULE_TASK_TYPE : {
            REPORT : {
                value : 1,
                text : i18n.gettext('Report')
            },
            TRANSFER : {
                value : 2,
                text : i18n.gettext('Transfer')
            },
            SYSTEM : {
                value : 3,
                text : i18n.gettext('System')
            },
            APP : {
                value : 5,
                text : i18n.gettext('App')
            }
        },

        SCHEDULE_TASK_RECIPIENT_TYPES : {
            EMPLOYEE_GROUP : {
                value : 1,
                text : i18n.gettext('Employee Group')
            },
            EMPLOYEE_LIST : {
                value : 2,
                text : i18n.gettext('Employee List')
            },
            EMAIL_LIST : {
                value : 3,
                text : i18n.gettext('Email List')
            },
            SFTP : {
                value : 4,
                text : i18n.gettext('SFTP')
            },
            ORG_LIST : {
                value : 5,
                text : i18n.gettext('Org Structure List')
            }
        },

        WORKFLOW_AUTO_ACTION_TYPE : {
            APPROVE : {
                value : 1,
                text : i18n.gettext('Approve')
            },
            REJECT : {
                value : 2,
                text : i18n.gettext('Reject')
            }
        },

        COURSE_ENROLLMENT_TYPE : {
            OPEN : {
                value : 1,
                text : i18n.gettext('Open')
            },
            RESTRICTED : {
                value : 2,
                text : i18n.gettext('Restricted')
            }
        },

        COURSE_TYPE : {
            CLASSROOM : 1,
            ON_DEMAND : 2
        },

        SYSTEM_LEVEL_TASKS : {
            TIME_OFF_PLAN_ACCRUALS : 'TIME_OFF_PLAN_ACCRUALS',
            EMPLOYEE_COURSE_SCHEDULER : 'EMPLOYEE_COURSE_SCHEDULER',
            TIMESHEET_ALERTS : 'TIMESHEET_ALERTS',
            BENEFIT_PLAN_CALCULATION : 'BENEFIT_PLAN_CALCULATION'
        },

        TAX_FILING_TYPES : {
            PERIOD : 'period',
            QUARTER : 'quarter',
            ANNUAL : 'annual',
            T4 : 'T4'
        },

        T4_FILE_TYPES : {
            XML : {
                value : 'XML',
                text : i18n.gettext('Electronic')
            },
            PDF_SINGLE : {
                value : 'PDF_S',
                text : i18n.gettext('PDF Consolidated')
            },
            PDF_MULTIPLE : {
                value : 'PDF_M',
                text : i18n.gettext('PDF Individual Files')
            }
        },

        TAX_NUMBERS : {
            CANADIAN : {
                FEDERAL : 478,
                PROVINCIAL : 500
            },
            US : {
                FEDERAL_WH : 400
            }
        },

        TE_FILING_STATUSES : {
            SINGLE : 1,
            MARRIED : 2,

            // after 01/01/2020
            SINGLE_OR_MARRIED_FILING_SEPARATELY : 62,
            MARRIED_FILING_JOINTLY : 16,
            HEAD_OF_HOUSEHOLD : 3
        },

        TAX_ENGINE_CODE : {
            US_CANADA_TE : 'US_CANADA_TE',
            UK_TE : 'UK_TE',
            INTRNL_TE : 'INTRNL_TE'
        },

        TAX_CALC_METHOD_CODE : {
            ANNUALIZED : '0'
            // .. others not needed in UI
        },

        TRANSMISSION_FILE_TYPES : {
            CERIDIAN_XML_PERIOD : 'CERIDIAN_XML_PERIOD',
            CERIDIAN_XML_QUARTER : 'CERIDIAN_XML_QUARTER',
            CERIDIAN_XML_YEAR : 'CERIDIAN_XML_YEAR'
        },

        PTSC : {
            CLIENT : '0',
            CERIDIAN : '1',
            CANADIAN_CLIENT : '2'
        },

        PAYMENT_PROCESS_ACTIONS : {
            PRINT_CHECKS : 'print_checks',
            GENERATE_ACH : 'generate_ach',
            GENERATE_CERIDIAN_CHECK : 'generate_ceridian_check',
            TRANSMIT_TO_PTSC : 'transmit_to_ptsc',
            CHANGE_PAYMENT_TYPE : 'change_payment_type',
            VOID_PAYMENT : 'void_payment',
            REVERSE : 'reverse',

            COMPLETE_BATCH : 'complete_batch',
            CANCEL : 'cancel'
        },

        ASSIGNMENT_ACTIONS_FLAGS : {
            T : 'T', // Terminations, ..
            P : 'P'
        },

        COST_VISIBILITY : {
            HIDE : 'HIDE',
            EMPLOYEE : 'EMPLOYEE',
            EMPLOYEE_AND_EMPLOYER : 'EMPLOYEE_AND_EMPLOYER'
        },

        REVIEW_PERIOD_FREQUENCY : {
            CUSTOM : 'CUSTOM',
            RECURRING : 'RECURRING'
        },

        COURSE_DELIVERY : {
            ONDEMAND : 'ON-DEMAND',
            CLASSROOM : 'CLASSROOM'
        },

        COURSE_COMPLETE_STATUS : {
            REGISTERED : 'REGISTERED',
            CANCELLED : 'CANCELLED',
            NOSHOW : 'NOSHOW',
            COMPLETED : 'COMPLETED',
            INCOMPLETE : 'INCOMPLETE',
            WAITLIST : 'WAITLIST',
            PAST_DUE : 'PAST_DUE'
        },

        ONBOARDING_TASK_TYPES : {
            FORM : 'FORM',
            DOCUMENT : 'DOCUMENT',
            VIDEO : 'VIDEO',
            DEMOGRAPHICS_REVIEW : 'DEMOGRAPHICS_REVIEW',
            ADDRESS_REVIEW : 'ADDRESS_REVIEW',
            DEPENDENTS_AND_CONTACTS : 'DEPENDENTS_AND_CONTACTS',
            TAX_WITHHOLDING : 'TAX_WITHHOLDING',
            BANK_ACCOUNTS : 'BANK_ACCOUNTS',
            OPEN_ENROLLMENT : 'OPEN_ENROLLMENT',
            USER_TASK : 'USER_TASK',
            SYSTEM_TASK : 'SYSTEM_TASK',
            COURSE : 'COURSE'
        },

        ONBOARDING_SYSTEM_TASK_LINKS : {
            DEMOGRAPHICS_REVIEW : criterion.consts.Route.SELF_SERVICE.PERSONAL_INFORMATION_BASIC_DEMOGRAPHICS,
            ADDRESS_REVIEW : criterion.consts.Route.SELF_SERVICE.PERSONAL_INFORMATION_ADDRESS,
            DEPENDENTS_AND_CONTACTS : criterion.consts.Route.SELF_SERVICE.PERSONAL_INFORMATION_DEPENDENTS_AND_CONTACTS,
            TAX_WITHHOLDING : criterion.consts.Route.SELF_SERVICE.PAYROLL_TAXES,
            BANK_ACCOUNTS : criterion.consts.Route.SELF_SERVICE.PAYROLL_BANK_ACCOUNTS,
            OPEN_ENROLLMENT : criterion.consts.Route.SELF_SERVICE.BENEFITS_OPEN_ENROLLMENTS,
            COURSE : criterion.consts.Route.SELF_SERVICE.LEARNING_ACTIVE
        },

        COURSE_CLASS_ACTIONS : {
            SET_COMPLETE_STATUS : 1,
            SET_SUCCESS_STATUS : 2,
            SET_SCORE : 3,
            SET_WITHDRAW : 4
        },

        LEARINING_MY_TEAM_SEARCH_TYPE : {
            PAST_DUE : 1,
            UP_COMING : 2,
            BY_COURSE : 3,
            BY_EMPLOYEE : 4,
            BY_CLASS : 5
        },

        DATA_GRID_TYPES : {
            MODULES : 1,
            TABLES : 2,
            FORMS : 3,
            SQL : 4
        },

        REPORT_FILE_TYPES : {
            PDF : 'pdf',
            CSV : 'csv',
            EXCEL : 'excel'
        },

        REPORT_GENERATION_STATUS_CODES : {
            COMPLETED : 'COMPLETED',
            FAILED : 'FAILED',
            IN_PROGRESS : 'IN_PROGRESS',
            QUEUED : 'QUEUED'
        },

        DATA_GRID_SORT_TYPES : {
            ASC : 'asc',
            DESC : 'desc'
        },

        DATA_GRID_FIELD_TYPE : {
            STRING : 'string',
            TIME : 'time',
            DATE : 'date',
            BOOLEAN : 'boolean',
            DOUBLE : 'double',
            INTEGER : 'integer',
            BLOB : 'blob'
        },

        DATA_GRID_JOIN_TYPES : {
            INNER : 'inner',
            LEFT : 'left',
            RIGHT : 'right'
        },

        DATA_GRID_CRITERIA_TYPES() {
            const DGFT = this.DATA_GRID_FIELD_TYPE;

            return [
                {
                    operator : '<',
                    text : '<',
                    types : [
                        DGFT.DOUBLE,
                        DGFT.INTEGER,
                        DGFT.DATE,
                        DGFT.TIME
                    ]
                },
                {
                    operator : '<=',
                    text : '<=',
                    types : [
                        DGFT.DOUBLE,
                        DGFT.INTEGER,
                        DGFT.DATE,
                        DGFT.TIME
                    ]
                },
                {
                    operator : '=',
                    text : '=',
                    types : [
                        DGFT.DOUBLE,
                        DGFT.INTEGER,
                        DGFT.DATE,
                        DGFT.TIME,
                        DGFT.STRING
                    ]
                },
                {
                    operator : '>=',
                    text : '>=',
                    types : [
                        DGFT.DOUBLE,
                        DGFT.INTEGER,
                        DGFT.DATE,
                        DGFT.TIME
                    ]
                },
                {
                    operator : '>',
                    text : '>',
                    types : [
                        DGFT.DOUBLE,
                        DGFT.INTEGER,
                        DGFT.DATE,
                        DGFT.TIME
                    ]
                },
                {
                    operator : '!=',
                    text : '!=',
                    types : [
                        DGFT.DOUBLE,
                        DGFT.INTEGER,
                        DGFT.DATE,
                        DGFT.TIME,
                        DGFT.STRING
                    ]
                },
                {
                    operator : 'is null',
                    text : 'is NULL',
                    types : [
                        DGFT.DOUBLE,
                        DGFT.INTEGER,
                        DGFT.DATE,
                        DGFT.TIME,
                        DGFT.STRING,
                        DGFT.BOOLEAN,
                        DGFT.BLOB
                    ],
                    special : true
                },
                {
                    operator : 'is not null',
                    text : 'is not NULL',
                    types : [
                        DGFT.DOUBLE,
                        DGFT.INTEGER,
                        DGFT.DATE,
                        DGFT.TIME,
                        DGFT.STRING,
                        DGFT.BOOLEAN,
                        DGFT.BLOB
                    ],
                    special : true
                },
                {
                    operator : 'contains',
                    text : 'contains',
                    types : [
                        DGFT.STRING
                    ]
                },
                {
                    operator : 'is true',
                    text : 'is TRUE',
                    types : [
                        DGFT.BOOLEAN
                    ],
                    special : true
                },
                {
                    operator : 'is false',
                    text : 'is FALSE',
                    types : [
                        DGFT.BOOLEAN
                    ],
                    special : true
                }
            ]
        },

        DATA_GRID_LIMITS : {
            FORM_MAX_FIELDS_AMOUNT : 11
        },

        APP_INVOCATION_TYPES : {
            DATA_CHANGE : 1,
            SCHEDULER : 2,
            ON_CALL : 3,
            BUTTON : 4
        },

        APP_BUTTON_TYPES : {
            GL_EXPORT : 1,
            TIMESHEET_SYNC : 9,
            PAYROLL_IMPORT : 10
        },

        PAYROLL_IMPORT_CRITERION_APP_ID : -1,

        ESS_WIDGETS : [
            {
                id : 'myTasks',
                title : i18n.gettext('My Tasks'),
                enabledValue : 1
            },
            {
                id : 'myTimeOffs',
                title : i18n.gettext('My Time Offs'),
                enabledValue : 2
            },
            {
                id : 'links',
                title : i18n.gettext('External Links'),
                enabledValue : 4
            },
            {
                id : 'infoBox',
                title : i18n.gettext('Info Box'),
                enabledValue : 8
            },
            {
                id : 'feed',
                title : i18n.gettext('Feed'),
                enabledValue : 16
            },
            {
                id : 'attendance',
                title : i18n.gettext('Attendance'),
                enabledValue : 32
            },
            {
                id : 'upcomingTimeOff',
                title : i18n.gettext('Upcoming Time Off'),
                enabledValue : 64
            },
            {
                id : 'myPay',
                title : i18n.gettext('My Pay'),
                enabledValue : 128
            },
            {
                id : 'events',
                title : i18n.gettext('Events'),
                enabledValue : 256
            }
        ],

        ATTENDANCE_DASHBOARD_MODE : {
            OVERTIME : 'overtime',
            VARIANCE : 'variance'
        },

        ANONYMOUS_LEVEL : {
            NOT_ANONYMOUS : {
                value : 0,
                text : i18n.gettext('not anonymous')
            },
            EMPLOYEE : {
                value : 1,
                text : i18n.gettext('Employee')
            },
            MANAGER : {
                value : 2,
                text : i18n.gettext('Manager')
            },
            ADMIN : {
                value : 3,
                text : i18n.gettext('Admin')
            }
        },

        CERTIFIED_RATE_DETAIL_TYPE : {
            BASE : {
                value : 0,
                text : i18n.gettext('Base')
            },
            INCOME : {
                value : 1,
                text : i18n.gettext('Income')
            },
            DEDUCTION : {
                value : 2,
                text : i18n.gettext('Deduction')
            }
        },

        DATA_PACKAGE_PAYROLL_IMPORT : {
            US : {
                text : i18n.gettext('US'),
                value : 'US'
            },
            CANADA : {
                text : i18n.gettext('Canada'),
                value : 'CANADA'
            }
        },

        TIMESHEET_OPTION_PERIOD : {
            DATE_RANGE : {
                value : 1,
                text : i18n.gettext('Date Range')
            },
            PAY_PERIOD : {
                value : 2,
                text : i18n.gettext('Pay Period')
            },
            THIS_MONTH : {
                value : 3,
                text : i18n.gettext('This Month')
            },
            THIS_QUARTER : {
                value : 4,
                text : i18n.gettext('This Quarter')
            },
            THIS_YEAR : {
                value : 5,
                text : i18n.gettext('This Year')
            },
            LAST_MONTH : {
                value : 6,
                text : i18n.gettext('Last Month')
            },
            LAST_QUARTER : {
                value : 7,
                text : i18n.gettext('Last Quarter')
            },
            LAST_YEAR : {
                value : 8,
                text : i18n.gettext('Last Year')
            }
        },

        TEAM_TIMESHEET_VIEW_TYPE : {
            LIST : {
                value : 1,
                text : i18n.gettext('List')
            },
            GRID : {
                value : 2,
                text : i18n.gettext('Grid')
            }
        },

        TEAM_TIMESHEET_ACTIONS : {
            TEAM_PUNCH : {
                text : i18n.gettext('Team Punch'),
                action : 'team_punch',
                hideWhenAggregated : true
            },
            IMPORT : {
                text : i18n.gettext('Import'),
                action : 'import',
                hideWhenAggregated : false
            },
            DOWNLOAD : {
                text : i18n.gettext('Download'),
                action : 'download',
                hideWhenAggregated : false
            },
            MASS_SUBMIT : {
                text : i18n.gettext('Mass Submit'),
                action : 'mass_submit',
                list : 1,
                hideWhenAggregated : false
            }
        },

        TEAM_TIMESHEET_PUNCH_TYPE : {
            HOURS : {
                text : i18n.gettext('Hours'),
                value : 1,
                showWhenManual : true,
                showWhenManualDay : false,
                showWhenManualButton : true
            },
            IN : {
                text : i18n.gettext('In'),
                value : 2,
                showWhenManual : false,
                showWhenManualDay : false,
                showWhenManualButton : true
            },
            OUT : {
                text : i18n.gettext('Out'),
                value : 3,
                showWhenManual : false,
                showWhenManualDay : false,
                showWhenManualButton : true
            },
            DAYS : {
                text : i18n.gettext('Days'),
                value : 4,
                showWhenManual : false,
                showWhenManualDay : true,
                showWhenManualButton : false
            }
        },

        FORM_INTERNAL_TYPE : {
            WEB : 1,
            DATA : 2
        },

        PERSON_NAME_ABBREVS : [
            'L - ' + i18n.gettext('Lastname'),
            'F - ' + i18n.gettext('Firstname'),
            'M - ' + i18n.gettext('Middlename'),
            'N - ' + i18n.gettext('Nickname'),
            'L. - ' + i18n.gettext('First letter Lastname'),
            'F. - ' + i18n.gettext('First letter Firstname'),
            'M. - ' + i18n.gettext('First letter Middlename'),
            'N. - ' + i18n.gettext('First letter Nickname')
        ].join('<br>'),

        AGGREGATED_STAR_RATING_ROUNDING : 0.1,

        EXPIRATION_TYPES : {
            NEXT_DAY : {
                id : 1,
                text : i18n.gettext('Next 1 Day')
            },
            NEXT_WEEK : {
                id : 2,
                text : i18n.gettext('Next 1 Week')
            },
            DOES_NOT_EXPIRE : {
                id : 3,
                text : i18n.gettext('Does not expire')
            }
        },

        STATIC_TOKEN_TYPES : {
            SYSTEM : 1,
            USER : 2
        },

        STATIC_TOKEN_TYPES_DATA : [
            {
                id : 1,
                text : i18n.gettext('System')
            },
            {
                id : 2,
                text : i18n.gettext('User')
            }
        ],

        FIRST_RECONNECT_DELAY : 1000,
        RECONNECT_DELAY : 10000,
        RECONNECT_ATTEMPTS : 4,

        FIRST_WAITING_SERVICE_DELAY : 1000,
        WAITING_SERVICE_DELAY : 10000,

        CONTROL_DEFERRED_PROCESS_CHECK_INTERVALS : {
            DEFAULT : 2000,
            SANDBOX_SYNC : 15000, // https://criteriondev1.atlassian.net/wiki/spaces/SPEC/pages/441418058/Sandbox+Sync+Execution
            RESUME_PARSING_CHECK_STATUS : 3000
        },

        LOCALIZATION_LANGUAGE_EN : 'EN',

        ESS_COMMUNITY_POST_ITEM_SELECTOR : 'div.posting',

        SANDBOX_SYNC_STATUS : {
            NOT_SYNCHRONIZED : {
                value : 0,
                text : i18n.gettext('Not Synchronized')
            },
            IN_PROGRESS : {
                value : 1,
                text : i18n.gettext('In Progress')
            },
            SYNCHRONIZED : {
                value : 2,
                text : i18n.gettext('Synchronized')
            },
            FAILED : {
                value : 3,
                text : i18n.gettext('Failed')
            },
            UNKNOWN : {
                value : -1,
                text : i18n.gettext('Unknown')
            }
        },

        LOG_LEVEL : {
            OFF : {
                text : i18n.gettext('Off'),
                value : 'off'
            },
            TRACE : {
                text : i18n.gettext('Trace'),
                value : 'trace'
            },
            DEBUG : {
                text : i18n.gettext('Debug'),
                value : 'debug'
            },
            INFO : {
                text : i18n.gettext('Info'),
                value : 'info'
            },
            WARN : {
                text : i18n.gettext('Warn'),
                value : 'warn'
            },
            ERROR : {
                text : i18n.gettext('Error'),
                value : 'error'
            }
        },

        SHIFT_ASSIGNMENT_ACTION_TYPE : {
            CREATE_BLANK : {
                value : 0,
                text : i18n.gettext('Create Blank')
            },
            COPY_FROM : {
                value : 1,
                text : i18n.gettext('Copy From')
            },
            ROTATE : {
                value : 2,
                text : i18n.gettext('Rotate')
            }
        },

        SORT_CHECKS_BY : {
            EMPLOYEE_NAME : {
                id : 1,
                text : i18n.gettext('Employee Name')
            },
            EMPLOYEE_NUMBER : {
                id : 2,
                text : i18n.gettext('Employee Number')
            },
            WORK_LOCATION_EMPLOYEE_NAME : {
                id : 3,
                text : i18n.gettext('Work Location / Employee Name')
            }
        },

        RUNTIME_VALUES : {
            TEAM_TIMESHEET_OPTIONS : 'teamTimesheetOptions',
            TEAM_TIMESHEET_OPTIONS_DESCRIPTIONS : 'teamTimesheetOptionsDescriptions',
            TEAM_TIMESHEET_LIST : 'teamTimesheetList',
            TEAM_TIMESHEET_EMPLOYEE_NAME : 'teamTimesheetEmployeeName'
        }
    };

});
