Ext.define('criterion.ux.toolbar.ToolbarPaging', {

    alternateClassName : [
        'criterion.toolbar.Paging',
        'criterion.ux.toolbar.Paging'
    ],

    alias : 'widget.criterion_toolbar_paging',

    extend : 'Ext.toolbar.Paging',

    requires : [
        'Ext.form.Label'
    ],

    mixins : [
        'criterion.ux.mixin.Component'
    ],

    listeners : {
        change : 'handleChangeTB',
        scope : 'this'
    },

    initComponent : function() {
        this.displayInfo = false;

        if (this.stateful && this.stateId && !this.lstorage) {
            this.lstorage = Ext.util.LocalStorage.get('tBPaging');
        }

        this.callParent(arguments);
    },

    config : {
        totalText : i18n.gettext('{0} results'),

        allowAutoLoad : false,

        allowLoadAll : false // all disabled by default
    },

    getPagingItems : function() {
        var me = this,
            pagingItems = me.callParent(),
            total = me.getPageData().total,
            pageSizeOptions;

        pageSizeOptions = Ext.Array.map(criterion.Consts.PAGE_SIZE.VALUES, val => {
            return {
                name : val,
                pagesize : val
            }
        });

        if (this.getAllowLoadAll()) {
            pageSizeOptions.push({
                name : i18n.gettext('All'),
                pagesize : criterion.Consts.PAGE_SIZE.NONE
            });
        }

        Ext.applyIf(me, {
            pageSizeOptions : pageSizeOptions
        });

        pagingItems.unshift(
            {
                xtype : 'tbtext',
                itemId : 'totalText',
                text : Ext.String.format(me.getTotalText(), total)
            }
        );

        pagingItems = Ext.Array.filter(pagingItems, function(item) {
            return item.itemId !== 'refresh';
        });

        pagingItems.push('->');
        pagingItems.push(i18n.gettext('Display'));
        pagingItems.push(me.buildComboBox());
        pagingItems.push(i18n.gettext(i18n.gettext('results per screen')));

        return pagingItems;
    },

    updateInfo : function() {
        var me = this;

        me.child('#totalText').setText(
            Ext.String.format(me.getTotalText(), me.getPageData().total)
        );

        me.callParent(arguments);
    },

    handleChangeTB : function() {
        var store = this.store,
            totalCount = this.getPageData().total;

        if (!store.isFiltered() && store.count() === 0 && totalCount > 0) {
            // resetting an incorrect paging state
            Ext.defer(function() {
                store.loadPage(1);
            }, 500);
        }
    },

    mayReload : function() {
        let store = this.store;

        // Stores with autoLoad = false may need additional proxy setup before first load, so prevent paging toolbar from reload such stores before they was loaded already
        return store && !store.isEmptyStore && (store.getAutoLoad() || this.getAllowAutoLoad() || store.isLoaded() || store.isLoading());
    },

    buildComboBox : function() {
        var me = this,
            size;

        if (this.stateful && this.stateId) {
            size = this.lstorage.getItem(this.stateId);
        }

        return {
            xtype : 'combobox',
            itemId : 'pageSize',
            queryMode : 'local',
            triggerAction : 'all',
            displayField : 'name',
            valueField : 'pagesize',
            width : 70,
            lazyRender : true,
            allowBlank : false,
            enableKeyEvents : false,
            value : size ? parseInt(size, 10) : criterion.Consts.PAGE_SIZE.DEFAULT,
            editable : false,
            forceSelection : me.forceSelection || true,
            store : me.pageSizeOptions,

            listeners : {
                change : function(combo, pageSize) {
                    if (me.stateful && me.stateId) {
                        me.lstorage.setItem(me.stateId, pageSize);
                    }

                    me.store.setPageSize(pageSize);

                    if (me.mayReload()) {
                        me.store.reload({
                            limit : pageSize
                        });
                    }
                }
            }
        };
    },

    resetPageSize : function() {
        this.down('#pageSize').setValue(this.store.getPageSize());
    },

    getPageData : function() {
        var store = this.store,
            totalCount = (!!store.pageSize || !store.isFiltered()) ? store.getTotalCount() : store.count();

        return {
            total : totalCount,
            currentPage : store.currentPage,
            pageCount : store.pageSize === 0 ? (totalCount ? 1 : 0) : Math.ceil(totalCount / store.pageSize),
            fromRecord : ((store.currentPage - 1) * store.pageSize) + 1,
            toRecord : Math.min(store.currentPage * store.pageSize, totalCount)
        };
    },

    onBindStore : function(store) {
        let size;

        this.callParent(arguments);

        if (store && !store.isEmptyStore && this.getAllowAutoLoad()) {
            if (this.stateful && this.stateId) {
                size = this.lstorage.getItem(this.stateId);
            }

            if (Ext.isEmpty(size)) {
                size = store.getPageSize();
            } else {
                size = parseInt(size, 10);
                store.setPageSize(size);
                this.resetPageSize();
            }

            if (this.mayReload()) {
                store.reload({
                    limit : size
                });
            }
        }
    }
});
