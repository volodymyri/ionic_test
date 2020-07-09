Ext.define('criterion.view.employer.MassCreateEmployeeLogin', function() {

    var SEARCH_TYPES = {
        LAST_NAME : 1,
        FIRST_NAME : 2,
        EMPLOYEE_GROUPS : 3
    };

    return {

        alias : 'widget.criterion_employer_mass_create_employee_login',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.employer.MassCreateEmployeeLogin',
            'criterion.store.MassLoginSearch',
            'Ext.grid.filters.Filters',
            'criterion.store.EmployeeGroups'
        ],

        controller : {
            type : 'criterion_employer_mass_create_employee_login'
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        modal : false,
        closable : false,

        plugins : {
            ptype : 'criterion_sidebar',
            width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
            height : '90%',
            modal : true
        },

        viewModel : {
            data : {
                searchType : SEARCH_TYPES.LAST_NAME,
                selectedCount : 0,
                isEnable2FA : false,
                isExisted : false,
                securityProfileId : null
            },

            formulas : {
                submitBtnText : function(data) {
                    return i18n._('Create');
                },
                showTextField : function(data) {
                    return data('searchType') !== SEARCH_TYPES.EMPLOYEE_GROUPS;
                },
                disableSave : function(data) {
                    return !data('selectedCount') || !data('securityProfileId');
                }
            },

            stores : {
                employeeSearch : {
                    type : 'criterion_mass_login_search',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteFilter : true,
                    remoteSort : true
                },
                employeeGroups : {
                    type : 'criterion_employee_groups'
                }
            }
        },

        title : i18n._('Mass Create Employee Login'),

        setButtonConfig : function() {
            this.buttons = [
                '->',
                {
                    xtype : 'button',
                    reference : 'cancel',
                    cls : 'criterion-btn-light',
                    listeners : {
                        click : 'handleCancelClick'
                    },
                    hidden : true,
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                },
                {
                    xtype : 'button',
                    text : i18n._('Reset Password'),
                    handler : 'handleResetPassword',
                    bind : {
                        disabled : '{!selectedCount || !isExisted}',
                        hidden : '{!isExisted}'
                    }

                },
                {
                    xtype : 'button',
                    text : i18n._('Unlock'),
                    handler : 'handleUnlock',
                    bind : {
                        disabled : '{!selectedCount || !isExisted}',
                        hidden : '{!isExisted}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handleSubmitClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableSave || isExisted}',
                        text : '{submitBtnText}',
                        hidden : '{hideSave || isExisted}'
                    },
                    tooltip : i18n.gettext('Save') + '&nbsp;<span class="fs-08 criterion-darken-gray">(Alt&nbsp;+&nbsp;Shift&nbsp;+&nbsp;S)<span>'
                }
            ];
        },

        items : [
            {
                layout : 'hbox',
                defaultType : 'container',

                border : true,
                bodyStyle : {
                    'border-width' : '0 0 1px 0 !important'
                },

                defaults : {
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    flex : 1,
                    padding : '15 0 0 15'
                },

                items : [
                    {
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                fieldLabel : i18n._('Security Profile'),
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        readOnly : true,
                                        bind : '{securityProfile}',
                                        allowBlank : false
                                    },
                                    {
                                        xtype : 'button',
                                        scale : 'small',
                                        margin : '0 0 0 3',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        handler : 'handleSecurityProfileSelect'
                                    }
                                ]
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Enable 2FA'),
                                bind : '{isEnable2FA}'
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_gridpanel',
                reference : 'grid',
                width : '100%',
                flex : 1,
                scrollable : true,
                plugins : 'gridfilters',
                bind : {
                    store : '{employeeSearch}'
                },
                selType : 'checkboxmodel',
                selModel : {
                    checkOnly : true,
                    mode : 'MULTI'
                },
                listeners : {
                    scope : 'controller',
                    selectionchange : 'onSelectionChange'
                },
                dockedItems : [
                    {
                        xtype : 'container',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        dock : 'top',
                        padding : 10,
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Existed'),
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_NARROW_WIDTH,
                                margin : '0 10 0 0',
                                bind : {
                                    value : '{isExisted}'
                                },
                                listeners : [
                                    {
                                        change : 'handleChangeExistedSetting'
                                    }
                                ]
                            },
                            {
                                xtype : 'combobox',
                                flex : 1,
                                maxHeight : 35,
                                reference : 'searchCombo',
                                queryMode : 'local',
                                editable : false,
                                sortByDisplayField : false,
                                valueField : 'id',
                                displayField : 'text',
                                store : new Ext.data.Store({
                                    proxy : {
                                        type : 'memory'
                                    },
                                    data : [
                                        {
                                            id : SEARCH_TYPES.LAST_NAME,
                                            text : i18n.gettext('Last Name'),
                                            dataIndex : 'lastName'
                                        },
                                        {
                                            id : SEARCH_TYPES.FIRST_NAME,
                                            text : i18n.gettext('First Name'),
                                            dataIndex : 'firstName'
                                        },
                                        {
                                            id : SEARCH_TYPES.EMPLOYEE_GROUPS,
                                            text : i18n.gettext('Employee Group'),
                                            dataIndex : 'employeeGroupIds'
                                        }
                                    ]
                                }),
                                bind : {
                                    value : '{searchType}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                padding : '0 10',
                                reference : 'searchText',
                                flex : 2,
                                hidden : true,
                                bind : {
                                    hidden : '{!showTextField}'
                                },
                                listeners : [
                                    {
                                        change : 'searchTextHandler'
                                    }
                                ]
                            },
                            {
                                xtype : 'tagfield',
                                hidden : true,
                                reference : 'employeeGroupsField',
                                bind : {
                                    store : '{employeeGroups}',
                                    hidden : '{showTextField}'
                                },
                                flex : 2,
                                padding : '0 10',
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'name',
                                listeners : [
                                    {
                                        change : 'handleChangeEmployeeGroups'
                                    }
                                ]
                            },
                            {
                                xtype : 'button',
                                maxHeight : 35,
                                cls : 'criterion-btn-feature',
                                text : i18n._('Clear'),
                                handler : 'clearFilters'
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_toolbar_paging',
                        dock : 'bottom',
                        bind : {
                            store : '{inputStore}'
                        }
                    }
                ],

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n._('First Name'),
                        dataIndex : 'firstName',
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n._('Last Name'),
                        dataIndex : 'lastName',
                        flex : 1
                    },
                    {
                        xtype : 'booleancolumn',
                        text : i18n._('Activated'),
                        dataIndex : 'isActivated',
                        flex : 1,
                        trueText : i18n.gettext('Yes'),
                        falseText : i18n.gettext('No')
                    },
                    {
                        xtype : 'booleancolumn',
                        text : i18n._('Password'),
                        dataIndex : 'isPasswordSet',
                        flex : 1,
                        trueText : i18n.gettext('Set'),
                        falseText : i18n.gettext('Not Set')
                    },
                    {
                        xtype : 'booleancolumn',
                        text : i18n._('Locked'),
                        dataIndex : 'isLocked',
                        flex : 1,
                        trueText : i18n.gettext('Yes'),
                        falseText : i18n.gettext('No')
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n._('Last Login Time'),
                        dataIndex : 'lastLoginTime',
                        format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                        flex : 2
                    }
                ]
            }

        ]

    };

});
