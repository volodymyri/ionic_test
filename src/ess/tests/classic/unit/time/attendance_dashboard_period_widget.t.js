describe("Attendance Dashboard Period Widget", function(t) {

    // helpers

    var app, view, vm,
        WAIT_MS = 10;

    function makeView(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody()
        }, config || {});

        view = Ext.create('criterion.view.ess.time.attendanceDashboard.PeriodWidget', config);

        vm = view.getViewModel();
    }

    // setup / teardown methods
    function cqd(query) {
        return Ext.ComponentQuery.query(query)[0]
    }

    t.beforeEach(function() {
    });

    t.afterEach(function() {
        view = Ext.destroy(view);
        vm = Ext.destroy(vm);
    });

    // asserts

    // setup environment

    var attendanceDashboardData = [
        {
            id : 1,
            date : '2017.01.21',
            employeeId : 1,
            lastName : 'Bishop',
            firstName : 'Tracy',
            employeeNumber : '84567',
            totalTimesheetHours : 1.1,
            hasExceptions : true,
            employeeTimezoneCd : 5100,
            scheduled : {
                start : '09:00',
                end : '18:00',
                isFullDayOff : false
            },
            actual : [
                {
                    start : '00:00',
                    end : '08:00',
                    violation : false,
                    noPunchOrOutForDay : false
                },
                {
                    start : '16:00',
                    end : '18:00',
                    violation : false,
                    noPunchOrOutForDay : false
                },
                {
                    start : '20:00',
                    end : '23:59',
                    violation : false,
                    noPunchOrOutForDay : false
                }
            ]
        },
        {
            id : 2,
            date : '2017.01.21',
            employeeId : 2,
            lastName : 'Second',
            firstName : 'Employee',
            employeeNumber : '234234',
            totalTimesheetHours : 10.1,
            hasExceptions : false,
            employeeTimezoneCd : 5100,
            scheduled : {
                start : '09:00',
                end : '17:00',
                isFullDayOff : false
            },
            actual : [
                {
                    start : '11:00',
                    end : '12:00',
                    violation : true,
                    noPunchOrOutForDay : false
                },
                {
                    start : '17:00',
                    end : '19:00',
                    violation : true,
                    noPunchOrOutForDay : false
                }
            ]
        },
        {
            id : 3,
            date : '2017.01.21',
            employeeId : 3,
            lastName : 'Th',
            firstName : 'Employee',
            employeeNumber : '234234',
            totalTimesheetHours : 9.1,
            hasExceptions : false,
            employeeTimezoneCd : 5100,
            scheduled : {
                start : '09:00',
                end : '18:00',
                isFullDayOff : false
            },
            actual : [
                {
                    start : '10:00',
                    end : '17:00',
                    violation : false,
                    noPunchOrOutForDay : true
                }
            ]
        },
        {
            id : 4,
            date : '2017.01.21',
            employeeId : 4,
            lastName : 'Fr',
            firstName : 'Employee',
            employeeNumber : '444',
            totalTimesheetHours : 5.5,
            hasExceptions : true,
            employeeTimezoneCd : 5100,
            scheduled : {
                start : null,
                end : null,
                isFullDayOff : true
            },
            actual : []
        }
    ];

    Ext.define('criterion.data.proxy.Test', function() {
        return {
            extend : 'Ext.data.proxy.Memory',
            alias : 'proxy.criterion_test_proxy',

            config : {
                extraParams : {}
            }
        }
    });

    Ext.override(criterion.store.employee.attendance.Dashboard, {
        setProxy : function(params) {
            if (params && params.type) {
                params.type = 'criterion_test_proxy';
                params.data = Ext.clone(attendanceDashboardData);
            }
            this.callParent(arguments);
        },

        load : function(opt) {
            this.callParent(arguments);
        }
    });

    var attendanceDashboardStore = Ext.create('criterion.store.employee.attendance.Dashboard');

    t.wait('setup');

    criterion.detectDirtyForms = false;

    Ext.Deferred.sequence([
        function() {
            return criterion.Api.isAuthenticated();
        },
        function() {
            return criterion.CodeDataManager.loadCodeTables();
        }
    ]).then(function() {
        app = Ext.create('criterion.Application', {name : 'ut'});

        Ext.GlobalEvents.on('baseStoresLoaded', function() {

            t.endWait('setup');

            // base
            t.describe('Base init', function(t) {

                // todo :)
                t.it('check', function(t) {
                    makeView();

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            view.setAdRecord(attendanceDashboardStore.first());
                            next();
                        },
                        {
                            wait : WAIT_MS
                        }
                    ])
                });
            });

        });
    });
});
