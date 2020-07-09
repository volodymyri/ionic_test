Ext.define('criterion.controller.employee.Terminate', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_terminate',

        requires : [
            'criterion.view.employee.EmployeePicker'
        ],

        handleShow : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                employee = vm.get('employee'),
                employeeBenefits = vm.getStore('employeeBenefits'),
                statuses = [
                    i18n.gettext('Choose Reason and Date')
                ];

            view.setLoading(true);

            Ext.promise.Promise.all([
                employeeBenefits.loadWithPromise({
                    params : {
                        employeeId : employee.getId(),
                        isActive : true,
                        hideExpiredPlans : true
                    }
                }),
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_PLAN_HAS_ACTIVE_PLANS,
                    method : 'GET',
                    params : {
                        employeeId : employee.getId()
                    }
                })
            ]).then(function(res) {
                if (employeeBenefits.count()) {
                    statuses.push(i18n.gettext('Terminate Benefits'));
                } else {
                    me.lookup('card-benefits').destroy();
                }

                if (res[1]) {
                    statuses.push(i18n.gettext('Time offs Removal'));
                } else {
                    me.lookup('card-timeoffs').destroy();
                }

                if (employee.get('isHiringManager') || employee.get('isSupervisor') || employee.get('isRecruiter')) {
                    statuses.push(i18n.gettext('Choose new Employees'));
                } else {
                    me.lookup('card-employees').destroy();
                }

                vm.set('statuses', statuses);
                me.updateProgressIndicator();
                view.setLoading(false);
            });
        },

        updateProgressIndicator : function() {
            var cards = this.lookup('cardContainer'),
                vm = this.getViewModel();

            vm.set('activeViewIndex', cards.items.indexOf(cards.getLayout().getActiveItem()));
        },

        handlePrev : function() {
            var cards = this.lookup('cardContainer');

            cards.getLayout().prev();
            this.updateProgressIndicator();
        },

        handleNext : function() {
            var cards = this.lookup('cardContainer'),
                form = cards.getLayout().getActiveItem();

            if (form && !form.isValid()) {
                return;
            }

            cards.getLayout().next();
            this.updateProgressIndicator();
        },

        handleCancel : function() {
            this.getView().close();
        },

        _onSearch : function(fullNameParam, newEmployeeIdParam) {
            var vm = this.getViewModel(),
                cfg = {
                    isActive : true
                },
                picker;

            if (newEmployeeIdParam === 'newSupervisorId') {
                cfg['storeClass'] = 'criterion.store.employee.AvailableSupervisors';
                cfg['extraParams'] = {
                    employeeId : vm.get('employee.id')
                };
            } else {
                cfg.extraParams = {
                    excludeEmployeeIds : vm.get('employee.id')
                };
            }

            picker = Ext.create('criterion.view.employee.EmployeePicker', cfg);
            picker.show();
            picker.on('select', function(searchRecord) {
                vm.set(fullNameParam, searchRecord.get('fullName'));
                vm.set(newEmployeeIdParam, searchRecord.get('employeeId'));
            }, this);
            picker.on('destroy', function() {
                Ext.getBody().mask();
            });
        },

        handleSupervisorSearch : function() {
            this._onSearch('supervisorFullName', 'newSupervisorId');
        },

        handleHiringManagerSearch : function() {
            this._onSearch('hiringManagerFullName', 'newHiringManagerId');
        },

        handleRecruiterSearch : function() {
            this._onSearch('recruiterFullName', 'newRecruiterId');
        },

        handleSubmit : function() {
            var cards = this.lookup('cardContainer'),
                vm = this.getViewModel(),
                form = cards.getLayout().getActiveItem(),
                terminateBenefits = vm.get('terminateBenefits'),
                skipReassignment = vm.get('skipReassignment'),
                queryParams = {
                    employeeId : criterion.Api.getEmployeeId(),
                    terminateBenefits : terminateBenefits,
                    skipReassignment : skipReassignment
                },
                terminationData = {
                    terminationCd : vm.get('terminationCd'),
                    terminationDate : Ext.Date.format(vm.get('terminationDate'), criterion.consts.Api.DATE_FORMAT)
                },
                newSupervisorId = vm.get('newSupervisorId'),
                newHiringManagerId = vm.get('newHiringManagerId'),
                newRecruiterId = vm.get('newRecruiterId');

            if (vm.get('lockTerminationReason')) {
                delete terminationData['terminationCd'];
            }

            if (terminateBenefits) {
                queryParams['qualifyingEventCd'] = vm.get('eventCd');
            }

            newSupervisorId ? queryParams['newSupervisorId'] = newSupervisorId : null;
            newHiringManagerId ? queryParams['newHiringManagerId'] = newHiringManagerId : null;
            newRecruiterId ? queryParams['newRecruiterId'] = newRecruiterId : null;

            if (form && !form.isValid()) {
                return;
            }

            this.fireViewEvent('onTerminate', queryParams, terminationData);
            this.getView().close();
        }
    }
});
