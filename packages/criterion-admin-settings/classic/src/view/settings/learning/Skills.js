Ext.define('criterion.view.settings.learning.Skills', {

    alias : 'widget.criterion_settings_learning_skills',

    extend : 'criterion.view.settings.GridView',

    requires : [
        'criterion.store.Skills',
        'criterion.view.settings.learning.Skill'
    ],

    controller : {
        showTitleInConnectedViewMode : true,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_settings_learning_skill',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    title : i18n.gettext('Skills'),

    store : {
        type : 'criterion_skills'
    },

    initComponent : function() {
        this.columns = [
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Category'),
                flex : 1,
                dataIndex : 'skillCategoryCd',
                codeDataId : criterion.consts.Dict.SKILL_CATEGORY
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'name'
            }
        ];

        this.callParent(arguments);
    }

});
