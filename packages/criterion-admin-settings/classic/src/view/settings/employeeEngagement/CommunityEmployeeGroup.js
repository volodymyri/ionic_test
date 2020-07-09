Ext.define('criterion.view.settings.employeeEngagement.CommunityEmployeeGroup', function() {

    return {
        alias : 'widget.criterion_settings_community_employee_group',

        requires : [
            'criterion.controller.settings.employeeEngagement.CommunityEmployeeGroup',
            'criterion.store.EmployeeGroups'
        ],

        extend : 'criterion.ux.window.Window',

        modal : true,
        closable : false,

        plugins : {
            ptype : 'criterion_sidebar',
            width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
            height : '50%',
            modal : true
        },

        title : i18n.gettext('Select Employee Groups'),

        layout : 'fit',

        viewModel : {
            data : {
                selectedGroups : []
            }
        },

        controller : {
            type : 'criterion_settings_community_employee_group'
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        buttons : [
            {
                xtype : 'button',
                reference : 'cancel',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'onCancel'
                }
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                reference : 'submit',
                text : i18n.gettext('Confirm'),
                listeners : {
                    click : 'onSubmit'
                }
            }
        ],

        items : [
            {
                xtype : 'gridpanel',
                reference : 'grid',

                cls : 'criterion-grid-centred criterion-grid-panel',

                selModel : {
                    selType : 'checkboxmodel',
                    checkOnly : true
                },

                viewConfig : {
                    markDirty : false
                },

                bind : {
                    store : '{employeeGroups_}'
                },

                listeners : {
                    deselect : 'onDeselect'
                },

                columns : [
                    {
                        text : i18n.gettext('Name'),
                        dataIndex : 'name',
                        flex : 1
                    },
                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('Can Post'),
                        dataIndex : 'canPost',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        padding : 0,
                        widget : {
                            xtype : 'checkbox',
                            name : 'canPost',
                            listeners : {
                                scope : 'controller',
                                change : 'onCanPostChange'
                            }
                        },
                        onWidgetAttach : function(column, widget, record) {
                            record.$widget = widget;
                            widget.setValue(record.get('canPost'));
                        }
                    }
                ]
            }
        ]
    };
});
