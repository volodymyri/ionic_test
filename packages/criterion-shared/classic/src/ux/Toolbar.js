/**
 * Base class for app toolbars.
 */
Ext.define('criterion.ux.Toolbar', function() {

    return {
        alternateClassName : [
            'criterion.ux.Toolbar'
        ],

        alias : 'widget.criterion_toolbar',

        extend: 'Ext.toolbar.Toolbar',

        mixins: [
            'criterion.ux.mixin.Component'
        ]
    };

});