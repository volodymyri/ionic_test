Ext.define('ess.view.dashboard.timesheet.Base', function() {

    return {
        alias : 'widget.ess_modern_dashboard_timesheet_base',

        extend : 'Ext.Panel',

        requires : [
            'Ext.Panel',
            'ess.controller.dashboard.timesheet.Base',
            'criterion.store.employee.timesheet.ByDate',
            'criterion.store.CustomData',
            'criterion.store.employee.timesheet.LIncomes',
            'criterion.store.TimesheetTypes'
        ],

        controller : 'ess_modern_dashboard_timesheet_base',

        viewModel : {
            data : {
                detailRecord : null,

                isManualDay : false, // ENTRY_TYPE.MANUAL_DAY

                /**
                 * True to reveal timesheet day details.
                 */
                showDetails : false
            },
            formulas : {
                detailHeaderText : function(vmget) {
                    return vmget('detailRecord') ? 'Details &ndash; ' + Ext.Date.format(vmget('detailRecord').get('date'), criterion.consts.Api.SHOW_DATE_FORMAT) : '';
                },
                // for support iOS & Safari
                startDate : {
                    bind : {
                        bindTo : '{workflowLog}',
                        deep : true
                    },
                    get : function(workflowLog) {
                        return Ext.Date.parse(this.get('workflowLog.actualData.startDate'), criterion.consts.Api.DATE_FORMAT);
                    }
                },
                endDate : {
                    bind : {
                        bindTo : '{workflowLog}',
                        deep : true
                    },
                    get : function(workflowLog) {
                        return Ext.Date.parse(this.get('workflowLog.actualData.endDate'), criterion.consts.Api.DATE_FORMAT);
                    }
                },
                notes : function(vmget) {
                    var notes = vmget('workflowLog.actualData.notes');

                    return !!notes ? Ext.String.format('<tr><td class="bold">{0}</td><td>{1}</td></tr>', i18n.gettext('Notes'), notes) : '';
                }
            },
            stores : {

                timesheetDetails : {
                    type : 'criterion_employee_timesheet_details_by_date'
                },

                customdata : {
                    type : 'criterion_customdata',
                    sorters : [{
                        property : 'sequenceNumber',
                        direction : 'ASC'
                    }]
                },
                timesheetTypes : {
                    type : 'criterion_timesheet_types'
                },

                incomeCodes : {
                    type : 'criterion_employee_timesheet_lincomes'
                }
            }
        },

        layout : 'vbox',

        timesheetDetailStoreName : 'timesheetDetails',

        constructor : function(config) {
            config.items = [
                {
                    cls : 'ess-dataview-two-col-table ess-inbox-timesheet-summary',

                    bind : {
                        html : '<table>' +
                        '<tr><td class="bold">Request Time</td><td>{workflowLog.actionTime:date("m/d/Y H:i")}</td></tr>' +
                        '<tr><td class="bold">Start Date</td><td>{startDate:date("m/d/Y")}</td></tr>' +
                        '<tr><td class="bold">End Date</td><td>{endDate:date("m/d/Y")}</td></tr>' +
                        '{notes}' +
                        '</table>'
                    }
                },
                // list
                {
                    xtype : 'component',
                    cls : 'criterion-section-header',
                    html : 'Days',
                    bind : {
                        hidden : '{showDetails}'
                    }
                },
                {
                    xtype : 'dataview',
                    loadingText : false,
                    scrollable : false,

                    bind : {
                        store : '{' + this.timesheetDetailStoreName + '}',
                        hidden : '{showDetails}'
                    },

                    listeners : {
                        itemTap : 'onTimesheetTap'
                    },

                    itemCls : 'ess-inbox-timesheet-item',

                    itemTpl : '<p class="ess-inbox-timesheet-item-date">{date:date("m/d/Y")}</p>' +
                    '<p class="ess-inbox-timesheet-item-hours">{totalValue} {totalUnit}</p>'
                },
                // details
                {
                    xtype : 'container',
                    layout : 'hbox',
                    cls : 'criterion-section-header',
                    bind : {
                        hidden : '{!showDetails}'
                    },
                    items : [
                        {
                            xtype : 'component',
                            cls : 'inner-title',
                            bind : {
                                html : '{detailHeaderText}'
                            }
                        },
                        {
                            flex : 1
                        },
                        {
                            xtype : 'button',
                            text : '&larr; Back to List',
                            listeners : {
                                tap : 'onDetailsBack'
                            }
                        }
                    ]
                },
                {
                    xtype : 'dataview',
                    reference : 'detailDataView',
                    bind : {
                        hidden : '{!showDetails}'
                    },
                    hidden : true,
                    scrollable : false,
                    itemCls : 'ess-inbox-timesheet-detail-item',
                    itemTpl : '' // see controller
                }
            ];

            this.callParent(arguments);
        }
    }
});
