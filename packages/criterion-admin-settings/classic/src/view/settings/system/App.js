Ext.define('criterion.view.settings.system.App', function() {

    const INTACCT_APP_IDENT = 'IntacctApp';

    return {

        alias : 'widget.criterion_settings_system_app',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.App'
        ],

        controller : {
            type : 'criterion_settings_system_app',
            externalUpdate : false
        },

        viewModel : {
            data : {
                externalSettingsExist : false
            },
            stores : {
                logLevels : {
                    fields : ['text', 'value'],
                    data : Ext.Object.getValues(criterion.Consts.LOG_LEVEL)
                }
            }
        },

        bodyPadding : 0,

        title : i18n.gettext('App Details'),

        setButtonConfig : function() {
            this.buttons = [
                {
                    xtype : 'button',
                    reference : 'delete',
                    text : i18n.gettext('Uninstall'),
                    cls : 'criterion-btn-remove',
                    listeners : {
                        click : 'handleDeleteClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableDelete}',
                        hidden : '{hideDelete}'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    reference : 'cancel',
                    cls : 'criterion-btn-light',
                    listeners : {
                        click : 'handleCancelClick'
                    },
                    hidden : true,
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handleSubmitClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableSave}',
                        text : '{submitBtnText}',
                        hidden : '{hideSave}'
                    }
                }
            ];
        },

        tbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Log'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleLogsView'
                }
            },
            {
                xtype : 'combobox',
                bind : {
                    store : '{record.customButtons}'
                },
                displayField : 'buttonName',
                valueField : 'id',
                queryMode : 'local',
                forceSelection : true,
                listeners : {
                    change : 'handleCustomButton'
                }
            }
        ],

        items : [
            {
                xtype : 'criterion_panel',

                bodyPadding : '0 10',

                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,
                plugins : [
                    'criterion_responsive_column'
                ],
                defaultType : 'container',

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                allowBlank : false,
                                bind : {
                                    value : '{record.name}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Vendor'),
                                allowBlank : false,
                                bind : {
                                    value : '{record.vendor}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('App Description'),
                                bind : {
                                    value : '{record.description}'
                                },
                                allowBlank : false,
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('End Point'),
                                allowBlank : false,
                                bind : {
                                    value : '{record.endpoint}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Version'),
                                allowBlank : false,
                                bind : {
                                    value : '{record.version}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Supported Version'),
                                allowBlank : false,
                                bind : {
                                    value : '{record.supportedVersion}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler'
            },
            {
                xtype : 'criterion_panel',

                title : i18n.gettext('Settings'),

                bodyPadding : '0 10',

                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                plugins : [
                    'criterion_responsive_column'
                ],

                defaultType : 'container',

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('User ID'),
                                bind : {
                                    value : '{record.appSettings.userId}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Password'),
                                bind : {
                                    value : '{record.appSettings.password}'
                                },
                                inputType : 'password'
                            }
                            // other fields from manifest
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Log Level'),
                                bind : {
                                    store : '{logLevels}',
                                    value : '{record.appSettings.logLevel}'
                                },
                                sortByDisplayField : false,
                                displayField : 'text',
                                valueField : 'value',
                                forceSelection : false,
                                editable : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Token'),
                                readOnly : true,
                                bind : {
                                    value : '{record.appSettings.token}'
                                }
                            }
                            // other fields from manifest
                        ]
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                hidden : true,
                bind : {
                    hidden : '{!externalSettingsExist}'
                }
            },
            {
                xtype : 'criterion_panel',

                title : i18n.gettext('Extended Settings'),

                bodyPadding : '0 10',

                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                plugins : [
                    'criterion_responsive_column'
                ],

                defaultType : 'container',

                hidden : true,

                bind : {
                    hidden : '{!externalSettingsExist}'
                },

                items : [
                    {
                        reference : 'columnOne',

                        items : [
                            // other fields from manifest
                        ]
                    },
                    {
                        reference : 'columnTwo',

                        items : [
                            // other fields from manifest
                        ]
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                hidden : true,
                bind : {
                    hidden : '{record.endpoint != "' + INTACCT_APP_IDENT + '"}' // it's hardcoded according D1-10309
                }
            },
            {
                xtype : 'criterion_panel',
                bodyPadding : 10,
                layout : 'hbox',
                hidden : true,
                bind : {
                    hidden : '{record.endpoint != "' + INTACCT_APP_IDENT + '"}' // it's hardcoded according D1-10309
                },
                items : [
                    {
                        xtype : 'button',
                        handler : 'handleSyncChart',
                        cls : 'criterion-btn-primary',
                        text : i18n.gettext('Sync Chart of Accounts,') + '<br>' + i18n.gettext('Projects Items, Locations')
                    },
                    {
                        xtype : 'button',
                        handler : 'handleSyncEmployees',
                        cls : 'criterion-btn-primary',
                        margin : '0 0 0 10',
                        text : i18n.gettext('Sync Employees, Hours') + '<br>' + i18n.gettext('worked, Dollars spent')
                    }
                ]
            }
        ]
    }

});
