Ext.define('criterion.view.employee.timesheet.aggregate.TaskFTEHours', function() {

    var _cmpWidthDelta = -10;

    return {

        extend : 'Ext.Container',

        alias : 'widget.criterion_employee_timesheet_aggregate_task_fte_hours',

        padding : '10 0 10 0',

        userCls : 'timesheet-horizontal-row',

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.timesheet.aggregate.Task
                 */
                timesheetTask : null
            }
        },

        layout : {
            type : 'hbox'
        },

        defaults : {
            margin : '0 10'
        },

        config : {
            timesheetTask : null,
            editable : true,
            isFTE : false
        },

        items : [
            // dynamic
        ],

        initComponent : function() {
            var me = this,
                vm = this.getViewModel(),
                timesheetTask = me.timesheetTask,
                isFTE = me.isFTE,
                editable = this.editable;

            me.items = [];

            if (isFTE) {
                me.items.push(
                    {
                        xtype : 'container',

                        bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('fteCol', {}, _cmpWidthDelta),

                        items : [
                            {
                                xtype : 'numberfield',

                                ui : 'mini',

                                margin : 0,

                                bind : {
                                    value : '{timesheetTask.fte}'
                                },

                                width : '100%',

                                readOnly : !editable
                            }
                        ]
                    }
                );
            }

            me.items.push(
                {
                    xtype : 'container',

                    bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('hoursCol', {}, _cmpWidthDelta),

                    items : [
                        {
                            xtype : 'numberfield',

                            ui : 'mini',

                            margin : 0,

                            bind : {
                                value : '{timesheetTask.totalHours}'
                            },
                            width : '100%',

                            readOnly : !editable || (editable && isFTE),

                            decimalPrecision : 5
                        }
                    ]
                },
                {
                    xtype : 'component'
                }
            );

            me.callParent(arguments);
        }
    }
});
