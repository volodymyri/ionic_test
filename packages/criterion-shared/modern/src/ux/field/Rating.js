Ext.define('criterion.ux.field.Rating', function() {

    return {

        alias : 'widget.criterion_rating',

        extend : 'Ext.field.Field',

        classCls : 'criterion_rating',

        updateValue : function() {
            this.callParent(arguments);
            this.renderRatingByValue(this.getValue());
        },

        renderRatingByValue : function(value) {
            var i = 0,
                j = 0,
                tpl,
                data = [],
                value = Ext.Number.parseFloat(value),
                fStars = Math.floor(value),
                eStars = 5 - Math.round(value);

            for (; i < fStars; i++) {
                data.push({
                    name : 'md-icon-star',
                    active : true
                });
            }
            if (value !== fStars) {
                data.push({
                    name : 'md-icon-star-half',
                    active : true
                });
            }
            if (eStars) {
                for (; j < eStars; j++) {
                    data.push({
                        name : 'md-icon-star-border',
                        active : false
                    });
                }
            }

            tpl = new Ext.XTemplate(
                '<div class="rating x-button layout-box-item x-layout-hbox-item">',
                    '<tpl for=".">',
                        '<span class="x-button-icon x-font-icon x-shown md-icon md-icon {name}"></span>',
                    '</tpl>',
                '</div>'
            );
            tpl.overwrite(this.bodyElement, data);
        }
    }
});
