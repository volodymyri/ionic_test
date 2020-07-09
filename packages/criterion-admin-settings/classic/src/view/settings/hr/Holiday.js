Ext.define('criterion.view.settings.hr.Holiday', function() {

    return {
        alias : 'widget.criterion_settings_holiday',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        requires : [
            'criterion.controller.settings.hr.Holiday',
            'criterion.store.EmployeeGroups',
            'criterion.store.employeeGroup.Holidays',
            'criterion.view.settings.hr.HolidayDetail'
        ],

        controller : {
            type : 'criterion_settings_holiday',
            externalUpdate : false
        },

        layout : 'fit',

        bodyPadding : 0,

        header : {
            title : i18n.gettext('Holiday Details'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Clone'),
                    handler : 'handleClone',
                    hidden : true,
                    bind : {
                        disabled : '{disableSave}',
                        hidden : '{isPhantom}'
                    }
                }
            ]
        },

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
        },

        viewModel : {
            stores : {
                employeeGroups : {
                    type : 'criterion_employee_groups'
                },
                employeeGroupsHolidays : {
                    type : 'criterion_employee_group_holidays'
                },
                regularDays : {
                    fields : ['value', 'name'],
                    sorters : [
                        {
                            property : 'value',
                            direction : 'ASC'
                        }
                    ],
                    data : [
                        {
                            name : i18n.gettext('Sunday'),
                            value : parseInt('0000001', 2)
                        },
                        {
                            name : i18n.gettext('Monday'),
                            value : parseInt('0000010', 2)
                        },
                        {
                            name : i18n.gettext('Tuesday'),
                            value : parseInt('0000100', 2)
                        },
                        {
                            name : i18n.gettext('Wednesday'),
                            value : parseInt('0001000', 2)
                        },
                        {
                            name : i18n.gettext('Thursday'),
                            value : parseInt('0010000', 2)
                        },
                        {
                            name : i18n.gettext('Friday'),
                            value : parseInt('0100000', 2)
                        },
                        {
                            name : i18n.gettext('Saturday'),
                            value : parseInt('1000000', 2)
                        }
                    ]
                }
            }
        },

        listeners : {
            scope : 'controller'
        },

        items : [
            {
                scrollable : 'vertical',

                items : [

                    {
                        layout : 'hbox',

                        plugins : [
                            'criterion_responsive_column'
                        ],

                        bodyPadding : '0 10',

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

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
                                        bind : '{record.code}'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Name'),
                                        name : 'name',
                                        bind : '{record.name}'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Year'),
                                        name : 'year',
                                        bind : '{record.year}'
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'criterion_employee_group_combobox',
                                        reference : 'employeeGroupCombo',
                                        objectParam : 'holidayId',
                                        bind : {
                                            valuesStore : '{employeeGroupsHolidays}'
                                        }
                                    },
                                    {
                                        xtype : 'tagfield',
                                        reference : 'regularDaysCombo',
                                        bind : {
                                            store : '{regularDays}'
                                        },
                                        disableDirtyCheck : true,
                                        fieldLabel : i18n.gettext('Regular Days Closed'),
                                        sortByDisplayField : false,
                                        displayField : 'name',
                                        valueField : 'value',
                                        allowBlank : true,
                                        editable : false,
                                        queryMode : 'local'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Hours per Day'),
                                        name : 'averageHours',
                                        bind : '{record.averageHours}'
                                    },
                                    {
                                        xtype : 'fieldcontainer',
                                        fieldLabel : i18n.gettext('Income'),
                                        layout : 'hbox',
                                        margin : '5 0 0 0',
                                        requiredMark : true,
                                        items : [
                                            {
                                                xtype : 'textfield',
                                                flex : 1,
                                                bind : {
                                                    value : '{record.incomeCode}'
                                                },
                                                name : 'incomeCode',
                                                allowBlank : false,
                                                readOnly : true
                                            },
                                            {
                                                xtype : 'button',
                                                scale : 'small',
                                                margin : '0 0 0 3',
                                                cls : 'criterion-btn-light',
                                                glyph : criterion.consts.Glyph['ios7-search'],
                                                listeners : {
                                                    click : 'handleIncomeSearch'
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

                        bind : {
                            store : '{record.details}'
                        },

                        controller : {
                            connectParentView : false,
                            loadRecordOnEdit : false,
                            editor : {
                                xtype : 'criterion_settings_holiday_detail',
                                allowDelete : true
                            }
                        },

                        columns : [
                            {
                                xtype : 'datecolumn',
                                dataIndex : 'date',
                                text : i18n.gettext('Date'),
                                width : 150
                            },
                            {
                                dataIndex : 'description',
                                text : i18n.gettext('Description'),
                                flex : 1
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
