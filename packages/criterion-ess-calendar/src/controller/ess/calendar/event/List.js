Ext.define('criterion.controller.ess.calendar.event.List', function() {

    return {
        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_selfservice_calendar_event_list',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        load : function() {
            let employeeId = this.getEmployeeId(),
                allowAddEvents = false,
                vm = this.getViewModel(),
                view = this.getView(),
                compEvents = vm.getStore('compEvents');

            if (!employeeId) {
                return false;
            }

            Ext.Deferred.sequence([
                function() {
                    return compEvents.loadWithPromise();
                },
                function() {
                    return vm.getStore('events').loadWithPromise();
                }
            ]).then(function() {
                compEvents.each(compEvent => {
                    if (compEvent.get('canPostEss')) {
                        allowAddEvents = true;
                    }
                });

                view.fireEvent('setCompEvents', {
                    compEventsCount : compEvents.getCount(),
                    allowAddEvents : allowAddEvents
                });
            });
        },

        getEmptyRecord : function() {
            return {};
        }

    }
});
