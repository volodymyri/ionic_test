Ext.define('criterion.controller.TaxPicker', function() {

    return {
        alias : 'controller.criterion_tax_picker',

        extend : 'criterion.controller.MultiRecordPickerRemote',

        handleSearchTypeComboChange : function() {
            var currentSelFilter = this.getViewModel().get('searchCombo.selection');

            this.callParent(arguments);

            if (currentSelFilter) {
                this.loadWithParams();
            }
        },

        loadWithParams : function(params) {
            var vm = this.getViewModel(),
                currentSelFilter = vm.get('searchCombo.selection'),
                store = this.getStore('inputStore');

            params = params || {};

            params['employeeId'] = vm.get('employeeId');

            if (currentSelFilter && currentSelFilter.get('type') === 'employeeId') {
                store.getProxy().setUrl(criterion.consts.Api.API.TAX);
            } else {
                store.getProxy().setUrl(criterion.consts.Api.API.TAX_SEARCH);
            }

            this.callParent([params]);
        }
    }
});
