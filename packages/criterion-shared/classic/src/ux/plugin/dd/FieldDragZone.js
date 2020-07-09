Ext.define('criterion.ux.plugin.dd.FieldDragZone', function() {
    return {
        extend : 'Ext.dd.DragZone',

        alias : 'plugin.criterion_webform_fielddragzone',

        constructor : function() {},

        destroy : function() {},

        init : function(container) {
            if (container.nodeType) {
                this.superclass.init.apply(this, arguments);
            } else {
                if (container.rendered) {
                    this.superclass.constructor.call(this, container.getEl());
                    var i = Ext.fly(container.getEl()).select('.draggable');
                    i.unselectable();
                } else {
                    container.on('afterlayout', this.init, this, {single : true});
                }
            }
        },

        scroll : false,

        getDragData : function(e) {
            var t = e.getTarget('.draggable');
            if (t) {
                e.stopEvent();
                var f = Ext.fly(t.id);
                var d = document.createElement('div');
                d.appendChild(document.createTextNode(f.component.tooltip));
                Ext.fly(d).setWidth(f.el.getWidth());
                return {
                    field : f,
                    ddel : d
                };
            }
        },

        onStartDrag : function() {
            this.dragData.field.setOpacity(0);
        },

        endDrag : function(e) {
            this.onEndDrag(this.dragData, e);
            this.dragData.field.setOpacity(1, true);
        },

        getRepairXY : function() {
            return this.dragData.field.el.getXY();
        }
    }

});
