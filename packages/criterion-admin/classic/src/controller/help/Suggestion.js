/**
 * @deprecated kill after 09.08.18
 */
Ext.define('criterion.controller.help.Suggestion', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_help_suggestion',

        onSave : function() {
            this.getView().setLoading(true);
        },

        onAfterSave : function(view, record) {
            view.fireEvent('afterSave', view, record);
            view.setLoading(false);
        }
    }
});
