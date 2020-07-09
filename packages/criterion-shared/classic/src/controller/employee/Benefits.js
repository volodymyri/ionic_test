Ext.define('criterion.controller.employee.Benefits', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_employee_benefits',

        requires : [
            'criterion.view.employee.benefit.BenefitForm',
            'criterion.view.common.BenefitAutoAddBase',
            'criterion.model.employer.BenefitPlan'
        ],

        mixins : {
            employeeContext : 'criterion.controller.mixin.identity.EmployeeContext'
        },

        loadRecordOnEditOptions : {
            params : {
                optional : 'dependents,beneficiaries,options,deduction'
            }
        },

        load : function() {
            let view = this.getView(),
                employeeId = this.getEmployeeId(),
                params;

            if (!employeeId) {
                return;
            }

            params = {
                employeeId : employeeId,
                optional : 'beneficiaries,dependents,plan'
            };

            if (!this.lookup('showInactive').getValue()) {
                params['expirationDateAfterToday'] = true
            }

            view.getSelectionModel().deselectAll();
            view.getStore().loadWithPromise({params : params});
        },

        handleAutoAdd : function() {
            var me = this,
                view = this.getView(),
                employerId = this.getEmployerId(),
                employeeId = this.getEmployeeId();

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYEE_BENEFIT_AUTO_ADD + '/' + employeeId + '?employerId=' + employerId,
                method : 'POST'
            }).then({
                success : function(result) {
                    var options = result && result.length && result[0].options;

                    if (options) {
                        view.setLoading(true);
                        Ext.create('criterion.model.employer.BenefitPlan', {
                            id : result[0].planId
                        }).loadWithPromise().then(function(rec) {
                            var showOptions = false;

                            //TODO: Move to BE
                            for (var i = 1; !showOptions && i <= 4; i++) {
                                if (!rec.get('optionGroup' + i)) {
                                    continue
                                }

                                if (rec.get('optionGroup' + i + 'IsManual')) {
                                    showOptions = true;
                                } else {
                                    Ext.Array.each(options, function(choice) {
                                        if (choice.optionGroup == i && choice.isActive) {
                                            showOptions = true;
                                            return false
                                        }
                                    });
                                }
                            }

                            if (showOptions) {
                                Ext.create('criterion.view.common.BenefitAutoAddBase', {
                                    viewModel : {
                                        data : {
                                            options : options,
                                            message : i18n.gettext('Please select default Options'),
                                            planRecord : rec,
                                            baseUrl : criterion.consts.Api.API.EMPLOYEE_BENEFIT_AUTO_ADD + '/' + employeeId + '?employerId=' + employerId
                                        }
                                    },
                                    callback : Ext.Function.bind(me.load, me)
                                }).show();
                            } else {
                                me.load();
                            }
                        }).always(function() {
                            view.setLoading(false);
                        });
                    } else {
                        me.load();
                    }

                }
            });
        },

        handleChangeShowInactive : function() {
            this.load();
        }

    };
});
