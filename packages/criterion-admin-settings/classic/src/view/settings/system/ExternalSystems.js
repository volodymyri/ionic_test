Ext.define('criterion.view.settings.system.ExternalSystems', function() {

    const HIDE_IN_EXTERNAL_ATTRIBUTE = '1';

    return {
        alias : 'widget.criterion_settings_external_systems',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.system.ExternalSystems',
            'criterion.store.ExternalSystems'
        ],

        title : i18n.gettext('External Systems'),

        viewModel : {
            data : {
                externalSystem : null,
                externalSystemRecord : null
            },
            stores : {
                externalSystems : {
                    type : 'criterion_external_systems'
                }
            },
            formulas : {
                isAcumatica : function(get) {
                    return get('externalSystem.code') === criterion.Consts.GL_INTERFACE_EXPORT_TYPE.ACUMATICA;
                }
            }
        },

        controller : {
            type : 'criterion_settings_external_systems'
        },

        listeners : {
            scope : 'controller',
            show : 'handleShow'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'container',
                reference : 'externalFieldsContainer',
                margin : '10 0 0 20',
                items : [
                    {
                        xtype : 'criterion_code_detail_field',
                        fieldLabel : i18n.gettext('System Name'),
                        reference : 'systemField',
                        displayField : 'code',
                        forceSelection : false,
                        codeDataId : criterion.consts.Dict.EXTERNAL_SYSTEM_NAME,
                        listeners : {
                            change : 'handleExternalSystemChange'
                        },
                        filterFn : item => item.get('attribute2') !== HIDE_IN_EXTERNAL_ATTRIBUTE
                    },
                    {
                        xtype : 'textfield',
                        name : 'endPoint',
                        fieldLabel : i18n.gettext('End point'),
                        allowBlank : false,
                        bind : {
                            value : '{externalSystemRecord.endPoint}',
                            hidden : '{!externalSystemRecord}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'textfield',
                        name : 'userName',
                        fieldLabel : i18n.gettext('User name'),
                        allowBlank : false,
                        bind : {
                            value : '{externalSystemRecord.userName}',
                            hidden : '{!externalSystemRecord}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'textfield',
                        inputType : 'password',
                        name : 'password',
                        reference : 'password',
                        fieldLabel : i18n.gettext('Password'),
                        allowBlank : true,
                        bind : {
                            value : '{externalSystemRecord.password}',
                            hidden : '{!externalSystemRecord}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'filefield',
                        fieldLabel : i18n.gettext('SSH key'),
                        labelAlign : 'left',
                        name : 'sshKey',
                        reference : 'sshKey',
                        buttonText : i18n.gettext('Browse'),
                        buttonMargin : 6,
                        emptyText : i18n.gettext('Drop File here or browse'),
                        buttonOnly : false,
                        allowBlank : true,
                        bind : {
                            hidden : '{!externalSystemRecord}',
                            disabled : '{!externalSystemRecord}'
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
                        xtype : 'textfield',
                        name : 'attribute1',
                        bind : {
                            fieldLabel : '{externalSystem.attribute1}',
                            hidden : '{!externalSystem.attribute1}',
                            value : '{externalSystemRecord.attribute1}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'textfield',
                        name : 'attribute2',
                        bind : {
                            fieldLabel : '{externalSystem.attribute2}',
                            hidden : '{!externalSystem.attribute2}',
                            value : '{externalSystemRecord.attribute2}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'textfield',
                        name : 'attribute3',
                        bind : {
                            fieldLabel : '{externalSystem.attribute3}',
                            hidden : '{!externalSystem.attribute3}',
                            value : '{externalSystemRecord.attribute3}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'button',
                        margin : '0 10 0 0',
                        bind : {
                            text : i18n.gettext('Sync Employees'),
                            hidden : '{!isAcumatica}'
                        },
                        hidden : true,
                        handler : 'onSyncEmployees'
                    },
                    {
                        xtype : 'button',
                        bind : {
                            text : i18n.gettext('Sync Locations, Areas and Tasks'),
                            hidden : '{!isAcumatica}'
                        },
                        hidden : true,
                        handler : 'onSyncCriterionData'
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
                    disabled : '{!externalSystem}'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                handler : 'handleSave',
                bind : {
                    disabled : '{!externalSystem}'
                }
            }
        ]
    };
});
