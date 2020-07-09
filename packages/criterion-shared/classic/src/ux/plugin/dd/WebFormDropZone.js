Ext.define('criterion.ux.plugin.dd.WebFormDropZone', function() {

    var DEFAULT_STROKE = '#000000',
        DEFAULT_FILL = '#CCCCCC',
        DEFAULT_LINE_WIDTH = 3;

    return {
        extend : 'Ext.dd.DropZone',

        alias : 'plugin.criterion_webform_dropzone',

        containerScroll : true,

        constructor : function(el) {
        },

        init : function(container) {
            this.cmp = container;

            if (container.rendered) {
                this.superclass.constructor.call(this, container.el);
            } else {
                container.on('render', this.init, this);
            }
        },

        getTargetFromEvent : function() {
            this.cmp.setActiveField();
            this.cmp.setActiveSprite();
            return this.cmp.el;
        },

        onNodeEnter : function(target, dd, e, dragData) {
            delete this.dropOK;
            if (!target) {
                return;
            }

            var f = dragData.field;
            if (!f) {
                return;
            }

            this.dropOK = true;
            Ext.fly(target).addCls('x-drop-target-active');
        },

        onNodeOver : function(target, dd, e, dragData) {
            if (!dragData || !dragData.field) {
                return;
            }

            if (dragData.field.component.dataType === criterion.Consts.WEBFORM_DATA_TYPE.IMAGE || dragData.field.component.dataType === criterion.Consts.WEBFORM_DATA_TYPE.SHAPE) {
                return this.dropOK ? this.dropAllowed : this.dropNotAllowed;
            }

            var targetX = e.clientX,
                targetY = e.clientY,
                field = {
                    isImage : false
                };

            if (target.component.detectIntersections(field, new Ext.util.Region(
                targetY,
                targetX + criterion.Consts.WEBFORM_DATA_SIZES[dragData.field.component.dataType].width,
                targetY + criterion.Consts.WEBFORM_DATA_SIZES[dragData.field.component.dataType].height,
                targetX))) {
                this.dropOK = false;
                Ext.fly(target).removeCls('x-drop-target-active');
            } else {
                this.dropOK = true;
                Ext.fly(target).addCls('x-drop-target-active');
            }

            return this.dropOK ? this.dropAllowed : this.dropNotAllowed;
        },

        onNodeOut : function(target, dd, e, dragData) {
            Ext.fly(target).removeCls('x-drop-target-active');
        },

        onNodeDrop : function(target, dd, e, dragData) {
            if (this.dropOK) {
                var me = this,
                    dataTypes = criterion.Consts.WEBFORM_DATA_TYPE,
                    field, baseCfg,
                    zoom = this.cmp.getZoom() / 100;

                if (!Ext.Array.contains([dataTypes.IMAGE, dataTypes.SIG, dataTypes.SHAPE], dragData.field.component.dataType)) {
                    baseCfg = {
                        readOnly : true,
                        readOnlyCls : '',
                        minWidth : 25,
                        hidden : true,
                        dataType : dragData.field.component.dataType
                    };

                    switch (dragData.field.component.dataType) {
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
                            field = Ext.create('Ext.form.field.Display', Ext.apply(baseCfg, {
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
                                checkedCls : '',
                                isCheckbox : true,
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
                                },
                                minHeight : criterion.Consts.WEBFORM_FIELD_STYLE.MIN_FIELD_HEIGHT
                            }));
                            break;
                        case dataTypes.DROPDOWN:
                            //Using textfield for the form editor
                            field = Ext.create('Ext.form.field.Text', Ext.apply(baseCfg, {
                                isWebFormField : true,
                                emptyText : i18n.gettext('Dropdown'),
                                isCodeDetail : true,
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
                                name : '',
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
                                emptyText : i18n.gettext('File'),
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

                    if (field.setMinHeight) {
                        field.setFieldStyle({
                            minHeight : criterion.Consts.WEBFORM_FIELD_STYLE.MIN_FIELD_HEIGHT
                        });
                    }
                } else {
                    switch (dragData.field.component.dataType) {
                        case dataTypes.SIG:
                            field = Ext.create('criterion.ux.SignaturePad', {
                                readOnly : true,
                                width : 200,
                                height : 200,
                                hidden : true,
                                dataType : dragData.field.component.dataType,
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

                var x = Math.round((dd.lastPageX - this.cmp.getX()) / zoom) - 13,
                    y = Math.round((dd.lastPageY - this.cmp.getY()) / zoom) - 19;

                if (field === 'sprite') {
                    var surface = me.cmp.getSurface(),
                        sprite,
                        nextZIndex = surface.getItems().length + 1;

                    switch (dragData.field.component.shapeType) {
                        case 'image':
                            sprite = Ext.create('Ext.draw.sprite.Image', {
                                x : x,
                                y : y,
                                width : 120,
                                height : 120,
                                isSprite : true,
                                dataType : dragData.field.component.dataType,
                                src : 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==', // gray background
                                zIndex : nextZIndex,
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            });
                            break;
                        case 'line':
                            sprite = Ext.create('Ext.draw.sprite.Line', {
                                fromX : x,
                                fromY : y,
                                toX : x,
                                toY : y,
                                strokeStyle : DEFAULT_STROKE,
                                lineWidth : DEFAULT_LINE_WIDTH,
                                isSprite : true,
                                zIndex : nextZIndex,
                                dataType : dragData.field.component.dataType,
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            });
                            break;
                        case 'rect':
                            sprite = Ext.create('Ext.draw.sprite.Rect', {
                                x : x,
                                y : y,
                                width : 10,
                                height : 10,
                                fillStyle : DEFAULT_FILL,
                                strokeStyle : DEFAULT_STROKE,
                                lineWidth : DEFAULT_LINE_WIDTH,
                                isSprite : true,
                                zIndex : nextZIndex,
                                dataType : dragData.field.component.dataType,
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            });
                            break;
                        case 'circle':
                            sprite = Ext.create('Ext.draw.sprite.Circle', {
                                cx : x,
                                cy : y,
                                r : 10,
                                fillStyle : DEFAULT_FILL,
                                strokeStyle : DEFAULT_STROKE,
                                lineWidth : DEFAULT_LINE_WIDTH,
                                isSprite : true,
                                zIndex : nextZIndex,
                                dataType : dragData.field.component.dataType,
                                formResizable : {
                                    x : true,
                                    y : true
                                }
                            });
                            break;
                    }

                    me.cmp.addSprite(sprite);

                    return true;
                }

                me.cmp.setActiveSprite();

                field = me.cmp.add(field);

                //Fake move. Canvas wants it.
                field.move('r', 0);

                Ext.defer(function() {
                    if (field.rendered) {
                        field.setLocalX(x);
                        field.setLocalY(y);
                        me.cmp.renderFrame();
                        field.setHidden(false);
                    } else {
                        field.on('render', function() {
                            field.setLocalX(x);
                            field.setLocalY(y);
                            me.cmp.renderFrame();
                            field.setHidden(false);
                            me.cmp.setActiveField();
                            me.cmp.setActiveField(field);
                        });
                    }
                }, 10);

                return true;
            }
        }
    }
});
