Ext.define('criterion.view.ess.time.attendanceDashboard.Exception', function() {

    var renderer = function(value, metaData, record) {
        return record && record.get('isRemoved') ?
            i18n.gettext('Out All Day') :
            (value ? Ext.Date.format(value, criterion.consts.Api.SHOW_TIME_FORMAT) : '&mdash;');
    };

    return {

        extend : 'Ext.form.Panel',

        alias : 'widget.criterion_selfservice_time_attendance_dashboard_exception',

        requires : [
            'criterion.controller.ess.time.attendanceDashboard.Exception',
            'criterion.store.employee.attendance.WorkPeriodExceptions'
        ],

        cls : 'criterion-selfservice-time-attendance-dashboard-exception',
        
        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_2_WIDTH,
                modal : true
            }
        ],

        controller : {
            type : 'criterion_selfservice_time_attendance_dashboard_exception'
        },

        listeners : {
            show : 'handleShow'
        },

        viewModel : {
            data : {
                date : null,
                employeeGroupIds : [],
                employeeId : null,
                hasExceptions : null,

                globalException : false,
                employeeName : '',

                outAllDay : false,
                start : null,
                end : null,

                openState : false
            },

            formulas : {
                title : function(data) {
                    return ( data('globalException') ? i18n.gettext('Global') : i18n.gettext('Employee') ) + ' ' + i18n.gettext('Exception');
                },

                stateCls : function(data) {
                    return data('openState') ? 'fa-minus-square-o' : 'fa-plus-square-o';
                }
            },

            stores : {
                workPeriodExceptions : {
                    type : 'criterion_employee_attendance_work_period_exceptions'
                }
            }
        },

        bind : {
            title : '{title}'
        },

        draggable : false,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        items : [
            {
                xtype : 'component',
                hidden : true,
                bind : {
                    html : i18n.gettext('Employee') + ': ' + '<span class="bold">{employeeName}</span>',
                    hidden : '{globalException}'
                },
                margin : '0 0 20 0'
            },
            {
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                margin : '0 0 20 0',
                items : [
                    {
                        xtype : 'component',
                        bind : {
                            html : '<div class="ldate">{date:date("l")}</div>' +
                            '<div class="date">{date:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}</div>'
                        },
                        margin : '35 30 0 0'
                    },
                    {
                        xtype : 'criterion_time_field',
                        fieldLabel : i18n.gettext('Start'),
                        triggerCls : Ext.baseCSSPrefix + 'form-trigger-clock',
                        labelAlign : 'top',
                        allowBlank : false,
                        width : 150,
                        margin : '0 10 0 0',
                        disabled : true,
                        bind : {
                            disabled : '{outAllDay}',
                            value : '{start}'
                        }
                    },
                    {
                        xtype : 'criterion_time_field',
                        fieldLabel : i18n.gettext('End'),
                        triggerCls : Ext.baseCSSPrefix + 'form-trigger-clock',
                        labelAlign : 'top',
                        allowBlank : false,
                        width : 150,
                        margin : '0 20 0 0',
                        disabled : true,
                        bind : {
                            disabled : '{outAllDay}',
                            value : '{end}'
                        }
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Out All Day'),
                        labelWidth : 90,
                        inputValue : true,
                        margin : '35 0 0 0',
                        bind : {
                            value : '{outAllDay}'
                        }
                    }
                ]
            },

            {
                xtype : 'component',
                hidden : true,
                reference : 'trigger',
                cls : 'trigger',
                bind : {
                    html : '<div><i class="fa {stateCls}"></i><span>Show Affected Employees</span></div>',
                    hidden : '{!globalException}'
                },
                margin : '20 0 5 0'
            },
            {
                xtype : 'criterion_gridpanel',
                hidden : true,
                bind : {
                    store : '{workPeriodExceptions}',
                    hidden : '{!globalException || !openState}'
                },
                height : 300,
                cls : 'affected-employees-grid',
                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Last Name'),
                        dataIndex : 'lastName'
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('First Name'),
                        dataIndex : 'firstName'
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 150,
                        text : i18n.gettext('Employee ID'),
                        dataIndex : 'employeeNumber'
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Exception Start'),
                        dataIndex : 'scheduledStart',
                        encodeHtml : false,
                        renderer : renderer
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Exception End'),
                        dataIndex : 'scheduledEnd',
                        encodeHtml : false,
                        renderer : renderer
                    }
                ]
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Delete'),
                ui : 'remove',
                hidden : true,
                bind : {
                    hidden : '{globalException || !hasExceptions}'
                },
                handler : 'handleDelete'
            },

            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                handler : 'handleSave'
            }
        ]
    }
});
