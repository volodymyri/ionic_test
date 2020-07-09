Ext.define('criterion.ux.button.Split', function() {

    return {

        alias : 'widget.criterion_splitbutton',

        extend : 'Ext.button.Split',

        initComponent() {
            let _menu = Ext.clone(this.menu);

            this.menu = new Ext.menu.Menu({
                plain : true,
                shadow : false,
                items : _menu,
                listeners : {
                    beforerender : function() {
                        this.setWidth(this.up('button').getWidth());
                    }
                },
                cls : 'criterion-splitbutton-menu' +
                    (this.ui ? ' menu-' + this.ui : '') +
                    (this.cls ? ' splitbutton' + this.cls.replace('criterion-btn', '') : '') +
                    (this.menuCls ? ' splitbutton-' + this.menuCls : '')
            });

            this.callParent(arguments);
        }
    };

});
