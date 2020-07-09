Ext.define('criterion.view.employer.CompanyForm', function() {

    var separatorTpl = Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{text}&nbsp;</li>',
        '</tpl></ul>'
    );

    return {
        alias : 'widget.criterion_employer_company_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.employer.CompanyForm',
            'criterion.view.employer.CompanyLogo',
            'criterion.store.employer.WorkLocations',
            'Ext.ux.colorpick.Field',
            'criterion.view.CustomFieldsContainer'
        ],

        controller : {
            type : 'criterion_employer_company_form',
            externalUpdate : false
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 0,

        header : {
            title : i18n.gettext('Employer Details'),

            items : [
                {
                    xtype : 'component',
                    flex : 1
                },
                {
                    xtype : 'combo',
                    width : 250,
                    margin : '0 20 0 0',
                    store : {
                        fields : ['text', 'action'],
                        data : [
                            {
                                text : i18n.gettext('Create Employee Login'),
                                action : 'create_employee_login'
                            }
                        ]
                    },
                    listeners : {
                        change : 'handleSelectAction'
                    },
                    hidden : true,
                    bind : {
                        hidden : '{!editMode}'
                    },
                    sortByDisplayField : false,
                    displayField : 'text',
                    valueField : 'action',
                    forceSelection : false,
                    allowBlank : true,
                    editable : false,
                    emptyText : i18n.gettext('Select the action')
                }
            ]
        },

        viewModel : {
            data : {
                editMode : false
            },
            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations',
                    listeners : {
                        load : 'handleEmployerWorkLocationLoaded'
                    }
                },
                separators : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ],
                    data : Ext.Array.map(criterion.Consts.SEPARATORS, function(separator) {
                        return {
                            text : separator
                        };
                    })
                }
            },
            formulas : {
                employerWorkLocationsValue : {
                    bind : {
                        bindTo : '{record.employerWorkLocations}',
                        deep : true
                    },
                    get : function(bind) {
                        var employerWorkLocations = bind,
                            primaryLocation = employerWorkLocations.findRecord('isPrimary', true);

                        return primaryLocation && primaryLocation.get('description') + ((employerWorkLocations.count() > 1) ? ', ...' : '');
                    }
                },
                hasOnlyOneActive : function(get) {
                    var record = get('record'),
                        employersStore = record && record.store;

                    if (employersStore) {
                        var activeEmployersCount = 0;

                        employersStore.each(function(employer) {
                            if (employer.get('isActive')) {
                                activeEmployersCount++;
                            }
                        });

                        return activeEmployersCount === 1;
                    }

                    return false;
                }
            }
        },

        scrollable : true,

        initComponent : function() {
            this.items = [
                {
                    xtype : 'container',
                    width : 250,
                    height : 130,

                    margin : '25 25 0',

                    bind : {
                        hidden : '{!editMode}'
                    },
                    split : true,
                    title : false,
                    frame : true,
                    items : [
                        {
                            xtype : 'criterion_settings_company_logo',
                            width : 240,
                            height : 120,
                            reference : 'companyLogo',
                            listeners : {
                                logoUploadSuccess : 'handleLogoUploadSuccess'
                            }
                        }
                    ]
                },
                {
                    items : [
                        {
                            layout : 'hbox',

                            bodyPadding : '0 10',

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Company Name'),
                                            name : 'legalName',
                                            allowBlank : false
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Alternative Name'),
                                            name : 'alternativeName'
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('National Identifier'),
                                            name : 'nationalIdentifier'
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'fieldcontainer',
                                            fieldLabel : i18n.gettext('Work Location'),
                                            layout : 'hbox',
                                            anchor : '100%',
                                            defaults : {
                                                margin : '0 0 0 0'
                                            },
                                            items : [
                                                {
                                                    xtype : 'textfield',
                                                    bind : {
                                                        value : '{employerWorkLocationsValue}'
                                                    },
                                                    flex : 1,
                                                    editable : false,
                                                    readOnly : true,
                                                    disableDirtyCheck : true,
                                                    allowBlank : true
                                                },
                                                {
                                                    xtype : 'button',
                                                    reference : 'selectWorkLocation',
                                                    cls : 'criterion-btn-primary',
                                                    text : i18n.gettext('Select'),
                                                    scale : 'small',
                                                    listeners : {
                                                        click : 'handleSelectWorkLocation'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Website'),
                                            name : 'website'
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Active'),
                                            name : 'isActive',
                                            value : true,
                                            bind : {
                                                disabled : '{isPhantom || hasOnlyOneActive}'
                                            },
                                            listeners : {
                                                change : 'handleActiveChange'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            layout : 'hbox',

                            bodyPadding : '0 10',

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            title : i18n.gettext('Position Management'),

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Multi Position'),
                                            name : 'isMultiPosition'
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Position Control'),
                                            name : 'isPositionControl'
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Position Workflow'),
                                            name : 'isPositionWorkflow'
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Position Reporting'),
                                            name : 'isPositionReporting'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            layout : 'hbox',

                            bodyPadding : '0 10',

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            title : i18n.gettext('Number Format'),

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'numberfield',
                                            fieldLabel : i18n.gettext('Amount Precision'),
                                            name : 'amountPrecision',
                                            maxValue : 4
                                        },
                                        {
                                            xtype : 'numberfield',
                                            fieldLabel : i18n.gettext('Rate Precision'),
                                            name : 'ratePrecision',
                                            maxValue : 4
                                        },
                                        {
                                            xtype : 'numberfield',
                                            fieldLabel : i18n.gettext('Currency Precision'),
                                            name : 'currencyPrecision',
                                            maxValue : 4
                                        },
                                        {
                                            xtype : 'numberfield',
                                            fieldLabel : i18n.gettext('Hours Precision'),
                                            name : 'hoursPrecision',
                                            maxValue : 5
                                        },
                                        {
                                            xtype : 'numberfield',
                                            fieldLabel : i18n.gettext('Percentage Precision'),
                                            name : 'percentagePrecision',
                                            maxValue : 4
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'combo',
                                            fieldLabel : i18n.gettext('Decimal Separator'),
                                            name : 'decimalSeparator',
                                            vtype : 'separator',
                                            editable : false,
                                            tpl : separatorTpl,
                                            separatorField : 'thousandSeparator',
                                            bind : {
                                                store : '{separators}'
                                            }
                                        },
                                        {
                                            xtype : 'combo',
                                            fieldLabel : i18n.gettext('Thousand Separator'),
                                            name : 'thousandSeparator',
                                            vtype : 'separator',
                                            editable : false,
                                            tpl : separatorTpl,
                                            separatorField : 'decimalSeparator',
                                            bind : {
                                                store : '{separators}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_placeholder_field'
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Currency Sign'),
                                            name : 'currencySign'
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Currency At End'),
                                            name : 'currencyAtEnd'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            layout : 'hbox',

                            bodyPadding : '0 10',

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            title : i18n.gettext('Text Format'),

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Date Format'),
                                            name : 'dateFormat',
                                            afterSubTpl : '<small class="dateFormatDemo"></small>',
                                            listeners : {
                                                change : 'handleDateFormatChange'
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Time Format'),
                                            name : 'timeFormat',
                                            afterSubTpl : '<small class="timeFormatDemo"></small>',
                                            listeners : {
                                                change : 'handleTimeFormatChange'
                                            }
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Name Format'),
                                            inputAttrTpl : ' data-qtip="' + criterion.Consts.PERSON_NAME_ABBREVS + ' " ',
                                            name : 'nameFormat'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            layout : 'hbox',

                            bodyPadding : '0 10',

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            title : i18n.gettext('SELF-SERVICE'),

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'colorfield',
                                            fieldLabel : i18n.gettext('Color 1 - Top Menu Bar'),
                                            name : 'essColor1',
                                            allowBlank : false
                                        },
                                        {

                                            xtype : 'colorfield',
                                            fieldLabel : i18n.gettext('Color 2 - Sidebar Menu'),
                                            name : 'essColor2',
                                            allowBlank : false
                                        },
                                        {

                                            xtype : 'colorfield',
                                            fieldLabel : i18n.gettext('Color 3 - Top Menu Icon'),
                                            name : 'essColor3',
                                            allowBlank : false
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Employee Check-in'),
                                            name : 'isCheckin'
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Percent Complete'),
                                            name : 'isPercentComplete'
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Show All Employers in Company Directory'),
                                            name : 'isEssFullDirectory'
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {

                                            xtype : 'colorfield',
                                            fieldLabel : i18n.gettext('Color 4 - Sidebar Menu Hover'),
                                            name : 'essColor4',
                                            allowBlank : false
                                        },
                                        {
                                            xtype : 'colorfield',
                                            fieldLabel : i18n.gettext('Color 5 - Sidebar Menu Selected'),
                                            name : 'essColor5',
                                            allowBlank : false
                                        },
                                        {
                                            xtype : 'colorfield',
                                            fieldLabel : i18n.gettext('Color 6 - Base Color'),
                                            name : 'essColor6',
                                            allowBlank : false
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Show Logo'),
                                            name : 'isEssLogo'
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Show Employer Name'),
                                            name : 'isEssEmployerName'
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Organization Name'),
                                            name : 'organizationName'
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            layout : 'hbox',

                            bodyPadding : '0 10',

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            title : i18n.gettext('Miscellaneous'),

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Test Email Address'),
                                            name : 'testEmailAddress'
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.gettext('Global Employee Number'),
                                            name : 'isGlobalEmployeeNumber'
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            xtype : 'criterion_customfields_container',

                            padding : '0 10',

                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            reference : 'customfieldsEmployer',
                            entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_EMPLOYER
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    };

});
