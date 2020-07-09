describe("Team Punch", function(t) {

    // helpers

    var app, view, viewC, vm,
        params,
        lastRequestParams,
        WAIT_MS = 10;

    function makeView(config) {
        var cfg = Ext.Object.merge({
            renderTo : Ext.getBody()
        }, config || {});

        view = Ext.create('criterion.view.employee.timesheet.dashboard.TeamPunch', cfg);

        viewC = view.getController();
        vm = view.getViewModel();

        viewC.handleShow();
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

    var createData = function() {
            return [
                {
                    id : 1,
                    employeeId : 1,
                    lastName : 'Bishop',
                    firstName : 'Tracy',
                    employeeNumber : Ext.Number.randomInt(1000, 3000),
                    inTime : [],
                    outTime : [],
                    skipped : false
                },
                {
                    id : 2,
                    employeeId : 2,
                    lastName : 'Second',
                    firstName : 'Employee',
                    employeeNumber : Ext.Number.randomInt(1000, 3000),
                    inTime : ['2017-01-21 08:00:00'],
                    outTime : [],
                    skipped : Ext.Number.randomInt(100, 300) > 150
                },
                {
                    id : 3,
                    employeeId : 3,
                    lastName : 'Th',
                    firstName : 'Employee',
                    employeeNumber : Ext.Number.randomInt(1000, 3000),
                    inTime : ['2017-01-21 08:00:00'],
                    outTime : ['2017-01-21 11:00:00'],
                    skipped : Ext.Number.randomInt(100, 300) > 150
                },
                {
                    id : 4,
                    employeeId : 4,
                    lastName : 'Fr',
                    firstName : 'Employee',
                    employeeNumber : Ext.Number.randomInt(1000, 3000),
                    inTime : [
                        '2017-01-21 08:00:00',
                        '2017-01-21 11:30:00',
                        '2017-01-21 16:00:00'
                    ],
                    outTime : [
                        '2017-01-21 10:15:00',
                        null,
                        '2017-01-21 17:40:00'
                    ],
                    skipped : Ext.Number.randomInt(100, 300) > 150
                }
            ]
        };

    Ext.define('criterion.data.proxy.Test', function() {
        return {
            extend : 'Ext.data.proxy.Memory',
            alias : 'proxy.criterion_test_proxy',

            config : {
                extraParams : {}
            }
        }
    });

    var spyTeamPunchLoaded = t.createSpy('teamPunchLoaded');
    Ext.override(criterion.store.dashboard.subordinateTimesheet.TeamPunch, {
        setProxy : function(params) {
            if (params && params.type) {
                params.type = 'criterion_test_proxy';
            }
            this.callParent(arguments);
        },

        load : function(opt) {
            params = Ext.clone(opt.params);
            spyTeamPunchLoaded(params);

            this.setData(Ext.clone(createData()));
        }
    });

    var spyTeamPunchRequest = t.createSpy('teamPunchRequest');
    Ext.override(criterion.Api, {
        requestWithPromise : function(opts) {
            var dfd = Ext.create('Ext.Deferred');

            lastRequestParams = Ext.clone(opts);
            spyTeamPunchRequest(lastRequestParams);
            dfd.resolve({"result": 2, "success" : true});

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
                    var date = Ext.Date.clearTime(new Date()),
                        endDate = Ext.Date.add(date, Ext.Date.DAY, 10);

                    makeView({
                        viewModel : {
                            data : {
                                timesheetsCount : 10,

                                loadParams : {
                                    test : 1
                                },

                                date : date,
                                startDate : date,
                                endDate : endDate
                            }
                        }
                    });

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(spyTeamPunchLoaded.calls.count()).toBe(1);
                            t.expect(vm.get('teamPunch').count()).toBe(4);
                            next();
                        }
                    ])
                });

                t.it('check loading params', function(t) {
                    var date = Ext.Date.clearTime(new Date()),
                        endDate = Ext.Date.add(date, Ext.Date.DAY, 10);

                    makeView({
                        viewModel : {
                            data : {
                                timesheetsCount : 10,

                                loadParams : {
                                    test : 1,
                                    test_2 : 2
                                },

                                date : date,
                                startDate : date,
                                endDate : endDate
                            }
                        }
                    });

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(spyTeamPunchLoaded.calls.count()).toBe(2);
                            t.expect(params.date).toBe(Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT));
                            t.expect(params.isIn).toBeTruthy();
                            t.expect(params.time).toBe('00:00');
                            t.expect(params.test).toBe(1);
                            t.expect(params.test_2).toBe(2);
                            next();
                        }
                    ])
                });
            });

            // filtering
            t.describe('Filter', function(t) {

                t.it('Change filter values', function(t) {
                    var date = Ext.Date.clearTime(new Date()),
                        date2 = new Date('2017/01/10 00:00:00'),
                        date3 = Ext.Date.add(date, Ext.Date.DAY, 2),
                        endDate = Ext.Date.add(date, Ext.Date.DAY, 10);

                    makeView({
                        viewModel : {
                            data : {
                                timesheetsCount : 10,

                                loadParams : {
                                    test : 1
                                },

                                date : date,
                                startDate : date,
                                endDate : endDate
                            }
                        }
                    });

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(spyTeamPunchLoaded.calls.count()).toBe(3);
                            t.expect(params.date).toBe(Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT));

                            // invalid date
                            setValueToField(view.down('datefield'), date2);
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(view.down('datefield').isValid()).toBeFalsy();
                            t.expect(spyTeamPunchLoaded.calls.count()).toBe(3);
                            next();
                        },
                        function(next) {
                            // valid date
                            setValueToField(view.down('datefield'), date3);
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(view.down('datefield').isValid()).toBeTruthy();
                            t.expect(spyTeamPunchLoaded.calls.count()).toBe(4);
                            t.expect(params.date).toBe(Ext.Date.format(date3, criterion.consts.Api.DATE_FORMAT));
                            next();
                        },
                        function(next) {
                            // type
                            setValueToField(view.down('[reference=typeField]'), {type: false});
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(spyTeamPunchLoaded.calls.count()).toBe(5);
                            t.expect(params.isIn).toBeFalsy();
                            next();
                        },
                        function(next) {
                            // time
                            setValueToField(view.down('[reference=timeField]'), '03:00');
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(spyTeamPunchLoaded.calls.count()).toBe(6);
                            t.expect(params.time).toBe('03:00');
                            next();
                        }
                    ])
                });

            });

            // selection
            t.describe('grid selections', function(t) {

                t.it('select all', function(t) {
                    var date = Ext.Date.clearTime(new Date()),
                        endDate = Ext.Date.add(date, Ext.Date.DAY, 10),
                        punchBtn,
                        spyAfterExecute = t.createSpy('afterExecute'),
                        employeeIds = [];

                    makeView({
                        viewModel : {
                            data : {
                                timesheetsCount : 10,

                                loadParams : {
                                    test : 1
                                },

                                date : date,
                                startDate : date,
                                endDate : endDate
                            }
                        }
                    });

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            var ch = view.down('[reference=teamGrid]').el.query('.tg-checkbox'),
                                nskipped = 0;

                            punchBtn = view.down('[text="Execute Punch"]');

                            t.expect(punchBtn.disabled).toBeTruthy();

                            Ext.each(ch, function(cmp) {
                                cmp.click();
                            });

                            vm.get('teamPunch').each(function(tp) {
                                if (!tp.get('skipped')) {
                                    nskipped++;
                                    employeeIds.push(tp.get('employeeId'))
                                }
                            });

                            t.expect(ch.length).toBe(nskipped);
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(punchBtn.disabled).toBeFalsy();

                            view.on('afterExecute', spyAfterExecute);

                            punchBtn.click();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(spyAfterExecute).not.toHaveBeenCalled();

                            t.expect(lastRequestParams.jsonData.date).toBe(Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT));
                            t.expect(lastRequestParams.jsonData.isIn).toBeTruthy();
                            t.expect(lastRequestParams.jsonData.time).toBe('00:00');
                            t.expect(lastRequestParams.jsonData.employeeIds.length).toBe(employeeIds.length);

                            Ext.each(employeeIds, function(employeeId) {
                                t.expect(lastRequestParams.jsonData.employeeIds).toContain(employeeId);
                            });

                            t.expect(cqd('messagebox[title=Success]').isVisible()).toBeTruthy();
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [text=Close]'
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(spyAfterExecute).toHaveBeenCalled();
                            next();
                        }
                    ])
                });


            });

        });
    });
});
