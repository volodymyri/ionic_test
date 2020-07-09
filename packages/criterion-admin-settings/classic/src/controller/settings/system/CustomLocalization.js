Ext.define('criterion.controller.settings.system.CustomLocalization', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_system_custom_localization',

        onAfterSave(view, record) {
            this.callParent(arguments);

            let locale = record.get('localizationLanguageCode').toLowerCase();

            criterion['locales'][locale]['locale_data']['messages'][record.get('token')] = [record.get('label')];
            i18n.rebuild();
        },

        onAfterDelete(view, record) {
            this.callParent(arguments);

            let locale = record.get('localizationLanguageCode').toLowerCase();

            criterion['locales'][locale]['locale_data']['messages'][record.get('token')] = [];
            i18n.rebuild();
        }
    };
});
