describe("Employee Wizard", function(t) {

    // helpers

    var app, view, viewC, vm, WAIT_MS = 10;

    function makeView(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody(),
            parentPage : 'HR'
        }, config || {});

        view = Ext.create('criterion.view.employee.Wizard', config);

        viewC = view.getController();
        vm = view.getViewModel();
    }

    function cqd(query) {
        return Ext.ComponentQuery.query(query)[0]
    }

    function setEmployer(employerId) {
        cqd('[reference=barEmployerCombo]').setValue(employerId);
    }

    function applyData(basic, data, join) {
        if (data && join) {
            return Ext.apply(basic, data)
        } else {
            return data ? data : basic;
        }
    }

    function fillPerson(data, join) {
        var basic = {
            firstName : 'ut_first',
            lastName : 'ut_last',
            email : (new Date().getTime()) + '@ut.com'
        };

        vm.get('person').set(applyData(basic, data, join));
        vm.notify();
    }

    function fillAddress(data, join) {
        var basic = {
            countryCd : 465, // NONE
            address1 : 'ut_address1',
            city : 'ut_city',
            postalCode : '100000'
        };

        vm.get('address').set(applyData(basic, data, join));
        vm.notify();
    }

    function fillEmployee(data, join) {
        var basic = {
            hireDate : new Date()
        };

        vm.get('employee').set(applyData(basic, data, join));
        vm.notify();
    }

    function fillAssignment(data, join) {
        var basic = {
            title : 'ut_position',
            assignmentActionCd : 338, // NONE
            employerWorkLocationId : 1,
            departmentCd : 360, // NONE
            rateUnitCd : 4370, // per Year
            averageHours : 8,
            averageDays : 5,
            averageWeeks : 34,
            payRate : 1000
        };

        var vm = Ext.first('criterion_employee_wizard_employment').getViewModel();

        vm.get('assignmentDetail').set(applyData(basic, data, join));
        vm.notify();
    }

    function fillWorkLocation() {
        var vm = Ext.first('criterion_employee_wizard_employment').getViewModel();

        vm.get('employeeWorkLocations').add({
            isActive : true,
            isPrimary : true,
            employerWorkLocationId : 1
        });

        vm.notify();
    }

    // setup / teardown methods

    t.beforeEach(function() {
        Ext.History.add('#');
        Ext.History.onHashChange(); // due to timer in Ext.util.History, we need to trigger this manually
    });

    t.afterEach(function() {
        view = Ext.destroy(view);
    });

    // asserts

    function assertPassDemographic(t, doFill) {
        return [
            {
                waitFor : 'ActiveCard',
                args : [view, 'criterion_employee_demographic_basic']
            },
            function(next) {
                t.pass('On Demographic page');
                next();
            },
            function(next) {
                if (doFill) {
                    fillPerson();
                    t.diag('Filling person fields.')
                }
                Ext.first('#btnNext').click();
                next();
            },
            {
                waitFor : 'ActiveCard',
                args : [view, 'criterion_employee_demographic_address']
            },
            function(next) {
                t.pass('Proceed to Address page');
                next();
            }
        ]
    }

    function assertPassAddress(t, doFill) {
        return [
            {
                waitFor : 'ActiveCard',
                args : [view, 'criterion_employee_demographic_address']
            },
            function(next) {
                t.pass('On Address page');
                if (doFill) {
                    fillAddress();
                    t.diag('Filling address fields.')
                }
                cqd('#btnNext').click();
                next();
            },
            {
                waitFor : 'ActiveCard',
                args : [view, 'criterion_employee_wizard_employment']
            },
            function(next) {
                t.pass('Proceed to Employment page');
                next();
            }
        ]
    }

    function assertClickSave(t, hasGroups) {
        var chain = [];

        chain.push({
            action : 'click',
            target : '>> #btnSave'
        });

        !hasGroups && chain.push({
                action : 'click',
                target : '>> [text=Yes]'
            }
        );

        return chain;
    }

    // setup environment

    t.wait('setup');

    criterion.detectDirtyForms = false;

    criterion.Api.updateDatabase('employee_wizard').then(function() {
        criterion.Api.isAuthenticated(function(isAuth, result) {
            criterion.CodeDataManager.loadCodeTables().then(function() {
                app = Ext.create('criterion.Application', {name : 'ut'});

                t.endWait('setup');

                t.describe('"CREATE" mode', function(t) {

                    t.it('Should allow to create an Employee with minimal required data', function(t) {
                        Ext.History.add('#HR/addEmployee');
                        makeView();

                        t.chain(
                            [].concat(
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        setEmployer(1);
                                        next()
                                    },
                                    {
                                        waitFor : 'ThrottledAjax'
                                    }
                                ],
                                assertPassDemographic(t, true),
                                assertPassAddress(t, true),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        fillEmployee();
                                        fillAssignment();
                                        fillWorkLocation();
                                        next();
                                    }
                                ],
                                assertClickSave(t),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    {
                                        waitFor : 'CQVisible',
                                        args : ['employee_login_confirm_panel']
                                    },
                                    function(next) {
                                        t.pass('Login Confirm window shown.');
                                        Ext.destroy(Ext.first('employee_login_confirm_panel'));
                                        next();
                                    }
                                ]
                            )
                        )
                    })

                });

                t.describe('"CREATE_BY_EXIST" mode', function(t) {

                    t.it('It should show list only applicable Employers', function(t) {
                        makeView();
                        Ext.History.add('#HR/addEmployee/person/2');

                        t.chain(
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                var employers = cqd('[reference=barEmployerCombo]').getStore();

                                t.expect(employers.count()).toBe(1);
                                t.expect(employers.getAt(0).getId()).toBe(2);
                            }
                        )
                    });

                    t.it('It should allow to proceed with correct Employer', function(t) {
                        Ext.History.add('#HR/addEmployee/person/2');
                        makeView();

                        t.chain(
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                setEmployer(2);
                                next();
                            },
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                t.expect(cqd('#btnNext').disabled).toBe(false);
                                next();
                            }
                        )
                    });

                    t.it('It should create new Hire with minimal fields if person haven\'t worked on that Employer before', function(t) {
                        makeView();
                        Ext.History.add('#HR/addEmployee/person/2');

                        t.chain(
                            [].concat(
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        setEmployer(2);
                                        next()
                                    },
                                    {
                                        waitFor : 'ThrottledAjax'
                                    }
                                ],
                                assertPassDemographic(t, false),
                                assertPassAddress(t, false),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        t.spyOn(viewC, 'redirectTo');
                                        fillEmployee();
                                        fillAssignment();
                                        fillWorkLocation();
                                        next();
                                    }
                                ],
                                assertClickSave(t),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        t.expect(viewC.redirectTo).toHaveBeenCalled();
                                        t.diag('Redirected to ' + Ext.History.getHash() + ', considering as success.');
                                        next();
                                    }
                                ]
                            )
                        )
                    });

                    // doesn't work because person don't have eligible employers because this person only good for rehire (need to check)
                    t.xit('It should create new Hire with limited fields if person worked on that Employer before', function(t) {
                        makeView();
                        Ext.History.add('#HR/addEmployee/person/5');

                        t.chain(
                            [].concat(
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        setEmployer(1);
                                        next()
                                    },
                                    {
                                        waitFor : 'ThrottledAjax'
                                    }
                                ],
                                assertPassDemographic(t, false),
                                assertPassAddress(t, false),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        t.spyOn(viewC, 'redirectTo');
                                        fillAssignment({
                                            assignmentActionCd : 352 // 'LEAVERET'
                                        });
                                        next();
                                    }
                                ],
                                assertClickSave(t),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        t.expect(viewC.redirectTo).toHaveBeenCalled();
                                        t.diag('Redirected to ' + Ext.History.getHash() + ', considering as success.');
                                        next();
                                    }
                                ]
                            )
                        )
                    });
                });

                t.describe('Initialization of "REHIRE" mode', function(t) {
                    t.it('It should show Basic Demographics as starting page', function(t) {
                        Ext.History.add('#HR/addEmployee/rehire/person/3/1');
                        makeView();

                        t.chain(
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            {
                                waitFor : 'CQVisible',
                                args : ['criterion_employee_demographic_basic']
                            }
                        )
                    });

                    t.it('It should provide all Employers available for rehiring to', function(t) {
                        Ext.History.add('#HR/addEmployee/rehire/person/3/1');
                        makeView();

                        t.chain(
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                t.expect(cqd('[reference=barEmployerCombo]').getStore().count()).toBe(2);
                                next();
                            }
                        )
                    });

                    t.it('It should rehire with limited fields if person worked on that Employer before', function(t) {
                        makeView();
                        Ext.History.add('#HR/addEmployee/rehire/person/3/1');

                        t.chain(
                            [].concat(
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    }
                                ],
                                function(next) {
                                    setEmployer(1);
                                    next()
                                },
                                assertPassDemographic(t, false),
                                assertPassAddress(t, false),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        t.spyOn(viewC, 'redirectTo');
                                        fillAssignment({
                                            assignmentActionCd : 352 // 'LEAVERET'
                                        });
                                        next();
                                    }
                                ],
                                assertClickSave(t, true),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        t.expect(viewC.redirectTo).toHaveBeenCalled();
                                        t.diag('Redirected to ' + Ext.History.getHash() + ', considering as success.');
                                        next();
                                    }
                                ]
                            )
                        )
                    })
                });

                t.describe('Initialization of "TRANSFER" mode', function(t) {
                    t.it('It should provide only Employers available for transfer', function(t) {
                        Ext.History.add('#HR/addEmployee/transfer/person/4/1');
                        makeView();

                        t.chain(
                            {
                                waitFor : 'ThrottledAjax'
                            },
                            function(next) {
                                t.expect(cqd('[reference=barEmployerCombo]').getStore().count()).toBe(1);
                                next();
                            }
                        )
                    });

                    t.it('It should Transfer employee with minimal fields', function(t) {
                        makeView();
                        Ext.History.add('#HR/addEmployee/transfer/person/4/1');

                        t.chain(
                            [].concat(
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    }
                                ],
                                function(next) {
                                    setEmployer(2);
                                    next()
                                },
                                assertPassDemographic(t, false),
                                assertPassAddress(t, false),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        t.spyOn(viewC, 'redirectTo');
                                        fillEmployee();
                                        fillAssignment();
                                        fillWorkLocation();
                                        next();
                                    }
                                ],
                                assertClickSave(t),
                                [
                                    {
                                        waitFor : 'ThrottledAjax'
                                    },
                                    function(next) {
                                        t.expect(viewC.redirectTo).toHaveBeenCalled();
                                        t.diag('Redirected to ' + Ext.History.getHash() + ', considering as success.');
                                        next();
                                    }
                                ]
                            )
                        )
                    });
                });
            });
        });
    });

});