Ext.define('criterion.view.ess.career.Certifications', function() {

    return {

        alias : 'widget.criterion_selfservice_career_certifications',

        extend : 'criterion.view.person.Certifications',

        requires : [
            'criterion.view.ess.career.Certification'
        ],

        tbar : null,

        header : {

            title : i18n.gettext('Certifications'),

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
            baseRoute : criterion.consts.Route.SELF_SERVICE.CAREER_CERTIFICATIONS,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_selfservice_career_certification',
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
