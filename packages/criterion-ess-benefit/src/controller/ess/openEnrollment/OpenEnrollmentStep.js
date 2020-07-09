Ext.define('criterion.controller.ess.openEnrollment.OpenEnrollmentStep', function() {

    const API = criterion.consts.Api.API,
          DICT = criterion.consts.Dict,
          WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_open_enrollment_step',

        requires : [
            'criterion.model.employee.openEnrollment.CurrentPlan',
            'criterion.model.employer.BenefitPlan',
            'criterion.model.employee.benefit.Option',
            'criterion.view.MultiRecordPicker',
            'criterion.store.person.Contacts'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init : function() {
            var me = this,
                vm = me.getViewModel(),
                contacts = vm.getStore('contacts'),
                dependents = vm.getStore('dependents'),
                beneficiaries = vm.getStore('beneficiaries'),
                contingentBeneficiaries = vm.getStore('contingentBeneficiaries'),
                openEnrollmentStepId = vm.get('employerStep').getId(),
                employeeEnrollment = vm.get('employeeEnrollment');

            contacts.loadWithPromise({
                params : {
                    personId : criterion.Api.getCurrentPersonId()
                }
            }).then(function() {
                vm.get('employeeStep.dependents') && dependents.loadData(vm.get('employeeStep.dependents'));
                vm.get('employeeStep.beneficiaries') && beneficiaries.loadData(vm.get('employeeStep.beneficiaries'));
                vm.get('employeeStep.contingentBeneficiaries') && contingentBeneficiaries.loadData(vm.get('employeeStep.contingentBeneficiaries'));

                vm.set('hasContacts', contacts.getTotalCount() > 0);
                vm.set('hasContingents', !!contingentBeneficiaries.count());
            });

            criterion.Api.requestWithPromise({
                url : API.EMPLOYER_OPEN_ENROLLMENT_STEP_CURRENT_PLAN,
                params : {
                    employeeId : vm.get('employeeId'),
                    openEnrollmentStepId : openEnrollmentStepId
                },
                method : 'GET'
            }).then({
                success : function(response) {
                    var currentPlan = Ext.create('criterion.model.employee.openEnrollment.CurrentPlan', response);

                    me.updateCurrentPlan(currentPlan);
                }
            });

            if (employeeEnrollment && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED, WORKFLOW_STATUSES.APPROVED, WORKFLOW_STATUSES.REJECTED], employeeEnrollment.get('openEnrollmentStatusCode'))) {
                this.lookup('benefitViewDocuments').getStore().loadWithPromise({
                    params : {
                        employeeOpenEnrollmentStepId : vm.get('employeeStep.id')
                    }
                })
            }

            me.callParent(arguments);
        },

        updateCurrentPlan : function(currentPlan) {
            var vm = this.getViewModel(),
                currentOptions = this.lookupReference('currentOptions'),
                plan = Ext.create('criterion.model.employer.BenefitPlan', currentPlan.get('benefitPlan')),
                currentPlanOptions = currentPlan.get('options');

            vm.set('currentPlan', currentPlan);

            if (!plan || !currentPlanOptions || !currentPlanOptions.length) {
                return;
            }

            for (var i = 1; i <= 4; i++) {
                if (!currentPlanOptions[i - 1]) {
                    return;
                }
                var group = plan.get('optionGroup' + i),
                    isManual = plan.get('optionGroup' + i + 'IsManual'),
                    option = Ext.create('criterion.model.employee.benefit.Option', currentPlanOptions[i - 1]);

                if (!group) {
                    continue;
                }

                currentOptions.add({
                    xtype : 'textfield',
                    fieldLabel : group,
                    value : (isManual ? option.get('manualValue') : option.get('benefitPlanOption') && option.get('benefitPlanOption').name) || '-',
                    readOnly : true
                });
            }
        },

        getPlanDocuments : function() {
            return this.lookup('benefitDocuments').getDocuments();
        },

        getStepData : function() {
            var vm = this.getViewModel(),
                dependents = [],
                beneficiaries = [],
                contingentBeneficiaries = [],
                planFormController = this.lookup('planForm').getController(),
                data = {
                    step : planFormController.getStep(),
                    plan : planFormController.getSelectedPlan(),
                    documents : this.getPlanDocuments()
                };

            if (vm.get('employeeStep.isEnroll')) {
                if (vm.get('allowDependent')) {
                    var dependentsStore = vm.getStore('dependents');

                    dependents = dependentsStore.count() ? dependentsStore.getRange().map(function(rec) {
                        return {personContactId : rec.get('personContactId')}
                    }) : [];
                }

                if (vm.get('allowBeneficiary')) {
                    var beneficiariesStore = vm.getStore('beneficiaries'),
                        contingentBeneficiariesStore = vm.getStore('contingentBeneficiaries');

                    beneficiaries = beneficiariesStore.count() ? beneficiariesStore.getRange().map(function(rec) {
                        return {
                            personContactId : rec.get('personContactId'),
                            beneficiaryPercent : rec.get('beneficiaryPercent')
                        }
                    }) : [];

                    if (vm.get('showContingents')) {
                        contingentBeneficiaries = contingentBeneficiariesStore.count() ? contingentBeneficiariesStore.getRange().map(function(rec) {
                            return {
                                personContactId : rec.get('personContactId'),
                                beneficiaryPercent : rec.get('beneficiaryPercent')
                            }
                        }) : [];
                    }
                }
            }

            data['step'].set({
                dependents : dependents,
                beneficiaries : beneficiaries,
                contingentBeneficiaries : contingentBeneficiaries
            });

            if (vm.get('currentPlan.benefitPlanId')) {
                var currentOptions = this.lookupReference('currentOptions'),
                    options = [];

                currentOptions.items.each(function(option) {
                    options.push({
                        optionName : option.fieldLabel,
                        manualValue : option.getValue() || '-'
                    });
                });

                data['current'] = {
                    contribution : vm.get('currentPlan.showEmployeeCost') ? vm.get('currentPlan.employeeContribution') : '-',
                    planName : vm.get('currentPlan.benefitPlan.name'),
                    options : options
                };
            }

            return data;
        },

        onAfterOptionChange : function(allowDependent, allowBeneficiary) {
            this.getViewModel().set({
                allowDependent : allowDependent,
                allowBeneficiary : allowBeneficiary
            });
        },

        onNextYearPlanChange : function(plan) {
            this.getViewModel().set({
                nextYearPlan : plan
            });
        },

        renderContact : function(value) {
            var contacts = this.getViewModel().getStore('contacts'),
                contact = contacts.getById(value);

            return contact ? contact.get('fullName') : null;
        },

        createContactPicker : function(title, inputStore, selected) {
            var excludedIds;

            if (Ext.isArray(selected)) {
                excludedIds = Ext.clone(selected);
            } else if (Ext.isObject(selected) && selected.isStore) {
                excludedIds = Ext.Array.map(selected.getRange(), function(item) {
                    return item.get('personContactId');
                })
            }

            return Ext.create('criterion.view.MultiRecordPicker', {
                modal : true,
                draggable : false,
                plugins : {
                    ptype : 'criterion_sidebar',
                    modal : true,
                    height : '85%',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                },

                viewModel : {
                    data : {
                        title : title,
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'criterion_codedatacolumn',
                                text : i18n.gettext('Relationship'),
                                dataIndex : 'relationshipTypeCd',
                                excludeFromFilters : true,
                                flex : 1,
                                codeDataId : DICT.RELATIONSHIP_TYPE
                            }
                        ],
                        storeParams : {
                            personId : criterion.Api.getCurrentPersonId()
                        },
                        excludedIds : excludedIds
                    },
                    stores : {
                        inputStore : inputStore
                    }
                },
                inputStoreLocalMode : true
            });
        },

        onBeneficiaryChanges : function(store) {
            var vm = this.getViewModel(),
                beneficiaries = vm.getStore('beneficiaries'),
                beneficiaryPercent = Ext.Array.reduce(store.getRange(), function(previousValue, currentRecord) {
                    return previousValue + currentRecord.get('beneficiaryPercent');
                }, 0);

            vm.set('selectedBeneficiariesCount', beneficiaries.getCount()); // vm doesn't notify on store change, so moved to vm data

            this.getViewModel().set('beneficiariesTotal', beneficiaryPercent);
        },

        addDependents : function() {
            var me = this,
                vm = this.getViewModel(),
                contacts = vm.getStore('contacts'),
                dependents = vm.getStore('dependents'),
                selectDependents = this.createContactPicker(i18n.gettext('Add Dependents'), contacts, dependents);

            selectDependents.on('selectRecords', this.selectDependents, this);
            selectDependents.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            selectDependents.show();

            me.setCorrectMaskZIndex(true);
        },

        selectDependents : function(records) {
            var vm = this.getViewModel(),
                dependents = vm.getStore('dependents');

            dependents.loadData(records.map(function(record) {
                return {
                    personContactId : record.getId()
                }
            }), true);

            this.lookupReference('planForm').fireEvent('optionChange');
        },

        removeContact : function(cmp, idx) {
            var store = cmp.getStore();

            store.removeAt(idx);
            this.lookupReference('planForm').fireEvent('optionChange');
        },

        addBeneficiaries : function() {
            var me = this,
                vm = this.getViewModel(),
                contacts = vm.getStore('contacts'),
                beneficiaries = vm.getStore('beneficiaries'),
                contingentBeneficiaries = vm.getStore('contingentBeneficiaries'),
                selectBeneficiaries,
                usedContactIds = [];

            beneficiaries.each(function(beneficiary) {
                usedContactIds.push(beneficiary.get('personContactId'));
            });
            contingentBeneficiaries.each(function(beneficiary) {
                usedContactIds.push(beneficiary.get('personContactId'));
            });

            selectBeneficiaries = this.createContactPicker(i18n.gettext('Add Beneficiaries'), contacts, usedContactIds);
            selectBeneficiaries.show();

            selectBeneficiaries.on('selectRecords', this.selectBeneficiaries, this);
            selectBeneficiaries.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            me.setCorrectMaskZIndex(true);
        },

        selectBeneficiaries : function(records) {
            var vm = this.getViewModel(),
                beneficiaries = vm.getStore('beneficiaries');

            beneficiaries.loadData(records.map(function(record) {
                return {
                    personContactId : record.getId()
                }
            }), true);

            this.lookupReference('planForm').fireEvent('optionChange');
        },

        addContingentBeneficiaries : function() {
            var me = this,
                vm = this.getViewModel(),
                contacts = vm.getStore('contacts'),
                contingentBeneficiaries = vm.getStore('contingentBeneficiaries'),
                beneficiaries = vm.getStore('beneficiaries'),
                selectBeneficiaries,
                usedContactIds = [];

            beneficiaries.each(function(beneficiary) {
                usedContactIds.push(beneficiary.get('personContactId'));
            });
            contingentBeneficiaries.each(function(beneficiary) {
                usedContactIds.push(beneficiary.get('personContactId'));
            });

            selectBeneficiaries = this.createContactPicker(i18n.gettext('Add Contingent Beneficiaries'), contacts, usedContactIds);
            selectBeneficiaries.show();

            selectBeneficiaries.on('selectRecords', this.selectContingentBeneficiaries, this);
            selectBeneficiaries.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            me.setCorrectMaskZIndex(true);
        },

        selectContingentBeneficiaries : function(records) {
            var vm = this.getViewModel(),
                contingentBeneficiaries = vm.getStore('contingentBeneficiaries');

            contingentBeneficiaries.loadData(records.map(function(record) {
                return {
                    personContactId : record.getId()
                }
            }), true);
        },

        checkPlan : function() {
            var vm = this.getViewModel(),
                beneficiaries = vm.getStore('beneficiaries'),
                contingentBeneficiaries = vm.getStore('contingentBeneficiaries'),
                planValid = this.lookupReference('planForm').isValid(),
                beneficiaryPercent,
                cBeneficiaryPercent;

            if (planValid && vm.get('employeeStep.isEnroll') && vm.get('allowBeneficiary')) {
                beneficiaryPercent = beneficiaries.getRange().reduce(function(previousValue, currentRecord) {
                    return previousValue + currentRecord.get('beneficiaryPercent');
                }, 0);

                cBeneficiaryPercent = contingentBeneficiaries.getRange().reduce(function(previousValue, currentRecord) {
                    return previousValue + currentRecord.get('beneficiaryPercent');
                }, 0);

                if ((beneficiaryPercent !== 100 && beneficiaries.count()) || (cBeneficiaryPercent !== 100 && contingentBeneficiaries.count())) {
                    criterion.Msg.error(i18n.gettext('Sum of beneficiaries percentages must equal 100%'));
                    planValid = false;
                }
            }

            return planValid;
        }

    };
});
