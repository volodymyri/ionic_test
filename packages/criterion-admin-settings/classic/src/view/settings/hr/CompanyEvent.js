Ext.define('criterion.view.settings.hr.CompanyEvent', function() {

    return {

        alias : 'widget.criterion_settings_company_event',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.hr.CompanyEvent',
            'criterion.controller.settings.hr.companyEvent.EventsGrid',
            'criterion.view.settings.hr.companyEvent.Detail',
            'criterion.store.employer.companyEvent.Details',
            'criterion.store.EmployeeGroups',
            'criterion.store.employeeGroup.CompanyEvents'
        ],

        bodyPadding : 0,

        title : i18n.gettext('Event Details'),

        defaults : {
            labelWidth : 200
        },

        controller : {
            type : 'criterion_settings_company_event',
            externalUpdate : false
        },

        viewModel : {
            data : {
                employeeGroupsDesc : '',
                employeeGroupIds : [],
                canPostEmployeeGroupIds : []
            },

            stores : {
                eventDetails : {
                    type : 'criterion_employer_company_event_details'
                },
                employeeGroups : {
                    type : 'criterion_employee_groups',
                    autoSync : false
                },
                employeeGroupCompanyEvents : {
                    type : 'criterion_employee_group_company_events'
                }
            }
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_panel',
                    layout : 'hbox',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                    plugins : [
                        'criterion_responsive_column'
                    ],
                    bodyPadding : 10,

                    items : [
                        {
                            items : [
                                {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    disabled : true,
                                    hideTrigger : true
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Code'),
                                    name : 'code',
                                    allowBlank : false,
                                    maxLength : 50
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Name'),
                                    name : 'name',
                                    allowBlank : false,
                                    maxLength : 50
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Year'),
                                    name : 'year',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'fieldcontainer',
                                    fieldLabel : i18n.gettext('Employee Groups'),
                                    layout : 'hbox',
                                    margin : '5 0 0 0',
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            flex : 1,
                                            bind : {
                                                value : '{employeeGroupsDesc}'
                                            },
                                            readOnly : true
                                        },
                                        {
                                            xtype : 'button',
                                            scale : 'small',
                                            margin : '0 0 0 3',
                                            cls : 'criterion-btn-light',
                                            glyph : criterion.consts.Glyph['plus'],
                                            listeners : {
                                                click : 'handleEmployeeGroupChange'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_gridview',
                    reference : 'gridEvents',
                    margin : '5 0 0 0',
                    flex : 2,
                    bind : {
                        store : '{eventDetails}'
                    },

                    controller : {
                        type : 'criterion_settings_company_event_events_grid',
                        connectParentView : false,
                        editor : {
                            xtype : 'criterion_settings_company_event_detail'
                        }
                    },

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

                    columns : {
                        items : [
                            {
                                xtype : 'datecolumn',
                                text : i18n.gettext('Date'),
                                flex : 1,
                                dataIndex : 'date'
                            },
                            {
                                flex : 2,
                                text : i18n.gettext('Description'),
                                dataIndex : 'description'
                            }
                        ]
                    }
                }
            ];

            this.callParent(arguments);
        },

        loadRecord : function(record) {
            this.callParent(arguments);

            this.getController() && this.getController().loadRecord(record);
        }
    };

});

