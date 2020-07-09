Ext.define('criterion.controller.employee.wizard.Employment', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_wizard_employment',

        requires : [
            'criterion.model.employee.WorkLocation',
            'criterion.view.employee.demographic.SelectWorkLocations',
            'criterion.model.SalaryGradeGradeOnly',
            'criterion.store.SalaryGradesGradeStep'
        ],

        handleEmployerSet : function(combo) {
            let vm = this.getViewModel(),
                employer = combo.getSelection(),
                employee = vm.get('employee'),
                employerId = employer && employer.getId(),
                employerConfig = employer && employer.getData(),
                payRateField = this.lookup('payRate');

            vm.set({
                employerId : employerId,
                employer : employer,
                position : null,
                assignmentDetail : Ext.create('criterion.model.assignment.Detail'),
                remainingFTE : null
            });

            employee && employee.isModel && employee.set({
                employerId : employerId
            });

            if (payRateField && employerConfig) {
                // reset employer settings to fields
                payRateField.currencySymbol = employerConfig['currencySign'] || '$';
                payRateField.thousandSeparator = employerConfig['thousandSeparator'] || ',';
                payRateField.decimalSeparator = employerConfig['decimalSeparator'] || '.';
                payRateField.decimalPrecision = employerConfig['ratePrecision'] || 0;
                payRateField.currencySymbolPos = employerConfig['currencyAtEnd'] || false;

                payRateField.focus();
            }

            vm.notify();
        },

        handleSelectWorkLocation : function() {
            let vm = this.getViewModel(),
                employeeWorkLocations = vm.getStore('employeeWorkLocations'),
                workLocationCombobox = this.lookupReference('workLocationCombobox'),
                selectedWorkLocation = workLocationCombobox.selection && workLocationCombobox.selection.getId(),
                selectWorkLocationWindow = Ext.create('criterion.view.employee.demographic.SelectWorkLocations', {
                viewModel : {
                    data : {
                        employeeId : vm.get('employee').getId(),
                        employerId : vm.get('employee').get('employerId'),
                        primaryLocationId : selectedWorkLocation
                    },
                    stores : {
                        employeeWorkLocations : employeeWorkLocations
                    }
                }
            });

            selectWorkLocationWindow.on('submit', this.setWorkLocation, this);

            selectWorkLocationWindow.show();
        },

        setWorkLocation : function(newEmployerLocationIds, primaryEmployerLocationId) {
            let vm = this.getViewModel(),
                employeeWorkLocations = vm.getStore('employeeWorkLocations');

            employeeWorkLocations.removeAll();

            for (let i = 0; i < newEmployerLocationIds.length; i++) {
                let newWorkLocationId = newEmployerLocationIds[i];

                employeeWorkLocations.add({
                    employeeId : vm.get('employee').getId(),
                    employerWorkLocationId : newWorkLocationId,
                    isActive : true,
                    isPrimary : newWorkLocationId === primaryEmployerLocationId
                })
            }

            vm.get('assignmentDetail').set('employerWorkLocationId', primaryEmployerLocationId);
        },

        load : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                employee = vm.get('employee'),
                employeeWorkLocations = vm.getStore('employeeWorkLocations'),
                employerWorkLocations = vm.getStore('employerWorkLocations'),
                availableEmployeeGroups = vm.getStore('availableEmployeeGroups'),
                employerWorkPeriods = vm.getStore('employerWorkPeriods'),
                certifiedRates = vm.getStore('certifiedRates'),
                employerId = employee && employee.get('employerId'),
                promises = [];

            if (!employee || !employerId) {
                return;
            }

            employee && employee.isModel && employee.set({
                employerId : employerId
            });

            view.setLoading(true);

            if (employee.phantom) {
                promises.push(availableEmployeeGroups.loadWithPromise({
                    params : {
                        employeeId : criterion.Api.getEmployeeId(),
                        employerId : employerId
                    }
                }))
            } else {
                promises.push(employeeWorkLocations.loadWithPromise({
                    params : {
                        employeeId : employee.getId()
                    }
                }));
            }

            promises = [
                employerWorkLocations.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                }),
                employerWorkPeriods.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                }),
                criterion.Api.hasCertifiedRate() ? certifiedRates.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                }) : null
            ].concat(promises);

            return Ext.promise.Promise.all(promises).then({
                scope : this,
                success : function() {
                    let primaryLocation = employeeWorkLocations.findRecord('isPrimary', true);

                    view.setLoading(false);

                    if (primaryLocation) {
                        vm.get('assignmentDetail').set('employerWorkLocationId', primaryLocation.get('employerWorkLocationId'));
                    }
                },
                failure : function() {
                    view.setLoading(false);
                }
            });
        },

        loadStoresForApproverView : function(employerId) {
            let vm = this.getViewModel(),
                employerWorkLocations = vm.getStore('employerWorkLocations'),
                availableEmployeeGroups = vm.getStore('availableEmployeeGroups');

            return Ext.promise.Promise.all([
                availableEmployeeGroups.loadWithPromise({
                    params : {
                        employeeId : criterion.Api.getEmployeeId(),
                        employerId : employerId
                    }
                }),
                employerWorkLocations.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                })
            ]);
        },

        handleActivate : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        onPositionSearch : function() {
            let vm = this.getViewModel(),
                wnd = Ext.create('criterion.view.PositionPicker', {
                    isUnassigned : true,
                    isActive : true,
                    isApproved : true,
                    employerId : vm.get('employee').get('employerId')
                });

            wnd.show();
            wnd.on('select', this.selectPosition, this);
        },

        onPositionClear : function() {
            let vm = this.getViewModel(),
                salaryGradeCombo = this.lookupReference('salaryGradeCombo'),
                salaryGradeComboStore = salaryGradeCombo && salaryGradeCombo.getStore(),
                assignmentDetail = vm.get('assignmentDetail');

            vm.set('position', null);
            vm.set('remainingFTE', null);

            assignmentDetail.set(
                {
                    title : '',
                    positionId : null,
                    salaryGradeId : null
                }
            );

            salaryGradeCombo.reset();
            salaryGradeComboStore.removeAll();
        },

        selectPosition : function(position) {
            let vm = this.getViewModel(),
                view = this.getView(),
                employeeWorkLocations = vm.getStore('employeeWorkLocations'),
                employer = vm.get('employer'),
                minSalaryGradeId = position.get('minSalaryGradeId'),
                maxSalaryGradeId = position.get('maxSalaryGradeId'),
                salaryGradeRecordId = minSalaryGradeId || maxSalaryGradeId,
                salaryGradeCombo = this.lookupReference('salaryGradeCombo'),
                salaryGradeComboStore = salaryGradeCombo && salaryGradeCombo.getStore(),
                assignmentDetail = vm.get('assignmentDetail'),
                assignmentDetailData = assignmentDetail.getData(),
                promises = [], me = this;

            employeeWorkLocations.removeAll();

            vm.set('position', position);
            vm.set('remainingFTE', null);

            view.setLoading(true);

            employer.get('isPositionControl') && promises.push(criterion.Api.requestWithPromise({
                url : API.EMPLOYER_POSITION_SEARCH_REMAINING_FTE,
                method : 'GET',
                params : {
                    positionId : position.getId()
                }
            }).then(function(remainingFTE) {
                vm.set('remainingFTE', remainingFTE);
            }));

            salaryGradeCombo.reset();
            salaryGradeComboStore.removeAll();
            salaryGradeComboStore.clearFilter();

            if (salaryGradeRecordId) {
                Ext.create('criterion.model.SalaryGradeGradeOnly', {
                    id : salaryGradeRecordId
                }).loadWithPromise().then(function(gradeRec) {
                    let salaryGradesRemoteStore = Ext.create('criterion.store.SalaryGradesGradeStep', {
                            sorters : 'sequence'
                        }),
                        salaryGroupCd = gradeRec.get('salaryGroupCd'),
                        salaryGroup = criterion.CodeDataManager.getStore(criterion.consts.Dict.SALARY_GROUP).getById(salaryGroupCd),
                        isGrade = salaryGroup.get('attribute1') === '1',
                        payRateCd = parseInt(salaryGroup.get('attribute2'));

                    salaryGradesRemoteStore.loadWithPromise({
                        params : {
                            salaryGroupCd : gradeRec.get('salaryGroupCd'),
                            employerId : employer.getId()
                        }
                    }).then(function() {
                        let data = [],
                            fromRecord,
                            toRecord;

                        salaryGradesRemoteStore.each(function(record) {
                            let gradeRec = criterion.CodeDataManager.getCodeDetailRecord('id', record.get('salaryGradeCd'), criterion.consts.Dict.SALARY_GRADE),
                                gradeName = gradeRec.get('description'),
                                minRate = record.get('minRate'),
                                maxRate = record.get('maxRate'),
                                sequence = record.get('sequence'),
                                rates;

                            if (isGrade) {
                                rates = Ext.util.Format.format('{0} - {1}',
                                    criterion.LocalizationManager.currencyFormatter(minRate),
                                    criterion.LocalizationManager.currencyFormatter(maxRate));

                                data.push({
                                    id : record.getId(),
                                    gradeName : gradeName,
                                    minRate : minRate,
                                    maxRate : maxRate,
                                    rates : rates,
                                    isGradeStep : false,
                                    sequence : sequence,
                                    payRateCd : payRateCd
                                })
                            } else {
                                let stepId = 1;
                                record.steps && record.steps().each(function(step) {
                                    let stepRate = step.get('rate');
                                    data.push({
                                        id : step.getId(),
                                        gradeName : gradeName + ' - ' + step.get('stepName'),
                                        minRate : stepRate,
                                        maxRate : stepRate,
                                        rates : criterion.LocalizationManager.currencyFormatter(stepRate),
                                        isGradeStep : true,
                                        sequence : sequence * 100 + stepId, //Fake sequence. Multiplier should be increased when one record will have more then 100 steps.
                                        payRateCd : payRateCd
                                    });
                                    stepId++;
                                });
                            }
                        });

                        salaryGradeComboStore.setData(data);

                        fromRecord = salaryGradeComboStore.getById(minSalaryGradeId);
                        toRecord = salaryGradeComboStore.getById(maxSalaryGradeId);

                        if (fromRecord || toRecord) {
                            let fromSequence = fromRecord ? fromRecord.get('sequence') : null,
                                toSequence = toRecord ? toRecord.get('sequence') : null;

                            salaryGradeComboStore.filterBy(function(record) {
                                let sequence = record.get('sequence');
                                return fromSequence && fromSequence <= sequence && toSequence && toSequence >= sequence
                            });
                        }

                    });
                });
            }

            Ext.promise.Promise.all(promises).always(function() {
                if (position && assignmentDetail) {
                    let remainingFTE = vm.get('remainingFTE'),
                        ignoredKeys = ['id', 'fullTimeEquivalency'];

                    if (!salaryGradeComboStore.getById(position.get('salaryGradeId'))) {
                        ignoredKeys.push('salaryGradeId');
                        assignmentDetail.set('salaryGradeId', null);
                    }

                    Ext.Array.each(Ext.Object.getKeys(position.getData()), function(key) {
                        if (Ext.Array.contains(ignoredKeys, key)) {
                            return
                        }

                        if (Ext.isDefined(assignmentDetailData[key])) {
                            assignmentDetail.set(key, position.get(key));
                        }
                    });

                    if (remainingFTE) {
                        assignmentDetail.set('fullTimeEquivalency', remainingFTE >= 1 ? 1 : remainingFTE);
                    }

                    if (assignmentDetail.get('employerWorkLocationId')) {
                        employeeWorkLocations.add({
                            employeeId : vm.get('employee').getId(),
                            employerWorkLocationId : assignmentDetail.get('employerWorkLocationId'),
                            isActive : true,
                            isPrimary : true
                        })
                    } else if (position.get('employerWorkLocationId')) {
                        me.setWorkLocation([position.get('employerWorkLocationId')], position.get('employerWorkLocationId'));
                    }

                    assignmentDetail.set({
                        positionId : position.getId(),
                        positionCode : position.get('code')
                    });
                }

                view.setLoading(false);
            });
        },

        onSalaryGradeChange : function(cmp, value) {
            let salaryGrade = value && cmp.getSelection(),
                payRate = this.lookupReference('payRate'),
                payRateUnit = this.lookupReference('payRateUnitCombo');

            if (!salaryGrade) {
                payRate.setMinValue(Number.MIN_VALUE);
                payRate.setMaxValue(Number.MAX_VALUE);
                payRate.setDisabled(false);

                payRateUnit.reset();
                payRateUnit.setDisabled(false);
            } else {
                if (salaryGrade.get('isGradeStep')) {
                    payRate.setValue(salaryGrade.get('minRate'));
                    payRate.setDisabled(true);

                    payRateUnit.setValue(salaryGrade.get('payRateCd'));
                    payRateUnit.setDisabled(true);

                } else {
                    payRate.setMinValue(salaryGrade.get('minRate'));
                    payRate.setMaxValue(salaryGrade.get('maxRate'));
                    payRate.setDisabled(false);

                    payRateUnit.setValue(salaryGrade.get('payRateCd'));
                    payRateUnit.setDisabled(true);
                }
            }
        },

        init : function() {
            let vm = this.getViewModel();

            this.load = Ext.Function.createDelayed(this.load, 100, this);

            this.lookupReference('positionCode').validator = function(value) {
                let isPositionControl = vm.get('employer.isPositionControl');

                if (!value && isPositionControl) {
                    return i18n.gettext('Please select a position');
                }

                return true
            };

            this.callParent(arguments);
        }
    };

});
