Ext.define('criterion.view.settings.system.CodeTables', function() {

    var SYSTEM_TYPE = 1,
        USER_TYPE = 2,
        CUSTOM_TYPE = 3;

    return {

        alias : 'widget.criterion_settings_code_tables',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.CodeDataManager',
            'criterion.controller.settings.system.CodeTables',
            'criterion.view.codeTable.Detail',
            'criterion.view.codeTable.DetailForm',

            'criterion.ux.form.trigger.Clear'
        ],

        title : i18n.gettext('Code Tables'),

        controller : {
            type : 'criterion_settings_codetables'
        },

        listeners : {
            beforedeactivate : 'handleBeforeDeactivate',
            beforeactivate : 'handleBeforeActivate'
        },

        layout : 'fit',

        viewModel : {
            data : {
                codeTableName : null,
                employerId : null,
                type : SYSTEM_TYPE
            },

            formulas : {
                isSystem : function(data) {
                    return data('type') === SYSTEM_TYPE;
                },

                codeTableId : function(data) {
                    return criterion.CodeDataManager.getCodeTableIdByName(data('codeTableName'));
                },

                activateCreate : function(data) {
                    return data('type') === CUSTOM_TYPE && !data('codeTableId');
                },

                activateEdit : function(data) {
                    return data('type') === CUSTOM_TYPE && data('codeTableName') && data('codeTableId');
                }
            }
        },

        items : [
            {
                xtype : 'criterion_codetable_detail',
                reference : 'codetableDetailGrid',
                title : '',
                bind : {
                    type : '{type}',
                    employerId : '{employerId}'
                }
            }
        ],

        types : {
            SYSTEM : {
                text : i18n.gettext('System'),
                value : SYSTEM_TYPE
            },
            USER : {
                text : i18n.gettext('User'),
                value : USER_TYPE
            },
            CUSTOM : {
                text : i18n.gettext('Custom'),
                value : CUSTOM_TYPE
            }
        },

        initComponent : function() {
            var types = this.types;

            this.dockedItems = [
                {
                    xtype : 'panel',
                    dock : 'top',
                    cls : 'x-toolbar-default',
                    bodyPadding : '20 25',

                    bodyStyle : {
                        'border-width' : '0 0 1px 0 !important'
                    },

                    items : [
                        {
                            xtype : 'combobox',
                            fieldLabel : i18n.gettext('Type'),
                            labelWidth : 140,
                            width : 400,
                            store : Ext.create(
                                'Ext.data.Store',
                                {
                                    fields : ['type', 'text'],
                                    data : [
                                        {
                                            type : types.SYSTEM.value, text : types.SYSTEM.text
                                        },
                                        {
                                            type : types.USER.value, text : types.USER.text
                                        },
                                        {
                                            type : types.CUSTOM.value, text : types.CUSTOM.text
                                        }
                                    ]
                                }
                            ),
                            reference : 'codeTableType',
                            bind : {
                                value : '{type}'
                            },
                            listeners : {
                                change : 'handleChangeType'
                            },
                            valueField : 'type',
                            displayField : 'text',
                            forceSelection : true,
                            autoSelect : true,
                            editable : false,
                            queryMode : 'local'
                        },
                        {
                            xtype : 'container',
                            layout : {
                                type : 'hbox'
                            },
                            items : [
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.gettext('Table Name'),
                                    store : criterion.CodeDataManager.getCodeTablesStore(),
                                    queryMode : 'local',
                                    reference : 'codeTable',
                                    valueField : 'name',
                                    displayField : 'description',
                                    bind : {
                                        value : '{codeTableName}'
                                    },
                                    listeners : {
                                        change : 'handleChangeTable'
                                    },
                                    labelWidth : 140,
                                    width : 400,
                                    editable : false,
                                    margin : '0 10 0 0',
                                    triggers : {
                                        clear : {
                                            type : 'clear',
                                            hideWhenEmpty : true
                                        }
                                    }
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('New'),
                                    cls : 'criterion-btn-primary',
                                    handler : 'handleCreateNewTable',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!activateCreate}'
                                    }
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Edit'),
                                    cls : 'criterion-btn-primary',
                                    handler : 'handleEditTable',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!activateEdit}'
                                    }
                                }
                            ]
                        }

                    ]
                }
            ];

            this.callParent(arguments);
        }
    };

});
