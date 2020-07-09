Ext.define('criterion.controller.employee.benefit.BenefitForm', function() {

    function createOptionCombo(plan, groupIndex) {
        var dataForGroup = [],
            options;

        if (Ext.isFunction(plan.options)) {
            options = Ext.Array.pluck(plan.options().getRange(), 'data');
        } else {
            options = plan.get('options');
        }

        Ext.each(options, function(option) {
            if (option['optionGroup'] === groupIndex && option['isActive']) {
                dataForGroup.push(option);
            }
        });

        return Ext.create({
            xtype : 'combobox',
            isOptionCombo : true,
            store : {
                data : dataForGroup,
                sorters : [
                    {
                        sorterFn : function(record1, record2) {
                            let asInt = function(s) {
                                    let val = parseInt(String(s).replace(/,/g, ''), 10);

                                    return isNaN(val) ? 0 : val;
                                },
                                name1 = asInt(record1.data.name),
                                name2 = asInt(record2.data.name);

                            return name1 > name2 ? 1 : (name1 === name2) ? 0 : -1;
                        }
                    }
                ]
            },
            allowBlank : false,
            bind : {
                readOnly : '{readOnly || isOptionsReadOnly}'
            },
            editable : false,
            valueField : 'id',
            displayField : 'name',
            queryMode : 'local'
        });
    }

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_benefit_benefit_form',

        requires : [
            'criterion.model.employee.Benefit',
            'criterion.model.employer.BenefitPlan',
            'criterion.model.employee.Deduction',
            'criterion.model.employer.Deduction'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        externalUpdate : false,

        getEmployeeId : function() {
            return this.getViewModel().get('employee.id');
        },

        getPersonId : function() {
            return this.getViewModel().get('person.id');
        },

        handleAfterRecordLoad : function(employeeBenefit) {
            let view = this.getView(),
                vm = this.getViewModel(),
                me = this,
                personId = this.getPersonId(),
                benefitPlansStore = vm.getStore('benefitPlans'),
                promises = [],
                employeeBenefitId = employeeBenefit.getId(),
                webform = this.lookup('webform'),
                benefitPlan,
                benefitPlanId = vm.get('record.benefitPlanId');

            view.setLoading(true);
            Ext.GlobalEvents.fireEvent('blockPrevNext', true);

            promises.push(
                vm.getStore('personContacts').loadWithPromise({
                    params : {
                        personId : personId
                    }
                }),
                me.lookup('customfieldsEmployeeBenefit').getController().load(employeeBenefitId)
            );

            if (employeeBenefit.phantom) {
                promises.push(benefitPlansStore.loadWithPromise({
                    params : {
                        eligibleFor : this.getEmployeeId(),
                        employerId : vm.get('employee.employerId')
                    }
                }));

                employeeBenefit.setDeduction(Ext.create('criterion.model.employee.Deduction'));
            } else {
                benefitPlan = Ext.create('criterion.model.employer.BenefitPlan', {
                    id : benefitPlanId
                });

                promises.push(
                    benefitPlan.loadWithPromise().then(function(record) {
                        benefitPlansStore.loadRecords([record], null);
                    }),
                    me.lookup('benefitDocuments').load(employeeBenefitId)
                );
            }

            Ext.Promise
                .all(promises)
                .then(function() {
                    vm.set('deduction', employeeBenefit.getDeduction());
                    vm.getStore('personContacts').cloneToStore(vm.getStore('personContactsContingent'));

                    Ext.defer(function() {
                        // a little delay for full ready state
                        let benefitPlanCombo = me.lookup('benefitPlanCombo'),
                            webformId = benefitPlanId ? benefitPlansStore.getById(benefitPlanId).get('webformId') : null;

                        benefitPlanCombo && benefitPlanCombo.setValue(benefitPlanId);
                        view.setLoading(false);

                        if (webformId) {
                            if (!employeeBenefit.phantom) {
                                webform.setMainUrl(criterion.consts.Api.API.EMPLOYEE_BENEFIT_WEBFORM_FIELDS + '?employeeBenefitId=' + employeeBenefitId);
                            } else {
                                webform.setMainUrl(criterion.consts.Api.API.WEBFORM + '/' + webformId);
                            }

                            webform.loadForm();
                        }

                        Ext.GlobalEvents.fireEvent('blockPrevNext', false);
                    }, 100);
                });
        },

        setPersonsDependentsAndBeneficiaries : function() {
            var me = this,
                vm = this.getViewModel(),
                personContactDependents = [],
                personContactIdBeneficiaries = {},
                personBeneficiariesPercent = {},
                personBeneficiariesEffectiveDate = {},
                personBeneficiariesExpirationDate = {},
                hasContingents = false,
                contingentPersonContactIdBeneficiaries = {},
                contingentPersonBeneficiariesPercent = {},
                contingentPersonBeneficiariesEffectiveDate = {},
                contingentPersonBeneficiariesExpirationDate = {};

            var employeeBenefit = vm.get('record');

            employeeBenefit.dependents().each(function(record) {
                personContactDependents.push(
                    {
                        personContactId : record.get('personContactId'),
                        effectiveDate : record.get('effectiveDate'),
                        expirationDate : record.get('expirationDate')
                    }
                );
            });

            employeeBenefit.beneficiaries().each(function(record) {
                var personContactId = record.get('personContactId');

                personContactIdBeneficiaries[personContactId] = true;
                personBeneficiariesPercent[personContactId] = record.get('beneficiaryPercent');
                personBeneficiariesEffectiveDate[personContactId] = record.get('effectiveDate');
                personBeneficiariesExpirationDate[personContactId] = record.get('expirationDate');
            });

            employeeBenefit.contingentBeneficiaries().each(function(record) {
                var personContactId = record.get('personContactId');

                contingentPersonContactIdBeneficiaries[personContactId] = true;
                contingentPersonBeneficiariesPercent[personContactId] = record.get('beneficiaryPercent');
                contingentPersonBeneficiariesEffectiveDate[personContactId] = record.get('effectiveDate');
                contingentPersonBeneficiariesExpirationDate[personContactId] = record.get('expirationDate');

                hasContingents = true;
            });

            this.lookup('dependentsList').setValueWithOriginalValueReset({
                dependents : personContactDependents
            });

            this.lookup('beneficiariesList').getViewModel().set({
                checkedPerson : Ext.clone(personContactIdBeneficiaries),
                checkedPersonPercent : Ext.clone(personBeneficiariesPercent),
                checkedPersonEffectiveDate : Ext.clone(personBeneficiariesEffectiveDate),
                checkedPersonExpirationDate : Ext.clone(personBeneficiariesExpirationDate)
            });

            vm.set('hasContingents', hasContingents);

            Ext.defer(function() { // need time for rerender
                var contingentBeneficiariesList = me.lookup('contingentBeneficiariesList');

                contingentBeneficiariesList && contingentBeneficiariesList.getViewModel().set({
                    checkedPerson : Ext.clone(contingentPersonContactIdBeneficiaries),
                    checkedPersonPercent : Ext.clone(contingentPersonBeneficiariesPercent),
                    checkedPersonEffectiveDate : Ext.clone(contingentPersonBeneficiariesEffectiveDate),
                    checkedPersonExpirationDate : Ext.clone(contingentPersonBeneficiariesExpirationDate)
                });
                me.afterAllChangesSet();
            }, 500);
        },

        /**
         * @protected
         */
        afterAllChangesSet : function() {
        },

        handleBenefitPlanChange : function(cmp) {
            let vm = this.getViewModel(),
                plan = cmp.getSelection(),
                webform = this.lookup('webform'),
                webformId = plan ? plan.get('webformId') : null;

            vm.set('webformId', webformId);

            if (vm.get('isPhantom') && webformId) {
                webform.setMainUrl(criterion.consts.Api.API.WEBFORM + '/' + webformId);
                webform.loadForm();
            }

            this.updateBenefitPlan(cmp.getValue());
        },

        updateBenefitPlan : function(planId) {
            let me = this,
                vm = this.getViewModel(),
                employeeBenefit = vm.get('record'),
                optionsContainer = this.lookup('optionsContainer'),
                planRecord = this.getStore('benefitPlans').getById(planId),
                groupFields = planRecord && planRecord.getGroupFields(),
                employeeBenefitOptions = employeeBenefit.options(),
                record = vm.get('record'),
                leftCol, rightCol;

            vm.set({
                planRecord : planRecord
            });

            // prepare containers
            leftCol = optionsContainer.items.getAt(0);
            rightCol = optionsContainer.items.getAt(2);

            if (!rightCol.removeAll) {
                rightCol = optionsContainer.items.getAt(1);
            }

            leftCol.removeAll();
            rightCol.removeAll();

            // iterate through every group and create fields
            if (!groupFields) {
                return;
            }

            Ext.Array.each(groupFields, (ident, i) => {
                let groupName = planRecord.get(ident),
                    groupIdx = i + 1,
                    field, isManualGroup,
                    selectedOption;

                if (groupName) {
                    isManualGroup = planRecord.get(Ext.util.Format.format('optionGroup{0}IsManual', groupIdx));

                    // manual group needs textbox field, while non-manual has set of pre-defined options
                    if (isManualGroup) {
                        field = Ext.create({
                            xtype : 'numberfield',
                            allowBlank : false,
                            decimalPrecision : Ext.util.Format.amountPrecision,
                            bind : {
                                readOnly : '{readOnly || isOptionsReadOnly}'
                            }
                        });
                    } else {
                        field = createOptionCombo(planRecord, groupIdx, groupName);
                        field.on('change', this.updateDepVisibility, this);
                    }

                    field.setFieldLabel(groupName);
                    field.ident = ident;

                    // populating option fields from employee options store
                    selectedOption = employeeBenefitOptions.findRecord('optionGroup', groupIdx);

                    if (selectedOption) {
                        field._connectedId = selectedOption.getId();
                        field.setValue(isManualGroup ? selectedOption.get('manualValue') : selectedOption.get('benefitPlanOptionId'));
                        field.originalValue = field.getValue();
                    }

                    // pushing field to one of containers
                    if (leftCol.items.length === rightCol.items.length) {
                        leftCol.add(field);
                    } else {
                        rightCol.add(field);
                    }
                }
            });

            if (record.phantom) {
                record.getDeduction().set('deductionCalcMethodCd', planRecord.get('deduction')['deductionCalcMethodCd']);
            }

            me.updateDepVisibility();
            me.setPersonsDependentsAndBeneficiaries();
        },

        updateDepVisibility : function() {
            var isAllowBeneficiaries = false,
                isAllowDependents = false,
                fields = this.getView().query('[isOptionCombo]'),
                vm = this.getViewModel(),
                personContacts = vm.getStore('personContacts'),
                hasPersonContacts = personContacts && personContacts.getCount() > 0;

            if (hasPersonContacts) {
                Ext.Array.each(fields, function(field) {
                    var fieldValue = field.getValue(),
                        record = fieldValue && field.getStore().getById(fieldValue),
                        recordData = record && record.getData();

                    if (record) {
                        isAllowDependents = isAllowDependents || recordData['isAllowDependent'];
                        isAllowBeneficiaries = isAllowBeneficiaries || recordData['isAllowBeneficiary'];
                    }
                });
            }

            vm.set({
                allowDependents : isAllowDependents,
                allowBeneficiaries : isAllowBeneficiaries
            });
        },

        handleSaveAll : function() {
            var vm = this.getViewModel(),
                beneficiariesList = this.lookup('beneficiariesList'),
                contingentBeneficiariesList = this.lookup('contingentBeneficiariesList'),
                me = this;

            if (this.getView().getForm().isValid() &&
                (!vm.get('allowBeneficiaries') || (beneficiariesList.isValid() && contingentBeneficiariesList.isValid()))) {
                me.saveMainRecord();
            }
        },

        getSaveParams : function() {
            return {};
        },

        saveWebFormValues(employeeBenefitId) {
            let vm = this.getViewModel(),
                webformId = vm.get('webformId'),
                dfd = Ext.create('Ext.Deferred');

            if (webformId) {
                criterion.Api.submitFakeForm(this.lookup('webform').getFormValues(), {
                    url : criterion.consts.Api.API.EMPLOYEE_BENEFIT_WEBFORM_FIELDS + '?employeeBenefitId=' + employeeBenefitId,
                    method : 'POST',
                    scope : this,
                    success : function(obj, res) {
                        if (Ext.isObject(obj)) {
                            obj = Ext.Object.merge(obj, {responseStatus : res.status});
                        }

                        dfd.resolve(obj);
                    },
                    failure : function(response) {
                        dfd.reject(response);
                    }
                });
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        saveMainRecord : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                me = this,
                employeeBenefit = vm.get('record');

            view.setLoading(true);

            employeeBenefit.set('employeeId', this.getEmployeeId());

            me.updateDependents();
            me.updateBeneficiaries();
            me.updateContingentBeneficiaries();
            me.updateOptions();

            employeeBenefit.saveWithPromise(this.getSaveParams()).then(function(record) {
                let employeeBenefitId = record.getId();

                Ext.Deferred.all([
                    me.lookup('benefitDocuments').syncDocuments(employeeBenefitId),
                    me.saveWebFormValues(employeeBenefitId),
                    me.lookup('customfieldsEmployeeBenefit').getController().save(employeeBenefitId)
                ]).then(() => {
                    view.setLoading(false);
                    me.onAfterSave(view, record);
                }, () => {
                    view.setLoading(false);
                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                });
            });
        },

        handleDownloadFormClick() {
            let vm = this.getViewModel(),
                employeeBenefitId = vm.get('record.id');

            this.saveWebFormValues(employeeBenefitId).then(() => {
                window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(criterion.consts.Api.API.EMPLOYEE_BENEFIT_WEBFORM_DOWNLOAD, employeeBenefitId)));
            });
        },

        updateOptions : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                planRecord = vm.get('planRecord'),
                record = vm.get('record'),
                recordId = record.getId(),
                employeeBenefitOptions = record.options(),
                groupFields = planRecord && planRecord.getGroupFields();

            if (!groupFields) {
                return employeeBenefitOptions;
            }

            // iterate through group field and update employee options store
            for (var i = 0; i < groupFields.length; i++) {
                var groupField = groupFields[i],
                    groupIdx = i + 1,
                    selectedOption = employeeBenefitOptions.findRecord('optionGroup', groupIdx),
                    field = view.down(Ext.util.Format.format('[ident={0}]', groupField));

                if (planRecord.get(groupField)) {
                    var isManualGroup = planRecord.get(Ext.util.Format.format('optionGroup{0}IsManual', groupIdx));

                    if (!selectedOption) {
                        selectedOption = Ext.create('criterion.model.employee.benefit.Option', {
                            optionGroup : groupIdx,
                            employeeBenefitId : recordId
                        });
                        employeeBenefitOptions.add(selectedOption);
                    }

                    if (isManualGroup) {
                        selectedOption.set('manualValue', field.getValue());
                    } else {
                        selectedOption.set('benefitPlanOptionId', field.getValue());
                    }
                } else {
                    // we have an option, but corresponding group is not there anymore
                    selectedOption && employeeBenefitOptions.remove(selectedOption);
                }
            }

            return employeeBenefitOptions;
        },

        updateDependents : function() {
            var vm = this.getViewModel(),
                benefit = vm.get('record'),
                dependents = benefit.dependents(),
                dependentsContactVals = this.lookup('dependentsList').getValue(),
                dependentsContactIds = Ext.Object.getKeys(dependentsContactVals),
                addIds = Ext.Array.clean(Ext.Array.clone(dependentsContactIds));

            if (vm.get('allowDependents')) {
                if (!Ext.isArray(dependentsContactIds)) {
                    dependentsContactIds = [dependentsContactIds];
                }

                dependents.getData().each(function(record) {
                    var personContactId = record.get('personContactId').toString(),
                        personContactVal = dependentsContactVals[personContactId];

                    if (!Ext.Array.contains(dependentsContactIds, personContactId)) {
                        dependents.remove(record);
                    } else {
                        Ext.Array.remove(addIds, personContactId);
                        record.set({
                            effectiveDate : personContactVal.effectiveDate,
                            expirationDate : personContactVal.expirationDate
                        });
                    }
                });

                Ext.each(addIds, function(newId) {
                    var personContactVal = dependentsContactVals[newId],
                        data = {
                            personContactId : newId,
                            effectiveDate : personContactVal.effectiveDate,
                            expirationDate : personContactVal.expirationDate
                        };

                    if (!benefit.phantom) {
                        data['employeeBenefitId'] = benefit.getId();
                    }

                    dependents.add(data);
                });
            } else {
                dependents.removeAll();
            }

            return dependents;
        },

        updateBeneficiaries : function() {
            var vm = this.getViewModel(),
                addIds,
                benefit = vm.get('record'),
                beneficiaries = benefit.beneficiaries(),
                beneficiariesContactVals,
                beneficiariesContactIds;

            beneficiariesContactVals = this.lookup('beneficiariesList').getValue();
            beneficiariesContactIds = Ext.Object.getKeys(beneficiariesContactVals);

            if (vm.get('allowBeneficiaries')) {
                addIds = Ext.Array.clone(beneficiariesContactIds);

                beneficiaries.getData().each(function(record) {
                    var personContactId = record.get('personContactId').toString(),
                        beneficiariesContactVal = beneficiariesContactVals[personContactId];

                    if (!Ext.Array.contains(beneficiariesContactIds, personContactId)) {
                        beneficiaries.remove(record);
                    } else {
                        Ext.Array.remove(addIds, personContactId);
                        record.set({
                            beneficiaryPercent : beneficiariesContactVal.percent,
                            effectiveDate : beneficiariesContactVal.effectiveDate,
                            expirationDate : beneficiariesContactVal.expirationDate
                        });
                    }
                });

                Ext.each(addIds, function(newId) {
                    var beneficiariesContactVal = beneficiariesContactVals[newId],
                        data = {
                            personContactId : newId,
                            beneficiaryPercent : beneficiariesContactVal.percent,
                            effectiveDate : beneficiariesContactVal.effectiveDate,
                            expirationDate : beneficiariesContactVal.expirationDate
                        };

                    if (!benefit.phantom) {
                        data['employeeBenefitId'] = benefit.getId();
                    }

                    beneficiaries.add(data);
                });
            } else {
                beneficiaries.removeAll();
            }

            return beneficiaries;
        },

        updateContingentBeneficiaries : function() {
            var vm = this.getViewModel(),
                addIds,
                benefit = vm.get('record'),
                contingentBeneficiaries = benefit.contingentBeneficiaries(),
                contingentBeneficiariesContactVals,
                contingentBeneficiariesContactIds;

            contingentBeneficiariesContactVals = this.lookup('contingentBeneficiariesList').getValue();
            contingentBeneficiariesContactIds = Ext.Object.getKeys(contingentBeneficiariesContactVals);

            if (vm.get('allowBeneficiaries') && vm.get('hasContingents')) {
                addIds = Ext.Array.clone(contingentBeneficiariesContactIds);

                contingentBeneficiaries.getData().each(function(record) {
                    var personContactId = record.get('personContactId').toString(),
                        contingentBeneficiariesContactVal = contingentBeneficiariesContactVals[personContactId];

                    if (!Ext.Array.contains(contingentBeneficiariesContactIds, personContactId)) {
                        contingentBeneficiaries.remove(record);
                    } else {
                        Ext.Array.remove(addIds, personContactId);
                        record.set({
                            beneficiaryPercent : contingentBeneficiariesContactVal.percent,
                            effectiveDate : contingentBeneficiariesContactVal.effectiveDate,
                            expirationDate : contingentBeneficiariesContactVal.expirationDate
                        });
                    }
                });

                Ext.each(addIds, function(newId) {
                    var contingentBeneficiariesContactVal = contingentBeneficiariesContactVals[newId],
                        data = {
                            personContactId : newId,
                            beneficiaryPercent : contingentBeneficiariesContactVal.percent,
                            effectiveDate : contingentBeneficiariesContactVal.effectiveDate,
                            expirationDate : contingentBeneficiariesContactVal.expirationDate
                        };

                    if (!benefit.phantom) {
                        data['employeeBenefitId'] = benefit.getId();
                    }

                    contingentBeneficiaries.add(data);
                });
            } else {
                contingentBeneficiaries.removeAll();
            }

            return contingentBeneficiaries;
        },

        handleRecalc : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                benefit = vm.get('record'),
                deduction = vm.get('record').getDeduction(),
                planRecord = this.getViewModel().get('planRecord');

            if (!this.getView().getForm().isValid()) {
                return;
            }

            var wnd = Ext.create({
                xtype : 'window',
                title : i18n.gettext('Select Calculation Date'),
                modal : true,
                closable : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],

                buttons : [
                    {
                        xtype : 'button',
                        text : vm.get('calcButtonText'),
                        cls : 'criterion-btn-primary',
                        listeners : {
                            click : function() {
                                var datefield = wnd.down('[name=date]'),
                                    form = wnd.down('form');

                                if (form.isValid()) {
                                    wnd.fireEvent('save', datefield.getValue());
                                }
                            }
                        }
                    }
                ],

                bodyPadding : 20,

                items : [
                    {
                        xtype : 'form',
                        reference : 'form',
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Calculation Date'),
                                name : 'date',
                                allowBlank : false
                            }
                        ]
                    }
                ]
            });

            wnd.show();
            wnd.on({
                save : function(date) {
                    wnd.destroy();

                    me.updateDependents();
                    me.updateOptions();
                    view.setLoading(true);

                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYEE_BENEFIT_CALCULATE + '?' +
                            Ext.Object.toQueryString({
                                employeeId : me.getEmployeeId(),
                                benefitPlanId : planRecord.getId()
                            }),
                        jsonData : {
                            id : benefit.getId(),
                            employeeDeductionId : deduction.getId(),
                            deduction : deduction.getData({serialize : true}),
                            employeeCoverage : benefit.get('employeeCoverage'),
                            dependentCoverage : benefit.get('dependentCoverage'),
                            premium : benefit.get('premium'),
                            employeeContribution : benefit.get('employeeContribution'),
                            employerContribution : benefit.get('employerContribution'),
                            isManualOverride : benefit.get('isManualOverride'),
                            options : benefit.options().getDataAsArray(),
                            dependents : benefit.dependents().getDataAsArray(true),
                            calculationDate : Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT)
                        },
                        method : 'POST'
                    }).then({
                        scope : me,
                        success : function(result) {
                            benefit.set({
                                premium : result['premium'],
                                employeeCoverage : result['employeeCoverage'],
                                dependentCoverage : result['dependentCoverage'],
                                employeeContribution : result['employeeContribution'],
                                employerContribution : result['employerContribution']
                            });
                            deduction.set({
                                effectiveDate : result['effectiveDate'],
                                expirationDate : result['expirationDate'],
                                employeeAmount : result['employeeAmount'],
                                employerAmount : result['employerAmount']
                            });
                        }
                    }).always(function() {
                        view.setLoading(false);
                    });
                },
                close : function() {
                    me.setCorrectMaskZIndex(false);
                }
            });

            me.setCorrectMaskZIndex(true);
        },

        handleChangeBeneficiariesTotal : function(value) {
            this.getViewModel().set('beneficiariesTotal', value);
        },

        handleChangeSelectedPersons : function(checkedPersonIds) {
            var vm = this.getViewModel();

            vm.set('selectedPersonContactsIds', checkedPersonIds);

            this.lookup('contingentBeneficiariesList').store.setFilters([
                {
                    property : 'id',
                    value : checkedPersonIds,
                    operator : 'notin'
                }
            ]);
        }
    };
});

