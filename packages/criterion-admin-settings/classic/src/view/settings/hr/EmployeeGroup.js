Ext.define('criterion.view.settings.hr.EmployeeGroup', function() {

    return {

        alias : 'widget.criterion_settings_employee_group',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.employeeGroup.Members',
            'criterion.controller.settings.hr.EmployeeGroup'
        ],

        bodyPadding : 0,

        title : i18n.gettext('Employee Group Details'),

        defaults : {
            labelWidth : 200
        },

        controller : {
            type : 'criterion_settings_employee_group',
            externalUpdate : false
        },

        viewModel : {
            data : {
                disableAdd : false
            },

            formulas : {
                disableRecalculate : function(get) {
                    return get('record.dirty') || get('isPhantom') || get('disableSave');
                },

                hideRecalculate : function(get) {
                    return get('hideSave') || get('isPhantom') || !get('record.isDynamic');
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
                                    fieldLabel : i18n.gettext('Name'),
                                    name : 'name',
                                    bind : '{record.name}',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'textarea',
                                    fieldLabel : i18n.gettext('Description'),
                                    name : 'description',
                                    bind : '{record.description}',
                                    height : 100
                                },

                                {
                                    xtype : 'textarea',
                                    fieldLabel : i18n.gettext('Formula'),
                                    name : 'formula',
                                    reference : 'formulaField',
                                    hidden : true,
                                    disabled : true,
                                    allowBlank : false,
                                    bind : {
                                        hidden : '{!record.isDynamic}',
                                        disabled : '{record.isInProcess || !record.isDynamic}',
                                        value : '{record.formula}'
                                    },
                                    height : 100
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Dynamic'),
                                    disabled : true,
                                    bind : {
                                        disabled : '{record.isInProcess}',
                                        value : '{record.isDynamic}'
                                    },
                                    name : 'isDynamic',
                                    listeners : {
                                        change : 'onChangeIsDynamic'
                                    }
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Terminated Employees'),
                                    hidden : true,
                                    bind : {
                                        value : '{record.includeTerminated}',
                                        hidden : '{!record.isDynamic}',
                                        disabled : '{!record.isDynamic || record.isInProcess}'
                                    },
                                    name : 'includeTerminated'
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Future Employees'),
                                    hidden : true,
                                    bind : {
                                        value : '{record.includeFuture}',
                                        hidden : '{!record.isDynamic}',
                                        disabled : '{!record.isDynamic || record.isInProcess}'
                                    },
                                    name : 'includeFuture'
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Unapproved Employees'),
                                    hidden : true,
                                    bind : {
                                        value : '{record.includeUnapproved}',
                                        hidden : '{!record.isDynamic}',
                                        disabled : '{!record.isDynamic || record.isInProcess}'
                                    },
                                    name : 'includeUnapproved'
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Daily Recalculated'),
                                    hidden : true,
                                    bind : {
                                        value : '{record.isDailyRecalculated}',
                                        hidden : '{!record.isDynamic}',
                                        disabled : '{!record.isDynamic}'
                                    },
                                    name : 'isDailyRecalculated'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_gridview',
                    reference : 'gridEmployees',
                    cls : 'criterion-employee-group',
                    margin : '5 0 0 0',
                    flex : 2,
                    store : {
                        type : 'criterion_employee_group_members'
                    },
                    tbar : [
                        {
                            xtype : 'button',
                            reference : 'addButton',
                            text : i18n.gettext('Add'),
                            cls : 'criterion-btn-feature',
                            listeners : {
                                scope : this.getController(),
                                click : 'handleAddEmployee'
                            },
                            bind : {
                                disabled : '{disableAdd}',
                                hidden : '{record.isDynamic}'
                            }
                        }
                    ],

                    viewConfig : {
                        getRowClass : function(record) {
                            var employee = record.getEmployee && record.getEmployee();

                            return employee ? (employee.get('isActive') ? '' : 'inactive-entry') : '';
                        }
                    },

                    columns : {
                        items : [
                            {
                                flex : 1,
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName'
                            },
                            {
                                flex : 1,
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName'
                            },
                            {
                                flex : 1,
                                text : i18n.gettext('Middle Name'),
                                dataIndex : 'middleName'
                            },
                            {
                                xtype : 'criterion_actioncolumn',
                                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                items : [
                                    {
                                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                        tooltip : i18n.gettext('Delete'),
                                        action : 'removeaction',
                                        permissionAction : function(v, cellValues, record, i, k, e, view) {
                                            return !view.up('criterion_settings_employee_group').getViewModel().get('record').get('isDynamic');
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ];

            this.callParent(arguments);
        },

        setButtonConfig : function() {
            let me = this;

            me.callParent();

            me.buttons.splice(-1, 0, {
                xtype : 'button',
                text : i18n.gettext('Recalculate'),
                cls : 'criterion-btn-feature',
                handler : 'handleRecalculate',
                hidden : true,
                bind : {
                    disabled : '{disableRecalculate}',
                    hidden : '{hideRecalculate}'
                }
            });
        }
    };

});

