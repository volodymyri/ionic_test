Ext.define('criterion.view.settings.payroll.TimeClock', function() {

    return {
        alias : 'widget.criterion_payroll_settings_time_clock',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.TimeClock',
            'criterion.store.employeeGroup.TimeClocks',
            'criterion.view.common.LogoUploader'
        ],

        controller : {
            type : 'criterion_payroll_settings_time_clock',
            externalUpdate : false
        },

        viewModel : {
            formulas : {
                isHideLogoUploader : function(data) {
                    return !data('record') || data('record').phantom;
                }
            },
            stores : {
                employeeGroupTimeClocks : {
                    type : 'criterion_employee_group_time_clocks'
                }
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        bodyPadding : 0,

        title : i18n.gettext('Time Clock Details'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : {
            bodyPadding : '0 10'
        },

        items : [
            {
                xtype : 'container',
                width : 250,
                height : 130,

                margin : '25 25 0',

                bind : {
                    hidden : '{isHideLogoUploader}'
                },
                split : true,
                title : false,
                frame : true,
                items : [
                    {
                        xtype : 'criterion_logo_uploader',
                        width : 240,
                        height : 120,
                        reference : 'timeClockLogo'
                    }
                ]
            },
            {
                xtype : 'criterion_panel',

                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Code'),
                                allowBlank : false,
                                allowOnlyWhitespace : false,
                                name : 'code'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                allowOnlyWhitespace : false,
                                allowBlank : false,
                                name : 'name'
                            },
                            {
                                xtype : 'criterion_employee_group_combobox',
                                fieldLabel : i18n.gettext('Employee Groups'),
                                reference : 'employeeGroupsCombo',
                                objectParam : 'timeClockId',
                                useEmployerId : false,
                                displayTpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{name} ({employerName})',
                                    '</tpl>'),
                                tpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{name} ({employerName})</div>',
                                    '</tpl>'),
                                bind : {
                                    valuesStore : '{employeeGroupTimeClocks}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Authentication Token'),
                                allowBlank : false,
                                name : 'authenticationToken'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Active'),
                                name : 'isActive'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel : i18n.gettext('Device Serial Number'),
                                allowBlank : true,
                                name : 'deviceSerialNumber',
                                maxLength: 20
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Last Sync Time'),
                                name : 'lastSyncTime',
                                format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                                readOnly : true
                            },
                            {
                                xtype : 'colorfield',
                                fieldLabel : i18n.gettext('Main color'),
                                name : 'color',
                                allowBlank : false
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
                xtype : 'container',
                layout : 'hbox',
                padding : '15 25',
                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        flex : 4,
                        padding : '0 30 0 0',
                        layout : 'fit',
                        items : [
                            {
                                xtype : 'criterion_htmleditor',
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                labelAlign : 'top',
                                enableAlignments : false,
                                fieldLabel : i18n.gettext('Message'),
                                name : 'message',
                                width : '100%',
                                frame : false
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
