Ext.define('criterion.controller.settings.hr.CompanyEvents', function() {

    return {
        alias : 'controller.criterion_settings_company_events',

        extend : 'criterion.controller.employer.GridView',

        onEmployerChange : function() {
            this.load();
        }
    };

});
