Ext.define('criterion.view.settings.General', function() {

    const DOCUMENT_LOCATION_TYPE = criterion.Consts.DOCUMENT_LOCATION_TYPE,
        EMPLOYER_DOCUMENT_ACCESS_TYPE = criterion.Consts.EMPLOYER_DOCUMENT_ACCESS_TYPE;

    return {

        alias : 'widget.criterion_settings_general',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.common.Documents',
            'criterion.view.common.DocumentTree',
            'criterion.controller.settings.general.DocumentTree',
            'criterion.view.settings.general.*',
            'criterion.store.DocumentLocations',
            'criterion.store.employer.form.Tree',
            'Ext.tree.plugin.TreeViewDragDrop'
        ],

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('General'),

        viewModel : {
            data : {
                documentLocation : null,
                currentEmployeeName : i18n.gettext('- Select an Employee -'),
                currentEmployeeId : null
            },

            stores : {
                documentLocations : {
                    type : 'criterion_document_locations'
                },
                employeeLevelDocumentLocations : {
                    type : 'criterion_document_locations'
                }
            },

            formulas : {
                isCompanyDocument : data => data('documentLocation') === DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT,

                isCompanyForm : data => data('documentLocation') === DOCUMENT_LOCATION_TYPE.COMPANY_FORM,

                allowAdding : data => (!(data('isCompanyDocument') || data('isCompanyForm')) ? !!data('currentEmployeeId') : true)
            }
        },

        constructor : function() {
            let store = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.DOCUMENT_LOCATIONS.storeId);

            this.callParent(arguments);

            if (!store.isLoaded()) {
                Ext.GlobalEvents.on('baseStoresLoaded', this.prepareDocumentLocations, this);
            } else {
                this.prepareDocumentLocations();
            }
        },

        prepareDocumentLocations : function() {
            let store = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.DOCUMENT_LOCATIONS.storeId),
                vm = this.getViewModel(),
                documentLocations = vm.getStore('documentLocations');

            store.cloneToStore(documentLocations);
            store.cloneToStore(vm.getStore('employeeLevelDocumentLocations'));

            documentLocations.insert(0, [
                {
                    id : DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT,
                    description : i18n.gettext('Company Documents'),
                    isCompanyDocument : true
                },
                {
                    id : DOCUMENT_LOCATION_TYPE.COMPANY_FORM,
                    description : i18n.gettext('Company Forms'),
                    isCompanyDocument : true
                }
            ]);

            vm.set('documentLocation', DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT);
        },

        items : [
            {
                xtype : 'criterion_common_document_tree',
                cls : 'criterion-grid-panel criterion-grid-panel-settings_toolbar',

                viewConfig : {
                    plugins : {
                        ptype : 'treeviewdragdrop',
                        enableDrag : true,
                        enableDrop : true
                    }
                },

                viewModel : {
                    data : {
                        isCommonDocument : true,

                        employerFormGridColumns : [
                            {
                                xtype : 'treecolumn',
                                text : 'Name',
                                dataIndex : 'description',
                                flex : 3,
                                sortable : true
                            },
                            {
                                xtype : 'criterion_actioncolumn',
                                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2,
                                items : [
                                    {
                                        glyph : criterion.consts.Glyph['android-create'],
                                        tooltip : i18n.gettext('Edit'),
                                        action : 'editaction',
                                        getClass : function(value, metaData) {
                                            return 'edit-btn';
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
                    },

                    stores : {
                        employerFormTree : {
                            type : 'criterion_employer_form_tree',
                            listeners : {
                                load : function(store) {
                                    store.getRoot().expand();
                                }
                            }
                        }
                    },

                    formulas : {
                        documentGridColumns : (data) => {
                            let isCompanyDocument = data('isCompanyDocument'),
                                companyDocumentColumns = [];

                            if (isCompanyDocument) {
                                companyDocumentColumns.push({
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Access'),
                                    dataIndex : 'access',
                                    width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH,
                                    align : 'center',
                                    encodeHtml : false,
                                    renderer : function(value) {
                                        let itemClass, itemTooltip;

                                        switch (value) {
                                            case EMPLOYER_DOCUMENT_ACCESS_TYPE.FULL.value:
                                                itemClass = EMPLOYER_DOCUMENT_ACCESS_TYPE.FULL.glyph;
                                                itemTooltip = EMPLOYER_DOCUMENT_ACCESS_TYPE.FULL.tooltip;
                                                break;
                                            case EMPLOYER_DOCUMENT_ACCESS_TYPE.PARTIAL.value:
                                                itemClass = EMPLOYER_DOCUMENT_ACCESS_TYPE.PARTIAL.glyph;
                                                itemTooltip = EMPLOYER_DOCUMENT_ACCESS_TYPE.PARTIAL.tooltip;
                                                break;
                                            case EMPLOYER_DOCUMENT_ACCESS_TYPE.DENIED.value:
                                                itemClass = EMPLOYER_DOCUMENT_ACCESS_TYPE.DENIED.glyph;
                                                itemTooltip = EMPLOYER_DOCUMENT_ACCESS_TYPE.DENIED.tooltip;
                                                break;
                                        }

                                        return (itemClass && itemTooltip) ?
                                            ' <span style="font-family:Ionicons" data-qtip="' + itemTooltip + '">'
                                            + '&#' + criterion.consts.Glyph[itemClass]
                                            + '</span>' : '';
                                    }
                                })
                            }

                            return [
                                {
                                    xtype : 'treecolumn',
                                    text : 'Name',
                                    dataIndex : 'description',
                                    flex : 3,
                                    sortable : true
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Type'),
                                    dataIndex : 'documentTypeCd',
                                    flex : 2,
                                    renderer : (value, metaData, record) => record.get('isFolder') ? '' : record.get('documentTypeDesc')
                                },
                                {
                                    xtype : 'datecolumn',
                                    dataIndex : 'dueDate',
                                    text : i18n.gettext('Due Date'),
                                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('File Name'),
                                    dataIndex : 'fileName',
                                    flex : 2
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Size'),
                                    dataIndex : 'size',
                                    align : 'right',
                                    formatter : 'criterionFileSize',
                                    flex : 1
                                },
                                {
                                    xtype : 'datecolumn',
                                    dataIndex : 'uploadDate',
                                    text : i18n.gettext('Upload Date'),
                                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                                },
                                {
                                    xtype : 'booleancolumn',
                                    header : i18n.gettext('Share'),
                                    align : 'center',
                                    dataIndex : 'isShare',
                                    trueText : '✓',
                                    falseText : '',
                                    width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH
                                },
                                ...companyDocumentColumns,
                                {
                                    xtype : 'criterion_actioncolumn',
                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2.5,
                                    items : [
                                        {
                                            glyph : criterion.consts.Glyph['android-create'],
                                            tooltip : i18n.gettext('Edit'),
                                            action : 'editaction',
                                            getClass : function(value, metaData) {
                                                return 'edit-btn';
                                            }
                                        },
                                        {
                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                            tooltip : i18n.gettext('Delete'),
                                            action : 'removeaction'
                                        },
                                        {
                                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                                            tooltip : i18n.gettext('Download'),
                                            action : 'viewaction',
                                            permissionAction : function(v, cellValues, record) {
                                                return record.get('leaf');
                                            }
                                        }
                                    ]
                                }
                            ];
                        },

                        gridColumns : data => data('isCommonDocument') ? data('documentGridColumns') : data('employerFormGridColumns'),

                        isCompanyDocument : data => data('documentLocation') === DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT,
                        isEmployeeDocument : data => data('documentLocation') !== DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT && data('documentLocation') !== DOCUMENT_LOCATION_TYPE.COMPANY_FORM
                    }
                },

                mode : criterion.Consts.ATTACHMENTS_CONFIG.MODE_ADMIN,
                uploadUrl : criterion.consts.Api.API.EMPLOYER_DOCUMENT_UPLOAD,

                dockedItems : [
                    {
                        xtype : 'toolbar',
                        dock : 'top',
                        items : [
                            {
                                xtype : 'criterion_settings_employer_bar',
                                context : 'criterion_settings'
                            },
                            '->',
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Document Location'),
                                labelWidth : 160,
                                margin : '0 20 0 0',
                                displayField : 'description',
                                valueField : 'id',
                                allowBlank : false,
                                editable : false,
                                queryMode : 'local',
                                sortByDisplayField : false,
                                bind : {
                                    store : '{documentLocations}',
                                    value : '{documentLocation}'
                                },
                                tpl : Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain">',
                                    '<tpl for=".">',
                                    '<li role="option" class="x-boundlist-item {[values.isCompanyDocument ? \'combo-group-wrapper-bottom\' : \'\']}">',
                                    '{description}',
                                    '</li>',
                                    '</tpl>',
                                    '</ul>'
                                ),
                                listeners : {
                                    change : 'handleChangeDocumentLocation'
                                }
                            },
                            {
                                xtype : 'criterion_splitbutton',
                                width : 120,
                                reference : 'addButton',
                                text : i18n.gettext('Add'),
                                cls : 'criterion-btn-feature',
                                handler : 'handleAddClick',
                                menu : [
                                    {
                                        text : i18n.gettext('Add Folder'),
                                        handler : 'handleAddFolder'
                                    },
                                    {
                                        text : i18n.gettext('Mass Upload'),
                                        handler : 'handleMassUpload',
                                        hidden : true,
                                        bind : {
                                            hidden : '{isCompanyForm}'
                                        }
                                    }
                                ]
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
                        ]
                    },
                    {
                        xtype : 'toolbar',
                        dock : 'top',
                        items : [
                            '->',
                            {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                fieldLabel : i18n.gettext('Employee'),
                                labelWidth : 100,
                                width : 322,
                                margin : '0 175 0 0',
                                hidden : true,
                                bind : {
                                    hidden : '{isCompanyDocument || isCompanyForm}'
                                },
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        readOnly : true,
                                        bind : {
                                            value : '{currentEmployeeName}'
                                        },
                                        readOnlyCls : Ext.baseCSSPrefix + 'form-readonly'
                                    },
                                    {
                                        xtype : 'button',
                                        scale : 'small',
                                        margin : '0 0 0 3',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        listeners : {
                                            click : 'handleEmployeeSearch'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ],

                tbar : null,

                controller : {
                    type : 'criterion_settings_document_tree',
                    connectParentView : true,
                    loadRecordOnEdit : false,
                    reloadAfterEditorSave : true,
                    reloadAfterEditorDelete : true
                },
                reference : 'documents'
            },
            {
                xtype : 'criterion_settings_general_videos',
                reference : 'videos'
            },
            {
                xtype : 'criterion_settings_general_forms',
                reference : 'forms'
            },
            {
                xtype : 'criterion_settings_ess_links',
                reference : 'links'
            }
        ]
    };

});
