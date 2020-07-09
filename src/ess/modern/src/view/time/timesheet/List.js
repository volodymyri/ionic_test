Ext.define('ess.view.time.timesheet.List', function() {

    return {
        alias : 'widget.ess_modern_time_timesheet_list',

        extend : 'Ext.container.Container',

        cls : 'ess-timesheet-detail-list',

        viewModel : {},

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : 'Timesheets',

                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-add',
                        hidden : true,
                        bind : {
                            hidden : '{hideAddTimesheetButton}'
                        },
                        handler : 'handleAddTimesheet'
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',
                id : 'timesheetList',
                cls : 'ess-grid-with-workflow',
                bind : {
                    store : '{employeeTimesheets}'
                },
                flex : 1,
                controller : null,

                itemConfig : {
                    viewModel : {
                        data : {},
                        formulas : {
                            dateCls : function(data) {
                                return Ext.Date.between(new Date(), data('record.startDate'), data('record.endDate')) ? 'currentDate' : '';
                            }
                        }
                    }
                },

                columns : [
                    {
                        text : '',
                        width : 14,
                        minWidth : 14,
                        cls : 'workflow-cell-header',
                        resizable : false,
                        sortable : false,
                        menuDisabled : true,
                        cell : {
                            cls : 'workflow-cell',
                            width : 14,
                            bind : {
                                bodyCls : '{record.timesheetStatusCode}',
                                cellCls : '{record.formatCode} {dateCls}'
                            }
                        },
                        hideShowMenuItem : {
                            text : 'Status'
                        }
                    },
                    {
                        xtype : 'datecolumn',
                        text : 'Start Date',
                        dataIndex : 'startDate',
                        width : 125,
                        cell : {
                            bind : {
                                cellCls : '{dateCls}'
                            }
                        }
                    },
                    {
                        xtype : 'datecolumn',
                        text : 'End Date',
                        dataIndex : 'endDate',
                        width : 125,
                        cell : {
                            bind : {
                                cellCls : '{dateCls}'
                            }
                        }
                    },
                    {
                        text : 'Hours',
                        dataIndex : 'formattedTotalHours',
                        renderer : function(value) {
                            return criterion.Utils.hourStrToFormattedStr(value);
                        },
                        sortable : false,
                        flex : 1,
                        cell : {
                            bind : {
                                cellCls : '{dateCls}'
                            },
                            encodeHtml : false
                        }
                    }
                    //<debug>
                    , {
                        text : '',
                        dataIndex : 'formatCode',
                        hidden : !criterion.Utils.isLocalDev(),
                        width : 80,
                        hideShowMenuItem : {
                            hidden : true
                        }
                    }
                    //</debug>
                ]
            }
        ]
    };
});
