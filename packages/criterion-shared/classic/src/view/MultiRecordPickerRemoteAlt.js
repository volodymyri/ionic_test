Ext.define('criterion.view.MultiRecordPickerRemoteAlt', function() {

    return {

        alias : 'widget.criterion_multi_record_picker_remote_alt',

        extend : 'criterion.view.MultiRecordPickerRemote',

        requires : [
            'criterion.controller.MultiRecordPickerRemoteAlt'
        ],

        controller : {
            type : 'criterion_multi_record_picker_remote_alt'
        },

        viewModel : {
            data : {
                selectedRecordCount : 0,
                allowDeleteSelected : true
            },

            formulas : {
                selectedText : function(data) {
                    var selectedRecordCount = data('selectedRecordCount');

                    return selectedRecordCount ?
                        Ext.String.format(i18n.gettext('{0} record{1} selected'), selectedRecordCount, (selectedRecordCount > 1 ? 's' : ''))
                        : i18n.gettext('Selected records');
                }
            }
        },

        createItems : function() {
            var vm = this.getViewModel(),
                gridColumns = vm.get('gridColumns'),
                selectedGridColumns = Ext.clone(gridColumns);

            if (this.getMultiSelect()) {
                gridColumns.unshift({
                    xtype : 'criterion_actioncolumn',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                    excludeFromFilters : true,
                    items : [
                        {
                            glyph : criterion.consts.Glyph['ios7-arrow-up'],
                            tooltip : i18n.gettext('Select'),
                            action : 'selectAction'
                        }
                    ]
                });

                selectedGridColumns.unshift({
                    xtype : 'criterion_actioncolumn',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                    items : [
                        {
                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                            tooltip : i18n.gettext('Delete'),
                            action : 'removeaction',
                            getClass : function(v, m, record, ind1, ind2, store, tableView) {
                                var allowDeleteSelected = tableView.up('criterion_multi_record_picker_remote_alt').getViewModel().get('allowDeleteSelected');

                                return allowDeleteSelected ? '' : 'hidden-el';
                            }
                        }
                    ]
                });

                vm.set('selectedGridColumns', selectedGridColumns);
            }

            var items = [
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
                        selectionchange : !this.getMultiSelect() ? 'onSelectionChange' : Ext.emptyFn,
                        selectAction : 'handleSelectAction'
                    },

                    dockedItems : [
                        {
                            xtype : 'container',
                            dock : 'top',
                            padding : '2 0 2 10',
                            hidden : !this.getMultiSelect(),
                            items : [
                                {
                                    xtype : 'component',
                                    bind : {
                                        html : '{selectedText}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'criterion_gridpanel',
                            reference : 'gridSelected',
                            dock : 'top',
                            scrollable : true,
                            hidden : !this.getMultiSelect(),
                            margin : '0 0 20 0',
                            maxHeight : 140,
                            viewConfig : {
                                markDirty : false
                            },
                            bind : {
                                store : '{selectedStore}',
                                columns : '{selectedGridColumns}'
                            },
                            listeners : {
                                scope : 'controller',
                                removeaction : 'handleRemoveAction'
                            }
                        },

                        {
                            xtype : 'criterion_toolbar_paging',
                            dock : 'bottom',
                            bind : {
                                store : '{inputStore}',
                                visible : '{usePagination}'
                            }
                        }
                    ]
                }
            ];

            if (!this.getMultiSelect()) {
                Ext.apply(items[0], {
                    selType : 'checkboxmodel',
                    selModel : {
                        checkOnly : true,
                        mode : 'SINGLE'
                    }
                });
            }

            return items;
        }
    }

});
