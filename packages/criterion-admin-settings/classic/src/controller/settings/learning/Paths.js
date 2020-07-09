Ext.define('criterion.controller.settings.learning.Paths', function() {

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_learning_paths',

        mixins : [
            'criterion.controller.mixin.FilterByProperty'
        ]
    };
});
