Ext.define('criterion.view.person.ReviewJournals', function () {

    return {
        alias : 'widget.criterion_person_review_journals',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.person.ReviewJournals',
            'criterion.store.employee.ReviewJournals'
        ],

        uses : [
            'criterion.view.person.Review'
        ],

        store : {
            type : 'criterion_employee_review_journals'
        },

        controller : {
            type : 'criterion_person_review_journals'
        },

        title : i18n.gettext('Journal Entries'),

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_JOURNAL_ENTRIES, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

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
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Private'),
                dataIndex : 'isPrivate',
                trueText : '✓',
                falseText : '',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            }
        ]
    };

});
