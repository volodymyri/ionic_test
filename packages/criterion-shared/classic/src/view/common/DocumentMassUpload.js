Ext.define('criterion.view.common.DocumentMassUpload', function() {

    return {
        alias : 'widget.criterion_common_document_mass_upload',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.common.DocumentMassUpload'
        ],

        controller : {
            type : 'criterion_common_document_mass_upload'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                height : '80%'
            }
        ],

        modal : true,
        draggable : true,

        viewModel : {
            data : {
                mode : null, // see ATTACHMENTS_CONFIG.MODE_*,
                isCompanyDocument : null,
                documentLocation : null,
                currentEmployeeId : null,
                isMassEmployeeUpload : null,

                invalidManifestFormat : false,

                isManifestMode : true,
                hasManifest : false,
                hasFiles : false,

                uploadInProgress : false,
                manifestIssueText : ''
            },

            formulas : {
                columns : data => {
                    let employeeNumber = data('isMassEmployeeUpload') ? [
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Employee Number'),
                            dataIndex : 'employeeNumber',
                            flex : 1
                        }
                    ] : [];

                    let employeeGroupName = data('isMassEmployeeUpload') ? [
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Employee Group Name'),
                            dataIndex : 'employeeGroupName',
                            flex : 1
                        }
                    ] : [];

                    let uploadedColumn = data('isManifestMode') ? [
                        {
                            xtype : 'booleancolumn',
                            text : i18n.gettext('File'),
                            dataIndex : 'isUploaded',
                            align : 'center',
                            trueText : '✓',
                            falseText : 'x',
                            width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH
                        }
                    ] : [];

                    let statusColumn = data('uploadInProgress') ? [
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Status'),
                            dataIndex : 'status',
                            encodeHtml : false,
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                        }
                    ] : [];

                    return [
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Name'),
                            dataIndex : 'name',
                            flex : 1
                        },
                        ...employeeNumber,
                        ...employeeGroupName,
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Type'),
                            dataIndex : 'type',
                            flex : 1
                        },
                        {
                            xtype : 'booleancolumn',
                            text : i18n.gettext('Share'),
                            dataIndex : 'isShare',
                            align : 'center',
                            trueText : i18n.gettext('Yes'),
                            falseText : i18n.gettext('No'),
                            width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Folder'),
                            dataIndex : 'path',
                            flex : 1
                        },
                        ...uploadedColumn,
                        ...statusColumn
                    ]
                },

                closeBtnText : data => data('uploadInProgress') ? i18n.gettext('Close') : i18n.gettext('Cancel')
            },

            stores : {
                files : {
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'fileName',
                            type : 'string'
                        },
                        {
                            name : 'name',
                            type : 'string'
                        },
                        {
                            name : 'employeeNumber',
                            type : 'string'
                        },
                        {
                            name : 'employeeGroupName',
                            type : 'string'
                        },
                        {
                            name : 'documentTypeCd',
                            type : 'criterion_codedata',
                            codeDataId : criterion.consts.Dict.DOCUMENT_RECORD_TYPE
                        },
                        {
                            name : 'type',
                            type : 'criterion_codedatavalue',
                            referenceField : 'documentTypeCd'
                        },
                        {
                            name : 'isShare',
                            type : 'boolean'
                        },
                        {
                            name : 'path',
                            type : 'string'
                        },
                        {
                            name : 'isUploaded',
                            type : 'boolean'
                        },
                        {
                            name : 'status',
                            type : 'string'
                        }
                    ]
                }
            }
        },

        listeners : {
            afterrender : 'handleAfterRender'
        },

        title : i18n.gettext('Document Upload'),

        closable : false,

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                reference : 'closeBtn',
                handler : 'handleCancel',
                bind : {
                    text : '{closeBtnText}'
                }
            },
            {
                xtype : 'button',
                scale : 'small',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Start Upload'),
                handler : 'handleUpload',
                bind : {
                    disabled : '{!hasFiles}',
                    hidden : '{uploadInProgress}'
                }
            }
        ],

        items : [
            {
                xtype : 'container',
                layout : 'hbox',
                padding : 10,
                bind : {
                    hidden : '{uploadInProgress}'
                },
                items : [
                    {
                        xtype : 'filefield',
                        fieldLabel : i18n.gettext('Manifest File'),
                        name : 'document',
                        reference : 'document',
                        buttonText : i18n.gettext('Browse'),
                        buttonMargin : 6,
                        emptyText : i18n.gettext('Select manifest file'),
                        buttonOnly : false,
                        allowBlank : true,
                        width : 400,
                        hidden : true,
                        bind : {
                            hidden : '{!isManifestMode}'
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
                            onselectfile : 'handleSelectManifest'
                        }
                    },
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                        cls : 'criterion-btn-primary',
                        width : 60,
                        margin : '0 0 0 10',
                        tooltip : i18n.gettext('Download sample'),
                        handler : 'handleDownloadSample',
                        hidden : true,
                        bind : {
                            hidden : '{!isManifestMode}'
                        }
                    },
                    {
                        xtype : 'component',
                        reference : 'downloadAEl',
                        autoEl : {
                            tag : 'a',
                            href : Ext.manifest.resources.path + '/samples/manifest.xml',
                            download : 'manifest.xml'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'component',
                        flex : 1
                    },
                    {
                        xtype : 'criterion_multi_filebutton',
                        text : i18n.gettext('Add Files'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            change : 'handleAddFiles'
                        }
                    }
                ]
            },

            {
                xtype : 'container',
                layout : 'hbox',
                padding : 5,
                bind : {
                    hidden : '{uploadInProgress}'
                },
                items : [
                    {
                        xtype : 'component',
                        hidden : true,
                        flex : 1,
                        bind : {
                            hidden : '{!invalidManifestFormat}',
                            html : '<span class="criterion-red">' + i18n.gettext('Invalid Manifest Format!') + ' {manifestIssueText}</span>'
                        }
                    }
                ]
            },

            {
                xtype : 'component',
                reference : 'dropRegion',
                flex : 1,
                cls : 'upload-zone',
                bind : {
                    hidden : '{hasFiles || hasManifest}'
                },
                html : '<div class="upload-text">' +
                    '<span class="icon">&#' + criterion.consts.Glyph['ios7-cloud-upload'] + '</span>' +
                    '<span class="add-holder"></span>' +
                    '<span class="description">' + i18n.gettext('Drop files here') + '</span>' +
                    '</div>'
            },

            {
                xtype : 'criterion_gridpanel',
                flex : 1,
                border : '1 0 0 0',
                bind : {
                    hidden : '{!hasFiles && !hasManifest}',
                    columns : '{columns}',
                    store : '{files}'
                },

                viewConfig : {
                    markDirty : false
                },

                disableGrouping : true,
                tbar : null,
                reference : 'filesGrid'
            }
        ]

    };
});
