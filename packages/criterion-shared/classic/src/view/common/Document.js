Ext.define('criterion.view.common.Document', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_common_document',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.common.Document',
            'criterion.ux.form.FillableWebForm',
            'criterion.ux.form.FillableDataForm',
            'criterion.store.employee.document.Tree',
            'criterion.store.employeeGroup.EmployerDocuments'
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        controller : {
            type : 'criterion_common_document',
            externalUpdate : false
        },

        viewModel : {
            data : {
                allowChangeLocation : false,
                hideEmployeeGroups : true,
                shareText : i18n.gettext('Share')
            },
            stores : {
                employeeDocuments : {
                    type : 'criterion_employee_document_tree'
                },
                employeeGroupEmployerDocuments : {
                    type : 'criterion_employee_group_employer_document'
                },
                folders : {
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'integer',
                            allowNull : true
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ]
                }
            }
        },

        title : i18n.gettext('Document'),

        bodyPadding : '20 10',

        items : [
            {
                xtype : 'form',
                ref : 'mainForm',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                plugins : [
                    'criterion_responsive_column'
                ],
                layout : 'hbox',
                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Description'),
                                allowBlank : false,
                                name : 'description',
                                bind : {
                                    value : '{record.description}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                                fieldLabel : i18n.gettext('Type'),
                                name : 'documentTypeCd',
                                allowBlank : false,
                                hidden : true,
                                bind : {
                                    value : '{record.documentTypeCd}',
                                    hidden : '{record.isForm}',
                                    disabled : '{record.isForm}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                inputValue : true,
                                bind : {
                                    value : '{record.isShare}',
                                    fieldLabel : '{shareText}'
                                },
                                name : 'isShare'
                            },
                            {
                                xtype : 'criterion_employee_group_combobox',
                                reference : 'employeeGroupCombo',
                                fieldLabel : i18n._('Employee Groups'),
                                objectParam : 'employerDocumentId',
                                bind : {
                                    valuesStore : '{employeeGroupEmployerDocuments}',
                                    disabled : '{hideEmployeeGroups}',
                                    hidden : '{hideEmployeeGroups}'
                                }
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                margin : '10 0',
                hidden : true,
                bind : {
                    hidden : '{!allowChangeLocation}'
                }
            },

            {
                xtype : 'form',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                plugins : [
                    'criterion_responsive_column'
                ],
                layout : 'hbox',
                hidden : true,
                bind : {
                    hidden : '{!allowChangeLocation}'
                },
                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Document Location'),
                                displayField : 'description',
                                valueField : 'id',
                                allowBlank : false,
                                editable : false,
                                queryMode : 'local',
                                sortByDisplayField : false,
                                bind : {
                                    value : '{documentLocationCd}',
                                    store : '{employeeLevelDocumentLocations}'
                                },
                                listeners : {
                                    change : 'handleChangeDocumentLocation'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Folder'),
                                displayField : 'text',
                                valueField : 'id',
                                allowBlank : false,
                                editable : false,
                                queryMode : 'local',
                                sortByDisplayField : false,
                                encodeHtml : false,
                                bind : {
                                    store : '{folders}',
                                    value : '{parentDocumentId}',
                                    hidden : '{folders.count < 2}'
                                },
                                tpl : Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item">{description}</li>',
                                    '</tpl></ul>'),
                                displayTpl : Ext.create('Ext.XTemplate', '<tpl for=".">{text}</tpl>')
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'toggleslidefield',
                inputValue : true,
                fieldLabel : i18n.gettext('Fill Form'),
                margin : '20 0 0 15',
                hidden : true,
                bind : {
                    value : '{record.isFillForm}',
                    hidden : '{!record.isForm}'
                },
                listeners : {
                    change : 'handleFillFormChange'
                }
            },
            {
                xtype : 'criterion_fillable_webform',
                border : 1,
                style : {
                    borderColor : '#EEE',
                    borderStyle : 'solid',
                    borderWidth : 0
                },
                reference : 'webform',
                flex : 1,
                scrollable : true,
                editable : true,
                hidden : true,
                bind : {
                    hidden : '{!record.isForm || !record.isFillForm || record.isDataForm}'
                }
            },
            {
                xtype : 'criterion_fillable_dataform',
                border : 1,
                style : {
                    borderColor : '#EEE',
                    borderStyle : 'solid',
                    borderWidth : 0
                },
                reference : 'dataform',
                flex : 1,
                scrollable : true,
                editable : true,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                hidden : true,
                bind : {
                    hidden : '{!record.isForm || !record.isFillForm || !record.isDataForm}'
                }
            }
        ],

        getForm : function() {
            // bypassing web & data form which should processing in a separate process
            return this.down('form[ref=mainForm]').getForm();
        },

        loadRecord : function(record) {
            this.callParent(arguments);

            let vm = this.getViewModel(),
                hideEmployeeGroups = vm.get('hideEmployeeGroups'),
                parentDocumentId = +record.get('parentDocumentId'), // -> int
                documentLocationCd = record.get('documentLocationCd');

            !hideEmployeeGroups && this.lookup('employeeGroupCombo').loadValuesForRecord(record);

            vm.set({
                oldDocumentLocationCd : documentLocationCd,
                documentLocationCd
            });

            Ext.defer(_ => {
                vm.set({
                    oldParentDocumentId : parentDocumentId,
                    parentDocumentId
                });
            }, 200);
        }
    };

});
