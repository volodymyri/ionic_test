Ext.define('ess.view.time.TimeOff', function() {

    const currentYear = new Date().getFullYear(),
        yearFrom = (currentYear - 1),
        yearTo = (currentYear + 1),
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        alias : 'widget.criterion_time_timeoff',

        extend : 'criterion.view.FormView',

        cls : 'criterion-time-timeoff',

        requires : [
            'ess.controller.time.TimeOff',
            'ess.controller.time.timeOff.Details'
        ],

        controller : {
            type : 'ess_modern_time_timeoff'
        },

        viewModel : {
            data : {
                recordName : 'time off',
                showActionPanel : false,
                isAllDayOnly : false
            },

            formulas : {
                hideSave : data => (data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.NOT_SUBMITTED && data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.REJECTED),

                hideSubmit : data => data('hideSave') || !data('record.canBeSubmitted'),

                hideDelete : data => data('isPhantom') || (data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.NOT_SUBMITTED && data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.REJECTED),

                hideAddNewDetail : data => data('isPhantom') || (data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.NOT_SUBMITTED && data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.REJECTED),

                readOnlyMode : data => !data('isPhantom') && (data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.NOT_SUBMITTED && data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.REJECTED),

                hideDurationFields : data => !data('isPhantom') || data('record.isFullDay'),

                showCancelSubmit : data => {
                    let code = data('record.timeOffStatusCode'),
                        startDate = data('record.startDate');

                    return code === WORKFLOW_STATUSES.PENDING_APPROVAL || (code === WORKFLOW_STATUSES.APPROVED && startDate > Ext.Date.clearTime(new Date()));
                },

                pageTitle : data => data('isPhantom') ? i18n.gettext('New Time Off') : data('record.timeOffTypeDesc')
            }
        },

        defaults : {
            labelWidth : 150
        },

        padding : 0,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                bind : {
                    title : '{pageTitle}'
                },
                buttons : [
                    {
                        xtype : 'button',
                        itemId : 'backButton',
                        cls : 'criterion-menubar-back-btn',
                        iconCls : 'md-icon-clear',
                        align : 'left',
                        handler : 'handleCancel'
                    }
                ],
                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-add',
                        handler : 'handleAddTimeOffDetail',
                        hidden : true,
                        bind : {
                            hidden : '{hideAddNewDetail}'
                        }
                    },
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-send',
                        hidden : true,
                        bind : {
                            hidden : '{hideSubmit}'
                        },
                        handler : 'handleSubmit'
                    }
                ]
            },
            {
                xtype : 'component',
                cls : 'timezone-info',
                docked : 'top',
                hidden : true,
                bind : {
                    html : '<i class="icon"></i><span class="text">{record.timezoneDescription}</span>',
                    hidden : '{!isPhantom}'
                }
            },
            {
                xtype : 'criterion_time_timeoff_time_balances',
                disableSelection : true,
                reference : 'timeBalancesDataView',
                docked : 'top',
                hidden : true,
                bind : {
                    store : '{timeBalances}',
                    hidden : '{!isPhantom}'
                }
            },
            {
                xtype : 'component',
                hidden : true,
                docked : 'top',
                bind : {
                    hidden : '{isPhantom}',
                    html : '{record.timeOffStatusDescription}',
                    cls : 'panel-of-workflow-status {record.timeOffStatusCode}'
                }
            },
            {
                xtype : 'container',
                padding : '0 15 10 15',
                items : [
                    {
                        xtype : 'criterion_combobox',
                        label : i18n.gettext('Type'),
                        bind : {
                            store : '{employeeTimeOffType}',
                            value : '{record.timeOffTypeCd}',
                            disabled : '{!isPhantom}',
                            hidden : '{!isPhantom}'
                        },
                        hidden : true,
                        modelValidation : true,
                        required : true,
                        listeners : {
                            change : 'handleTypeChange'
                        },
                        name : 'timeOffTypeCd',
                        valueField : 'id',
                        displayField : 'description'
                    },

                    {
                        xtype : 'container',
                        layout : {
                            type : 'hbox',
                            align : 'center'
                        },
                        margin : '0 0 20 0',
                        items : [
                            {
                                xtype : 'datefield',
                                label : i18n.gettext('Start Date'),
                                edgePicker : {
                                    yearFrom : yearFrom,
                                    yearTo : yearTo
                                },
                                isStartDate : true,
                                required : true,
                                flex : 1,
                                margin : '0 5 0 0',
                                bind : {
                                    value : '{record.startDateForCreate}',
                                    readOnly : '{readOnlyMode}',
                                    hidden : '{!isPhantom}',
                                    disabled : '{!isPhantom}'
                                },
                                listeners : {
                                    change : 'onStartDateChange'
                                }
                            },
                            {
                                xtype : 'datepickerfield',
                                label : i18n.gettext('End Date'),
                                isEndDate : true,
                                required : true,
                                flex : 1,
                                edgePicker : {
                                    yearFrom : yearFrom,
                                    yearTo : yearTo
                                },
                                bind : {
                                    value : '{record.endDate}',
                                    disabled : '{!isPhantom}',
                                    hidden : '{!isPhantom}',
                                    readOnly : '{readOnlyMode}'
                                }
                            }
                        ]
                    },

                    {
                        xtype : 'togglefield',
                        label : i18n.gettext('All Day'),
                        reference : 'allDayToggler',
                        labelAlign : 'left',
                        bind : {
                            value : '{record.isFullDay}',
                            readOnly : '{readOnlyMode || isAllDayOnly}',
                            hidden : '{!isPhantom}'
                        },
                        name : 'isFullDay'
                    },
                    {
                        xtype : 'numberfield',
                        name : 'duration',
                        label : i18n.gettext('Duration'),
                        isDuration : true,
                        required : true,
                        bind : {
                            value : '{record.duration}',
                            hidden : '{hideDurationFields}',
                            disabled : '{hideDurationFields}',
                            readOnly : '{readOnlyMode}'
                        }
                    },
                    {
                        xtype : 'criterion_timefield',
                        label : i18n.gettext('Start Time'),
                        bind : {
                            value : '{record.startTime}',
                            hidden : '{hideDurationFields}',
                            disabled : '{hideDurationFields}',
                            readOnly : '{readOnlyMode}'
                        },
                        required : true,
                        format : criterion.consts.Api.TIME_FORMAT
                    },
                    {
                        xtype : 'textareafield',
                        label : i18n.gettext('Notes'),
                        reference : 'notes',
                        bind : {
                            value : '{record.notes}',
                            readOnly : '{readOnlyMode}'
                        }
                    }
                ]
            },

            {
                xtype : 'criterion_gridview',
                reference : 'timeOffDetailsGrid',
                bind : {
                    store : '{record.details}',
                    hidden : '{isPhantom}'
                },
                controller : {
                    type : 'ess_modern_time_timeoff_details'
                },

                listeners : {
                    doAdd : 'handleEditTimeOffDetail',
                    doEdit : 'handleEditTimeOffDetail'
                },

                flex : 1,
                minHeight : 150,

                columns : [
                    {
                        xtype : 'datecolumn',
                        text : 'Date',
                        dataIndex : 'timeOffDate',
                        width : 125
                    },
                    {
                        text : 'Start Time',
                        dataIndex : 'startTimeStr',
                        flex : 1,
                        minWidth : 250
                    },
                    {
                        text : 'Duration',
                        width : 130,
                        dataIndex : 'durationStr'
                    }
                ]
            },

            {
                xtype : 'container',
                layout : 'hbox',
                margin : '10 20 10 20',
                docked : 'bottom',
                items : [
                    {
                        xtype : 'button',
                        ui : 'act-btn-delete',
                        handler : 'handleDelete',
                        text : i18n.gettext('Delete'),
                        hidden : true,
                        bind : {
                            hidden : '{hideDelete}'
                        },
                        margin : '0 5 0 0',
                        flex : 1
                    },

                    {
                        xtype : 'button',
                        ui : 'act-btn-delete',
                        handler : 'handleCancelSubmit',
                        text : i18n.gettext('Recall'),
                        hidden : true,
                        bind : {
                            hidden : '{!showCancelSubmit}'
                        },
                        margin : '0 5 0 0',
                        flex : 1
                    },

                    {
                        xtype : 'button',
                        ui : 'act-btn-save',
                        handler : 'handleSave',
                        text : i18n.gettext('Save'),
                        margin : '0 0 0 5',
                        flex : 1,
                        hidden : true,
                        bind : {
                            hidden : '{hideSave}'
                        }
                    }
                ]
            }
        ],

        /**
         * For custom check startDate and endDate fields
         * @returns {boolean}
         */
        isValid : function() {
            var invalid = [],
                phantom = this.getViewModel().get('isPhantom'),
                startDateValue,
                endDateValue;

            Ext.suspendLayouts();

            Ext.Array.each(this.getFieldsAsArray(), function(field) {
                if (!field.validate()) {
                    invalid.push(field)
                }

                if (field.isStartDate && phantom) {
                    startDateValue = field.getValue();
                    if (!startDateValue) {
                        field.markInvalid('Must be present');
                        invalid.push(field);
                    } else {
                        field.clearInvalid();
                    }
                }

                if (field.isEndDate && phantom && startDateValue) {
                    endDateValue = field.getValue();
                    if (endDateValue && (startDateValue.getTime() > endDateValue.getTime())) {
                        field.markInvalid('Must be greater than start date');
                        invalid.push(field);
                    } else {
                        field.clearInvalid();
                    }
                }

                // duration
                if (field.isDuration && !field.getDisabled() && !field.getValue()) {
                    field.markInvalid('Must be present');
                    invalid.push(field);
                } else {
                    field.clearInvalid();
                }
            });

            Ext.resumeLayouts(true);

            return invalid.length < 1;
        }

    };
});

