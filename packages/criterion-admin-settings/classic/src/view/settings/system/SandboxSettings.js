Ext.define('criterion.view.settings.system.SandboxSettings', function() {

    const SANDBOX_SYNC_STATUS = criterion.Consts.SANDBOX_SYNC_STATUS;

    return {

        alias : 'widget.criterion_settings_sandbox',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.system.SandboxSettings'
        ],

        viewModel : {
            data : {
                lastSyncedOn : i18n.gettext('Unknown'),
                syncStatus : SANDBOX_SYNC_STATUS.UNKNOWN.value,
                syncStatusText : SANDBOX_SYNC_STATUS.UNKNOWN.text,
                canSync : false,
                syncButtonDisabled : true
            },
            formulas : {
                showProgress : data => data('syncStatus') === SANDBOX_SYNC_STATUS.IN_PROGRESS.value
            }
        },

        controller : {
            type : 'criterion_settings_sandbox'
        },

        listeners : {
            scope : 'controller',
            show : 'getStatus'
        },

        bodyPadding : '15',

        items : [
            {
                xtype : 'container',
                layout : 'vbox',
                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Sync'),
                        handler : 'onSync',
                        disabled : true,
                        bind : {
                            disabled : '{syncButtonDisabled}'
                        }
                    },
                    {
                        xtype : 'progressbar',
                        reference : 'progressbar',
                        width : 270,
                        margin : '20 0 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showProgress}'
                        }
                    },
                    {
                        xtype : 'displayfield',
                        margin : '20 0 0 0',
                        fieldLabel : i18n.gettext('Last Synced On'),
                        value : i18n.gettext('Unknown'),
                        bind : {
                            value : '{lastSyncedOn}'
                        }
                    },
                    {
                        xtype : 'displayfield',
                        fieldLabel : i18n.gettext('Status'),
                        value : i18n.gettext('Unknown'),
                        bind : {
                            value : '{syncStatusText}'
                        }
                    }
                ]
            }
        ]
    };

});
