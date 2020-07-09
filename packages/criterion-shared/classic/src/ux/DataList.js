Ext.define('criterion.ux.DataList', function() {

    return {

        alias : 'widget.criterion_datalist',

        extend : 'Ext.view.View',

        itemSelector : 'li.x-datalist-item',

        itemCloseSelector : 'x-datalist-item-close',

        config : {
            displayField : null,
            showDeleteButton : true,
            additionalData : ''
        },

        listeners : {
            itemclick : function(cmp, record, item, index, e, eOpts) {
                if (e.getTarget('.' + this.itemCloseSelector)) {
                    record.drop();
                    return false;
                }

                if (item.hasAttribute('url')) {
                    e.stopPropagation();
                    window.open(item.attributes['url'].value, "_self", "rel=noreferrer");
                    return false;
                }
            }
        },

        initComponent : function() {
            this.tpl = new Ext.XTemplate([
                '<ul class="criterion-ux-datalist">',
                '<tpl for=".">',
                    '<li class="x-datalist-item" ', this.getAdditionalData(), '>',
                        '<div class="x-datalist-item-text">{', this.getDisplayField(), '}</div>',
                        '<div class="', this.getShowDeleteButton() && this.itemCloseSelector, '"></div>',
                    '</li>',
                '</tpl>',
                '</ul>'
            ]);

            this.callParent(arguments);
        }
    }
});