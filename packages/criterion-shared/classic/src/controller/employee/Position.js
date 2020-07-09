Ext.define('criterion.controller.employee.Position', function() {

    let positionModified = false,
        oldDetail = null;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_position',

        requires : [
            'criterion.model.Position',
            'criterion.view.employee.EmployeePicker',
            'criterion.view.PositionPicker',
            'criterion.view.assignment.Terminate',
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.view.assignment.PayInformation',
            'criterion.model.assignment.Primary',
            'criterion.view.employee.position.FieldValueSelector'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.WorkflowHighlight'
        ],

        handleActivate : function() {
            let view = this.getView(),
                vm = this.getViewModel();

            if (view.isDirty() && vm.get('editMode') && vm.get('isPrimary')) {
                view.handleClose();
            }

            this.load();
        },

        onBeforeEmployeeChange : function() {
            let vm = this.getViewModel(),
                identity = this.identity;

            if (!vm) {
                return;
            }

            vm.set({
                employee : identity.employee,
                assignment : null,
                position : null,
                employerId : identity.employer.getId(),
                remainingFTE : null,
                showPositionReporting : identity.employer.get('isPositionWorkflow'),
                isPositionControl : identity.employer.get('isPositionControl')
            });
        },

        onEmployeeChange : function() {
            this.load();
        },

        getEmployeeId : function() {
            let employee = this.getViewModel().get('employee'),
                employeeId = this.callParent(arguments);

            return employeeId || employee && employee.getId();
        },

        load : function(record) {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                employeeId,
                assignment, isPrimary, shouldLoad,
                employerWorkPeriods,
                employerId,
                url = Ext.History.getToken();

            if (!vm || view.destroyed || !this.checkViewIsActive()) {
                return;
            }

            employeeId = this.getEmployeeId();
            employerWorkPeriods = vm.getStore('employerWorkPeriods');
            employerId = vm.get('employerId');

            if (!employeeId || !employerId) {
                return;
            }

            isPrimary = vm.get('isPrimary');

            if (!isPrimary && !record) { // false init of global identity mixin
                return;
            }

            if (isPrimary) {
                assignment = Ext.create('criterion.model.assignment.Primary', {id : 'fake'});
                shouldLoad = true;
            } else if (record.phantom) {
                assignment = Ext.create('criterion.model.Assignment');
            } else {
                assignment = Ext.create('criterion.model.Assignment', record.getData());
                shouldLoad = true;
            }

            if (shouldLoad) { // loading existing

                // check employeeId except positionHistory page
                if (criterion.Application.isAdmin() && !/positionHistory/.test(url) && parseInt(url.split('/')[2], 10) !== employeeId) {
                    // old employee detected
                    return;
                }

                view.setLoading(true);
                vm.set('blockedState', false);

                Ext.promise.Promise.all([
                    me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.ASSIGNMENT),
                    assignment.loadWithPromise({
                        skipIdCheck : true,
                        params : {
                            joinWorkflowLog : true,
                            employeeId : employeeId
                        }
                    }),
                    employerWorkPeriods.loadWithPromise({params : {employerId : employerId}}),
                    criterion.Api.hasCertifiedRate() ? vm.get('certifiedRates').loadWithPromise({params : {employerId : employerId}}) : null
                ]).then({
                    scope : this,
                    success : function() {
                        let activeDetail;

                        view.fireEvent('assignmentLoaded', assignment);

                        if (view.getActiveDetailId()) {
                            activeDetail = assignment.assignmentDetails().getById(view.getActiveDetailId());
                        } else {
                            activeDetail = assignment.getActiveOrLastDetail();
                        }

                        vm.set({
                            activeDetail : activeDetail,
                            assignment : assignment,
                            position : assignment.getPosition()
                        });

                        Ext.promise.Promise.all([
                            me.lookupReference('customFields').getController().load(activeDetail.getId())
                        ]).then({
                            scope : this,
                            success : function() {
                                let assignment = vm.get('assignment'),
                                    workflowLog = assignment && assignment.getWorkflowLog && assignment.getWorkflowLog();

                                me._fillSalaryGradeData();
                                me.highlightWorkflowLogFields(workflowLog);
                            }
                        })
                    },
                    failure : function() {
                        view.setLoading(false);
                    }
                })
            } else { // creating new
                assignment.assignmentDetails().add({});

                vm.set({
                    activeDetail : assignment.getActiveOrLastDetail(),
                    assignment : assignment
                });

                view.setLoading(true);
                vm.set('blockedState', false);

                Ext.promise.Promise.all([
                    me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.ASSIGNMENT),
                    employerWorkPeriods.loadWithPromise({params : {employerId : employerId}}),
                    me.lookupReference('customFields').getController().load(),
                    criterion.Api.hasCertifiedRate() ? vm.get('certifiedRates').loadWithPromise({params : {employerId : employerId}}) : null
                ]).then({
                    scope : this,
                    success : function() {
                        view.setLoading(false);
                        me.handleSwitchToEdit();
                    }
                });
            }
        },

        _getRequestData(changed) {
            return Ext.Object.merge(changed, changed['assignmentDetails'] ? changed['assignmentDetails'][0] : {});
        },

        _fillRemaingFTE : function(toActiveDetail) {
            let vm = this.getViewModel(),
                activeDetail = vm.get('activeDetail'),
                position = vm.get('position'),
                isPositionControl = vm.get('isPositionControl'),
                fteField = this.lookupReference('fteField'),
                dfd, promise;

            if (position && isPositionControl) {
                promise = criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYER_POSITION_SEARCH_REMAINING_FTE,
                    method : 'GET',
                    params : {
                        positionId : position.getId()
                    }
                }).then(function(remainingFTE) {
                    if (!positionModified && !activeDetail.isModified('fullTimeEquivalency')) {
                        remainingFTE += activeDetail.get('fullTimeEquivalency');
                    }

                    vm.set('remainingFTE', remainingFTE);
                    toActiveDetail && activeDetail && activeDetail.set('fullTimeEquivalency', remainingFTE >= 1 ? 1 : remainingFTE);
                    vm.notify();
                    fteField.isValid();
                });
            } else {
                dfd = Ext.create('Ext.Deferred');
                vm.set('remainingFTE', null);
                dfd.resolve();
                promise = dfd.promise;
            }

            return promise;
        },

        _fillDetails : function() {
            let me = this,
                vm = this.getViewModel(),
                position = vm.get('position'),
                activeDetail = vm.get('activeDetail'),
                activeDetailData = activeDetail.getData(),
                ignoredKeys = ['id', 'fullTimeEquivalency', 'salaryGradeId'],
                manageValWnd;

            if (position && activeDetail && activeDetail.phantom) {

                if (!activeDetail.get('cloned')) {
                    Ext.Array.each(Ext.Object.getKeys(position.getData()), function(key) {
                        if (Ext.Array.contains(ignoredKeys, key)) {
                            return;
                        }

                        if (Ext.isDefined(activeDetailData[key])) {
                            activeDetail.set(key, position.get(key));
                        }
                    });
                } else {
                    Ext.defer(function() {
                        // window select
                        manageValWnd = Ext.create('criterion.view.employee.position.FieldValueSelector', {
                            viewModel : {
                                data : {
                                    position : position,
                                    activeDetail : activeDetail
                                },
                                stores : {
                                    employerWorkPeriods : vm.getStore('employerWorkPeriods')
                                }
                            }
                        });

                        manageValWnd.show();
                        manageValWnd.on('destroy', function() {
                            me.setCorrectMaskZIndex(false);
                        });
                        manageValWnd.on('applyValues', function(values) {
                            Ext.Array.each(values.fields, function(key) {
                                activeDetail.set(key, position.get(key));
                            });

                            // customs
                            me.lookup('customFields').setFieldsValues(values.customFields);
                        });

                        me.setCorrectMaskZIndex(true);
                    }, 200);
                }

            }
        },

        _fillSalaryGradeData : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel();

            let editMode = vm.get('editMode'),
                skipSalaryFilter = !editMode || !!vm.get('skipSalaryGradeFilter'),
                position = vm.get('position'),
                activeDetail = vm.get('activeDetail'),
                isDirty = activeDetail.dirty,
                employerId = vm.get('employerId'),
                salaryGradeCombo = me.lookupReference('salaryGradeCombo'),
                salaryGradeStepCombo = me.lookupReference('salaryGradeStepCombo'),
                salaryGradesStore = salaryGradeCombo.getStore(),
                salaryGradesStepsStore = salaryGradeStepCombo.getStore(),
                activeDetailSalaryGradeId = activeDetail.get('salaryGradeId'),
                minSalaryGradeId = position && position.get('minSalaryGradeId'),
                maxSalaryGradeId = position && position.get('maxSalaryGradeId'),
                recordGradeId = skipSalaryFilter ? activeDetailSalaryGradeId : (minSalaryGradeId || maxSalaryGradeId);

            salaryGradesStore.setData([]);
            salaryGradesStepsStore.setData([]);

            if (recordGradeId) {
                Ext.GlobalEvents.fireEvent('blockPrevNext', true);

                salaryGradeCombo.setLoading(true);
                salaryGradeStepCombo.setLoading(true);

                Ext.create('criterion.model.SalaryGradeGradeOnly', {
                    id : recordGradeId
                }).loadWithPromise().then(function(gradeRec) {
                    let salaryGradesRemoteStore = vm.getStore('salaryGradesStore'),
                        data = [],
                        salaryGroupCd = gradeRec.get('salaryGroupCd'),
                        salaryGroup;

                    salaryGradesRemoteStore.getProxy().setExtraParams({
                        salaryGroupCd : salaryGroupCd,
                        employerId : employerId
                    });

                    salaryGroup = criterion.CodeDataManager.getStore(criterion.consts.Dict.SALARY_GROUP).getById(salaryGroupCd);
                    salaryGradeCombo.suspendEvents(true);
                    salaryGradeStepCombo.suspendEvents(true);

                    salaryGradesRemoteStore.loadWithPromise()
                        .then(function(records) {
                            vm.set({
                                salaryGroup : salaryGroup,
                                salaryGradeGroup : salaryGroupCd
                            });

                            if (parseInt(salaryGroup.get('attribute1'), 10) === 0) {
                                Ext.Array.each(records, function(rec) {
                                    let gradeRec = criterion.CodeDataManager.getCodeDetailRecord('id', rec.get('salaryGradeCd'), criterion.consts.Dict.SALARY_GRADE),
                                        recName = gradeRec.getData().description;

                                    rec.steps && rec.steps().each(function(step) {
                                        data.push({
                                            id : step.getId(),
                                            stepName : recName + ' - ' + step.get('stepName'),
                                            rate : step.get('rate'),
                                            sequence : rec.get('sequence'),
                                            frequencyCd : rec.get('frequencyCd')
                                        });
                                    });
                                });
                                salaryGradesStepsStore.setData(data);

                                if (!skipSalaryFilter) {
                                    salaryGradesStepsStore.setData(
                                        salaryGradesStepsStore.getRange(
                                            salaryGradesStepsStore.find('id', minSalaryGradeId),
                                            salaryGradesStepsStore.find('id', maxSalaryGradeId)
                                        )
                                    );
                                }


                                Ext.defer(function() {
                                    if (salaryGradesStepsStore.getById(activeDetailSalaryGradeId)) {
                                        salaryGradeStepCombo.setValue(activeDetailSalaryGradeId);
                                    } else {
                                        salaryGradeStepCombo.setValue(null);
                                    }

                                    activeDetail.dirty = isDirty;
                                    salaryGradeCombo.setLoading(false);
                                    salaryGradeStepCombo.setLoading(false);
                                }, 200);

                            } else {
                                salaryGradesStore.setData(records);

                                if (!skipSalaryFilter) {
                                    salaryGradesStore.setData(
                                        salaryGradesStore.getRange(
                                            salaryGradesStore.find('id', minSalaryGradeId),
                                            salaryGradesStore.find('id', maxSalaryGradeId)
                                        )
                                    );
                                }

                                Ext.defer(function() {
                                    if (salaryGradesStore.getById(activeDetailSalaryGradeId)) {
                                        salaryGradeCombo.setValue(activeDetailSalaryGradeId);
                                    } else {
                                        salaryGradeCombo.setValue(null);
                                    }

                                    activeDetail.dirty = isDirty;
                                    salaryGradeCombo.setLoading(false);
                                    salaryGradeStepCombo.setLoading(false);
                                }, 200);
                            }

                            salaryGradeCombo.resumeEvents();
                            salaryGradeStepCombo.resumeEvents();
                            vm.notify();
                            activeDetail.dirty = isDirty;
                            Ext.GlobalEvents.fireEvent('blockPrevNext', false);
                            view.setLoading(false);
                        });
                });
            } else {
                !salaryGradeCombo.getValue() && salaryGradeCombo.fireEvent('change', salaryGradeCombo);
                !salaryGradeStepCombo.getValue() && salaryGradeStepCombo.fireEvent('change', salaryGradeStepCombo);
                view.setLoading(false);
            }
        },

        handleNewAction : function() {
            let vm = this.getViewModel(),
                assignment = vm.get('assignment'),
                activeDetail = vm.get('activeDetail'),
                securityDescriptor,
                newDetailData, newDetail;

            securityDescriptor = activeDetail.getSecurityDescriptor();
            oldDetail = activeDetail.clone();
            oldDetail.securityDescriptor = securityDescriptor;
            newDetailData = oldDetail.getData();

            delete newDetailData['id'];
            delete newDetailData['effectiveDate'];
            delete newDetailData['expirationDate'];
            delete newDetailData['assignmentActionCd'];

            newDetailData['cloned'] = true;
            newDetailData['clonedDetailId'] = oldDetail.getId();

            newDetail = Ext.create('criterion.model.assignment.Detail', newDetailData);

            assignment.assignmentDetails().loadData([]);
            assignment.assignmentDetails().add(newDetail);

            newDetail.setSecurityDescriptor(securityDescriptor);
            vm.set('activeDetail', newDetail);

            this._fillSalaryGradeData();
            this.handleSwitchToEdit();
        },

        handleSwitchToEdit : function() {
            this.getViewModel().set('editMode', true);
            this._fillSalaryGradeData();
        },

        /**
         * Support FormView interface.
         *
         * @returns {*|Object}
         */
        getRecord : function() {
            return this.getViewModel().get('assignment');
        },

        handleCancelClick : function() {
            let vm = this.getViewModel(),
                activeDetail = vm.get('activeDetail'),
                assignment = vm.get('assignment'),
                phantomAssignment = assignment && assignment.phantom ? assignment.phantom : null,
                preventReRoute = (arguments.length && Ext.isBoolean(arguments[0])) && arguments[0];

            if (vm.get('editMode') && vm.get('isPrimary')) {
                if (oldDetail) {
                    !phantomAssignment && this.lookup('customFields').getController().load(oldDetail.getId());
                    vm.set('activeDetail', oldDetail);
                    assignment.assignmentDetails().add(oldDetail);
                    oldDetail = null;
                } else {
                    !phantomAssignment && this.lookup('customFields').getController().load(activeDetail.getId());
                    activeDetail.reject();
                }

                if (assignment) {
                    assignment.reject();
                }

                vm.set('editMode', false);

                if (positionModified) {
                    positionModified = false;
                    !phantomAssignment && this.load();
                }
            } else {
                Ext.Ajax.abortAll();
                this.callParent([preventReRoute]);
            }
        },

        handleTerminate : function() {
            let me = this,
                vm = this.getViewModel(),
                assignment = vm.get('assignment'),
                terminateAssignmentWindow = Ext.create('criterion.view.assignment.Terminate', {
                    viewModel : {
                        data : {
                            effectiveDate : assignment.get('effectiveDate')
                        }
                    }
                });

            terminateAssignmentWindow.on('terminate', function(formValues) {
                assignment.set('terminate', true);
                assignment.set(formValues);
                this.save();
            }, this);
            terminateAssignmentWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            terminateAssignmentWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        handleDeleteClick : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel();

            criterion.Msg.confirmDelete(
                {
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete active assignment?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        vm.get('activeDetail').eraseWithPromise().then({
                            scope : me,
                            success : function() {
                                vm.set('editMode', false);

                                if (vm.get('assignment').assignmentDetails().count()) {
                                    me.load();
                                } else {
                                    view.fireEvent('afterDelete', me);
                                    me.handleCancelClick();
                                }
                            }
                        })
                    }
                }
            );
        },

        handleSubmitClick : function() {
            this.save();
        },

        save : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                activeDetail = vm.get('activeDetail'),
                assignment = vm.get('assignment'),
                employerWorkPeriods = vm.getStore('employerWorkPeriods'),
                employeeId = this.getEmployeeId(),
                customValues = view.lookupReference('customFields').getController().getChanges(activeDetail.getId()),
                workPeriodId,
                workPeriod;

            if (!this.lookupReference('assignmentForm').isValid()) {
                return;
            }

            if (assignment.phantom) {
                assignment.set({
                    employeeId : employeeId
                });
            }

            activeDetail.setCustomValues(customValues);

            if (Ext.Array.contains(Ext.Object.getKeys(activeDetail.getChanges()), 'salaryGradeId')) {
                let salaryGradeName = vm.get('isSalaryGroupStep') ? view.lookupReference('salaryGradeStepCombo').getRawValue() : view.lookupReference('salaryGradeCombo').getRawValue();

                activeDetail.set('salaryGradeName', salaryGradeName);
            }

            let isPrimary = assignment instanceof criterion.model.assignment.Primary;

            if (isPrimary) {
                assignment.getProxy().setAppendId(true); // we're using regular API for save so there so need to append id
            }

            if (!Ext.Object.getSize(activeDetail.getChanges()) && !Ext.Object.getSize(assignment.getChanges())) {
                vm.set('editMode', false);

                return;
            }

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.ASSIGNMENT).then(function(signature) {

                view.setLoading(true);
                me.setCorrectMaskZIndex(false);

                // add work period info for UI
                workPeriodId = activeDetail.get('workPeriodId');
                if (workPeriodId) {
                    workPeriod = employerWorkPeriods.getById(workPeriodId);
                    workPeriod && activeDetail.set('workPeriod', workPeriod.get('name'));
                }

                if (signature) {
                    assignment.set('signature', signature);
                }

                assignment.saveWithPromise({
                    isWorkflow : true,
                    employeeId : employeeId,
                    performerId : criterion.Api.getEmployeeId()
                }).then({
                    scope : me,
                    success : me.onSaveSuccess
                }).always(function() {
                    if (isPrimary) {
                        assignment.getProxy().setAppendId(false); // reverting back to default behaviour
                    }

                    view.setLoading(false);
                });
            });

        },

        onSaveSuccess : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView();

            vm.set('editMode', false);

            criterion.Utils.toast(i18n.gettext('Changes Submitted.'));

            if (positionModified) {
                positionModified = false;
            }

            if (vm.get('isPrimary')) {
                me.load();
            } else {
                view.fireEvent('afterSave');
                this.handleCancelClick();
            }
        },

        onPositionSearch : function() {
            let me = this,
                vm = this.getViewModel(),

                positionPickerWindow = Ext.create('criterion.view.PositionPicker', {
                    isUnassigned : true,
                    isActive : true,
                    isApproved : true,
                    employerId : vm.get('employerId')
                });

            positionPickerWindow.on('select', function(position) {
                vm.set('position', position);
                vm.get('activeDetail').set({
                    positionId : position.getId(),
                    title : position.get('title'),
                    positionCode : position.get('code')
                });
                vm.get('assignment').set({
                    positionCode : position.get('code'),
                    positionTitle : position.get('title')
                });

                positionModified = true;

                me._fillDetails();

                me._fillRemaingFTE(true).then(function() {
                    me._fillSalaryGradeData();
                });
            });

            positionPickerWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            positionPickerWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        onPositionClear : function() {
            let vm = this.getViewModel(),
                activeDetail = vm.get('activeDetail'),
                assignment = vm.get('assignment'),
                me = this,
                salaryGradeCombo = this.lookupReference('salaryGradeCombo'),
                salaryGradeComboStore = salaryGradeCombo && salaryGradeCombo.getStore(),
                salaryGradeStepCombo = this.lookupReference('salaryGradeStepCombo'),
                salaryGradeStepComboStore = salaryGradeStepCombo && salaryGradeStepCombo.getStore();

            vm.set({
                position : null,
                remainingFTE : null
            });

            activeDetail.set({
                positionId : null,
                title : '',
                code : '',
                salaryGradeId : null
            });

            salaryGradeCombo.reset();
            salaryGradeComboStore.removeAll();
            salaryGradeStepCombo.reset();
            salaryGradeStepComboStore.removeAll();

            assignment.set({
                positionTitle : '',
                positionCode : ''
            });

            positionModified = true;
            me._fillRemaingFTE(true);
        },

        handleSalaryGroupSelect : function(combo, newValue) {
            let vm = this.getViewModel(),
                salaryGradesStore = vm.getStore('salaryGradesStore'),
                grade = salaryGradesStore.getById(newValue),
                activeDetail = vm.get('activeDetail'),
                payRateUnitCombo = this.lookupReference('payRateUnitCombo'),
                payRate = this.lookupReference('payRate'),
                minRate = grade && grade.get('minRate'),
                maxRate = grade && grade.get('maxRate');

            if (grade) {
                activeDetail.set('rateUnitCd', grade.get('frequencyCd'));
                payRateUnitCombo.setDisabled(true);

                payRate.validator = function(value) {
                    if (value < minRate || value > maxRate) {
                        return Ext.util.Format.format('Pay Rate should be between {0} and {1}', minRate, maxRate);
                    }

                    return true;
                };
            } else {
                payRate.validator = true;
                payRateUnitCombo.setDisabled(false);
            }

            payRate.validate();
        },

        handleSalaryStepSelect : function(combo, newValue) {
            let vm = this.getViewModel(),
                salaryGradesStepsStore = this.lookupReference('salaryGradeStepCombo').getStore(),
                grade = salaryGradesStepsStore.getById(newValue),
                activeDetail = vm.get('activeDetail'),
                payRateUnitCombo = this.lookupReference('payRateUnitCombo'),
                payRate = this.lookupReference('payRate');

            if (grade) {
                payRate.validator && delete payRate.validator;
                activeDetail.set({
                    rateUnitCd : grade.get('frequencyCd'),
                    payRate : grade.get('rate')
                });

                payRateUnitCombo.setDisabled(true);
                vm.set('payRateEditable', false);
            } else {
                payRateUnitCombo.setDisabled(false);
                vm.set('payRateEditable', true);
            }
        },

        showPayDetails : function() {
            let me = this,
                vm = this.getViewModel(),
                payInfoWindow;

            payInfoWindow = Ext.create('criterion.view.assignment.PayInformation', {
                viewModel : {
                    data : {
                        assignmentDetailId : vm.get('activeDetail.id')
                    }
                }
            });

            payInfoWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            payInfoWindow.show();

            me.setCorrectMaskZIndex(true);
        }
    };
});
