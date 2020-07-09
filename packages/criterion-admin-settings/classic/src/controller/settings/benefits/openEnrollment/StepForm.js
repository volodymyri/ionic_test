Ext.define('criterion.controller.settings.benefits.openEnrollment.StepForm', function() {

        return {
            extend : 'criterion.controller.FormView',

            alias : 'controller.criterion_settings_open_enrollment_step_form',

            mixins : [
                'criterion.controller.mixin.ControlMaskZIndex'
            ],

            stepBenefits : null,

            handleSubmitClick : function() {
                var vm = this.getViewModel(),
                    view = this.getView(),
                    record = vm.get('record'),
                    stepBenefits = vm.get('stepBenefits'),
                    benefitPlans = vm.getStore('benefitPlans');

                if (view.isValid()) {
                    var selectedPlans = benefitPlans.getRange();

                    if (!selectedPlans.length) {
                        criterion.Msg.warning(i18n.gettext('Select at least one benefit plan for this step.'));
                        return;
                    }

                    record.set('openEnrollmentId', vm.get('openEnrollment').getId());

                    var toRemove = [];

                    stepBenefits.each(function(stepBenefit) {
                        var isSelected = Ext.Array.findBy(selectedPlans, function(selectedBenefitPlan) {
                            return selectedBenefitPlan.getId() === stepBenefit.get('benefitPlanId')
                        });

                        if (!isSelected) {
                            toRemove.push(stepBenefit);
                        }
                    });

                    stepBenefits.remove(toRemove);

                    Ext.Array.each(selectedPlans, function(selectedBenefitPlan) {
                        if (!stepBenefits.findRecord('benefitPlanId', selectedBenefitPlan.getId(), 0, false, false, true)) {
                            stepBenefits.add({
                                benefitPlanId : selectedBenefitPlan.getId()
                            })
                        }
                    });

                    record.stepBenefits = stepBenefits;
                    stepBenefits.count() && record.set('benefitTypeCd', this.lookupReference('benefitType').getValue());
                    view.fireEvent('save', record);
                    view.close();
                } else {
                    this.focusInvalidField();
                }
            },

            handleRecordLoad : function(record) {
                var view = this.getView(),
                    vm = this.getViewModel(),
                    employer = vm.get('employer'),
                    stepBenefits,
                    benefitPlans = vm.getStore('benefitPlans'),
                    promises = [];

                vm.set('record', record);

                if (record.stepBenefits) {
                    stepBenefits = record.stepBenefits
                } else {
                    stepBenefits = Ext.create('criterion.store.employer.openEnrollment.StepBenefits');

                    if (!record.phantom) {
                        promises.push(stepBenefits.loadWithPromise({
                            params : {
                                openEnrollmentStepId : record.getId()
                            }
                        }))
                    }
                }

                benefitPlans.getProxy().setExtraParam('employerId', employer.getId());

                vm.set('loadingState', true);

                Ext.promise.Promise.all(promises.concat([
                    benefitPlans.loadWithPromise()
                ])).then({
                    scope : this,
                    success : function() {
                        var benefitCombo = this.lookupReference('benefitType'),
                            benefitType;

                        vm.set('stepBenefits', stepBenefits);

                        if (stepBenefits.count()) {
                            benefitType = benefitPlans.getById(stepBenefits.getAt(0).get('benefitPlanId')).get('benefitTypeCd')
                        } else {
                            benefitType = criterion.CodeDataManager.getStore(criterion.consts.Dict.BENEFIT_TYPE).getAt(0).getId()
                        }

                        if (benefitCombo.getValue() === benefitType) {
                            benefitPlans.filter('benefitTypeCd', benefitType);
                            this.loadBenefitSteps();
                        } else {
                            benefitCombo.setValue(benefitType);
                        }

                        vm.set('loadingState', false);
                    }
                });
            },

            loadBenefitSteps : function() {
                var vm = this.getViewModel(),
                    stepBenefits = vm.get('stepBenefits'),
                    benefitPlans = vm.getStore('benefitPlans'),
                    benefitPlanIds = [];

                if (!benefitPlans.getFilters().getByKey('id')) {
                    stepBenefits.each(function(record) {
                        benefitPlanIds.push(record.get('benefitPlanId'));
                    });
                    benefitPlans.filter(
                        {
                            property : 'id',
                            value : benefitPlanIds,
                            operator : 'in'
                        });
                }
            },

            onBenefitTypeChange : function(cmp, value) {
                var vm = this.getViewModel(),
                    benefitPlans = this.getViewModel().getStore('benefitPlans');

                benefitPlans.filter('benefitTypeCd', value);
                if (vm.get('stepBenefits')) {
                    this.loadBenefitSteps();
                }
            },

            handleAddClick : function() {
                var me = this,
                    benefitPlans = this.getViewModel().getStore('benefitPlans'),
                    selectBenefitsWindow;

                selectBenefitsWindow = Ext.create('criterion.view.MultiRecordPicker', {
                    modal : true,
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            modal : true,
                            height : 400,
                            width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                        }
                    ],
                    viewModel : {
                        data : {
                            title : i18n.gettext('Add Plan'),
                            submitBtnText : i18n.gettext('Save'),
                            gridColumns : [
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Plan Name'),
                                    dataIndex : 'name',
                                    flex : 1,
                                    excludeFromFilters : true
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Plan Code'),
                                    dataIndex : 'code',
                                    flex : 1,
                                    excludeFromFilters : true
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Carrier'),
                                    dataIndex : 'carrierName',
                                    flex : 1,
                                    excludeFromFilters : true
                                }
                            ],
                            storeParams : {
                                isActive : true
                            },
                            selectedRecords : benefitPlans.getData().getValues('id'),
                            storeFilters : [
                                {
                                    property : 'benefitTypeCd',
                                    value : this.lookupReference('benefitType').getValue()
                                }
                            ]
                        },
                        stores : {
                            inputStore : benefitPlans
                        }
                    }
                });

                selectBenefitsWindow.on('selectRecords', this.onBenefitsSelect, this);
                selectBenefitsWindow.on('close', function() {
                    me.setCorrectMaskZIndex(false);
                });

                selectBenefitsWindow.show();

                me.setCorrectMaskZIndex(true);
            },

            onBenefitsSelect : function(records) {
                var vm = this.getViewModel(),
                    benefitPlans = vm.getStore('benefitPlans'),
                    benefitPlanIds = [];

                Ext.Array.each(records, function(record) {
                    benefitPlanIds.push(record.getId());
                });
                benefitPlans.filter(
                    {
                        property : 'id',
                        value : benefitPlanIds,
                        operator : 'in'
                    });
            },

            onBenefitRemove : function(record) {
                var benefitPlans = this.getViewModel().get('benefitPlans'),
                    filterValue = benefitPlans.getFilters().getByKey('id').getValue();

                filterValue.splice(filterValue.indexOf(record.getId()), 1);
                benefitPlans.filter(
                    {
                        property : 'id',
                        value : filterValue,
                        operator : 'in'
                    });
            }
        }

    }
);
