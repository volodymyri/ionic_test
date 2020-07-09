Ext.define('criterion.controller.settings.benefits.benefit.RatesGrid', function() {

    return {
        alias : 'controller.criterion_settings_benefit_rates_grid',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.view.settings.benefits.benefit.AddRatesForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        listen : {
            global : {
                employerChanged : 'handleEmployerChanged'
            }
        },

        loadRecordOnEdit : false,

        confirmDelete : false,

        load : function(plan) {
            var store = this.getView().getStore(),
                effectiveDateCombo = this.lookupReference('effectiveDateCombo'),
                effectiveDateStore = effectiveDateCombo.getStore();

            effectiveDateStore.removeAll();
            store.loadWithPromise({
                params : {
                    benefitPlanId : plan.getId()
                }
            }).then(function() {
                store.each(function(rate) {
                    var effectiveDate = rate.get('effectiveDate');
                    !effectiveDateStore.findRecord('value', effectiveDate) && effectiveDateStore.add({
                        text : Ext.Date.format(effectiveDate, criterion.consts.Api.DATE_FORMAT_US),
                        value : effectiveDate
                    });
                });
                !effectiveDateCombo.selection && effectiveDateCombo.setSelection(effectiveDateStore.getAt(0));
            });
        },

        getEmptyRecord : function() {
            var effectiveDateCombo = this.lookupReference('effectiveDateCombo'),
                plan = this.getViewModel().get('plan');

            return {
                benefitPlanId : plan.getId(),
                effectiveDate : effectiveDateCombo.getValue()
            };
        },

        handleEffectiveDateComboChange : function(combo, newVal) {
            if (!newVal) {
                return;
            }
            var store = this.getView().getStore(),
                plan = this.getViewModel().get('plan');

            store.clearFilter(true);
            store.addFilter({
                property : 'effectiveDate',
                value : newVal
            });
        },

        handleAddRates : function() {
            var me = this,
                ratesForm = Ext.create('criterion.view.settings.benefits.benefit.AddRatesForm'),
                effectiveDateCombo = this.lookupReference('effectiveDateCombo'),
                store = this.getView().getStore(),
                plan = this.getViewModel().get('plan');

            ratesForm.show();

            ratesForm.on('close', function() {
                me.setCorrectMaskZIndex(false);
                ratesForm.destroy();
            });

            ratesForm.on('create', function(effectiveDate) {
                var effectiveDateStore = effectiveDateCombo.getStore(),
                    selectedDate = effectiveDateStore.findRecord('value', effectiveDate),
                    previousDate;

                if (!selectedDate) {
                    Ext.Array.each(effectiveDateStore.getRange(), function(date) {
                        if (date.get('value') < effectiveDate) {
                            previousDate = date.get('value');
                            return false;
                        }
                    }, null, true);

                    selectedDate = effectiveDateStore.add({
                        text : Ext.Date.format(effectiveDate, criterion.consts.Api.DATE_FORMAT_US),
                        value : effectiveDate
                    })[0];
                }

                if (previousDate) {
                    store.clearFilter(true);
                    store.addFilter({
                        property : 'effectiveDate',
                        value : previousDate
                    });
                    store.each(function(rate) {
                        store.add(Ext.create('criterion.model.employer.benefit.Rate', Ext.Object.merge(rate.getData(), {
                            id : undefined,
                            effectiveDate : effectiveDate
                        })));
                    });
                }

                effectiveDateCombo.select(selectedDate);

                ratesForm.destroy();
            });

            me.setCorrectMaskZIndex(true);
        },

        handleDeleteRates : function() {
            var effectiveDateCombo = this.lookupReference('effectiveDateCombo'),
                effectiveDateStore = effectiveDateCombo.getStore(),
                view = this.getView(),
                store = view.getStore(),
                form = this.getView().up('form');

            criterion.Msg.confirm(
                i18n.gettext('Delete Rates'),
                Ext.String.format(
                    i18n.gettext('Rates with Effective Date {0} will be deleted. Are you sure?'),
                    Ext.Date.format(effectiveDateCombo.getValue(), criterion.consts.Api.DATE_FORMAT_US)
                ),
                function(btn) {
                    if (btn == 'yes') {
                        Ext.Array.each(store.getRange(), function(rate) {
                            store.remove(rate);
                        });

                        effectiveDateCombo.selection.erase();

                        if (effectiveDateStore.count()) {
                            effectiveDateCombo.select(effectiveDateStore.getAt(0));
                        } else {
                            effectiveDateCombo.clearValue();
                        }
                    }
                }
            )
        },

        handleEmployerChanged : function(employer) {
            this.getViewModel().set('ratePrecision', employer ? employer.get('ratePrecision') : Ext.util.Format.currencyPrecision);
        },

        handleDownloadTemplate : function(cmp) {
            var view = this.getView(),
                formView = view.up('criterion_settings_benefit_plan_form'),
                formViewVm = formView.getViewModel(),
                plan = formViewVm.get('plan'),
                url;

            url = Ext.String.format(
                criterion.consts.Api.API.BENEFITS_RATES_IMPORT_TEMPLATE_DOWNLOAD,
                true
            );

            window.open(
                criterion.Api.getSecureResourceUrl(
                    Ext.String.format(url, plan.get('employerId'))
                ), '_blank');
        },

        handleFileUpload : function(cmp, e) {
            if (!e.target.files || !e.target.files.length) {
                return
            }

            var view = this.getView(),
                vm = view.getViewModel(),
                formView = view.up('criterion_settings_benefit_plan_form'),
                selectedEffectiveDate = vm.get('effectiveDateCombo.selection'),
                rates = view.getStore(),
                record = vm.get('plan');

            formView.setLoading(true);

            criterion.Api.submitFakeForm([
                    {
                        name : 'employerId',
                        value : record.get('employerId')
                    },
                    {
                        name : 'planId',
                        value : record.getId()
                    },
                    {
                        name : 'effectiveDate',
                        value : Ext.Date.format(selectedEffectiveDate.get('value'), criterion.consts.Api.DATE_FORMAT)
                    }
                ],
                {
                    url : criterion.consts.Api.API.BENEFITS_RATES_IMPORT_GENERATE,
                    extraData : {
                        benefitsRatesFile : e.target.files[0]
                    },

                    success : function(details) {
                        formView.setLoading(false);
                        cmp.reset();

                        details && Ext.isArray(details) && Ext.Array.forEach(details, function(detail) {
                            delete detail.id;

                            var rate = rates.add({})[0];

                            rate.set(detail); // mark grid cells as dirty
                        });
                    },
                    failure : function() {
                        formView.setLoading(false);
                        cmp.reset();
                    }
                });
        }
    };

});
