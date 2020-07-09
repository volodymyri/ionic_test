Ext.define('criterion.view.MultiRecordPicker', function() {

    return {

        alias : 'widget.criterion_multi_record_picker',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.MultiRecordPicker',
            'Ext.grid.filters.Filters'
        ],

        controller : {
            type : 'criterion_multi_record_picker'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '85%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        config : {
            allowDeselect : false,
            allowEmptySelect : false,
            mode : 'MULTI',
            inputStoreLocalMode : false,
            setRecordsSelected : true,
            canBeUnselectable : true
        },

        closable : true,
        draggable : true,

        viewModel : {
            data : {
                title : '',
                editable : false,
                gridColumns : null,
                storeParams : null,
                submitBtnText : i18n.gettext('Select'),
                excludedIds : null,
                selectedRecords : [],
                storeFilters : null,
                searchComboHasValues : false,
                searchComboSortByDisplayField : true
            },
            stores : {
                inputStore : {
                    type : 'criterion_base',
                    fields : []
                },
                localStore : {
                    type : 'store',
                    fields : [],
                    proxy : {
                        type : 'memory'
                    }
                }
            },

            formulas : {
                isTextFilter : function(data) {
                    return data('searchCombo.selection.type') === 'text';
                }
            }
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        layout : 'fit',

        tbar : {
            layout : {
                type : 'vbox',
                align : 'stretch'
            },

            defaults : {
                margin : 10,
                bodyPadding : 10
            },

            bind : {
                hidden : '{!searchComboHasValues}'
            },
            hidden : true,

            items : [
                {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    items : [
                        {
                            xtype : 'combobox',
                            reference : 'searchCombo',
                            flex : 1,
                            queryMode : 'local',
                            listeners : {
                                change : 'handleSearchTypeComboChange'
                            }
                        },
                        {
                            xtype : 'textfield',
                            padding : '0 10',
                            flex : 2,
                            reference : 'searchText',
                            bind : {
                                hidden : '{!isTextFilter}'
                            },
                            listeners : [
                                {
                                    change : 'searchTextHandler'
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            reference : 'filterContainer',
                            bind : {
                                hidden : '{isTextFilter}'
                            },
                            flex : 2,
                            padding : '0 10',
                            layout : {
                                type : 'hbox',
                                align : 'stretch'
                            },
                            items : []
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-feature',
                            text : i18n.gettext('Clear'),
                            handler : 'clearFilters'
                        }
                    ]
                }
            ]
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'cancelBtn',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : 'onCancelHandler'
            },
            {
                xtype : 'button',
                reference : 'selectButton',
                bind : {
                    text : '{submitBtnText}'
                },

                cls : 'criterion-btn-primary',
                scale : 'small',
                disabled : true,
                handler : 'onSelectButtonHandler'
            }
        ],

        bind : {
            title : '{title}'
        },

        initComponent : function() {

            this.items = [
                {
                    xtype : 'criterion_gridpanel',
                    reference : 'grid',

                    width : '100%',

                    plugins : [
                        'gridfilters'
                    ],

                    scrollable : 'y',

                    bind : {
                        store : '{localStore}',
                        columns : '{gridColumns}'
                    },

                    listeners : {
                        scope : 'controller',
                        selectionchange : 'onSelectionChange'
                    },

                    selType : 'checkboxmodel',
                    selModel : {
                        allowDeselect : this.getAllowDeselect(),
                        checkOnly : true,
                        mode : this.getMode(),
                        canBeUnselectable : this.getCanBeUnselectable()
                    }
                }
            ];

            this.callParent(arguments);
        }
    }

});
