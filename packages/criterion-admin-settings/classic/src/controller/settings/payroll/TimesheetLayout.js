Ext.define('criterion.controller.settings.payroll.TimesheetLayout', function() {

    const DICT = criterion.consts.Dict,
        INCOME_CALC_METHOD = criterion.Consts.INCOME_CALC_METHOD,
        CUSTOMIZABLE_ENTITIES = criterion.Consts.getCustomizableEntities();

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_timesheet_layout',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        config : {
            externalUpdate : false
        },

        init : function() {
            let codeDataStore = criterion.CodeDataManager.getStore(DICT.INCOME_CALC_METHOD);

            if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                criterion.CodeDataManager.load([
                    DICT.INCOME_CALC_METHOD
                ]);
            }
        },

        handleRecordLoad : function() {
            let customdata = this.getViewModel().getStore('customdata');

            if (!customdata.isLoaded() && !customdata.isLoading()) {
                let typeCd = criterion.CodeDataManager.getCodeDetailRecord('code', CUSTOMIZABLE_ENTITIES.CUSTOMIZABLE_ENTITY_TIMESHEET_DETAIL.code, DICT.ENTITY_TYPE).getId();

                customdata.load({
                    params : {
                        entityTypeCd : typeCd,
                        showHidden : false
                    }
                })
            }

            this.callParent(arguments);
        },

        handleAfterRecordLoad : function(record) {
            this.callParent(arguments);
            this.lookupReference('employeeGroupCombo').loadValuesForRecord(record);
        },

        onAfterSave : function(view, record) {
            let me = this,
                details = record.details(),
                promises = [];

            details.getRemovedRecords().map(function(rec) {
                promises.push(rec.eraseWithPromise());
            });

            view.setLoading(true);

            promises.push(this.lookupReference('employeeGroupCombo').saveValuesForRecord(record));
            Ext.promise.Promise.all(promises).then(function() {
                view.fireEvent('afterSave', view, record);
                criterion.Utils.toast(i18n.gettext('Successfully saved.'));
                view.setLoading(false);
                me.close();
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleIncomeSearch : function() {
            let me = this,
                vm = this.getViewModel(),
                selectedRecords = [],
                incomeListId = vm.get('record.incomeListId'),
                incomeSelector, calcMethods;

            if (incomeListId) {
                selectedRecords.push(incomeListId);
            }

            calcMethods = [
                criterion.CodeDataManager.getCodeDetailRecord('code', INCOME_CALC_METHOD.HOURLY, DICT.INCOME_CALC_METHOD).getId(),
                criterion.CodeDataManager.getCodeDetailRecord('code', INCOME_CALC_METHOD.SALARY, DICT.INCOME_CALC_METHOD).getId()
            ];

            incomeSelector = Ext.create('criterion.view.MultiRecordPicker', {
                mode : 'SINGLE',

                alwaysOnTop : true,
                modal : true,

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
                            isActive : true,
                            incomeCalcMethodCd : calcMethods
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

        handleShowSettingsForm : function() {
            let me = this,
                vm = this.getViewModel(),
                settingsPopup;

            settingsPopup = Ext.create('criterion.ux.form.Panel', {
                title : i18n.gettext('Text Labels / Label Enable'),
                modal : true,
                draggable : true,
                cls : 'criterion-modal',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        height : 'auto',
                        modal : true
                    }
                ],

                viewModel : {
                    data : {
                        description : vm.get('record.description'),
                        labelAssignment : vm.get('record.labelAssignment'),
                        labelWorkLocation : vm.get('record.labelWorkLocation'),
                        labelWorkArea : vm.get('record.labelWorkArea'),
                        labelTask : vm.get('record.labelTask'),
                        labelProject : vm.get('record.labelProject'),
                        isShowAssignment : vm.get('record.isShowAssignment'),
                        isShowWorkLocation : vm.get('record.isShowWorkLocation'),
                        isShowWorkArea : vm.get('record.isShowWorkArea'),
                        isShowTasks : vm.get('record.isShowTasks'),
                        isShowProject : vm.get('record.isShowProject')
                    }
                },

                layout : 'hbox',
                bodyPadding : 20,

                items : [
                    {
                        xtype : 'criterion_panel',
                        margin : '0 40 0 0',
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                        },
                        flex : 1,
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Assignment Label'),
                                bind : '{labelAssignment}',
                                name : 'labelAssignment'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Work Location Label'),
                                bind : '{labelWorkLocation}',
                                name : 'labelWorkLocation'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Work Area Label'),
                                bind : '{labelWorkArea}',
                                name : 'labelWorkArea'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Task Label'),
                                bind : '{labelTask}',
                                name : 'labelTask'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Project Label'),
                                bind : '{labelProject}',
                                name : 'labelProject'
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_panel',
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                        },
                        flex : 1,
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Assignments'),
                                bind : {
                                    value : '{isShowAssignment}'
                                },
                                name : 'isShowAssignment'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Work Locations'),
                                bind : {
                                    value : '{isShowWorkLocation}'
                                },
                                name : 'isShowWorkLocation'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Work Areas'),
                                bind : {
                                    value : '{isShowWorkArea}'
                                },
                                name : 'isShowWorkArea'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Tasks'),
                                bind : {
                                    value : '{isShowTasks}'
                                },
                                name : 'isShowTasks'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Project'),
                                bind : {
                                    value : '{isShowProject}'
                                },
                                name : 'isShowProject'
                            }
                        ]
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
                                description : formVm.get('description'),
                                labelAssignment : formVm.get('labelAssignment'),
                                labelWorkLocation : formVm.get('labelWorkLocation'),
                                labelWorkArea : formVm.get('labelWorkArea'),
                                labelTask : formVm.get('labelTask'),
                                labelProject : formVm.get('labelProject'),

                                isShowAssignment : formVm.get('isShowAssignment'),
                                isShowWorkLocation : formVm.get('isShowWorkLocation'),
                                isShowWorkArea : formVm.get('isShowWorkArea'),
                                isShowTasks : formVm.get('isShowTasks'),
                                isShowProject : formVm.get('isShowProject')
                            });
                        },
                        text : i18n.gettext('Change')
                    }
                ]
            });

            settingsPopup.show();
            settingsPopup.focusFirstField();
            me.setCorrectMaskZIndex(true);

            settingsPopup.on('cancel', function() {
                settingsPopup.destroy();
                me.setCorrectMaskZIndex(false);
            });
            settingsPopup.on('change', function(data) {
                vm.get('record').set(Ext.clone(data));

                me.setCorrectMaskZIndex(false);
                settingsPopup.destroy();
            });
        },

        handleShowAlertForm() {
            let me = this,
                vm = this.getViewModel(),
                alertsPopup;

            alertsPopup = Ext.create('criterion.ux.form.Panel', {
                title : i18n.gettext('Timesheet Alerts'),
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
                        alertDay : vm.get('record.alertDay'),
                        alertWeek : vm.get('record.alertWeek')
                    }
                },

                bodyPadding : 20,

                items : [
                    {
                        xtype : 'numberfield',
                        fieldLabel : i18n.gettext('Daily Alert'),
                        bind : '{alertDay}',
                        name : 'alertDay',
                        minValue : 0
                    },
                    {
                        xtype : 'numberfield',
                        fieldLabel : i18n.gettext('Weekly Alert'),
                        bind : '{alertWeek}',
                        name : 'alertWeek',
                        minValue : 0
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
                                alertDay : formVm.get('alertDay'),
                                alertWeek : formVm.get('alertWeek')
                            });
                        },
                        text : i18n.gettext('Change')
                    }
                ]
            });

            alertsPopup.show();
            alertsPopup.focusFirstField();
            me.setCorrectMaskZIndex(true);

            alertsPopup.on('cancel', function() {
                alertsPopup.destroy();
                me.setCorrectMaskZIndex(false);
            });
            alertsPopup.on('change', function(data) {
                vm.get('record').set(Ext.clone(data));

                me.setCorrectMaskZIndex(false);
                alertsPopup.destroy();
            });
        },

        selectIncome : function(records) {
            let vm = this.getViewModel(),
                rec = records[0];

            if (rec) {
                vm.set('record.incomeListId', rec.getId());
                vm.set('record.incomeCode', rec.get('code'));
            }
        },

        handleChangeFrequency : function(cmp, selectedFrequencyCdValue) {
            let startDayOfMonth = this.lookupReference('startDayOfMonth'),
                codeDataRecord = selectedFrequencyCdValue && criterion.CodeDataManager.getCodeDetailRecord('id', selectedFrequencyCdValue, DICT.PAY_FREQUENCY);

            if (codeDataRecord && codeDataRecord.get('code') === criterion.Consts.PAY_FREQUENCY_CODE.SEMI_MONTHLY && startDayOfMonth.getValue() > 13) {
                startDayOfMonth.setValue(null);
            }
        }
    };
});
