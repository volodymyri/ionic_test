Ext.define('criterion.controller.ess.time.ShiftAssignments', function() {

    return {

        extend : 'criterion.controller.WeekView',

        alias : 'controller.criterion_selfservice_time_shift_assignments',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        listen : {
            global : {
                employeeTimezone : 'onEmployeeTimezoneUpdate'
            }
        },

        onEmployeeTimezoneUpdate : function(timezoneCd, timezoneRec) {
            this.getViewModel().set('timezone', (timezoneRec ? timezoneRec.get('description') : ''));
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        onEmployeeChange : function() {},

        load : function(opts) {
            var vm = this.getViewModel(),
                me = this,
                employeeId = this.getEmployeeId(),
                timezoneCd = ess.Application.getEmployeeTimezoneCd(),
                timezoneRec = ess.Application.getEmployeeTimezoneRecord();

            if (!employeeId) {
                return;
            }

            vm.set('timezone', (timezoneRec ? timezoneRec.get('description') : ''));

            this.callParent([
                {
                    callback : function(recs) {
                        Ext.each(recs, function(rec) {
                            rec.set('timezoneCd', timezoneCd);
                        });

                        me.calendarRefresh();
                    },
                    params : Ext.apply({
                        employeeId : employeeId
                    }, opts || {})
                }
            ]);
        },

        createEditor : function(editorCfg, record) {
            var timezoneRec = ess.Application.getEmployeeTimezoneRecord();

            editorCfg.viewModel = {
                data : {
                    employeeId : this.getEmployeeId(),
                    timezone : timezoneRec ? timezoneRec.get('description') : ''
                }
            };
            return this.callParent([editorCfg, record]);
        }

    };
});
