Ext.define('criterion.view.settings.general.DataForm', function() {

    const EN = criterion.Consts.LOCALIZATION_LANGUAGE_EN;

    return {

        alias : 'widget.criterion_settings_general_dataform',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.general.DataForm',
            'criterion.controller.settings.general.dataForm.FieldsGrid',
            'criterion.store.Workflows',
            'criterion.store.EmployeeGroups'
        ],

        controller : {
            type : 'criterion_settings_general_data_form',
            externalUpdate : false
        },

        allowDelete : true,
        allowNavigate : false,

        bodyPadding : 0,

        title : i18n.gettext('Data Form Details'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        header : {
            title : i18n.gettext('Data Form'),
            padding : '10 10 10 15',
            margin : 0,
            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Assign'),
                    handler : 'handleAssignForm',
                    hidden : true,
                    bind : {
                        hidden : '{isPhantom}'
                    }
                }
            ]
        },

        viewModel : {
            stores : {
                workflows : {
                    type : 'criterion_workflows',
                    autoLoad : true,
                    filters : [
                        {
                            property : 'workflowTypeCode',
                            value : criterion.Consts.WORKFLOW_TYPE_CODE.FORM
                        }
                    ]
                },
                employeeGroups : {
                    type : 'criterion_employee_groups',
                    autoLoad : true
                }
            },

            formulas : {
                description : {
                    get : function(get) {
                        let code = get('languageField.selection.code') || EN;

                        return get('record.description')[code] || '';
                    },
                    set : function(val) {
                        if (val === '[object Object]') {
                            return;
                        }

                        let code = this.get('languageField.selection.code') || EN,
                            descriptionObj = Ext.clone(this.get('record.description'));

                        descriptionObj[code] = val;

                        this.get('record').set('description', Ext.encode(descriptionObj));
                    }
                }
            }
        },

        items : [
            {
                xtype : 'container',
                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                name : 'name',
                                bind : '{record.name}',
                                allowBlank : false
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Type'),
                                codeDataId : criterion.consts.Dict.DOCUMENT_RECORD_TYPE,
                                name : 'documentTypeCd',
                                bind : '{record.documentTypeCd}',
                                allowBlank : false,
                                forceSelection : false,
                                editable : false
                            },
                            {
                                xtype : 'combobox',
                                reference : 'workflowField',
                                fieldLabel : i18n.gettext('Workflow'),
                                bind : {
                                    store : '{workflows}',
                                    value : '{record.workflowId}'
                                },
                                forceSelection : true,
                                displayField : 'name',
                                valueField : 'id',
                                editable : true,
                                allowBlank : true,
                                queryMode : 'local',
                                emptyText : i18n.gettext('Not Selected')
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                inputValue : true,
                                fieldLabel : i18n.gettext('Share with Employee'),
                                bind : '{record.shareWithEmployee}'
                            },
                            {
                                xtype : 'tagfield',
                                fieldLabel : i18n.gettext('Initiate by Employee'),
                                bind : {
                                    store : '{employeeGroups}',
                                    value : '{record.initiateByEmployee}'
                                },
                                forceSelection : true,
                                allowBlank : true,
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'name'
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Description'),
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        bind : {
                                            value : '{description}'
                                        }
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        reference : 'languageField',
                                        codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                                        valueCode : EN,
                                        width : 120
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_gridview',
                flex : 1,

                bind : {
                    store : '{record.formFields}'
                },

                controller : {
                    type : 'criterion_settings_general_data_form_fields_grid',
                    connectParentView : false,
                    editor : {
                        xtype : 'criterion_customdata_editor',
                        controller : {
                            externalUpdate : true
                        },
                        modal : true,
                        plugins : [
                            {
                                ptype : 'criterion_sidebar',
                                height : 'auto',
                                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                                modal : true
                            }
                        ],
                        draggable : true
                    }
                },

                tbar : [
                    '->',
                    {
                        xtype : 'button',
                        reference : 'addButton',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddClick'
                        }
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Show Hidden'),
                        margin : '0 10 0 20',
                        labelWidth : 100,
                        reference : 'showHidden',
                        inputValue : '1',
                        listeners : {
                            change : 'handleChangeShowHidden'
                        }
                    }
                ],

                viewConfig : {
                    markDirty : false
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Sequence'),
                        dataIndex : 'sequenceNumber',
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Label'),
                        dataIndex : 'label',
                        flex : 2
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Code'),
                        dataIndex : 'code',
                        flex : 2
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Data Type'),
                        flex : 2,
                        dataIndex : 'dataTypeCd',
                        codeDataId : criterion.consts.Dict.DATA_TYPE
                    },
                    {
                        xtype : 'booleancolumn',
                        text : i18n.gettext('Hidden'),
                        flex : 1,
                        dataIndex : 'isHidden',
                        trueText : '✓',
                        falseText : ''
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 3,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                                tooltip : i18n.gettext('Move Up'),
                                text : '',
                                action : 'moveupaction',
                                getClass : function(value, metaData, record, rowIndex, colIndex, gridView) {
                                    let store = gridView.store;

                                    if (!record || (record.get('sequenceNumber') === (store.min('sequenceNumber') || 0))) {
                                        return 'pseudo-disabled'
                                    }
                                },
                                isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                                    let store = view.getStore();

                                    return !record || (record.get('sequenceNumber') === (store.min('sequenceNumber') || 0))
                                }

                            },
                            {
                                glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                                tooltip : i18n.gettext('Move Down'),
                                text : '',
                                action : 'movedownaction',
                                getClass : function(value, metaData, record, rowIndex, colIndex, gridView) {
                                    let store = gridView.store;

                                    if (!record || (record.get('sequenceNumber') === (store.max('sequenceNumber') || 0))) {
                                        return 'pseudo-disabled'
                                    }
                                },
                                isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                                    let store = view.getStore();

                                    return !record || (record.get('sequenceNumber') === (store.max('sequenceNumber') || 0))
                                }
                            },
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction'
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
