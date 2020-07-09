/**
 * @deprecated
 *
 * Not used for now, but may be helpful in future.
 */
Ext.define('criterion.controller.settings.system.ViewSettings', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_view',

        listen : {
            global: {
                viewSettingsLoaded : 'loadSettings'
            }
        },

        loadSettings : function() {
            var view = this.getView(),
                employeeTabs = this.lookupReference('employeeTabs');

            if (!this.checkViewIsActive()) {
                return;
            }

            if (!criterion.ViewSettingsManager.isLoaded()) {
                // settings are loaded globally, we have to wait for it
                view.setLoading(true);
                return;
            }

            employeeTabs.createItems(
                criterion.ViewSettingsManager.getSetting(criterion.Consts.VIEW_SETTING.HR_EMPLOYER_TAB_VISIBLE)
            );

            view.setLoading(false);
        },

        onSave : function() {
            var employeeTabs = this.lookupReference('employeeTabs'),
                updatedSettings = {};

            updatedSettings[criterion.Consts.VIEW_SETTING.HR_EMPLOYER_TAB_VISIBLE] = employeeTabs.getVisibleSetting();

            criterion.ViewSettingsManager.update(updatedSettings);
            criterion.Utils.toast(i18n.gettext('Settings saved.'));
        }
    };
});
