Ext.define('criterion.view.ess.resources.Forms', function() {

    return {
        alias : 'widget.criterion_selfservice_resources_forms',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.form.Availables',
            'criterion.controller.ess.resources.Forms'
        ],

        controller : {
            type : 'criterion_selfservice_resources_forms'
        },

        store : {
            type : 'criterion_form_availables'
        },

        listeners : {
            assignAction : 'handleAssignAction'
        },

        header : {

            title : i18n.gettext('Forms'),

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

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'name'
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'documentTypeCd',
                codeDataId : criterion.consts.Dict.DOCUMENT_RECORD_TYPE,
                text : i18n.gettext('Type'),
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Fields'),
                dataIndex : 'fieldsCount'
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-paper'],
                        tooltip : i18n.gettext('Assign'),
                        action : 'assignAction'
                    }
                ]
            }
        ]
    };

});
