/**
 * Base class for app windows.
 */
Ext.define('criterion.ux.window.Window', function() {

    return {
        alias : [
            'widget.criterion_window',
            'widget.criterion_window'
        ],

        extend: 'Ext.window.Window',

        mixins: [
            'criterion.ux.mixin.Component'
        ],

        constrain : true,

        modal: true,

        autoAnchorToBodyCenter: false,

        onRender: function () {
            var me = this;
            me.callParent(arguments);
            if (me.autoAnchorToBodyCenter) {
                me.anchorTo(Ext.getBody(), 'c', [ -(me.getWidth() / 2), -(me.getHeight() / 2) ]);
            }
        }
    };

});