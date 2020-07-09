Ext.define('ess.view.Main', {

    extend : 'criterion.view.ess.Main',

    alias : 'widget.criterion_ess_main',

    requires : [
        'ess.controller.Main',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Ext.window.Toast',
        'criterion.ux.form.field.Time',
        'Ext.layout.container.Border',
        'Ext.chart.PolarChart',
        'Ext.chart.plugin.ItemEvents'
    ],

    controller : {
        type : 'criterion_ess_main'
    },

    plugins : ['viewport'],

    listeners : {
        resize : 'handleResize'
    },

    ui : 'navigation',

    initComponent : function() {
        Ext.setGlyphFontFamily('Ionicons');
        Ext.ariaWarn = Ext.emptyFn;
        this.callParent(arguments);
    }

});
