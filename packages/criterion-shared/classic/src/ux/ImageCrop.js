Ext.define('criterion.ux.ImageCrop', {
    requires : [
        'Ext.Img'
    ],

    extend : 'Ext.Component',

    minWidth : 50,
    minHeight : 50,
    transparentChange : true,

    preserveRatio : true,

    autoEl : {
        tag : 'div',
        children : [{
            tag : 'div',
            cls : 'image-crop-wrapper',
            style : {
                background : '#ffffff',
                opacity : 0.5,
                position : 'absolute'
            }
        }]
    },

    initComponent : function() {
        this.callParent(arguments);
    },

    getResultPosition : function() {
        var me = this,
            parent = me.getBox(),
            img = me.image.getBox(),
            res = {
                x : (img.x - parent.x),
                y : (img.y - parent.y),
                width : me.image.width,
                height : me.image.height,
                imageWidth : parent.width,
                imageHeight : parent.height
            };

        me.image.getEl().setStyle({
            'background-position' : (-res.x) + 'px ' + (-res.y) + 'px'
        });

        return res;
    },

    getCropData : function() {
        return this.getResultPosition();
    },

    onRender : function() {
        var me = this,
            height = me.height,
            width = me.width,
            wrap = me.el.down('.image-crop-wrapper'),
            dragConf = {
                constrain : true,
                listeners : {
                    dragstart : function() {
                        if (me.transparentChange) {
                            me.image.getEl().setStyle({
                                background : 'transparent'
                            });
                        }
                    },
                    drag : function() {
                        if (!me.transparentChange) {
                            me.getResultPosition();
                        }
                    },
                    dragend : function() {
                        var res = me.getResultPosition();

                        me.image.getEl().setStyle({
                            background : 'url(' + me.src + ') no-repeat'
                        });

                        me.image.getEl().setStyle({
                            'background-position' : (-res.x) + 'px ' + (-res.y) + 'px'
                        });
                        me.fireEvent('changeCrop', me, res);
                        me.fireEvent('moveCrop', me, res);
                    },
                    scope : me
                }
            };
        wrap.setSize(me.width, me.height);

        me.el.setStyle({
            background : 'url(' + me.src + ') no-repeat left top'
        });
        if (me.preserveRatio) {
            if (height > width) {
                height = width;
            }
            else {
                width = height;
            }
        }
        me.image = Ext.create('Ext.Img', {
            opacity : 1.0,
            renderTo : me.el,
            resizable : {
                minWidth : me.minWidth,
                minHeight : me.minHeight,
                maxWidth : Math.round(width),
                maxHeight : Math.round(height),
                pinned : true,
                constrainTo : Ext.util.Region.getRegion(me.el),
                preserveRatio : me.preserveRatio,
                fixConstrain : true,

                listeners : {
                    beforeresize : function() {
                        if (me.transparentChange) {
                            me.image.getEl().setStyle({
                                background : 'transparent'
                            });
                        }
                    },
                    resizedrag : function() {
                        if (!me.transparentChange) {
                            me.getResultPosition();
                        }
                    },
                    resize : function(resizer, width, height, e) {
                        var res = me.getResultPosition();

                        me.image.getEl().setStyle({
                            background : 'url(' + me.src + ') no-repeat'
                        });

                        me.image.getEl().setStyle({
                            'background-position' : (-res.x) + 'px ' + (-res.y) + 'px'
                        });

                        me.fireEvent('changeCrop', me, res);
                        me.fireEvent('moveCrop', me, res);
                    }
                }
            },
            draggable : dragConf,
            height : height,
            width : width,
            style : {
                cursor : 'move',
                position : 'absolute',
                background : 'url(' + me.src + ') no-repeat left top'
            }
        });

        me.fireEvent('changeCrop', null, {
            x : 0,
            y : 0,
            width : width,
            height : height
        });

        this.callParent(arguments);
    }
});