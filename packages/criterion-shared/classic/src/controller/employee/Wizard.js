Ext.define('criterion.controller.employee.Wizard', function() {

    var API = criterion.consts.Api.API,
        hireUrl, _candidateJobPostingId;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_wizard',

        requires : [
            'criterion.model.Person',
            'criterion.model.Employee',
            'criterion.model.person.Address',
            'criterion.model.employer.jobPosting.Candidate',
            'criterion.model.Assignment',
            'criterion.model.assignment.Detail',
            'criterion.model.Position',
            'criterion.view.common.ChangeEmployeeForm',
            'criterion.view.person.LoginConfirm',
            'criterion.view.employee.Terminate',
            'criterion.view.employee.SubmitConfirm'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.ChangeEmployee',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        modes : {
            CREATE : 'CREATE',
            CREATE_BY_EXIST : 'CREATE_BY_EXIST',
            REHIRE : 'REHIRE',
            TRANSFER : 'TRANSFER',
            CANDIDATE_CREATE : 'CANDIDATE_CREATE'
        },

        listen : {
            global : {
                baseStoresLoaded : 'onBaseStoresLoaded'
            }
        },

        /**
         * @private
         */
        _mode : null,

        /**
         * @private
         */
        previousEmployee : null,

        init : function() {
            var routes = {},
                parent = this.getView().parentPage;

            routes[parent + '/addEmployee'] = 'handleRouteCreate';
            routes[parent + '/addEmployee/person/:personId'] = 'handleRouteAddEmployer';
            routes[parent + '/addEmployee/candidate/:candidateJobPostingId'] = 'handleCandidateRoute';

            routes[parent + '/addEmployee/rehire/person/:personId/:employerId'] = 'handleRouteRehire';
            routes[parent + '/addEmployee/transfer/person/:personId/:employerId'] = 'handleRouteTransfer';

            this.setRoutes(routes);

            this.callParent(arguments);
        },

        handleEligibleEmployersLoad : function(store) {
            this.getViewModel().set('employersCount', store.getCount());
        },

        onBaseStoresLoaded : function() {
            if (this._deferredCall) {
                this[this._deferredCall.method].apply(this, this._deferredCall.args);
            }
        },

        handleRouteCreate : function() {
            if (!criterion.Api.getEmployeeId()) {
                this._deferredCall = {
                    method : 'setMode',
                    args : [this.modes.CREATE]
                };
                return;
            }

            this.setMode(this.modes.CREATE);
        },

        handleRouteAddEmployer : function(personId) {
            if (!criterion.Api.getEmployeeId()) {
                this._deferredCall = {
                    method : 'setMode',
                    args : [this.modes.CREATE_BY_EXIST, personId]
                };
                return;
            }

            this.setMode(this.modes.CREATE_BY_EXIST, personId);
        },

        handleRouteRehire : function(personId, employerId) {
            if (!criterion.Api.getEmployeeId()) {
                this._deferredCall = {
                    method : 'setMode',
                    args : [this.modes.REHIRE, personId, employerId]
                };
                return;
            }

            this.setMode(this.modes.REHIRE, personId, employerId);
        },

        handleRouteTransfer : function(personId, employerId) {
            if (!criterion.Api.getEmployeeId()) {
                this._deferredCall = {
                    method : 'setMode',
                    args : [this.modes.TRANSFER, personId, employerId]
                };
                return;
            }

            this.setMode(this.modes.TRANSFER, personId, employerId);
        },

        handleCandidateRoute : function(candidateJobPostingId) {
            if (!criterion.Api.getEmployeeId()) {
                this._deferredCall = {
                    method : 'setModeCreateCandidate',
                    args : [candidateJobPostingId]
                };
                return;
            }

            Ext.defer(() => this.setModeCreateCandidate(candidateJobPostingId), 500);
        },

        getMode : function() {
            return this._mode;
        },

        setModeCreateCandidate : function(candidateJobPostingId) {
            var me = this,
                jobPostingCandidate = Ext.create('criterion.model.employer.jobPosting.Candidate', {id : parseInt(candidateJobPostingId, 10)}),
                view = this.getView(),
                vm = this.getViewModel();

            this.resetUiState();
            this._mode = this.modes.CANDIDATE_CREATE;

            this.getStore('eligibleEmployers').getProxy().setUrl(criterion.consts.Api.API.EMPLOYER);
            hireUrl = criterion.consts.Api.API.EMPLOYEE_HIRE_NEW;

            view.setLoading(true);

            Ext.promise.Promise.all([
                this.bootstrapData(),
                jobPostingCandidate.loadWithPromise()
            ]).then({
                scope : this,
                success : function() {
                    var candidate = jobPostingCandidate.getCandidate(),
                        jobPosting = jobPostingCandidate.getJobPosting(),
                        onboarding = jobPostingCandidate.onboarding(),
                        onboardingPage = this.lookup('onboarding'),
                        position = jobPosting.getPosition(),
                        employerId = position.get('employerId'),
                        barEmployerCombo = me.lookup('barEmployerCombo'),
                        person = vm.get('person'),
                        address = vm.get('address'),
                        employee = vm.get('employee'),
                        employment = this.lookup('employment');

                    _candidateJobPostingId = candidateJobPostingId;

                    person && person.set({
                        firstName : candidate.get('firstName'),
                        lastName : candidate.get('lastName'),
                        middleName : candidate.get('middleName'),
                        email : candidate.get('email'),
                        mobilePhone : candidate.get('mobilePhone'),
                        dateOfBirth : candidate.get('dateOfBirth'),
                        nationalIdentifier : candidate.get('ssn'),
                        disabilityCd : candidate.get('disabilityCd'),
                        genderCd : candidate.get('genderCd'),
                        ethnicityCd : candidate.get('ethnicityCd'),
                        homePhone : candidate.get('homePhone'),
                        militaryStatusCd : candidate.get('militaryStatusCd')
                    });

                    address && address.set({
                        address1 : candidate.get('address1'),
                        address2 : candidate.get('address2'),
                        city : candidate.get('city'),
                        countryCd : candidate.get('countryCd'),
                        postalCode : candidate.get('postalCode'),
                        stateCd : candidate.get('stateCd')
                    });

                    Ext.Function.defer(function() { // vm not updated reliably after barEmployerCombo.setValue(employerId);
                        employee && employee.set({
                            employerId : employerId
                        });
                        employment.getViewModel().notify();
                        barEmployerCombo.setValue(employerId);
                        barEmployerCombo.setDisabled(true);
                        position && employment.getController().selectPosition(position);

                        if (onboarding && onboarding.count()) {
                            onboardingPage.getViewModel().getStore('employeeOnboardings').setData(Ext.Array.map(onboarding.getRange(), function(onboard) {
                                var onboardData = onboard.getData();

                                delete onboardData.id;

                                return onboardData;
                            }));
                        }
                    }, 100);
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        /**
         * Sets current mode of Wizard, init data loading .
         *
         * @param {String} mode {@see #modes}
         * @param {Integer} [personId]
         * @param {Integer} [employerId]
         */
        setMode : function(mode, personId, employerId) {
            var view = this.getView(),
                afterBootstrap = Ext.emptyFn,
                me = this,
                vm = this.getViewModel();

            if (!Ext.Object.getKey(this.modes, mode)) {
                Ext.Logger.warn('Wrong mode.');
                return;
            }

            this.resetUiState();

            view.setLoading(true);

            this._mode = mode;
            vm.set('minHireDate', null);

            switch (mode) {
                case this.modes.CREATE:
                    this.getStore('eligibleEmployers').getProxy().setUrl(criterion.consts.Api.API.EMPLOYER);
                    hireUrl = criterion.consts.Api.API.EMPLOYEE_HIRE_NEW;
                    afterBootstrap = function() {
                        me.setEmployerValue();
                    };
                    break;

                case this.modes.CREATE_BY_EXIST:
                    this.getStore('eligibleEmployers').getProxy().setUrl(criterion.consts.Api.API.EMPLOYER_ELIGIBLE_FOR_HIRE);
                    hireUrl = criterion.consts.Api.API.EMPLOYEE_HIRE_EXISTING;
                    afterBootstrap = function() {
                        me.setEmployerValue();
                    };
                    break;

                case this.modes.REHIRE:
                    this.getStore('eligibleEmployers').getProxy().setUrl(criterion.consts.Api.API.EMPLOYER_ELIGIBLE_FOR_REHIRE);
                    hireUrl = criterion.consts.Api.API.EMPLOYEE_REHIRE;
                    afterBootstrap = function() {
                        me.previousEmployee = vm.getStore('employees').findEmployee(personId, employerId);
                        me.setEmployerValue();
                    };
                    break;

                case this.modes.TRANSFER:
                    this.getStore('eligibleEmployers').getProxy().setUrl(criterion.consts.Api.API.EMPLOYER_ELIGIBLE_FOR_TRANSFER);
                    afterBootstrap = function() {
                        me.previousEmployee = vm.getStore('employees').findEmployee(personId, employerId);
                        hireUrl = Ext.String.format(criterion.consts.Api.API.EMPLOYEE_TRANSFER, me.previousEmployee.getId());
                        me.setEmployerValue();

                    };
                    break;

                case this.modes.CANDIDATE_CREATE:
                    // not supported, has it's own handler
                    break;
            }

            this.bootstrapData(personId)
                .then({
                    scope : this,
                    success : afterBootstrap
                })
                .always(function() {
                    view.setLoading(false);
                })
        },

        /**
         * @private
         */
        resetUiState : function() {
            this.getView().createItems();

            this.lookup('barEmployerCombo').setDisabled(false);
            this.getView().setActiveItem(this.lookup('basicDemographics'));
            this.updateProgressIndicator();
        },

        /**
         * @private
         * @param personId
         * @returns {*|Ext.promise.Promise}
         */
        bootstrapData : function(personId) {
            let vm = this.getViewModel(),
                eligibleEmployers = this.getStore('eligibleEmployers'),
                addresses = vm.getStore('addresses'),
                employees = vm.getStore('employees'),
                employment = this.lookup('employment'),
                basicDemographics = this.lookup('basicDemographics'),
                customFieldsDemographics = basicDemographics.getCustomfieldsContainer(),
                customFieldsEmployee = employment.getCustomfieldsEmployeeContainer(),
                customFieldsAssignmentDetail = employment.getCustomfieldsAssignmentDetailContainer(),
                promises = [],
                person, address, employee;

            personId = parseInt(personId, 10) || null;

            // reset VM state

            person = Ext.create('criterion.model.Person', {
                personId : personId
            });
            address = Ext.create('criterion.model.person.Address');
            employee = Ext.create('criterion.model.Employee');

            vm.set({
                geocode : null,
                employee : employee,
                position : null,
                person : person,
                address : address
            });

            // query bootstrap data

            if (personId) {
                promises.push(eligibleEmployers.loadWithPromise({
                    params : {
                        personId : personId
                    }
                }));

                promises.push(person.loadWithPromise());
                promises.push(addresses.loadWithPromise({
                    params : {
                        personId : personId
                    }
                }).then({
                    success : function() {
                        var address = addresses.findRecord('isPrimary', true);

                        vm.set({
                            address : address,
                            geocode : address.get('geocode'),
                            person : person
                        });
                    }
                }));
                promises.push(employees.loadWithPromise({
                    params : {
                        personId : personId
                    }
                }));
                customFieldsDemographics && promises.push(customFieldsDemographics.load(personId));
            } else {
                promises.push(eligibleEmployers.loadWithPromise());
                promises.push(this.loadCodeDataForModels([person, address, employee]));
                customFieldsDemographics && promises.push(customFieldsDemographics.load());
            }

            return Ext.promise.Promise.all(promises);
        },

        /**
         * @private
         */
        setEmployerValue : function() {
            var barEmployerCombo = this.lookupReference('barEmployerCombo'),
                employers = this.getStore('eligibleEmployers');

            if (employers.count() === 1) {
                // by some reason, eligibleEmployers store is not bound to combobox at the moment
                Ext.defer(function() {
                    barEmployerCombo.fireEvent('change', barEmployerCombo, employers.getAt(0).getId()); // only change event fires onBarEmployerChange action
                }, 100, this);
            }
        },

        onBarEmployerChange : function(cmp, employerId) {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                employees = vm.getStore('employees'),
                niField = view.down('[reference=nationalIdentifier]'),
                employmentEmployerCombo = view.down('criterion_employee_wizard_employment criterion_employer_combo'),
                employer = cmp.getSelection(), employee,
                mode = me.getMode(),
                employmentVm = this.lookupReference('employment').getViewModel(),
                setEmployeeData = function() {
                    let person = vm.get('person'),
                        personId = person && person.getId(),
                        generateNumberParams = {
                            employerId : employerId
                        };

                    if (!person.phantom) {
                        employee = employees.findEmployee(personId, employerId);
                        if (cmp.getStore().count() === 1 && (mode !== me.modes.TRANSFER || !me.previousEmployee)) {
                            me.previousEmployee = vm.getStore('employees').findEmployee(personId, employerId);
                        }
                    }

                    if (employee) {
                        me._setExistEmployee(employee.getData({associated : true}));
                    } else {
                        me._setEmptyEmployee(employerId);
                    }

                    if (!person.phantom) {
                        generateNumberParams['personId'] = personId;
                    }

                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYEE_GENERATE_EMPLOYEE_NUMBER,
                        params : generateNumberParams,
                        method : 'GET'
                    }).then((employeeNumber) => employmentVm.set('employee.employeeNumber', employeeNumber));
                };

            niField && employer && niField.setCountryCd(employer.get('countryCd'));
            employmentEmployerCombo && employmentEmployerCombo.setValue(employerId);

            if (!employerId) {
                return;
            }

            if (employees.isLoading()) {
                employees.on('load', setEmployeeData, this, {single : true})
            } else {
                setEmployeeData();
            }
        },

        _setEmptyEmployee : function(employerId) {
            let vm = this.getViewModel(),
                view = this.getView(),
                employment = this.lookupReference('employment'),
                employmentVm = employment.getViewModel(),
                customFieldsEmployee = employment.getCustomfieldsEmployeeContainer(),
                customFieldsAssignmentDetail = employment.getCustomfieldsAssignmentDetailContainer(),
                employee = Ext.create('criterion.model.Employee', {
                    employerId : employerId
                }),
                hireDate,
                promises = [];

            if (this.getMode() === this.modes.REHIRE && this.previousEmployee) {
                hireDate = Ext.Date.add(this.previousEmployee.get('terminationDate'), Ext.Date.DAY, 1);

                vm.set('minHireDate', hireDate);
                employee.set('hireDate', hireDate);
            }

            if (this.getMode() === this.modes.TRANSFER && this.previousEmployee) {
                hireDate = Ext.Date.add(this.previousEmployee.get('hireDate'), Ext.Date.DAY, 1);

                vm.set('minHireDate', hireDate);
            }

            vm.set('employee', employee);

            employmentVm.set({
                position : null,
                assignmentDetail : Ext.create('criterion.model.assignment.Detail'),
                employee : employee
            });

            customFieldsEmployee && promises.push(customFieldsEmployee.load());
            customFieldsAssignmentDetail && promises.push(customFieldsAssignmentDetail.load());

            if (promises.length) {
                view.setLoading(true);
                Ext.promise.Promise.all(promises).always(function() {
                    view.setLoading(false);
                });
            }
        },

        _setExistEmployee : function(employeeData) {
            var vm = this.getViewModel(),
                view = this.getView(),
                employment = this.lookupReference('employment'),
                employmentVm = employment.getViewModel(),
                assignmentDetail = employmentVm.get('assignmentDetail'),
                customFieldsEmployee = employment.getCustomfieldsEmployeeContainer(),
                customFieldsAssignmentDetail = employment.getCustomfieldsAssignmentDetailContainer(),
                employee,
                position,
                assignment,
                hireDate,
                promises = [],
                mode = this.getMode();

            assignment = employeeData.assignment;

            employee = Ext.create('criterion.model.Employee', employeeData);
            employee.phantom = false;
            employee.modified = {};
            employee.dirty = false;

            employee.set({
                terminationCd : null,
                terminationDate : null
            });

            if (employeeData.position) {
                position = Ext.create('criterion.model.Position', employeeData.position);
            }

            if (mode === this.modes.REHIRE) {
                hireDate = Ext.Date.add(this.previousEmployee.get('terminationDate'), Ext.Date.DAY, 1);

                vm.set('minHireDate', hireDate);
                employee.set('hireDate', hireDate);
            }

            if (mode === this.modes.TRANSFER) {
                employee.set('hireDate', null);
            }

            vm.set('employee', employee);

            position && employment.getController().selectPosition(position);

            if (assignment) {
                employmentVm.set('assignmentId', assignment.assignmentId);
                assignmentDetail.set({
                    assignmentActionCd : assignment.assignmentActionCd,
                    payRate : assignment.payRate,
                    rateUnitCd : assignment.rateUnitCd,
                    fullTimeEquivalency : assignment.fullTimeEquivalency
                });
            }

            if (employeeData.employeeWorkLocation) {
                assignmentDetail.set('primaryWorkLocationId', employeeData.employeeWorkLocation.employerWorkLocationId);
            }

            // bypass logic of set
            Ext.defer(function() {
                if (assignment) {
                    employmentVm.get('assignmentDetail').set({
                        payRate : assignment.payRate,
                        rateUnitCd : assignment.rateUnitCd
                    });
                }

                employmentVm.set('employee', employee);
            }, 1000);

            customFieldsEmployee && promises.push(customFieldsEmployee.load(employee.getId()));
            assignment && customFieldsAssignmentDetail && promises.push(customFieldsAssignmentDetail.load(assignment.id));

            if (promises.length) {
                view.setLoading(true);
                Ext.promise.Promise.all(promises).always(function() {
                    view.setLoading(false);
                });
            }
        },

        loadCodeDataForModels : function(models) {
            var promises = [];

            Ext.Array.each(models, function(model) {
                var dfd = Ext.create('Ext.Deferred');

                model.loadCodeData(function() {
                    dfd.resolve();
                });

                promises.push(dfd.promise);
            });

            return Ext.Deferred.all(promises);
        },

        updateProgressIndicator : function() {
            var cards = this.getView();
            this.getViewModel().set('activeViewIndex', cards.items.indexOf(cards.getLayout().getActiveItem()));
        },

        onNextClick : function() {
            var view = this.getView(),
                layout = view.getLayout(),
                cards = view.items,
                form = layout.getActiveItem().getForm(),
                employerCombo = this.lookup('barEmployerCombo'),
                vm = this.getViewModel(),
                employerIsValid = employerCombo.isValid(),
                ssnField = view.lookup('basicDemographics').lookup('nationalIdentifier');

            // fix edge bug, when clicking next without removing the focus
            if (Ext.isEdge) {
                ssnField.fireEvent('blur', ssnField);
            }

            if (form.isValid() && employerIsValid) {
                if (layout.getActiveItem().getXType() === 'criterion_employee_demographic_basic') {
                    var person = vm.get('person');

                    view.setLoading(true);
                    if (person.phantom) {
                        criterion.Api.requestWithPromise({
                            url : API.PERSON_VALIDATE_EMAIL,
                            params : {
                                email : person.get('email')
                            },
                            method : 'GET'
                        }).then(function() {
                            layout.next();
                            vm.set('activeViewIndex', cards.items.indexOf(layout.getActiveItem()));
                        }, function() {
                            view.setLoading(false);
                        }).always(function() {
                            view.setLoading(false);
                        });
                    } else {
                        criterion.Api.requestWithPromise({
                            url : API.PERSON_VALIDATE_EMAIL_UPDATE,
                            params : {
                                id : person.getId(),
                                email : person.get('email')
                            },
                            method : 'GET'
                        }).then(function() {
                            layout.next();
                            vm.set('activeViewIndex', cards.items.indexOf(layout.getActiveItem()));
                        }, function() {
                            view.setLoading(false);
                        }).always(function() {
                            view.setLoading(false);
                        })
                    }
                } else {
                    layout.next();
                    vm.set('activeViewIndex', cards.items.indexOf(layout.getActiveItem()));
                }
            }
        },

        onPrevClick : function() {
            var layout = this.getView().getLayout(),
                cards = this.getView().items;

            layout.prev();
            this.getViewModel().set('activeViewIndex', cards.items.indexOf(layout.getActiveItem()));
        },

        onSaveClick : function() {
            var me = this,
                vm = this.getViewModel(),
                employee = vm.get('employee'),
                employment = this.lookup('employment'),
                wnd;

            if (!employment.getForm().isValid()) {
                return;
            }

            if (employee.phantom && !employment.getViewModel().get('employeeGroupMember').count()) {
                criterion.Msg.confirm(
                    i18n.gettext('Employee Groups'),
                    i18n.gettext('This employee is not assigned to any groups. Do you want to continue?'),
                    function(btn) {
                        if (btn === 'yes') {
                            doSave.call(me);
                        }
                    }
                );
            } else {
                doSave.call(this);
            }

            function doSave() {
                if (this.getMode() === this.modes.TRANSFER) {
                    wnd = Ext.create('criterion.view.employee.Terminate', {
                        viewModel : {
                            data : {
                                employee : me.previousEmployee,
                                lockTerminationReason : true,
                                minDate : this.previousEmployee.get('hireDate'),
                                maxDate : Ext.Date.add(vm.get('employee').get('hireDate'), Ext.Date.DAY, -1)
                            }
                        }
                    });

                    wnd.show();

                    wnd.on('onTerminate', function(view, queryParams, terminationData) {
                        var data = Ext.Object.merge(queryParams, terminationData);

                        delete data['employeeId']; // skip this, the transfer not in a workflow now
                        me.saveEmployee(data);
                    }, this);
                } else {
                    this.saveEmployee();
                }
            }
        },

        saveEmployee : function(additionalSavingParams) {
            let me = this,
                vm = this.getViewModel(),
                employment = this.lookup('employment'),
                onboardingPage = this.lookup('onboarding'),
                onboarding = onboardingPage.getViewModel().getStore('employeeOnboardings'),
                employmentVm = employment.getViewModel(),
                employeeWorkLocations = employmentVm.getStore('employeeWorkLocations'),
                employeeGroupMember = employmentVm.getStore('employeeGroupMember'),
                employee = vm.get('employee'),
                person = vm.get('person'),
                address = vm.get('address'),
                basicDemographics = this.lookup('basicDemographics'),
                customFieldsDemographics = basicDemographics.getCustomfieldsContainer(),
                customFieldsEmployee = employment.getCustomfieldsEmployeeContainer(),
                customFieldsAssignmentDetail = employment.getCustomfieldsAssignmentDetailContainer(),
                isNewPerson = person.phantom,
                hire = Ext.create('criterion.model.employee.Hire'),
                mode = this.getMode(),
                assignmentDetail;

            hire.getProxy().setUrl(hireUrl);

            // extra actions
            employee.set('personId', person.getId());
            // end of

            assignmentDetail = employmentVm.get('assignmentDetail');

            hire.setPerson(person);
            hire.setAddress(address);
            hire.setEmployee(employee);
            hire.setAssignmentDetail(assignmentDetail);

            employeeWorkLocations.cloneToStore(hire.employeeWorkLocations(), mode === this.modes.CREATE_BY_EXIST);
            employeeGroupMember.cloneToStore(hire.groups());
            onboarding.cloneToStore(hire.onboarding());

            // some rubbish related to CRITERION-6856
            hire.set('assignment', {
                wf1EmployeeId : assignmentDetail.get('wf1EmployeeId'),
                wf2EmployeeId : assignmentDetail.get('wf2EmployeeId')
            });
            // end of
            // data which need to approving
            hire.set('additionalData', {
                orgStructureNames : employment.getOrgStructureValues(),
                employerData : employmentVm.get('employer').getData(),
                salaryGradeName : employment.getSalaryGradeName()
            });

            // questionable business logic
            hire.getAssignmentDetail().set('effectiveDate', employee.get('hireDate'));
            // end of

            hire.set({
                performerId : criterion.Api.getEmployeeId()
            });

            _candidateJobPostingId && hire.set('candidateJobPostingId', _candidateJobPostingId);

            employment.setLoading(true);

            // isWorkflow
            hire.saveWithPromise(additionalSavingParams)
                .then(function(res) {
                    let employeeId = res.data.employee.id,
                        personId = res.data.person && res.data.person.id || person.getId(),
                        assignmentDetailId = res.data.assignmentDetail.id,
                        hasWorkflow = res.data.hasWorkflow,
                        after = function() {
                            if (onboarding.count()) {
                                me.redirectTo(Ext.String.format(criterion.consts.Route.HR.EMPLOYEE_ONBOARDING, employeeId), null);
                            } else {
                                me.redirectTo(criterion.consts.Route.HR.EMPLOYEE + '/' + employeeId, null);
                            }
                        },
                        promises = [];

                    promises.push(customFieldsDemographics.save(personId));
                    promises.push(customFieldsEmployee.save(employeeId));
                    assignmentDetailId && promises.push(customFieldsAssignmentDetail.save(assignmentDetailId));

                    Ext.promise.Promise.all(promises).always(function() {
                        if (isNewPerson) {
                            Ext.create('criterion.view.person.LoginConfirm', {
                                person : person,
                                hasWorkflow : hasWorkflow,
                                listeners : {
                                    destroy : after
                                }
                            }).show();
                        } else {
                            criterion.Utils.toast(i18n.gettext('Successfully Saved.'));
                            after();
                        }
                    });
                })
                .always(function() {
                    employment.setLoading(false);
                });

        },

        onCancelClick : function() {
            var returnTo = criterion.consts.Route.getPrevRoute(),
                prevURL = criterion.consts.Route.HR.EMPLOYEES;

            if (returnTo) {
                criterion.consts.Route.setPrevRoute();
                prevURL = returnTo;
            }

            this.redirectTo(prevURL);
        }
    };
});
