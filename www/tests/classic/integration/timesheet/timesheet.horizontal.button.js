describe("Timesheet Horizontal Button", function(t) {

    // helpers

    var app, view, viewC, vm, WAIT_MS = 10, createdTs, currentTs,
        CONSTS = {
            SANITY : {
                EMPLOYEE_ID : 9
            }
        };

    function makeView(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody(),
            controller : {
                closeAfterSave : false
            }
        }, config || {});

        view = Ext.create('criterion.view.employee.timesheet.Horizontal', config);

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
                employeeId : CONSTS.SANITY.EMPLOYEE_ID, // initiator
                isNext : true,
                timezoneOffset : 0
            },
            jsonData : {
                employeeId : CONSTS.SANITY.EMPLOYEE_ID // target
            }
        }).then({
            scope : this,
            success : function(result) {
                createdTs = Ext.create('criterion.model.employee.Timesheet', result);
                createdTs.get('isCurrent') && (currentTs = createdTs);
            }
        })
    }

    // setup / teardown methods

    t.beforeEach(function() {
    });

    t.afterEach(function() {
        view = Ext.destroy(view);
    });

    // asserts

    function assertCreateTs(t) {
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
                viewC.load();
                next();
            },
            {
                waitFor : 'ThrottledAjax'
            }
        ]
    }

    // setup environment

    t.wait('setup');

    criterion.detectDirtyForms = false;

    // criterion.API_TOKEN and criterion.API_TENANT_ID are not used anymore. See https://perfecthr.atlassian.net/browse/CR-8707
    criterion.API_TENANT_ID = '999';
    criterion.API_TOKEN = 'jB/aWaX63OCAHYF7ZYZ/IAPjLkVnWhLucJso7NUWKgI=';

    Ext.Deferred.sequence([
        function() {
            return criterion.Api.updateDatabase('timesheet_horizontal_button')
        },
        function() {
            return criterion.Api.isAuthenticated();
        },
        function() {
            return criterion.CodeDataManager.loadCodeTables();
        },
        function() {
            return createTs(); // creating "current" timesheet
        }
    ]).then(function() {
        app = Ext.create('criterion.Application', {name : 'ut'});

        Ext.GlobalEvents.on('baseStoresLoaded', function() {

            t.endWait('setup');

            t.describe('Basic tests', function(t) {

                t.it('It should initialize', function(t) {
                    createTs();

                    t.chain([].concat(
                        assertCreateTs(t)
                    ));
                });

                t.it('It should be able to create default task', function(t) {
                    createTs();

                    t.chain([].concat(
                        assertCreateTs(t),
                        [
                            {
                                action : 'click',
                                target : '>> #btnAddTask'
                            },
                            {
                                action : 'click',
                                target : '>> #btnSave'
                            },
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                var timesheetTasks = vm.get('timesheetRecord').timesheetTasks();

                                t.expect(timesheetTasks.getCount()).toBe(1);
                                t.expect(timesheetTasks.getAt(0).phantom).toBeFalsy();

                                next();
                            }
                        ]
                    ));
                });

            });

        });
    });

});