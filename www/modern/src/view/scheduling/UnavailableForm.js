Ext.define('criterion.view.scheduling.UnavailableForm', function() {

    const currentYear = new Date().getFullYear(),
        yearFrom = (currentYear - 1),
        yearTo = (currentYear + 1);

    return {

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.scheduling.UnavailableForm'
        ],

        alias : 'widget.criterion_scheduling_unavailable_form',

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.UnavailableBlock
                 */
                record : null,

                showActionPanel : false,
                submitBtnText : 'Save',
                startTime : null,
                endTime : null
            },

            formulas : {
                readOnly : function(data) {
                    return data('record.isTimeOff');
                },
                hideSave : function(data) {
                    return data('record.isTimeOff');
                },
                hideDelete : function(data) {
                    return data('isPhantom') || data('record.isTimeOff');
                }
            }
        },

        controller : {
            type : 'criterion_scheduling_unavailable_form'
        },

        defaults : {
            labelWidth : 150
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
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
                title : i18n.gettext('Unavailable Details')
            },
            {
                xtype : 'component',
                cls : 'timezone-info',
                docked : 'top',
                bind : {
                    html : '<i class="icon"></i><span class="text">{timezone}</span>'
                }
            },
            {
                xtype : 'component',
                cls : 'panel-info orange',
                docked : 'top',
                hidden : true,
                html : '<span class="text">' + i18n.gettext('Time Off') + '</span>',
                bind : {
                    hidden : '{!record.isTimeOff}'
                }
            },

            {
                xtype : 'textfield',
                label : i18n.gettext('Name'),
                required : true,
                clearable : false,
                bind : {
                    value : '{record.name}',
                    readOnly : '{readOnly}'
                }
            },

            {
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'center'
                },
                margin : '0 0 10 0',
                items : [
                    {
                        xtype : 'datepickerfield',
                        label : i18n.gettext('Start'),
                        required : true,
                        edgePicker : {
                            yearFrom : yearFrom,
                            yearTo : yearTo
                        },
                        flex : 1,
                        bind : {
                            value : '{record.startTimestamp}',
                            readOnly : '{readOnly}'
                        }
                    },
                    {
                        xtype : 'criterion_timefield',
                        hideLabel : true,
                        bind : {
                            value : '{startTime}',
                            disabled : '{record.fullDay}',
                            hidden : '{record.fullDay}',
                            readOnly : '{readOnly}'
                        },
                        width : 160,
                        margin : '45 0 0 10',
                        allowBlank : false,
                        format : criterion.consts.Api.TIME_FORMAT
                    }
                ]
            },

            {
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'center'
                },
                margin : '0 0 10 0',
                items : [
                    {
                        xtype : 'datepickerfield',
                        label : i18n.gettext('End'),
                        edgePicker : {
                            yearFrom : yearFrom,
                            yearTo : yearTo
                        },
                        required : true,
                        flex : 1,
                        bind : {
                            value : '{record.endTimestamp}',
                            readOnly : '{readOnly}'
                        }
                    },
                    {
                        xtype : 'criterion_timefield',
                        hideLabel : true,
                        bind : {
                            value : '{endTime}',
                            disabled : '{record.fullDay}',
                            hidden : '{record.fullDay}',
                            readOnly : '{readOnly}'
                        },
                        width : 160,
                        margin : '45 0 0 10',
                        allowBlank : false,
                        format : criterion.consts.Api.TIME_FORMAT,
                        valueField : 'date'
                    }
                ]
            },

            {
                xtype : 'togglefield',
                label : i18n.gettext('Full Day'),
                labelAlign : 'left',
                bind : {
                    value : '{record.fullDay}',
                    disabled : '{readOnly}'
                }
            },
            {
                xtype : 'togglefield',
                label : i18n.gettext('Recurring'),
                labelAlign : 'left',
                bind : {
                    value : '{record.recurring}',
                    disabled : '{readOnly}'
                }
            },
            {
                xtype : 'datepickerfield',
                label : i18n.gettext('Recurring End Date'),
                edgePicker : {
                    yearFrom : yearFrom,
                    yearTo : yearTo
                },
                hidden : true,
                required : true,
                bind : {
                    value : '{record.recurringEndDate}',
                    disabled : '{!record.recurring || readOnly}',
                    hidden : '{!record.recurring}'
                }
            },

            {
                xtype : 'container',
                layout : 'hbox',
                margin : '20 20 10 20',
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
        ]
    }
});
