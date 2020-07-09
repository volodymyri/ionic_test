Ext.define('criterion.controller.settings.system.overtime.OvertimeRule', function() {

    return {
        
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_system_overtime_rule',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleShowSettingsForm() {
            let me = this,
                vm = this.getViewModel(),
                settingsPopup;

            settingsPopup = Ext.create('criterion.ux.form.Panel', {
                title : i18n._('Shift Splits and Meal Breaks'),
                modal : true,
                draggable : true,
                cls : 'criterion-modal',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                        height : 'auto',
                        modal : true
                    }
                ],

                viewModel : {
                    data : {
                        expCalcMealPeriod : vm.get('record.expCalcMealPeriod'),
                        expCalcShiftSplit : vm.get('record.expCalcShiftSplit'),
                        expCalcShiftSpread : vm.get('record.expCalcShiftSpread'),

                        isMealPeriod : vm.get('record.isMealPeriod'),
                        isShiftSplit : vm.get('record.isShiftSplit'),
                        isShiftSpread : vm.get('record.isShiftSpread')
                    }
                },

                bodyPadding : 20,

                defaults : {
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH
                },

                items : [
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n._('Meal Period'),
                        bind : {
                            value : '{isMealPeriod}'
                        },
                        name : 'isMealPeriod'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n._('Meal Period Formula'),
                        allowBlank : false,
                        disabled : true,
                        bind : {
                            value : '{expCalcMealPeriod}',
                            disabled : '{!isMealPeriod}'
                        },
                        name : 'expCalcMealPeriod'
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n._('Shift Split'),
                        bind : {
                            value : '{isShiftSplit}'
                        },
                        name : 'isShiftSplit'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n._('Shift Split Formula'),
                        allowBlank : false,
                        disabled : true,
                        bind : {
                            value : '{expCalcShiftSplit}',
                            disabled : '{!isShiftSplit}'
                        },
                        name : 'expCalcShiftSplit'
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n._('Shift Spread'),
                        bind : {
                            value : '{isShiftSpread}'
                        },
                        name : 'isShiftSpread'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n._('Shift Spread Formula'),
                        allowBlank : false,
                        disabled : true,
                        bind : {
                            value : '{expCalcShiftSpread}',
                            disabled : '{!isShiftSpread}'
                        },
                        name : 'expCalcShiftSpread'
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
                        text : i18n._('Cancel')
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        handler : function() {
                            let form = this.up('criterion_form'),
                                formVm = form.getViewModel();

                            if (form.isValid()) {
                                form.fireEvent('change', {
                                    expCalcMealPeriod : formVm.get('expCalcMealPeriod'),
                                    expCalcShiftSplit : formVm.get('expCalcShiftSplit'),
                                    expCalcShiftSpread : formVm.get('expCalcShiftSpread'),

                                    isMealPeriod : formVm.get('isMealPeriod'),
                                    isShiftSplit : formVm.get('isShiftSplit'),
                                    isShiftSpread : formVm.get('isShiftSpread')
                                });
                            }
                        },
                        text : i18n._('Change')
                    }
                ]
            });

            settingsPopup.show();
            settingsPopup.focusFirstField();
            me.setCorrectMaskZIndex(true);

            settingsPopup.on({
                cancel : () => {
                    settingsPopup.destroy();
                    me.setCorrectMaskZIndex(false);
                },
                change : data => {
                    vm.get('record').set(Ext.clone(data));

                    me.setCorrectMaskZIndex(false);
                    settingsPopup.destroy();
                }
            });
        },

        handleRecordLoad : function(record) {
            let me = this,
                vm = this.getViewModel(),
                incomeLists = vm.getStore('incomeLists'),
                overtimeSequence = vm.getStore('overtimeSequence');

            Ext.promise.Promise.all([
                incomeLists.loadWithPromise({
                    params : {
                        employerId : record.get('employerId')
                    }
                })
            ]).then(() => {
                me.lookup('employeeGroupCombo').loadValuesForRecord(record);

                if (!record.phantom) {
                    overtimeSequence.getProxy().setExtraParam('overtimeId', record.getId());
                    overtimeSequence.load();
                }
            });
        },

        handleSubmitClick : function() {
            let vm = this.getViewModel(),
                view = this.getView();

            if (view.isValid()) {
                vm.set('blockedState', true);
            }

            this.callParent(arguments);
        },

        onAfterSave : function(view, record) {
            let me = this,
                vm = me.getViewModel(),
                overtimeSequence = vm.getStore('overtimeSequence'),
                promise,
                overtimeId = record.getId();

            if (overtimeSequence.getModifiedRecords().length || overtimeSequence.getRemovedRecords().length) {
                overtimeSequence.each(rec => {
                    rec.set('overtimeId', overtimeId)
                });

                promise = overtimeSequence.syncWithPromise();
            } else {
                let dfd = Ext.create('Ext.promise.Deferred');

                promise = dfd.promise;

                dfd.resolve();
            }

            Ext.promise.Promise.all(
                [
                    promise,
                    this.lookup('employeeGroupCombo').saveValuesForRecord(record)
                ]
            ).then(() => {
                vm.set('blockedState', false);
                view.fireEvent('afterSave', view, record);
                me.close();
            }).otherwise(() => {
                vm.set('blockedState', false);
            });
        },

        onFailureSave : function(record, operation) {
            this.getViewModel().set('blockedState', false);
        }
    }
});
