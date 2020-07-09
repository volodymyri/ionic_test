Ext.define('criterion.view.reports.dataGrid.ColumnJoinEditor', function() {

    const DATA_GRID_JOIN_TYPES = criterion.Consts.DATA_GRID_JOIN_TYPES;

    return {

        extend : 'criterion.ux.form.Panel',

        alias : 'widget.criterion_reports_data_grid_column_join_editor',

        requires : [
            'criterion.controller.reports.dataGrid.ColumnJoinEditor'
        ],

        controller : {
            type : 'criterion_reports_data_grid_column_join_editor'
        },

        listeners : {
            show : 'handleShow'
        },

        viewModel : {
            data : {
                columnData : null,

                typeJoin : DATA_GRID_JOIN_TYPES.INNER,
                table : null,
                field : null,
                hash : null
            },

            stores : {
                typesJoin : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    fields : ['val', 'title'],
                    data : [
                        {
                            val : DATA_GRID_JOIN_TYPES.INNER,
                            title : i18n.gettext('Inner')
                        },
                        {
                            val : DATA_GRID_JOIN_TYPES.LEFT,
                            title : i18n.gettext('Left')
                        },
                        {
                            val : DATA_GRID_JOIN_TYPES.RIGHT,
                            title : i18n.gettext('Right')
                        }
                    ]
                }
            },

            formulas : {
                hasChange : data => data('hash') ? (data('field') && data('hash') !== data('table') + data('field') + data('typeJoin')) : data('field'),
                btnText : data => data('hash') ? i18n.gettext('Change') : i18n.gettext('Add')
            }
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancel'
                }
            },
            '->',
            {
                xtype : 'button',
                disabled : true,
                bind : {
                    text : '{btnText}',
                    disabled : '{!hasChange}'
                },
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleChange'
                }
            }
        ],

        modal : true,

        alwaysOnTop : true,

        draggable : false,

        plugins : {
            ptype : 'criterion_sidebar',
            modal : true,
            height : 250,
            width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
        },

        layout : 'vbox',

        bind : {
            title : i18n.gettext('Link Column') + ' {columnData.name}'
        },

        bodyPadding : 20,

        items : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Join Type'),
                displayField : 'title',
                valueField : 'val',
                queryMode : 'local',
                bind : {
                    store : '{typesJoin}',
                    value : '{typeJoin}'
                },
                margin : '0 0 10 0'
            },
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '10 0 0 0',
                items : [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Table'),
                        reference : 'tableField',
                        displayField : 'label',
                        valueField : 'name',
                        queryMode : 'local',
                        allowBlank : false,
                        forceSelection : true,
                        autoSelect : true,
                        editable : true,
                        bind : {
                            store : '{tables}',
                            value : '{table}'
                        }
                    },
                    {
                        xtype : 'component',
                        html : i18n.gettext('by'),
                        margin : '10 10 0 10',
                        hidden : true,
                        bind : {
                            hidden : '{!tableField.selection}'
                        }
                    },
                    {
                        xtype : 'combobox',
                        displayField : 'name',
                        valueField : 'name',
                        queryMode : 'local',
                        hidden : true,
                        bind : {
                            store : '{tableField.selection.columns}',
                            value : '{field}',
                            hidden : '{!tableField.selection}'
                        }
                    }
                ]
            }
        ]
    }
});
