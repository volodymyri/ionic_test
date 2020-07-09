Ext.define('criterion.ux.ColorLegend', function() {
    return {
        extend: 'Ext.container.Container',
        alias: 'widget.criterion_color_legend',

        ownCls: 'criterion-color-legend',

        margin : 10,

        tpl: [
            '<div class="{ownCls}-title">' + i18n.gettext('Legend') + '</div>',
            '<table>',
                '<tpl for="values">',
                    '<tr>',
                        '<td class="{parent.ownCls}-color"><span style="background-color: {color}"></span></td>',
                        '<td class="{parent.ownCls}-label"><span>{label}</span></td>',
                    '</tr>',
                '</tpl>',
            '</table>'
        ],

        initComponent: function() {
            this.callParent(arguments);
            this.addCls('criterion-color-legend');
        },

        update: function(data) {
            Ext.apply(data, {
                ownCls: this.ownCls
            });

            this.callParent(arguments);
        }
    }
});