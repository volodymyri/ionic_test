Ext.define('criterion.controller.settings.general.WebForm', function() {

    let activeField,
        activeSprite;

    return {
        alias : 'controller.criterion_settings_general_webform',

        extend : 'criterion.controller.FormView',

        requires : [
            'Ext.drag.Source',
            'Ext.drag.proxy.None',
            'Ext.drag.proxy.Original',
            'criterion.view.settings.general.AssignForm',
            'criterion.model.employee.Search',
            'criterion.store.AbstractStore'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init() {
            this.handleChangeActiveField = Ext.Function.createBuffered(this.handleChangeActiveField, 200, this);

            this.callParent(arguments);
        },

        handleAssignForm() {
            let me = this,
                vm = this.getViewModel(),
                webformId = vm.get('record.id'),
                attachForm = Ext.create('criterion.view.settings.general.AssignForm', {
                    viewModel : {
                        data : {
                            isWebForm : true,
                            formId : webformId,

                            searchAdditionalData : {
                                webformId : webformId
                            }
                        },

                        stores : {
                            employees : {
                                type : 'criterion_abstract_store',
                                model : 'criterion.model.employee.Search',
                                autoLoad : false,
                                autoSync : false,

                                pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                                remoteSort : true,
                                remoteFilter : true,

                                proxy : {
                                    type : 'criterion_rest',
                                    url : criterion.consts.Api.API.WEBFORM_EMPLOYEE_FOR_ASSIGN,
                                    extraParams : {
                                        webformId : webformId
                                    }
                                }
                            }
                        }
                    }
                });

            attachForm.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            attachForm.show();

            me.setCorrectMaskZIndex(true);
        },

        handlePreviousPage : function() {
            let vm = this.getViewModel(),
                webForm = this.lookup('webForm'),
                currentPage = vm.get('currentPage');

            webForm.setActiveField();
            webForm.setActiveSprite();

            vm.set('currentPage', --currentPage);
        },

        handleNextPage : function() {
            let vm = this.getViewModel(),
                webForm = this.lookup('webForm'),
                currentPage = vm.get('currentPage');

            webForm.setActiveField();
            webForm.setActiveSprite();

            vm.set('currentPage', ++currentPage);
        },

        handleAddPage : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                record = view.getRecord(),
                webForm = this.lookup('webForm'),
                totalPages = record.get('totalPages'),
                currentPage = vm.get('currentPage'),
                addedPageNumber = currentPage + 1;

            webForm.setActiveField();
            webForm.setActiveSprite();

            this.movePages(record, currentPage, 1);

            record.set('totalPages', ++totalPages);

            vm.set('currentPage', addedPageNumber);
        },

        handleDeletePage : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                webForm = this.lookup('webForm'),

                surface = webForm.getSurface(),
                sprites = surface.getItems(),
                fields = webForm.getItems(),

                record = view.getRecord(),
                formFields = record.formFields(),
                totalPages = record.get('totalPages'),
                currentPage = vm.get('currentPage');

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete Page'),
                    message : i18n.gettext('Do you want to delete the page?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        webForm.setActiveField();
                        webForm.setActiveSprite();

                        for (let i = fields.length - 1; i >= 0; --i) {
                            let field = fields.getAt(i),
                                formField = field.formField;

                            if (formField) {
                                let itemPageNumber = formField.get('pageNumber');

                                if (itemPageNumber === currentPage) {
                                    formFields.remove(formField);
                                    field.destroy();
                                }
                            }
                        }

                        for (let i = sprites.length - 1; i >= 0; --i) {
                            let sprite = sprites[i],
                                formField = sprite.formField;

                            if (formField && formField.get('pageNumber') === currentPage) { // skip resizers and other pages
                                formFields.remove(formField);
                                sprite.remove();
                            }
                        }

                        me.movePages(record, currentPage, -1);

                        if (vm.get('isLastPage')) {
                            vm.set('currentPage', currentPage - 1);
                        } else {
                            webForm.updateCurrentPage(currentPage);
                        }

                        record.set('totalPages', --totalPages);
                    }
                }
            );
        },

        movePages : function(record, currentPage, increment) {
            let formFields = record.formFields();

            formFields.each(function(field) {
                let itemPageNumber = field.get('pageNumber');

                if (itemPageNumber > currentPage) {
                    field.set('pageNumber', itemPageNumber + increment);
                }
            });
        },

        handleChangeActiveField : function(cmp, field) {
            let properties = this.lookup('properties');

            if (!properties) {
                return;
            }

            let filefield = properties.down('[ref=filefield]'),
                vm = this.getViewModel(),
                targetField,
                targetFields = vm.getStore('targetFields'),
                webForm = this.lookup('webForm'),
                maxWidth = webForm.getWidth(),
                maxHeight = webForm.getHeight();

            activeField = field;

            if (field) {
                activeSprite = null;
                webForm.setActiveSprite();

                field.rendered && field.formField.set({
                    xPosition : field.getLocalX(),
                    yPosition : field.getLocalY(),
                    width : field.getWidth(),
                    height : field.getHeight()
                });

                targetField = field.formField.get('targetField');
            }

            vm.set({
                activeField : field,
                activeSprite : activeSprite
            });

            vm.notify();

            if (field && vm.get('changeableFontSize')) {
                let fieldData = field.formField.get('data'),
                    currentData = fieldData && Ext.decode(fieldData, true);

                if (currentData && currentData['fontSize']) {
                    vm.set('fontSize', currentData['fontSize']);
                } else {
                    field.inputEl && vm.set('fontSize', parseInt(field.inputEl.getStyle('fontSize').replace('px', ''), 10));
                }
            }

            if (!field) {
                if (filefield) {
                    filefield.reset();
                    filefield.fileInputEl && filefield.fileInputEl.on('change', function(event) {
                        filefield.fireEvent('onselectfile', event, filefield);
                    });
                }

                vm.set({
                    fieldSize : {
                        w : 0,
                        h : 0,
                        minW : 0,
                        minH : 0,
                        maxW : 0,
                        maxH : 0
                    },

                    fieldPosition : {
                        x : 0,
                        y : 0
                    },

                    code : null,
                    contentToken : null,
                    targetField : null,
                    validation : null
                });

                properties && properties.setVisible(false);

                return;
            }

            vm.set({
                isRequired : field.formField.get('isRequired'),
                radioFieldGroup : field.isRadio ? field.formField.get('groupName') : null,
                code : field.formField.get('code'),
                contentToken : field.formField.get('contentToken'),
                validation : field.formField.get('validation')
            });

            targetFields.filter({
                property : 'fieldType',
                value : field.formField.get('webformDataTypeCode')
            });

            Ext.defer(() => {
                // after filtering
                vm.set('targetField', targetField)
            }, 200);

            let scale = vm.get('webFormZoom') / 100;

            field.on('detectsize', function() {
                let x = field.getLocalX(),
                    y = field.getLocalY(),
                    w = field.getWidth(),
                    h = field.getHeight();

                field.rendered && field.formField.set({
                    xPosition : x,
                    yPosition : y,
                    width : w,
                    height : h
                });

                vm.set(
                    {
                        fieldSize : {
                            w : Math.floor(w / scale),
                            h : h,
                            minW : field.getMinWidth(),
                            minH : field.getMinHeight(),
                            maxW : field.getMaxWidth() || maxWidth,
                            maxH : field.getMaxHeight() || maxHeight
                        },
                        fieldPosition : {
                            x : x,
                            y : y
                        }
                    }
                );
            }, field, {single : true});

            field.rendered && vm.set(
                {
                    fieldSize : {
                        w : Math.floor(field.getWidth() / scale),
                        h : field.getHeight(),
                        minW : field.getMinWidth(),
                        minH : field.getMinHeight(),
                        maxW : field.getMaxWidth() || maxWidth,
                        maxH : field.getMaxHeight() || maxHeight
                    },
                    fieldPosition : {
                        x : field.getLocalX(),
                        y : field.getLocalY()
                    }
                }
            );

            if (properties) {
                Ext.suspendLayouts();

                properties.setVisible(true);

                let y = properties.getY(),
                    maxHeight = Ext.getBody().getHeight() - (y === 0 ? 80 : y + 10),
                    currentHeight = properties.getHeight(),
                    layout = properties.getLayout(),
                    innerHeight = layout && layout.innerCt && layout.innerCt.getHeight();

                if (currentHeight > maxHeight || currentHeight < properties.getMinHeight() || innerHeight < maxHeight) {
                    properties.setHeight(maxHeight);
                }

                Ext.resumeLayouts();
            }

            vm.notify();

            this.lookup('fieldWidth').validate();
            this.lookup('fieldHeight').validate();
        },

        handleChangeActiveSprite : function(cmp, sprite) {
            let vm = this.getViewModel(),
                properties = this.lookup('properties');

            activeSprite = sprite;
            if (!sprite) {
                this.lookup('webForm').setActiveField();
            } else {
                activeField = null;
            }

            vm.set({
                activeField : activeField,
                activeSprite : sprite
            });

            if (sprite) {
                let opacity = Math.round(sprite.attr.fillOpacity * 100) / 100,
                    hexOpacity = (Math.round(opacity * 255) + 0x10000).toString(16).substr(-2);

                properties && properties.show();

                vm.set('activeSpriteAttr', {
                    lineWidth : sprite.attr.lineWidth || null,
                    strokeStyle : sprite.attr.strokeStyle || null,
                    fillStyle : (sprite.attr.fillStyle + hexOpacity) || null,
                    x : sprite.attr.x || sprite.attr.cx || null,
                    y : sprite.attr.y || sprite.attr.cy || null,
                    radius : sprite.attr.r || null,
                    width : sprite.attr.width || null,
                    height : sprite.attr.height || null
                });
            } else {
                vm.set('activeSpriteAttr', {
                    lineWidth : null,
                    strokeStyle : null,
                    fillStyle : null,
                    width : null,
                    height : null,
                    radius : null,
                    x : null,
                    y : null
                });

                properties && properties.hide();
            }
        },

        handleAfterRecordLoad : function(record) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                minimalZoom = criterion.Consts.WEBFORM_DPI.DESKTOP / criterion.Consts.WEBFORM_DPI.PRINT * 100,
                filefield = this.lookup('properties').down('filefield'),
                filefieldEl = filefield && filefield.getEl(),
                file = filefieldEl && filefieldEl.file,
                targetFields = vm.getStore('targetFields');

            filefield.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    filefield.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    file = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];
                    if (file) {
                        file.inputEl.dom.value = file.name;

                    }
                    filefield.removeCls('drag-over');
                    me.readFile(file);
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    filefield.removeCls('drag-over');
                }
            });

            if (record.phantom) {
                let printSizeCd = this.lookup('printSizeCd'),
                    printSizeCdStore = printSizeCd.getStore(),
                    defaultValue = printSizeCd && printSizeCdStore.findRecord('isDefault', true) || printSizeCdStore.getAt(0);

                defaultValue && record.set('printSizeCd', defaultValue.getId());
            }

            this.getViewModel().set('webFormZoom', 100);
            this.lookup('zoom').setMinValue(minimalZoom);

            view.setLoading(true);

            Ext.promise.Promise.all([
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.WEBFORM_TARGET_FIELDS,
                    method : 'GET'
                }),
                criterion.CodeDataManager.load([
                    criterion.consts.Dict.WEBFORM_DATA_TYPE
                ])
            ]).then(function(response) {
                let fields = record.formFields(),
                    targetFieldsData = response && response.length && response[0] || {};

                Ext.Object.each(targetFieldsData, function(key, value) {
                    if (Ext.isArray(value)) {
                        Ext.Array.each(value, function(fieldValue) {
                            targetFields.add({
                                fieldType : key,
                                value : fieldValue,
                                selected : fields.findExact('targetField', fieldValue) > -1
                            })
                        });
                    }
                });
            }).always(function() {
                view.setLoading(false);
                vm.set('blockedState', false);
            });

        },

        handleXChange : function(cmp, value) {
            let webform = this.lookup('webForm');

            if (activeField && Ext.isNumeric(value)) {
                activeField.setLocalX(value);
                activeField.formField.set({
                    xPosition : value
                });

                if (activeField.formResizable) {
                    webform.showFieldResizers(activeField);
                }
            }

            if (activeSprite && Ext.isNumeric(value) && Ext.Array.contains(['image', 'rect', 'circle'], activeSprite.type)) {
                activeSprite.setAttributes({
                    x : value,
                    cx : value
                });

                if (activeSprite.formResizable) {
                    webform.showSpriteResizers(activeSprite);
                }

                this.renderWebFormFrame();
            }
        },

        handleYChange : function(cmp, value) {
            let webform = this.lookup('webForm');

            if (activeField && Ext.isNumeric(value)) {
                activeField.setLocalY(value);
                activeField.formField.set({
                    yPosition : value
                });

                if (activeField.formResizable) {
                    webform.showFieldResizers(activeField);
                }
            }

            if (activeSprite && Ext.isNumeric(value) && Ext.Array.contains(['image', 'rect', 'circle'], activeSprite.type)) {
                activeSprite.setAttributes({
                    y : value,
                    cy : value
                });

                if (activeSprite.formResizable) {
                    webform.showSpriteResizers(activeSprite);
                }

                this.renderWebFormFrame();
            }
        },

        handleWidthChange : function(cmp, value, oldValue) {
            let webform = this.lookup('webForm');

            if (activeField && value) {
                activeField.setWidth(value);
                activeField.formField.set({
                    width : value
                });

                if (activeField.formResizable) {
                    webform.showFieldResizers(activeField);
                }

            } else if (activeSprite && value && (activeSprite.type === 'image' || activeSprite.type === 'rect')) {
                activeSprite.setAttributes({
                    width : value
                });

                if (activeSprite.formResizable) {
                    webform.showSpriteResizers(activeSprite);
                }

                this.renderWebFormFrame();
            }
        },

        handleHeightChange : function(cmp, value, oldValue) {
            let vm = this.getViewModel(),
                webform = this.lookup('webForm');

            if (activeField && value) {
                activeField.setHeight(value);
                activeField.formField.set({
                    height : value
                });

                if (activeField.formResizable) {
                    webform.showFieldResizers(activeField);
                }

                if (activeField.dataType === criterion.Consts.WEBFORM_DATA_TYPE.MEMO) {
                    let fieldData = Ext.decode(activeField.formField.get('data'), true) || {
                        fontSize : activeField.inputEl && parseInt(activeField.inputEl.getStyle('fontSize').replace('px', ''), 10)
                    };

                    if (fieldData && fieldData.fontSize) {
                        vm.set('maxSize', Math.floor((value - 16) / (fieldData.fontSize + criterion.Consts.WEBFORM_FIELD_STYLE.ADDED_LINE_HEIGHT)));
                        vm.notify();
                    }
                }

            } else if (activeSprite && value && (activeSprite.type === 'image' || activeSprite.type === 'rect')) {
                activeSprite.setAttributes({
                    height : value
                });

                if (activeSprite.formResizable) {
                    webform.showSpriteResizers(activeSprite);
                }

                this.renderWebFormFrame();
            }
        },

        handlePrintSizeChange : function(cmp) {
            let selection = cmp.getSelection();

            if (selection) {
                let scale = criterion.Consts.WEBFORM_DPI.PRINT / criterion.Consts.WEBFORM_DPI.DESKTOP,
                    width = parseInt(selection.get('attribute1'), 10) * scale,
                    height = parseInt(selection.get('attribute2'), 10) * scale;

                this.lookup('webForm').setSize(width, height);
            }
        },

        handleSelectFile : function(fld, value) {
            let fileInputEl = fld.fileInputEl.el.dom,
                newValue = value.replace(/C:\\fakepath\\/g, '');

            fld.setRawValue(newValue);
            if (fileInputEl && fileInputEl.files && fileInputEl.files.length) {
                // noinspection TypeScriptValidateTypes
                this.readFile(fileInputEl.files[0])
            }
        },

        readFile : function(file) {
            let me = this,
                webForm = this.lookup('webForm'),
                properties = this.lookup('properties'),
                fileField = properties.down('[ref=filefield]'),
                activeSprite = webForm.getActiveSprite(),
                reader = new FileReader();

            if (!activeSprite || !file) {
                return
            }

            reader.onload = function(e) {
                let image = new Image(),
                    canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');

                image.onload = function() {
                    let src;

                    canvas.width = image.width;
                    canvas.height = image.height;

                    if (canvas.width > webForm.width || canvas.height > webForm.height) {
                        let scale = Math.max(canvas.width / webForm.width, canvas.height / webForm.height);

                        canvas.width /= scale;
                        canvas.height /= scale;
                    }

                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    src = canvas.toDataURL();

                    activeSprite.setAttributes({
                        height : canvas.height,
                        width : canvas.width,
                        src : src
                    });

                    //activeSprite.imageScale = image.width / image.height;
                    activeSprite.formField.set('imageData', file);
                    fileField.toggleInvalidCls();

                    webForm.showSpriteResizers(activeSprite);
                    me.renderWebFormFrame();
                };

                image.src = e.target.result;
            };

            reader.readAsDataURL(file);
        },

        handleForward : function() {
            let webForm = this.lookup('webForm'),
                sprite = webForm.getActiveSprite();

            if (sprite && sprite.isSprite) {
                let sprites = webForm.getSurface().getItems(),
                    indexes = Ext.Array.map(sprites, function(sprite) {
                        if (sprite.resizer) {
                            return;
                        }
                        return sprite.attr.zIndex
                    }),
                    maxIndex = Ext.Array.max(indexes),
                    topSprite = maxIndex && Ext.Array.findBy(sprites, function(sprite) {
                        if (sprite.resizer) {
                            return;
                        }
                        return sprite.attr.zIndex === maxIndex;
                    });

                if (topSprite && topSprite !== sprite) {
                    let topIndex = topSprite.attr.zIndex;

                    topSprite.setAttributes({
                        zIndex : sprite.attr.zIndex
                    });

                    sprite.setAttributes({
                        zIndex : topIndex
                    })
                }

                webForm.renderFrame();
            }
        },

        handleBackwards : function() {
            let webForm = this.lookup('webForm'),
                item = webForm.getActiveSprite();

            if (item && item.isSprite) {
                let sprites = webForm.getSurface().getItems(),
                    indexes = Ext.Array.map(sprites, function(sprite) {
                        if (sprite.resizer) {
                            return;
                        }
                        return sprite.attr.zIndex
                    }),
                    minIndex = Ext.Array.min(indexes),
                    bottomSprite = Ext.Array.findBy(sprites, function(sprite) {
                        if (sprite.resizer) {
                            return;
                        }
                        return sprite.attr.zIndex === minIndex;
                    });

                if (bottomSprite && bottomSprite !== item) {
                    let bottomIndex = bottomSprite.attr.zIndex;

                    bottomSprite.setAttributes({
                        zIndex : item.attr.zIndex
                    });

                    item.setAttributes({
                        zIndex : bottomIndex
                    })
                }

                webForm.renderFrame();
            }
        },

        renderWebFormFrame : function() {
            this.lookup('webForm').renderFrame();
        },

        handleLineWidthChange : function(cmp, value) {
            if (activeSprite) {
                activeSprite.setAttributes({
                    lineWidth : value || 0
                });

                this.renderWebFormFrame();
            }
        },

        handleStrokeColorChange : function(cmp, value) {
            if (activeSprite && value) {
                let me = this,
                    vm = me.getViewModel(),
                    strokeOpacity = parseInt(Ext.util.Format.substr(value, 6, 2), 16),
                    record,
                    formFields;

                if (strokeOpacity === 0 && (activeSprite.type === 'line' || activeSprite.attr.fillOpacity === 0)) {
                    record = vm.get('record');
                    formFields = record.formFields();
                    formFields.remove(activeSprite.formField);
                    activeSprite.remove();
                    vm.set('activeSprite');
                    criterion.Utils.toast({
                        html : i18n.gettext('The object has been removed because of its full transparency.'),
                        autoCloseDelay : 3000
                    });
                    me.lookup('webForm').setActiveSprite();
                } else {
                    activeSprite.setAttributes({
                        strokeStyle : Ext.String.format('#{0}', Ext.util.Format.substr(value, 0, 6)),
                        strokeOpacity : strokeOpacity / 255
                    });
                }

                this.renderWebFormFrame();
            }
        },

        handleStrokeColorClear : function(cmp) {
            if (activeSprite) {
                cmp.setValue('transparent');
                activeSprite && activeSprite.setAttributes({//Yes, double check
                    strokeStyle : 'none'
                });

                this.renderWebFormFrame();
            }
        },

        handleFillColorChange : function(cmp, value) {
            if (activeSprite && value) {
                let me = this,
                    vm = me.getViewModel(),
                    fillOpacity = parseInt(Ext.util.Format.substr(value, 6, 2), 16),
                    record,
                    formFields;

                if (fillOpacity === 0 && activeSprite.attr.strokeOpacity === 0) {
                    record = vm.get('record');
                    formFields = record.formFields();
                    formFields.remove(activeSprite.formField);
                    activeSprite.remove();

                    me.getViewModel().set('activeSprite');
                    criterion.Utils.toast({
                        html : i18n.gettext('The object has been removed because of its full transparency.'),
                        autoCloseDelay : 3000
                    });
                    me.lookup('webForm').setActiveSprite();
                } else {
                    activeSprite.setAttributes({
                        fillStyle : Ext.String.format('#{0}', Ext.util.Format.substr(value, 0, 6)),
                        fillOpacity : parseInt(Ext.util.Format.substr(value, 6, 2), 16) / 255
                    });
                }

                this.renderWebFormFrame();
            }
        },

        handleFillColorClear : function(cmp) {
            if (activeSprite) {
                cmp.setValue('transparent');
                activeSprite && activeSprite.setAttributes({
                    fillStyle : 'none'
                });

                this.renderWebFormFrame();
            }
        },

        handleChangeTable : function(cmp, value) {
            if (value && activeField && activeField.isCodeDetail) {
                let selectedRecord = cmp.getSelectedRecord();

                activeField.setValue(selectedRecord.get('description'));

                activeField.formField.set({
                    responseCd : cmp.getSelection().get('id')
                });
            }
        },

        handleMaxPropChange : function(cmp, value, oldValue) {
            if (activeField && value > 0) {
                activeField.maxSize = value;

                activeField.formField.set({
                    maximumSize : value
                });

            } else {
                (value !== oldValue) && cmp.setValue(oldValue || 1)
            }
        },

        handleFontSizePropChange : function(cmp, value) {
            let fieldData = Ext.decode(activeField.formField.get('data'), true);

            if (activeField && value > 0) {
                if (activeField.dataType !== criterion.Consts.WEBFORM_DATA_TYPE.MEMO) {
                    activeField.setHeight(1);
                } else {
                    this.getViewModel().set('maxSize', Math.floor((activeField.getHeight() - 16) / (value + criterion.Consts.WEBFORM_FIELD_STYLE.ADDED_LINE_HEIGHT)));
                }

                activeField.setFieldStyle({
                    fontSize : `${value}px`,
                    lineHeight : `${value + criterion.Consts.WEBFORM_FIELD_STYLE.ADDED_LINE_HEIGHT}px`
                });

                if (Ext.isObject(fieldData)) {
                    fieldData['fontSize'] = value;
                } else {
                    fieldData = {
                        fontSize : value
                    }
                }

                activeField.formField.set({
                    data : Ext.encode(fieldData)
                });
            }
        },

        handleRadiusChange : function(cmp, value) {
            let webform = this.lookup('webForm');

            if (cmp.isValid() && activeSprite && activeSprite.type === 'circle') {
                activeSprite.setAttributes({
                    radius : value
                });

                if (activeSprite.formResizable) {
                    webform.showSpriteResizers(activeSprite);
                }

                this.renderWebFormFrame();
            }
        },

        deleteRecord : function() {
            let me = this,
                form = me.getView(),
                record = this.getRecord();

            record.erase({
                success : function() {
                    form.fireEvent('afterDelete', me);
                    me.close();
                },
                failure : function() {
                    record.reject();
                }
            });
        },

        handleSubmitClick : function() {
            let me = this,
                form = me.getView(),
                record = this.getRecord(),
                fields = record.formFields(),
                webForm = this.lookup('webForm'),
                properties = this.lookup('properties'),
                fileField = properties.down('[ref=filefield]'),
                hasInvalidImage = false,
                hasInvalidRadio = false,
                hasInvalidCodeDetail = false,
                hasInvalidCodeForField = false,
                imageId, textBlockId;

            imageId = criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.WEBFORM_DATA_TYPE.IMAGE, criterion.consts.Dict.WEBFORM_DATA_TYPE).getId();
            textBlockId = criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.WEBFORM_DATA_TYPE.TEXT_BLOCK, criterion.consts.Dict.WEBFORM_DATA_TYPE).getId();

            webForm.items.each(function(item) {
                if (item.isRadio && !item.formField.get('groupName')) {
                    webForm.setActiveSprite();
                    webForm.setActiveField(item);
                    hasInvalidRadio = true;
                    return false;
                }
            });

            webForm.items.each(function(item) {
                if (item.isCodeDetail && !item.formField.get('responseCd')) {
                    webForm.setActiveSprite();
                    webForm.setActiveField(item);
                    hasInvalidCodeDetail = true;
                    return false;
                }
            });

            // check code for fields
            webForm.items.each(function(item) {
                if (item.isWebFormField && !item.formField.get('code')) {
                    webForm.setActiveSprite();
                    webForm.setActiveField(item);
                    hasInvalidCodeForField = true;
                    return false;
                }
            });

            if (!hasInvalidRadio && !hasInvalidCodeDetail && !hasInvalidCodeForField) {
                Ext.Array.each(webForm.getSurface().getItems(), function(sprite) {
                    let field = sprite.formField,
                        data;

                    if (sprite.resizeSprite) {
                        return;
                    }

                    switch (sprite.type) {
                        case 'image':
                            data = sprite.attr.src;

                            if (field && field.phantom && field.get('webformDataTypeCd') === imageId && !field.get('imageData')) {
                                webForm.setActiveSprite(sprite);
                                webForm.setActiveField();
                                fileField.toggleInvalidCls(i18n.gettext('Image file required.'));
                                hasInvalidImage = true;
                                return false;
                            }

                            sprite.formField.set({
                                xPosition : criterion.Utils.serializeDPI(sprite.attr.x),
                                yPosition : criterion.Utils.serializeDPI(sprite.attr.y),
                                width : criterion.Utils.serializeDPI(sprite.attr.width),
                                height : criterion.Utils.serializeDPI(sprite.attr.height),
                                zIndex : sprite.attr.zIndex
                            });
                            break;
                        case 'line':
                            data = {
                                type : sprite.type,
                                fromX : criterion.Utils.serializeDPI(sprite.attr.fromX),
                                fromY : criterion.Utils.serializeDPI(sprite.attr.fromY),
                                toX : criterion.Utils.serializeDPI(sprite.attr.toX),
                                toY : criterion.Utils.serializeDPI(sprite.attr.toY),
                                lineWidth : sprite.attr.lineWidth,
                                strokeOpacity : sprite.attr.strokeOpacity,
                                strokeStyle : sprite.attr.strokeStyle,
                                zIndex : sprite.attr.zIndex
                            };
                            break;
                        case 'rect':
                            data = {
                                type : sprite.type,
                                x : criterion.Utils.serializeDPI(sprite.attr.x),
                                y : criterion.Utils.serializeDPI(sprite.attr.y),
                                width : criterion.Utils.serializeDPI(sprite.attr.width),
                                height : criterion.Utils.serializeDPI(sprite.attr.height),
                                fillOpacity : sprite.attr.fillOpacity,
                                fillStyle : sprite.attr.fillStyle,
                                lineWidth : sprite.attr.lineWidth,
                                strokeOpacity : sprite.attr.strokeOpacity,
                                strokeStyle : sprite.attr.strokeStyle,
                                zIndex : sprite.attr.zIndex
                            };
                            break;
                        case 'circle':
                            data = {
                                type : sprite.type,
                                cx : criterion.Utils.serializeDPI(sprite.attr.cx),
                                cy : criterion.Utils.serializeDPI(sprite.attr.cy),
                                r : criterion.Utils.serializeDPI(sprite.attr.r),
                                fillOpacity : sprite.attr.fillOpacity,
                                fillStyle : sprite.attr.fillStyle,
                                lineWidth : sprite.attr.lineWidth,
                                strokeOpacity : sprite.attr.strokeOpacity,
                                strokeStyle : sprite.attr.strokeStyle,
                                zIndex : sprite.attr.zIndex
                            };
                            break;
                    }

                    if (data) {
                        field.set('data', typeof data === 'string' ? data : Ext.JSON.encode(data));
                    }
                });

                if (hasInvalidImage) {
                    return;
                }

                fields.each(function(field) {
                    let webformDataType = field.get('webformDataTypeCd');
                    if ((webformDataType === imageId && !field.get('data')) || (webformDataType === textBlockId && !field.get('data'))) {
                        field.drop();
                    }
                });

                let formData = record.getData(true);

                if (!record.phantom) {
                    let modifiedRecords = record.formFields().getModifiedRecords(),
                        removedRecords = record.formFields().getRemovedRecords();

                    formData.formFields = modifiedRecords.map(function(modifiedRecord) {
                        return modifiedRecord.getData();
                    });

                    Ext.each(removedRecords, function(removedRecord) {
                        removedRecord.set('$delete', true);
                        formData.formFields.push(removedRecord.getData());
                    });
                }

                Ext.each(formData.formFields, function(formField) {
                    if (formField.webformDataTypeCode !== criterion.Consts.WEBFORM_DATA_TYPE.SHAPE &&
                        formField.webformDataTypeCode !== criterion.Consts.WEBFORM_DATA_TYPE.IMAGE) {
                        formField.xPosition = criterion.Utils.serializeDPI(formField.xPosition);
                        formField.yPosition = criterion.Utils.serializeDPI(formField.yPosition);
                        formField.width = criterion.Utils.serializeDPI(formField.width);
                        formField.height = criterion.Utils.serializeDPI(formField.height);
                    }

                    if (formField.imageData) {
                        formData[formField.id.toString()] = formField.imageData;
                        formField.data = formField.id.toString();
                    }
                });

                formData.formFields = JSON.stringify(formData.formFields);

                if (Ext.isObject(formData.description)) {
                    let value = formData.description,
                        valKeys = Ext.Object.getKeys(value);

                    formData.description = valKeys.length > 1 ? Ext.encode(value) : (!Ext.isEmpty(value[criterion.Consts.LOCALIZATION_LANGUAGE_EN]) ? value[criterion.Consts.LOCALIZATION_LANGUAGE_EN] : '');
                } else if (Ext.isEmpty(formData.description)) {
                    formData.description = '';
                }

                form.setLoading(true);

                criterion.Api.submitFakeForm([], {
                    url : criterion.consts.Api.API.WEBFORM + (record.phantom ? '' : '/' + record.getId()),
                    method : record.phantom ? 'POST' : 'PUT',
                    extraData : formData,
                    scope : this,
                    success : function() {
                        webForm.setActiveField();
                        webForm.setActiveSprite();
                        form.fireEvent('afterSave');
                        form.setLoading(false);
                        form.close();
                    },
                    failure : function() {
                        form.setLoading(false);
                    }
                });
            } else {
                if (hasInvalidRadio) {
                    let radioGroup = Ext.ComponentQuery.query('[ref=radioGroup]')[0];
                    Ext.defer(function() {
                        radioGroup.isValid();
                    }, 100);
                }

                if (hasInvalidCodeDetail) {
                    let codeDetail = this.lookup('codeDetail');
                    Ext.defer(function() {
                        codeDetail && codeDetail.isValid();
                    }, 100);
                }

                if (hasInvalidCodeForField) {
                    let codeField = this.lookup('codeField');
                    Ext.defer(function() {
                        codeField && codeField.isValid();
                    }, 100);
                }
            }
        },

        handleCancelClick : function() {
            let webForm = this.lookup('webForm');

            webForm.setActiveField();
            webForm.setActiveSprite();

            this.callParent(arguments);
        },

        handleNext : function() {
            let formIsValid = true;

            Ext.Array.each(this.lookup('formSettings').query('[isWFMainSettings]'), function(cmp) {
                if (Ext.isFunction(cmp.validate) && !cmp.validate()) {
                    formIsValid = false;

                    return false
                }
            });

            formIsValid && this.getViewModel().set('activeViewIndex', 1);
        },

        handleBack : function() {
            this.getViewModel().set('activeViewIndex', 0);
        },

        handleRequiredChange : function(cmp, value) {
            if (activeField) {
                activeField.formField.set({
                    isRequired : value
                });
                if (activeField.isRadio) {
                    let radioGroupName = activeField.formField.get('groupName');

                    this.getRecord().formFields().each(function(field) {
                        if (field.get('groupName') === radioGroupName) {
                            field.set({
                                isRequired : value
                            });
                        }
                    });
                }
            }
        },

        handleWebFormExport : function() {
            window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(criterion.consts.Api.API.WEBFORM_EXPORT, this.getRecord().getId())));
        },

        handleFormFieldPropertyChange : function(cmp, value) {
            if (activeField) {
                activeField.formField.set(cmp.getName(), value);
            }
        },

        handleTargetFieldChange : function(cmp, value) {
            let targetFields = cmp.getStore();

            if (activeField) {
                let currentValue = activeField.formField.get('targetField');

                if (currentValue && !value) {
                    targetFields.findRecord('value', currentValue, 0, false, true, true).set('selected', false);
                }

                activeField.formField.set('targetField', value);
            }

            if (value) {
                targetFields.each(function(targetField) {
                    if (targetField.get('value') === value) {
                        targetField.set('selected', true);
                    }
                }, this, true);
            }
        },

        handleDeleteActiveField : function(cmp, field) {
            let targetField = field.formField.get('targetField'),
                targetFields = targetField && this.getViewModel().getStore('targetFields'),
                selectedField = targetFields && targetFields.findRecord('value', targetField, 0, false, true, true);

            if (selectedField) {
                selectedField.set('selected', false);
            }
        }
    };

});
