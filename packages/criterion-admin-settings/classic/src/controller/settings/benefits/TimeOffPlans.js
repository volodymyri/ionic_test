Ext.define('criterion.controller.settings.benefits.TimeOffPlans', function() {

    return {
        alias : 'controller.criterion_employer_time_off_plans',

        extend : 'criterion.controller.employer.GridView',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init : function() {
            this.determineNonAccrualId();
            this.callParent();
        },

        determineNonAccrualId : function() {
            var me = this,
                vm = me.getViewModel();

            criterion.CodeDataManager.getCodeDetailRecordStrict('code', criterion.Consts.ACCRUAL_METHOD_TYPE_CODE.NA, criterion.consts.Dict.ACCRUAL_METHOD_TYPE).then(function(rec) {
                vm.set('nonAccrualId', rec.getId());
            });
        },

        load : function(opts = {}) {
            let mergeOptions = {};

            if (!this.lookupReference('showInactive').getValue()) {
                mergeOptions.params = {
                    isActive : true
                };
            }

            return this.callParent([Ext.apply({}, Ext.merge(opts, mergeOptions))]);
        },

        getEmptyRecord : function() {
            return Ext.apply(this.callParent(arguments), {
                yearEndDate : '01-01',
                fiscalStartDate : new Date(new Date().getFullYear(), 0, 1)
            });
        },

        handleChangeShowInactive : function() {
            this.load();
        },

        onEmployerChange : function() {
            this.load();
        },

        handleSelectionChange : function(col, selections) {
            var me = this,
                vm = me.getViewModel(),
                count = 0,
                nonAccrualId = vm.get('nonAccrualId');
            selections.forEach(function(plan) {
                if (plan.get('accrualMethodTypeCd') !== nonAccrualId) {
                    count++;
                }
            });
            vm.set('disableAccrue', !count);
        },

        getAccrueSelection : function() {
            var me = this,
                view = me.getView(),
                vm = this.getViewModel(),
                nonAccrualId = vm.get('nonAccrualId');
            return Ext.Array.filter(view.getSelection(), function(plan) {
                return plan.get('accrualMethodTypeCd') !== nonAccrualId;
            });
        },

        handleAccrue : function() {
            var picker,
                selectedPlans = Ext.Array.map(this.getAccrueSelection(), function(select) {
                    return select.get('name');
                });

            picker = Ext.create('criterion.ux.form.Panel', {
                viewModel : {},

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],

                bodyPadding : 20,
                modal : true,
                draggable : true,
                title : i18n.gettext('Accrue Plans'),

                items : [
                    {
                        xtype : 'textarea',
                        fieldLabel : i18n.gettext('Plans'),
                        readOnly : true,
                        value : selectedPlans.join(', ')
                    },
                    {
                        xtype : 'datefield',
                        bind : '{accrualDate}',
                        flex : 1,
                        fieldLabel : i18n.gettext('Accrual Date'),
                        allowBlank : false
                    }
                ],

                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',
                        handler : function() {
                            this.up('criterion_form').fireEvent('cancel');
                        },
                        text : i18n.gettext('Cancel')
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        text : i18n.gettext('Accrue'),
                        handler : function() {
                            var view = this.up('criterion_form');

                            if (view.getForm().isValid()) {
                                view.fireEvent('accrue', view.getViewModel().get('accrualDate'));
                            }
                        },
                        disabled : true,
                        bind : {
                            disabled : '{!accrualDate}'
                        }
                    }
                ]
            });

            picker.show();
            picker.on('cancel', function() {
                this.setCorrectMaskZIndex(false);
                picker.destroy();
            }, this);

            picker.on('accrue', function(date) {
                this.setCorrectMaskZIndex(false);
                picker.destroy();
                this.accrue(date);
            }, this);

            this.setCorrectMaskZIndex(true);
        },

        accrue : function(date) {
            var me = this,
                view = this.getView(),
                plans = Ext.Array.map(this.getAccrueSelection(), function(select) {
                    return {
                        id : select.getId(),
                        name : select.get('name')
                    };
                }),
                progress, seq = [];

            progress = criterion.Msg.progress(i18n.gettext('Accrue time off plans'), i18n.gettext('Accrue in progress'), i18n.gettext('Processing...'));

            view.setLoading(true);

            Ext.Array.each(plans, function(plan, index) {
                var value = (index + 1) * 100 / plans.length;

                seq.push(function() {
                    progress.updateProgress(value / 100, i18n.gettext('please wait...'), i18n.gettext('Accruing') + ' ' + plan.name);

                    return criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYER_TIME_OFF_PLANS_ACCRUAL,
                        urlParams : {
                            employeeId : criterion.Api.getEmployeeId()
                        },
                        jsonData : Ext.JSON.encode({
                            accrualDate : Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT),
                            planId : [plan.id]
                        }),
                        method : 'POST'
                    });
                })
            });

            Ext.Deferred.sequence(seq).always(function() {
                me.load();
                view.getSelectionModel().deselectAll();
                progress.progressBar.isVisible() && progress.close();
                view.setLoading(false);
            });
        }

    };

});
