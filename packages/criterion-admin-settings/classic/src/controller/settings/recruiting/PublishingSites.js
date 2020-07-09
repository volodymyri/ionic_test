Ext.define('criterion.controller.settings.recruiting.PublishingSites', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_recruiting_publishing_sites',

        onEditorDestroy : function() {
            this.load();
        }
    }

});