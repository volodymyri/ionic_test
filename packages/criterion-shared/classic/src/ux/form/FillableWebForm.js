Ext.define('criterion.ux.form.FillableWebForm', function() {

    return {
        extend : 'Ext.form.Panel',

        alias : 'widget.criterion_fillable_webform',

        requires : [
            'criterion.model.webForm.FillableForm',
            'criterion.model.webForm.Field',
            'Ext.layout.container.Absolute',
            'Ext.draw.Container',
            'Ext.draw.engine.Canvas'
        ],

        config : {
            /**
             * @type criterion.model.webForm.FillableForm
             */
            record : null,

            editable : false,

            mainUrl : null,

            correctHeightValue : 0,

            allowBlanksIfAdmin : false
        },

        cls : 'web-form web-form-fillable',

        useDocumentSize : true,

        layout : 'absolute',

        loadForm : function(documentId, endpoint, delegatedByEmployeeId) {
            let me = this,
                mainUrl = this.getMainUrl(),
                dfd = Ext.create('Ext.Deferred');

            if (!endpoint) {
                endpoint = criterion.consts.Api.API.EMPLOYEE_DOCUMENT_WEBFORM_FIELDS
            }

            Ext.promise.Promise.all([
                criterion.CodeDataManager.loadIfEmpty(criterion.consts.Dict.WEBFORM_DATA_TYPE),
                criterion.Api.requestWithPromise({
                    method : 'GET',
                    url : mainUrl || Ext.String.format(endpoint, documentId),
                    params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                })
            ]).then(function([cd, formData]) {
                if (!formData) {
                    dfd.resolve();
                    return;
                }

                let fillableFormRecord = Ext.create('criterion.model.webForm.FillableForm', formData);

                me.on('allFieldsAreReady', () => {
                    me.isValid();
                    dfd.resolve();
                }, me, {single : true});

                fillableFormRecord.formFields().loadData(formData.formFields || []);
                fillableFormRecord.annotations().loadData(formData.annotations || []);
                me.setRecord(fillableFormRecord);
            });

            return dfd.promise;
        },

        updateRecord : function(record) {
            if (!record) {
                return;
            }

            let me = this,
                totalPages = record.get('totalPages');

            me.removeAll();

            Ext.each(criterion.Utils.range(1, totalPages), () => {
                me.add({
                    xtype : 'draw',
                    downloadServerUrl : '-',
                    formFields : []
                });
            });

            Ext.defer(() => {
                me.fillFields(record);
            }, 100);
        },

        fillFields : function(record) {
            let me = this,
                draws = me.query('draw'),
                items = Ext.Array.merge(record.annotations().getRange(), record.formFields().getRange()),
                editable = this.getEditable(),
                DRAW_BOTTOM_MARGIN = 3,
                DRAW_PADDING = 20,
                allowBlanksIfAdmin = this.getAllowBlanksIfAdmin() && criterion.Application.isAdmin() && !!criterion.Api.getAuthResult().isSystemAdministrator;

            Ext.Array.each(items, function(item) {
                let dataTypes = criterion.Consts.WEBFORM_DATA_TYPE,
                    dataType = criterion.CodeDataManager.getCodeDetailRecord('id', item.get('webformDataTypeCd'), criterion.consts.Dict.WEBFORM_DATA_TYPE).get('code'),
                    field, baseCfg,
                    pageNumber = item.get('pageNumber'),
                    draw = draws[pageNumber - 1],
                    surface = draw.getSurface(),
                    xPosition = item.get('xPosition'),
                    yPosition = item.get('yPosition'),
                    maxLength = item.get('maximumSize'),
                    width = item.get('width'),
                    height = item.get('height'),
                    allowBlank = !item.get('isRequired') || allowBlanksIfAdmin,
                    name = item.getId(),
                    value = item.get('value'),
                    customData = Ext.decode(item.get('data'), true),
                    fieldStyle = {},
                    cachedValue,
                    dirtyField = false;

                if (!Ext.Array.contains([dataTypes.IMAGE, dataTypes.SIG, dataTypes.SHAPE], dataType)) {
                    if (criterion.Utils.fieldsLocalCache && item.getCacheName) {
                        cachedValue = criterion.Utils.fieldsLocalCache.getItem(item.getCacheName());

                        if (cachedValue) {
                            cachedValue = Ext.JSON.decode(cachedValue);
                            if (cachedValue['value'] && cachedValue['value'] !== value) {
                                if (item.get('webformDataTypeCode') === criterion.Consts.WEBFORM_DATA_TYPE.DATE) {
                                    cachedValue['value'] = Ext.Date.parse(cachedValue['value']);
                                }
                                dirtyField = true;
                            }
                        }
                    }
                    baseCfg = {
                        labelWidth : 0,
                        hidden : true,
                        dataType : dataType,
                        formField : item,
                        width : width,
                        height : height,
                        allowBlank : allowBlank,
                        name : name,
                        value : value,
                        readOnly : !editable,
                        listeners : {
                            render : cmp => {
                                if (dirtyField) {
                                    Ext.defer(() => {
                                        cmp.setValue(cachedValue['value']);
                                    }, 1000);
                                }
                            },
                            change : (cmp, value) => {
                                item.set('value', value)
                            }
                        }
                    };

                    switch (dataType) {
                        case dataTypes.TEXT:
                            field = Ext.create('Ext.form.field.Text', Ext.apply(baseCfg, {
                                maxLength : maxLength,
                                enforceMaxLength : true,
                                disabled : !editable,
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.NUMBER:
                            field = Ext.create('Ext.form.field.Number', Ext.apply(baseCfg, {
                                maxLength : maxLength,
                                enforceMaxLength : true,
                                disabled : !editable,
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.TEXT_BLOCK:
                            field = Ext.create('Ext.Component', Ext.apply(baseCfg, {
                                html : item.get('data'),
                                formField : null,
                                isFillable : false
                            }));
                            break;
                        case dataTypes.DATE:
                            field = Ext.create('Ext.form.field.Date', Ext.apply(baseCfg, {
                                disabled : !editable,
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.CHECKBOX:
                            field = Ext.create('Ext.form.field.Checkbox', Ext.apply(baseCfg, {
                                inputValue : true,
                                disabled : !editable
                            }));
                            break;
                        case dataTypes.MEMO:
                            field = Ext.create('Ext.form.field.TextArea', Ext.apply(baseCfg, {
                                value : value || '',
                                validator : editable ? function() {
                                    if (this.inputEl.dom.scrollHeight >= this.formField.get('height')) {
                                        return i18n._('Entered text is too long that may cause issues at printing. Please, make the text shorter to avoid the scroll bar appearing.');
                                    } else {
                                        return true;
                                    }
                                } : () => true
                            }));
                            break;
                        case dataTypes.DROPDOWN:
                            field = Ext.create('criterion.ux.form.field.CodeDetail', Ext.apply(baseCfg, {
                                isCodeDetail : true,
                                codeDataId : item.get('responseName'),
                                disabled : !editable,
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.RADIO:
                            field = Ext.create('Ext.form.field.Radio', Ext.apply(baseCfg, {
                                name : item.get('groupName'),
                                fieldId : name,
                                inputValue : true,
                                value : value === 'radio-' + name,
                                disabled : !editable
                            }));
                            break;
                        case dataTypes.EMAIL:
                            field = Ext.create('Ext.form.field.Text', Ext.apply(baseCfg, {
                                vtype : 'email',
                                maxLength : maxLength,
                                enforceMaxLength : true,
                                disabled : !editable,
                                setMinHeight : true
                            }));
                            break;
                        case dataTypes.ATTACH:
                            if (editable && !value) {
                                field = Ext.create('Ext.form.field.File', Ext.apply(baseCfg, {
                                    listeners : {
                                        change : function(fld, value) {
                                            let newValue = value.replace(/C:\\fakepath\\/g, '');
                                            fld.setRawValue(newValue);
                                        }
                                    },
                                    disabled : !editable,
                                    setMinHeight : true
                                }));
                            } else if (value) {
                                let fileName = item.get('data') || i18n.gettext('No Name');

                                field = Ext.create({
                                    xtype : 'button',
                                    text : fileName,
                                    cls : 'criterion-btn-transparent',
                                    width : width,
                                    height : height,
                                    handler : function(cmp, e) {
                                        if (Ext.Array.contains(e.target.classList, 'x-btn-glyph')) {
                                            criterion.Msg.confirmDelete({
                                                    title : i18n.gettext('Delete'),
                                                    message : i18n.gettext('Do you want to delete this attachment?')
                                                },
                                                function(btn) {
                                                    if (btn === 'yes') {
                                                        criterion.Api.requestWithPromise({
                                                            url : Ext.String.format(criterion.consts.Api.API.DOCUMENT_WEBFORM_ATTACHMENT_DELETE, value),
                                                            method : 'DELETE'
                                                        }).then(function() {
                                                            criterion.Utils.toast(i18n.gettext('Successfully'));

                                                            me.remove(field);

                                                            field = Ext.create('Ext.form.field.File', Ext.apply(baseCfg, {
                                                                lateX : xPosition,
                                                                lateY : yPosition,
                                                                listeners : {
                                                                    change : function(fld, value) {
                                                                        let newValue = value.replace(/C:\\fakepath\\/g, '');
                                                                        fld.setRawValue(newValue);
                                                                    }
                                                                },
                                                                disabled : !editable
                                                            }));

                                                            me.add(field);
                                                        });
                                                    }
                                                }, this
                                            );
                                        } else {
                                            window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(criterion.consts.Api.API.DOCUMENT_WEBFORM_ATTACHMENT_DOWNLOAD, value)));
                                        }
                                    },
                                    glyph : editable && criterion.consts.Glyph['ios7-trash-outline'],
                                    iconAlign : 'right'
                                });
                            }
                            break;
                    }

                    if (field && field.setFieldStyle) {
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
                                width : width,
                                height : height,
                                dataType : dataType,
                                formField : item,
                                value : value,
                                readOnly : !editable,
                                allowBlank : allowBlank
                            });
                            break;
                        case dataTypes.IMAGE:
                        case dataTypes.SHAPE:
                            field = 'sprite';
                            break;
                    }
                }

                if (field === 'sprite') {
                    let sprite, spriteData,
                        greaterY = 0,
                        data = item.get('data');

                    if (dataType === dataTypes.IMAGE) {
                        spriteData = {
                            src : data,
                            type : 'image',
                            x : item.get('xPosition'),
                            y : item.get('yPosition'),
                            width : item.get('width'),
                            height : item.get('height')
                        }
                    } else {
                        spriteData = Ext.JSON.decode(data, true);
                    }

                    if (!spriteData) {
                        return;
                    }

                    switch (spriteData.type) {
                        case 'image':
                            let imgY = spriteData.y,
                                imgHeight = spriteData.height;

                            sprite = Ext.create('Ext.draw.sprite.Image', Ext.apply(spriteData, {
                                isSprite : true,
                                dataType : dataTypes.IMAGE,
                                src : spriteData.src,
                                x : spriteData.x,
                                y : imgY,
                                width : spriteData.width,
                                height : imgHeight
                            }));

                            let greaterImgY = imgY + imgHeight;

                            if (greaterY < greaterImgY) {
                                greaterY = greaterImgY;
                            }

                            break;
                        case 'line':
                            let fromY = criterion.Utils.convertDPI(spriteData.fromY),
                                toY = criterion.Utils.convertDPI(spriteData.toY);

                            sprite = Ext.create('Ext.draw.sprite.Line', Ext.apply(spriteData, {
                                isSprite : true,
                                dataType : dataTypes.SHAPE,
                                fromX : criterion.Utils.convertDPI(spriteData.fromX),
                                fromY : fromY,
                                toX : criterion.Utils.convertDPI(spriteData.toX),
                                toY : toY
                            }));

                            let greaterLineY = Math.max(fromY, toY);

                            if (greaterY < greaterLineY) {
                                greaterY = greaterLineY;
                            }

                            break;
                        case 'rect':
                            let rectY = criterion.Utils.convertDPI(spriteData.y),
                                rectHeight = criterion.Utils.convertDPI(spriteData.height);

                            sprite = Ext.create('Ext.draw.sprite.Rect', Ext.apply(spriteData, {
                                isSprite : true,
                                dataType : dataTypes.SHAPE,
                                x : criterion.Utils.convertDPI(spriteData.x),
                                y : rectY,
                                width : criterion.Utils.convertDPI(spriteData.width),
                                height : rectHeight
                            }));

                            let greaterRectY = rectY + rectHeight;

                            if (greaterY < greaterRectY) {
                                greaterY = greaterRectY;
                            }

                            break;
                        case 'circle':
                            let cy = criterion.Utils.convertDPI(spriteData.cy),
                                r = criterion.Utils.convertDPI(spriteData.r);

                            sprite = Ext.create('Ext.draw.sprite.Circle', Ext.apply(spriteData, {
                                isSprite : true,
                                dataType : dataTypes.SHAPE,
                                cx : criterion.Utils.convertDPI(spriteData.cx),
                                cy : cy,
                                r : r
                            }));

                            let greaterCircleY = cy + r;

                            if (greaterY < greaterCircleY) {
                                greaterY = greaterCircleY;
                            }

                            break;
                    }

                    if (draw.el && draw.getHeight() < greaterY) {
                        draw.setHeight(greaterY + DRAW_PADDING);
                    }

                    surface.add([sprite]);
                } else if (field) {
                    field.lateX = xPosition;
                    field.lateY = yPosition;

                    draw.formFields.push(field);
                }
            });

            let prevDraw,
                containerHeight = 0,
                allFormFields = [];

            Ext.each(draws, function(draw, index) {
                let formFields = draw.formFields,
                    prevDrawBottomY = prevDraw ? prevDraw.getY() + prevDraw.getHeight() + DRAW_BOTTOM_MARGIN : 0;

                Ext.each(formFields, function(formField) {
                    let fieldY = formField.lateY;

                    if (draw.getHeight() < (fieldY + formField.height)) {
                        draw.setHeight(fieldY + formField.height + DRAW_PADDING);
                    }
                });

                if (prevDraw) {
                    draw.setY(prevDrawBottomY);
                }

                containerHeight += draw.getHeight() + (prevDraw ? DRAW_BOTTOM_MARGIN : 0);

                me.add({
                    xtype : 'container',
                    cls : 'web-form-page-number',
                    html : index + 1,
                    x : 3,
                    y : draw.getLocalY() + draw.getHeight() - 20
                });

                prevDraw = draw;

                draw.setWidth(me.getWidth());
                draw.setZIndex(0);
                draw.renderFrame();

                Ext.each(formFields, function(formField) {
                    formField.lateY += draw.getLocalY();
                    allFormFields.push(formField);
                });
            });

            criterion.CodeDataManager.getCodeDetailRecordStrict('id', record.get('printSizeCd'), criterion.consts.Dict.PRINT_SIZE).then(function(printSizeRecord) {
                let scale = criterion.Consts.WEBFORM_DPI.PRINT / criterion.Consts.WEBFORM_DPI.DESKTOP,
                    width = parseInt(printSizeRecord.get('attribute1'), 10) * scale;

                me.useDocumentSize && me.setSize(width, containerHeight + me.getCorrectHeightValue());
                Ext.each(allFormFields, function(formField) {
                    me.add(formField);
                });

                if (me.floating) {
                    me.center();
                }

                me.fireEvent('allFieldsAreReady');
            });

        },

        isValid : function() {
            let fields = this.getForm().getFields(),
                invalidRadioGroups = [],
                formIsValid = this.getForm().isValid(),
                groupNames = [];

            fields.each((field) => {
                if (field.isRadio && field.formField.get('isRequired')) {
                    let groupName = field.formField.get('groupName');

                    if (!Ext.Array.contains(groupNames, groupName)) {
                        groupNames.push(groupName)
                    }
                }
            });

            Ext.Array.each(groupNames, function(groupName) {
                let hasValidRadio = false;

                fields.each((field) => {
                    if (groupName === field.formField.get('groupName')) {
                        if (field.getValue()) {
                            hasValidRadio = true;

                            return false;
                        }
                    }
                });

                if (!hasValidRadio) {
                    invalidRadioGroups.push(groupName);
                }
            });

            if (invalidRadioGroups.length || !formIsValid) {
                fields.each((field) => {
                    if (Ext.Array.contains(invalidRadioGroups, field.formField.get('groupName'))) {
                        field.addCls('x-radio-invalid');
                    } else if (field.isRadio) {
                        field.removeCls('x-radio-invalid');
                    }
                });

                return false;
            }

            return true;
        },

        findNextInvalid() {
            let firstInvalidField;

            this.getForm().getFields().findBy(field => {
                if (field.validate && !field.validate()) {
                    firstInvalidField = field;

                    return true;
                } else if (field.isRadio && field.hasCls('x-radio-invalid')) {
                    firstInvalidField = field;

                    return true;
                }
            });

            return firstInvalidField;
        },

        findNextInvalidFormField(parent) {
            let me = this,
                firstInvalidField = me.findNextInvalid();

            if (firstInvalidField) {
                criterion.Msg.confirm({
                    title : i18n.gettext('Warning'),
                    icon : criterion.Msg.QUESTION,
                    message : i18n.gettext('You have not completed all required fields.<BR/>Click OK to move to the uncompleted required fields.'),
                    buttons : criterion.Msg.OKCANCEL,
                    closable : false,
                    callback : btn => {
                        if (btn === 'ok') {
                            parent.scrollTo(firstInvalidField.el.dom.offsetLeft, firstInvalidField.el.dom.offsetTop, true);
                        }
                    }
                });
            }
        },

        getFormValues() {
            let fields = this.getForm().getFields(),
                values = [],
                replaceNameWith = 'fieldId';

            fields.each((field) => {
                let name;

                if (field.xtype === 'criterion_signature_pad') {
                    name = field.formField.getId();
                } else {
                    name = field[replaceNameWith] ? field[replaceNameWith] : field.getName();
                }

                if (field.fileInputEl) {
                    values.push({
                        name : name,
                        value : !field.tmpFile && field.fileInputEl.el.dom.files[0] || field.tmpFile || ''
                    });
                } else {
                    values.push({
                        name : name,
                        value : field.getSubmitValue ? field.getSubmitValue() : field.getValue()
                    });
                }
            });

            return values;
        },

        setFormValues(values) {
            let fields = this.getForm().getFields(),
                map = Ext.Array.toValueMap(values, 'name'),
                replaceNameWith = 'fieldId';

            fields.each((field) => {
                let name;

                if (field.xtype === 'criterion_signature_pad') {
                    name = field.formField.getId();
                } else {
                    name = field[replaceNameWith] ? field[replaceNameWith] : field.getName();
                }

                if (!map[name]) {
                    return;
                }

                if (field.fileInputEl) {
                    let file = map[name]['value'];

                    if (file) {
                        field.tmpFile = file;
                        field.setRawValue(file.name);
                    }
                } else {
                    Ext.isFunction(field.setValue) && field.setValue(map[name]['value']);
                }
            });
        },

        add : function() {
            let me = this,
                added = this.callParent(arguments);

            if (Ext.isArray(added) || added.xclass === 'Ext.draw.engine.Canvas') {
                if (added.xclass === 'Ext.draw.engine.Canvas') {
                    added.el.setZIndex(0);
                }

                return;
            }

            if (!added.formField && added.isFillable) {
                added.formField = Ext.create('criterion.model.webForm.Field', {
                    webformId : record.getId(),
                    webformDataTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', added.dataType, criterion.consts.Dict.WEBFORM_DATA_TYPE).getId()
                });
            }

            if (!added.rendered) {
                added.on('render', me.processField, this);
            } else {
                me.processField(added);
            }

            return added;
        },

        processField : function(field) {
            if (Ext.isNumeric(field.lateX) && Ext.isNumeric(field.lateY)) {
                field.setLocalXY(field.lateX, field.lateY);

                field.lateX = null;
                field.lateY = null;

                if (field.isHidden()) {
                    field.show();
                }
            }
        }
    }
});
