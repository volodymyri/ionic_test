Ext.define('ess.view.time.timeOff.Detail', function() {

    var currentYear = new Date().getFullYear(),
        yearFrom = (currentYear - 1),
        yearTo = (currentYear + 1);

    return {

        alias : 'widget.criterion_time_timeoff_detail',

        extend : 'criterion.view.FormView',

        requires : [
            'ess.controller.time.timeOff.Detail'
        ],

        controller : {
            type : 'ess_modern_time_timeoff_detail'
        },

        viewModel : {
            data : {
                showActionPanel : false
            }
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : i18n.gettext('Time Off Detail'),
                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-clear',
                        handler : 'handleCancel'
                    }
                ],
                actions : []
            },
            {
                xtype : 'component',
                cls : 'timezone-info',
                docked : 'top',
                bind : {
                    html : '<i class="icon"></i><span class="text">{record.timezoneDescription}</span>'
                }
            },
            {
                xtype : 'datepickerfield',
                label : i18n.gettext('Date'),
                margin : '20 0 0 0',
                edgePicker : {
                    yearFrom : yearFrom,
                    yearTo : yearTo
                },
                required : true,
                bind : {
                    value : '{record.timeOffDate}',
                    disabled : '{!isPhantom}'
                }
            },
            {
                xtype : 'togglefield',
                label : i18n.gettext('All Day'),
                reference : 'allDayDetailToggler',
                labelAlign : 'left',
                bind : {
                    value : '{record.isFullDay}'
                },
                name : 'isFullDay'
            },
            {
                xtype : 'numberfield',
                name : 'duration',
                label : i18n.gettext('Custom duration'),
                placeholder : 'Duration in hours',
                required : true,
                bind : {
                    value : '{record.duration}',
                    hidden : '{record.isFullDay}',
                    disabled : '{record.isFullDay}'
                }
            },
            {
                xtype : 'criterion_timefield',
                label : i18n.gettext('Start Time'),
                required : true,
                bind : {
                    value : '{record.startTime}',
                    hidden : '{record.isFullDay}',
                    disabled : '{record.isFullDay}'
                },
                format : criterion.consts.Api.TIME_FORMAT
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
                            hidden : '{isPhantom}'
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
                        flex : 1
                    }
                ]
            }
        ],

        setIsAllDayOnly : function(isAllDayOnly) {
            var allDayDetailToggler = this.down('[reference=allDayDetailToggler]');

            Ext.defer(function() { // delay for toggling
                if (isAllDayOnly) {
                    allDayDetailToggler.setValue(true);
                }
                allDayDetailToggler.setDisabled(isAllDayOnly);
            }, 500);
        }

    }
});
