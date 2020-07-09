Ext.define('criterion.controller.settings.recruiting.QuestionSets', function() {

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_recruiting_question_sets',

        getEmptyRecord : function() {
            return Ext.apply(this.callParent(arguments), {
                description : ''
            });
        }
    }
});
