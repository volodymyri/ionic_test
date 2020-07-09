Ext.define('criterion.view.person.Performance', function () {

    return {
        alias : 'widget.criterion_person_performance',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.person.Goals',
            'criterion.view.person.Reviews',
            'criterion.view.person.ReviewJournals'
        ],

        title : i18n.gettext('Performance'),

        layout : {
            type : 'card'
        },

        defaults: {
            header: false,
            autoScroll: true
        },

        plugins : [
            {
                ptype : 'criterion_security_items'
            }
        ],

        items : [
            {
                xtype : 'criterion_person_goals',
                reference : 'goals',
                itemId : 'goals',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_GOALS, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_person_reviews',
                reference : 'reviews',
                itemId : 'reviews',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_REVIEWS, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_person_review_journals',
                reference : 'journalEntries',
                itemId : 'journalEntries',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_JOURNAL_ENTRIES, criterion.SecurityManager.READ)
            }
        ]
    };

});
