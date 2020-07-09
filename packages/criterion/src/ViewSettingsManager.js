/**
 * @singleton
 * @deprecated
 */
Ext.define('criterion.ViewSettingsManager', function() {

    var EMPLOYERS_STORE_ID = 'Employers',
        /**
         * @private
         */
        settings = {},
        isLoaded = false;

    function getCurrentEmployer() {
        return criterion.Application.getEmployer();
    }

    function getDefaultSettings() {
        var Utils = criterion.Utils,
            VS = criterion.Consts.VIEW_SETTING,
            defaultSettings = {};

        return defaultSettings;
    }

    return {

        singleton : true,

        isLoaded: function() {
            return isLoaded;
        },

        constructor : function() {
            this.callParent(arguments);
            Ext.GlobalEvents.on('baseStoresLoaded', this.load, this);
        },

        load: function() {
            var currentEmployer = getCurrentEmployer();

            if (currentEmployer) {
                settings = getDefaultSettings();
                isLoaded = true;
                Ext.GlobalEvents.fireEvent('viewSettingsLoaded', this.getSettings());
            } else {
                // it should be loaded by now, so will raise error
                Ext.Error.raise({
                    msg: 'Employer data not found',
                    employerId: criterion.Api.getEmployerId()
                });
            }
        },

        getSettings: function() {
            // keep original object safe to prevent accidental edit
            return Ext.clone(settings);
        },

        getSetting: function(settingName) {
            return this.getSettings()[settingName];
        },

        save : Ext.emptyFn,

        /**
         * @param {Object} updatedSettings
         */
        update: function(updatedSettings) {
            Ext.Object.each(updatedSettings, function(key, value) {
                settings[key] = value;
            });

            this.save();

            Ext.GlobalEvents.fireEvent('viewSettingsChanged', Ext.Object.getKeys(updatedSettings), this.getSettings());
        }

    };

});
