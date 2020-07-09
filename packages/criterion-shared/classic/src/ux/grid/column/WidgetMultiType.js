/**
 * WidgetMultiType
 *
 * for support switch a widget type by record's values
 * sample config:
 *
 *   widget : {
 *       xtype : 'component', // leave for support a default variant
 *       multiXtype : function(record) {
 *           return record.get('method') !== criterion.Consts.INCOME_CALC_METHOD.FORMULA ? 'criterion_currencyfield' : 'criterion_percentagefield';
 *       },
 *       ...
 *   }
 */
Ext.define('criterion.ux.grid.column.WidgetMultiType', function() {

    return {
        alias : [
            'widget.criterion_widget_multi_type_column'
        ],

        extend : 'Ext.grid.column.Widget',

        privates : {
            getWidget : function(record) {
                var me = this,
                    result = null;

                if (record) {
                    // <-- added
                    if (Ext.isFunction(me.widget.multiXtype)) {
                        me.widget.xtype = me.widget.multiXtype(record);
                    }
                    // /

                    result = me.ownerGrid.createManagedWidget(me.getView(), me.getId(), me.widget, record);
                    result.getWidgetRecord = me.widgetRecordDecorator;
                    result.getWidgetColumn = me.widgetColumnDecorator;
                    result.measurer = me;
                    // The ownerCmp of the widget is the encapsulating view, which means it will be considered
                    // as a layout child, but it isn't really, we always need the layout on the
                    // component to run if asked.
                    result.isLayoutChild = me.returnFalse;
                }

                return result;
            }
        }
    };

});
