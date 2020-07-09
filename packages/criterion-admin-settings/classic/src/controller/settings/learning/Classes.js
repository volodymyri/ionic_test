Ext.define('criterion.controller.settings.learning.Classes', function() {

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_learning_classes',

        mixins : [
            'criterion.controller.mixin.FilterByProperty'
        ],

        load : function(opts = {}) {
            let mergeOptions = {};

            if (!this.lookup('showInactive').getValue()) {
                mergeOptions.params = {
                    isActive : true
                };
            }

            return this.callParent([Ext.apply({}, Ext.merge(opts, mergeOptions))]);
        },

        handleChangeShowInactive : function() {
            this.load();
        },

        onEmployerChange : function() {
            this.load();
        },

        createEditor : function(editorCfg, record) {
            var editor = this.callParent(arguments);

            editor.getViewModel().set('employerId', this.getEmployerId());

            return editor;
        }
    };
});
