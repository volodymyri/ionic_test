Ext.define('criterion.overrides.grid.plugin.RowWidget', {

    override : 'Ext.grid.plugin.RowWidget',

    bindView : function(view) {
        var me = this;

        me.viewListeners = view.on({
            refresh : me.onViewRefresh,
            itemadd : me.onItemAdd,
            resize : me.onResize,
            scope : me,
            destroyable : true
        });
        Ext.override(view, me.viewOverrides);
    },

    _attachedWidgets : {},

    onResize : function(view, width, height, oldWidth, oldHeight) {
        if (width && oldWidth) {
            Ext.Object.each(this._attachedWidgets, function(index, attachedWidget) {
                if (!attachedWidget.el || attachedWidget.el.destroyed) {
                    return;
                }

                attachedWidget.setWidth(width - (attachedWidget.el.up().getPadding('lr')) * 2);
            });
        }
    },

    onWidgetAttach : function(grid, widget, record) {
        this._attachedWidgets[widget.id] = widget;
    }
});
