Ext.define('criterion.model.employee.timesheet.vertical.TaskDetail', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.field.CustomFieldValue',
            'criterion.model.employee.timesheet.Income'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_VERTICAL_TASK_DETAIL,
            batchOrder : 'destroy,create,update' // order was change for a correct validation in the BE part
        },

        fields : [
            {
                name : 'timesheetId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'timesheetTaskId',
                type : 'integer',
                persist : false
            },
            {
                name : 'units',
                type : 'number'
            },
            {
                name : 'days',
                type : 'number'
            },
            {
                name : 'hours',
                type : 'integer'
            },
            {
                name : 'minutes',
                type : 'integer'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'hoursString',
                type : 'string',
                persist : false
            },
            {
                name : 'startTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'endTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                persist : false
            },
            {
                name : 'timerStartDatetime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'taskHoursString',
                type : 'string',
                persist : false,
                depends : ['startTime', 'endTime', 'hours', 'minutes', 'hoursString'],
                convert : function(value, record) {
                    return record.getTaskHoursString();
                }
            },

            {
                name : 'assignmentId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taskId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'employerWorkLocationId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'workLocationAreaId',
                type : 'int',
                allowNull : true

            },
            {
                name : 'customValue1',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue2',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue3',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue4',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue1Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue2Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue3Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue4Type',
                type : 'string',
                persist : false
            },
            {
                name : 'isUpdatable',
                type : 'boolean',
                persist : false,
                defaultValue : true // for phantom records
            },
            {
                name : 'isRemovable',
                type : 'boolean',
                persist : false,
                defaultValue : true // for phantom records
            },
            {
                name : 'isFullDayTimeOff',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isApprovedTimeOff',
                type : 'boolean',
                persist : false
            },
            {
                type : 'criterion_timezone',
                name : 'timezoneCd'
            },
            {
                name : 'isShowTime',
                type : 'boolean',
                persist : false,
                defaultValue : true
            },
            {
                name : 'assignmentName',
                type : 'string',
                persist : false
            },
            {
                name : 'employeeTaskName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerWorkLocationName',
                type : 'string',
                persist : false
            },
            {
                name : 'workLocationAreaName',
                type : 'string',
                persist : false
            },
            {
                name : 'paycodeChanged',
                type : 'boolean',
                persist : false,
                defaultValue : false
            },

            {
                name : 'projectId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'projectName',
                type : 'string',
                persist : false
            },
            {
                name : 'isInsideGeofenceIn',
                type : 'boolean',
                allowNull : true,
                persist : false
            },
            {
                name : 'isInsideGeofenceOut',
                type : 'boolean',
                allowNull : true,
                persist : false
            },
            {
                name : 'paycodeDetail'
            },
            {
                name : 'paycodeName',
                persist : false,
                calculate : function(data) {
                    return data && data['paycodeDetail'] && data['paycodeDetail'].name || ''
                }
            },
            {
                name : 'formattedHours',
                persist : false,
                depends : ['hours', 'minutes'],
                calculate : function(data) {
                    return criterion.Utils.timeObjToStr(data);
                }
            },
            {
                name : 'hoursToGrid',
                persist : false,
                depends : ['formattedHours', 'units'],
                calculate : function(data) {
                    return data.units ? data.units : data.formattedHours;
                }
            }
        ],

        getTaskHoursString : function() {
            let startTime = this.get('startTime'),
                startTimeStr = Ext.Date.format(startTime, 'H:i:s'),
                endTime = this.get('endTime'),
                endTimeStr = Ext.Date.format(endTime, 'H:i:s'),
                hours = this.get('hours'),
                minutes = this.get('minutes'),
                hoursString = '00:00',
                diff;

            if (startTime && endTime) {
                startTime = (new Date()).setHours(startTime.getHours(), startTime.getMinutes());
                endTime = endTimeStr !== '00:00:00' ? (new Date()).setHours(endTime.getHours(), endTime.getMinutes()) : (new Date()).setHours(24, 0);

                diff = Ext.Date.diff(startTime, endTime, Ext.Date.MINUTE);

                hoursString = criterion.Utils.minutesToTimeStr(
                    startTimeStr === '00:00:00' && endTimeStr === '00:00:00' ? 1440 : (diff > 0 ? diff : 0)
                );
            } else {
                if (hours || minutes) {
                    hoursString = Ext.String.leftPad(hours || 0, 2, '0') + ':' + Ext.String.leftPad(minutes || 0, 2, '0');
                }
            }

            return hoursString;
        },

        calculateEndTime : function() {
            let startTime = this.get('startTime'),
                timerStartDatetime = this.get('timerStartDatetime'),
                hours = this.get('hours'),
                minutes = this.get('minutes'),
                endTime;

            if (!timerStartDatetime && startTime && (hours || minutes)) {
                endTime = Ext.Date.add(startTime, Ext.Date.HOUR, hours);
                endTime = Ext.Date.add(endTime, Ext.Date.MINUTE, minutes);

                this.set('endTime', endTime);
            }

            return endTime;
        },

        /**
         * Encapsulate custom "isDirty" logic.
         * @returns {*}
         */
        skipSave : function() {
            let result,
                changes = this.getChanges();

            if (this.phantom) {
                if (this.get('paycodeDetail')) {
                    if (this.get('paycodeDetail')['isUnits']) {
                        result = !this.get('units');
                    } else if (this.get('paycodeDetail')['isCompEarned']) {
                        if (Ext.isDefined(changes['days'])) {
                            // for manual day
                            result = !this.get('days');
                        } else {
                            // default
                            result = !this.get('hours') && !this.get('minutes');
                        }
                    } else if (!this.get('isShowTime') && (this.get('hours') || this.get('minutes'))) {
                        result = false;
                    } else if (Ext.isDefined(changes['days'])) {
                        result = false;
                    } else {
                        result = !this.get('startTime');
                    }
                } else {
                    result = true;
                }
            } else {
                result = Ext.Object.isEmpty(changes);
            }

            return result;
        },

        /**
         * Alternative getter for paycode to overcome phantom issue on Ext hasOne association.
         * @returns {*}
         */
        getIncome : function() {
            return this.getPaycodeDetail() ? this.getPaycodeDetail().getData() : this.getData()['paycodeDetail'];
        },

        hasOne : [
            {
                model : 'criterion.model.employee.timesheet.Income',
                name : 'paycodeDetail',
                associationKey : 'paycodeDetail'
            }
        ]
    };
});
