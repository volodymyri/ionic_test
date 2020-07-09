Ext.define('criterion.view.scheduling.ShiftForm', function() {

    return {

        extend : 'criterion.view.FormView',

        alias : 'widget.ess_modern_scheduling_shift_form',

        requires : [
            'criterion.controller.scheduling.ShiftForm'
        ],

        controller : {
            type : 'criterion_scheduling_shift_form'
        },

        viewModel : {
            data : {
                record : null,
                showActionPanel : false,
                startTime : null,
                endTime : null
            }
        },

        defaults : {
            labelWidth : 150
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : i18n.gettext('Shift Details'),
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
                actions : []
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
                xtype : 'textfield',
                label : i18n.gettext('Shift Name'),
                bind : '{record.name}',
                readOnly : true
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
                        width : 140,
                        bind : {
                            value : '{record.startTimestamp}'
                        },
                        readOnly : true
                    },
                    {
                        xtype : 'criterion_timefield',
                        hideLabel : true,
                        flex : 1,
                        margin : '45 0 0 10',
                        bind : {
                            value : '{startTime}'
                        },
                        readOnly : true,
                        format : criterion.consts.Api.TIME_FORMAT,
                        valueField : 'date'
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
                        width : 140,
                        readOnly : true,
                        bind : {
                            value : '{record.endTimestamp}'
                        }
                    },
                    {
                        xtype : 'criterion_timefield',
                        hideLabel : true,
                        flex : 1,
                        margin : '45 0 0 10',
                        readOnly : true,
                        bind : {
                            value : '{endTime}'
                        },
                        format : criterion.consts.Api.TIME_FORMAT,
                        valueField : 'date'
                    }
                ]
            },

            {
                xtype : 'textfield',
                label : i18n.gettext('Location'),
                bind : '{record.locationName}',
                readOnly : true
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Area'),
                bind : {
                    value : '{record.areaName}',
                    hidden : '{!record.areaName}'
                },
                readOnly : true
            },
            {
                xtype : 'togglefield',
                label : i18n.gettext('Recurring'),
                readOnly : true,
                labelAlign : 'left',
                bind : {
                    value : '{record.recurring}'
                }
            }
        ]
    }
});
