Ext.define('criterion.view.employee.benefit.TimeOffDetailForm', function() {

    return {
        alias : 'widget.criterion_employee_benefit_time_off_detail_form',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],
        draggable : false,

        title : i18n.gettext('Time Off Detail'),
        timeFieldXType : 'timefield',

        bodyPadding : 20,

        viewModel : {
            data : {
                /**
                 * @link {criterion.model.employee.timeOff.Detail}
                 */
                record : null,
                isAllDayOnly : false
            },
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF, criterion.SecurityManager.UPDATE, false, true));
                },

                submitBtnText : function(get) {
                    return get('blockedState') ? i18n.gettext('Please wait...') : i18n.gettext('Change')
                }
            }
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'datefield',
                    fieldLabel : i18n.gettext('Date'),
                    readOnly : true,
                    bind : {
                        value : '{record.timeOffDate}',
                        readOnly : '{!isPhantom}'
                    }
                },
                {
                    xtype : 'toggleslidefield',
                    fieldLabel : i18n.gettext('All Day'),
                    readOnly : true,
                    bind : {
                        value : '{record.isFullDay}',
                        readOnly : '{isAllDayOnly}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Duration'),
                    name : 'durationString',
                    flex : 1,
                    bind : {
                        value : '{record.durationString}',
                        disabled : '{record.isFullDay}',
                        hidden : '{record.isFullDay}'
                    },
                    listeners : {
                        blur : function(cmp) {
                            let hasError = false,
                                parsed = criterion.Utils.timeStringToHoursMinutes(cmp.getValue()),
                                hours = parsed.hours,
                                minutes = parsed.minutes;

                            if (!isNaN(hours) || !isNaN(minutes)) {
                                cmp.up('form').getViewModel().get('record').set('duration', (hours || 0)  * 60 + (minutes || 0));
                                cmp.setValue(criterion.Utils.timeObjToStr({
                                    hours : hours,
                                    minutes : minutes
                                }));
                            } else {
                                hasError = true;
                            }

                            if (hasError) {
                                cmp.markInvalid(i18n.gettext('Wrong format, should be : \'12:45\', \'1h 20m\', \'1h\', \'20m\''));
                            }
                        }
                    }
                },
                {
                    xtype : this.timeFieldXType,
                    fieldLabel : i18n.gettext('Start Time'),
                    bind : {
                        value : '{record.startTime}',
                        disabled : '{record.isFullDay}',
                        hidden : '{record.isFullDay}'
                    }
                },
                {
                    xtype : 'displayfield',
                    fieldLabel : i18n.gettext('Timezone'),
                    bind : {
                        value : '{record.timezoneDescription}',
                        hidden : '{record.isFullDay}'
                    }
                }
            ];

            this.callParent(arguments);
        }

    };
});
