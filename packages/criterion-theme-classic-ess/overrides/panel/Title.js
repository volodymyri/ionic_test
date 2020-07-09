Ext.define('criterion.theme.classic.ess.overrides.panel.Title', {

    override : 'Ext.panel.Title',

    minimizeWidth : false,

    updateText : function(text) {
        this.callParent(arguments);

        if (this.minimizeWidth) {
            if (this.rendered) {
                this._minimizeWidth(text);
            } else {
                this.on('render', this._minimizeWidth, this, {args : [text]});
            }
        }
    },

    _minimizeWidth : function(text) {
        var me = this;

        Ext.defer(function() {
            var width = Ext.util.TextMetrics.measure(me.textEl, text).width + 10;

            me.setMinWidth(width);
            me.setMaxWidth(width);
        }, 100);
    }
});