Ext.define('criterion.ux.form.ImageField', function() {

    return {
        alias : 'widget.criterion_image_field',

        extend : 'Ext.form.FieldContainer',

        cls : 'criterion-image-field',

        height : 50,
        imageHeight : 50,

        config : {
            url : null,
            value : null,
            buttonText : null
        },

        twoWayBindable : 'value',

        layout : {
            type : 'hbox'
        },

        initComponent : function() {
            var buttonText = this.getButtonText();

            this.items = [{
                xtype : 'component',
                width : this.height,
                height : this.height,
                listeners : {
                    render : {
                        scope : this,
                        single : true,
                        fn : function(cmp) {
                            this.mon(cmp.el, {
                                scope : this,
                                click : function() {
                                    this.fireEvent('imageClick', this);
                                }
                            });
                        }
                    }
                },
                autoEl : {
                    tag : 'div',
                    cls : 'image-wrapper',
                    children : [{
                        tag : 'img',
                        style : {
                            display : 'none',
                            'max-width' : this.imageHeight - 2 + 'px',
                            'max-height' : this.imageHeight - 2 + 'px'
                        }
                    }]
                }
            }];

            if (buttonText) {
                var me = this;

                this.items.push({
                    xtype : 'button',
                    text : buttonText,
                    cls : 'criterion-btn-transparent',

                    listeners : {
                        click : function() {
                            me.fireEvent('imageClick');
                        }
                    }
                });
            }

            this.callParent(arguments);
        },

        setValue : function(value) {
            if (this.rendered) {
                this.setImageUrl(value);
            }

            this.callParent(arguments);
        },

        setImageUrl : function(value) {
            var url = value && value > 0 ? Ext.util.Format.format('{0}/{1}?_dc={2}', this.getUrl(), value, new Date().getTime()) : '';

            this.setSrc(url ? criterion.Api.getSecureResourceUrl(url) : '');
        },

        setSrc : function(src) {
            var img = this.down('component').el.down('img');

            if (img) {
                img.dom.src = src;
                img.dom.style.setProperty('display', src ? 'block' : 'none');
            }
        },

        onRender : function() {
            var value = this.getValue();

            if (value) {
                this.setImageUrl(value);
            }

            this.callParent(arguments);
        }
    }
});