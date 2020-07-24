describe("Attendance Dashboard", function(t) {

    // helpers

    var app, view, viewC, vm,
        params,
        lastRequestParams,
        WAIT_MS = 10;

    function makeView(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody(),
            controller : {

            }
        }, config || {});

        view = Ext.create('criterion.view.ess.time.AttendanceDashboard', config);

        viewC = view.getController();
        vm = view.getViewModel();
        viewC.handleActivate();
    }

    // setup / teardown methods
    function cqd(query) {
        return Ext.ComponentQuery.query(query)[0]
    }

    function setValueToField(field, value) {
        field.focus();
        Ext.defer(function() {
            field.setValue(value);
            field.publishValue();
        });
    }

    t.beforeEach(function() {
    });

    t.afterEach(function() {
        view = Ext.destroy(view);
        viewC = Ext.destroy(viewC);
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
    var employeeGroupsData = [
        {
            "id" : 11,
            "employerId" : 4,
            "name" : "A record",
            "description" : "Employees in the West Hill facility",
            "isDynamic" : false,
            "formula" : null,
            "employeeCount" : 4,
            "employerName" : "Atlantic Metro Health Network"
        },
        {
            "id" : 22,
            "employerId" : 4,
            "name" : "B record",
            "description" : "Employees at Bayside",
            "isDynamic" : false,
            "formula" : null,
            "employeeCount" : 11,
            "employerName" : "Atlantic Metro Health Network"
        }
    ];
    var workPeriodExceptionData = [
        {
            id : '1_2017.01.21',
            date : '2017.01.21',
            employeeId : 1,
            lastName : 'Bishop',
            firstName : 'Tracy',
            employeeNumber : '84567',
            scheduledStart : '09:00',
            scheduledEnd : '18:00',
            isRemoved : false
        },
        // out all day
        {
            id : '2_2017.01.21',
            date : '2017.01.21',
            employeeId : 2,
            lastName : 'Lambart',
            firstName : 'Elise',
            employeeNumber : '34567',
            scheduledStart : null,
            scheduledEnd : null,
            isRemoved : true
        },
        // without exception
        {
            id : '3_2017.01.21',
            date : '2017.01.21',
            employeeId : 3,
            lastName : 'Bowen',
            firstName : 'Allan',
            employeeNumber : '345345',
            scheduledStart : null,
            scheduledEnd : null,
            isRemoved : false
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
            params = Ext.clone(opt.params);
            this.callParent(arguments);
        }
    });
    Ext.override(criterion.store.EmployeeGroups, {
        setProxy : function(params) {
            if (params && params.type) {
                params.type = 'criterion_test_proxy';
                params.data = Ext.clone(employeeGroupsData);
            }
            this.callParent(arguments);
        }
    });
    Ext.override(criterion.store.employee.attendance.WorkPeriodExceptions, {
        setProxy : function(params) {
            if (params && params.type) {
                params.type = 'criterion_test_proxy';
                params.data = Ext.clone(workPeriodExceptionData);
            }
            this.callParent(arguments);
        },

        load : function(opt) {
            params = Ext.clone(opt.params);
            this.callParent(arguments);
        }
    });

    Ext.override(criterion.Api, {
        requestWithPromise : function(opts) {
            var dfd = Ext.create('Ext.Deferred');

            lastRequestParams = Ext.clone(opts);

            dfd.resolve({"success" : true});

            return dfd.promise;
        }
    });

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

                t.it('Should load test data', function(t) {
                    makeView();

                    t.chain([
                        function(next) {
                            viewC.load();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(vm.get('attendanceDashboard').count()).toBe(0);
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            vm.set('employeeGroupIds', [11, 22]);
                            viewC.load();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(vm.get('attendanceDashboard').count()).toBe(4);
                            next();
                        }
                    ])
                });
            });

            // options
            t.describe('Change options', function(t) {

                t.it('Should open options windows', function(t) {
                    makeView();

                    t.chain([
                        function(next) {
                            view.down('[handler=handleOptions]').click();
                            next();
                        },
                        function(next) {
                            t.expect(t.isElementVisible('>> criterion_selfservice_time_attendance_dashboard_options')).toBe(true);
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Cancel]'
                        },
                        function(next) {
                            t.expect(Ext.ComponentQuery.query('criterion_selfservice_time_attendance_dashboard_options').length).toBe(0);
                            next();
                        }
                    ])
                });

                t.it('Set one employee group', function(t) {
                    makeView();

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            view.down('[handler=handleOptions]').click();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            var employeeGroupsField = cqd('criterion_selfservice_time_attendance_dashboard_options criterion_tagfield');

                            setValueToField(employeeGroupsField, 11);

                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Apply]'
                        },
                        function(next) {
                            t.expect(params.employeeGroupIds).toBe('11');
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(vm.get('employeeGroupIds').length).toBe(1);
                            t.expect(vm.get('employeeGroupIds')[0]).toBe(11);

                            next();
                        }
                    ]);

                });

                t.it('Set two employee group', function(t) {
                    makeView();

                    t.chain([
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            view.down('[handler=handleOptions]').click();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            var employeeGroupsField = cqd('criterion_selfservice_time_attendance_dashboard_options criterion_tagfield');
                            setValueToField(employeeGroupsField, [11, 22]);
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Apply]'
                        },
                        function(next) {
                            t.expect(params.employeeGroupIds).toBe('11,22');
                            next();
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.expect(vm.get('employeeGroupIds').length).toBe(2);
                            t.expect(vm.get('employeeGroupIds')).toEqual([11, 22]);

                            next();
                        }
                    ]);

                });

                t.it('Set new date', function(t) {
                    makeView();

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            view.down('[handler=handleOptions]').click();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            var field = cqd('criterion_selfservice_time_attendance_dashboard_options datefield');
                            setValueToField(field, new Date('2017/01/10 00:00:00'));
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        {
                            action : 'click',
                            target : '>> [text=Apply]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(Ext.Date.format(vm.get('date'), 'Y.m.d')).toBe('2017.01.10');

                            next();
                        }
                    ]);

                });
            });

            // main screen filter
            t.describe('Main screen filtering', function(t) {

                t.it('Set new date', function(t) {
                    makeView();

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            setValueToField(view.down('datefield[reference=dateSelector]'), new Date('2017/01/10 00:00:00'));
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(Ext.Date.format(vm.get('date'), 'Y.m.d')).toBe('2017.01.10');
                            next();
                        }
                    ]);
                });

                t.it('filter by employee', function(t) {
                    makeView();

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            vm.set('employeeGroupIds', [11, 22]);
                            viewC.load();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            setValueToField(view.down('textfield[fieldLabel=Employee]'), 'Th');
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(vm.get('attendanceDashboard').count()).toBe(1);
                            next();
                        }
                    ]);
                });

            });

            // global exception
            t.describe('Global exception', function(t) {

                t.it('button state', function(t) {
                    makeView();

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(view.down('button[handler=handleGlobalException]').disabled).toBeTruthy();
                            next();
                        },
                        function(next) {
                            vm.set('employeeGroupIds', [11,22]);
                            viewC.load();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(view.down('button[handler=handleGlobalException]').disabled).toBeFalsy();
                            next();
                        }
                    ]);
                });

                t.it('check load global exception', function(t) {
                    makeView();

                    var gridPanelQuery = 'criterion_selfservice_time_attendance_dashboard_exception criterion_gridpanel';

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            vm.set('employeeGroupIds', [11, 22]);
                            viewC.load();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        {
                            action : 'click',
                            target : '>> button[handler=handleGlobalException]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(params.employeeGroupIds).toBe('11,22');
                            next();
                        },
                        function(next) {
                            t.expect(t.isElementVisible('>> criterion_selfservice_time_attendance_dashboard_exception')).toBe(true);
                            next();
                        },
                        function(next) {
                            t.expect(cqd(gridPanelQuery).isVisible()).toBe(false);
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [reference=trigger]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(cqd(gridPanelQuery).isVisible()).toBe(true);
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [reference=trigger]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(cqd(gridPanelQuery).isVisible()).toBe(false);
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Cancel]'
                        },
                        function(next) {
                            t.expect(Ext.ComponentQuery.query('criterion_selfservice_time_attendance_dashboard_exception').length).toBe(0);
                            next();
                        }
                    ]);
                });

                t.it('check dates set', function(t) {
                    makeView();

                    var geWindow,
                        messageWindow;

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            vm.set('employeeGroupIds', [11, 22]);
                            viewC.load();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        {
                            action : 'click',
                            target : '>> button[handler=handleGlobalException]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            geWindow = cqd('criterion_selfservice_time_attendance_dashboard_exception');
                            next();
                        },
                        function(next) {
                            setValueToField(geWindow.down('timefield[fieldLabel=Start]'), '10:00');
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Save]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(geWindow.down('timefield[fieldLabel=End]').isValid()).toBeFalsy();
                            next();
                        },
                        function(next) {
                            setValueToField(geWindow.down('timefield[fieldLabel=End]'), '19:00');

                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Save]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            messageWindow = cqd('messagebox[title=Attention]');
                            t.expect(messageWindow.isVisible()).toBeTruthy();
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=No]'
                        },
                        function(next) {
                            t.expect(messageWindow.isVisible()).toBeFalsy();
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Save]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        {
                            action : 'click',
                            target : '>> [text=Yes]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(lastRequestParams.url).toContain('?employeeGroupIds=11,22');
                            t.expect(lastRequestParams.jsonData.date).toBe(Ext.Date.format(new Date(), 'Y.m.d'));
                            t.expect(lastRequestParams.jsonData.scheduledStart).toBe('10:00');
                            t.expect(lastRequestParams.jsonData.scheduledEnd).toBe('19:00');
                            t.expect(lastRequestParams.jsonData.isRemoved).toBeFalsy();
                            next();
                        }
                    ]);
                });

                t.it('check out all day', function(t) {
                    makeView();

                    var geWindow;

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            vm.set('employeeGroupIds', [11, 22]);
                            viewC.load();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        {
                            action : 'click',
                            target : '>> button[handler=handleGlobalException]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            geWindow = cqd('criterion_selfservice_time_attendance_dashboard_exception');
                            next();
                        },
                        function(next) {
                            setValueToField(geWindow.down('toggleslidefield'), true);
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(geWindow.down('timefield[fieldLabel=Start]').disabled).toBeTruthy();
                            t.expect(geWindow.down('timefield[fieldLabel=End]').disabled).toBeTruthy();
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Save]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        {
                            action : 'click',
                            target : '>> [text=Yes]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(lastRequestParams.url).toContain('?employeeGroupIds=11,22');
                            t.expect(lastRequestParams.jsonData.date).toBe(Ext.Date.format(new Date(), 'Y.m.d'));
                            t.expect(lastRequestParams.jsonData.isRemoved).toBeTruthy();
                            t.expect(lastRequestParams.jsonData.scheduledStart).toBeNull();
                            t.expect(lastRequestParams.jsonData.scheduledEnd).toBeNull();
                            next();
                        }
                    ]);
                });
            });

            // employee exception
            t.describe('employee exception', function(t) {

                t.it('open window', function(t) {
                    var firstPW,
                        geWindow;

                    makeView();

                    t.chain([
                        function(next) {
                            vm.set('employeeGroupIds', [11, 22]);
                            viewC.load();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            firstPW = cqd('criterion_selfservice_time_attendance_dashboard_period_widget');
                            firstPW.down('button').click();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(params.employeeId).toBe(1);
                            t.expect(params.date).toBe(Ext.Date.format(new Date(), 'Y.m.d'));

                            geWindow = cqd('criterion_selfservice_time_attendance_dashboard_exception');
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Save]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(lastRequestParams.url).toContain('?employeeId=1');
                            t.expect(lastRequestParams.jsonData.date).toBe(Ext.Date.format(new Date(), 'Y.m.d'));
                            t.expect(lastRequestParams.jsonData.isRemoved).toBeFalsy();
                            t.expect(lastRequestParams.jsonData.scheduledStart).toBe('09:00');
                            t.expect(lastRequestParams.jsonData.scheduledEnd).toBe('18:00');
                            next();
                        }
                    ]);
                });
            });
        });
    });
});
