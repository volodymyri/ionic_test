Ext.define('criterion.view.ess.performance.TeamJournals', function() {

    return {

        alias : 'widget.criterion_selfservice_team_journals',

        extend : 'criterion.view.ess.performance.JournalBase',

        requires : [
            'criterion.view.person.ReviewJournal',
            'criterion.controller.ess.performance.TeamJournals',
            'criterion.store.employee.ReviewJournals'
        ],

        controller : {
            type : 'criterion_selfservice_team_journals'
        },

        viewModel : {
            data : {
                selectedEntry : null
            },
            stores : {
                employeeEntries : {
                    type : 'criterion_employee_review_journals'
                }
            },
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
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    bind : {
                        title : '{title}'
                    },
                    items : [
                        {
                            xtype : 'criterion_gridpanel',

                            frame : true,

                            flex : 1,

                            margin : '0 0 25',

                            reference : 'employeeEntriesGrid',

                            bind : {
                                hidden : '{selectedEntry}',
                                store : '{employeeEntries}'
                            },

                            listeners : {
                                select : 'onEntrySelect'
                            },

                            columns : [
                                {
                                    xtype : 'datecolumn',
                                    text : i18n.gettext('Date'),
                                    dataIndex : 'createdDate',
                                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                                },
                                {
                                    xtype : 'codedatacolumn',
                                    text : i18n.gettext('Group'),
                                    dataIndex : 'journalGroupCd',
                                    codeDataId : criterion.consts.Dict.JOURNAL_GROUP,
                                    width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Title'),
                                    dataIndex : 'title',
                                    flex : 1
                                }
                            ]
                        },
                        {
                            xtype : 'panel',
                            scrollable : 'vertical',
                            hidden : true,
                            bind : {
                                hidden : '{!selectedEntry}'
                            },
                            layout : 'fit',
                            flex : 1,
                            items : [
                                {
                                    xtype : 'criterion_person_review_journal',

                                    reference : 'entryEditor',

                                    controller : 'criterion_selfservice_review_journal',

                                    viewModel : {
                                        data : {
                                            readOnly : true
                                        }
                                    },

                                    minHeight : 400,

                                    bodyPadding : 0,

                                    noButtons : true,
                                    disabled : true,

                                    bind : {
                                        disabled : '{!selectedEntry}'
                                    }
                                }
                            ],
                            bbar : [
                                '->',
                                {
                                    text : i18n.gettext('Close'),
                                    hidden : true,
                                    margin : '0 25 0 0',
                                    bind : {
                                        hidden : '{!selectedEntry}'
                                    },

                                    listeners : {
                                        click : 'onClose'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]);

            return items
        }
    };
});