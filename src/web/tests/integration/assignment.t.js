describe("Assignment Workflow", function(t) {

    // helpers

    var app, view, viewC, vm, WAIT_MS = 10,
        CONSTS = {
            WORKFLOW_EDIT : {
                EMPLOYEE_ID : 8,
                ASSIGNMENT : {
                    PRIMARY : 7,
                    SECONDARY : 8
                }
            },
            WORKFLOW_NEW_ACTION : {
                EMPLOYEE_ID : 9
            },
            NO_WORKFLOW_PRIMARY_EDIT : {
                EMPLOYEE_ID : 12
            },
            NO_WORKFLOW_NEW_ACTION : {
                EMPLOYEE_ID : 13
            },
            WORKFLOW_SECONDARY_TERMINATE : {
                EMPLOYEE_ID : 11,
                ASSIGNMENT_ID : 11
            },
            WORKFLOW_CREATE : {
                EMPLOYEE_ID : 10
            },
            POSITION : {
                PRIMARY : 2,
                SECONDARY : 3
            },
            CD : {
                ASSIGNMENT_ACTION_NONE : 338,
                DEPARTMENT_NONE : 360,
                RATE_UNIT_PER_YEAR : 4370,
                COST_CENTER_FINANCE : 817,
                TERMINATION_CD_NONE : 4362
            }
        };

    function makeView(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody(),
            controller : {
                suppressIdentity : ['employeeGlobal']
            }
        }, config || {});

        view = Ext.create('criterion.view.employee.Position', config);

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

    // setup / teardown methods

    t.beforeEach(function() {
    });

    t.afterEach(function() {
        view = Ext.destroy(view);
    });

    // asserts

    // setup environment

    t.wait('setup');

    criterion.detectDirtyForms = false;

    Ext.Deferred.sequence([
        function() {
            return criterion.Api.updateDatabase('assignment_workflow')
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

            t.describe('Loading of existing assignment', function(t) {

                t.it('Should load Primary assignment', function(t) {
                    makeView({
                        viewModel : {
                            data : {
                                isPrimary : true
                            }
                        }
                    });
                    setIdentity(CONSTS.WORKFLOW_EDIT.EMPLOYEE_ID);

                    t.chain([
                        function(next) {
                            viewC.load();
                            next();
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.expect(vm.get('assignment').getId()).toBe(CONSTS.WORKFLOW_EDIT.ASSIGNMENT.PRIMARY);
                        }
                    ])
                });

                t.it('Should load Secondary assignment', function(t) {
                    var assignment = Ext.create('criterion.model.Assignment', {id : CONSTS.WORKFLOW_EDIT.ASSIGNMENT.SECONDARY});
                    assignment.commit(); // controller doesn't expect phantoms

                    makeView({
                        viewModel : {
                            data : {
                                isPrimary : false
                            }
                        }
                    });
                    setIdentity(CONSTS.WORKFLOW_EDIT.EMPLOYEE_ID);

                    t.chain([
                        function(next) {
                            viewC.load(assignment);
                            next();
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.expect(vm.get('assignment').getId()).toBe(CONSTS.WORKFLOW_EDIT.ASSIGNMENT.SECONDARY);
                        }
                    ])
                });

            });

            t.describe('Primary assignment w/ Workflow', function(t) {

                t.it('Should edit existing assignment detail', function(t) {
                    var origPayRate, targetPayRate, payRateField;

                    makeView({
                        viewModel : {
                            data : {
                                isPrimary : true
                            }
                        }
                    });
                    setIdentity(CONSTS.WORKFLOW_EDIT.EMPLOYEE_ID);
                    viewC.load();

                    payRateField = Ext.first('[reference=payRate]');

                    t.chain([
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        {
                            action : 'click',
                            target : '>> #btnEdit'
                        },
                        function(next) {
                            t.diag('Edit mode.');
                            t.expect(vm.get('editMode')).toBe(true);
                            t.expect(vm.get('isPendingWorkflow')).toBeFalsy(); // sanity check
                            origPayRate = vm.get('activeDetail.payRate');
                            payRateField.setValue(targetPayRate = origPayRate + 1000);
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [reference=submit]'
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.diag('View mode.');
                            t.expect(vm.get('editMode')).toBe(false);
                            t.diag('Pay rate updated.');
                            t.expect(payRateField.getValue()).toBe(targetPayRate);
                            t.expect(vm.get('activeDetail.payRate')).toBe(targetPayRate);
                            t.diag('Workflow created.');
                            t.expect(vm.get('isPendingWorkflow')).toBe(true);
                            t.diag('Changed field highlighted');
                            t.expect(payRateField.hasCls(criterion.Consts.UI_CLS.WORKFLOW_HIGHLIGHTED)).toBe(true);
                            next();
                        }
                    ])
                });

                t.it('Should create new assignment detail', function(t) {
                    var origPayRate, targetPayRate, payRateField;

                    makeView({
                        viewModel : {
                            data : {
                                isPrimary : true
                            }
                        }
                    });
                    setIdentity(CONSTS.WORKFLOW_NEW_ACTION.EMPLOYEE_ID);
                    viewC.load();

                    payRateField = Ext.first('[reference=payRate]');

                    t.chain([
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        {
                            action : 'click',
                            target : '>> #btnNewAction'
                        },
                        function(next) {
                            t.diag('Edit mode.');
                            t.expect(vm.get('editMode')).toBe(true);
                            t.expect(vm.get('isPendingWorkflow')).toBeFalsy(); // sanity check

                            vm.get('activeDetail').set({
                                effectiveDate : new Date(),
                                assignmentActionCd : CONSTS.CD.ASSIGNMENT_ACTION_NONE,
                                positionId : CONSTS.POSITION.SECONDARY // TEMP FIX todo remove
                            });

                            origPayRate = vm.get('activeDetail.payRate');
                            payRateField.setValue(targetPayRate = origPayRate + 1000);

                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [reference=submit]'
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.diag('View mode.');
                            t.expect(vm.get('editMode')).toBe(false);
                            t.diag('Pay rate updated.');
                            t.expect(payRateField.getValue()).toBe(targetPayRate);
                            t.expect(vm.get('activeDetail.payRate')).toBe(targetPayRate);
                            t.diag('Workflow created.');
                            t.expect(vm.get('isPendingWorkflow')).toBe(true);
                            next();
                        }
                    ])
                })
            });

            t.describe('Primary assignment w/o Workflow', function(t) {

                t.it('Should edit existing assignment detail', function(t) {
                    var origPayRate, targetPayRate, payRateField;

                    makeView({
                        viewModel : {
                            data : {
                                isPrimary : true
                            }
                        }
                    });
                    setIdentity(CONSTS.NO_WORKFLOW_PRIMARY_EDIT.EMPLOYEE_ID);
                    viewC.load();

                    payRateField = Ext.first('[reference=payRate]');

                    t.chain([
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        {
                            action : 'click',
                            target : '>> #btnEdit'
                        },
                        function(next) {
                            t.diag('Edit mode.');
                            t.expect(vm.get('editMode')).toBe(true);
                            t.expect(vm.get('isPendingWorkflow')).toBeFalsy(); // sanity check
                            origPayRate = vm.get('activeDetail.payRate');
                            payRateField.setValue(targetPayRate = origPayRate + 1000);
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [reference=submit]'
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.diag('View mode.');
                            t.expect(vm.get('editMode')).toBe(false);
                            t.diag('Pay rate updated.');
                            t.expect(payRateField.getValue()).toBe(targetPayRate);
                            t.expect(vm.get('activeDetail.payRate')).toBe(targetPayRate);
                            t.diag('Workflow not created.');
                            t.expect(vm.get('isPendingWorkflow')).toBeFalsy(); // sanity check
                            next();
                        }
                    ])
                });

                t.it('Should create new assignment detail', function(t) {
                    var origPayRate, targetPayRate, payRateField;

                    makeView({
                        viewModel : {
                            data : {
                                isPrimary : true
                            }
                        }
                    });
                    setIdentity(CONSTS.NO_WORKFLOW_NEW_ACTION.EMPLOYEE_ID);
                    viewC.load();

                    payRateField = Ext.first('[reference=payRate]');

                    t.chain([
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        {
                            action : 'click',
                            target : '>> #btnNewAction'
                        },
                        function(next) {
                            t.diag('Edit mode.');
                            t.expect(vm.get('editMode')).toBe(true);
                            t.expect(vm.get('isPendingWorkflow')).toBeFalsy(); // sanity check

                            vm.get('activeDetail').set({
                                effectiveDate : new Date(),
                                assignmentActionCd : CONSTS.CD.ASSIGNMENT_ACTION_NONE
                            });

                            origPayRate = vm.get('activeDetail.payRate');
                            payRateField.setValue(targetPayRate = origPayRate + 1000);

                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [reference=submit]'
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.diag('View mode.');
                            t.expect(vm.get('editMode')).toBe(false);
                            t.diag('Pay rate updated.');
                            t.expect(payRateField.getValue()).toBe(targetPayRate);
                            t.expect(vm.get('activeDetail.payRate')).toBe(targetPayRate);
                            t.diag('Workflow not created.');
                            t.expect(vm.get('isPendingWorkflow')).toBeFalsy(); // sanity check
                            next();
                        }
                    ])
                })
            });

            t.describe('Secondary assignment w/ Workflow', function(t) {
                t.it('Should create new Secondary Assignment with Position', function(t) {
                    var assignment = Ext.create('criterion.model.Assignment');

                    makeView({
                        viewModel : {
                            data : {
                                isPrimary : false
                            }
                        }
                    });
                    setIdentity(CONSTS.WORKFLOW_CREATE.EMPLOYEE_ID);
                    viewC.load(assignment);

                    t.chain([
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.diag('Edit mode.');
                            t.expect(vm.get('editMode')).toBe(true);
                            vm.get('activeDetail').set({
                                effectiveDate : new Date(),
                                assignmentActionCd : CONSTS.CD.ASSIGNMENT_ACTION_NONE,
                                departmentCd : CONSTS.CD.DEPARTMENT_NONE,
                                costCenterCd : CONSTS.CD.COST_CENTER_FINANCE,
                                rateUnitCd : CONSTS.CD.RATE_UNIT_PER_YEAR,
                                averageHours : 8,
                                averageDays : 5,
                                payRate : 1000,
                                title : 'Secondary',
                                positionId : CONSTS.POSITION.SECONDARY
                            });
                            next();
                        },
                        {
                            action : 'click',
                            target : '>> [reference=submit]'
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.pass('Done');
                            // todo check workflow creation
                            next();
                        }
                    ])
                });

                t.it('Should terminate Secondary Assignment', function(t) {
                    var assignment = Ext.create('criterion.model.Assignment', {id : CONSTS.WORKFLOW_SECONDARY_TERMINATE.ASSIGNMENT_ID});

                    makeView({
                        viewModel : {
                            data : {
                                isPrimary : false
                            }
                        }
                    });
                    setIdentity(CONSTS.WORKFLOW_SECONDARY_TERMINATE.EMPLOYEE_ID);
                    viewC.load(assignment);

                    t.chain([
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        {
                            action : 'click',
                            target : '>> #btnTerminate'
                        },
                        {
                            waitFor : 'CQVisible',
                            args : ['criterion_assignment_terminate']
                        },
                        function(next) {
                            var tWin = Ext.first('criterion_assignment_terminate');

                            tWin.down('[name=terminationCd]').setValue(CONSTS.CD.TERMINATION_CD_NONE);
                            tWin.down('[name=expirationDate]').setValue(new Date());

                            tWin.down('#btnTerminate').click();
                            next();
                        },
                        {
                            waitFor : 'ThrottledAjax'
                        },
                        function(next) {
                            t.pass('Done');
                            // todo check workflow creation
                            next();
                        }
                    ]);
                });

                t.todo('Should change Secondary Assignment\'s Position', function(t) {});
                t.todo('Should create new Secondary Assignment without Position', function(t) {});

            });

            t.describe('Additional entities w/workflow', function(t) {
                t.todo('Should update Workflow Relations', function(t) {});
                t.todo('Should update Custom Fields', function(t) {});
            });

        });
    });
});