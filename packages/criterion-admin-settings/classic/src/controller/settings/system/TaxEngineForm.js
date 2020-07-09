Ext.define('criterion.controller.settings.system.TaxEngineForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_system_tax_engine_form',

        requires : [
            'criterion.store.Taxes',
            'criterion.view.MultiRecordPickerRemote',
            'criterion.view.settings.system.TaxEngineRateForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAddRate() {
            let vm = this.getViewModel(),
                store = vm.get('record.rates');

            this.editRate(store.add({
                teTaxId : vm.get('record.id')
            })[0]);
        },

        handleEditRate(grid, td, cellIndex, record) {
            this.editRate(record);
        },

        editRate(record) {
            let me = this,
                editor = Ext.create('criterion.view.settings.system.TaxEngineRateForm', {
                    viewModel : {
                        data : {
                            record : record
                        }
                    }
                });

            editor.on({
                delete : function(record) {
                    record.store ? record.store.remove(record) : record.erase();
                },
                destroy : function() {
                    me.setCorrectMaskZIndex(false);
                }
            });

            editor.show();
            this.setCorrectMaskZIndex(true);
        },

        handleTaxSelect() {
            let vm = this.getViewModel(),
                taxes = Ext.create('criterion.store.Taxes', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                selectWindow;

            taxes.getProxy().setUrl(criterion.consts.Api.API.TE_TAX_SEARCH);

            selectWindow = Ext.create('criterion.view.MultiRecordPickerRemote', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Add Tax'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Tax Name'),
                                dataIndex : 'taxName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Filing Status'),
                                dataIndex : 'filingStatusDescription',
                                flex : 1,
                                filter : 'string'
                            }
                        ],
                        storeParams : {
                            countryCd : vm.get('countryCd')
                        }
                    },
                    stores : {
                        inputStore : taxes
                    }
                },
                multiSelect : false
            });

            selectWindow.show();
            selectWindow.on('selectRecords', this.selectTax, this);

            this.setCorrectMaskZIndex(true);
        },

        selectTax(searchRecords) {
            let vm = this.getViewModel(),
                record = vm.get('record');

            this.setCorrectMaskZIndex(false);
            record.set({
                taxNumber : searchRecords[0].get('taxNumber'),
                taxName : searchRecords[0].get('description') || searchRecords[0].get('taxName'),
                filingStatusDescription : searchRecords[0].get('filingStatusDescription'),
                filingStatusCode : searchRecords[0].get('filingStatusCode')
            });
        }

    };

});
