Ext.define('criterion.controller.settings.system.CompensationType', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_payroll_settings_system_compensation_type',

        requires : [
            'criterion.view.settings.system.compensationType.TaxSelect',
            'criterion.store.Taxes'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAddTax : function() {
            var taxes = Ext.create('criterion.store.Taxes', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                excludedIds = [],
                selectWindow,
                gridStore = this.lookup('detailsGrid').getStore();

            taxes.getProxy().setUrl(criterion.consts.Api.API.TAX_SEARCH);

            gridStore.each(function(rec) {
                excludedIds.push(rec.get('taxId'));
            });

            selectWindow = Ext.create('criterion.view.settings.system.compensationType.TaxSelect', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Add Tax'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Tax Name'),
                                dataIndex : 'description',
                                flex : 1,
                                filter : 'string'
                            }
                        ],
                        excludedIds : excludedIds
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

        selectTax : function(searchRecords, compTypeCd) {
            var vm = this.getViewModel(),
                store = vm.get('record.taxes'),
                teIncomeId = vm.get('record.id');

            this.setCorrectMaskZIndex(false);

            Ext.Array.each(searchRecords, function(record) {
                store.add({
                    teIncomeId : teIncomeId,
                    taxId : record.getId(),
                    taxName : record.get('description'),
                    compTypeCd : compTypeCd
                });
            });
        },

        handleRemoveTax : function(record) {
            var me = this;

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete the record?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        me.lookup('detailsGrid').getStore().remove(record);
                    }
                }
            );
        }
    };

});
