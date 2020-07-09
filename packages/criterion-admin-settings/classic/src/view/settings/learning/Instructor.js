Ext.define('criterion.view.settings.learning.Instructor', function() {

    var DICT = criterion.consts.Dict,
        CHANGE_LABEL = i18n.gettext('Change'),
        GENERATE_LABEL = i18n.gettext('Generate');

    return {

        alias : 'widget.criterion_settings_learning_instructor',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.learning.Instructor',
            'criterion.ux.form.trigger.Copy',
            'criterion.view.ux.form.field.PasswordField'
        ],

        controller : {
            type : 'criterion_settings_learning_instructor',
            externalUpdate : false
        },

        bodyPadding : 0,

        title : i18n.gettext('Instructor Details'),

        viewModel : {

            data : {
                record : null,
                passwordReadOnly : true,
                passwordButtonLabel : CHANGE_LABEL,
                instructorTypeId : criterion.Consts.INSTRUCTOR.TYPE.INTERNAL.ID
            },

            formulas : {

                isInternal : function(get) {
                    return get('instructorTypeId') === criterion.Consts.INSTRUCTOR.TYPE.INTERNAL.ID;
                },

                passwordButtonLabel : function(get) {
                    return get('passwordReadOnly') ? CHANGE_LABEL : GENERATE_LABEL;
                },

                isPhantom : function(get) {
                    return get('record.phantom');
                }
            },

            stores : {
                instructorTypes : {
                    data : [
                        {
                            id : criterion.Consts.INSTRUCTOR.TYPE.INTERNAL.ID,
                            text : criterion.Consts.INSTRUCTOR.TYPE.INTERNAL.LABEL
                        },
                        {
                            id : criterion.Consts.INSTRUCTOR.TYPE.EXTERNAL.ID,
                            text : criterion.Consts.INSTRUCTOR.TYPE.EXTERNAL.LABEL
                        }
                    ]
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                plugins : [
                    'criterion_responsive_column'
                ],

                bodyPadding : '25 10',

                defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_WIDER,

                items : [
                    {
                        xtype : 'combobox',
                        reference : 'instructorType',
                        fieldLabel : i18n.gettext('Type'),
                        allowBlank : false,
                        bind : {
                            store : '{instructorTypes}',
                            value : '{instructorTypeId}'
                        },
                        queryMode : 'local',
                        valueField : 'id',
                        listeners : {
                            change : 'handleInstructorTypeChange'
                        }
                    },
                    {
                        xtype : 'fieldcontainer',
                        fieldLabel : i18n.gettext('Name'),
                        layout : 'hbox',
                        bind : {
                            hidden : '{!isInternal}'
                        },
                        items : [
                            {
                                xtype : 'textfield',
                                flex : 1,
                                readOnlyCls : '',
                                readOnly : true,
                                reference : 'personName',
                                bind : {
                                    value : '{record.personName}'
                                },
                                allowBlank : false,
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        handler : 'onPersonClear',
                                        hideOnReadOnly : false,
                                        hideWhenEmpty : true
                                    }
                                }
                            },
                            {
                                xtype : 'button',
                                glyph : criterion.consts.Glyph['ios7-search'],
                                cls : 'criterion-btn-primary',
                                margin : '0 0 0 5',
                                listeners : {
                                    click : 'onPersonSearch'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Name'),
                        reference : 'name',
                        name : 'name',
                        allowOnlyWhitespace : false,
                        allowBlank : false,
                        bind : {
                            hidden : '{isInternal}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Company'),
                        reference : 'company',
                        name : 'company',
                        allowOnlyWhitespace : false,
                        allowBlank : false,
                        bind : {
                            hidden : '{isInternal}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('E-mail'),
                        reference : 'email',
                        name : 'emailAddress',
                        allowOnlyWhitespace : false,
                        allowBlank : false,
                        vtype : 'email',
                        bind : {
                            hidden : '{isInternal}'
                        }
                    },
                    {
                        xtype : 'criterion_person_phone_number',
                        fieldLabel : i18n.gettext('Phone Number'),
                        formatParams : {
                            countryCode : 'US'
                        },
                        bind : {
                            rawNumber : '{record.phoneNumber}',
                            displayNumber : '{record.phoneNumber}',
                            hidden : '{isInternal}'
                        }
                    },
                    {
                        xtype : 'fieldcontainer',
                        fieldLabel : i18n.gettext('Password'),
                        layout : 'hbox',
                        bind : {
                            hidden : '{isInternal}'
                        },
                        requiredMark : true,
                        items : [
                            {
                                xtype : 'criterion_passwordfield',
                                reference : 'password',
                                name : 'password',
                                enableTriggerClickOnReadOnly : true,
                                flex : 1,
                                bind : {
                                    readOnly : '{passwordReadOnly}',
                                    value : '{record.password}',
                                    allowBlank : '{isInternal || !isPhantom}'
                                }
                            },
                            {
                                xtype : 'button',
                                cls : 'criterion-btn-primary',
                                margin : '0 0 0 5',
                                bind : {
                                    text : '{passwordButtonLabel}'
                                },
                                handler : 'handleChangePassword'
                            }
                        ]
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Access URL'),
                        name : 'link',
                        editable : false,
                        triggers : {
                            copy : {
                                type : 'copy',
                                cls : 'criterion-copy-trigger-transparent'
                            }
                        },
                        bind : {
                            hidden : '{isInternal}'
                        }
                    }
                ]
            }
        ]
    }
});
