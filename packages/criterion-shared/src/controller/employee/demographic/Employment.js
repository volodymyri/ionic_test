Ext.define('criterion.controller.employee.demographic.Employment', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_demographic_employment',

        listen : {
            controller : {
                '*' : {
                    selectedPersonSet : 'handlePersonSet'
                }
            }
        },

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        handleSave : function() {
            var view = this.getView();

            if (view.isValid()) {
                this.saveEmployee();
            }
        },

        handleResubmit : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                employee = vm.get('employee');

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : Ext.String.format(criterion.consts.Api.API.EMPLOYEE_RESUBMIT, employee.getId()),
                method : 'POST'
            })
                .then(() => this.load())
                .always(() => view.setLoading(false));
        },

        handleTerminate : function() {
            var vm = this.getViewModel(),
                employee = vm.get('employee'),
                dfd = Ext.create('Ext.promise.Deferred'),
                wnd;

            var modified = Ext.Object.getKeys(employee.modified),
                customValues = this.lookupReference('customfieldsEmployee').getController().getChanges(employee.getId());

            if (Ext.Array.difference(modified, ['terminationDate', 'terminationCd']).length || customValues.modifiedCustomValues.length || customValues.removedCustomValues.length) {
                criterion.Msg.error(i18n.gettext('Unsaved changes will be lost. Continue termination?'));
                criterion.Msg.confirm(
                    i18n.gettext('Confirm'),
                    i18n.gettext('Unsaved changes will be lost. Continue termination?'),
                    function(btn) {
                        if (btn === 'yes') {
                            dfd.resolve();
                        } else {
                            dfd.reject();
                        }
                    }
                );
            } else {
                dfd.resolve();
            }

            dfd.promise.then({
                scope : this,
                success : function() {
                    wnd = Ext.create('criterion.view.employee.Terminate', {
                        viewModel : {
                            data : {
                                employee : vm.get('employee')
                            }
                        }
                    });

                    wnd.show();

                    wnd.on('onTerminate', function(view, queryParams, terminationData) {
                        this.terminate(queryParams, terminationData);
                    }, this);
                }
            });
        },

        handleDelete : function() {
            let me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                employee = vm.get('employee'),
                employeeId = employee.getId();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYEE + '/' + employeeId,
                method : 'DELETE'
            }).then(() => {
                me.redirectTo(criterion.consts.Route.HR.EMPLOYEES, null);
            }).always(() => {
                view.setLoading(false);
            });
        },

        handleUnterminate : function() {
            let me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                employee = vm.get('employee'),
                employeeId = employee.getId(),
                employeePanel = view.up('criterion_employee');

            criterion.Msg.confirm(
                i18n.gettext('Confirm'),
                i18n.gettext('Do you want to undo the termination of this employee?'),
                (btn) => {
                    if (btn === 'yes') {
                        view.setLoading(true);
                        criterion.Api.requestWithPromise({
                            url : Ext.String.format(criterion.consts.Api.API.EMPLOYEE_UNTERMINATE, employeeId),
                            method : 'POST'
                        }).then(() => {
                            criterion.Msg.info({
                                title : i18n.gettext('Undo Termination'),
                                message : i18n.gettext('The termination has been reverted & employee groups recalculated for this employee. Please configure the benefits, time off plans, and reporting structure as needed.')
                            });
                            employeePanel.fireEvent('reloadEmployee');
                        }).always(() => {
                            view.setLoading(false);
                        });
                    }
                }
            );
        },

        /**
         * @returns {boolean}
         */
        hasRelationshipChanges : function() {
            var has = false,
                employee = this.getViewModel().get('employee'),
                modified = (employee && employee.modified && Ext.Object.getKeys(employee.modified)) || [];

            Ext.each(modified, function(fieldName) {
                if (/^org[1-4]EmployeeId$/.test(fieldName)) {
                    has = true;
                }
            });

            return has;
        },

        saveEmployee : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                employeePanel = view.up('criterion_employee'),
                employee = vm.get('employee'),
                isNew = employee.phantom,
                employeeId = employee.getId(),
                me = this,
                dfd = Ext.create('Ext.Deferred');

            employee.set({
                personId : vm.get('person').getId(),
                employerId : vm.get('employer').getId()
            });

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.RELATIONSHIP, !this.hasRelationshipChanges()).then(function(signature) {

                employeePanel.setLoading(true);
                me.setCorrectMaskZIndex(false);

                if (signature) {
                    employee.set('signature', signature);
                }

                employee.saveWithPromise({
                    isWorkflow : true,
                    employeeId : employee.getId(),
                    performerId : criterion.Api.getEmployeeId()
                }).then(function() {
                    criterion.Utils.toast(i18n.gettext('Profile Saved.'));

                    if (vm.get('showCustomfields')) {
                        me.lookupReference('customfieldsEmployee').getController().save(employee.getId());
                    }

                    employeePanel.setLoading(false);
                    // reloadEmployee uses same view mask so it mast be called after current operation hide loading mask
                    employeePanel.fireEvent('reloadEmployee');

                    if (isNew) {
                        employeePanel.getController().redirectToEmployee(employee.getId())
                    }
                }).always(function() {
                    employeePanel.setLoading(false);
                    dfd.resolve();
                });
            });

            return dfd.promise;
        },

        terminate : function(queryParams, terminationData) {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                employee = vm.get('employee'),
                employeeId = employee.getId(),
                employeePanel = view.up('criterion_employee');

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_TERM).then(function(signature) {

                view.setLoading(true);
                me.setCorrectMaskZIndex(false);

                if (signature) {
                    terminationData['signature'] = signature;
                }

                criterion.Api.requestWithPromise({
                    url : Ext.String.format(criterion.consts.Api.API.EMPLOYEE_TERMINATE, employeeId),
                    urlParams : queryParams,
                    jsonData : terminationData,
                    method : 'POST'
                }).then({
                    scope : this,
                    success : function() {
                        employeePanel.fireEvent('reloadEmployee');
                    }
                }).always(function() {
                    view.setLoading(false);
                });
            });

        },

        handlePersonSet : function() {
            if (!this.checkViewIsActive()) {
                return;
            }

            this.load();
        },

        onEmployeeChange : function() {
            this.load();
        },

        load : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel();

            if (!view || !vm) {
                return;
            }

            var employee = vm.get('employee'),
                employerId = vm.get('employer') && vm.get('employer').getId() || vm.get('employerId') || (employee && employee.get('employerId')),
                workLocations = vm.getStore('workLocations'),
                employerWorkLocations = vm.getStore('employerWorkLocations'),
                employeeWorkLocation,
                employeeId;

            if (!employee || !employerId) {
                return;
            }

            employeeId = employee.getId();

            vm.set({
                payFrequency : null
            });

            employee.isModel && employee.set('employerId', employerId);

            var promises = [
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.RELATIONSHIP),
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_TERM),
                workLocations.loadWithPromise(),
                employerWorkLocations.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                })
            ];

            view.setLoading(true);

            if (employee.phantom) {
                if (vm.get('showCustomfields')) {
                    promises.push(this.lookupReference('customfieldsEmployee').getController().load());
                }
            } else {
                if (vm.get('showCustomfields')) {
                    promises.push(this.lookupReference('customfieldsEmployee').getController().load(employee.getId()));
                }
            }

            employeeWorkLocation = employee.getEmployeeWorkLocation();
            employeeWorkLocation && employee.set('employerWorkLocationId', employeeWorkLocation.get('employerWorkLocationId'));

            Ext.promise.Promise.all(promises)
                .always(function() {
                    view.setLoading(false);
                });
        },

        handleSelectWorkLocation : function() {
            var vm = this.getViewModel(),
                employee = vm.get('employee'),
                employeeId = employee.getId(),
                employeeWorkLocations = employee.employeeWorkLocations();

            var selectWorkLocationWindow = Ext.create('criterion.view.employee.demographic.SelectWorkLocations', {
                viewModel : {
                    data : {
                        employeeId : employeeId,
                        employerId : employee.get('employerId')
                    },
                    stores : {
                        employeeWorkLocations : employeeWorkLocations
                    }
                }
            });

            selectWorkLocationWindow.on('submit', function(selectedEmployerLocationIds, primaryEmployerLocationId) {
                employeeWorkLocations.rejectChanges();

                if (!selectedEmployerLocationIds.length) {
                    employeeWorkLocations.removeAll();
                    return
                }

                Ext.Array.each(selectedEmployerLocationIds, function(newEmployerWorkLocationId) {
                    var workLocationId = newEmployerWorkLocationId,
                        existingRecord = employeeWorkLocations.findRecord('employerWorkLocationId', workLocationId, 0, false, false, true),
                        isPrimary = workLocationId === primaryEmployerLocationId;

                    if (!existingRecord) {
                        existingRecord = employeeWorkLocations.add({
                            employeeId : employeeId,
                            employerWorkLocationId : workLocationId,
                            isActive : true
                        })[0];
                    }

                    existingRecord.set('isPrimary', isPrimary);

                    employeeWorkLocations.each(function(employeeWorkLocation) {
                        if (selectedEmployerLocationIds.indexOf(employeeWorkLocation.get('employerWorkLocationId')) === -1) {
                            employeeWorkLocation.drop();
                        }
                    });
                });

                vm.get('employee').set('employerWorkLocationId', primaryEmployerLocationId);
            }, this);

            selectWorkLocationWindow.on('destroy', function() {
                this.setCorrectMaskZIndex(true);
            }, this);

            selectWorkLocationWindow.show();
            this.setCorrectMaskZIndex(true);
        },

        handleActivate : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        init : function() {
            this.load = Ext.Function.createBuffered(this.load, 100, this);

            this.callParent(arguments);
        }
    };

});
