Ext.define('criterion.controller.CustomFieldsContainer', function() {

    return {
        alias : 'controller.criterion_custom_fields_container',

        extend : 'criterion.app.ViewController',

        load : function(entityId, callback, data) {
            return this.lookupReference('customFields').getController().load(entityId, callback, data);
        },

        save : function(entityId, callback, scope) {
            return this.lookupReference('customFields').getController().save(entityId, callback, scope);
        },

        getChanges : function(entityId) {
            return this.lookupReference('customFields').getController().getChanges(entityId);
        },

        loadChanges : function(data, onlyChanges, delegatedByEmployeeId) {
            return this.lookupReference('customFields').getController().loadChanges(data, onlyChanges, delegatedByEmployeeId);
        },

        copyExist : function(entityId) {
            return this.lookupReference('customFields').getController().copyFromExist(entityId);
        }

    };

});
