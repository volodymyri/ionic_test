Ext.define('criterion.controller.common.BenefitAutoAddBase', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_benefit_autoadd_base',

        handleActivate : function() {
            var view = this.getView();

            view.createItems();
        },

        handleSave : function() {
            var saveData = {
                    selectedOptions : [],
                    excludedPlanIds : []
                },
                view = this.getView(),
                data = {
                    planId : view.getPlanId(),
                    options : []
                };

            if (!view.isValid()) {
                return;
            }

            this.lookupReference('planOptions').items.each(function(choice) {
                var option = {
                    optionGroup : choice.groupId
                };

                if (!choice.isManual) {
                    var values = choice.getValue(),
                        value = Ext.Object.getValues(values);

                    option.benefitPlanOptionId = value[0];
                } else {
                    option['manualValue'] = choice.value
                }
                data.options.push(option);
            });

            saveData.selectedOptions.push(data);

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : this.getViewModel().get('baseUrl'),
                method : 'POST',
                jsonData : Ext.JSON.encode(saveData)
            }).then(function() {
                Ext.isFunction(view.callback) ? view.callback() : null;
            }).always(function() {
                view.setLoading(false);
                view.close();
            });

        },

        handleCancel : function() {
            this.getView().close();
        }

    };
});
