Ext.define('criterion.view.settings.ReportSettingsForm', function() {

    var separatorTpl = Ext.create(
        'Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
            '<li role="option" class="x-boundlist-item">{text}&nbsp;</li>',
            '</tpl>' +
        '</ul>'
    );

    return {
        alias : 'widget.criterion_report_settings_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.ReportSettingsForm',
            'criterion.view.common.LogoUploader',
            'criterion.store.ReportSettings'
        ],

        controller : {
            type : 'criterion_report_settings_form'
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        title : i18n.gettext('Report Settings'),

        cls : 'criterion-form',

        layout : {
            type : 'fit'
        },

        bodyPadding : 0,

        viewModel : {
            data : {
                editMode : false,
                employerWorkLocationsValue : ''
            },
            stores : {
                reportSettings : {
                    type : 'criterion_report_settings'
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
            }
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Update'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleUpdate'
                }
            }
        ],

        items : [
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
                                        fieldLabel : i18n.gettext('Organization Name'),
                                        bind : {
                                            value : '{record.organizationName}'
                                        },
                                        allowBlank : false
                                    },
                                    {
                                        xtype : 'container',
                                        bind : {
                                            hidden : '{!editMode}'
                                        },
                                        frame : true,
                                        items : [
                                            {
                                                xtype : 'criterion_logo_uploader',
                                                fieldLabel : i18n.gettext('Organization Logo'),
                                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                                width : 450,
                                                height : 120,
                                                reference : 'organizationLogo',
                                                listeners : {
                                                    logoUploadSuccess : 'handleLogoUploadSuccess'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Show Logo'),
                                        bind : {
                                            value : '{record.isDisplayLogo}'
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

                        title : i18n.gettext('Number Format'),

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Amount Precision'),
                                        name : 'amountPrecision',
                                        bind : {
                                            value : '{record.amountPrecision}'
                                        },
                                        maxValue : 4
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Rate Precision'),
                                        bind : {
                                            value : '{record.ratePrecision}'
                                        },
                                        maxValue : 4
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Currency Precision'),
                                        bind : {
                                            value : '{record.currencyPrecision}'
                                        },
                                        maxValue : 4
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Hours Precision'),
                                        bind : {
                                            value : '{record.hoursPrecision}'
                                        },
                                        maxValue : 5
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Percentage Precision'),
                                        bind : {
                                            value : '{record.percentagePrecision}'
                                        },
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
                                        },
                                        listeners : {
                                            change : 'handleDecimalSeparatorChange'
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
                                        },
                                        listeners : {
                                            change : 'handleThousandSeparatorChange'
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

                        title : i18n.gettext('Text Format'),

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Date Format'),
                                        bind : {
                                            value : '{record.dateFormat}'
                                        },
                                        afterSubTpl : '<small class="dateFormatDemo"></small>',
                                        listeners : {
                                            change : 'handleDateFormatChange'
                                        }
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Time Format'),
                                        bind : {
                                            value : '{record.timeFormat}'
                                        },
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
                                        name : 'nameFormat',
                                        bind : {
                                            value : '{record.nameFormat}'
                                        }
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        fieldLabel : i18n.gettext('Time Zone'),
                                        name : 'timezoneCd',
                                        codeDataId : criterion.consts.Dict.TIME_ZONE,
                                        bind : '{record.timezoneCd}'
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

                        title : i18n.gettext('Options'),

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Enable Localization'),
                                        bind : {
                                            value : '{record.isLocalizationEnabled}'
                                        }
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Show Codes'),
                                        bind : {
                                            value : '{record.isShowCode}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
