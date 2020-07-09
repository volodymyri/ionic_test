Ext.define('criterion.view.settings.system.StaticTokens', function() {

    return {

        alias : 'widget.criterion_settings_static_tokens',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.controller.settings.system.StaticTokens',
            'criterion.view.settings.system.StaticToken',
            'criterion.store.StaticTokens'
        ],

        viewModel : {
            stores : {
                tokenTypes : {
                    type : 'store',
                    fields : [
                        'id',
                        'text'
                    ],
                    data : criterion.Consts.STATIC_TOKEN_TYPES_DATA
                }
            },
            data : {
                preventEditing : true
            }
        },

        store : {
            type : 'criterion_static_tokens'
        },

        controller : {
            type : 'criterion_settings_static_tokens',
            connectParentView : {
                parentForSpecified : true
            },
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : false,
            reloadAfterEditorSave : true,
            editor : {
                xtype : 'criterion_settings_system_static_token',
                allowDelete : false,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        viewConfig : {
            enableTextSelection : true
        },

        title : i18n.gettext('API Keys'),

        columns : [
            {
                xtype : 'gridcolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                text : i18n.gettext('Type'),
                dataIndex : 'tokenTypeName',
                tdCls : 'x-unselectable'
            },
            {
                xtype : 'gridcolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                text : i18n.gettext('Security Profile'),
                dataIndex : 'securityProfileName',
                tdCls : 'x-unselectable'
            },
            {
                xtype : 'gridcolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                text : i18n.gettext('User Name'),
                dataIndex : 'personName',
                tdCls : 'x-unselectable'
            },
            {
                xtype : 'datecolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                text : i18n.gettext('Created On'),
                dataIndex : 'createdDate',
                tdCls : 'x-unselectable'
            },
            {
                xtype : 'gridcolumn',
                flex : 0.5,
                text : i18n.gettext('API Key'),
                dataIndex : 'apiKey',
                encodeHtml : false,
                renderer : function(value, meta, record) {
                    return Ext.String.format('<textarea style="width:0;height:0;opacity:0;" id="api-key-{0}" readonly="readonly">{1}</textarea>{1}', record.getId(), value);
                }
            },
            {
                xtype : 'criterion_widgetcolumn',
                sortable : false,
                resizable : false,
                draggable : false,
                hideable : false,
                width : 130,
                widget : {
                    xtype : 'button',
                    text : i18n.gettext('Copy API key'),
                    handler : function(cmp) {
                        var textArea = Ext.fly('api-key-' + cmp.getWidgetRecord().getId());

                        textArea.dom.select();

                        try {
                            var copied = document.execCommand('copy');

                            if (copied) {
                                criterion.Utils.toast(i18n.gettext('API key copied to clipboard.'));

                                Ext.defer(function() {
                                    window.getSelection().removeAllRanges();
                                }, 10);
                            }
                        } catch (e) {
                            criterion.Utils.toast(i18n.gettext('Current browser doesn\'t support this operation'));
                        }
                    }
                }
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                tdCls : 'x-unselectable',
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };
});
