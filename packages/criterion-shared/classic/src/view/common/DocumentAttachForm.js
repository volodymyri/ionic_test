Ext.define('criterion.view.common.DocumentAttachForm', function() {

    const FILE_TYPE = criterion.Consts.DOCUMENT_FILE_TYPE;

    return {
        alias : 'widget.criterion_common_document_attach_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.common.DocumentAttachForm',
            'criterion.store.Forms',
            'criterion.store.Workflows'
        ],

        controller : {
            type : 'criterion_common_document_attach_form'
        },

        config : {
            employeeId : null,
            documentLocation : null,
            employerId : null,
            mode : null,
            parentNodeId : null,
            uploadUrl : null
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],
        modal : true,
        draggable : true,

        viewModel : {
            data : {
                fileType : FILE_TYPE.DOCUMENT,
                assignedEmployeeName : null,
                assignedEmployeeId : null
            },
            formulas : {
                isCompanyForm : function(get) {
                    return get('fileType') === FILE_TYPE.COMPANY_FORM;
                }
            },
            stores : {
                workflows : {
                    type : 'criterion_workflows',
                    filters : [
                        {
                            property : 'workflowTypeCode',
                            value : criterion.Consts.WORKFLOW_TYPE_CODE.FORM
                        }
                    ]
                },
                forms : {
                    type : 'criterion_forms'
                }
            }
        },

        title : i18n.gettext('Add Document'),

        closable : false,

        listeners : {
            afterrender : 'handleAfterRender',
            show : 'handleShow'
        },

        scrollable : 'vertical',

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                reference : 'closeBtn',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                scale : 'small',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Add'),
                handler : 'handleAttach'
            }
        ],

        initComponent : function() {
            let documentLocation = this.getDocumentLocation(),
                documentLocationCode = documentLocation && criterion.CodeDataManager.getValue(documentLocation, criterion.consts.Dict.DOCUMENT_LOCATION_TYPE, 'code');

            this.items = [
                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('File Type'),
                    editable : false,
                    forceSelection : true,
                    autoSelect : true,
                    bind : '{fileType}',
                    store : [
                        [FILE_TYPE.DOCUMENT, 'Document'],
                        [FILE_TYPE.COMPANY_FORM, 'Form']
                    ],
                    hidden : this.getMode() !== criterion.Consts.ATTACHMENTS_CONFIG.MODE_PERSON
                },
                {
                    xtype : 'filefield',
                    fieldLabel : i18n.gettext('File Name'),
                    name : 'document',
                    reference : 'document',
                    buttonText : i18n.gettext('Browse'),
                    buttonMargin : 6,
                    emptyText : i18n.gettext('Drop File here or browse'),
                    buttonOnly : false,
                    allowBlank : false,
                    bind : {
                        hidden : '{isCompanyForm}',
                        disabled : '{isCompanyForm}'
                    },
                    listeners : {
                        change : function(fld, value) {
                            var newValue = value.replace(/C:\\fakepath\\/g, '');

                            fld.setRawValue(newValue);
                        },
                        afterrender : function(cmp) {
                            cmp.fileInputEl.on('change', function(event) {
                                cmp.fireEvent('onselectfile', event, cmp);
                            });
                        },
                        onselectfile : 'handleSelectFile'
                    }
                },
                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('Form Name'),
                    reference : 'formName',
                    name : 'formId',
                    editable : false,
                    autoSelect : true,
                    allowBlank : false,
                    valueField : 'formId',
                    displayField : 'name',
                    queryMode : 'local',
                    bind : {
                        store : '{forms}',
                        hidden : '{!isCompanyForm}',
                        disabled : '{!isCompanyForm}',
                        value : '{formId}'
                    },
                    listeners : {
                        change : 'handleChangeFormName'
                    }
                },
                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('Workflow'),
                    editable : false,
                    forceSelection : true,
                    autoSelect : true,
                    name : 'workflowId',
                    reference : 'workflow',
                    allowBlank : false,
                    hidden : true,
                    bind : {
                        value : '{workflowId}',
                        store : '{workflows}',
                        hidden : '{!isCompanyForm}',
                        disabled : '{!isCompanyForm}'
                    },
                    displayField : 'name',
                    valueField : 'id'
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    fieldLabel : i18n.gettext('Assigned to fill'),
                    hidden : true,
                    bind : {
                        hidden : '{!isCompanyForm}'
                    },
                    items : [
                        {
                            xtype : 'textfield',
                            flex : 1,
                            editable : false,
                            bind : {
                                value : '{assignedEmployeeName}'
                            },
                            cls : Ext.baseCSSPrefix + 'form-readonly',
                            triggers : {
                                clear : {
                                    type : 'clear',
                                    cls : 'criterion-clear-trigger',
                                    hideWhenEmpty : true,
                                    handler : 'handleClearAssignedEmployee'
                                }
                            }
                        },
                        {
                            xtype : 'button',
                            scale : 'small',
                            margin : '0 0 0 3',
                            cls : 'criterion-btn-light',
                            glyph : criterion.consts.Glyph['ios7-search'],
                            disabled : true,
                            bind : {
                                disabled : '{!workflowId}'
                            },
                            listeners : {
                                click : 'handleEmployeeSearch'
                            }
                        }
                    ]
                },
                {
                    xtype : 'criterion_code_detail_field',
                    fieldLabel : i18n.gettext('Document Type'),
                    codeDataId : criterion.consts.Dict.DOCUMENT_RECORD_TYPE,
                    name : 'documentTypeCd',
                    reference : 'documentTypeCd',
                    allowBlank : false,
                    forceSelection : false,
                    editable : false,
                    bind : Ext.merge({
                        hidden : '{isCompanyForm}',
                        disabled : '{isCompanyForm}'
                    }, documentLocation ? {
                        filterValues : {
                            attribute : 'attribute1',
                            value : documentLocationCode
                        }
                    } : {})
                },
                {
                    xtype : 'textfield',
                    name : 'description',
                    reference : 'description',
                    allowBlank : false,
                    fieldLabel : i18n.gettext('Description')
                },
                {
                    xtype : 'datefield',
                    fieldLabel : i18n.gettext('Due Date'),
                    name : 'dueDate',
                    reference : 'dueDate',
                    allowBlank : false,
                    bind : {
                        value : '{dueDate}',
                        hidden : '{!isCompanyForm}',
                        disabled : '{!isCompanyForm}'
                    }
                },
                {
                    xtype : 'toggleslidefield',
                    inputValue : true,
                    fieldLabel : this.getMode() === criterion.Consts.ATTACHMENTS_CONFIG.MODE_PERSON ? i18n.gettext('Share with employee') : i18n.gettext('Public'),
                    name : 'isShare',
                    reference : 'isShare'
                }
            ];

            this.callParent(arguments);
        }
    };
});
