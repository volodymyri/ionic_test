Ext.define('criterion.ux.form.WebForm', function() {
    var spriteUnderMouse,
        mouseDown = null;

    return {
        extend : 'Ext.draw.Container',

        alias : 'widget.criterion_webform',

        requires : [
            'Ext.layout.container.Absolute',
            'criterion.ux.plugin.dd.WebFormDropZone',
            'Ext.draw.plugin.SpriteEvents'
        ],

        config : {
            activeField : null,
            activeSprite : null,
            currentPage : null,
            zoom : 0,

            /**
             * @type criterion.model.Form
             */
            record : null
        },

        preventCanvasClickEvent : false,

        surfaceReady : false,

        cls : 'web-form',

        layout : 'absolute',

        fillMode : false,

        plugins : [
            'criterion_webform_dropzone',
            {
                ptype : 'spriteevents',

                //Override base hitTestEvent function
                hitTestEvent : function(e) {
                    var items = this.drawContainer.getItems(),
                        surface, sprite, i;

                    for (i = items.length - 1; i >= 0; i--) {
                        surface = items.get(i);
                        sprite = surface.hitTestEvent && surface.hitTestEvent(e);

                        if (sprite) {
                            return sprite;
                        } else {

                            //Detect Line. Sencha doesn't want do it.
                            surface.getItems && Ext.Array.each(surface.getItems(), function(item) {
                                if (item.type == 'line') {
                                    var xy = surface.getEventXY(e),
                                        x1 = item.attr.fromX,
                                        y1 = item.attr.fromY,
                                        x2 = item.attr.toX,
                                        y2 = item.attr.toY,
                                        h = Math.abs((y1 - y2) * (xy[0] - x1) + (x2 - x1) * (xy[1] - y1));

                                    if (h < 1000) {
                                        sprite = {
                                            sprite : item
                                        };

                                        return false;
                                    }
                                }
                            });

                            if (sprite) {
                                return sprite;
                            }
                        }
                    }

                    return null;
                }
            }
        ],

        listeners : {
            scope : 'this',
            render : 'handleRender'
        },

        style : {
            border : '1px solid grey'
        },

        initComponent : function() {
            var me = this;

            me.keyNav = new Ext.util.KeyMap({
                target : window,
                binding : [
                    {
                        key : Ext.event.Event.ESC,
                        handler : function(key, e) {
                            var targetEl = Ext.fly(e.target),
                                cmp = targetEl && targetEl.component;

                            if (cmp.up() !== me && cmp !== Ext.getBody().component) {
                                return
                            }

                            var field = me.getActiveField(),
                                sprite = me.getActiveSprite();

                            if (field) {
                                field.removeCls('focused');
                            }

                            me.setActiveField();

                            if (sprite && sprite.isDrawMode) {
                                me.setActiveSprite();
                                me.getSurface().remove(sprite);
                                me.renderFrame();
                            }
                        }
                    },
                    {
                        key : [Ext.event.Event.DELETE, Ext.event.Event.BACKSPACE],
                        handler : function(key, e) {
                            var targetEl = Ext.fly(e.target),
                                cmp = targetEl && targetEl.component;

                            if (cmp.up('criterion_webform') !== me && cmp !== Ext.getBody().component) {
                                return;
                            }

                            var field = me.getActiveField(),
                                sprite = me.getActiveSprite(),
                                record = me.getRecord(),
                                formField;

                            if (field) {
                                me.setActiveField();
                                formField = field.formField;
                                me.remove(field);
                            }

                            if (sprite) {
                                me.setActiveSprite();
                                formField = sprite.formField;
                                sprite.remove();
                                me.renderFrame();
                            }

                            if (formField) {
                                record.formFields().remove(formField);
                            }
                        }
                    },
                    {
                        key : Ext.event.Event.UP,
                        handler : function(key, e) {
                            var targetEl = Ext.fly(e.target),
                                cmp = targetEl && targetEl.component;

                            if (cmp.up() !== me && cmp !== Ext.getBody().component) {
                                return;
                            }

                            var field = me.getActiveField();

                            if (field) {
                                var localY = field.getLocalY(),
                                    delta = e.shiftKey ? 10 : 1;

                                if (field && localY > delta) {
                                    var fieldY = field.getY(),
                                        fieldX = field.getX();

                                    if (!me.detectIntersections(field, new Ext.util.Region(fieldY - delta, fieldX + field.width, fieldY + field.height - delta, fieldX))) {
                                        field.move('t', delta);
                                    }
                                }

                                if (field && localY <= delta && localY > 0) {
                                    field.setLocalY(0);
                                }

                                me.fireEvent('changeActiveField', me, field);
                            } else {
                                var sprite = me.getActiveSprite();

                                if (sprite) {
                                    me.moveSprite(sprite, 0, e.shiftKey ? -10 : -1);

                                    me.fireEvent('changeActiveSprite', me, sprite);

                                    me.renderFrame();
                                }
                            }
                        }
                    },
                    {
                        key : Ext.event.Event.RIGHT,
                        handler : function(key, e) {
                            var targetEl = Ext.fly(e.target),
                                cmp = targetEl && targetEl.component;

                            if (cmp.up() !== me && cmp !== Ext.getBody().component) {
                                return;
                            }

                            var field = me.getActiveField();

                            if (field) {
                                var localX = field.getLocalX(),
                                    fieldWidth = field.getWidth(),
                                    delta = e.shiftKey ? 10 : 1;

                                if (me.width > fieldWidth / (me.zoom / 100) + localX) {
                                    var fieldY = field.getY(),
                                        fieldX = field.getX();

                                    if (!me.detectIntersections(field, new Ext.util.Region(fieldY, fieldX + field.width + delta, fieldY + field.height, fieldX + delta))) {
                                        field.move('r', delta);
                                    }
                                }

                                if (field.getLocalX() > me.width - fieldWidth) {
                                    field.setLocalX(me.width - fieldWidth - 1);
                                }

                                me.fireEvent('changeActiveField', me, field);
                            } else {
                                var sprite = me.getActiveSprite();

                                if (sprite) {
                                    me.moveSprite(sprite, e.shiftKey ? 10 : 1, 0);

                                    me.fireEvent('changeActiveSprite', me, sprite);

                                    me.renderFrame();
                                }
                            }
                        }
                    },
                    {
                        key : Ext.event.Event.DOWN,
                        handler : function(key, e) {
                            var targetEl = Ext.fly(e.target),
                                cmp = targetEl && targetEl.component;

                            if (cmp.up() !== me && cmp !== Ext.getBody().component) {
                                return;
                            }

                            var field = me.getActiveField();

                            if (field) {
                                var localY = field.getLocalY(),
                                    fieldHeight = field.getHeight(),
                                    delta = e.shiftKey ? 10 : 1;

                                if (me.height > fieldHeight + localY) {
                                    var fieldY = field.getY(),
                                        fieldX = field.getX();

                                    if (!me.detectIntersections(field, new Ext.util.Region(fieldY + delta, fieldX + field.width, fieldY + field.height + delta, fieldX))) {
                                        field.move('b', delta);
                                    }
                                }

                                if (field.getLocalY() > me.height - fieldHeight) {
                                    field.setLocalY(me.height - fieldHeight - 1);
                                }

                                me.fireEvent('changeActiveField', me, field);
                            } else {
                                var sprite = me.getActiveSprite();

                                if (sprite) {
                                    me.moveSprite(sprite, 0, e.shiftKey ? 10 : 1);

                                    me.fireEvent('changeActiveSprite', me, sprite);

                                    me.renderFrame();
                                }
                            }
                        }
                    },
                    {
                        key : Ext.event.Event.LEFT,
                        handler : function(key, e) {
                            var targetEl = Ext.fly(e.target),
                                cmp = targetEl && targetEl.component;

                            if (cmp.up() != me && cmp != Ext.getBody().component) {
                                return
                            }

                            var field = me.getActiveField();

                            if (field) {
                                var localX = field.getLocalX(),
                                    delta = e.shiftKey ? 10 : 1;

                                if (field && localX > delta) {
                                    var fieldY = field.getY(),
                                        fieldX = field.getX();

                                    if (!me.detectIntersections(field, new Ext.util.Region(fieldY, fieldX + field.width - delta, fieldY + field.height, fieldX - delta))) {
                                        field.move('l', delta);
                                    }
                                }

                                if (field && localX <= delta && localX > 0) {
                                    field.setLocalX(0);
                                }

                                me.fireEvent('changeActiveField', me, field);
                            } else {
                                var sprite = me.getActiveSprite();

                                if (sprite) {
                                    me.moveSprite(sprite, e.shiftKey ? -10 : -1, 0);

                                    me.fireEvent('changeActiveSprite', me, sprite);

                                    me.renderFrame();
                                }
                            }
                        }
                    }
                ]
            });

            function preventScrollByKeys(e) {
                if (Ext.Array.contains([Ext.event.Event.UP, Ext.event.Event.RIGHT, Ext.event.Event.DOWN, Ext.event.Event.LEFT], e.keyCode)) {
                    e.preventDefault();
                }
            }

            window.addEventListener('keydown', preventScrollByKeys, false);

            me.on('close', function() {
                window.removeEventListener('keydown', preventScrollByKeys, false);
            });

            me.callParent(arguments);

            var body = Ext.getBody();

            me.on('spritemouseover', function(item) {
                if (me.resizingMode) {
                    return;
                }
                body.addCls('has-active-sprite');
                spriteUnderMouse = item.sprite;
            });

            me.on('spritemouseout', function() {
                body.removeCls('has-active-sprite');
            });

            me.on('spritemousedown', function(item) {
                var activeField = me.getActiveField(),
                    sprite = item && item.sprite;

                if (me.resizingMode) {
                    return;
                }

                me.preventCanvasClickEvent = true;
                if (sprite) {
                    if (sprite.resizeSprite || sprite.isDrawMode) {
                        me.resizingMode = true;
                    } else if (!(activeField && activeField.mouseDownAt)) {
                        me.hideSpriteResizers(sprite);
                        me.setActiveField();
                        me.setActiveSprite(sprite);
                        spriteUnderMouse = sprite;
                    }
                }

                Ext.defer(function() {
                    me.preventCanvasClickEvent = false;
                }, 100);
            });

            me.on('spritemouseup', function() {
                me.preventCanvasClickEvent = true;
                me.resizingMode = false;
                Ext.defer(function() {
                    me.preventCanvasClickEvent = false;
                    spriteUnderMouse = null;
                }, 100);
            });

            me.on('afterrender', function() {
                me.el.on('mousemove', function(e) {
                    if (me.activeSprite && me.activeSprite.isDrawMode) {
                        var sprite = me.activeSprite,
                            shiftKey = e.shiftKey,
                            posX = e.clientX - me.getX(),
                            posY = e.clientY - me.getY();

                        switch (sprite.type) {
                            case 'line':
                                if (shiftKey) {
                                    if (Math.abs(posX - me.activeSprite.attr.fromX) < Math.abs(posY - me.activeSprite.attr.fromY)) {
                                        posX = me.activeSprite.attr.fromX;
                                    } else {
                                        posY = me.activeSprite.attr.fromY;
                                    }
                                }

                                me.activeSprite.setAttributes({
                                    toX : posX,
                                    toY : posY
                                });
                                break;
                            case 'rect':
                                var x = sprite.x,
                                    y = sprite.y,
                                    width = posX - sprite.x,
                                    height = posY - sprite.y;

                                if (shiftKey) {
                                    if (Math.abs(posX - me.activeSprite.attr.fromX) < Math.abs(posY - me.activeSprite.attr.fromY)) {
                                        width = height;
                                    } else {
                                        height = width;
                                    }
                                }

                                //Normalize possible negative values width & height
                                if (width < 0) {
                                    width *= -1;
                                    x = x - width;
                                }
                                if (height < 0) {
                                    height *= -1;
                                    y = y - height;
                                }

                                me.activeSprite.setAttributes({
                                    width : width,
                                    height : height,
                                    x : x,
                                    y : y
                                });
                                break;
                            case 'circle':
                                var r = Math.max(Math.abs(posX - sprite.cx), Math.abs(posY - sprite.cy));

                                me.activeSprite.setAttributes({
                                    radius : r * 1.2 //Prevent the loss of focus
                                });

                                break;
                        }

                        me.fireEvent('changeActiveSprite', me, sprite);
                        me.showSpriteResizers(sprite);

                        me.renderFrame();
                    } else if (spriteUnderMouse && mouseDown) {
                        var x = e.clientX - mouseDown.x,
                            y = e.clientY - mouseDown.y;

                        me.moveSprite(spriteUnderMouse, x, y);

                        if (spriteUnderMouse.resizeSprite) {
                            spriteUnderMouse.resizeSprite(x, y);
                        }

                        me.fireEvent('changeActiveSprite', me, me.activeSprite);
                        me.showSpriteResizers(me.activeSprite);

                        me.renderFrame();

                        mouseDown = {
                            x : e.clientX,
                            y : e.clientY
                        };
                    }
                });

                me.el.on('mousedown', function(e) {
                    if (me.activeSprite) {
                        if (me.activeSprite.isDrawMode) {
                            me.activeSprite.isDrawMode = false;
                            me.renderFrame();
                        }

                        mouseDown = {
                            x : e.clientX,
                            y : e.clientY
                        };
                    }
                });

                me.el.on('mouseup', function(e) {
                    mouseDown = null;
                });

                me.el.on('painted', function(e) {
                    Ext.defer(function() {
                        me.getSurface();
                        me.surfaceReady = true;
                        me.fillFields(me.getRecord());
                        me.renderPage(me.getCurrentPage());
                        me.initSpriteResizers();
                        me.initFieldResizers();
                    }, 1000);
                });
            });
        },

        initSpriteResizers : function(sprite) {
            var me = this,
                surface = me.getSurface(),
                sides = [
                    'topLeft',
                    'topRight',
                    'bottomLeft',
                    'bottomRight',
                    'left',
                    'right',
                    'top',
                    'bottom',
                    'from',
                    'to'
                ],
                cfg = {
                    x : 0,
                    y : 0,
                    translationX : -5,
                    translationY : -5,
                    resizer : true,
                    hidden : true,
                    fillStyle : '#FFF',
                    strokeStyle : '#ff0000',
                    lineWidth : 3,
                    width : 10,
                    height : 10,
                    zIndex : 10000,
                    resizeSprite : me.resizeSprite.bind(me)
                };

            me.resizers = {};
            Ext.each(sides, function(side) {
                var resizer = Ext.create('Ext.draw.sprite.Rect', Ext.Object.merge(cfg, {side : side}));
                surface.add(resizer);
                me.resizers[side] = resizer;
            });

        },

        resizeSprite : function(x, y) {
            var me = this,
                activeSprite = me.activeSprite,
                isFormResizable = activeSprite.formResizable,
                activeSpriteAttr = activeSprite.attr,
                resizer = spriteUnderMouse,
                resizerSide = resizer.side.toLowerCase(),
                resizerAttr = resizer.attr;

            switch (activeSprite.type) {
                case 'line':
                    var fromX, fromY, toX, toY, updatedAttr = {},
                        sideParamX = resizerSide + 'X',
                        sideParamY = resizerSide + 'Y',
                        length;

                    updatedAttr[sideParamX] = activeSpriteAttr[sideParamX] + x;
                    updatedAttr[sideParamY] = activeSpriteAttr[sideParamY] + y;

                    fromX = updatedAttr.fromX;
                    fromY = updatedAttr.fromY;
                    toX = updatedAttr.toX;
                    toY = updatedAttr.toY;

                    length = Math.sqrt(Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2)); // line length formula

                    if (length <= 0) {
                        return;
                    }

                    if (isFormResizable && isFormResizable.x) {
                        activeSprite.setAttributes({
                            fromX : fromX,
                            toX : toX
                        });
                    }

                    if (isFormResizable && isFormResizable.y) {
                        activeSprite.setAttributes({
                            fromY : fromY,
                            toY : toY
                        });
                    }
                    break;
                case 'rect':
                case 'image':
                    var newWidth = activeSpriteAttr.width + (resizerSide.indexOf('left') === -1 ? x : -x),
                        newHeight = activeSpriteAttr.height + (resizerSide.indexOf('top') === -1 ? y : -y);

                    if (newWidth <= 0 || newHeight <= 0) {
                        return;
                    }

                    if (isFormResizable && isFormResizable.x) {
                        activeSprite.setAttributes({
                            width : newWidth
                        });
                        me.moveSprite(activeSprite, (resizerSide.indexOf('left') === -1 ? 0 : x), 0);
                    }

                    if (isFormResizable && isFormResizable.y) {
                        activeSprite.setAttributes({
                            height : newHeight
                        });
                        me.moveSprite(activeSprite, 0, (resizerSide.indexOf('top') === -1 ? 0 : y));
                    }
                    break;
                case 'circle':
                    var r = Math.max(Math.abs(resizerAttr.x - activeSpriteAttr.cx), Math.abs(resizerAttr.y - activeSpriteAttr.cy));

                    if (r <= 0) {
                        return;
                    }

                    if (isFormResizable) {
                        activeSprite.setAttributes({
                            radius : r
                        });
                    }
                    break;
            }
        },

        showSpriteResizers : function(sprite) {
            var me = this,
                resizers = me.resizers,
                bbox = sprite.getBBox(),
                bboxX = bbox.x,
                bboxY = bbox.y,
                bboxHeight = bbox.height,
                bboxWidth = bbox.width,
                attr = sprite.attr,
                cfg = {
                    hidden : false
                };

            if (!sprite.formResizable) {
                return;
            }

            switch (sprite.type) {
                case 'line':
                    resizers.from.setAttributes(Ext.Object.merge(cfg, {
                        x : attr.fromX,
                        y : attr.fromY
                    }));
                    resizers.to.setAttributes(Ext.Object.merge(cfg, {
                        x : attr.toX,
                        y : attr.toY
                    }));
                    break;
                case 'circle':
                    resizers.left.setAttributes(Ext.Object.merge(cfg, {
                        x : bboxX,
                        y : bboxY + bboxHeight / 2
                    }));
                    resizers.right.setAttributes(Ext.Object.merge(cfg, {
                        x : bboxX + bboxWidth,
                        y : bboxY + bboxHeight / 2
                    }));
                    resizers.top.setAttributes(Ext.Object.merge(cfg, {
                        x : bboxX + bboxWidth / 2,
                        y : bboxY
                    }));
                    resizers.bottom.setAttributes(Ext.Object.merge(cfg, {
                        x : bboxX + bboxWidth / 2,
                        y : bboxY + bboxHeight
                    }));
                    break;
                case 'rect':
                case 'image':
                    resizers.topLeft.setAttributes(Ext.Object.merge(cfg, {
                        x : bboxX,
                        y : bboxY
                    }));
                    resizers.topRight.setAttributes(Ext.Object.merge(cfg, {
                        x : bboxX + bboxWidth,
                        y : bboxY
                    }));
                    resizers.bottomLeft.setAttributes(Ext.Object.merge(cfg, {
                        x : bboxX,
                        y : bboxY + bboxHeight
                    }));
                    resizers.bottomRight.setAttributes(Ext.Object.merge(cfg, {
                        x : bboxX + bboxWidth,
                        y : bboxY + bboxHeight
                    }));
                    break;
            }
        },

        hideSpriteResizers : function() {
            var me = this,
                resizers = me.resizers;

            Ext.each(Ext.Object.getValues(resizers), function(resizer) {
                resizer.hide();
            });
        },

        moveSprite : function(sprite, deltaX, deltaY) {
            var attrs = {};

            switch (sprite.type) {
                case 'line':
                    attrs = {
                        fromX : sprite.attr.fromX + deltaX,
                        fromY : sprite.attr.fromY + deltaY,
                        toX : sprite.attr.toX + deltaX,
                        toY : sprite.attr.toY + deltaY
                    };
                    break;
                case 'rect':
                case 'image':
                    attrs = {
                        x : sprite.attr.x + deltaX,
                        y : sprite.attr.y + deltaY
                    };
                    break;
                case 'circle':
                    attrs = {
                        cx : sprite.attr.cx + deltaX,
                        cy : sprite.attr.cy + deltaY
                    };
                    break;
            }

            sprite.setAttributes(attrs);
        },

        initFieldResizers : function() {
            var me = this,
                sides = [
                    'topLeft',
                    'topRight',
                    'bottomLeft',
                    'bottomRight'
                ],
                cfg = {
                    x : 0,
                    y : 0,
                    hidden : true,
                    resizer : true,
                    border : 4,
                    style : {
                        zIndex : 10000,
                        borderColor : '#ff0000',
                        borderStyle : 'solid',
                        backgroundColor : '#FFF'
                    },
                    width : 14,
                    height : 14
                };

            me.fieldResizers = {};
            Ext.each(sides, function(side) {
                var resizer = Ext.create('Ext.container.Container', Ext.Object.merge(cfg, {side : side}));
                me.add(resizer);
                me.fieldResizers[side] = resizer;

                resizer.el.on('mousedown', function(e) {
                    var field = me.getActiveField();

                    me.resizingMode = true;

                    resizer.resizeState = {
                        startResizerCoordinates : {
                            x : e.clientX,
                            y : e.clientY
                        },
                        startFieldCoordinates : {
                            x : field.getX(),
                            y : field.getY()
                        },
                        startSize : {
                            width : field.getWidth(),
                            height : field.getHeight()
                        }
                    };
                });

                resizer.el.on('mousemove', function(e) {
                    var field = me.getActiveField(),
                        isFormResizable = field.formResizable,
                        delta, xPosition, yPosition, width, height;

                    if (!me.resizingMode) {
                        return;
                    }

                    xPosition = resizer.resizeState.startFieldCoordinates.x;
                    yPosition = resizer.resizeState.startFieldCoordinates.y;
                    width = resizer.resizeState.startSize.width;
                    height = resizer.resizeState.startSize.height;

                    delta = {
                        x : e.clientX - resizer.resizeState.startResizerCoordinates.x,
                        y : e.clientY - resizer.resizeState.startResizerCoordinates.y
                    };

                    switch (resizer.side) {
                        case 'topLeft':
                            xPosition += delta.x;
                            yPosition += delta.y;
                            width -= delta.x;
                            height -= delta.y;
                            break;
                        case 'topRight':
                            yPosition += delta.y;
                            width += delta.x;
                            height -= delta.y;
                            break;
                        case 'bottomLeft':
                            xPosition += delta.x;
                            width -= delta.x;
                            height += delta.y;
                            break;
                        case 'bottomRight':
                            width += delta.x;
                            height += delta.y;
                            break;
                    }

                    me.hideFieldResizers(field);
                    if (me.detectIntersections(field, new Ext.util.Region(yPosition, xPosition + width, yPosition + height, xPosition))) {
                        return;
                    }

                    if (isFormResizable && isFormResizable.x) {
                        field.setWidth(width);
                        field.setX(xPosition);
                    }

                    if (isFormResizable && isFormResizable.y) {
                        field.setHeight(height);
                        field.setY(yPosition);
                    }

                    me.showFieldResizers(field);

                    me.fireEvent('changeActiveField', me, field);
                    me.showFieldResizers(field);
                });

                resizer.el.on('mouseup', function(e) {
                    var field = me.getActiveField();

                    if (!me.resizingMode) {
                        return;
                    }

                    me.resizingMode = false;
                    resizer.resizeState = null;
                    me.fireEvent('changeActiveField', me, field);
                });
            });
        },

        showFieldResizers : function(cmp) {
            var me = this,
                fieldResizers = me.fieldResizers,
                formField = cmp.formField,
                xPosition = formField.get('xPosition') - 7,
                yPosition = formField.get('yPosition') - 7,
                fieldHeight = formField.get('height'),
                fieldWidth = formField.get('width');

            if (!cmp.formResizable) {
                return;
            }

            fieldResizers.topLeft.setLocalXY([xPosition, yPosition]);
            fieldResizers.topRight.setLocalXY([xPosition + fieldWidth, yPosition]);
            fieldResizers.bottomLeft.setLocalXY([xPosition, yPosition + fieldHeight]);
            fieldResizers.bottomRight.setLocalXY([xPosition + fieldWidth, yPosition + fieldHeight]);

            Ext.each(Ext.Object.getValues(fieldResizers), function(resizer) {
                resizer.show();
            });
        },

        hideFieldResizers : function() {
            var fieldResizers = this.fieldResizers;

            Ext.each(Ext.Object.getValues(fieldResizers), function(resizer) {
                resizer.hide();
            });
        },

        updateRecord : function(record) {
            if (record && !record.phantom) {
                if (this.surfaceReady) {
                    this.fillFields(record);
                }
            }

            if (record && record.phantom && !record.get('totalPages')) {
                record.set('totalPages', 1);
            }
        },

        updateCurrentPage : function(page) {
            var record = this.getRecord();

            if (record) {
                if (this.surfaceReady) {
                    this.renderPage(page);
                }
            }
        },

        renderPage : function(page) {
            var me = this,
                fields = this.getItems(),
                sprites = this.getSurface().getItems();

            fields.each(function(item) {
                var formField = item.formField;

                if (formField) {
                    var isOnHiddenPage = formField.get('pageNumber') !== page;

                    item.setHidden(isOnHiddenPage);
                }
            });

            sprites.forEach(function(item) {
                var formField = item.formField;

                if (formField) {
                    var isOnHiddenPage = formField.get('pageNumber') !== page;

                    item.setAttributes({
                        hidden : isOnHiddenPage
                    });
                }
            });

            me.renderFrame();
        },

        fillFields : function(record) {
            var me = this,
                surface = this.getSurface();

            if (!record) {
                return;
            }

            me.fillMode = true;

            record.formFields().each(function(item) {
                let dataTypes = criterion.Consts.WEBFORM_DATA_TYPE,
                    dataType = criterion.CodeDataManager.getCodeDetailRecord('id', item.get('webformDataTypeCd'), criterion.consts.Dict.WEBFORM_DATA_TYPE).get('code'),
                    field, baseCfg,
                    xPosition = item.get('xPosition'),
                    yPosition = item.get('yPosition'),
                    width = item.get('width'),
                    height = item.get('height'),
                    zIndex = item.get('zIndex'),
                    customData = Ext.decode(item.get('data'), true),
                    fieldStyle = {};

                if (!Ext.Array.contains([dataTypes.IMAGE, dataTypes.SIG, dataTypes.SHAPE], dataType)) {
                    baseCfg = {
                        labelWidth : 0,
                        readOnly : true,
                        readOnlyCls : '',
                        hidden : true,
                        dataType : dataType,
                        formField : item,
                        width : width,
                        minWidth : 25,
                        height : height
                    };

                    switch (dataType) {
                        case dataTypes.TEXT:
                            field = Ext.create('Ext.form.field.Text', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                emptyText : i18n.gettext('Text'),
                                formResizable : {
                                    x : true,
                                    y : false
                                },
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.NUMBER:
                            field = Ext.create('Ext.form.field.Number', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                emptyText : i18n.gettext('Number'),
                                formResizable : {
                                    x : true,
                                    y : false
                                },
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.TEXT_BLOCK:
                            field = Ext.create('Ext.Component', Ext.apply(baseCfg, {
                                html : item.get('data'),
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            }));
                            break;
                        case dataTypes.DATE:
                            field = Ext.create('Ext.form.field.Date', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                emptyText : i18n.gettext('Date'),
                                triggers : {
                                    picker : {
                                        hideOnReadOnly : false
                                    }
                                },
                                formResizable : {
                                    x : true,
                                    y : false
                                },
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.CHECKBOX:
                            field = Ext.create('Ext.form.field.Checkbox', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                isCheckbox : true,
                                checkedCls : '',
                                readOnly : false,
                                minWidth : 15,
                                minHeight : 15,
                                maxHeight : 15,
                                maxWidth : 15,
                                width : 15,
                                height : 15,
                                formResizable : false
                            }));
                            break;
                        case dataTypes.MEMO:
                            field = Ext.create('Ext.form.field.TextArea', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                emptyText : i18n.gettext('Memo'),
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            }));
                            break;
                        case dataTypes.DROPDOWN:
                            //Using textfield for the form editor
                            field = Ext.create('Ext.form.field.Text', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                emptyText : i18n.gettext('Dropdown'),
                                isCodeDetail : true,
                                responseCd : item.get('responseCd'),
                                value : item.get('responseDescription'),
                                triggers : {
                                    picker : {
                                        hideOnReadOnly : false
                                    }
                                },
                                formResizable : {
                                    x : true,
                                    y : false
                                },
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.RADIO:
                            field = Ext.create('Ext.form.field.Radio', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                name : item.get('groupName'),
                                isRadio : true,
                                checkedCls : '',
                                readOnly : false,
                                minWidth : 15,
                                minHeight : 15,
                                maxHeight : 15,
                                maxWidth : 15,
                                width : 15,
                                height : 15,
                                formResizable : false
                            }));
                            break;
                        case dataTypes.EMAIL:
                            field = Ext.create('Ext.form.field.Text', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                emptyText : i18n.gettext('Email'),
                                vtype : 'email',
                                formResizable : {
                                    x : true,
                                    y : false
                                },
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.ATTACH:
                            field = Ext.create('Ext.form.field.File', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                buttonConfig : {
                                    afterTpl : [
                                        '<input id="{id}-fileInputEl" data-ref="fileInputEl" class="{childElCls} {inputCls}" ',
                                        'type="button" size="1" name="{inputName}" unselectable="on" ',
                                        '<tpl if="accept != null">accept="{accept}"</tpl>',
                                        '<tpl if="tabIndex != null">tabindex="{tabIndex}"</tpl>',
                                        '>'
                                    ]
                                },
                                formResizable : {
                                    x : true,
                                    y : false
                                },
                                setMinHeight : true
                            }));
                            break;
                    }

                    if (field.setFieldStyle) {
                        if (field.setMinHeight) {
                            fieldStyle['minHeight'] = criterion.Consts.WEBFORM_FIELD_STYLE.MIN_FIELD_HEIGHT
                        }

                        if (customData && customData['fontSize']) {
                            fieldStyle['fontSize'] = `${customData['fontSize']}px`;
                            fieldStyle['lineHeight'] = `${customData['fontSize'] + criterion.Consts.WEBFORM_FIELD_STYLE.ADDED_LINE_HEIGHT}px`;
                        }

                        field.setFieldStyle(fieldStyle);
                    }
                } else {
                    switch (dataType) {
                        case dataTypes.SIG:
                            field = Ext.create('criterion.ux.SignaturePad', {
                                readOnly : true,
                                width : width,
                                height : height,
                                dataType : dataType,
                                formField : item,
                                style : {
                                    backgroundColor : '#eee'
                                },
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            });
                            break;
                        case dataTypes.SHAPE:
                        case dataTypes.IMAGE:
                            field = 'sprite';
                            break;
                    }
                }

                if (field === 'sprite') {
                    var sprite, spriteData,
                        data = item.get('data');

                    if (dataType === dataTypes.IMAGE) {
                        spriteData = {
                            src : data,
                            type : 'image'
                        }
                    } else {
                        spriteData = Ext.JSON.decode(data, true);
                    }

                    if (!spriteData) {
                        return;
                    }

                    switch (spriteData.type) {
                        case 'image':
                            sprite = Ext.create('Ext.draw.sprite.Image', {
                                isSprite : true,
                                src : spriteData.src,
                                dataType : dataTypes.IMAGE,
                                x : xPosition,
                                y : yPosition,
                                width : width,
                                height : height,
                                zIndex : zIndex,
                                formField : item,
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            });
                            break;
                        case 'line':
                            sprite = Ext.create('Ext.draw.sprite.Line', Ext.apply(spriteData, {
                                isSprite : true,
                                dataType : dataTypes.SHAPE,
                                fromX : criterion.Utils.convertDPI(spriteData.fromX),
                                fromY : criterion.Utils.convertDPI(spriteData.fromY),
                                toX : criterion.Utils.convertDPI(spriteData.toX),
                                toY : criterion.Utils.convertDPI(spriteData.toY),
                                formField : item,
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            }));
                            break;
                        case 'rect':
                            sprite = Ext.create('Ext.draw.sprite.Rect', Ext.apply(spriteData, {
                                isSprite : true,
                                dataType : dataTypes.SHAPE,
                                x : criterion.Utils.convertDPI(spriteData.x),
                                y : criterion.Utils.convertDPI(spriteData.y),
                                width : criterion.Utils.convertDPI(spriteData.width),
                                height : criterion.Utils.convertDPI(spriteData.height),
                                formField : item,
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            }));
                            break;
                        case 'circle':
                            sprite = Ext.create('Ext.draw.sprite.Circle', Ext.apply(spriteData, {
                                isSprite : true,
                                dataType : dataTypes.SHAPE,
                                cx : criterion.Utils.convertDPI(spriteData.cx),
                                cy : criterion.Utils.convertDPI(spriteData.cy),
                                r : criterion.Utils.convertDPI(spriteData.r),
                                formField : item,
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            }));
                            break;
                    }

                    surface.add([sprite]);
                    me.renderFrame();
                } else if (field) {
                    field.lateX = xPosition;
                    field.lateY = yPosition;
                    me.add(field);
                }
            });

            me.fillMode = false;
        },

        defaultResizeHandler : function(size) {
            this.getItems().each(function(surface) {
                surface.setRect && surface.setRect([0, 0, size.width, size.height]);
            });
        },

        handleRender : function() {
            var me = this;

            me.el.on('click', function(e, target) {
                var targetEl = Ext.fly(target);

                if (targetEl && targetEl.component === me || (targetEl.dom.tagName.toLowerCase() == 'canvas' && !me.preventCanvasClickEvent)) {
                    me.setActiveField();
                    me.setActiveSprite();

                    me.items.each(function(field) {
                        field.removeCls('focused');
                    });
                } else {
                    me.items.each(function(field) {
                        field.removeCls('focused');
                    });

                    me.preventCanvasClickEvent = false;
                    targetEl && targetEl.component && targetEl.component.addCls('focused');
                }
            });
        },

        addSprite : function(sprite) {
            var me = this,
                record = me.getRecord(),
                fields = record.formFields();

            this.setActiveField();
            this.getSurface().add(sprite);
            this.renderFrame();
            this.completeSprite(sprite);

            sprite.formField = Ext.create('criterion.model.webForm.Field', {
                webformId : me.getRecord().getId(),
                webformDataTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', sprite.dataType, criterion.consts.Dict.WEBFORM_DATA_TYPE).getId(),
                pageNumber : me.getCurrentPage(),
                xPosition : 0,
                yPosition : 0,
                width : me.getWidth(),
                height : me.getHeight()
            });

            fields.add(sprite.formField);
        },

        add : function() {
            var me = this,
                added = this.callParent(arguments),
                record = me.getRecord();

            if (added.resizer) {
                return added;
            }

            if (Ext.isArray(added) || added.xclass == 'Ext.draw.engine.Canvas') {
                if (added.xclass == 'Ext.draw.engine.Canvas') {
                    added.el.setZIndex(0);
                }
                return added;
            }

            if (!added.formField) {
                var maximumSize = null,
                    dataTypes = criterion.Consts.WEBFORM_DATA_TYPE;

                switch (added.dataType) {
                    case dataTypes.TEXT:
                        maximumSize = 25;
                        break;
                    case dataTypes.NUMBER:
                        maximumSize = 3;
                        break;
                    case dataTypes.EMAIL:
                        maximumSize = 20;
                        break;
                    case dataTypes.MEMO:
                        maximumSize = 12;
                        break;
                }

                added.formField = Ext.create('criterion.model.webForm.Field', {
                    webformId : record.getId(),
                    webformDataTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', added.dataType, criterion.consts.Dict.WEBFORM_DATA_TYPE).getId(),
                    maximumSize : maximumSize,
                    pageNumber : me.getCurrentPage()
                });

                record.formFields().add(added.formField);
            }

            added.el && added.el.setZIndex(1000);

            if (added.dataType == criterion.Consts.WEBFORM_DATA_TYPE.TEXT_BLOCK) {
                added.el && added.el.unselectable && added.el.unselectable();
                if (!added.formField.get('data')) {
                    added.setHtml(i18n.gettext('Double click to edit'))
                }
            }

            me.items.each(function(field) {
                field.removeCls('focused');
            });

            me.setActiveSprite();

            if (!me.fillMode) {
                me.setActiveField(added);

                added.addCls('focused');
            }

            added.on('show', function() {
                added.fireEvent('detectsize');
            });

            me.processField(added);

            return added;
        },

        remove : function(field) {
            if (field) {
                this.fireEvent('deleteActiveField', this, field);
            }

            this.callParent(arguments);
        },

        processField : function(field) {
            var me = this;

            if (Ext.isNumeric(field.lateX) && Ext.isNumeric(field.lateY)) {
                field.setLocalXY(field.lateX, field.lateY);

                field.formField.set({
                    xPosition : field.lateX,
                    yPosition : field.lateY
                });

                field.lateX = null;
                field.lateY = null;
                if (field.isHidden()) {
                    field.show();
                }
            }

            field.el.on('mousedown', function(e) {
                field.mouseDownAt = [e.clientX - field.getX(), e.clientY - field.getY()];
                me.setActiveSprite();
                me.setActiveField(field);
            });

            field.el.on('mouseup', function(e, target) {
                var zoomMult = me.zoom / 100,
                    width = field.getWidth() / zoomMult,
                    height = field.getHeight() / zoomMult,
                    targetEl = Ext.fly(target);

                if (targetEl && targetEl.component && targetEl.component.pad) {
                    me.preventCanvasClickEvent = true;
                }

                field.mouseDownAt = null;

                if (field.getLocalX() < 0) {
                    field.setLocalX(0)
                }

                if (field.getLocalY() < 0) {
                    field.setLocalY(0)
                }

                if (field.getLocalX() + width > me.width) {
                    field.setLocalX(me.width - width)
                }

                if (field.getLocalY() + height > me.height) {
                    field.setLocalY(me.height - height / 2)
                }

                me.fireEvent('changeActiveField', me, field);
            });

            field.el.on('dblclick', function(e, target) {
                if (field.dataType == criterion.Consts.WEBFORM_DATA_TYPE.TEXT_BLOCK) {
                    var fieldValue = field.formField.get('data'),
                        editor = Ext.create('Ext.panel.Panel', {
                            title : i18n.gettext('Text Block Field'),
                            draggable : true,
                            floating : true,
                            modal : true,
                            alwaysOnTop : true,
                            width : 700,
                            height : 400,
                            layout : 'fit',
                            items : [
                                {
                                    xtype : 'htmleditor',
                                    value : fieldValue != i18n.gettext('Double click to edit') ? fieldValue : ''
                                }
                            ],
                            buttons : [
                                '->',
                                {
                                    xtype : 'button',
                                    reference : 'cancel',
                                    text : i18n.gettext('Cancel'),
                                    cls : 'criterion-btn-light',
                                    listeners : {
                                        click : function() {
                                            this.up('panel').destroy();
                                        }
                                    }
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Apply'),
                                    listeners : {
                                        click : function() {
                                            var panel = this.up('panel'),
                                                value = this.up('panel').down('htmleditor').getValue();

                                            me.setActiveField();

                                            field.setHtml(value || i18n.gettext('Double click to edit'));
                                            field.formField.set('data', value);
                                            panel.destroy();

                                            me.setActiveField(field);
                                        }
                                    }
                                }
                            ]
                        });

                    editor.show().center();
                }
            });

            field.el.on('mousemove', function(e) {
                if (field.mouseDownAt) {
                    var newX = e.clientX - field.mouseDownAt[0],
                        newY = e.clientY - field.mouseDownAt[1];

                    me.hideFieldResizers(field);
                    if (!me.detectIntersections(field, new Ext.util.Region(newY, newX + field.width, newY + field.height, newX))) {
                        field.setXY([newX, newY]);
                        me.fireEvent('changeActiveField', me, field);
                        me.showFieldResizers(field);
                    }
                }
            });
        },

        detectIntersections : function(field, region) {
            var hasIntersection = false;

            this.items.each(function(item) {
                if (item.xclass != 'Ext.draw.engine.Canvas' && item != field) {
                    if (item.getClientRegion().intersect(region)) {
                        hasIntersection = true;
                        return false;
                    }
                }
            });

            return hasIntersection;
        },

        updateActiveField : function(activeField) {
            var vm = this.lookupViewModel(),
                currentPage = vm.get('currentPage');

            if (!activeField) {
                if (this.fieldResizers) {
                    this.hideFieldResizers();
                }
                this.items.each(function(field) {
                    field.removeCls('focused');
                })
            } else {
                this.showFieldResizers(activeField);
                !activeField.hasCls('focused') && activeField.addCls('focused');
            }

            if (activeField && activeField.formField && currentPage !== activeField.formField.get('pageNumber')) {
                vm.set('currentPage', activeField.formField.get('pageNumber'));
            }

            this.renderFrame();

            this.fireEvent('changeActiveField', this, activeField);
        },

        updateActiveSprite : function(activeSprite) {
            var vm = this.lookupViewModel(),
                currentPage = vm.get('currentPage');

            if (this.resizers && !activeSprite) {
                this.hideSpriteResizers();
            }

            if (this.resizers && activeSprite) {
                this.showSpriteResizers(activeSprite);
            }

            if (activeSprite && activeSprite.formField && currentPage !== activeSprite.formField.get('pageNumber')) {
                vm.set('currentPage', activeSprite.formField.get('pageNumber'));
            }

            this.renderFrame();

            this.fireEvent('changeActiveSprite', this, activeSprite);
        },

        updateZoom : function(zoom) {
            if (!zoom) {
                return
            }

            var value = zoom / 100,
                scale = Ext.String.format('scale({0},{0})', value);

            this.setStyle({
                'transform-origin' : 'top center',
                '-ms-transform' : scale,
                '-webkit-transform' : scale,
                'transform' : scale,
                'border-width' : 1 / value + 'px'
            });
        },

        completeSprite : function(sprite) {
            if (sprite.dataType !== criterion.Consts.WEBFORM_DATA_TYPE.IMAGE) {
                sprite.isDrawMode = true;
            }
            this.setActiveSprite(sprite);
        }
    }
});
