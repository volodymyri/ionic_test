Ext.define('criterion.controller.settings.benefits.openEnrollment.RolloverConfigure', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_open_enrollment_rollover_configure',

        handleCancel() {
            this.fireViewEvent('cancel');
        },

        handleSave() {
            if (this.getView().isValid()) {
                this.fireViewEvent('changed', this.getOptionChanges());
            } else {
                this.focusInvalidField();
            }
        },

        findInvalidField() {
            return this.getView().getForm().getFields().findBy(field => !field.isValid());
        },

        focusInvalidField() {
            let field = this.findInvalidField();

            field && field.focus();
        },

        handleShow() {
            let vm = this.getViewModel(),
                view = this.getView(),
                originalBenefitPlan = vm.get('originalBenefitPlan'),
                optionChange = vm.get('optionChange'),
                stOption = originalBenefitPlan.options(),
                newPlanOptions = this.getNewPlanOptions();

            this.lookup('cancelBtn').focus();

            Ext.Array.each(criterion.Utils.range(1, 4), index => {
                let optionGroup = originalBenefitPlan.get(`optionGroup${index}`),
                    optionGroupIsManual = originalBenefitPlan.get(`optionGroup${index}IsManual`),
                    options = [],
                    existedOptionChanges = optionChange && optionChange[`optionGroup${index}`];

                if (optionGroup) {
                    stOption.each(op => {
                        if (op.get('optionGroup') === index) {
                            options.push(op.getData());
                        }
                    });

                    view.createGroupBlock({
                        index,
                        optionGroup,
                        optionGroupIsManual,
                        options,
                        newPlanOptions,
                        existedOptionChanges
                    });
                }
            });
        },

        getNewPlanOptions() {
            let vm = this.getViewModel(),
                replacementBenefitPlan = vm.get('replacementBenefitPlan'),
                groups = [],
                options;

            Ext.Array.each(criterion.Utils.range(1, 4), index => {
                let name = replacementBenefitPlan.get(`optionGroup${index}`);

                if (name) {
                    groups.push({
                        id : index,
                        name : name,
                        isManual : replacementBenefitPlan.get(`optionGroup${index}IsManual`)
                    });
                }
            });

            options = Ext.clone(Ext.Array.map(replacementBenefitPlan.options().getRange(), val => {
                let data = val.getData();

                return {
                    id : data.id,
                    name : `${data.name} [${data.code}]`,
                    optionGroup : data.optionGroup
                }
            }));

            return {groups, options};
        },

        getOptionChanges() {
            let me = this,
                vm = this.getViewModel(),
                originalBenefitPlan = vm.get('originalBenefitPlan'),
                res = {};

            Ext.Array.each(criterion.Utils.range(1, 4), index => {
                let groupContainerVm,
                    optionGroupIndexName = `optionGroup${index}`,
                    optionGroup = originalBenefitPlan.get(optionGroupIndexName);

                if (optionGroup) {
                    groupContainerVm = me.lookup(`groupContainer${index}`).getViewModel();

                    res[optionGroupIndexName] = {
                        toGroup : groupContainerVm.get('groupIndex'),
                        options : Ext.Object.getValues(groupContainerVm.get('groupOptionChanges'))
                    };
                }
            });

            return res;
        }

    }

});
