Ext.define('criterion.controller.settings.payroll.CertifiedRate', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_payroll_settings_certified_rate',

        requires : [
            'criterion.store.employer.payroll.Schedules',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleRecordLoad : function(record) {
            var vm = this.getViewModel(),
                view = this.getView(),
                employerId = record.get('employerId');

            view.setLoading(true);

            Ext.promise.Promise.all([
                vm.getStore('employerPositions').loadWithPromise({params : {employerId : employerId}}),
                vm.getStore('certifiedRateDeductions').loadWithPromise({params : {employerId : employerId}}),
                vm.getStore('incomes').loadWithPromise({params : {employerId : employerId}})
            ]).always(function() {
                view.setLoading(false);
            });
        },

        onFirstPayrollSelectClick : function() {
            this._selectPayrollPeriod('firstPayrollPeriod', 'firstPayrollPeriodId')
        },

        onFinalPayrollSelectClick : function() {
            this._selectPayrollPeriod('finalPayrollPeriod', 'finalPayrollPeriodId')
        },

        onFirstPayrollClear : function() {
            this.getViewModel().get('record').set({
                firstPayrollPeriodId : null,
                firstPayrollPeriodStartDate : null,
                firstPayrollPeriodEndDate : null
            });

            this.getViewModel().notify();
        },

        onFinalPayrollClear : function() {
            this.getViewModel().get('record').set({
                finalPayrollPeriodId : null,
                finalPayrollPeriodStartDate : null,
                finalPayrollPeriodEndDate : null
            });
        },

        _selectPayrollPeriod : function(periodType, fieldName) {
            var me = this,
                record = this.getViewModel().get('record'),
                schedulesStore = Ext.create('criterion.store.employer.payroll.Schedules'),
                payrollPeriodsStore = Ext.create('criterion.store.employer.payroll.payrollSchedule.PayrollPeriods'),
                currentPeriodId = record.get(fieldName),
                currentPeriodRecord = null,
                currentScheduleId = null;

            Ext.promise.Promise.all([
                schedulesStore.loadWithPromise({
                    params : {
                        employerId : record.get('employerId')
                    }
                }),
                payrollPeriodsStore.loadWithPromise()
            ]).then(function() {
                if (currentPeriodId) {
                    currentPeriodRecord = payrollPeriodsStore.getById(currentPeriodId);
                    if (currentPeriodId) {
                        currentScheduleId = schedulesStore.getById(currentPeriodRecord.get('payrollScheduleId'));
                    }
                }

                let wnd = Ext.create('criterion.ux.window.Window', {
                    title : i18n.gettext('Select Payroll Period'),
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    bodyPadding : 10,
                    modal : true,
                    plugins : {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 'auto',
                        modal : true
                    },
                    viewModel : {
                        data : {
                            payrollScheduleId : currentScheduleId,
                            payrollPeriod : currentPeriodRecord
                        }
                    },

                    items : [
                        {
                            xtype : 'combo',
                            fieldLabel : i18n.gettext('Payroll Schedule'),
                            store : schedulesStore,
                            bind : {
                                value : '{payrollScheduleId}'
                            },
                            valueField : 'id',
                            displayField : 'name',
                            queryMode : 'local',
                            editable : false,
                            allowBlank : false,
                            listeners : {
                                change : function(cmp, value) {
                                    payrollPeriodsStore.clearFilter();

                                    if (value) {
                                        payrollPeriodsStore.addFilter(
                                            {
                                                property : 'payrollScheduleId',
                                                value : value
                                            }
                                        );
                                    }
                                }
                            }
                        },
                        {
                            xtype : 'combo',
                            fieldLabel : i18n.gettext('Payroll Period'),
                            store : payrollPeriodsStore,
                            bind : {
                                disabled : '{!payrollScheduleId}',
                                selection : '{payrollPeriod}'
                            },
                            displayField : 'name',
                            valueField : 'id',
                            editable : false,
                            allowBlank : false,
                            forceSelection : false,
                            queryMode : 'local',
                            tpl : Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<tpl if="periodStartDate">',
                                '<div class="x-boundlist-item">{periodStartDate:date} to {periodEndDate:date}</div>',
                                '<tpl else>',
                                '<div class="x-boundlist-item"></div>',
                                '</tpl>',
                                '</tpl>'
                            ),
                            displayTpl : Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<tpl if="periodStartDate">',
                                '{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}',
                                '</tpl>',
                                '</tpl>'
                            )
                        }
                    ],

                    bbar : [
                        '->',
                        {
                            xtype : 'button',
                            text : i18n.gettext('Cancel'),
                            cls : 'criterion-btn-light',
                            listeners : {
                                click : function() {
                                    me.setCorrectMaskZIndex(false);

                                    wnd.close();
                                }
                            }
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Save'),
                            cls : 'criterion-btn-primary',
                            bind : {
                                disabled : '{!payrollPeriod}'
                            },
                            listeners : {
                                click : function() {
                                    var selectedPeriod = wnd.getViewModel().get('payrollPeriod'),
                                        newValues = {};

                                    newValues[fieldName] = selectedPeriod.getId();
                                    newValues[periodType + 'StartDate'] = selectedPeriod.get('periodStartDate');
                                    newValues[periodType + 'EndDate'] = selectedPeriod.get('periodEndDate');

                                    record.set(newValues);

                                    me.setCorrectMaskZIndex(false);
                                    wnd.close();
                                }
                            }
                        }
                    ]
                });

                wnd.show();

                me.setCorrectMaskZIndex(true);
            });
        },

        handleSubmitClick : function() {
            if (!this.checkDetails(this.getRecord())) {
                return;
            }

            this.callParent(arguments);
        },

        checkDetails : function(record) {
            var positions = [],
                duplicatesCodes = [],
                BASE = criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE.BASE.value;

            record.details().each(function(detail) {
                var code = detail.get('positionCode');

                if (detail.get('rateType') === BASE) {
                    if (!Ext.Array.contains(positions, code)) {
                        positions.push(code);
                    } else {
                        duplicatesCodes.push(code)
                    }
                }
            });

            if (duplicatesCodes.length) {
                criterion.Msg.warning(i18n.gettext('You can enter or import only one row with type Base, for a position code: <br>' + duplicatesCodes.join(', ')));
                return false;
            }

            return true;
        }
    };
});
