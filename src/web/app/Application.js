/**
 * Main application controller
 */
Ext.define('web.Application', function() {

    var ROUTES = criterion.consts.Route;

    return {
        name : 'web',

        extend : 'criterion.Application',

        requires : [
            'web.view.Main',
            'Ext.Responsive'
        ],

        defaultToken : ROUTES.HR.MAIN,

        mainView : 'web.view.Main',

        init : function() {
            var me = this;

            me.callParent(arguments);

            Ext.setGlyphFontFamily("Ionicons");

            Ext.useShims = !!Ext.isIE;
        }
    };

});
