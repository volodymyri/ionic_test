Ext.define('criterion.controller.settings.learning.Courses', function() {

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_learning_courses',

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
        }
    };
});
