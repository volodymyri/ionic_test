Ext.define('criterion.view.ManagerSelectorPopup', function() {

    return {

        alias : 'widget.criterion_manager_selector_popup',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ManagerSelectorPopup'
        ],

        title : i18n.gettext('Select Manager'),

        controller : {
            type : 'criterion_manager_selector_popup'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],

        viewModel : {
            stores : {
                supervisors : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'title',
                            type : 'string'
                        },
                        {
                            name : 'employeeId',
                            type : 'integer'
                        }
                    ]
                }
            }
        },

        listeners : {},

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                scale : 'small',
                text : i18n.gettext('Select'),
                handler : 'handleSelectManager'
            }
        ],

        items : [
            {
                xtype : 'combo',
                fieldLabel : i18n.gettext('Manager'),
                name : 'managerId',
                bind : {
                    store : '{supervisors}'
                },
                valueField : 'employeeId',
                displayField : 'title',
                queryMode : 'local',
                forceSelection : true,
                editable : false,
                allowBlank : false
            }
        ]
    }
});