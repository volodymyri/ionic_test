Ext.define('criterion.view.moduleToolbar.EssActions', function() {

    var ROUTES = criterion.consts.Route,
        SELF_SERVICE = ROUTES.SELF_SERVICE,
        TIMESHEET_LAYOUT_ENTRY_TYPE = criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE;

    return {
        alias : 'widget.criterion_moduletoolbar_ess_actions',

        extend : 'criterion.view.moduleToolbar.MenuOwner',

        requires : [
            'criterion.controller.moduleToolbar.EssActions'
        ],

        controller : {
            type : 'criterion_moduletoolbar_ess_actions'
        },

        viewModel : {
            data : {
                startData : null,
                startedTask : null,
                timesheetVertical : null
            },
            formulas : {
                inOutText : function(get) {
                    var isStarted = get('isStarted'),
                        hoursWorked = get('hoursWorked'),
                        inOutText = isStarted ? i18n.gettext('Stop Time (OUT)') : i18n.gettext('Start Time (IN)'),
                        timerCls = 'criterion-moduletoolbar-ess-actions-timer-' + (isStarted ? 'started' : 'stopped');

                    return Ext.util.Format.format('{0} <span class="{1}">{2}</span>', inOutText, timerCls, hoursWorked);
                },
                isStarted : function(get) {
                    return !!(get('startData.timesheetVerticalId') && get('startedTask'));
                },
                hoursWorked : function(get) {
                    var timesheetVertical = get('timesheetVertical'),
                        days = timesheetVertical && timesheetVertical.days(),
                        currentDate = new Date().setHours(0, 0, 0, 0),
                        hoursWorked = '';

                    days && days.each(function(day) {
                        var date = day.get('date');

                        date = date && date.setHours(0, 0, 0, 0);

                        if (date === currentDate) {
                            hoursWorked = day.get('totalHours');
                        }
                    });

                    return hoursWorked;
                },
                disableInOut : function(data) {
                    var disabled = data('isStarted') ? (!data('timesheetVertical.breakIsAbleToBeStopped') && data('timesheetVertical.hasStartedBreak')) : null;

                    return disabled || !data('timesheetVertical.notSubmittedOrRejected') || !data('timesheetVertical.isCurrent')
                },
                showInOut : function(data) {
                    var timesheetVertical = data('timesheetVertical'),
                        timesheetType = timesheetVertical && timesheetVertical.getTimesheetType && timesheetVertical.getTimesheetType(),
                        entryType = timesheetType && timesheetType.get('entryType');

                    return Ext.Array.contains([TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON, TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_AND_BUTTON], entryType);
                },
                userCls : function(data) {
                    var isStarted = data('isStarted');

                    if (isStarted) {
                        return 'fa fa-clock-o';
                    }
                }
            }
        },

        bind : {
            userCls : '{userCls}'
        },

        listeners : {
            menushow : 'onMenuShow'
        },

        initComponent : function() {
            this.callParent(arguments);

            this.setMenu({
                cls : 'criterion-moduletoolbar-menu',

                items : [
                    {
                        text : i18n.gettext('Enter Time'),
                        href : ROUTES.getDirect(SELF_SERVICE.TIME_TIMESHEETS_CURRENT),
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.TIMESHEET, true)
                        }
                    },
                    {
                        hidden : true,
                        disabled : true,
                        bind : {
                            text : '{inOutText}',
                            hidden : '{!showInOut}',
                            disabled : '{disableInOut}'
                        },
                        handler : 'onInOutClick'
                    },
                    {
                        text : i18n.gettext('Request Time Off'),
                        handler : 'handleRequestTimeOff',
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.MY_TIME_OFFS, true)
                        }
                    },
                    {
                        text : i18n.gettext('View Paystub'),
                        href : ROUTES.getDirect(SELF_SERVICE.PAYROLL_PAY_HISTORY_LAST),
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.PAY_HISTORY, true)
                        }
                    }
                ]
            });
        }

    };

});
