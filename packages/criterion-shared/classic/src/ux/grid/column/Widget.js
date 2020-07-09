Ext.define('criterion.ux.grid.column.Widget', function() {

    return {
        alias : [
            'widget.criterion_widgetcolumn'
        ],

        extend : 'Ext.grid.column.Widget',

        config : {
            /**
             * Update record on change.
             */
            updateRecord : false,
            checkboxInHeader : false,
            setHeaderCheckboxOnRender : true
        },

        selectedAll : false,

        childEls : [
            'headerEl', 'titleEl', 'triggerEl', 'textEl', 'textContainerEl', 'textInnerEl'
        ],

        updateFn : function(field, value) {
            var widgetColumn = field.getWidgetColumn(),
                dataIndex = field.dataIndex || widgetColumn.dataIndex;

            if (dataIndex) {
                field.getWidgetRecord().set(dataIndex, value, {convert : false});

                // for prevent text selection in an input field
                Ext.defer(function() {
                    if (!field.inputEl) {
                        return;
                    }

                    var elDom = field.inputEl.dom,
                        len = elDom.value && elDom.value.length,
                        range;

                    // The RegExp type check is used to prevent bug:
                    // Failed to execute 'setSelectionRange' on 'HTMLInputElement': The input element's type ('...') does not support selection
                    // Field types text, search, URL, tel and password are the only input types that support setSelectionRange
                    if (elDom.setSelectionRange && /text|search|password|tel|url/i.test(elDom.type || '')) {
                        elDom.setSelectionRange(len, len);
                    } else if (elDom.createTextRange) {
                        range = elDom.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', len);
                        range.moveStart('character', len);
                        range.select();
                    }
                }, 1);
            } else {
                console.warn('[W] Widget column `' + widgetColumn.text + '` does not have `dataIndex` property.')
            }
        },

        changeEvent : 'change',

        initComponent : function() {
            var me = this;

            if (this.onWidgetAttach) {
                this._onWidgetAttach = this.onWidgetAttach;
            }

            this.onWidgetAttach = function(column, widget) {
                widget.on(me.changeEvent, me.updateFn);
                me._onWidgetAttach && me._onWidgetAttach.apply(me.scope, arguments);
            };

            this.renderTpl = [
                '<div id="{id}-titleEl" data-ref="titleEl" role="presentation"',
                '{tipMarkup}class="', Ext.baseCSSPrefix, 'column-header-inner<tpl if="!$comp.isContainer"> ', Ext.baseCSSPrefix, 'leaf-column-header</tpl>',
                '<tpl if="empty"> ', Ext.baseCSSPrefix, 'column-header-inner-empty</tpl>">',
                //
                // TODO:
                // When IE8 retires, revisit https://jsbin.com/honawo/quiet for better way to center header text
                //
                '<div id="{id}-textContainerEl" data-ref="textContainerEl" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text-container">',
                '<div role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text-wrapper">',
                '<div id="{id}-textEl" data-ref="textEl" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text',
                '{childElCls}">',
                (this.getCheckboxInHeader() ? '<span id="{id}-headerEl" style="float: left; margin-right: 5px;" class="x-column-header-checkbox" data-ref="headerEl" role="presentation"><span class="x-column-header-checkbox"></span></span>' : ''),
                '<span id="{id}-textInnerEl" data-ref="textInnerEl" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text-inner">{text}</span>',
                '</div>',
                '{%',
                'values.$comp.afterText(out, values);',
                '%}',
                '</div>',
                '</div>',
                '<tpl if="!menuDisabled">',
                '<div id="{id}-triggerEl" data-ref="triggerEl" role="presentation" unselectable="on" class="', Ext.baseCSSPrefix, 'column-header-trigger',
                '{childElCls}" style="{triggerStyle}"></div>',
                '</tpl>',
                '</div>',
                '{%this.renderContainer(out,values)%}'
            ];

            if (this.getCheckboxInHeader()) {

                this.on('render', function(column) {
                    if (column.setHeaderCheckboxOnRender) {
                        column.selectedAll = !(column.ownerCt.grid.getStore().find(column.dataIndex, false) > -1);
                        column.headerEl.addCls(column.selectedAll ? Ext.baseCSSPrefix + 'grid-hd-checker-on' : '');
                    }
                });

                this.on('headerclick', function(ct, column) {
                    var store = column.ownerCt.grid.getStore();

                    column.selectedAll = !column.selectedAll;

                    if (column.selectedAll) {
                        column.headerEl.addCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
                        store.each(function(record) {
                            record.beginEdit();
                            record.set(column.dataIndex, true, {convert : false});
                            record.endEdit();
                        });
                    } else {
                        column.headerEl.removeCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
                        store.each(function(record) {
                            record.beginEdit();
                            record.set(column.dataIndex, false, {convert : false});
                            record.endEdit();
                        });
                    }
                });
            }

            this.callParent(arguments);
        }
    };

});
