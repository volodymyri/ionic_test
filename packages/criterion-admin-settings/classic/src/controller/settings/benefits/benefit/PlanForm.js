Ext.define('criterion.controller.settings.benefits.benefit.PlanForm', function() {

    let file;

    const RESULT_CODES = criterion.consts.Error.RESULT_CODES,
        API = criterion.consts.Api.API,
        PLAN_DEFINITION_SECTION_INDEX = 0,
        FORMULAS_SECTION_INDEX = 1,
        OPTIONS_SECTION_INDEX = 2;

    return {

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.settings.benefits.benefit.Enroll',
            'Ext.data.TreeStore',
            'criterion.ux.form.CloneForm'
        ],

        alias : 'controller.criterion_settings_benefit_plan_form',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        init() {
            this.load = Ext.Function.createDelayed(this.load, 100, this);

            this.callParent(arguments);
        },

        onBeforeEmployerChange(employer) {
            this.employerId = employer ? employer.getId() : null;
        },

        handleRecordLoad(record) {
            if (record) {
                this.load(record.phantom ? null : record);
                this.getViewModel().set('isPhantom', record.phantom);
            }
        },

        handleSelectFile(event) {
            file = event.target && event.target.files && event.target.files[0];
        },

        handlePlanTitleChange(cmp, newValue) {
            let vm = this.getViewModel();

            vm.set('planTitle', newValue ? newValue : i18n.gettext('Untitled'));
        },

        isViewActive() {
            let view = this.getView();

            return Ext.WindowManager.getActive() === view && view.isVisible(true);
        },

        navCancelHandler() {
            if (this.isViewActive()) {
                this.handleCancelClick();
            }
        },

        navDeleteHandler(_, event) {
            let targetEl = Ext.fly(event.target),
                targetCmp = targetEl && targetEl.component;

            if (!targetCmp || !targetCmp.isTextInput) {
                if (!this.getViewModel().get('blockedState') && this.isViewActive()) {
                    this.handleDeleteClick();
                }
            }
        },

        handleNextClick() {
            let vm = this.getViewModel(),
                activeViewIndex = vm.get('activeViewIndex');

            if (activeViewIndex === PLAN_DEFINITION_SECTION_INDEX) {
                if (!this.validateHtmlEditor()) {
                    return;
                }
            }

            vm.set('activeViewIndex', activeViewIndex + 1);
        },

        handlePrevClick() {
            let vm = this.getViewModel(),
                activeViewIndex = vm.get('activeViewIndex');

            vm.set('activeViewIndex', activeViewIndex - 1);
        },

        validateHtmlEditor() {
            let form = this.getView().down('#planDefinition'),
                htmlEditor = form.down('criterion_htmleditor'),
                value = htmlEditor.getValue();

            if (!value || value === '' || !form.isValid()) {
                htmlEditor.markInvalid(i18n.gettext('This field is required'));
                return false;
            } else {
                return true;
            }
        },

        handleCancelClick() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.fireEvent('cancel', view, vm.get('plan'));

            this.close();
        },

        load(record) {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                employerDeductions = vm.getStore('employerDeductions'),
                employerCarriers = vm.getStore('employerCarriers'),
                ratesGrid = this.lookupReference('ratesGrid');

            view.setLoading(true);

            if (record === null) {
                record = Ext.create('criterion.model.employer.BenefitPlan');
                vm.set('plan', record);
            } else {
                vm.set('plan', record);
                ratesGrid.controller.load(record);
                let documentName = record.get('documentName');

                if (documentName) {
                    me.lookup('document').setRawValue(documentName);
                }
            }

            Ext.Array.each(criterion.Utils.range(1, 4), function(idx) {
                let optionGroupName = 'optionGroup' + idx,
                    optGroupCmp = this.lookupReference(optionGroupName),
                    store = optGroupCmp.getOptionsStore(),
                    groupExists = !!record.get(optionGroupName);

                optGroupCmp.setEnabled(groupExists);
                optGroupCmp.getViewModel().set('blockTypeChange', groupExists);

                record.options().each(function(option) {
                    if (option.get('optionGroup') === idx) {
                        store.add(option);
                    }
                });
            }, this);

            employerDeductions.getProxy().setExtraParam('employerId', this.employerId);
            record.phantom && employerDeductions.getProxy().setExtraParam('isAvailable', true);

            employerCarriers.getProxy().setExtraParams({
                employerId : this.employerId
            });

            Ext.promise.Promise.all([
                employerDeductions.loadWithPromise(),
                employerCarriers.loadWithPromise(),
                me.lookupReference('customfieldsBenefitPlan').getController().load(record && !record.phantom ? record.getId() : null)
            ]).always(function() {
                view.setLoading(false, null);
            });
        },

        handleRecordUpdate() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                planRecord = vm.get('plan'),
                removedGroups = [];

            if (!view.down('#planDefinition').isValid()) {
                vm.set('activeViewIndex', PLAN_DEFINITION_SECTION_INDEX);
                return;
            }

            if (!this.validateFormulas()) {
                vm.set('activeViewIndex', FORMULAS_SECTION_INDEX);
                return;
            }

            if (!this.validateOptionGroups()) {
                vm.set('activeViewIndex', OPTIONS_SECTION_INDEX);
                return;
            }

            Ext.Array.each(criterion.Utils.range(1, 4), function(idx) {
                let optGrName = 'optionGroup' + idx,
                    optGroupCmp = this.lookupReference(optGrName);

                if (!optGroupCmp.getEnabled() && planRecord.get(optGrName)) {
                    removedGroups.push(optGroupCmp.getName());
                    planRecord.set(optGrName, '');
                    planRecord.set('isManual', false);
                }
            }, this);

            if (removedGroups.length) {
                criterion.Msg.confirmDelete({
                        title : i18n.gettext('Delete record'),
                        message : Ext.String.format(i18n.ngettext('The Option group {0} won\'t appear in future enrollments. Do you want to remove?',
                            'Option groups {0} won\'t appear in future enrollments. Do you want to remove?',
                            removedGroups.length), removedGroups.toString())
                    },
                    function(btn) {
                        if (btn === 'yes') {
                            me.processAddedGroups(planRecord).then(function(newDefaultOptions) {
                                me.saveRecord(newDefaultOptions);
                            });
                        } else {
                            return false;
                        }
                    }
                );
            } else {
                me.processAddedGroups(planRecord).then(function(newDefaultOptions) {
                    me.saveRecord(newDefaultOptions);
                });
            }
        },

        validateFormulas() {
            let valid = true,
                formulasTab = this.getView().down('#formulas'),
                formulas = formulasTab.query('field');

            formulas.forEach(function(formula) {
                valid = formula.validate() && valid;
            }, this);

            return valid;
        },

        validateOptionGroups() {
            let valid = true;
            Ext.Array.each(criterion.Utils.range(1, 4), function(idx) {
                let optGroupCmp = this.lookupReference('optionGroup' + idx);

                valid = optGroupCmp.validate() && valid;
            }, this);

            return valid;
        },

        processAddedGroups(planRecord) {
            let me = this,
                dfd = Ext.create('Ext.Deferred'),
                addedNonManualGroups = [];

            if (planRecord.phantom) {
                dfd.resolve();
                return dfd.promise
            }

            Ext.Object.each(planRecord.modified, function(fieldName, value) {
                Ext.Array.each(criterion.Utils.range(1, 4), function(idx) {
                    if (fieldName === 'optionGroup' + idx && !value) {
                        if (!planRecord.get(Ext.String.format('optionGroup{0}IsManual', idx))) {
                            addedNonManualGroups.push({
                                groupId : idx,
                                name : fieldName
                            })
                        }
                    }
                });
            });

            if (addedNonManualGroups.length) {
                let addedGroupsWithOptions = [];

                Ext.Array.each(addedNonManualGroups, function(addedGroup) {
                    let optionsCmp = me.lookup(addedGroup.name),
                        optionsGrid = optionsCmp && optionsCmp.down('criterion_settings_benefit_options_grid'),
                        optionsStore = optionsGrid && optionsGrid.getStore(),
                        groupOptions = [];

                    optionsStore.each(function(option) {
                        groupOptions.push({
                            text : option.get('name'),
                            checked : false,
                            leaf : true,
                            groupId : addedGroup.groupId,
                            optionId : option.getId()
                        })
                    });

                    addedGroupsWithOptions.push({
                        text : planRecord.get(addedGroup.name),
                        expanded : true,
                        expandable : false,
                        checked : null,
                        children : groupOptions
                    });
                });

                let optionsTree = Ext.create('criterion.ux.window.Window', {
                    closable : false,
                    title : i18n.gettext(i18n.gettext('Choose options for existing benefit enrollments')),
                    resizable : false,
                    bodyPadding : 10,

                    viewModel : {
                        stores : {
                            treeStore : {
                                type : 'tree',
                                fields : ['text', 'checked', 'groupId', 'optionId'],
                                root : {
                                    expanded : true,
                                    children : addedGroupsWithOptions
                                }
                            }
                        }
                    },
                    modal : true,
                    cls : 'criterion-modal',

                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                    height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,

                    items : [
                        {
                            xtype : 'treepanel',
                            cls : 'criterion-simple-tree',
                            rootVisible : false,
                            lines : false,
                            bind : {
                                store : '{treeStore}'
                            },
                            listeners : {
                                beforeselect : function(cmp, record) {
                                    cmp.getStore().each(function(item) {
                                        if (item.childNodes && item.childNodes.length && Ext.Array.indexOf(item.childNodes, record) > -1) {
                                            Ext.Array.each(item.childNodes, function(child) {
                                                if (child !== record) {
                                                    child.set('checked', false);
                                                }
                                            })
                                        }
                                    })
                                }
                            },
                            columns : [{
                                xtype : 'treecolumn',
                                dataIndex : 'text',
                                flex : 1
                            }]
                        }
                    ],

                    bbar : [
                        '->',
                        {
                            xtype : 'button',
                            text : i18n.gettext('Cancel'),
                            cls : 'criterion-btn-light',
                            handler : function() {
                                dfd.reject();
                                optionsTree.close();
                            }
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-primary',
                            text : i18n.gettext('Save'),
                            handler : function() {
                                let allGroupsChecked = true,
                                    treeStore = optionsTree.getViewModel().getStore('treeStore'),
                                    selected = {};

                                treeStore.each(function(item) {
                                    if (item.childNodes && item.childNodes.length) {
                                        let found = false;
                                        Ext.Array.each(item.childNodes, function(child) {
                                            if (child.get('checked')) {
                                                found = true;
                                                return false
                                            }
                                        });
                                        if (!found) {
                                            allGroupsChecked = false;
                                        }
                                    }
                                });

                                if (!allGroupsChecked) {
                                    criterion.Msg.warning(i18n.gettext('At least one option for each benefit group should be selected.'));
                                } else {
                                    treeStore.each(function(item) {
                                        if (item.get('checked')) {
                                            selected[item.get('groupId')] = item.get('optionId');
                                        }
                                    });
                                    dfd.resolve(selected);
                                    optionsTree.close();
                                }
                            }
                        }
                    ]
                });

                optionsTree.show();
            } else {
                dfd.resolve();
            }
            return dfd.promise
        },

        saveRecord(newDefaultOptions) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                planRecord = vm.get('plan'),
                options = planRecord && planRecord.options(),
                ratesStore = this.lookupReference('ratesGrid').getStore(),
                optionGroupIsManual =
                    (!!planRecord.get('optionGroup1') && planRecord.get('optionGroup1IsManual')) << 3 |
                    (!!planRecord.get('optionGroup2') && planRecord.get('optionGroup2IsManual')) << 2 |
                    (!!planRecord.get('optionGroup3') && planRecord.get('optionGroup3IsManual')) << 1 |
                    (!!planRecord.get('optionGroup4') && planRecord.get('optionGroup4IsManual')) << 0;

            view.setLoading(true);

            planRecord.set({
                employerId : this.employerId,
                optionGroupIsManual : optionGroupIsManual
            });

            Ext.Array.each(criterion.Utils.range(1, 4), function(idx) {
                let optGrName = 'optionGroup' + idx,
                    optionGroupCmp = this.lookupReference(optGrName),
                    store = optionGroupCmp.getOptionsStore(),
                    setDefaultOption = newDefaultOptions && newDefaultOptions[idx];

                optionGroupCmp.prepareForSave(setDefaultOption);

                Ext.Array.each(store.getRemovedRecords(), function(removed) {
                    let planOption = options.getById(removed.getId());

                    planOption && planOption.drop();
                });

                Ext.Array.each(store.getNewRecords(), function(newRecord) {
                    options.add(newRecord)
                });

                Ext.Array.each(store.getUpdatedRecords(), function(modifiedRecord) {
                    let planOption = options.getById(modifiedRecord.getId());

                    planOption && planOption.set(modifiedRecord.getData());
                });

            }, this);

            planRecord.save({
                scope : this,
                success : function(savedPlanRecord) {
                    let planId = savedPlanRecord.getId(),
                        promises = [];

                    if (file) {
                        criterion.Api.submitFakeForm([], {
                            url : criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN_UPLOAD,
                            scope : this,
                            extraData : {
                                attachment : file,
                                benefitPlanId : planId
                            }
                        });
                    }

                    vm.get('isPhantom') && ratesStore.each(function(rate) {
                        rate.set('benefitPlanId', planId);
                    });

                    promises.push(ratesStore.syncWithPromise());
                    promises.push(me.lookupReference('customfieldsBenefitPlan').getController().save(planId));

                    Ext.promise.Promise.all(promises).always(function() {
                        view.fireEvent('save', planRecord);
                        me.closeForm();
                    });
                },
                failure : function(model, operation) {
                    let field,
                        response = operation.error.response,
                        data = Ext.decode(response && response.responseText, true);

                    view.setLoading(false);

                    switch (data.code) {
                        case RESULT_CODES.BENEFIT_COVERAGE_FORMULA_NOT_VALID : // todo check and fix
                            field = me.lookupReference('expCalcEmployeeCoverage');
                            field.markInvalid("Coverage formula is not valid"); // <--
                            break;
                        case RESULT_CODES.BENEFIT_PREMIUM_FORMULA_NOT_VALID :
                            field = me.lookupReference('expCalcPlanPremium');
                            field.markInvalid("Premium formula is not valid");
                            break;
                        case RESULT_CODES.BENEFIT_DEPENDENT_FORMULA_NOT_VALID :
                            field = me.lookupReference('expCalcDependentCoverage');
                            field.markInvalid("Dependant formula is not valid");
                            break;
                        case RESULT_CODES.BENEFIT_EE_CONTRIBUTION_FORMULA_NOT_VALID :
                            field = me.lookupReference('expCalcEmployeeContribution');
                            field.markInvalid("Contribution formula is not valid");
                            break;
                        case RESULT_CODES.BENEFIT_ELIGIBILITY_FORMULA_NOT_VALID :
                            field = me.lookupReference('expCalcEligibility');
                            field.markInvalid("Eligibility formula is not valid");
                            break;
                        case RESULT_CODES.BENEFIT_EFFECTIVE_FORMULA_NOT_VALID :
                            field = me.lookupReference('expCalcEffectiveDate');
                            field.markInvalid("Effective formula is not valid");
                            break;
                        case RESULT_CODES.BENEFIT_EXPIRE_FORMULA_NOT_VALID :
                            field = me.lookupReference('expCalcExpirationDate');
                            field.markInvalid("Expire formula is not valid");
                            break;
                    }

                    field && field.focus();
                }
            });
        },

        closeForm() {
            let view = this.getView();

            view.setLoading(false);
            criterion.Utils.toast(i18n.gettext('Benefit Plan saved.'));
            this.close();
        },

        handleEnroll() {
            let record = this.getViewModel().get('plan');

            Ext.create('criterion.view.settings.benefits.benefit.Enroll', {
                viewModel : {
                    data : {
                        planRecord : record
                    }
                }
            }).show();
        },

        handleUpdatePremiums() {
            let me = this,
                record = this.getViewModel().get('plan');

            let wnd = Ext.create({
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
                        text : i18n.gettext('Recalc'),
                        cls : 'criterion-btn-primary',
                        listeners : {
                            click : function() {
                                let datefield = wnd.down('[name=date]'),
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

                    criterion.Api.requestWithPromise({
                        url : API.EMPLOYER_BENEFIT_PLAN_CALCULATE_EMPLOYEE_PLANS,
                        method : 'POST',
                        urlParams : {
                            benefitPlanId : record.getId()
                        },
                        jsonData : {
                            calculationDate : Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT)
                        }
                    }).then({
                            scope : me,
                            success : function(res) {
                                if (me.isDelayedResponse(res)) {
                                    me.controlDeferredProcess(
                                        i18n.gettext('Benefit Plan Calculation'),
                                        i18n.gettext('Benefit Plan Calculation in progress'),
                                        res.processId
                                    );
                                } else {
                                    me.processingCheckResult(res);
                                }
                            }
                        }
                    );
                },
                close : function() {
                    me.setCorrectMaskZIndex(false);
                }
            });

            me.setCorrectMaskZIndex(true);
        },

        processingCheckResult(res) {
            if (res.errors && res.errors.length) {
                let errors;

                errors = Ext.Array.map(res.errors, function(error) {
                    let errorInfo = criterion.consts.Error.getErrorInfo(error);

                    return error.employeeName + ': ' + errorInfo.description;
                });

                criterion.Msg.error({
                    title : i18n.gettext('Errors in benefit plan calculation'),
                    message : errors.join('<br>')
                });
            } else {
                criterion.Utils.toast(i18n.gettext('Premiums Updated.'));
            }
        },

        handleClone() {
            let picker,
                vm = this.getViewModel(),
                employerId = vm.get('plan.employerId'),
                me = this;

            picker = Ext.create('criterion.ux.form.CloneForm', {
                title : i18n.gettext('Clone Benefit Plan'),

                viewModel : {
                    data : {
                        benefitId : vm.get('plan.id'),
                        code : vm.get('plan.code') + criterion.Consts.CLONE_PREFIX,
                        name : vm.get('plan.name')
                    }
                },

                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Plan Code'),
                        allowBlank : false,
                        name : 'code',
                        bind : '{code}'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Plan Name'),
                        allowBlank : false,
                        name : 'name',
                        bind : '{name}'
                    }
                ]
            });

            picker.show();
            picker.focusFirstField();
            picker.on({
                cancel : () => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                clone : data => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                    me.cloneBenefit(data, employerId);
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        cloneBenefit(data, employerId) {
            let me = this,
                view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : Ext.util.Format.format(
                    criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN_CLONE,
                    data.benefitId,
                    employerId
                ),
                jsonData : {
                    code : data.code,
                    name : data.name
                },
                method : 'POST',
                silent : true
            }).then(() => {
                view.setLoading(false);

                view.fireEvent('afterSave', view);
                me.close();
            });
        }
    };
});
