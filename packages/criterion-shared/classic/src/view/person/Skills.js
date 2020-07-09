Ext.define('criterion.view.person.Skills', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_person_skills',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.view.person.Skill',
            'criterion.controller.person.GridView',
            'criterion.store.person.Skills'
        ],

        store : {
            type : 'criterion_person_skills'
        },

        controller : {
            type : 'criterion_person_gridview',
            reloadAfterEditorSave : true,
            editor : {
                xtype : 'criterion_person_skill',
                allowDelete : true,
                controller : {
                    externalUpdate : false
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        title : i18n.gettext('Skills'),

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
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SKILLS, criterion.SecurityManager.CREATE, true)
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
                xtype : 'criterion_codedatacolumn',
                flex : 1,
                text : i18n.gettext('Category'),
                dataIndex : 'skillCategoryCd',
                codeDataId : DICT.SKILL_CATEGORY
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Skill'),
                dataIndex : 'skillName'
            },
            {
                xtype : 'criterion_codedatacolumn',
                flex : 1,
                text : i18n.gettext('Level'),
                dataIndex : 'skillLevelCd',
                codeDataId : DICT.SKILL_LEVEL
            },
            {
                xtype : 'datecolumn',
                flex : 1,
                text : i18n.gettext('Date Acquired'),
                dataIndex : 'dateAcquired'
            }
        ]
    };

});
