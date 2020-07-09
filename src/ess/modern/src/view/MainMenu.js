Ext.define('ess.view.MainMenu', {

    extend : 'Ext.Container',

    requires : [
        'ess.controller.MainMenu',
        'ess.view.MenuBar',
        'criterion.store.Communities'
    ],

    alias : 'widget.ess_view_main_menu',

    scrollable : true,

    viewModel : {
        data : {
            person : null,
            pendingWorkflowsCount : 0,
            communitiesCount : 0
        },
        formulas : {
            inboxTitle : data => i18n.gettext('Inbox') + ' ' + (data('pendingWorkflowsCount') ? ' <span class="criterion-ess-inbox-count">' + data('pendingWorkflowsCount') + '</span>' : '')
        },
        stores : {
            // see constructor
        }
    },

    controller : {
        type : 'ess_modern_main_menu'
    },

    listeners : {
        scope : 'controller',
        activate : 'onActivate'
    },

    cls : 'ess-main-menu',
    padding : 0,

    title : 'Menu',

    layout : 'vbox',

    items : [
        {
            xtype : 'container',
            reference : 'topPart',
            cls : 'ess-main-menu-top-part',
            layout : {
                type : 'vbox'
            },
            items : [
                {
                    xtype : 'ess_modern_employee_info'
                },

                {
                    xtype : 'selectfield',
                    reference : 'employmentPicker',
                    cls : 'fake-hidden',
                    valueField : 'employeeId',
                    bind : {
                        store : '{employments}'
                    },
                    edgePicker : {
                        cancelButton : false,
                        ui : 'criterion-picker',
                        cls : 'change-employer'
                    },
                    listeners : {
                        select : 'onEmploymentPick'
                    }
                },
                {
                    xtype : 'selectfield',
                    reference : 'checkInPlacePicker',
                    cls : 'fake-hidden',
                    autoSelect : false,
                    valueField : 'id',
                    displayField : 'description',
                    bind : {
                        store : '{employerLocations}'
                    },
                    edgePicker : {
                        cancelButton : false,
                        ui : 'criterion-picker',
                        cls : 'change-location'
                    },
                    listeners : {
                        select : 'onCheckInPlacePick'
                    }
                }
            ]
        },

        {
            xtype : 'container',
            layout : 'hbox',
            items : [
                {
                    xtype : 'button',
                    reference : 'changeBtn',
                    text : i18n.gettext('Change Employer'),
                    scale : 'small',
                    cls : 'ess-main-menu-change-employer',
                    flex : 1,
                    textAlign : 'left',
                    listeners : {
                        tap : 'onEmploymentChange'
                    }
                }
            ]
        },

        {
            xtype : 'container',
            layout : 'hbox',
            cls : 'ess-main-menu-check-in-container',
            hidden : true,
            bind : {
                hidden : '{!employer.isCheckin}'
            },
            items : [
                {
                    xtype : 'button',
                    bind : {
                        text : '<span class="checkedInto">' + i18n.gettext('Checked Into:') + '</span><span class="place">{placeName}</span>'
                    },
                    scale : 'small',
                    cls : 'ess-main-menu-check-in',
                    flex : 1,
                    textAlign : 'left',
                    listeners : {
                        tap : 'onCheckIn'
                    }
                }
            ]
        },

        {
            xtype : 'container',
            cls : 'ess-main-menu-btn-container',
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            defaults : {
                textAlign : 'left'
            },
            items : [
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    bind : {
                        text : '{inboxTitle}',
                        disabled : '{!pendingWorkflowsCount}'
                    },
                    flex : 1,
                    cls : 'main-menu-btn first-menu-btn',
                    iconCls : 'inbox',
                    handler : 'handleSwitchMenu',
                    showCard : 'dashboard'
                },
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    text : i18n.gettext('Timesheet'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'timesheet',
                    handler : 'handleSwitchMenu',
                    showCard : 'timesheet',
                    hidden : true,
                    bind : {
                        hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.TIMESHEET, true)
                    }
                },
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    text : i18n.gettext('Team Punch'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'team_punch',
                    handler : 'handleSwitchMenu',
                    showCard : 'teamPunch',
                    hidden : true,
                    bind : {
                        hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.TEAM_TIMESHEETS, true)
                    }
                },
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    text : i18n.gettext('Time Off'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'timeoff',
                    handler : 'handleSwitchMenu',
                    showCard : 'timeoffs',
                    hidden : true,
                    bind : {
                        hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.MY_TIME_OFFS, true)
                    }
                },
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    text : i18n.gettext('Scheduling'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'schedule',
                    handler : 'handleSwitchMenu',
                    showCard : 'scheduling',
                    hidden : true,
                    bind : {
                        hidden : '{!securitySchedulingMenuModern}'
                    }
                },
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    text : i18n.gettext('Payroll'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'payroll',
                    handler : 'handleSwitchMenu',
                    showCard : 'payroll',
                    hidden : true,
                    bind : {
                        hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.PAY_HISTORY, true)
                    }
                },
                {
                    xtype : 'button',
                    reference : 'recruitingBtn',
                    isMenuBtn : true,
                    text : i18n.gettext('Recruiting'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'recruiting',
                    handler : 'handleSwitchMenu',
                    hidden : true,
                    showCard : 'recruiting'
                },
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    text : i18n.gettext('Learning'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'learning',
                    handler : 'handleSwitchMenu',
                    hidden : true,
                    showCard : 'learning',
                    bind : {
                        hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.LEARNING_ACTIVE, true)
                    }
                },
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    text : i18n.gettext('My Information'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'my_information',
                    handler : 'handleSwitchMenu',
                    showCard : 'profile',
                    hidden : true,
                    bind : {
                        hidden : '{!securityProfileMenuModern}'
                    }
                },
                {
                    xtype : 'button',
                    isMenuBtn : true,
                    text : i18n.gettext('Communities'),
                    flex : 1,
                    cls : 'main-menu-btn',
                    iconCls : 'communities',
                    handler : 'handleSwitchMenu',
                    showCard : 'communities',
                    disabled : true,
                    bind : {
                        disabled : '{!communitiesCount}'
                    }
                }
            ]
        }
    ],

    constructor : function(config) {
        var vm,
            picker,
            slot;

        this.callParent(arguments);

        vm = this.getViewModel();

        vm.setStores({
            communities : {
                type : 'criterion_communities',
                proxy : {
                    url : criterion.consts.Api.API.COMMUNITY_FOR_EMPLOYEE
                }
            },
            employments : {
                fields : ['employeeId', 'employerId', 'text']
            },
            pendingWorkflows : {
                type : 'criterion_workflow_log_pending_logs',
                filters : {
                    property : 'workflowTypeCode',
                    value : [criterion.Consts.WORKFLOW_TYPE_CODE.FORM, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW],
                    operator : 'notin'
                }
            }
        });

        picker = this.lookup('checkInPlacePicker').getPicker();
        if (picker && (slot = picker.child('pickerslot'))) {
            slot.onStoreRefresh = function () {
                this.doRefresh();
            };
        }
    }
});
