Ext.define('criterion.view.employee.timesheet.horizontal.Totals', function() {

    return {

        extend : 'Ext.Container',

        alias : 'widget.criterion_employee_timesheet_horizontal_totals',

        layout : {
            type : 'hbox',
            align : 'center'
        },

        defaults : {
            margin : '0 0 0 10'
        },

        margin : 0,

        items : [
            // dynamic
        ],

        initComponent : function() {
            this.callParent(arguments);
        },

        update : function() {
            this.removeAll();
            this.add(this.createColumns());
        },

        createColumns : function() {
            var parentVm = this.up('criterion_employee_timesheet_horizontal').getViewModel(),
                columns = [],
                timesheet = parentVm.get('timesheetRecord'),
                totals = timesheet.totals(),
                start = new Date(timesheet.get('startDate')),
                end = new Date(timesheet.get('endDate')),
                isManualDay = parentVm.get('timesheetRecord.timesheetType.entryType') == criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY;

            for (var d = start, i = 1; d <= end; d.setDate(d.getDate() + 1), i++) {
                columns.push(this.createComponent(totals.findRecord('date', new Date(d)), isManualDay))
            }

            return columns;
        },

        createComponent : function(total, isManualDay) {
            return {
                xtype : 'container',
                bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('dateCol'),
                viewModel : {
                    data : {
                        total : total
                    },
                    formulas : {
                        regularHours : function(vmget) {
                            return vmget('total.regularHours');
                        },
                        overtimeHours : function(vmget) {
                            return vmget('total.overtimeHours');
                        },
                        regularDays : function(vmget) {
                            return Ext.util.Format.employerAmountPrecision(vmget('total.regularDays'));
                        },
                        overtimeDays : function(vmget) {
                            return Ext.util.Format.employerAmountPrecision(vmget('total.overtimeDays'));
                        }
                    }
                },

                defaults : {
                    width : '100%'
                },

                items : !isManualDay ? [
                    {
                        xtype : 'component',
                        padding : '0 0 0 10',
                        cls : 'total-hours',
                        bind : {
                            html : '{total.loggedHours}<br/>'
                        }
                    },
                    {
                        xtype : 'component',
                        padding : '0 0 0 10',
                        bind : {
                            html : '{regularHours}',
                            hidden : '{!showTotals}'
                        },
                        margin : '15 0 0 0'
                    },
                    {
                        xtype : 'component',
                        padding : '0 0 0 10',
                        bind : {
                            html : '{overtimeHours}',
                            hidden : '{!showTotals}'
                        },
                        margin : '15 0 0 0'
                    }
                ] : [
                    {
                        xtype : 'component',
                        padding : '0 0 0 10',
                        cls : 'total-hours',
                        bind : {
                            html : '{total.loggedDays:employerAmountPrecision}<br/>'
                        }
                    },
                    {
                        xtype : 'component',
                        padding : '0 0 0 10',
                        bind : {
                            html : '{regularDays}',
                            hidden : '{!showTotals}'
                        },
                        margin : '15 0 0 0'
                    },
                    {
                        xtype : 'component',
                        padding : '0 0 0 10',
                        bind : {
                            html : '{overtimeDays}',
                            hidden : '{!showTotals}'
                        },
                        margin : '15 0 0 0'
                    }
                ]
            };
        }
    }
});
