Ext.define('criterion.controller.common.SelectTax', function() {

    var Api = criterion.consts.Api,
        API = Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_select_tax',

        handleActivate : function() {
            this.preloadDatas();
        },

        preloadDatas : function() {
            var vm = this.getViewModel();

            this.getGridStore().getProxy().setUrl(API.TAX_SEARCH);
            vm.getStore('employerWorkLocations').load({
                params : {
                    employerId : vm.get('employerId')
                },
                scope : this,
                callback : this.afterPreloadDatas
            });
        },

        afterPreloadDatas : function(datas) {
            if (datas[0]) {
                this.lookupReference('location').setValue(datas[0].get('geocode'));
            }
        },

        handleSearchChange : function() {
            Ext.Function.defer(this.loadData, 100, this);
        },

        onKeyPress : function(cmp, e) {
            if (e.keyCode === e.RETURN) {
                this.loadData();
            }
        },

        getGrid : function() {
            return this.lookupReference('grid');
        },

        getGridStore : function() {
            return this.getViewModel().getStore('taxes');
        },

        getGridSelection : function() {
            return this.getGrid().getSelection();
        },

        loadData : function() {
            var params = this.lookupReference('searchForm').getForm().getFieldValues();

            if (params.searchBy === 1 && params.geocode === null) {
                return;
            }

            this.getGridStore().load({
                params : params
            });
        },

        handleAdd : function() {
            var record = this.getViewModel().get('record'),
                view = this.getView(),
                selectionRecord = this.getGrid().getSelection()[0];

            record.set('taxId', selectionRecord.get('id'));

            record.save({
                success : function() {
                    view.fireEvent('saved');
                    view.destroy();
                }
            });
        },

        handleCancel : function() {
            var record = this.getViewModel().get('record');
            record.erase();

            this.getView().destroy();
        },

        handleSearch : function() {
            this.loadData();
        },

        onBeforeTaxSelect : function(row, record) {
            var blockedTaxes = this.getViewModel().get('blockedTaxes');

            if (Ext.Array.contains(blockedTaxes, record.getId())) {
                return false;
            }
        },

        getTaxRowClass : function(record) {
            var blockedTaxes = this.getViewModel().get('blockedTaxes');

            return Ext.Array.contains(blockedTaxes, record.getId()) ? 'checkbox-hidden' : ''
        }

    };

});
