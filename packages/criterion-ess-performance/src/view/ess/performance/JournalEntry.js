Ext.define('criterion.view.ess.performance.JournalEntry', function() {

    return {

        alias : 'widget.criterion_selfservice_journal_entry',

        extend : 'criterion.view.ess.performance.JournalBase',

        requires : [
            'criterion.view.person.ReviewJournal',
            'criterion.controller.ess.performance.JournalEntry',
            'criterion.controller.ess.performance.ReviewJournal'
        ],

        controller : {
            type : 'criterion_selfservice_journal_entry'
        },

        viewModel : {
            formulas : {
                title : function(get) {
                    var selectedSubordinate = get('selectedSubordinate'),
                        title = i18n.gettext('Journal Entries');

                    if (selectedSubordinate) {
                        title += Ext.util.Format.format('<span class="criterion-text-gray person-name"> {0} {1}</span>', i18n.gettext('for'), selectedSubordinate.get('title'));
                    }

                    return title;
                }
            }
        },

        layout : 'border',

        createItems : function() {
            var items = this.callParent(arguments);

            items.push.apply(items, [
                {
                    xtype : 'panel',
                    region : 'center',
                    scrollable : 'vertical',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    bind : {
                        title : '{title}'
                    },
                    items : [
                        {
                            xtype : 'criterion_person_review_journal',

                            reference : 'entryEditor',

                            controller : 'criterion_selfservice_review_journal',

                            bodyPadding : 0,

                            minHeight : 400,

                            flex : 1,

                            noButtons : true,

                            disabled : true,

                            listeners : {
                                afterSave : 'handleAfterSave'
                            }
                        }
                    ],
                    bbar : [
                        '->',
                        {
                            text : i18n.gettext('Save'),
                            disabled : true,
                            margin : '0 25 0 0',

                            bind : {
                                disabled : '{!selectedSubordinate}'
                            },
                            listeners : {
                                click : 'onSave'
                            }
                        }
                    ]
                }
            ]);

            return items;
        }
    };
});