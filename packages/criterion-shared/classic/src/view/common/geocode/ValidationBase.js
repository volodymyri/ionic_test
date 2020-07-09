Ext.define('criterion.view.common.geocode.ValidationBase', function() {

    return {

        extend : 'Ext.tab.Panel',

        requires : [
            'criterion.controller.common.geocode.ValidationBase'
        ],

        controller : {
            type : 'criterion_common_geocode_validation_base'
        },

        fixesURL : null, // should be set in child

        initComponent() {
            this.items = [
                {
                    xtype : 'criterion_gridpanel',
                    width : '100%',
                    flex : 1,
                    scrollable : true,
                    bind : {
                        store : '{autoFixes}',
                        title : i18n.gettext('Auto Fix') + ' ({autoFixes.count})',
                    },
                    columns : [
                        ...this.getObjectColumns(),
                        ...this.getBaseColumns(),
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Geocode'),
                            dataIndex : 'geocode',
                            flex : 1,
                            minWidth : 120
                        }
                    ]
                },
                {
                    xtype : 'criterion_gridpanel_extended',
                    width : '100%',
                    flex : 1,
                    scrollable : true,
                    rowEditing : true,
                    useDefaultTbar : false,
                    bind : {
                        store : '{fixes}',
                        title : i18n.gettext('Manual Fix') + ' ({fixes.count})',
                    },
                    listeners : {
                        edit : 'handleEditManualFix'
                    },
                    columns : [
                        ...this.getObjectColumns(),
                        ...this.getBaseColumns(),
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Current Geocode'),
                            dataIndex : 'currentGeocode',
                            flex : 1,
                            minWidth : 170
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Current School District'),
                            dataIndex : 'currentSchdist',
                            flex : 1,
                            minWidth : 210
                        },
                        {
                            xtype : 'widgetcolumn',
                            text : i18n.gettext('New Geocode / School District'),
                            dataIndex : 'newgeoCode',
                            minWidth : 270,
                            widget : {
                                xtype : 'combobox',
                                matchFieldWidth : false,
                                listConfig : {
                                    minWidth : 270
                                },
                                forceSelection : false,
                                allowBlank : true,
                                autoSelect : true,
                                editable : true,
                                queryMode : 'local',
                                valueField : 'geoIdent',
                                tpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{geoName}</div>',
                                    '</tpl>'
                                ),
                                displayTpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{geoCode}',
                                    '</tpl>'
                                ),
                                listeners : {
                                    change : (cmp, value, oldValue) => {
                                        if (!cmp || cmp.destroyed || !cmp.getWidgetRecord) {
                                            return;
                                        }

                                        let widgetRecord = cmp.getWidgetRecord(),
                                            recv = cmp.getSelection();

                                        widgetRecord.set({
                                            newgeoCode : value,
                                            geocode : recv ? recv.get('geoCode') : null,
                                            schdist : recv ? recv.get('schdist') : null
                                        });
                                    }
                                },
                                triggers : {
                                    reload : {
                                        handler : 'handleReloadGeoCodes',
                                        cls : 'criterion-reload-trigger-transparent',
                                        tooltip : i18n.gettext('Reload Geo Codes')
                                    }
                                }
                            },
                            onWidgetAttach : (column, widget, record) => {
                                widget.setStore(record.geocodes());
                            }
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        },

        getObjectColumns() {
            return [];
        },

        getBaseColumns() {
            return [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Address 1'),
                    dataIndex : 'address1',
                    flex : 1,
                    minWidth : 150,
                    editor : {
                        allowBlank : false
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Address 2'),
                    dataIndex : 'address2',
                    flex : 1,
                    minWidth : 150,
                    editor : {
                        allowBlank : true
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('City'),
                    dataIndex : 'city',
                    flex : 1,
                    minWidth : 150,
                    editor : {
                        allowBlank : false
                    }
                },
                {
                    xtype : 'criterion_codedatacolumn',
                    dataIndex : 'stateCd',
                    codeDataId : criterion.consts.Dict.STATE,
                    text : i18n.gettext('State'),
                    flex : 1,
                    minWidth : 150,
                    editor : {
                        allowBlank : false,
                        bind : {
                            filterValues : {
                                attribute : 'attribute1',
                                value : '{countryCDField.selection.code}'
                            }
                        }
                    }
                },
                {
                    xtype : 'criterion_codedatacolumn',
                    dataIndex : 'countryCd',
                    codeDataId : criterion.consts.Dict.COUNTRY,
                    text : i18n.gettext('Country'),
                    flex : 1,
                    minWidth : 150,
                    editor : {
                        allowBlank : false,
                        reference : 'countryCDField'
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Zipcode'),
                    dataIndex : 'postalCode',
                    flex : 1,
                    minWidth : 120,
                    editor : {
                        allowBlank : false
                    }
                }
            ]
        },

        load() {
            return this.getController().load();
        },

        handleUpdate() {
            return this.getController().handleUpdate();
        }
    };

});
