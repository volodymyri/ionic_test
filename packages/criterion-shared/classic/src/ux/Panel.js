/**
 * Base class for app panels.
 */
Ext.define('criterion.ux.Panel', function() {

    return {
        alias : 'widget.criterion_panel',

        extend : 'Ext.panel.Panel',

        requires : [
            'criterion.ux.mixin.Component'
        ],

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        minButtonWidth : 100
    };

});
