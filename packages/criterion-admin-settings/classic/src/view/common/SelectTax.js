Ext.define('criterion.view.common.SelectTax', function() {

    return {

        alias : 'widget.criterion_common_select_tax',

        extend : 'criterion.ux.form.Panel',

        title : i18n.gettext('Add Employer Tax'),

        requires : [
            'criterion.controller.common.SelectTax',
            'criterion.store.Taxes',
            'criterion.store.employer.WorkLocations'
        ],

        plugins : {
            ptype : 'criterion_sidebar'
        },

        controller : {
            type : 'criterion_common_select_tax'
        },

        listeners : {
            scope : 'controller',
            afterrender : 'handleActivate'
        },

        viewModel : {
            data : {
                record : null,
                blockedTaxes : [],
                searchBy : 1
            },

            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                taxes : {
                    type : 'criterion_taxes'
                }
            },

            formulas : {
                enableButton : function(data) {
                    return !!data('grid.selection');
                },

                activeTaxName : function(data) {
                    return data('searchBy') === 2;
                },

                activeLocation : function(data) {
                    return data('searchBy') === 1;
                }
            }
        },

        bodyPadding : 0,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-primary',
                bind : {
                    disabled : '{!enableButton}'
                },
                handler : 'handleAdd'
            }
        ],

        getAdditionalRecordParams : function() {
            return [];
        },

        getAdditionalFilterParams : function() {
            return [];
        },

        initComponent : function() {
            var additionalRecordParams = this.getAdditionalRecordParams(),
                additionalFilterParams = this.getAdditionalFilterParams(),
                filter = [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Search By'),
                        valueField : 'id',
                        name : 'searchBy',
                        store : Ext.create('Ext.data.Store', {
                            fields : ['id', 'text'],
                            data : [
                                {id : 1, text : i18n.gettext('Work Location')},
                                {id : 2, text : i18n.gettext('Tax Name')}
                            ]
                        }),
                        bind : {
                            value : '{searchBy}'
                        },
                        listeners : {
                            change : 'handleSearchChange'
                        },
                        padding : '20 25 0',
                        editable : false
                    },

                    {
                        xtype : 'combobox',
                        reference : 'location',
                        fieldLabel : i18n.gettext('Location'),
                        valueField : 'geocode',
                        displayField : 'description',
                        queryMode : 'local',
                        name : 'geocode',
                        allowBlank : false,
                        bind : {
                            store : '{employerWorkLocations}',
                            hidden : '{!activeLocation}',
                            disabled : '{!activeLocation}'
                        },
                        listeners : {
                            change : 'handleSearchChange'
                        },
                        padding : '0 25'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Tax Name'),
                        name : 'description',
                        bind : {
                            hidden : '{!activeTaxName}',
                            disabled : '{!activeTaxName}'
                        },
                        padding : '0 25',
                        enableKeyEvents : true,
                        listeners : {
                            keypress : 'onKeyPress'
                        }
                    }
                ];

            if (additionalFilterParams.length) {
                filter = Ext.Array.merge(filter, additionalFilterParams);
            }

            filter = Ext.Array.merge(filter, [
                {
                    xtype : 'container',
                    layout : 'hbox',
                    padding : '0 25 20',
                    items : [
                        {
                            flex : 1
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-primary',
                            text : i18n.gettext('Search'),
                            scale : 'small',
                            handler : 'handleSearch'
                        }
                    ]
                }
            ]);

            this.items = [
                {
                    xtype : 'gridpanel',
                    reference : 'grid',
                    cls : 'criterion-grid-panel',
                    scrollable : 'vertical',
                    maxHeight : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                    dockedItems : [
                        {
                            xtype : 'form',
                            reference : 'searchForm',
                            dock : 'top',
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            items : filter
                        },
                        {
                            xtype : 'criterion_toolbar_paging',
                            dock : 'bottom',
                            displayInfo : true,
                            bind : {
                                store : '{taxes}'
                            }
                        },
                        additionalRecordParams.length ? {
                            xtype : 'container',
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            padding : '0 25',
                            items : additionalRecordParams
                        } : {}
                    ],

                    flex : 1,
                    selModel : {
                        selType : 'checkboxmodel',
                        showHeaderCheckbox : false,
                        mode : 'SINGLE'
                    },

                    viewConfig : {
                        getRowClass : function(record) {
                            var view = this.up().up(),
                                controller = view.getController();

                            return controller.getTaxRowClass(record);
                        }
                    },

                    bind : {
                        store : '{taxes}'
                    },

                    listeners : {
                        beforeselect : 'onBeforeTaxSelect'
                    },

                    columns : [
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Description'),
                            dataIndex : 'description',
                            flex : 1
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }

    };

});

