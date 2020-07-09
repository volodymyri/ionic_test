Ext.define('criterion.ux.grid.column.TimePeriod', function() {

    return {
        alias : [
            'widget.criterion_time_period_column'
        ],

        cls : 'criterion-time-period-column',

        extend : 'Ext.grid.column.Widget',

        menuDisabled : true,

        listeners : {
            resize : 'onResizeColumn',
            scope : 'this'
        },

        childEls : [
            'titleEl', 'textEl', 'textContainerEl', 'textInnerEl', 'periodEl'
        ],

        renderTpl : [
            '<div id="{id}-titleEl" data-ref="titleEl" role="presentation"',
                '{tipMarkup}class="', Ext.baseCSSPrefix, 'column-header-inner<tpl if="!$comp.isContainer"> ', Ext.baseCSSPrefix, 'leaf-column-header</tpl>',
                '<tpl if="empty"> ', Ext.baseCSSPrefix, 'column-header-inner-empty</tpl>">',

                '<div id="{id}-textContainerEl" data-ref="textContainerEl" role="presentation" class="x-hidden ', Ext.baseCSSPrefix, 'column-header-text-container">',
                    '<div role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text-wrapper">',
                        '<div id="{id}-textEl" data-ref="textEl" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text',
                            '{childElCls}">',
                            '<span id="{id}-textInnerEl" data-ref="textInnerEl" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text-inner">{text}</span>',
                        '</div>',
                        '{%',
                            'values.$comp.afterText(out, values);',
                        '%}',
                    '</div>',
                '</div>',

                '<div id="{id}-periodEl" data-ref="periodEl" role="presentation" class="time-period-column-header-period-container">',
                    '<div class="period-block">',
                        '<div class="time-marks">',
                            '<div class="mark">12:00am</div>',
                            '<div class="mark">08:00am</div>',
                            '<div class="mark">04:00pm</div>',
                            '<div class="l-mark">12:00am</div>',
                        '</div>',
                        '<div class="period-marks">',
                            '<div class="period-mark"></div>',
                            '<div class="period-mark"></div>',
                            '<div class="period-mark"></div>',
                            '<div class="period-mark"></div>',
                        '</div>',
                    '</div>',
                '</div>',

            '</div>',
            '{%this.renderContainer(out,values)%}'
        ],

        onResizeColumn : function() {
            this.setMarksStyle();
        },

        afterRender : function() {
            this.callParent(arguments);
            this.setMarksStyle();
        },

        setMarksStyle : function() {
            if (!this.periodEl) {
                return;
            }

            var periodEl = this.periodEl,
                width = periodEl.query('.period-marks', false)[0].getWidth(),
                startTs = +Ext.Date.parse('00:00', 'H:i'),
                marksCfg = ['00:00', '08:00', '16:00', '23:59'];

            Ext.Array.each(periodEl.query('.period-mark', false), function(mark, index) {
                var ts = +Ext.Date.parse(marksCfg[index], 'H:i'),
                    offset = (ts - startTs) * width / 86399000;

                mark.setStyle('left', offset + 'px');
            });
        }

    };

});
