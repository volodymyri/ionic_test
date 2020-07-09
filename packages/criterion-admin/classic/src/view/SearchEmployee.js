Ext.define('criterion.view.SearchEmployee', function() {

    return {
        alias : 'widget.criterion_search_employee',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.SearchEmployee',
            'Ext.layout.container.Border',
            'Ext.layout.container.Form',
            'criterion.ux.toolbar.ToolbarPaging',
            'criterion.ux.form.field.EmployerCombo',

            'criterion.store.search.Employees',

            'Ext.grid.filters.Filters',
            'criterion.ux.grid.filters.filter.CodeData',
            'criterion.ux.grid.filters.filter.Employer',
            'criterion.util.FieldFormat'
        ],

        viewModel : {
            data : {
                isSingleEmployer : true
            }
        },

        config : {
            gridStateId : 'employeesGrid'
        },

        controller : {
            type : 'criterion_search_employee'
        },

        layout : 'fit',

        createItemsSearchForm : function() {
            return [
                {
                    xtype : 'criterion_employer_combo',
                    fieldLabel : i18n.gettext('Employer'),
                    name : 'employerId',
                    allowBlank : true,
                    listeners : {
                        change : 'handleEmployerComboChange'
                    },
                    listConfig : {
                        cls : 'criterion-side-list',
                        shadow : false
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('First Name'),
                    name : 'firstName',
                    enableKeyEvents : true,
                    listeners : {
                        keypress : 'onKeyPress'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Last Name'),
                    name : 'lastName',
                    enableKeyEvents : true,
                    listeners : {
                        keypress : 'onKeyPress'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Employee Number'),
                    name : 'employeeNumber',
                    enableKeyEvents : true,
                    listeners : {
                        keypress : 'onKeyPress'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Social Security Number'),
                    name : 'nationalIdentifier',
                    enableKeyEvents : true,
                    listeners : {
                        keypress : 'onKeyPress'
                    },
                    bind : {
                        hidden : '{!security.securityField.person.national_identifier}',
                        disabled : '{!security.securityField.person.national_identifier}'
                    }
                },
                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('Status'),
                    store : Ext.create('Ext.data.Store', {
                        fields : ['text', 'value'],
                        data : [
                            {
                                text : i18n.gettext('Active'),
                                value : 'true'
                            },
                            {
                                text : i18n.gettext('Inactive'),
                                value : 'false'
                            },
                            {
                                text : i18n.gettext('All'),
                                value : null
                            }
                        ]
                    }),
                    name : 'isActive',
                    valueField : 'value',
                    emptyText : i18n.gettext('All'),
                    editable : false,
                    value : 'true',
                    sortByDisplayField : false,
                    listeners : {
                        change : 'handleSearchComboChange'
                    },
                    listConfig : {
                        cls : 'criterion-side-list',
                        shadow : false
                    }
                }
            ];
        },

        createGridColumns : function() {
            return [
                {
                    text : i18n.gettext('Last Name'),
                    dataIndex : 'lastName',
                    flex : 1,
                    filter : true
                },
                {
                    text : i18n.gettext('First Name'),
                    dataIndex : 'firstName',
                    flex : 1,
                    filter : true
                },
                {
                    text : i18n.gettext('Middle Name'),
                    dataIndex : 'middleName',
                    flex : 1,
                    filter : true
                },
                {
                    text : i18n.gettext('Nickname'),
                    dataIndex : 'nickName',
                    hidden : true,
                    flex : 1,
                    filter : false
                },
                {
                    text : i18n.gettext('Employer Alternative Name'),
                    dataIndex : 'employerAlternativeName',
                    flex : 1,
                    filter : true,
                    hidden : true
                },
                {
                    text : i18n.gettext('Employee Number'),
                    dataIndex : 'employeeNumber',
                    flex : 1,
                    filter : true,
                    hidden : true
                },
                {
                    text : i18n.gettext('Social Security Number'),
                    dataIndex : 'nationalIdentifier',
                    flex : 1,
                    filter : true,
                    renderer : criterion.util.FieldFormat.fieldRenderer(criterion.Consts.FIELD_FORMAT_TYPE.SSN),
                    hidden : true
                },
                {
                    text : i18n.gettext('Title'),
                    dataIndex : 'positionTitle',
                    flex : 2,
                    filter : true
                },
                {
                    text : i18n.gettext('Employer'),
                    dataIndex : 'employerName',
                    flex : 1,
                    filter : {
                        type : 'employer'
                    },
                    bind : {
                        hidden : '{isSingleEmployer}'
                    }
                },
                {
                    xtype : 'criterion_codedatacolumn',
                    dataIndex : 'positionTypeCd',
                    codeDataId : criterion.consts.Dict.POSITION_TYPE,
                    text : i18n.gettext('Type'),
                    unselectedText : '',
                    flex : 1,
                    resizable : false,
                    filter : {
                        type : 'codedata'
                    }
                },
                {
                    xtype : 'booleancolumn',
                    text : i18n.gettext('Status'),
                    dataIndex : 'isActive',
                    trueText : i18n.gettext('Active'),
                    falseText : i18n.gettext('Inactive'),
                    flex : 1,
                    filter : {
                        yesText : i18n.gettext('Active'),
                        noText : i18n.gettext('Inactive')
                    }
                }
            ];
        },

        plugins : {
            ptype : 'criterion_lazyitems'
        },

        initComponent : function() {
            var me = this;

            me.callParent(arguments);

            me.getPlugin('criterionLazyItems').items = [
                {
                    layout : 'border',
                    items : [
                        {
                            xtype : 'panel',
                            region : 'west',

                            cls : 'criterion-side-panel',

                            width : 300,

                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            autoScroll : true,

                            items : [
                                {
                                    layout : 'hbox',
                                    cls : 'criterion-side-field',
                                    padding : '26 20 0 20',

                                    hidden : true,
                                    bind : {
                                        hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.CREATE, true)
                                    },

                                    items : [
                                        {
                                            xtype : 'splitbutton',
                                            flex : 1,
                                            text : i18n.gettext('Add Employee'),
                                            textAlign : 'left',
                                            listeners : {
                                                click : 'handleCreateButtonClick'
                                            },
                                            menu : new Ext.menu.Menu({
                                                plain : true,
                                                shadow : false,
                                                items : [
                                                    {
                                                        text : i18n.gettext('Rehire an Employee'),
                                                        listeners : {
                                                            click : 'handleRehire'
                                                        },
                                                        hidden : true,
                                                        bind : {
                                                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_REHIRE, criterion.SecurityManager.ACT, true)
                                                        }
                                                    },
                                                    {
                                                        text : i18n.gettext('Add to a new Employer'),
                                                        listeners : {
                                                            click : 'handleSearchAndCreate'
                                                        },
                                                        hidden : true,
                                                        bind : {
                                                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                                                append : 'isSingleEmployer ||',
                                                                rules : [
                                                                    {
                                                                        key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADD_EMPLOYER,
                                                                        actName : criterion.SecurityManager.ACT,
                                                                        reverse : true
                                                                    }
                                                                ]
                                                            })
                                                        }
                                                    },
                                                    {
                                                        text : i18n.gettext('Transfer an Employee'),
                                                        listeners : {
                                                            click : 'handleTransfer'
                                                        },
                                                        hidden : true,
                                                        bind : {
                                                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                                                append : 'isSingleEmployer ||',
                                                                rules : [
                                                                    {
                                                                        key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_TRANSFER,
                                                                        actName : criterion.SecurityManager.ACT,
                                                                        reverse : true
                                                                    }
                                                                ]
                                                            })
                                                        }
                                                    }
                                                ],
                                                listeners : {
                                                    beforerender : function() {
                                                        this.setWidth(this.up('button').getWidth());
                                                    }
                                                },
                                                cls : 'criterion-side-field-menu criterion-side-add-field-menu'
                                            }),
                                            cls : 'criterion-btn-side-add'
                                        }
                                    ]
                                },
                                {
                                    xtype : 'form',
                                    reference : 'searchForm',

                                    padding : '26 0 0 0',

                                    defaults : {
                                        labelAlign : 'top',
                                        width : '100%',
                                        cls : 'criterion-side-field'
                                    },

                                    items : this.createItemsSearchForm()
                                },
                                {
                                    layout : 'hbox',
                                    padding : 20,
                                    items : [
                                        {
                                            flex : 1
                                        },
                                        {
                                            xtype : 'button',
                                            text : i18n.gettext('Search'),
                                            cls : 'criterion-btn-primary',
                                            listeners : {
                                                click : 'handleSearchButtonClick'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            region : 'center',

                            margin : '0',

                            xtype : 'criterion_gridpanel',

                            stateId : this.getGridStateId(),
                            stateful : true,

                            plugins : [
                                'gridfilters'
                            ],

                            itemId : 'grid',
                            reference : 'grid',

                            store : {
                                type : 'criterion_search_employees',
                                remoteSort : true,
                                remoteFilter : true,
                                pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                                sorters : [
                                    {
                                        property : 'lastName',
                                        direction : 'ASC'
                                    }
                                ]
                            },

                            listeners : {
                                itemclick : 'handleItemClick'
                            },

                            columns : this.createGridColumns(),

                            dockedItems : {
                                xtype : 'criterion_toolbar_paging',
                                dock : 'bottom',
                                displayInfo : true,

                                stateId : this.getGridStateId(),
                                stateful : true
                            }
                        }
                    ]
                }
            ];
        }
    };

});
