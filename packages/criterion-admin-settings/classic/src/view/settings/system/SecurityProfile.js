Ext.define('criterion.view.settings.system.SecurityProfile', function() {

    var SECURITY_MODULES = criterion.Consts.SECURITY_MODULES,
        ADMIN_CARD = 'adminCard',
        SELF_SERVICE_CARD = 'ssCard',
        FIELDS_CARD = 'fieldsCard',
        REPORTS_CARD = 'reportsCard',
        DOCUMENT_LOCATION_CARD = 'documentLocationCard',
        actions = ['Act', 'Create', 'View', 'Edit', 'Delete'];

    function moduleItems() {
        var res = [];

        Ext.Object.each(SECURITY_MODULES, function(key, item) {
            res.push({
                boxLabel : item.name,
                name : key,
                inputValue : item.value,
                disableDirtyCheck : true,
                margin : '0 10 0 0'
            });
        });

        return res;
    }

    function createCheckBoxChangeListener(actName) {
        var fieldName = 'access' + actName;

        return function(field, value) {
            if (field.getWidgetRecord()) {
                var store = field.getWidgetRecord().store,
                    record = store.getById(field.getWidgetRecord().getId());

                if (!record) {
                    return;
                }
                record && record.set(fieldName, value, {convert : false});

                if (actName === 'View' && !value) {
                    // if unset view - unset all
                    Ext.each(actions, function(action) {
                        if (record.get('has' + action) && action !== 'View') {
                            record.set('access' + action, value, {convert : false});
                        }
                    })
                }

                if (actName !== 'View' && value && record.get('hasView')) {
                    // if set not view - autoset view
                    record.set('accessView', value, {convert : false});
                }
            }
        };
    }

    function widgetAttachFn(prefix) {

        return function(column, widget, record) {
            var has = record.get('has' + prefix),
                isOne = !Ext.Array.clean(Ext.Array.map(actions, function(action) {
                    if (action === prefix) {
                        return null;
                    }

                    return record.get('has' + action) ? 1 : null;
                })).length;

            widget.setValue(record.get('access' + prefix));

            if (!has) {
                widget.disable();
                widget.setValue(false);
                widget.hide();
            } else {
                widget.show();
                if (isOne) {
                    widget.disable();
                    widget.setValue(true);
                } else {
                    widget.enable();
                }
            }
        }
    }

    return {
        alias : 'widget.criterion_settings_security_profile',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.SecurityProfile',

            'criterion.store.EmployeeGroups',
            'criterion.store.MetaFields',
            'criterion.store.security.Fields',
            'criterion.store.Reports',
            'criterion.store.security.RoleGroups',
            'criterion.store.security.Reports',
            'criterion.view.settings.system.securityProfile.EmployeeGroupWidget'
        ],

        cls : 'criterion-settings-security-profile',

        ADMIN_CARD : ADMIN_CARD,

        controller : {
            type : 'criterion_settings_security_profile',
            externalUpdate : false
        },

        bodyPadding : 0,

        title : i18n.gettext('Security Profile Details'),

        viewModel : {
            data : {
                firstRoleRoleCd : null,
                firstRoleOrgType : null,
                firstRoleOrgLevel : null,
                employeeGroupIds : null,

                employersCount : 0,
                rolesCount : 0,

                moduleCheck : {},
                isSingleEmployer : null,

                activeTab : ADMIN_CARD
            },

            stores : {
                employers : {
                    type : 'criterion_employers',
                    listeners : {
                        datachanged : 'onEmployersDataChange'
                    }
                },
                employeeGroups : {
                    type : 'criterion_employee_groups'
                },
                metaFields : {
                    type : 'criterion_meta_fields',
                    proxy : {
                        extraParams : {
                            isSecure : true
                        }
                    }
                },
                securityRoleGroups : {
                    type : 'criterion_security_role_groups'
                },
                reports : {
                    type : 'criterion_reports'
                },
                allSecurityFields : {
                    type : 'criterion_security_fields',
                    sorters : [
                        {
                            property : 'fieldName',
                            direction : 'ASC'
                        }
                    ]
                },
                allSecurityReports : {
                    type : 'criterion_security_reports',
                    sorters : [
                        {
                            property : 'reportName',
                            direction : 'ASC'
                        }
                    ]
                }
            },

            formulas : {
                module : {
                    get : function(get) {
                        var res = 0;

                        Ext.Object.each(get('moduleCheck'), function(key, val) {
                            if (val) {
                                res += val;
                            }
                        });

                        return res;
                    },
                    set : function(value) {
                        var newCheck = {};

                        Ext.Object.each(this.get('moduleCheck'), function(key) {
                            newCheck[key] = value & SECURITY_MODULES[key].value;
                        });

                        this.set('moduleCheck', newCheck);
                    }
                },
                hideEditFunctionList : function(get) {
                    return Ext.Array.indexOf([ADMIN_CARD, SELF_SERVICE_CARD], get('activeTab')) === -1;
                },
                hideAddDocumentLocations : function(get) {
                    return DOCUMENT_LOCATION_CARD !== get('activeTab');
                },
                isTimeClockManagement : function(get) {
                    return get('record.accessTypeCode') === criterion.Consts.ACCESS_TYPES.TIME_CLOCK_MANAGEMENT;
                },
                isOrganizationRole : function(get) {
                    return get('securityRole.selection.code') === criterion.Consts.SECURITY_ROLES.ORGANIZATION;
                }
            }
        },

        initComponent : function() {

            this.items = [
                {
                    xtype : 'criterion_panel',

                    bodyPadding : '20 25',
                    hidden : true,
                    bind : {
                        hidden : '{!employersCount}'
                    },

                    items : [

                        {
                            xtype : 'textfield',
                            name : 'name',
                            fieldLabel : i18n.gettext('Profile Name'),
                            allowBlank : false
                        },
                        {
                            xtype : 'hiddenfield',
                            name : 'moduleInt',
                            disableDirtyCheck : true,
                            bind : {
                                value : '{moduleInt}'
                            }
                        },
                        {
                            xtype : 'hiddenfield',
                            name : 'module',
                            disableDirtyCheck : true,
                            bind : {
                                value : '{module}'
                            }
                        },
                        {
                            xtype : 'checkboxgroup',
                            fieldLabel : i18n.gettext('Module'),
                            disableDirtyCheck : true,
                            bind : {
                                value : '{moduleCheck}',
                                hidden : '{isTimeClockManagement}'
                            },
                            columns : 4,
                            vertical : false,
                            items : moduleItems()
                        },
                        {
                            xtype : 'toolbar',

                            cls : 'criterion-form-toolbar',
                            trackLastItems : true,

                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Access'),
                                    codeDataId : criterion.consts.Dict.ACCESS_TYPE,
                                    bind : '{record.accessTypeCd}',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'button',
                                    reference : 'editButton',
                                    text : i18n.gettext('Edit'),
                                    cls : 'criterion-btn-feature',
                                    handler : 'handleEditRoles',
                                    bind : {
                                        hidden : '{!record.accessTypeCd || record.hasFullAccess || isSingleEmployer || isTimeClockManagement}'
                                    }
                                }
                            ]
                        },

                        // Single Employer block
                        {
                            xtype : 'container',
                            bind : {
                                hidden : '{record.hasFullAccess || !isSingleEmployer}'
                            },
                            hidden : true,
                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Role'),
                                    codeDataId : criterion.consts.Dict.SECURITY_ROLE,
                                    reference : 'securityRole',
                                    allowBlank : false,
                                    bind : {
                                        value : '{firstRoleRoleCd}',
                                        disabled : '{record.hasFullAccess || !isSingleEmployer || isTimeClockManagement}',
                                        hidden : '{isTimeClockManagement && isSingleEmployer}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Organization Type'),
                                    emptyText : i18n.gettext('Not selected'),
                                    codeDataId : criterion.consts.Dict.ORG_STRUCTURE,
                                    valueField : 'attribute1',
                                    reference : 'orgType',
                                    allowBlank : false,
                                    hidden : true,
                                    disabled : true,
                                    bind : {
                                        value : '{firstRoleOrgType}',
                                        disabled : '{!isOrganizationRole || record.hasFullAccess || !isSingleEmployer || isTimeClockManagement}',
                                        hidden : '{!isOrganizationRole}'
                                    }
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Level'),
                                    reference : 'orgLevel',
                                    hidden : true,
                                    disabled : true,
                                    bind : {
                                        value : '{firstRoleOrgLevel}',
                                        disabled : '{!isOrganizationRole || record.hasFullAccess || !isSingleEmployer || isTimeClockManagement}',
                                        hidden : '{!isOrganizationRole}'
                                    }
                                },
                                {
                                    xtype : 'tagfield',
                                    fieldLabel : i18n.gettext('Employee Group'),
                                    reference : 'employeeGroupField',
                                    displayField : 'name',
                                    valueField : 'id',
                                    editable : false,
                                    emptyText : i18n.gettext('Not selected'),
                                    queryMode : 'local',
                                    minHeight : 36,
                                    allowBlank : true,
                                    hidden : true,
                                    bind : {
                                        store : '{employeeGroups}',
                                        value : '{employeeGroupIds}',
                                        hidden : '{securityRole.selection.code !== "' + criterion.Consts.SECURITY_ROLES.EMPLOYEE_GROUP + '" || isTimeClockManagement}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'tabpanel',
                    cls : 'criterion-tab-bar-top-border',
                    tabBar : {
                        defaults : {
                            margin : 0
                        }
                    },
                    hidden : true,
                    bind : {
                        hidden : '{!employersCount || isTimeClockManagement}'
                    },

                    defaults : {
                        cls : 'criterion-grid-panel'
                    },

                    listeners : {
                        render : function() {
                            this.getTabBar().add([
                                {
                                    xtype : 'component',
                                    flex : 1
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Add'),
                                    cls : 'criterion-btn-feature',
                                    handler : 'handleEditFunctionList',
                                    margin : '0 20 5 0',
                                    hidden : true,
                                    bind : {
                                        hidden : '{hideEditFunctionList}'
                                    }
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Add'),
                                    cls : 'criterion-btn-feature',
                                    handler : 'handleAddDocumentLocations',
                                    margin : '0 20 5 0',
                                    hidden : true,
                                    bind : {
                                        hidden : '{hideAddDocumentLocations}'
                                    }
                                }
                            ]);
                        },
                        tabchange : function(tabPanel, newCard) {
                            tabPanel.up('criterion_settings_security_profile').getViewModel().set('activeTab', newCard.reference);
                        }
                    },

                    items : [
                        {
                            xtype : 'grid',
                            title : i18n.gettext('Admin'),
                            reference : ADMIN_CARD,
                            preventStoreLoad : true,
                            tbar : null,
                            controller : {
                                confirmDelete : false
                            },
                            listeners : {
                                removeaction : 'handleRemoveSecurityChildRecord'
                            },
                            bind : {
                                store : '{record.adminFunctions}'
                            },
                            columns : [
                                {
                                    text : i18n.gettext('Function'),
                                    dataIndex : 'securityFunctionName',
                                    flex : 1,
                                    filter : true
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('Act'),
                                    width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH,
                                    dataIndex : 'accessAct',
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('Act')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : widgetAttachFn('Act')
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('Create'),
                                    width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH,
                                    dataIndex : 'accessCreate',
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('Create')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : widgetAttachFn('Create')
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('View'),
                                    width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH,
                                    dataIndex : 'accessView',
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('View')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : widgetAttachFn('View')
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('Edit'),
                                    width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH,
                                    dataIndex : 'accessEdit',
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('Edit')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : widgetAttachFn('Edit')
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('Delete'),
                                    width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH,
                                    dataIndex : 'accessDelete',
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('Delete')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : widgetAttachFn('Delete')
                                },
                                {
                                    xtype : 'criterion_actioncolumn',
                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                    sortable : false,
                                    menuDisabled : true,
                                    items : [
                                        {
                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                            tooltip : i18n.gettext('Delete'),
                                            text : '',
                                            action : 'removeaction'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype : 'grid',
                            reference : SELF_SERVICE_CARD,
                            title : i18n.gettext('Self Service'),
                            preventStoreLoad : true,
                            tbar : null,
                            controller : {
                                confirmDelete : false
                            },
                            listeners : {
                                removeaction : 'handleRemoveSecurityChildRecord'
                            },
                            bind : {
                                store : '{record.essFunctions}'
                            },
                            columns : [
                                {
                                    text : i18n.gettext('Function'),
                                    dataIndex : 'securityFunctionName',
                                    flex : 1,
                                    filter : true
                                },
                                {
                                    xtype : 'criterion_actioncolumn',
                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                    sortable : false,
                                    menuDisabled : true,
                                    items : [
                                        {
                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                            tooltip : i18n.gettext('Delete'),
                                            text : '',
                                            action : 'removeaction'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype : 'grid',
                            reference : FIELDS_CARD,
                            title : i18n.gettext('Fields'),
                            bind : {
                                store : '{allSecurityFields}'
                            },
                            plugins : [
                                'gridfilters'
                            ],
                            columns : [
                                {
                                    text : i18n.gettext('Field'),
                                    dataIndex : 'fieldName',
                                    flex : 1,
                                    filter : true
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('View'),
                                    dataIndex : 'accessView',
                                    checkboxInHeader : true,
                                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('accessView')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : function(column, widget, record) {
                                        widget.setValue(record.get('accessView'));
                                    }
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('Edit'),
                                    dataIndex : 'accessEdit',
                                    checkboxInHeader : true,
                                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('accessEdit')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : function(column, widget, record) {
                                        widget.setValue(record.get('accessEdit'));
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'grid',
                            reference : REPORTS_CARD,
                            title : i18n.gettext('Reports'),
                            bind : {
                                store : '{allSecurityReports}'
                            },
                            plugins : [
                                'gridfilters'
                            ],
                            columns : [
                                {
                                    text : i18n.gettext('Report'),
                                    dataIndex : 'reportName',
                                    flex : 1,
                                    filter : true
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('View'),
                                    dataIndex : 'accessView',
                                    checkboxInHeader : true,
                                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('accessView')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : function(column, widget, record) {
                                        widget.setValue(record.get('accessView'));
                                    }
                                },
                                {
                                    xtype : 'criterion_widgetcolumn',
                                    text : i18n.gettext('Memorize'),
                                    dataIndex : 'accessMemorize',
                                    checkboxInHeader : true,
                                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                                    widget : {
                                        xtype : 'checkbox',
                                        listeners : {
                                            change : createCheckBoxChangeListener('accessMemorize')
                                        },
                                        margin : '0 0 0 25'
                                    },
                                    onWidgetAttach : function(column, widget, record) {
                                        widget.setValue(record.get('accessMemorize'));
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'grid',
                            reference : DOCUMENT_LOCATION_CARD,
                            title : i18n.gettext('Documents'),
                            bind : {
                                store : '{record.documentLocations}'
                            },
                            listeners : {
                                removeaction : 'handleRemoveSecurityChildRecord'
                            },
                            columns : [
                                {
                                    xtype : 'criterion_codedatacolumn',
                                    text : i18n.gettext('Location'),
                                    dataIndex : 'documentLocationCd',
                                    codeDataId : criterion.consts.Dict.DOCUMENT_LOCATION_TYPE,
                                    flex : 1
                                },
                                {
                                    xtype : 'criterion_actioncolumn',
                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                    sortable : false,
                                    menuDisabled : true,
                                    items : [
                                        {
                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                            tooltip : i18n.gettext('Delete'),
                                            text : '',
                                            action : 'removeaction'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ];

            var moduleCheck = {};

            Ext.Object.each(SECURITY_MODULES, function(key) {
                moduleCheck[key] = 0;
            });

            this.getViewModel().set('moduleCheck', moduleCheck);

            this.callParent(arguments);
        }
    };

});
