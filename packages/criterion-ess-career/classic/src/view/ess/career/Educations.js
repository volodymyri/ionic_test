Ext.define('criterion.view.ess.career.Educations', function() {

    return {

        alias : 'widget.criterion_selfservice_career_educations',

        extend : 'criterion.view.person.Educations',

        requires : [
            'criterion.view.ess.career.Education'
        ],

        tbar : null,

        header : {

            title : i18n.gettext('Education'),

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
            baseRoute : criterion.consts.Route.SELF_SERVICE.CAREER_EDUCATION,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_selfservice_career_education',
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
