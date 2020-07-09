Ext.define('criterion.view.ess.performance.MyJournals', function() {

    return {
        alias : 'widget.criterion_selfservice_my_journals',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employee.ReviewJournals',
            'criterion.view.person.ReviewJournal'
        ],

        controller : {
            editor : {
                xtype : 'criterion_person_review_journal',
                allowDelete : false,
                viewModel : {
                    data : {
                        readOnly : true
                    },
                    formulas : {
                        hideSave : function() {
                            return true;
                        }
                    }
                },

                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        header : {

            title : i18n.gettext('My Journals'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                }
            ]
        },

        tbar : null,

        store : {
            type : 'criterion_employee_review_journals'
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
    }
});