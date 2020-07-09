describe("Timesheet Vertical", function(t) {

    // helpers

    var app, view, viewC, vm, WAIT_MS = 10, createdTs, currentTs,
        CONSTS = {
            EMPLOYEE_ID : 7,
            HOURS_ADD : {
                TIMESHEET_ID : 3
            },
            HOURS_UPDATE : {
                TIMESHEET_ID : 2
            },
            HOURS_DELETE : {
                TIMESHEET_ID : 1
            }
        };

    function makeView(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody(),
            controller : {
                closeAfterSave : false
            }
        }, config || {});

        view = Ext.create('criterion.view.employee.timesheet.Vertical', config);

        viewC = view.getController();
        vm = view.getViewModel();
    }

    function setIdentity(employeeId, employerId) {
        viewC.setIdentity({
            employee : Ext.create('criterion.model.Employee', {id : employeeId}),
            employer : Ext.StoreManager.lookup('Employers').getById(employerId || 1)
        });
        viewC.onBeforeEmployeeChange(); // actually we need real employee record here.. todo
    }

    function createTs() {
        return criterion.Api.requestWithPromise({
            url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET,
            method : 'POST',
            urlParams : {
                employeeId : CONSTS.EMPLOYEE_ID, // initiator
                isNext : true,
                timezoneOffset : 0
            },
            jsonData : {
                employeeId : CONSTS.EMPLOYEE_ID // target
            }
        }).then({
            scope : this,
            success : function(result) {
                createdTs = Ext.create('criterion.model.employee.Timesheet', result);
                createdTs.get('isCurrent') && (currentTs = createdTs);
            }
        })
    }

    function getTaskHoursInput(idx) {
        return Ext.ComponentQuery.query('#taskHoursString')[idx]
    }
    function getTaskDeleteBtn(idx) {
        return Ext.ComponentQuery.query('#taskDelete')[idx]
    }

    function chainCreateTs() {
        return [
            {
                waitFor : 'ThrottledAjax'
            },
            function(next) {
                makeView({
                    viewModel : {
                        data : {
                            timesheetId : createdTs.getId(),
                            timesheetRecord : createdTs
                        }
                    }
                });
                next();
            },
            function(next) {
                viewC.load(true);
                next();
            },
            {
                waitFor : 'ThrottledAjax'
            }
        ]
    }

    function chainOpenTs(timesheetId) {
        return [
            function(next) {
                makeView({
                    viewModel : {
                        data : {
                            timesheetId : timesheetId
                        }
                    }
                });
                next();
            },
            function(next) {
                viewC.load();
                next();
            },
            {
                waitFor : 'ThrottledAjax'
            }
        ]
    }

    function chainSetTaskHours(idx, val) {
        return [
            {
                target : function() {
                    return getTaskHoursInput(idx)
                },
                setValue : val
            },
            function(next) {
                var input = getTaskHoursInput(idx);
                input.fireEvent('blur', input, input);
                next();
            }
        ]
    }

    // setup / teardown methods

    t.beforeEach(function() {
    });

    t.afterEach(function() {
        view = Ext.destroy(view);
    });

    // asserts

    function assertDetailHoursMinutes(t, day, detail, hours, minutes) {
        var record = vm.get('timesheetVertical').days().getAt(day).details().getAt(detail);

        t.expect(record.get('hours')).toBe(hours);
        t.expect(record.get('minutes')).toBe(minutes);
    }

    // setup environment

    t.wait('setup');

    criterion.detectDirtyForms = false;

    Ext.Deferred.sequence([
         function() {
            return criterion.Api.updateDatabase('timesheet_vertical')
         },
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

            t.describe('Regular (default) hours tests', function(t) {

                t.it('It should be able to save hours to default paycode', function(t) {
                    t.chain([].concat(
                        chainOpenTs(CONSTS.HOURS_ADD.TIMESHEET_ID),
                        chainSetTaskHours(0, '01:00'),
                        chainSetTaskHours(1, '02:00'),
                        [
                            {
                                action : 'click',
                                target : '>> #btnSave'
                            },
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                assertDetailHoursMinutes(t, 0,0,1,0);
                                assertDetailHoursMinutes(t, 1,0,2,0);
                                assertDetailHoursMinutes(t, 2,0,0,0);
                                next();
                            }
                        ]
                    ));
                });

                t.it('It should be able to update hours', function(t) {
                    t.chain([].concat(
                        chainOpenTs(CONSTS.HOURS_UPDATE.TIMESHEET_ID),
                        {
                            wait : WAIT_MS // vm & component updates
                        },
                        [
                            function(next) {
                                assertDetailHoursMinutes(t, 0,0,0,30);
                                assertDetailHoursMinutes(t, 1,0,0,0);
                                next();
                            }
                        ],
                        chainSetTaskHours(0, '01:00'),
                        [
                            {
                                action : 'click',
                                target : '>> #btnSave'
                            },
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                assertDetailHoursMinutes(t, 0,0,1,0);
                                assertDetailHoursMinutes(t, 1,0,0,0);
                                next();
                            }
                        ]
                    ));
                });
            });

            t.describe('Tasks tests', function(t) {
                t.it('It should not alter timesheet if nothing was changed', function(t) {
                    function assertTaskValues(t) {
                        assertDetailHoursMinutes(t, 0,0,1,0);
                        assertDetailHoursMinutes(t, 0,1,1,30);
                        assertDetailHoursMinutes(t, 1,0,2,0);
                    }

                    t.chain([].concat(
                        chainOpenTs(CONSTS.HOURS_DELETE.TIMESHEET_ID),
                        {
                            wait : WAIT_MS // vm & component updates
                        },
                        [
                            function(next) {
                                assertTaskValues(t);
                                next();
                            },
                            {
                                action : 'click',
                                target : '>> #btnSave'
                            },
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                assertTaskValues(t);
                                next();
                            }
                        ]
                    ));
                });
                t.it('It should be able to delete task details', function(t) {
                    t.chain([].concat(
                        chainOpenTs(CONSTS.HOURS_DELETE.TIMESHEET_ID),
                        {
                            wait : WAIT_MS // vm & component updates
                        },
                        [
                            function(next) {
                                assertDetailHoursMinutes(t, 0,0,1,0);
                                assertDetailHoursMinutes(t, 0,1,1,30);
                                assertDetailHoursMinutes(t, 1,0,2,0);
                                next();
                            },
                            {
                                action : 'click',
                                target : function() {
                                    return getTaskDeleteBtn(0)
                                }
                            },
                            {
                                action : 'click',
                                target : function() {
                                    return getTaskDeleteBtn(0)
                                }
                            },
                            {
                                action : 'click',
                                target : function() {
                                    return getTaskDeleteBtn(0)
                                }
                            },
                            {
                                action : 'click',
                                target : '>> #btnSave'
                            },
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                assertDetailHoursMinutes(t, 0,0,0,0);
                                t.expect(vm.get('timesheetVertical').days().getAt(0).details().count()).toBe(1); // second detail gone
                                assertDetailHoursMinutes(t, 1,0,0,0);
                                next();
                            }
                        ]
                    ));
                })
            });

            });
    });

});
