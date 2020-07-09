Ext.define('criterion.view.settings.system.PasswordPolicies', function() {

    var PASSWORD_COMPLEXITY = criterion.Consts.PASSWORD_COMPLEXITY;

    function complexityItems() {
        var res = [];

        Ext.Object.each(PASSWORD_COMPLEXITY, function(key, item) {
            res.push({
                boxLabel : item.name,
                name : key,
                inputValue : item.value,
                disableDirtyCheck : true
            });
        });

        return res;
    }

    return {

        alias : 'widget.criterion_settings_password_policies',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.system.PasswordPolicies',
            'criterion.store.PasswordPolicies'
        ],

        controller : {
            type : 'criterion_settings_password_policies'
        },

        viewModel : {
            data : {
                policy : null
            },

            stores : {
                passwordPolicies : {
                    type : 'criterion_password_policies'
                }
            },

            formulas : {
                sessionEnable : {
                    get : function(data) {
                        return !!data('policy.sessionTimeout');
                    },
                    set : function(value) {
                        this.set('policy.sessionTimeout', (value ? 15 : 0));
                    }
                },

                attemptsEnable : {
                    get : function(data) {
                        return !!data('policy.maximumAttempts');
                    },
                    set : function(value) {
                        this.set('policy.maximumAttempts', (value ? 5 : 0));
                    }
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        items : [
            {
                xtype : 'criterion_panel',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_WIDER,

                bodyPadding : '25 10 10',

                items : [
                    {
                        xtype : 'checkboxgroup',
                        fieldLabel : i18n.gettext('Password Complexity'),
                        disableDirtyCheck : true,
                        bind : {
                            value : '{policy.complexityCheck}'
                        },
                        columns : 1,
                        vertical : true,
                        items : complexityItems()
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : {
                            type : 'hbox',
                            align : 'middle'
                        },
                        fieldLabel : i18n.gettext('Minimum Password Length'),
                        items : [
                            {
                                xtype : 'numberfield',
                                minValue : 5,
                                maxValue : 15,
                                allowBlank : false,
                                bind : '{policy.minimumLength}'
                            },
                            {
                                xtype : 'component',
                                padding : '0 10',
                                html : i18n.gettext('characters')
                            }
                        ]
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : {
                            type : 'hbox',
                            align : 'middle'
                        },
                        fieldLabel : i18n.gettext('Maximum Password Age'),
                        items : [
                            {
                                xtype : 'numberfield',
                                minValue : 0,
                                maxValue : 365,
                                allowBlank : false,
                                bind : '{policy.maximumAge}'
                            },
                            {
                                xtype : 'component',
                                padding : '0 10',
                                html : i18n.gettext('days')
                            }
                        ]
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : {
                            type : 'hbox',
                            align : 'middle'
                        },
                        fieldLabel : i18n.gettext('Maximum Failed Attempts'),
                        items : [
                            {
                                xtype : 'numberfield',
                                flex : 1,
                                minValue : 5,
                                maxValue : 20,
                                allowBlank : false,
                                bind : {
                                    value : '{policy.maximumAttempts}',
                                    disabled : '{!policy.maximumAttempts}'
                                }
                            },
                            {
                                xtype : 'component',
                                padding : '0 10',
                                width : 70,
                                html : ''
                            },

                            {
                                xtype : 'toggleslidefield',
                                flex : 1,
                                margin : '0 0 0 30',
                                labelWidth : 50,
                                fieldLabel : i18n.gettext('Enable'),
                                bind : {
                                    value : '{attemptsEnable}'
                                }
                            }
                        ]
                    },

                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Allow Password Reuse'),
                        bind : '{policy.allowReuse}'
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : {
                            type : 'hbox',
                            align : 'middle'
                        },
                        fieldLabel : i18n.gettext('Session Timeout'),
                        items : [
                            {
                                xtype : 'numberfield',
                                flex : 1,
                                minValue : 15,
                                maxValue : 7200, // 5 days
                                allowBlank : false,
                                bind : {
                                    value : '{policy.sessionTimeout}',
                                    disabled : '{!policy.sessionTimeout}'
                                }
                            },
                            {
                                xtype : 'component',
                                padding : '0 10',
                                width : 70,
                                html : i18n.gettext('minutes')
                            },

                            {
                                xtype : 'toggleslidefield',
                                flex : 1,
                                margin : '0 0 0 30',
                                labelWidth : 50,
                                fieldLabel : i18n.gettext('Enable'),
                                bind : {
                                    value : '{sessionEnable}'
                                }
                            }
                        ]
                    }
                ]
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancelClick'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleSubmitClick'
                }
            }
        ]
    };

});
