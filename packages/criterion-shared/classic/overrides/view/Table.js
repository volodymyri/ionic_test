Ext.define('criterion.overrides.view.Table', {

    override : 'Ext.view.Table',

    cellTpl : [
        '<td class="{tdCls}" {tdAttr} {cellAttr:attributes}',
            ' style="width:{column.cellWidth}px;',
            '{% if(values.tdStyle){out.push(values.tdStyle);}%}"',
            '{% if (values.column.cellFocusable === false) {%}',
                ' role="presentation"',
            '{% } else { %}',
                ' role="{cellRole}" tabindex="-1"',
            '{% } %}',
            '  data-columnid="{[values.column.getItemId()]}">',
            '<div {unselectableAttr} class="' + Ext.baseCSSPrefix + 'grid-cell-inner {innerCls}" ',
                'style="text-align:{align};',
                '{% if (values.style) {out.push(values.style);} %}" ',
                '{cellInnerAttr:attributes}>',
                '{% if (values.column.encodeHtml === true) {%}',
                    '{value:htmlEncode}',
                '{% } else { %}',
                    '{value}',
                '{% } %}',
            '</div>',
        '</td>',
        {
            priority: 0
        }
    ]

});
