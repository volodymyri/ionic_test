/**
 * Action column with glyphs support.
 */
Ext.define('criterion.ux.grid.column.Action', function () {

    return {

        alias : 'widget.criterion_actioncolumn',

        extend : 'Ext.grid.column.Action',

        sortable : false,

        hideable : false,

        resizable : false,

        draggable : false,

        menuDisabled : true,

        editRenderer : Ext.emptyFn,

        stopSelection : false,

        encodeHtml : false,

        constructor : function(config) {
            if (config && config.items && !Ext.isNumber(config.width)) {
                config.width  = config.items.length * criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH
            }

            this.callParent(arguments);
        },

        /**
         * Copied from base class.
         *
         * @param v
         * @param cellValues
         * @param record
         * @param rowIdx
         * @param colIdx
         * @param store
         * @param view
         * @returns {*|string}
         */
        defaultRenderer : function(v, cellValues, record, rowIdx, colIdx, store, view) {
            var me = this,
                prefix = Ext.baseCSSPrefix,
                scope = me.origScope || me,
                items = me.items,
                len = items.length,
                i = 0,
                item, ret, disabled, tooltip, glyph,
                colCls, itemCls, textCls, itemQtip, bCls, itemUi, itemStyle;

            // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
            // Assign a new variable here, since if we modify "v" it will also modify the arguments collection, meaning
            // we will pass an incorrect value to getClass/getTip
            ret = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : '';

            cellValues.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
            for (; i < len; i++) {
                item = items[i];
                itemStyle =  '';

                disabled = item.disabled || (item.isActionDisabled ? item.isActionDisabled.call(item.scope || scope, view, rowIdx, colIdx, item, record) : false);
                tooltip = disabled ? null : (item.tooltip || (item.getTip ? item.getTip.apply(item.scope || scope, arguments) : null));

                // Only process the item action setup once.
                if (!item.hasActionConfiguration) {
                    // Apply our documented default to all items
                    item.stopSelection = me.stopSelection;
                    item.disable = Ext.Function.bind(me.disableAction, me, [i], 0);
                    item.enable = Ext.Function.bind(me.enableAction, me, [i], 0);
                    item.hasActionConfiguration = true;
                }

                colCls = prefix + 'action-col-' + String(i);
                itemCls = [ me.actionIconCls, colCls ];

                itemQtip = tooltip ? ' data-qtip="' + criterion.Utils.decodeHtmlEntities(tooltip) + '"' : '';


                if (disabled) {
                    itemCls.push(prefix + 'item-disabled');
                }

                if (Ext.isFunction(item.getClass)) {
                    itemCls.push(item.getClass.apply(item.scope || scope, arguments))
                } else if (item.iconCls || me.iconCls) {
                    itemCls.push(item.iconCls || me.iconCls);
                }

                itemCls = itemCls.join(' ');

                if (Ext.isFunction(item.permissionAction) && !item.permissionAction(v, cellValues, record, rowIdx, colIdx, store, view)) {
                    continue;
                }

                glyph = item.glyph || (item.getGlyph ? item.getGlyph.apply(item.scope || scope, arguments) : null);

                if (glyph) {
                    ret += '<span role="button"'
                        + ' alt="' + (item.altText || me.altText) + '"'
                        + ' class="' + itemCls + '"'
                        + ' style="font-family:' + (item.glyphFontFamily || Ext._glyphFontFamily) + '"'
                        + itemQtip + '>'
                        + '&#' + glyph + (item.text ? ' ' + item.text : '')
                        + '</span>';
                } else {
                    if (item.icon) {
                        ret += '<img role="button"'
                            + ' alt="' + (item.altText || me.altText) + '"'
                            + ' src="' + (item.icon || Ext.BLANK_IMAGE_URL) + '"'
                            + ' class="' + itemCls + '"'
                            + itemQtip + '/>';
                    }

                    if (item.text && !item.asButton) {
                        textCls = [ prefix + 'action-col-text', colCls ].join(' ');

                        ret += '<span class="' + itemCls + ' ' + textCls + '">' + item.text + '</span>'
                    } else if (item.text) {
                        bCls = [colCls];
                        if (Ext.isFunction(item.getClass)) {
                            bCls.push(item.getClass.apply(item.scope || scope, arguments))
                        }

                        itemUi = item.ui || 'default';

                        if(item.style){
                            Ext.Array.each(Ext.Object.getAllKeys(item.style), function(property) {
                                itemStyle += Ext.String.format('{0}:{1};', property, item.style[property]);
                            });
                        }
                        ret += '<a ' + (itemStyle ? 'style="' + itemStyle + '"' : '') + ' class="' + bCls.join(' ') + ' x-btn x-unselectable x-toolbar-item x-btn-' + itemUi + '-small criterion-action-grid-btn">' +
                            '<span class="x-btn-wrap x-btn-wrap-' + itemUi + '-small">' +
                                '<span class="x-btn-button x-btn-button-' + itemUi + '-small x-btn-text x-btn-button-center">' +
                                    '<span class="x-btn-icon-el x-btn-icon-el-' + itemUi + '-small"></span>' +
                                    '<span class="' + bCls.join(' ') + ' x-btn-inner x-btn-inner-' + itemUi + '-small">' + item.text + '</span>' +
                                '</span>' +
                            '</span></a>';
                    }
                }
            }

            return ret;
        },

        handler : function(view, rowIdx, colIdx, item, e, record) {
            var grid = view.ownerGrid,
                sm = view.getSelectionModel(),
                selection = sm.getSelection();

            if (!Ext.Array.contains(selection, record)) {
                sm.select([ record ]);
            }

            if (item.action) {
                grid.fireEvent(item.action, record, grid, rowIdx, colIdx, item);

                Ext.GlobalEvents.fireEvent('gridAction_' + item.action + 'Act', record);
            }
        }
    };

});
