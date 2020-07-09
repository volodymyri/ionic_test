Ext.define('criterion.controller.settings.benefits.openEnrollment.AutoRollover', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_open_enrollment_auto_rollover',

        requires : [
            'criterion.view.settings.benefits.openEnrollment.RolloverConfigure'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleNextClick() {
            let vm = this.getViewModel(),
                view = this.getView(),
                rollovers = vm.getStore('rollovers');

            if (vm.get('openEnrollment.isAutoRollover')) {
                this.isValid().then(() => {
                    let seq = [];

                    view.setLoading(true);

                    rollovers.each(rec => {
                        let replacementBenefitPlanId = rec.get('replacementBenefitPlanId');

                        if (!replacementBenefitPlanId && !rec.phantom) {
                            seq.push(rec.eraseWithPromise());
                        } else if (replacementBenefitPlanId && rec.isModified('replacementBenefitPlanId')) {
                            seq.push(rec.saveWithPromise());
                        }
                    });

                    Ext.promise.Promise.all(seq).then(() => {
                        view.setLoading(false);

                        view.fireEvent('save');
                    });
                });
            } else {
                view.fireEvent('save');
            }
        },

        handleCancelClick() {
            this.getView().fireEvent('cancel');
        },

        load(benefitPlanId) {
            let vm = this.getViewModel(),
                view = this.getView(),
                rollovers = vm.getStore('rollovers'),
                openEnrollmentId = vm.get('openEnrollment.id');

            view.setLoading(true);

            Ext.Deferred.sequence([
                () => vm.getStore('replacementBenefitPlans').loadWithPromise({
                    params : {
                        openEnrollmentId,
                        benefitPlanId
                    }
                }),
                () => rollovers.loadWithPromise({
                    params : {
                        openEnrollmentId,
                        benefitPlanId
                    }
                })
            ]).then(() => {
                rollovers.each(rollover => {
                    if (rollover.getId() < 0 && !rollover.phantom) {
                        rollover.phantom = true;
                    }
                });
            }).always(() => {
                view.setLoading(false);
            });
        },

        isValid() {
            let vm = this.getViewModel(),
                dfd = Ext.create('Ext.Deferred'),
                openEnrollmentId = vm.get('openEnrollment.id'),
                rollovers = vm.getStore('rollovers'),
                notConfigured = [],
                structForValidation = [];

            rollovers.each((rec) => {
                if (rec.get('replacementBenefitPlanId')) {
                    if (!rec.get('optionChange')) {
                        notConfigured.push(rec.get('originalBenefitPlanName') + '&nbsp;<span class="bold">to</span>&nbsp;' + rec.get('replacementBenefitPlanName'));
                    }

                    structForValidation.push({
                        originalBenefitPlanId : rec.get('originalBenefitPlanId'),
                        replacementBenefitPlanId : rec.get('replacementBenefitPlanId'),
                        optionChange : rec.get('optionChange')
                    });
                }
            });

            if (notConfigured.length) {
                criterion.Msg.showMsg(
                    i18n.gettext('Validation'),
                    i18n.gettext('You need to configure rollovers') + ':<br />' + notConfigured.join('<br />'),
                    criterion.Msg.INFO,
                    function() {
                        dfd.reject();
                    }
                );
            } else {

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYER_OPEN_ENROLLMENT_ROLLOVER_VALIDATE,
                    method : 'POST',
                    jsonData : {
                        openEnrollmentId : openEnrollmentId,
                        rollover : structForValidation
                    }
                }).then((res) => {
                    let errors = [];

                    if (res && !res.length) {
                        dfd.resolve();
                    } else if (res) {
                        errors = Ext.Array.map(res, function(error) {
                            let errorInfo = criterion.consts.Error.getErrorInfo(error);

                            return errorInfo.description;
                        });

                        criterion.Msg.warning({
                            title : i18n.gettext('Validation Errors'),
                            message : errors.join('<br>')
                        });
                        dfd.reject();
                    }
                }, () => {
                    dfd.reject();
                });
            }

            return dfd.promise;
        },

        handleConfigureRollover(record, grid) {
            let picker,
                vm = this.getViewModel(),
                replacementBenefitPlans = vm.getStore('replacementBenefitPlans'),
                plans = replacementBenefitPlans.getById(record.get('originalBenefitPlanId')).replacementPlans(),
                me = this;

            picker = Ext.create('criterion.view.settings.benefits.openEnrollment.RolloverConfigure', {
                viewModel : {
                    data : {
                        originalBenefitPlan : plans.getById(record.get('originalBenefitPlanId')),
                        replacementBenefitPlan : plans.getById(record.get('replacementBenefitPlanId')),
                        optionChange : Ext.clone(record.get('optionChange'))
                    }
                }
            });

            picker.show();

            picker.on({
                cancel : function() {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                changed : function(view, data) {
                    record.set('optionChange', data);

                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                }
            });

            me.setCorrectMaskZIndex(true);
        }
    }

});
