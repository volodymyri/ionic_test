Ext.define('criterion.controller.ess.resources.CompanyDirectory', function() {

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_resources_company_directory',

        onEmployerChange : function() {
            this.load();
        },

        handleChangeSearchStr : function() {
            this.load();
        }
    };

});
