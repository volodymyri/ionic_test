Ext.define('criterion.view.ess.career.Skills', function() {

    return {

        alias : 'widget.criterion_selfservice_career_skills',

        extend : 'criterion.view.person.Skills',

        requires : [
            'criterion.view.ess.career.Skill'
        ],

        tbar : null,

        header : {

            title : i18n.gettext('Skills'),

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
                    handler : 'handleRefreshClick'
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'addButton',
                    text : i18n.gettext('Add'),
                    ui : 'feature',
                    handler : 'handleAddClick'
                }
            ]
        },

        controller : {
            suppressIdentity : ['EmployeeContext'],
            showTitleInConnectedViewMode : true,
            baseRoute : criterion.consts.Route.SELF_SERVICE.CAREER_SKILLS,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_selfservice_career_skill',
                frame : true,
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        initComponent() {
            this.columns.push({
                xtype : 'gridcolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'status',
                width : 130
            });

            this.callParent(arguments);
        }

    }
});
