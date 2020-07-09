Ext.define('criterion.view.settings.hr.AcaDetail', function() {

    return {
        alias : 'widget.criterion_settings_aca_detail',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.hr.AcaDetail',
            'criterion.store.employer.aca.Months',
            'criterion.store.employer.aca.Members',
            'criterion.store.employer.aca.Transmissions'
        ],

        title : i18n.gettext('ACA Details'),

        viewModel : {
            stores : {
                months : {
                    type : 'employer_aca_months'
                },
                members : {
                    type : 'employer_aca_members'
                },
                transmissions : {
                    type : 'employer_aca_transmissions'
                },
                hasActiveTransmission : false
            }
        },

        controller : 'criterion_settings_aca_detail',

        bodyPadding : 0,

        tbar : [
            '->',
            {
                text : i18n.gettext('Download Forms'),
                listeners : {
                    click : 'onCreateForms'
                }
            },
            {
                text : i18n.gettext('Transmit to IRS'),
                bind : {
                    hidden : '{hasActiveTransmission}'
                },
                listeners : {
                    click : 'onTransmit'
                }
            }
        ],

        items : [
            {
                title : i18n.gettext('Transmission Details'),
                xtype : 'criterion_gridpanel',

                bind : {
                    store : '{transmissions}',
                    hidden : '{!hasActiveTransmission}'
                },

                hidden : true,

                columns : [
                    {
                        dataIndex : 'formDataFileName',
                        text : i18n.gettext('Transmission File'),
                        flex : 1
                    },
                    {
                        dataIndex : 'status',
                        text : i18n.gettext('Status')
                    },
                    {
                        xtype : 'criterion_widgetcolumn',
                        widget : {
                            xtype : 'button',
                            text : i18n.gettext('Update status'),
                            listeners : {
                                click : 'onStatusUpdate'
                            }
                        },
                        width : 200
                    }
                ]
            },
            {
                layout : 'hbox',
                defaultType : 'container',
                bodyPadding : '20 0 0 0',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_CONDENSED,

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true
                            }
                        ]
                    },
                    {
                        items : [

                        ]
                    }
                ]
            },
            {
                title : i18n.gettext('General Options'),

                layout : 'hbox',
                defaultType : 'container',

                bodyPadding : '20 0 0 0',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_CONDENSED,

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Contact First Name'),
                                bind : {
                                    value : '{record.contactFirstName}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Contact Last Name'),
                                bind : {
                                    value : '{record.contactLastName}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Title'),
                                bind : {
                                    value : '{record.title}'
                                }
                            },
                            {
                                xtype : 'criterion_person_phone_number',
                                fieldLabel : i18n.gettext('Contact Phone'),
                                bind : {
                                    rawNumber : '{record.contactPhone}',
                                    displayNumber : '{record.contactPhoneInternational}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridpanel',

                cls : 'criterion-aca-detail',

                title : i18n.gettext('Months'),

                padding : '0 0 30',

                bind : {
                    store : '{months}'
                },

                columns : [
                    {
                        text : i18n.gettext('Period'),
                        dataIndex : 'monthText',
                        flex : 1
                    },
                    {
                        xtype : 'criterion_widgetcolumn',

                        text : i18n.gettext('MEC Offer'),

                        dataIndex : 'mecIndicator',

                        updateRecord : true,

                        widget : {
                            xtype : 'checkbox'
                        },

                        flex : 1
                    },
                    {
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Full Time Employees'),
                        dataIndex : 'ftEmployeeCount',
                        width : 190,
                        onWidgetAttach : function(column, widget, rec) {
                            widget.setDisabled(!rec.get('isAllMonth'));
                        },
                        widget : {
                            xtype : 'numberfield'
                        }
                    },
                    {
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Total Employees'),
                        dataIndex : 'totalEmployeeCount',
                        width : 190,
                        onWidgetAttach : function(column, widget, rec) {
                            widget.setDisabled(!rec.get('isAllMonth'));
                        },
                        widget : {
                            xtype : 'numberfield'
                        }
                    },
                    {
                        xtype : 'criterion_widgetcolumn',

                        text : i18n.gettext('Aggregate Group'),

                        dataIndex : 'groupIndicator',

                        updateRecord : true,

                        widget : {
                            xtype : 'checkbox'
                        },

                        flex : 1
                    },
                    {
                        xtype : 'criterion_widgetcolumn',

                        text : i18n.gettext('Transition Relief'),

                        dataIndex : 'reliefIndicator',

                        updateRecord : true,

                        widget : {
                            xtype : 'textfield',
                            enforceMaxLength : true,
                            maxLength : 2
                        },

                        flex : 1
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',
                title : i18n.gettext('Employers'),

                bind : {
                    store : '{members}'
                },

                rowEditing : true,

                margin : '0 0 40 0',
                minHeight : 250,

                tbar : [
                    {
                        xtype : 'button',
                        reference : 'addButton',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddClick'
                        }
                    }
                ],

                columns : [
                    {
                        dataIndex : 'name',
                        text : i18n.gettext('Employer Name'),
                        flex : 1,
                        editor : true
                    },
                    {
                        dataIndex : 'number',
                        text : i18n.gettext('Identification Number'),
                        flex : 1,
                        editor : true
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction'
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.callParent(arguments);

            this.getController() && this.getController().loadRecord(record);
        }
    };

});
