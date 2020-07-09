Ext.define('criterion.view.settings.system.app.Logs', function() {

    return {
        alias : 'widget.criterion_settings_system_app_logs',

        extend : 'criterion.ux.grid.Panel',

        requires : [
            'criterion.store.app.Logs'
        ],

        viewModel : {
            data : {
                appId : null
            },

            stores : {
                logs : {
                    type : 'criterion_app_logs',

                    autoLoad : true,

                    proxy : {
                        extraParams : {
                            appId : '{appId}'
                        }
                    }
                }
            }
        },

        bind : {
            store : '{logs}'
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'closeBtn',
                text : i18n.gettext('Close'),
                cls : 'criterion-btn-light',
                handler : function() {
                    this.up('criterion_settings_system_app_logs').close();
                }
            }
        ],

        listeners : {
            downloadaction : record => {
                window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(
                    criterion.consts.Api.API.APP_DOWNLOAD_TRACE_LOG,
                    record.getId()
                )), '_blank');
            }
        },

        columns : [
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Date/Time'),
                flex : 1,
                dataIndex : 'dateTime',
                format : criterion.consts.Api.DATE_AND_TIME_FORMAT
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Invocation Type'),
                flex : 1,
                dataIndex : 'invocationType'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Action'),
                flex : 1,
                dataIndex : 'action'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Status Message'),
                flex : 1,
                dataIndex : 'statusMessage'
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                sortable : false,
                menuDisabled : true,
                items : [
                    {
                        glyph : criterion.consts.Glyph['android-open'],
                        tooltip : i18n.gettext('Download'),
                        action : 'downloadaction'
                    }
                ]
            }
        ]
    }
});
