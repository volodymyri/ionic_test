Ext.define('criterion.view.settings.system.FieldConfiguration', function() {

    return {
        alias : 'widget.criterion_settings_field_configuration',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.store.MetaTables',
            'criterion.store.MetaFields',
            'criterion.controller.settings.system.FieldConfiguration'
        ],

        title : i18n.gettext('Field Configuration'),

        viewModel : {
            data : {
                tableId : null,
                tableRecord : null
            },

            stores : {
                metaFields : {
                    type : 'criterion_meta_fields',
                    autoSync : false
                }
            }
        },

        controller : {
            type : 'criterion_settings_field_configuration'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'container',
                margin : '10 0 0 20',
                items : [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Table Name'),
                        width : 450,
                        listConfig : {
                            minWidth : 300
                        },
                        store : {
                            type : 'criterion_meta_tables',
                            autoSync : false
                        },
                        bind : {
                            value : '{tableId}'
                        },
                        valueField : 'id',
                        displayField : 'description',
                        forceSelection : true,
                        autoSelect : true,
                        editable : false,
                        allowBlank : false,
                        listeners : {
                            change : 'handleTableChange'
                        }
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Enable Audit'),
                        bind : {
                            hidden : '{!tableId}',
                            value : '{tableRecord.isAudited}'
                        },
                        hidden : true
                    }
                ]
            },

            {
                xtype : 'criterion_gridview',
                bind : {
                    store : '{metaFields}',
                    hidden : '{!tableId}'
                },
                hidden : true,
                flex : 1,

                tbar : null,

                rowEditing : false,

                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Column Name'),
                        dataIndex : 'name'
                    },
                    {
                        xtype : 'checkcolumn',
                        dataIndex : 'isAudited',
                        text : i18n.gettext('Enable Audit'),
                        width : 150,
                        bind : {
                            disabled : '{!tableRecord.isAudited}'
                        }
                    },
                    {
                        xtype : 'checkcolumn',
                        dataIndex : 'isRequired',
                        text : i18n.gettext('Required field'),
                        width : 150,
                        defaultRenderer : function(value, cellValues) {
                            if (value === 2) {
                                return i18n._('System');
                            }

                            let me = this,
                                cls = me.checkboxCls,
                                tip = '';

                            if (me.invert) {
                                value = !value;
                            }

                            if (me.disabled) {
                                cellValues.tdCls += ' ' + me.disabledCls;
                            }

                            if (value) {
                                cls += ' ' + me.checkboxCheckedCls;
                                tip = me.checkedTooltip;
                            } else {
                                tip = me.tooltip;
                            }

                            if (tip) {
                                cellValues.tdAttr += ' data-qtip="' + Ext.htmlEncode(tip) + '"';
                            }

                            if (me.useAriaElements) {
                                cellValues.tdAttr += ' aria-describedby="' + me.id + '-cell-description' +
                                    (!value ? '-not' : '') + '-selected"';
                            }

                            return '<span class="' + cls + '" role="' + me.checkboxAriaRole + '"' +
                                (!me.ariaStaticRoles[me.checkboxAriaRole] ? ' tabIndex="0"' : '') +
                                '></span>';
                        },
                        setRecordCheck : function(record, recordIndex, checked, cell) {
                            if (record.get('isRequired') === 2) {
                                return;
                            }

                            record.set('isRequired', checked ? 1 : 0);
                        }
                    }
                ]
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel',
                bind : {
                    disabled : '{!tableId}'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                handler : 'handleSave',
                bind : {
                    disabled : '{!tableId}'
                }
            }
        ]

    };

});

