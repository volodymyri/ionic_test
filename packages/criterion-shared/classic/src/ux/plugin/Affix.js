Ext.define('criterion.ux.plugin.Affix', {

    extend : 'Ext.plugin.Abstract',

    alias : 'plugin.criterion_affix',

    pluginId : 'criterion_affix',

    /**
     * Use simple text or html for prefix or suffix or provide cls
     */
    prefix : {
        html : '',
        cls : '',
        margin : '0 0 0 0',
        element : null
    },

    suffix : {
        html : '',
        cls : '',
        margin : '0 0 0 0',
        element : null
    },

    processAffix : function(affix, cmp) {
        if (affix.html || affix.cls) {
            cmp.on('afterrender', function() {
                var insertBeforeEl = cmp.el.getFirstChild ? cmp.el.getFirstChild() : cmp.el;

                affix.element = insertBeforeEl.insertHtml('beforeBegin', '<div>' + (affix.html || '') + '</div>', true);
                affix.element.setMargin(affix.margin);

                affix.element.setCls(affix.cls);

                if (!affix.html) {
                    var margin = affix.element.el.getMargin(),
                        height = cmp.getHeight() - margin.top - margin.bottom;

                    affix.element.setHeight(height);
                }
            }, this, {single : true});

            cmp.on('resize', function(resized, width, height) {
                var prefixMargin = affix.element && affix.element.el && affix.element.el.getMargin();

                prefixMargin && !affix.element.getHeight() && affix.element.setHeight(height - prefixMargin.top - prefixMargin.bottom);
            });
        }
    },

    init : function(cmp) {
        if (!this.prefix.html && !this.suffix.html && !this.prefix.cls && !this.suffix.cls) {
            return;
        }

        this.processAffix(this.prefix, cmp);
        this.processAffix(this.suffix, cmp);

        this.callParent(arguments);
    }
});
