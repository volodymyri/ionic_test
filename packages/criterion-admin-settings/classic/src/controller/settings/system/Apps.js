Ext.define('criterion.controller.settings.system.Apps', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_system_apps',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.view.settings.system.CustomAppUploadForm',
            'criterion.store.AppsAvailable'
        ],

        handleAdd : function() {
            var me = this;

            Ext.create('criterion.view.RecordPicker', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        modal : true
                    }
                ],
                title : i18n.gettext('Install App'),
                searchFields : [
                    {
                        fieldName : 'name', displayName : i18n.gettext('Name')
                    },
                    {
                        fieldName : 'vendor', displayName : i18n.gettext('Vendor')
                    }
                ],
                actionColumns : [],
                handleSelectClick : Ext.emptyFn,
                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        flex : 2,
                        dataIndex : 'name'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Vendor'),
                        flex : 2,
                        dataIndex : 'vendor'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Version'),
                        flex : 1,
                        dataIndex : 'version'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Endpoint'),
                        flex : 2,
                        dataIndex : 'endpoint'
                    },
                    {
                        xtype : 'widgetcolumn',

                        widget : {
                            xtype : 'container',
                            padding : '0 10',
                            items : [
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Install'),
                                    handler : function() {
                                        var picker = this.up('criterion_record_picker'),
                                            endpoint = this.up().getWidgetRecord().get('endpoint');

                                        picker.setLoading(true);

                                        criterion.Api.requestWithPromise({
                                            url : criterion.consts.Api.API.APP_INSTALL,
                                            jsonData : {
                                                endpoint : endpoint
                                            },
                                            method : 'PUT'
                                        }).then(function() {
                                            picker.close();
                                        }).otherwise(function() {
                                            picker.setLoading(false);
                                        });
                                    }
                                }
                            ]
                        }
                    }
                ],
                store : {
                    type : 'criterion_apps_available'
                }
            }).show().on('close', function() {
                me.load();
            });
        },

        handleAddCustom : function() {
            var me = this;
            Ext.create('criterion.view.settings.system.CustomAppUploadForm').show().on('afterSave', function() {
                me.load();
            });
        }
    };
});
