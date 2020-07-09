Ext.define('criterion.view.reports.dataGrid.editor.Base', function() {

    return {

        extend : 'criterion.ux.Panel',

        layout : 'border',

        viewModel : {
            data : {
                availables : null,

                width : {
                    availables : 300,
                    sort : 130,
                    criteria : 300
                }
            }
        },

        availableName : i18n.gettext('Available'),
        usedName : i18n.gettext('Used'),
        storeIdent : '',

        labelTpl : '{label}',

        initComponent() {

            this.items = [
                this.getAvailablesGridCfg(),
                this.getUsedGridCfg()
            ];

            this.callParent(arguments);
        },

        getAvailablesGridCfg() {
            return {
                xtype : 'criterion_gridpanel',
                bodyPadding : 0,
                reference : 'availablesGrid',
                bind : {
                    store : '{availables}',
                    width : '{width.availables}'
                },
                border : 1,
                selType : 'checkboxmodel',
                selModel : {
                    checkOnly : true,
                    mode : 'MULTI'
                },

                region : 'west',
                split : true,
                dockedItems : [
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        dock : 'top',

                        defaults : {
                            style : {
                                backgroundColor : criterion.consts.Colors.B_GRAY
                            }
                        },

                        items : [
                            {
                                xtype : 'component',
                                html : '<span class="bold criterion-black">' + this.availableName + '</span>',
                                flex : 1,
                                margin : 0,
                                padding : '14 0 14 20'
                            }
                        ]
                    }
                ],

                scrollable : 'vertical',
                height : '100%',

                listeners : {
                    select : 'handleColumnSelectionChange',
                    deselect : 'handleColumnSelectionChange',
                    beforeselect : 'handleColumnBeforeSelection'
                },

                columns : [
                    {
                        xtype : 'templatecolumn',
                        dataIndex : 'label',
                        flex : 1,
                        tpl : '<span data-qtip="{label}">{label}</span>'
                    }
                ]
            };
        },

        getUsedGridCfg() {
            return {
                xtype : 'criterion_gridview',
                viewConfig : {
                    markDirty : false
                },
                listeners : {
                    editaction : 'handleEditCriteria',
                    afterRemove : 'onAfterRemoveUsedColumn'
                },
                controller : {
                    customDeleteMsg : i18n.gettext('Do you want to delete this column?')
                },
                preventStoreLoad : true,
                bodyPadding : 0,
                bind : {
                    store : '{' + this.storeIdent + '}'
                },
                flex : 1,
                tbar : null,
                border : 1,

                region : 'center',

                scrollable : true,
                height : '100%',

                columns : [
                    {
                        xtype : 'templatecolumn',
                        dataIndex : 'label',
                        flex : 1,
                        minWidth : 250,
                        menuDisabled : true,
                        sortable : false,
                        tpl : this.labelTpl,
                        text : this.usedName
                    },
                    {
                        xtype : 'templatecolumn',
                        dataIndex : 'sort',
                        menuDisabled : true,
                        sortable : false,
                        bind : {
                            width : '{width.sort}'
                        },
                        text : i18n.gettext('Sort'),
                        tpl : '<span class="criterion-darken-gray showOnGridItemHover" data-qtip="' + i18n.gettext('Edit sort') + '">&#x270E;</span>&nbsp;{sort:uppercase}'
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'criteria',
                        encodeHtml : false,
                        menuDisabled : true,
                        sortable : false,
                        bind : {
                            width : '{width.criteria}'
                        },
                        text : i18n.gettext('Criteria'),
                        renderer : function(values) {
                            return '<span class="criterion-darken-gray showOnGridItemHover" data-qtip="' + i18n.gettext('Edit criteria') + '">&#x270E;</span>&nbsp;' +
                                (
                                    values && Ext.isArray(values) && values.length ?
                                        Ext.Array.map(values, val => Ext.String.trim(Ext.String.format('{0} {1}', val['operator'], val['value']))).join('&nbsp;<span class="criterion-darken-gray">AND</span><br>' + Ext.String.repeat('&nbsp;', 4)) : ''
                                );
                        }
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
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
        }

    };
});
