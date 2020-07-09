Ext.define('criterion.view.settings.employeeEngagement.Community', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'widget.criterion_settings_community',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.employeeEngagement.Community',
            'criterion.store.employeeGroup.Communities',
            'criterion.store.EmployeeGroups',
            'Ext.ux.form.ItemSelector',
            'criterion.store.Employers',
            'criterion.view.settings.employeeEngagement.IconPicker',
            'criterion.store.community.Icons'
        ],

        controller : {
            type : 'criterion_settings_community',
            externalUpdate : false
        },

        viewModel : {
            data : {
                selectedGroups : [],
                selectedGroupsText : null
            },
            stores : {
                employeeGroupCommunities : {
                    type : 'criterion_employee_group_communities'
                },
                employeeGroups : {
                    type : 'criterion_employee_groups'
                },
                communityIcons : {
                    type : 'criterion_community_icons'
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

        title : i18n.gettext('Community Details'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        initComponent : function() {
            var employers = Ext.create('criterion.store.Employers');

            this.items = [
                {
                    xtype : 'criterion_panel',

                    layout : 'hbox',

                    bodyPadding : '0 10',

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                    items : [
                        {
                            flex : 3,
                            items : [
                                {
                                    xtype : 'fieldcontainer',
                                    layout : 'hbox',
                                    fieldLabel : i18n.gettext('Community Icon'),
                                    items : [
                                        {
                                            xtype : 'criterion_settings_icon_picker',
                                            url : API.COMMUNITY_ICON_IMAGE,
                                            padding : '0 40 0 0',
                                            bind : {
                                                value : '{record.iconId}',
                                                store : '{communityIcons}'
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Community Name'),
                                            allowBlank : false,
                                            name : 'name',
                                            flex : 1
                                        }
                                    ]
                                },
                                {
                                    xtype : 'itemselector',
                                    reference : 'employerSelector',
                                    store : employers,
                                    buttons : ['add', 'remove'],
                                    displayField : 'legalName',
                                    valueField : 'id',
                                    fromTitle : i18n.gettext('Eligible'),
                                    toTitle : i18n.gettext('Selected'),
                                    height : 300,
                                    listeners : {
                                        change : 'onSelectionChange'
                                    }
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Active'),
                                    name : 'isActive'
                                },
                                {
                                    xtype : 'fieldcontainer',
                                    fieldLabel : i18n.gettext('Employee Groups'),
                                    layout : 'hbox',
                                    anchor : '100%',
                                    requiredMark : true,
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            reference : 'selectedGroupsField',
                                            bind : {
                                                value : '{selectedGroupsText}'
                                            },
                                            flex : 1,
                                            readOnly : true,
                                            disableDirtyCheck : true,
                                            allowBlank : false
                                        },
                                        {
                                            xtype : 'button',
                                            cls : 'criterion-btn-light',
                                            glyph : criterion.consts.Glyph['ios7-plus-empty'],
                                            scale : 'small',
                                            margin : '0 0 0 3',
                                            listeners : {
                                                click : 'handleSelectEmployeeGroups'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'htmleditor',
                                    labelAlign : 'top',
                                    fieldLabel : i18n.gettext('Description'),
                                    name : 'description',
                                    height : 200
                                }
                            ]
                        }
                    ]
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
