Ext.define('criterion.controller.ess.openEnrollment.BenefitForm', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_open_enrollment_benefit_form',

        requires : [
            'criterion.model.employer.BenefitPlan',
            'criterion.model.employer.benefit.Option',
            'criterion.store.employer.benefit.Options'
        ],

        init : function() {
            var me = this,
                vm = me.getViewModel(),
                benefits = vm.get('employerStep.benefits'),
                enroll = vm.getStore('enroll');

            if (benefits && benefits.find('isElective', false) >= 0) {
                vm.set('employeeStep.isEnroll', true);
                enroll.filter('value', true);
            }

            me.callParent(arguments);
        },

        onPlanChange : function(cmp, value) {
            var vm = this.getViewModel(),
                planOptions = this.lookupReference('planOptions'),
                employerStep = vm.get('employerStep'),
                employeeStep = vm.get('employeeStep'),
                plan = employerStep.benefits().getById(value),
                options = plan && plan.options(),
                employeeStepOptions;

            if (vm.get('employeeStepPlanId') === value) {
                employeeStepOptions = Ext.isFunction(employeeStep.options) && employeeStep.options();
            }

            planOptions.removeAll(true);

            if (!plan) {
                Ext.defer(function() {
                    this.getView().up('criterion_selfservice_open_enrollment').fireEvent('recalculate');
                }, 100, this);
                return;
            }

            for (var i = 1; i <= 4; i++) {
                var group = plan.get('optionGroup' + i),
                    isManual = plan.get('optionGroup' + i + 'IsManual'),
                    employeeStepOption = employeeStepOptions && employeeStepOptions.findRecord('optionGroup', i),
                    item;

                if (!group) {
                    continue;
                }

                if (isManual) {
                    item = {
                        xtype : 'numberfield',
                        fieldLabel : group,
                        optionGroup : i,
                        allowBlank : false,
                        value : employeeStepOption ? employeeStepOption.get('manualValue') : '',
                        listeners : {
                            change : {
                                fn : 'onOptionChange',
                                buffer : 500
                            }
                        },
                        bind : {
                            readOnly : '{editDisabled}'
                        }

                    };
                } else {
                    var store = Ext.create('criterion.store.employer.benefit.Options', {
                        data : options.getRange(),
                        filters : [
                            {
                                property : 'optionGroup',
                                value : i
                            },
                            {
                                property : 'isActive',
                                value : true
                            }
                        ]
                    });

                    item = Ext.create('Ext.form.field.ComboBox', {
                        queryMode : 'local',
                        fieldLabel : group,
                        optionGroup : i,
                        valueField : 'id',
                        displayField : 'name',

                        allowBlank : false,
                        editable : false,

                        value : employeeStepOption ? employeeStepOption.get('benefitPlanOptionId') : null,

                        bind : {
                            readOnly : '{editDisabled}'
                        },

                        listeners : {
                            select : 'onOptionChange'
                        },
                        store : store
                    });
                }

                item._isManual = isManual;
                planOptions.add(item);
            }

            this.onOptionChange();
            this.checkDependents();
        },

        onOptionChange : function(cmp) {
            var view = this.getView(),
                vm = this.getViewModel(),
                plan = vm.get('planSelect.selection'),
                openEnrollmentPanel = this.getView().up('criterion_selfservice_open_enrollment');

            if (cmp && !cmp._isManual) {
                this.checkDependents();
            }

            vm.set('calculated', null);

            view.fireEvent('planChange', plan);

            if (!plan) {
                return;
            }

            if (!this.getView().isValid()) {
                return;
            }

            // wait viewModel update
            Ext.defer(function() {
                openEnrollmentPanel.fireEvent('recalculate');
            }, 100);
        },

        getSelectedPlan : function() {
            return this.getViewModel().get('planSelect.selection');
        },

        getStep : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                employerStep = vm.get('employerStep'),
                selectedPlan = vm.get('planSelect.selection'),
                employeeStep = vm.get('employeeStep');

            employeeStep.set('benefitName', employerStep.get('benefitName'));

            if (view.isValid() && employeeStep.get('isEnroll')) {
                employeeStep.set({
                    contribution : selectedPlan.get('showEmployeeCost') ? vm.get('employeeContribution') : '-',
                    planName : selectedPlan.get('name'),
                    options : this.getOptions()
                });
            }

            return employeeStep;
        },

        getDependents : function() {
            var planOptions = this.lookupReference('planOptions'),
                vm = this.getViewModel(),
                dependents = vm.get('dependents'),
                dependentsArr = [];

            planOptions.items.each(function(option) {
                if (!option._isManual) {
                    var selected = option.getSelectedRecord();

                    if (selected && selected.get('isAllowDependent')) {
                        dependents.each(function(dependent) {
                            dependentsArr.push(dependent.getData());
                        });
                    }
                }
            });

            return dependentsArr;
        },

        getBeneficiaries : function() {
            var planOptions = this.lookupReference('planOptions'),
                vm = this.getViewModel(),
                beneficiaries = vm.get('beneficiaries'),
                beneficiariesArr = [];

            planOptions.items.each(function(option) {
                if (!option._isManual) {
                    var selected = option.getSelectedRecord();

                    if (selected && selected.get('isAllowBeneficiary')) {
                        beneficiaries.each(function(beneficiary) {
                            beneficiariesArr.push(beneficiary.getData());
                        });
                    }
                }
            });

            return beneficiariesArr;
        },

        checkDependents : function() {
            var planOptions = this.lookupReference('planOptions'),
                allowBeneficiary = false,
                allowDependent = false;

            planOptions.items.each(function(option) {
                if (!option._isManual) {
                    var selected = option.getSelectedRecord();

                    allowDependent = allowDependent || selected && selected.get('isAllowDependent');
                    allowBeneficiary = allowBeneficiary || selected && selected.get('isAllowBeneficiary');
                }
            });

            this.getView().fireEvent('afterOptionChange', allowDependent, allowBeneficiary);
        },

        getOptions : function() {
            var planOptions = this.lookupReference('planOptions'),
                options = [];

            planOptions.items.each(function(option) {
                if (option._isManual) {
                    options.push({
                        benefitPlanOptionId : null,
                        optionGroup : option.optionGroup,
                        optionName : option.fieldLabel,
                        manualValue : option.getValue()
                    });
                } else {
                    var optionRecord = option.getSelectedRecord(),
                        optionCode = optionRecord && optionRecord.get('code');

                    options.push({
                        benefitPlanOptionId : option.getValue(),
                        optionGroup : option.optionGroup,
                        optionName : option.fieldLabel,
                        optionValue : option.getDisplayValue(),
                        optionCode : optionCode,
                        manualValue : null
                    });
                }
            });

            return options;
        },

        onIsEnrollChange : function(cmp, value, oldValue) {
            if (Ext.isDefined(oldValue) && !value) {
                this.lookup('planSelect').reset();
            }
        }
    }
});
