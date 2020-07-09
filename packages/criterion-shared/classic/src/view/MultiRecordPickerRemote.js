Ext.define('criterion.view.MultiRecordPickerRemote', function() {

    return {

        alias : 'widget.criterion_multi_record_picker_remote',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.MultiRecordPickerRemote',
            'Ext.grid.filters.Filters'
        ],

        controller : 'criterion_multi_record_picker_remote',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '85%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        config : {
            allowEmptySelect : false,
            allowGridFilter : false,
            multiSelect : true,
            afterSelectAction : 'destroy',
            afterCancelAction : 'destroy'
        },

        closable : true,
        scrollable : false,
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
                hideFilters : false,
                hideAdditionalFilters : true,
                showClearButton : true
            },
            stores : {
                //inputStore : null
            },

            formulas : {
                usePagination : function(data) {
                    var inputStore = data('inputStore');

                    return inputStore && !!inputStore.getPageSize() && !inputStore.isBufferedStore;
                },
                isTextFilter : function(data) {
                    return data('searchCombo.selection.type') === 'text';
                },
                showFilters : function(data) {
                    return data('searchComboHasValues') && !data('hideFilters')
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
                hidden : '{!showFilters}'
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
                            },
                            editable : false,
                            sortByDisplayField : false
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
                            handler : 'clearFilters',
                            bind : {
                                hidden : '{!showClearButton}'
                            }
                        }
                    ]
                },
                // additional filters
                {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    bind : {
                        hidden : '{!additionalFilters}'
                    },
                    hidden : true,
                    reference : 'additionalFiltersBlock',
                    items : []
                }
            ]
        },


        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'cancelButton',
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

        createItems : function() {
            let vm = this.getViewModel();

            return [
                {
                    xtype : 'criterion_gridpanel',
                    reference : 'grid',

                    width : '100%',

                    scrollable : true,

                    plugins : this.getAllowGridFilter() ? 'gridfilters' : null,

                    bind : {
                        store : '{inputStore}',
                        columns : '{gridColumns}'
                    },

                    listeners : {
                        scope : 'controller',
                        selectionchange : 'onSelectionChange'
                    },

                    selType : 'checkboxmodel',
                    selModel : {
                        checkOnly : true,
                        showHeaderCheckbox : vm && vm.get('inputStore.isBufferedStore') ? false : undefined,
                        mode : this.getMultiSelect() ? 'MULTI' : 'SINGLE',
                        pruneRemoved : false
                    },

                    dockedItems : {
                        xtype : 'criterion_toolbar_paging',
                        dock : 'bottom',
                        bind : {
                            store : '{inputStore}',
                            visible : '{usePagination}'
                        }
                    }
                }
            ];
        },

        initComponent : function() {
            var me = this;

            me.items = this.createItems();

            this.callParent(arguments);
        }
    }

});
