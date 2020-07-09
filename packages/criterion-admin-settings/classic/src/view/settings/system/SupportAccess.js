Ext.define('criterion.view.settings.system.SupportAccess', function() {

    return {

        alias : 'widget.criterion_settings_system_support_access',

        extend : 'criterion.view.settings.GridView',

        title : i18n.gettext('Support Access'),

        requires : [
            'criterion.view.settings.system.SupportAccessForm',
            'criterion.store.SupportUsers'
        ],

        controller : {
            connectParentView : false,
            loadRecordOnEdit : false,
            reloadAfterEditorSave : true,
            editor : {
                xtype : 'criterion_settings_system_support_access_form',
                modal : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        modal : true
                    }
                ],
                draggable : true
            }
        },

        store : {
            type : 'criterion_support_users'
        },

        tbar : [
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                dataIndex : 'name',
                text : i18n.gettext('Name'),
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Allowed IP Address'),
                dataIndex : 'allowedIpAddress',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Expiration Time'),
                dataIndex : 'expirationTime',
                format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                flex : 1
            }
        ]

    };

});
