Ext.define('criterion.view.ess.Main', function() {

    const ROUTES = criterion.consts.Route,
        SELF_SERVICE = ROUTES.SELF_SERVICE,
        SELF_SERVICE_PACKAGES = criterion.consts.Packages.SELF_SERVICE,
        ESS_KEYS = criterion.SecurityManager.ESS_KEYS;

    return {
        alias : 'widget.criterion_selfservice_main',

        extend : 'criterion.ux.Panel',

        requires : [
            'Ext.layout.container.Card',
            'criterion.controller.ess.Main',
            'criterion.vm.ess.Main',
            'criterion.view.moduleToolbar.MenuOwner',
            'criterion.view.ess.MenuSection',
            'criterion.view.moduleToolbar.Inbox',
            'criterion.view.moduleToolbar.Settings',
            'criterion.view.moduleToolbar.EssUser',

            'criterion.view.ess.ModuleToolbar',
            'criterion.view.ess.navigation.*',
            'criterion.view.ess.navigation.menu.Calendars',

            'criterion.consts.Packages',
            'criterion.ux.button.Split'
        ],

        controller : {
            type : 'criterion_selfservice_main'
        },

        viewModel : 'criterion_ess_main',

        header : false,

        cls : 'criterion-selfservice',

        dockedItems : [
            {
                dock : 'top',
                xtype : 'criterion_selfservice_module_toolbar'
            },
            {
                dock : 'left',
                xtype : 'criterion_ess_navigation_dynamic',
                responsiveConfig : criterion.Utils.createResponsiveConfig([
                    {
                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                        config : {
                            hidden : false
                        }
                    }
                ]),
                listeners : {
                    toggleStatic : 'showStaticMenu'
                }
            },
            {
                dock : 'left',
                xtype : 'criterion_ess_navigation_static',
                responsiveConfig : criterion.Utils.createResponsiveConfig([
                    {
                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                        config : {
                            hidden : true
                        }
                    }
                ]),
                listeners : {
                    toggleDynamic : 'showDynamicMenu'
                },
                hidden : true
            }
        ],

        border : false,
        bodyBorder : false,

        layout : {
            type : 'card',
            deferredRender : true
        },

        items : [
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.DASHBOARD.NAME,
                layout : 'fit',
                reference : 'dashboard',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.DASHBOARD.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.BENEFITS.NAME,
                layout : 'fit',
                reference : 'benefits',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.BENEFITS.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.TIME.NAME,
                layout : 'fit',
                reference : 'time',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.TIME.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.PAYROLL.NAME,
                layout : 'fit',
                reference : 'payroll',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.PAYROLL.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.RESOURCES.NAME,
                layout : 'fit',
                reference : 'resources',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.RESOURCES.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.CALENDAR.NAME,
                layout : 'fit',
                reference : 'calendar',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.CALENDAR.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.PERSONAL_INFORMATION.NAME,
                layout : 'fit',
                reference : 'personalInformation',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.PERSONAL_INFORMATION.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.RECRUITING.NAME,
                layout : 'fit',
                reference : 'recruiting',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.RECRUITING.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.PERFORMANCE.NAME,
                layout : 'fit',
                reference : 'performance',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.PERFORMANCE.BASE_COMPONENT,
                    reference : ''
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.LEARNING.NAME,
                layout : 'fit',
                reference : 'learning',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.LEARNING.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.PREFERENCES.NAME,
                layout : 'fit',
                reference : 'preferences',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.PREFERENCES.BASE_COMPONENT
                }
            },
            {
                xtype : 'container',
                pkg : SELF_SERVICE_PACKAGES.CAREER.NAME,
                layout : 'fit',
                reference : 'career',
                _child : {
                    xtype : SELF_SERVICE_PACKAGES.CAREER.BASE_COMPONENT
                }
            }
        ],

        statics : {
            getMenuConfig : function() {
                return [
                    {
                        xtype : 'menuseparator',
                        cls : 'criterion-view-ess-navigation-separator'
                    },
                    {
                        title : i18n._('Home'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-home',
                            href : ROUTES.getDirect(SELF_SERVICE.DASHBOARD)
                        }
                    },
                    {
                        title : i18n._('Time'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-time',
                            _href : ROUTES.getDirect(SELF_SERVICE.TIME)
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!securityTimeMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityTimeManagementMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('My Time Offs'),
                                            href : ROUTES.getDirect(SELF_SERVICE.TIME_TIME_OFF_DASHBOARD),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.MY_TIME_OFFS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('My Timesheets'),
                                            href : ROUTES.getDirect(SELF_SERVICE.TIME_TIMESHEETS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TIMESHEET, true)
                                            }
                                        },
                                        {
                                            text : i18n._('My Availability'),
                                            href : ROUTES.getDirect(SELF_SERVICE.TIME_AVAILABILITY),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.MY_AVAILABILITY, true)
                                            }
                                        },
                                        {
                                            text : i18n._('My Shift Assignments'),
                                            href : ROUTES.getDirect(SELF_SERVICE.TIME_MY_SHIFT_ASSIGNMENTS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.MY_SHIFT_ASSIGNMENTS, true)
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityTimeTeamMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('Team Time Offs'),
                                            href : ROUTES.getDirect(SELF_SERVICE.TIME_TEAM_TIME_OFFS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TEAM_TIME_OFFS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Team Timesheets'),
                                            href : ROUTES.getDirect(SELF_SERVICE.TIME_TIMESHEET_DASHBOARD),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TEAM_TIMESHEETS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Team Attendance'),
                                            href : ROUTES.getDirect(SELF_SERVICE.TIME_ATTENDANCE_DASHBOARD),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TEAM_ATTENDANCE, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Team Availability'),
                                            href : ROUTES.getDirect(SELF_SERVICE.TIME_AVAILABILITY_MANAGER),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TEAM_AVAILABILITY, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        title : i18n._('Pay'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-bank',
                            _href : ROUTES.getDirect(SELF_SERVICE.PAYROLL)
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!securityPayMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    items : [
                                        {
                                            text : i18n._('Taxes'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PAYROLL_TAXES),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TAXES, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Deductions'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PAYROLL_DEDUCTIONS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.DEDUCTION, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Incomes'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PAYROLL_INCOMES),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.INCOME, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Bank Accounts'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PAYROLL_BANK_ACCOUNTS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.BANK_ACCOUNTS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Pay History'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PAYROLL_PAY_HISTORY),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.PAY_HISTORY, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        title : i18n._('Benefits'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-briefcase',
                            _href : ROUTES.getDirect(SELF_SERVICE.BENEFITS)
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!securityBenefitsMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    items : [
                                        {
                                            text : i18n._('Benefit Plans'),
                                            href : ROUTES.getDirect(SELF_SERVICE.BENEFITS_PLANS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.BENEFITS_PLANS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Open Enrollment'),
                                            href : ROUTES.getDirect(SELF_SERVICE.BENEFITS_OPEN_ENROLLMENTS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.OPEN_ENROLLMENT, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        title : i18n._('Learning'),
                        hidden : true,
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-learning',
                            _href : ROUTES.getDirect(SELF_SERVICE.LEARNING)
                        },
                        bind : {
                            hidden : '{!securityLearningMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',

                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityLearningClassesMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('Active'),
                                            href : ROUTES.getDirect(SELF_SERVICE.LEARNING_ACTIVE),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.LEARNING_ACTIVE, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Completed'),
                                            href : ROUTES.getDirect(SELF_SERVICE.LEARNING_COMPLETED),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.LEARNING_COMPLETE, true)
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',

                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityLearningMyTeamMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('My Team'),
                                            href : ROUTES.getDirect(SELF_SERVICE.LEARNING_MY_TEAM),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.MY_TEAM, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Instructor Portal'),
                                            href : ROUTES.getDirect(SELF_SERVICE.LEARNING_INSTRUCTOR_PORTAL),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.INSTRUCTOR_PORTAL, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        title : i18n._('Performance'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-performance',
                            _href : ROUTES.getDirect(SELF_SERVICE.PERFORMANCE)
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!showPerformanceMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    items : [
                                        {
                                            text : i18n._('My Journals'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERFORMANCE_MY_JOURNALS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.MY_JOURNALS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Journal Entry'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERFORMANCE_JOURNAL_ENTRY),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getComplexSecurityESSFormula({
                                                    append : '!subordinatesCount ||',
                                                    rules : [
                                                        {
                                                            key : ESS_KEYS.JOURNAL_ENTRY,
                                                            actName : criterion.SecurityManager.READ,
                                                            reverse : true
                                                        }
                                                    ]
                                                })
                                            }
                                        },
                                        {
                                            text : i18n._('Team Journals'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERFORMANCE_TEAM_JOURNALS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getComplexSecurityESSFormula({
                                                    append : '!subordinatesCount ||',
                                                    rules : [
                                                        {
                                                            key : ESS_KEYS.TEAM_JOURNALS,
                                                            actName : criterion.SecurityManager.READ,
                                                            reverse : true
                                                        }
                                                    ]
                                                })
                                            }
                                        },
                                        {
                                            text : i18n._('Reviews'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERFORMANCE_REVIEWS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.REVIEWS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('My Goals'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERFORMANCE_MY_GOALS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.MY_GOALS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Team Goals'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERFORMANCE_TEAM_GOALS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TEAM_GOALS, true)
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityPerformanceTeamMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('Team Reviews'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERFORMANCE_TEAM_REVIEWS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TEAM_REVIEWS, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },

                    {
                        title : i18n._('Recruiting'),
                        isHiringManagerSection : true,
                        hidden : true,
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-recruiting',
                            _href : ROUTES.getDirect(SELF_SERVICE.RECRUITING)
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    items : [
                                        {
                                            text : i18n._('Job Postings'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RECRUITING_JOB_POSTINGS)
                                        },
                                        {
                                            text : i18n._('Careers'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RECRUITING_CAREERS),
                                            hidden : true,
                                            bind : {
                                                hidden : '{!showInternalCareers}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },

                    {
                        title : i18n._('Career'),
                        hidden : true,
                        bind : {
                            hidden : '{!securityCareerMenu}'
                        },
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-career',
                            _href : ROUTES.getDirect(SELF_SERVICE.CAREER)
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    items : [
                                        {
                                            text : i18n._('Education'),
                                            href : ROUTES.getDirect(SELF_SERVICE.CAREER_EDUCATION),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.EDUCATION, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Skills'),
                                            href : ROUTES.getDirect(SELF_SERVICE.CAREER_SKILLS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.SKILL, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Certifications'),
                                            href : ROUTES.getDirect(SELF_SERVICE.CAREER_CERTIFICATIONS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.CERTIFICATION, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        title : i18n._('Employment'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-employment',
                            _href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION)
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!securityEmploymentMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityEmploymentMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('Employment Information'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION_EMPLOYMENT),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.EMPLOYMENT_INFORMATION, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Position'),
                                            multiPositionTitle : i18n._('Primary Position'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION_POSITION),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.PRIMARY_POSITION, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Additional Positions'),
                                            isMultiPositionMode : true,
                                            href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION_POSITIONS)
                                        },
                                        {
                                            text : i18n._('Position History'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION_ASSIGNMENT_HISTORY),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.POSITION_HISTORY, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        title : i18n._('Personal Information'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-user-copy',
                            _href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION)
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!securityPersonalMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityProfileMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('Demographics'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION_BASIC_DEMOGRAPHICS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.DEMOGRAPHICS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Address'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION_ADDRESS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.ADDRESS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Dependents and Contacts'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PERSONAL_INFORMATION_DEPENDENTS_AND_CONTACTS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.DEPENDENTS_CONTACTS, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        title : i18n._('Calendar'),
                        hidden : true,
                        bind : {
                            hidden : '{!showCalendarMenu}'
                        },
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-calendar',
                            _href : ROUTES.getDirect(SELF_SERVICE.CALENDAR)
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_calendars',
                                    hidden : true,
                                    bind : {
                                        hidden : criterion.SecurityManager.getComplexSecurityESSFormula({
                                            append : '!calendarsCount ||',
                                            rules : [
                                                {
                                                    key : ESS_KEYS.CALENDAR_MENU,
                                                    actName : criterion.SecurityManager.READ,
                                                    reverse : true
                                                }
                                            ]
                                        })
                                    },
                                    listeners : {
                                        calendarsCountChanged : 'onCalendarsCountChanged'
                                    }
                                },
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityEventMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('Events'),
                                            href : ROUTES.getDirect(SELF_SERVICE.CALENDAR_EVENTS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.EVENTS, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        title : i18n._('Resources'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-resources',
                            _href : ROUTES.getDirect(SELF_SERVICE.RESOURCES)
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!securityResourcesMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',

                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityDocumentsMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('My Documents'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RESOURCES_MY_DOCUMENTS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.MY_DOCUMENTS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Company Documents'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RESOURCES_COMPANY_DOCUMENTS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.COMPANY_DOCUMENTS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Team Documents'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RESOURCES_TEAM_DOCUMENTS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TEAM_DOCUMENTS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Company Videos'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RESOURCES_COMPANY_VIDEOS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.COMPANY_VIDEOS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Reports'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RESOURCES_REPORTS.MAIN),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.REPORTS, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Forms'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RESOURCES_FORMS),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.FORM, true)
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',

                                    hidden : true,
                                    bind : {
                                        hidden : '{!securityReportsMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('Company Directory'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RESOURCES_COMPANY_DIRECTORY),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.COMPANY_DIRECTORY, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Organization View'),
                                            href : ROUTES.getDirect(SELF_SERVICE.RESOURCES_TEAM + '/current'),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.ORGANIZATION_VIEW, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        xtype : 'menuseparator',
                        cls : 'criterion-view-ess-navigation-separator'
                    },
                    {
                        title : i18n._('Settings'),
                        button : {
                            iconCls : 'criterion-view-ess-navigation-button-icon icon-settings',
                            _href : ROUTES.getDirect(SELF_SERVICE.PREFERENCES)
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!securitySettingsMenu}'
                        },
                        menu : {
                            items : [
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    items : [
                                        {
                                            text : i18n._('Security'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PREFERENCES_SECURITY),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getComplexSecurityESSFormula({
                                                    append : 'usingExternalAuth ||',
                                                    rules : [
                                                        {
                                                            key : ESS_KEYS.SECURITY,
                                                            actName : criterion.SecurityManager.READ,
                                                            reverse : true
                                                        }
                                                    ]
                                                })
                                            }
                                        },
                                        {
                                            text : i18n._('Look & Feel'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PREFERENCES_LOOK_AND_FEEL),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.LOOK_AND_FEEL, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Calendar'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PREFERENCES_CALENDAR),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.CALENDAR, true)
                                            }
                                        },
                                        {
                                            text : i18n._('Delegation'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PREFERENCES_DELEGATION),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.DELEGATION, true)
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'criterion_ess_navigation_menu_section',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!securitySettingsTeamMenu}'
                                    },
                                    items : [
                                        {
                                            text : i18n._('Team Delegation'),
                                            href : ROUTES.getDirect(SELF_SERVICE.PREFERENCES_TEAM_DELEGATION),
                                            hidden : true,
                                            bind : {
                                                hidden : criterion.SecurityManager.getSecurityESSFormula(ESS_KEYS.TEAM_DELEGATION, true)
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        }
    };

});
