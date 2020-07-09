Ext.define('criterion.controller.ess.performance.ReviewJournal', function() {

    return {
        alias : 'controller.criterion_selfservice_review_journal',

        extend : 'criterion.controller.person.ReviewJournal',

        onAfterSave : function(view, record) {
            view.fireEvent('afterSave', view, record);
        }
    };
});