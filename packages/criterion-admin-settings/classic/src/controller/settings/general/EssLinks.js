Ext.define('criterion.controller.settings.general.EssLinks', function() {

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_ess_links',

        handleOpenLink : function(record) {
            var url = record && record.get('url');

            url && window.open(url, '_blank');
        }
    };

});