Ext.define('criterion.controller.employer.TimeOffPlan', function() {

    const DICT = criterion.consts.Dict,
        DAYS_OF_WEEK = criterion.Consts.DAYS_OF_WEEK,
        ACCRUAL_PERIOD_CODE = criterion.Consts.ACCRUAL_PERIOD_CODE,
        ACCRUAL_METHOD_TYPE_CODE = criterion.Consts.ACCRUAL_METHOD_TYPE_CODE;

    let getWeekOfYear = function(date) {
        let startDate = new Date(1970, 0, 1),
            daysSinceStartDate = Ext.Date.diff(startDate, date, Ext.Date.DAY),
            // shift since 01/01/1970 is Thursday
            innerShift = function(dateOfWeek) {
                switch (dateOfWeek) {
                    case DAYS_OF_WEEK.Monday :
                        return 3;
                    case DAYS_OF_WEEK.Tuesday :
                        return 2;
                    case DAYS_OF_WEEK.Wednesday :
                        return 1;
                    case DAYS_OF_WEEK.Thursday :
                        return 0;
                    case DAYS_OF_WEEK.Friday :
                        return -1;
                    case DAYS_OF_WEEK.Saturday :
                        return -2;
                    case DAYS_OF_WEEK.Sunday :
                        return -3;
                }
            },
            shift = innerShift(date.getDay() + 1);

        return (daysSinceStartDate + 7 + shift) / 7;
    };

    return {
        
        alias : 'controller.criterion_employer_time_off_plan',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.ux.form.Panel',
            'criterion.store.employer.timeOffPlan.Types',
            'criterion.view.employer.AccrueTimeOffPlan',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.view.MultiRecordPicker'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        onAccrualPeriodChange : function(field, value) {
            if (!value) {
                return
            }

            let days = this.lookupReference('startMonthDay').getStore(),
                accrualPeriods = field.getStore(),
                selectedPeriod = accrualPeriods.getById(value),
                code = selectedPeriod.get('code');

            days.clearFilter(true);
            days.filterBy(function(record) {
                if (code === ACCRUAL_PERIOD_CODE.SEMI_MONTHLY) {
                    return record.get('day') <= 13;
                }

                return record.get('day') <= 28;
            });

            this.filterYearEndDate();
        },

        onAccrualMethodChange : function() {
            this.filterYearEndDate();
        },

        onMonthChange : function() {
            this.filterYearEndDate();
        },

        onYearChange : function() {
            this.filterYearEndDate();
        },

        onStartDayChange : function() {
            this.filterYearEndDate();
        },

        onOddWeekChange : function() {
            this.filterYearEndDate();
        },

        filterYearEndDate : function() {
            let me = this,
                yearEndDate = me.lookupReference('yearEndDate'),
                yearEndDates = yearEndDate.getStore(),
                yearEndYearValue = me.lookupReference('yearEndYear').getValue(),
                yearEndMonthValue = parseInt(me.lookupReference('yearEndMonth').getValue()),
                startDayOfWeek = me.lookupReference('startDayOfWeek').getValue(),
                isOddWeekValue = me.lookupReference('isOddWeek').getValue(),
                accrualPeriodCode = me.lookupReference('accrualPeriod').getValue(),
                accrualPeriodValue = criterion.CodeDataManager.getValue(accrualPeriodCode, DICT.ACCRUAL_PERIOD, 'code'),
                accrualMethodCode = me.lookupReference('accrualMethod').getValue(),
                accrualMethodValue = criterion.CodeDataManager.getValue(accrualMethodCode, DICT.ACCRUAL_METHOD_TYPE, 'code');

            yearEndDates.clearFilter(true);

            if (
                accrualMethodValue !== ACCRUAL_METHOD_TYPE_CODE.FISCAL ||
                (
                    accrualPeriodValue !== ACCRUAL_PERIOD_CODE.WEEKLY &&
                    accrualPeriodValue !== ACCRUAL_PERIOD_CODE.BI_WEEKLY
                ) ||
                yearEndYearValue == null
            ) {
                return;
            }

            let selectedValue = +yearEndDate.getValue(),
                startDayOfWeekShifted = (startDayOfWeek === DAYS_OF_WEEK.Sunday ? DAYS_OF_WEEK.Saturday : startDayOfWeek - 1),
                selectedDate = new Date(yearEndYearValue, yearEndMonthValue - 1, selectedValue),
                selectedDateInOddWeek = getWeekOfYear(selectedDate) % 2 !== 0;

            if (accrualPeriodValue === ACCRUAL_PERIOD_CODE.WEEKLY) {
                yearEndDates.filterBy(function(record) {
                    let month = yearEndMonthValue - 1,
                        date = new Date(yearEndYearValue, month, parseInt(record.get('day')));
                    return date.getMonth() === month && date.getDay() === startDayOfWeekShifted - 1;
                });

                if (selectedDate.getDay() !== startDayOfWeekShifted - 1) {
                    yearEndDate.setValue('');
                }

                return;
            }

            if (accrualPeriodValue === ACCRUAL_PERIOD_CODE.BI_WEEKLY) {
                yearEndDates.filterBy(function(record) {
                    let month = yearEndMonthValue - 1,
                        date = new Date(yearEndYearValue, month, parseInt(record.get('day'))),
                        dateInOddWeek = getWeekOfYear(
                            Ext.Date.add(
                                Ext.Date.add(date, Ext.Date.HOUR, 1), // correction for Daylight Saving Time (DST)
                                Ext.Date.DAY,
                                13
                            )
                        ) % 2 !== 0;

                    return date.getMonth() === month && dateInOddWeek === isOddWeekValue && date.getDay() === startDayOfWeekShifted - 1;
                });

                if (
                    selectedDateInOddWeek !== isOddWeekValue ||
                    selectedDate.getDay() !== startDayOfWeekShifted - 1
                ) {
                    yearEndDate.setValue('');
                }
            }

        },

        handleRecordLoad : function(record) {
            let view = this.getView(),
                timeOffTypes = this.getStore('timeOffPlanTypes');

            if (!record.phantom) {
                view.setLoading(true);
                timeOffTypes.load({
                    scope : this,
                    params : {
                        timeOffPlanId : record.get('id')
                    },
                    callback : function() {
                        this.initTimeOffPlans();
                        view.setLoading(false);
                    }
                });
            }
        },

        initTimeOffPlans : function() {
            let values = [],
                timeOffTypesCombo = this.lookupReference('timeOffTypesCombo');

            this.getStore('timeOffPlanTypes').each(function(record) {
                values.push(record.get('timeOffTypeCd'));
            });

            timeOffTypesCombo.setValue(values);
            timeOffTypesCombo.initValue();
        },

        syncTimeOffTypes : function() {
            let values = this.lookupReference('timeOffTypesCombo').getValue(),
                store = this.getStore('timeOffPlanTypes'),
                toRemove = [];

            store.each(function(record) {
                if (!Ext.Array.contains(values, record.get('timeOffTypeCd'))) {
                    toRemove.push(record);
                }
            });

            for (let i = 0; i < values.length; i++) {
                if (!store.findRecord('timeOffTypeCd', values[i], 0, false, false, true)) {
                    store.add({
                        timeOffTypeCd : values[i],
                        timeOffPlanId : this.getViewModel().get('record').getId()
                    })
                }
            }

            store.remove(toRemove);

            return store.syncWithPromise()
        },

        handleRecordUpdate : function() {
            let me = this,
                view = me.getView(),
                record = this.getViewModel().get('record');

            view.setLoading(true);

            this.doSave()
                .then({
                    scope : this,
                    success : function() {
                        me.onAfterSave.call(me, view, record);
                    }
                })
                .always(function() {
                    view.setLoading(false);
                })
        },

        doSave : function() {
            let record = this.getViewModel().get('record'),
                me = this,
                accrualPeriod = this.lookup('accrualPeriod'),
                accrualMethodCode = me.lookup('accrualMethod').getValue(),
                accrualMethodValue = criterion.CodeDataManager.getValue(accrualMethodCode, DICT.ACCRUAL_METHOD_TYPE, 'code');

            if (accrualMethodValue === ACCRUAL_METHOD_TYPE_CODE.NA) {
                let annuallyCd = criterion.CodeDataManager.getCodeDetailRecord('code', 'A', criterion.consts.Dict.ACCRUAL_PERIOD);

                accrualPeriod.setValue(annuallyCd ? annuallyCd.getId() : null);
            }

            return Ext.Deferred.sequence([
                function() {
                    return record.saveWithPromise()
                },
                function() {
                    return me.syncTimeOffTypes()
                }
            ])
        },

        handleIncomeSearch : function() {
            let me = this,
                vm = this.getViewModel(),
                selectedRecords = [],
                incomeListId = vm.get('record.incomeListId'),
                incomeSelector;

            if (incomeListId) {
                selectedRecords.push(incomeListId);
            }

            incomeSelector = Ext.create('criterion.view.MultiRecordPicker', {
                mode : 'SINGLE',
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Incomes'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'description',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'numbercolumn',
                                renderer : criterion.LocalizationManager.currencyFormatter,
                                text : i18n.gettext('Rate'),
                                dataIndex : 'rate',
                                flex : 1,
                                filter : 'string'
                            }
                        ],
                        storeParams : {
                            employerId : vm.get('record.employerId'),
                            isActive : true
                        },
                        selectedRecords : selectedRecords
                    },
                    stores : {
                        inputStore : Ext.create('criterion.store.employer.IncomeLists', {
                            autoSync : false
                        })
                    }
                },
                allowEmptySelect : true
            });

            incomeSelector.on('selectRecords', this.selectIncome, this);
            incomeSelector.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            incomeSelector.show();

            me.setCorrectMaskZIndex(true);
        },

        selectIncome : function(records) {
            let vm = this.getViewModel(),
                rec = records[0];

            if (rec) {
                vm.set('record.incomeListId', rec.getId());
                vm.set('record.incomeCode', rec.get('code'));
            }
        },

        handleShowFormulasForm() {
            let me = this,
                vm = this.getViewModel(),
                formulasPopup;

            formulasPopup = Ext.create('criterion.ux.form.Panel', {
                title : i18n.gettext('Formulas'),
                modal : true,
                draggable : true,
                cls : 'criterion-modal',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 'auto',
                        modal : true
                    }
                ],

                viewModel : {
                    data : {
                        expCalcEligibility : vm.get('record.expCalcEligibility'),
                        expCalcEffectiveDate : vm.get('record.expCalcEffectiveDate'),
                        expWaitingPeriod : vm.get('record.expWaitingPeriod')
                    }
                },

                bodyPadding : 20,

                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Eligibility'),
                        bind : '{expCalcEligibility}',
                        name : 'expCalcEligibility'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Effective Date'),
                        bind : '{expCalcEffectiveDate}',
                        name : 'expCalcEffectiveDate'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Waiting Period'),
                        bind : '{expWaitingPeriod}',
                        name : 'expWaitingPeriod'
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
                        handler : function() {
                            let form = this.up('criterion_form'),
                                formVm = form.getViewModel();

                            form.fireEvent('change', {
                                expCalcEligibility : formVm.get('expCalcEligibility'),
                                expCalcEffectiveDate : formVm.get('expCalcEffectiveDate'),
                                expWaitingPeriod : formVm.get('expWaitingPeriod')
                            });
                        },
                        text : i18n.gettext('Change')
                    }
                ]
            });

            formulasPopup.show();
            formulasPopup.focusFirstField();
            me.setCorrectMaskZIndex(true);

            formulasPopup.on('cancel', function() {
                formulasPopup.destroy();
                me.setCorrectMaskZIndex(false);
            });
            formulasPopup.on('change', function(data) {
                vm.get('record').set(Ext.clone(data));

                me.setCorrectMaskZIndex(false);
                formulasPopup.destroy();
            });
        }
    };

});
