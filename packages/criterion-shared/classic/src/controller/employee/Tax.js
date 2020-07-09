Ext.define('criterion.controller.employee.Tax', function() {

    const API = criterion.consts.Api.API;

    return {

        alias : 'controller.criterion_employee_tax',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.model.employee.Tax',
            'criterion.view.CodeDataPicker',
            'criterion.store.employer.payroll.Settings'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleRecordLoad(record) {
            let view = this.getView(),
                vm = this.getViewModel(),
                filingStatuses = this.getStore('filingStatuses'),
                alternateCalculations = this.getStore('alternateCalculations'),
                employerId = vm.get('employer.id') || vm.get('employerId'),
                payrollSettings = Ext.create('criterion.store.employer.payroll.Settings');

            view.setLoading(true);

            Ext.promise.Promise.all([
                filingStatuses.loadWithPromise({
                    params : {
                        taxid : record.get('taxNumber'),
                        geocode : record.get('geocode')
                    }
                }),
                alternateCalculations.loadWithPromise({
                    params : {
                        taxid : record.get('taxNumber'),
                        geocode : record.get('geocode')
                    }
                }),
                this.getStore('reciprocities').loadWithPromise(),
                payrollSettings.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                })
            ]).then({
                scope : this,
                success : () => {
                    let paySettingsValue = payrollSettings.getAt(0);

                    vm.set({
                        hasFilingStatuses : !!filingStatuses.count(),
                        hasAlternateCalculations : !!alternateCalculations.count(),
                        intrnlTe : paySettingsValue && paySettingsValue.get('taxEngineCode') === criterion.Consts.TAX_ENGINE_CODE.INTRNL_TE
                    });
                }
            }).always(() => {
                view.setLoading(false);
            });

            this.callParent(arguments);
        },

        onTaxMethodSearch(supplMeth, btn) {
            let me = this,
                view = this.getView(),
                record = this.getViewModel().get('record'),
                codeDataRef = btn.up().down('textfield').codeDataRef;

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                url : API.VERTEX_CALC_METHODS_FOR_SUP,
                method : 'GET',
                params : {
                    taxNumber : record.get('taxNumber'),
                    supplMeth : supplMeth,
                    geocode : record.get('geocode')
                }
            }).then({
                success : function(calcMethods) {
                    let editor = Ext.create('criterion.view.CodeDataPicker', {
                        codeDataId : criterion.consts.Dict.TAX_CALC_METHOD,
                        filters : {
                            property : 'code',
                            value : calcMethods.map(function(v) {
                                return v.toString()
                            }),
                            operator : 'in',
                            exactMatch : true
                        }
                    });

                    view.setLoading(false);

                    editor.on('select', function(method) {
                        record.set(codeDataRef, method.getId());
                    });

                    editor.on('close', function() {
                        me.setCorrectMaskZIndex(false);
                    });

                    editor.show();
                    me.setCorrectMaskZIndex(true);
                },
                failure : function() {
                    view.setLoading(false);
                }
            });
        },

        onTaxMethodClear(btn) {
            let record = this.getViewModel().get('record'),
                codeDataRef = btn.up().down('textfield').codeDataRef;

            record.set(codeDataRef, null);
        },

        handleNextClick() {
            if (this.getView().getForm().isValid()) {
                let vm = this.getViewModel(),
                    currentRecordIndex = vm.get('currentRecordIndex'),
                    records = vm.get('records'),
                    nextRecord;

                records[currentRecordIndex] = vm.get('record');

                currentRecordIndex++;
                nextRecord = records[currentRecordIndex];

                vm.set({
                    record : nextRecord,
                    currentRecordIndex : currentRecordIndex
                });

                this.handleRecordLoad(nextRecord);
            }
        },

        handlePrevClick() {
            if (this.getView().getForm().isValid()) {
                let vm = this.getViewModel(),
                    currentRecordIndex = vm.get('currentRecordIndex'),
                    records = vm.get('records'),
                    prevRecord;

                records[currentRecordIndex] = vm.get('record');

                currentRecordIndex--;
                prevRecord = records[currentRecordIndex];

                vm.set({
                    record : prevRecord,
                    currentRecordIndex : currentRecordIndex
                });

                this.handleRecordLoad(prevRecord);
            }
        },

        handleSubmitClick() {
            let view = this.getView();

            if (view.isValid()) {
                this.actSaveRecords();
            }
        },

        actSaveRecords() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                records = vm.get('records'),
                promise;

            view.setLoading(true);

            if (records.length > 1) {
                promise = me.actSaveMultipleRecords(records);
            } else {
                promise = me.actSaveSingleRecord(records[0]);
            }

            promise.then({
                scope : me,
                success : function() {
                    me.fireViewEvent('afterSave');
                    view.close();
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        actSaveMultipleRecords(records) {
            let recordsData = [];

            Ext.Array.each(records, function(record) {
                recordsData.push(record.getData({serialize : true}))
            });

            return criterion.Api.requestWithPromise({
                url : API.EMPLOYEE_TAX,
                jsonData : Ext.JSON.encode(recordsData),
                method : 'POST'
            });
        },

        actSaveSingleRecord(record) {
            return record.saveWithPromise();
        },

        handleCancelClick() {
            let me = this,
                form = me.getView(),
                records = this.getViewModel().get('records'),
                preventReRoute = (arguments.length && Ext.isBoolean(arguments[0])) && arguments[0];

            Ext.Array.each(records, function(record) {
                if (record && !record.phantom) {
                    record.reject();
                }
                form.fireEvent('cancel', form, record);
            });

            form._preventReRoute = preventReRoute;

            if (me.getCloseFormAfterCancel()) {
                me.close();
            }
        },

        handleChangeFilingStatus(cmp, value) {
            let record = this.getViewModel().get('record'),
                selRec = cmp.getSelection();

            if (!selRec || cmp.readOnly || !record.isModel) {
                return;
            }

            if (selRec.get('isW4_2020codes')) {
                record.set({
                    priExemption : null,
                    priExemptionAmount : null
                });
            } else {
                record.set({
                    isMultipleJobs : null,
                    dependents : null,
                    otherIncome : null,
                    deductions : null
                });
            }
        },

        handleExpireTax() {
            let me = this,
                popup = Ext.create({
                    xtype : 'window',
                    title : i18n.gettext('Select Expiration Date'),
                    modal : true,
                    closable : true,
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            modal : true,
                            height : 'auto',
                            width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                        }
                    ],

                    buttons : [
                        {
                            xtype : 'button',
                            text : i18n.gettext('Cancel'),
                            cls : 'criterion-btn-light',
                            listeners : {
                                click : () => {
                                    popup.destroy();
                                }
                            }
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Expire'),
                            cls : 'criterion-btn-primary',
                            listeners : {
                                click : () => {
                                    let datefield = popup.down('[name=date]'),
                                        form = popup.down('form');

                                    if (form.isValid()) {
                                        popup.fireEvent('expire', datefield.getValue());
                                    }
                                }
                            }
                        }
                    ],

                    bodyPadding : 20,

                    items : [
                        {
                            xtype : 'form',
                            reference : 'form',
                            items : [
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Expiration Date'),
                                    name : 'date',
                                    allowBlank : false
                                }
                            ]
                        }
                    ]
                });

            popup.show();

            popup.on({
                expire : date => {
                    popup.destroy();
                    me.applyExpire(date);
                },
                close : () => {
                    me.setCorrectMaskZIndex(false);
                }
            });

            me.setCorrectMaskZIndex(true);
        },

        applyExpire(date) {
            let me = this,
                record = me.getViewModel().get('record'),
                view = me.getView();

            criterion.Api.requestWithPromise({
                url : API.EMPLOYEE_TAX_EXPIRE,
                method : 'POST',
                urlParams : {
                    employeeTaxId : record.getId()
                },
                jsonData : {
                    expirationDate : Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT)
                }
            }).then(() => {
                criterion.Utils.toast(i18n.gettext('Expire date updated.'));
                me.afterExpire(date);
            }).always(() => {
                view.setLoading(false);
            });
        },

        afterExpire(date) {
            this.getViewModel().get('record').set('expirationDate', date);
        }
    };
});