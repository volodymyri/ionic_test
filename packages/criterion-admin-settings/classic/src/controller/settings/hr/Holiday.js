Ext.define('criterion.controller.settings.hr.Holiday', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_holiday',

        requires : [
            'criterion.view.MultiRecordPicker',
            'criterion.ux.form.CloneForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        loadRecord(record) {
            let me = this,
                promises = [],
                employeeGroupCombo = this.lookup('employeeGroupCombo');

            promises.push(employeeGroupCombo.loadValuesForRecord(record));

            Ext.promise.Promise.all(promises).then({
                scope : this,
                success : function() {
                    if (!me.checkViewIsActive()) {
                        return;
                    }
                    // process regular days
                    let rdCombo = me.lookup('regularDaysCombo'),
                        rdStore = rdCombo.getStore(),
                        rdValues = [];

                    rdStore.each(function(rdRecord) {
                        let rdValue = rdRecord.get('value');

                        if ( !(~record.get('regularDaysClosed') & rdValue) ) {
                            rdValues.push(rdValue)
                        }
                    });

                    rdCombo.setValue(rdValues);
                }
            })
        },

        handleRecordUpdate(record) {
            let selectedDays = this.lookup('regularDaysCombo').getValue(),
                value = Ext.Array.reduce(selectedDays, (prev, val) => prev + val, 0);

            record.set('regularDaysClosed', value);

            this.callParent(arguments);
        },

        onAfterSave(view, holiday) {
            let me = this,
                vm = this.getViewModel();

            me.lookup('employeeGroupCombo').saveValuesForRecord(vm.get('record')).then(function() {
                holiday.set('holidayCount', vm.get('record.details').count());
                view.fireEvent('afterSave', view, holiday);
                me.close();
            });
        },

        handleIncomeSearch() {
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

        selectIncome(records) {
            let vm = this.getViewModel(),
                rec = records[0];

            if (rec) {
                vm.set('record.incomeListId', rec.getId());
                vm.set('record.incomeCode', rec.get('code'));
            }
        },

        close() {
            this.lookup('employeeGroupCombo').collapse();
            this.callParent(arguments);
        },

        handleClone() {
            let picker,
                vm = this.getViewModel(),
                me = this;

            picker = Ext.create('criterion.ux.form.CloneForm', {
                title : i18n.gettext('Clone Holiday to Next Year'),

                viewModel : {
                    data : {
                        holidayId : vm.get('record.id'),
                        year : vm.get('record.year') + 1,
                        code : vm.get('record.code') + criterion.Consts.CLONE_PREFIX,
                        name : vm.get('record.name')
                    }
                },

                items : [
                    {
                        xtype : 'numberfield',
                        fieldLabel : i18n.gettext('Year'),
                        allowBlank : false,
                        name : 'year',
                        bind : '{year}'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Code'),
                        allowBlank : false,
                        name : 'code',
                        bind : '{code}'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Name'),
                        allowBlank : false,
                        name : 'name',
                        bind : '{name}'
                    }
                ]
            });

            picker.show();
            picker.focusFirstField();
            picker.on({
                cancel : () => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                clone : data => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                    me.cloneHoliday(data);
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        cloneHoliday(data) {
            let me = this,
                view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : Ext.util.Format.format(
                    criterion.consts.Api.API.EMPLOYER_HOLIDAY_CLONE,
                    data.holidayId
                ),
                jsonData : {
                    year : data.year,
                    code : data.code,
                    name : data.name
                },
                method : 'POST',
                silent : true
            }).then(() => {
                view.setLoading(false);

                view.fireEvent('afterSave', view);
                me.close();
            });
        }
    };
});
