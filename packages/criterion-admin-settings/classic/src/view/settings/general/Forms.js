Ext.define('criterion.view.settings.general.Forms', function() {

    return {
        alias : 'widget.criterion_settings_general_forms',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.Forms',
            'criterion.controller.settings.general.Forms',
            'criterion.view.settings.general.WebForm',
            'criterion.view.settings.general.DataForm'
        ],

        title : i18n.gettext('Forms'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_general_forms',
            connectParentView : true,
            loadRecordOnEdit : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_general_webform',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : '100%'
                    }
                ]
            },
            editorDataForm : {
                xtype : 'criterion_settings_general_dataform',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : '100%'
                    }
                ]
            }
        },

        tbar : [
            '->',
            {
                xtype : 'criterion_splitbutton',
                reference : 'addButton',
                width : 130,
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                menu : [
                    {
                        text : i18n.gettext('Add Data Form'),
                        listeners : {
                            click : 'handleAddDataForm'
                        }
                    }
                ]
            },
            {
                xtype : 'filebutton',
                text : i18n.gettext('Import'),
                cls : 'criterion-btn-feature',
                listeners : {
                    change : 'handleWebFormImport'
                }
            },
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

        listeners : {
            formcopy : 'handleFormCopy'
        },

        store : {
            type : 'criterion_forms'
        },

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
                xtype : 'booleancolumn',
                header : i18n.gettext('System'),
                align : 'center',
                dataIndex : 'isSystem',
                trueText : '✓',
                falseText : '',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-copy-outline'],
                        tooltip : i18n.gettext('Copy'),
                        action : 'formcopy'
                    }
                ]
            }
        ]
    };

});
