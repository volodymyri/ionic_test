Ext.define('criterion.view.WorkLocationsSelector', function() {

    return {
        alias : 'widget.criterion_work_locations_selector',

        requires : [
            'criterion.controller.WorkLocationsSelector',
            'criterion.store.WorkLocations'
        ],

        extend : 'criterion.ux.window.Window',

        modal : false,
        closable : false,

        plugins : {
            ptype : 'criterion_sidebar',
            width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
            height : '50%',
            modal : true
        },

        title : i18n.gettext('Select Work Location'),

        layout : 'fit',

        viewModel : {
            data : {
                selectedRecords : []
            },
            stores : {
                workLocations : {
                    type : 'work_locations'
                }
            }
        },

        controller : {
            type : 'criterion_work_locations_selector'
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        config : {
            showPrimarySelector : true,
            predefinedWorkLocations : null
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

        initComponent : function() {
            this.items = [
                {
                    xtype : 'gridpanel',
                    reference : 'grid',

                    cls : 'criterion-grid-centred criterion-grid-panel',

                    selModel : {
                        selType : 'checkboxmodel',
                        checkOnly : true
                    },

                    bind : {
                        store : '{workLocations}'
                    },

                    listeners : {
                        select : 'onSelect',
                        deselect : 'onDeselect'
                    },

                    columns : [
                        {
                            text : i18n.gettext('Description'),
                            dataIndex : 'description',
                            flex : 2
                        },
                        {
                            text : i18n.gettext('Address'),
                            dataIndex : 'address1',
                            flex : 2
                        },
                        {
                            text : i18n.gettext('City'),
                            dataIndex : 'city',
                            flex : 1
                        },
                        {
                            xtype : 'criterion_codedatacolumn',
                            codeDataId : criterion.consts.Dict.STATE,
                            text : i18n.gettext('State'),
                            dataIndex : 'stateCd',
                            flex : 1
                        },
                        this.getShowPrimarySelector() && {
                            xtype : 'widgetcolumn',
                            text : i18n.gettext('Primary'),
                            dataIndex : 'isPrimary',
                            flex : 1,
                            padding : 0,
                            widget : {
                                xtype : 'radio',
                                name : 'isPrimaryLocation',
                                margin : 0,
                                padding : 0,
                                listeners : {
                                    scope : 'controller',
                                    change : 'onIsPrimaryChange'
                                }
                            },
                            onWidgetAttach : function(column, widget, record) {
                                record.$widget = widget;
                                widget.setValue(record.get('isPrimary'));
                            }
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    };
});
