Ext.define('criterion.view.common.AssignBase', function() {

    const FILTER_CRITERIA = {
        EMPLOYEE_NUMBER : {
            text : i18n.gettext('Employee Number'),
            value : 1,
            paramName : 'employeeNumber'
        },
        FIRST_NAME : {
            text : i18n.gettext('First Name'),
            value : 2,
            paramName : 'firstName'
        },
        LAST_NAME : {
            text : i18n.gettext('Last Name'),
            value : 3,
            paramName : 'lastName'
        },
        TITLE : {
            text : i18n.gettext('Title'),
            value : 4,
            paramName : 'positionTitle'
        }
    };

    return {

        alias : 'widget.criterion_common_assign_base',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.common.AssignBase',
            'criterion.store.EmployeeGroups'
        ],

        controller : {
            type : 'criterion_common_assign_base'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_FIXED_HEIGHT
            }
        ],
        modal : true,
        draggable : true,

        layout : 'card',

        FILTER_CRITERIA : FILTER_CRITERIA,

        viewModel : {
            data : {
                activeViewIdx : 0,

                employeeGroupIds : [],
                employeeIds : [],

                filterBy : FILTER_CRITERIA.LAST_NAME.value,
                criteria : ''
            },
            stores : {
                // employees store should be filled in a child class

                employeeGroups : {
                    type : 'criterion_employee_groups',
                    autoLoad : true,
                    sorters : [
                        {
                            property : 'name',
                            direction : 'ASC'
                        }
                    ],
                    filters : [
                        {
                            property : 'employerId',
                            value : '{reqEmployerId}'
                        }
                    ]
                },

                employeeSelected : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'integer'
                        },
                        {
                            name : 'name',
                            type : 'string'
                        }
                    ]
                }
            },
            formulas : {
                reqEmployerId : data => data('employerId'),

                selectEmployeesMode : data => data('activeViewIdx') === 1,
                title : data => data('selectEmployeesMode') ? i18n.gettext('Assignment > Select Employees') : i18n.gettext('Assignment'),
                allowAssign : data => (data('employeeGroupIds').length || data('employeeIds').length),
                cancelText : data => data('selectEmployeesMode') ? i18n.gettext('Back') : i18n.gettext('Cancel')
            }
        },

        bind : {
            activeItem : '{activeViewIdx}',
            title : '{title}'
        },

        closable : false,

        listeners : {
            show : 'handleShow'
        },

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                reference : 'closeBtn',
                handler : 'handleCancel',
                bind : {
                    text : '{cancelText}'
                }
            },
            {
                xtype : 'button',
                scale : 'small',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Assign'),
                handler : 'handleAssign',
                disabled : true,
                hidden : true,
                bind : {
                    hidden : '{selectEmployeesMode}',
                    disabled : '{!allowAssign}'
                }
            }
        ],

        getFormFields() {
            return [
                {
                    xtype : 'criterion_tagfield',
                    fieldLabel : i18n.gettext('Employee Group'),
                    bind : {
                        store : '{employeeGroups}',
                        value : '{employeeGroupIds}'
                    },
                    queryMode : 'local',
                    valueField : 'id',
                    growMax : 100,
                    displayField : 'name'
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    fieldLabel : i18n.gettext('Employees'),
                    margin : '0 0 8 0',
                    items : [
                        {
                            xtype : 'criterion_tagfield',
                            flex : 1,
                            hideTrigger : true,
                            triggerOnClick : false,
                            editable : false,
                            bind : {
                                store : '{employeeSelected}',
                                value : '{employeeIds}'
                            },
                            queryMode : 'local',
                            valueField : 'id',
                            growMax : 100,
                            displayField : 'name'
                        },
                        {
                            xtype : 'button',
                            scale : 'small',
                            margin : '0 0 0 3',
                            cls : 'criterion-btn-light',
                            glyph : criterion.consts.Glyph['ios7-search'],
                            handler : 'handleEmployeeSearch'
                        }
                    ]
                }
            ];
        },

        initComponent() {
            this.items = [
                {
                    xtype : 'criterion_form',
                    reference : 'form',
                    scrollable : 'vertical',
                    flex : 1,
                    items : this.getFormFields()
                },

                {
                    xtype : 'criterion_gridpanel',
                    flex : 1,
                    listeners : {
                        selectEmployee : 'handleSelectEmployee'
                    },
                    columns : [
                        {
                            xtype : 'criterion_actioncolumn',
                            width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                            items : [
                                {
                                    glyph : criterion.consts.Glyph['ios7-arrow-up'],
                                    tooltip : i18n.gettext('Select'),
                                    action : 'selectEmployee',
                                    permissionAction : (v, cellValues, record, i, k, e, view) => {
                                        let employeeId = record.get('employeeId'),
                                            employeeIds = view.up('criterion_common_assign_base').getViewModel().get('employeeIds') || [];

                                        return !Ext.Array.contains(employeeIds, employeeId);
                                    }
                                }
                            ]
                        },
                        {
                            text : i18n.gettext('Last Name'),
                            dataIndex : 'lastName',
                            flex : 1
                        },
                        {
                            text : i18n.gettext('First Name'),
                            dataIndex : 'firstName',
                            flex : 1
                        },
                        {
                            text : i18n.gettext('Middle Name'),
                            dataIndex : 'middleName',
                            flex : 1
                        },
                        {
                            text : i18n.gettext('Employee Number'),
                            dataIndex : 'employeeNumber',
                            flex : 1
                        },
                        {
                            text : i18n.gettext('Title'),
                            dataIndex : 'positionTitle',
                            flex : 1
                        }
                    ],

                    dockedItems : [
                        {
                            xtype : 'panel',
                            dock : 'top',
                            padding : 10,
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            items : [
                                {
                                    xtype : 'criterion_tagfield',
                                    fieldLabel : i18n.gettext('Employees'),
                                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                    flex : 1,
                                    blockValueInput : true,
                                    hideTrigger : true,
                                    triggerOnClick : false,
                                    bind : {
                                        store : '{employeeSelected}',
                                        value : '{employeeIds}'
                                    },
                                    queryMode : 'local',
                                    valueField : 'id',
                                    growMax : 100,
                                    margin : 0,
                                    displayField : 'name',
                                    listeners : {
                                        change : 'handleChangeSelectedEmployees'
                                    }
                                },
                                {
                                    xtype : 'component',
                                    autoEl : 'hr',
                                    margin : '8 0 8 0',
                                    cls : 'criterion-horizontal-ruler'
                                },
                                {
                                    xtype : 'container',
                                    layout : 'hbox',
                                    flex : 1,
                                    items : [
                                        {
                                            xtype : 'combobox',
                                            labelWidth : 125,
                                            fieldLabel : i18n.gettext('Filter By'),
                                            margin : '0 10 0 0',
                                            store : Ext.create('Ext.data.Store', {
                                                fields : ['text', 'value'],
                                                data : Ext.Object.getValues(FILTER_CRITERIA)
                                            }),
                                            valueField : 'value',
                                            bind : '{filterBy}',
                                            editable : false,
                                            listeners : {
                                                change : 'handleChangeSearchCriteria'
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            margin : '0 10 0 0',
                                            flex : 1,
                                            bind : '{criteria}',
                                            listeners : {
                                                change : 'searchTextHandler'
                                            }
                                        },
                                        {
                                            xtype : 'button',
                                            text : i18n.gettext('Search'),
                                            cls : 'criterion-btn-feature',
                                            handler : 'handleSearch'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype : 'criterion_toolbar_paging',
                            dock : 'bottom',
                            displayInfo : true,
                            bind : {
                                store : '{employees}'
                            }
                        }
                    ],

                    bind : {
                        store : '{employees}'
                    }
                }

            ];

            this.callParent(arguments);
        }
    };
});
