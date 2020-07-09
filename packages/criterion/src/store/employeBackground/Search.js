Ext.define('criterion.store.employeeBackground.Search', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.BufferedNoPurgeStore',

        alias : 'store.criterion_employee_background_search',

        model : 'criterion.model.employeeBackground.Search',

        proxy : {
            type : 'criterion_rest',

            url : API.EMPLOYEE_BACKGROUND_SEARCH
        },

        // After reload it may happen, that table view try to clean up obsolete rows, but buffered store already removed them, so prevent stop execution
        // TODO: need further investigation of bufferedStore interaction with grid
        getByInternalId : function(internalId) {
            try {
                return this.callParent(arguments);
            } catch (e) {
                return null;
            }
        }
    };

});
