Ext.define('criterion.view.settings.system.securityProfile.SecurityProfileRoles', function() {

    return {
        alias : 'widget.criterion_settings_security_profile_roles',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.securityProfile.SecurityProfileRoles',
            'criterion.store.EmployeeGroups'
        ],

        viewModel : {
            data : {
                record : null
            }
        },

        controller : {
            type : 'criterion_settings_security_profile_roles'
        },

        title : i18n.gettext('Roles'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '60%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
            }
        ],

        closable : false,
        bodyPadding : 0,

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddRole'
                }
            }
        ],

        items : [
            {
                xtype : 'criterion_gridpanel',
                cls : 'widgets-grid',

                viewConfig : {
                    markDirty : false
                },

                disableGrouping : true,

                bind : {
                    store : '{record.roles}'
                },

                listeners : {
                    removeaction : 'handleRemoveRole'
                },

                columns : [
                    {
                        text : i18n.gettext('Employer'),
                        dataIndex : 'employerName',
                        sortable : false,
                        menuDisabled : true,
                        width : 200
                    },
                    {
                        flex : 1,
                        cellWrap : true,
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Role'),
                        dataIndex : 'roleCd',
                        sortable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : criterion.consts.Dict.SECURITY_ROLE
                        }
                    },
                    {
                        flex : 1,
                        cellWrap : true,
                        sortable : false,
                        menuDisabled : true,
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Employee Groups'),
                        dataIndex : 'groupEmployeeGroupIds',
                        widget : {
                            xtype : 'criterion_settings_security_profile_employee_group_widget',
                            bind : {
                                store : '{employeeGroups}',
                                roleCode : '{record.roleCode}',
                                employerId : '{record.employerId}'
                            }
                        }
                    },
                    {
                        flex : 1,
                        cellWrap : true,
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Organization Type'),
                        dataIndex : 'orgType',
                        sortable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'criterion_code_detail_field',
                            emptyText : i18n.gettext('Not selected'),
                            codeDataId : criterion.consts.Dict.ORG_STRUCTURE,
                            viewModel : {
                                data : {
                                    record : null
                                }
                            },
                            valueField : 'attribute1',
                            bind : {
                                value : '{record.orgType}'
                            }
                        },
                        onWidgetAttach : function(column, widget, record) {
                            var vm = widget.getViewModel();
                            vm.set('record', record);
                            vm.bind('{record.roleCode}', function(val) {
                                if (val === criterion.Consts.SECURITY_ROLES.ORGANIZATION) {
                                    this.removeCls('x-hidden');
                                } else {
                                    this.setValue(null);
                                    this.addCls('x-hidden');
                                }
                            }, widget);
                        }
                    },
                    {
                        flex : 1,
                        cellWrap : true,
                        sortable : false,
                        menuDisabled : true,
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Level'),
                        dataIndex : 'orgLevel',
                        widget : {
                            xtype : 'numberfield',
                            viewModel : {
                                data : {
                                    record : null
                                }
                            },
                            bind : {
                                value : '{record.orgLevel}'
                            }
                        },
                        onWidgetAttach : function(column, widget, record) {
                            var vm = widget.getViewModel();
                            vm.set('record', record);
                            vm.bind('{record.roleCode}', function(val) {
                                if (val === criterion.Consts.SECURITY_ROLES.ORGANIZATION) {
                                    this.removeCls('x-hidden');
                                } else {
                                    this.setValue(null);
                                    this.addCls('x-hidden');
                                }
                            }, widget);
                        }
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
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
        ]

    };

});
