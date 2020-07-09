Ext.define('criterion.controller.person.ReviewJournals', function() {

    return {
        alias : 'controller.criterion_person_review_journals',

        extend : 'criterion.controller.employee.GridView',

        requires : [
            'criterion.view.person.ReviewJournal'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        editor : {
            xtype : 'criterion_person_review_journal',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        },

        handleAfterEdit : function() {
            this.callParent(arguments);
            this.load();
        }
    };

});
