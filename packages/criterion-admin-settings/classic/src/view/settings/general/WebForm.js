Ext.define('criterion.view.settings.general.WebForm', function() {

    const dataTypes = criterion.Consts.WEBFORM_DATA_TYPE,
        PROPERTIES_WIDTH = 240,
        EN = criterion.Consts.LOCALIZATION_LANGUAGE_EN;

    return {

        alias : 'widget.criterion_settings_general_webform',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.general.WebForm',
            'criterion.ux.SignaturePad',
            'Ext.slider.Single',
            'criterion.ux.form.WebForm',
            'criterion.ux.plugin.dd.FieldDragZone',
            'criterion.store.Workflows',
            'criterion.store.EmployeeGroups'
        ],

        controller : {
            type : 'criterion_settings_general_webform',
            externalUpdate : false
        },

        title : i18n.gettext('Form'),

        viewModel : {
            data : {
                activeViewIndex : 0,
                activeField : null,
                activeSprite : null,
                activeSpriteAttr : {
                    lineWidth : null,
                    strokeStyle : null,
                    fillStyle : null,
                    width : null,
                    height : null,
                    radius : null,
                    x : null,
                    y : null
                },
                maxSize : 1,
                fieldPosition : {
                    x : 0,
                    y : 0
                },
                fieldSize : {
                    w : 0,
                    h : 0,
                    minW : 0,
                    minH : 0,
                    maxW : 0,
                    maxH : 0
                },
                radioFieldGroup : '',
                webFormZoom : 100,
                isRequired : false,
                blockedState : true,

                code : null,
                contentToken : null,
                targetField : null,
                validation : null,

                currentPage : 1,
                fontSize : null
            },

            formulas : {
                isPhantom : function(get) {
                    return get('record') ? get('record').phantom : true
                },
                isImage : function(get) {
                    var activeSprite = get('activeSprite');

                    return activeSprite && activeSprite.dataType === criterion.Consts.WEBFORM_DATA_TYPE.IMAGE;
                },

                isDropdown : function(get) {
                    var activeField = get('activeField');

                    return activeField && activeField.isCodeDetail;
                },

                hasActiveItem : function(get) {
                    return !!get('activeField') || !!get('activeSprite')
                },

                isSprite : function(get) {
                    return !!get('activeSprite');
                },

                spriteIsLine : function(get) {
                    var activeSprite = get('activeSprite');

                    return activeSprite && activeSprite.type === 'line';
                },

                maxPropLabel : function(get) {
                    var activeField = get('activeField');

                    if (activeField && activeField.dataType) {
                        var fieldMaxSize = activeField.formField.get('maximumSize');

                        switch (activeField.dataType) {
                            case dataTypes.TEXT:
                                this.set('maxSize', fieldMaxSize || 25);
                                return i18n.gettext('Max Size');
                                break;
                            case dataTypes.NUMBER:
                                this.set('maxSize', fieldMaxSize || 3);
                                return i18n.gettext('Max Size');
                                break;
                            case dataTypes.EMAIL:
                                this.set('maxSize', fieldMaxSize || 20);
                                return i18n.gettext('Max Size');
                                break;
                            case dataTypes.MEMO:
                                this.set('maxSize', fieldMaxSize || 12);
                                return i18n.gettext('Max Lines');
                                break;
                        }
                    }

                    return null;
                },

                changeableFontSize : function(get) {
                    var activeField = get('activeField');

                    if (activeField && activeField.dataType) {
                        return Ext.Array.contains([
                            dataTypes.TEXT,
                            dataTypes.NUMBER,
                            dataTypes.EMAIL,
                            dataTypes.MEMO,
                            dataTypes.DATE,
                            dataTypes.DROPDOWN,
                            dataTypes.ATTACH
                        ], activeField.dataType);
                    } else {
                        return false;
                    }
                },

                hideRequired : function(get) {
                    var activeField = get('activeField');

                    if (!activeField) {
                        return true;
                    } else {
                        return get('isImage') || activeField.dataType === dataTypes.TEXT_BLOCK || activeField.dataType === dataTypes.CHECKBOX;
                    }
                },

                isRect : function(get) {
                    var activeSprite = get('activeSprite');

                    return !!activeSprite && activeSprite.type === 'rect';
                },

                isCircle : function(get) {
                    var activeSprite = get('activeSprite');

                    return !!activeSprite && activeSprite.type === 'circle';
                },

                isRadio : function(get) {
                    var activeField = get('activeField');

                    return activeField && activeField.isRadio;
                },

                responseCd : function(get) {
                    var activeField = get('activeField');

                    return activeField && activeField.formField.get('responseCd');
                },

                showZIndexControls : function(get) {
                    return get('isSprite');
                },

                disableWidthChange : function(get) {
                    var activeField = get('activeField');

                    return activeField && (!activeField.formResizable || !activeField.formResizable.x);
                },

                disableHeightChange : function(get) {
                    var activeField = get('activeField');

                    return activeField && (!activeField.formResizable || !activeField.formResizable.y);
                },

                hasCode : function(get) {
                    var activeField = get('activeField');

                    return activeField &&
                        Ext.Array.contains([
                            dataTypes.TEXT,
                            dataTypes.NUMBER,
                            dataTypes.DATE,
                            dataTypes.CHECKBOX,
                            dataTypes.DROPDOWN,
                            dataTypes.MEMO,
                            dataTypes.EMAIL,
                            dataTypes.RADIO,
                            dataTypes.ATTACH
                        ], activeField.dataType)
                },

                supportsContentToken : function(get) {
                    var activeField = get('activeField');

                    return activeField &&
                        Ext.Array.contains([
                            dataTypes.TEXT,
                            dataTypes.NUMBER,
                            dataTypes.DATE,
                            dataTypes.CHECKBOX,
                            dataTypes.MEMO,
                            dataTypes.EMAIL
                        ], activeField.dataType)
                },

                supportsTargetField : function(get) {
                    var activeField = get('activeField');

                    return activeField &&
                        Ext.Array.contains([
                            dataTypes.TEXT,
                            dataTypes.NUMBER,
                            dataTypes.DATE,
                            dataTypes.CHECKBOX,
                            dataTypes.DROPDOWN,
                            dataTypes.MEMO,
                            dataTypes.EMAIL
                        ], activeField.dataType)
                },
                isSinglePage : {
                    bind : {
                        bindTo : '{record.totalPages}'
                    },
                    get : function(totalPages) {
                        return totalPages === 1;
                    }
                },

                isFirstPage : {
                    bind : {
                        bindTo : '{currentPage}'
                    },
                    get : function(currentPage) {
                        return currentPage === 1;
                    }
                },

                isLastPage : {
                    bind : {
                        bindTo : {
                            currentPage : '{currentPage}',
                            totalPages : '{record.totalPages}'
                        }
                    },
                    get : function(bind) {
                        return bind.currentPage === bind.totalPages;
                    }
                },
                pageStatus : {
                    bind : {
                        bindTo : {
                            currentPage : '{currentPage}',
                            totalPages : '{record.totalPages}'
                        }
                    },
                    get : function(bind) {
                        return i18n.gettext('Page') + ' ' + bind.currentPage + ' / ' + (bind.totalPages || 0);
                    }
                },

                description : {
                    get : function(get) {
                        let code = get('languageField.selection.code') || EN;

                        return get('record.description')[code] || '';
                    },
                    set : function(val) {
                        if (val === '[object Object]') {
                            return;
                        }

                        let code = this.get('languageField.selection.code') || EN,
                            descriptionObj = Ext.clone(this.get('record.description'));

                        descriptionObj[code] = val;

                        this.get('record').set('description', Ext.encode(descriptionObj));
                    }
                }
            },

            stores : {
                workflows : {
                    type : 'criterion_workflows',
                    autoLoad : true,
                    filters : [
                        {
                            property : 'workflowTypeCode',
                            value : criterion.Consts.WORKFLOW_TYPE_CODE.FORM
                        }
                    ]
                },
                employeeGroups : {
                    type : 'criterion_employee_groups',
                    autoLoad : true
                },

                targetFields : {
                    type : 'store',

                    proxy : {
                        type : 'memory'
                    },

                    fields : [
                        {
                            name : 'fieldType',
                            type : 'string'
                        },
                        {
                            name : 'value',
                            type : 'string'
                        },
                        {
                            name : 'selected',
                            type : 'boolean',
                            defaultValue : false
                        }
                    ],

                    data : []
                }
            }
        },

        layout : {
            type : 'card'
        },

        bind : {
            activeItem : '{activeViewIndex}'
        },

        noButtons : true,
        allowNavigate : false,

        header : {
            title : i18n.gettext('Form'),
            padding : '10 10 10 15',
            margin : 0,
            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Assign'),
                    handler : 'handleAssignForm',
                    hidden : true,
                    bind : {
                        hidden : '{isPhantom}'
                    }
                }
            ]
        },

        items : [
            // form data
            {
                xtype : 'container',
                layout : 'hbox',
                reference : 'formSettings',
                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                name : 'name',
                                bind : '{record.name}',
                                allowBlank : false,
                                isWFMainSettings : true
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Type'),
                                codeDataId : criterion.consts.Dict.DOCUMENT_RECORD_TYPE,
                                name : 'documentTypeCd',
                                bind : '{record.documentTypeCd}',
                                allowBlank : false,
                                forceSelection : false,
                                editable : false,
                                isWFMainSettings : true
                            },
                            {
                                xtype : 'combobox',
                                reference : 'workflowField',
                                fieldLabel : i18n.gettext('Workflow'),
                                bind : {
                                    store : '{workflows}',
                                    value : '{record.workflowId}'
                                },
                                forceSelection : true,
                                displayField : 'name',
                                valueField : 'id',
                                editable : true,
                                allowBlank : true,
                                queryMode : 'local',
                                emptyText : i18n.gettext('Not Selected'),
                                isWFMainSettings : true
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Description'),
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        bind : {
                                            value : '{description}'
                                        }
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        reference : 'languageField',
                                        codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                                        valueCode : EN,
                                        width : 120
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                inputValue : true,
                                fieldLabel : i18n.gettext('Share with Employee'),
                                bind : '{record.shareWithEmployee}',
                                isWFMainSettings : true
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Size'),
                                codeDataId : criterion.consts.Dict.PRINT_SIZE,
                                name : 'printSizeCd',
                                reference : 'printSizeCd',
                                bind : '{record.printSizeCd}',
                                allowBlank : false,
                                forceSelection : false,
                                editable : false,
                                listeners : {
                                    change : 'handlePrintSizeChange'
                                },
                                isWFMainSettings : true
                            },
                            {
                                xtype : 'tagfield',
                                fieldLabel : i18n.gettext('Initiate by Employee'),
                                bind : {
                                    store : '{employeeGroups}',
                                    value : '{record.initiateByEmployee}'
                                },
                                forceSelection : true,
                                allowBlank : true,
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'name',
                                isWFMainSettings : true
                            }
                        ]
                    }
                ]
            },
            // form creator
            {
                xtype : 'container',
                layout : {
                    type : 'border',
                    regionWeights : {
                        north : 0,
                        center : 0,
                        east : 10,
                        south : 0
                    }
                },
                items : [
                    {
                        xtype : 'panel',

                        reference : 'properties',

                        title : i18n.gettext('Properties'),

                        draggable : true,

                        floating : true,

                        minHeight : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_FIXED_HEIGHT,

                        layout : 'vbox',

                        bodyPadding : 10,

                        scrollable : 'vertical',

                        width : PROPERTIES_WIDTH,

                        hidden : true,

                        x : -PROPERTIES_WIDTH,

                        y : 0,

                        defaults : {
                            labelAlign : 'top',
                            width : 210,
                            defaults : {
                                labelAlign : 'top',
                                width : 100,
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                padding : '0 10 0 0'
                            }
                        },

                        listeners : {
                            hide : function() {
                                var fileField = this.down('[ref=filefield]');

                                fileField.reset();
                                fileField.toggleInvalidCls();
                            }
                        },

                        items : [
                            {
                                layout : 'hbox',

                                items : [
                                    {
                                        xtype : 'button',
                                        text : i18n.gettext('Forward'),
                                        cls : 'criterion-btn-feature',
                                        padding : '5 0',
                                        margin : '0 5 0 0',
                                        scale : 'small',
                                        handler : 'handleForward',
                                        bind : {
                                            hidden : '{!showZIndexControls}'
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        text : i18n.gettext('Backwards'),
                                        cls : 'criterion-btn-feature',
                                        padding : '5 0',
                                        margin : '0 0 0 5',
                                        scale : 'small',
                                        handler : 'handleBackwards',
                                        bind : {
                                            hidden : '{!showZIndexControls}'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Radio Group'),
                                ref : 'radioGroup',
                                bind : {
                                    hidden : '{!isRadio}',
                                    disabled : '{!isRadio}',
                                    value : '{radioFieldGroup}'
                                },
                                allowBlank : false,
                                name : 'groupName',
                                listeners : {
                                    change : 'handleFormFieldPropertyChange'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Table Name'),
                                store : criterion.CodeDataManager.getCodeTablesStore(),
                                reference : 'codeDetail',
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'description',
                                bind : {
                                    hidden : '{!isDropdown}',
                                    value : '{responseCd}'
                                },
                                listeners : {
                                    change : 'handleChangeTable'
                                },
                                editable : false,
                                allowBlank : false
                            },
                            {
                                xtype : 'filefield',
                                fieldLabel : i18n.gettext('File'),
                                readOnly : false,
                                ref : 'filefield',
                                buttonText : i18n.gettext('Browse'),
                                emptyText : i18n.gettext('Drop File here or browse'),
                                buttonOnly : false,
                                file : null,
                                bind : {
                                    hidden : '{!isImage}'
                                },
                                listeners : {
                                    change : 'handleSelectFile'
                                }
                            },
                            {

                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Font Size'),
                                ref : 'fontSizeProp',
                                checkChangeBuffer : 200,
                                spinUpEnabled : true,
                                spinDownEnabled : true,
                                minValue : criterion.Consts.WEBFORM_FIELD_STYLE.MIN_FONT_SIZE,
                                listeners : {
                                    change : 'handleFontSizePropChange'
                                },
                                hidden : true,
                                bind : {
                                    value : '{fontSize}',
                                    hidden : '{!changeableFontSize}'
                                }
                            },
                            {

                                xtype : 'numberfield',
                                ref : 'maxProp',
                                checkChangeBuffer : 200,
                                spinUpEnabled : true,
                                spinDownEnabled : true,
                                minValue : 1,
                                listeners : {
                                    change : 'handleMaxPropChange'
                                },
                                bind : {
                                    value : '{maxSize}',
                                    hidden : '{!maxPropLabel}',
                                    fieldLabel : '{maxPropLabel}',
                                    disabled : '{activeField.dataType === "' + dataTypes.MEMO + '"}'
                                }
                            },
                            {
                                xtype : 'sliderfield',
                                fieldLabel : i18n.gettext('Line Width'),
                                increment : 1,
                                minValue : 1,
                                maxValue : 20,
                                tipText : function(thumb) {
                                    return Ext.String.format('{0}px', thumb.value);
                                },
                                hidden : true,
                                listeners : {
                                    change : 'handleLineWidthChange'
                                },
                                bind : {
                                    value : '{activeSpriteAttr.lineWidth}',
                                    hidden : '{isImage || !isSprite}'
                                }
                            },
                            {
                                layout : 'hbox',

                                hidden : true,

                                bind : {
                                    hidden : '{isImage || !isSprite}'
                                },

                                items : [
                                    {
                                        xtype : 'colorfield',
                                        fieldLabel : i18n.gettext('Stroke Color'),
                                        listeners : {
                                            change : 'handleStrokeColorChange'
                                        },
                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger-transparent',
                                                handler : 'handleStrokeColorClear'
                                            }
                                        },
                                        format : 'HEX8',
                                        bind : {
                                            value : '{activeSpriteAttr.strokeStyle}'
                                        }
                                    },
                                    {
                                        xtype : 'colorfield',
                                        fieldLabel : i18n.gettext('Fill Color'),
                                        listeners : {
                                            change : 'handleFillColorChange'
                                        },
                                        bind : {
                                            value : '{activeSpriteAttr.fillStyle}',
                                            hidden : '{spriteIsLine}'
                                        },
                                        format : 'HEX8',
                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger-transparent',
                                                handler : 'handleFillColorClear'
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('X-position'),
                                        ref : 'xPosition',
                                        checkChangeBuffer : 200,
                                        spinUpEnabled : true,
                                        spinDownEnabled : true,
                                        minValue : 0,
                                        listeners : {
                                            change : 'handleXChange'
                                        },
                                        bind : {
                                            value : '{fieldPosition.x}',
                                            hidden : '{!activeField}'
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Y-position'),
                                        ref : 'yPosition',
                                        checkChangeBuffer : 200,
                                        spinUpEnabled : true,
                                        spinDownEnabled : true,
                                        minValue : 0,
                                        listeners : {
                                            change : 'handleYChange'
                                        },
                                        bind : {
                                            value : '{fieldPosition.y}',
                                            hidden : '{!activeField}'
                                        }
                                    }
                                ]
                            },
                            {
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('X-position'),
                                        checkChangeBuffer : 200,
                                        spinUpEnabled : true,
                                        spinDownEnabled : true,
                                        minValue : 0,
                                        listeners : {
                                            change : 'handleXChange'
                                        },
                                        bind : {
                                            value : '{activeSpriteAttr.x}',
                                            hidden : '{!(isRect || isCircle || isImage)}'
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Y-position'),
                                        checkChangeBuffer : 200,
                                        spinUpEnabled : true,
                                        spinDownEnabled : true,
                                        minValue : 0,
                                        listeners : {
                                            change : 'handleYChange'
                                        },
                                        bind : {
                                            value : '{activeSpriteAttr.y}',
                                            hidden : '{!(isRect || isCircle || isImage)}'
                                        }
                                    }
                                ]
                            },
                            {
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Width'),
                                        reference : 'fieldWidth',
                                        checkChangeBuffer : 200,
                                        spinUpEnabled : true,
                                        spinDownEnabled : true,
                                        minValue : 0,
                                        listeners : {
                                            change : 'handleWidthChange'
                                        },
                                        bind : {
                                            value : '{fieldSize.w}',
                                            minValue : '{fieldSize.minW}',
                                            maxValue : '{fieldSize.maxW}',
                                            hidden : '{!activeField}',
                                            disabled : '{disableWidthChange}'
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Height'),
                                        reference : 'fieldHeight',
                                        checkChangeBuffer : 200,
                                        spinUpEnabled : true,
                                        spinDownEnabled : true,
                                        minValue : 0,
                                        listeners : {
                                            change : 'handleHeightChange'
                                        },
                                        bind : {
                                            value : '{fieldSize.h}',
                                            minValue : '{fieldSize.minH}',
                                            maxValue : '{fieldSize.maxH}',
                                            hidden : '{!activeField}',
                                            disabled : '{disableHeightChange}'
                                        }
                                    }
                                ]
                            },
                            {
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Width'),
                                        checkChangeBuffer : 200,
                                        spinUpEnabled : true,
                                        spinDownEnabled : true,
                                        minValue : 0,
                                        listeners : {
                                            change : 'handleWidthChange'
                                        },
                                        bind : {
                                            value : '{activeSpriteAttr.width}',
                                            minValue : 1,
                                            hidden : '{!(isRect || isImage)}'
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Height'),
                                        checkChangeBuffer : 200,
                                        spinUpEnabled : true,
                                        spinDownEnabled : true,
                                        minValue : 0,
                                        listeners : {
                                            change : 'handleHeightChange'
                                        },
                                        bind : {
                                            value : '{activeSpriteAttr.height}',
                                            minValue : 1,
                                            hidden : '{!(isRect || isImage)}'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Radius'),
                                checkChangeBuffer : 200,
                                spinUpEnabled : true,
                                spinDownEnabled : true,
                                minValue : 0,
                                listeners : {
                                    change : 'handleRadiusChange'
                                },
                                bind : {
                                    value : '{activeSpriteAttr.radius}',
                                    minValue : 1,
                                    hidden : '{!isCircle}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                labelAlign : 'left',
                                fieldLabel : i18n.gettext('Required'),
                                bind : {
                                    value : '{isRequired}',
                                    hidden : '{hideRequired}'
                                },
                                listeners : {
                                    change : 'handleRequiredChange'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Code'),
                                reference : 'codeField',
                                maxLength : 50,
                                bind : {
                                    value : '{code}',
                                    hidden : '{!hasCode}'
                                },
                                name : 'code',
                                listeners : {
                                    change : 'handleFormFieldPropertyChange'
                                },
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Content Token'),
                                maxLength : 128,
                                regex : /^@/,
                                regexText : i18n.gettext('Incorrect syntax. Value should start with "@".'),
                                bind : {
                                    value : '{contentToken}',
                                    hidden : '{!supportsContentToken}'
                                },
                                name : 'contentToken',
                                listeners : {
                                    change : 'handleFormFieldPropertyChange'
                                }
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Target Field'),
                                maxLength : 128,

                                forceSelection : true,

                                bind : {
                                    value : '{targetField}',
                                    hidden : '{!supportsTargetField}',
                                    store : '{targetFields}'
                                },

                                tpl : Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item" <tpl if="selected">hidden</tpl>>{value}</li>',
                                    '</tpl></ul>'
                                ),

                                displayField : 'value',
                                valueField : 'value',
                                queryMode : 'local',

                                name : 'targetField',
                                listeners : {
                                    change : 'handleTargetFieldChange'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Validation'),
                                maxLength : 128,
                                bind : {
                                    value : '{validation}',
                                    hidden : '{!supportsTargetField}'
                                },
                                name : 'validation',
                                listeners : {
                                    change : 'handleFormFieldPropertyChange'
                                }
                            }
                        ]
                    },
                    {
                        region : 'center',
                        layout : 'center',
                        scrollable : true,
                        reference : 'formContainer',
                        padding : 10,
                        bbar : [
                            '->',
                            {
                                xtype : 'sliderfield',
                                reference : 'zoom',
                                fieldLabel : i18n.gettext('Zoom'),
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_NARROW_WIDTH,
                                width : 200,
                                increment : 1,
                                hidden : true,
                                minValue : 100,
                                maxValue : 100,
                                bind : '{webFormZoom}',
                                tipText : function(thumb) {
                                    return Ext.String.format('{0}%', thumb.value);
                                }
                            }
                        ],
                        items : [
                            {
                                xtype : 'criterion_webform',
                                reference : 'webForm',
                                listeners : {
                                    changeActiveField : 'handleChangeActiveField',
                                    changeActiveSprite : 'handleChangeActiveSprite',
                                    deleteActiveField : 'handleDeleteActiveField'
                                },
                                bind : {
                                    zoom : '{webFormZoom}',
                                    currentPage : '{currentPage}',
                                    record : '{record}'
                                }
                            }
                        ]
                    },
                    {
                        region : 'east',

                        reference : 'rightBar',

                        scrollable : 'vertical',

                        layout : 'vbox',

                        width : 70,

                        items : [
                            {
                                xtype : 'container',

                                layout : 'vbox',

                                reference : 'formElements',

                                bodyPadding : 5,

                                plugins : [
                                    'criterion_webform_fielddragzone'
                                ],

                                defaultType : 'button',

                                defaults : {
                                    scale : 'small',
                                    cls : ['criterion-btn-transparent', 'criterion-web-form-tool', 'draggable']
                                },

                                items : [
                                    {
                                        tooltip : i18n.gettext('Back'),
                                        cls : ['criterion-btn-transparent', 'criterion-web-form-tool'],
                                        glyph : criterion.consts.Glyph['mi-reorder'],
                                        handler : 'handleBack'
                                    },
                                    {
                                        tooltip : i18n.gettext('Export'),
                                        cls : ['criterion-btn-transparent', 'criterion-web-form-tool'],
                                        glyph : criterion.consts.Glyph['mi-cloud_upload'],
                                        handler : 'handleWebFormExport',
                                        bind : {
                                            disabled : '{isPhantom}'
                                        }
                                    },
                                    {
                                        tooltip : i18n.gettext('Add Page'),
                                        cls : ['criterion-btn-transparent', 'criterion-web-form-tool'],
                                        glyph : criterion.consts.Glyph['mi-add_circle_outline'],
                                        handler : 'handleAddPage'
                                    },
                                    {
                                        tooltip : i18n.gettext('Delete Page'),
                                        cls : ['criterion-btn-transparent', 'criterion-web-form-tool'],
                                        glyph : criterion.consts.Glyph['mi-remove_circle_outline'],
                                        handler : 'handleDeletePage',
                                        bind : {
                                            disabled : '{isSinglePage}'
                                        }
                                    },
                                    {
                                        xtype : 'component',
                                        autoEl : 'hr',
                                        cls : 'criterion-horizontal-ruler',
                                        margin : '0 10',
                                        width : '100%'
                                    },

                                    {
                                        text : 'abc',
                                        tooltip : i18n.gettext('Text'),
                                        dataType : dataTypes.TEXT,
                                        userCls : 'text'
                                    },
                                    {
                                        text : '123',
                                        tooltip : i18n.gettext('Number'),
                                        dataType : dataTypes.NUMBER,
                                        userCls : 'number'
                                    },
                                    {
                                        tooltip : i18n.gettext('Image'),
                                        dataType : dataTypes.IMAGE,
                                        glyph : criterion.consts.Glyph['mi-image'],
                                        shapeType : 'image'
                                    },
                                    {
                                        tooltip : i18n.gettext('Text Block'),
                                        dataType : dataTypes.TEXT_BLOCK,
                                        glyph : criterion.consts.Glyph['mi-text_fields']
                                    },
                                    {
                                        tooltip : i18n.gettext('Date'),
                                        dataType : dataTypes.DATE,
                                        glyph : criterion.consts.Glyph['mi-date_range']
                                    },
                                    {
                                        tooltip : i18n.gettext('Checkbox'),
                                        dataType : dataTypes.CHECKBOX,
                                        glyph : criterion.consts.Glyph['mi-check_box']
                                    },
                                    {
                                        tooltip : i18n.gettext('Radio'),
                                        dataType : dataTypes.RADIO,
                                        glyph : criterion.consts.Glyph['mi-radio_button_checked']
                                    },
                                    {
                                        tooltip : i18n.gettext('Memo'),
                                        dataType : dataTypes.MEMO,
                                        glyph : criterion.consts.Glyph['mi-create']
                                    },
                                    {
                                        tooltip : i18n.gettext('Dropdown'),
                                        dataType : dataTypes.DROPDOWN,
                                        glyph : criterion.consts.Glyph['mi-keyboard_arrow_down']
                                    },
                                    {
                                        tooltip : i18n.gettext('Signature'),
                                        dataType : dataTypes.SIG,
                                        glyph : criterion.consts.Glyph['mi-check']
                                    },
                                    {
                                        tooltip : i18n.gettext('Email'),
                                        dataType : dataTypes.EMAIL,
                                        glyph : criterion.consts.Glyph['mi-email']
                                    },
                                    {
                                        tooltip : i18n.gettext('Attachment'),
                                        dataType : dataTypes.ATTACH,
                                        glyph : criterion.consts.Glyph['mi-insert_drive_file']
                                    },
                                    {
                                        tooltip : i18n.gettext('Line'),
                                        dataType : dataTypes.SHAPE,
                                        glyph : criterion.consts.Glyph['mi-line_weight'],
                                        shapeType : 'line'
                                    },
                                    {
                                        tooltip : i18n.gettext('Rect'),
                                        dataType : dataTypes.SHAPE,
                                        glyph : criterion.consts.Glyph['mi-crop_din'],
                                        shapeType : 'rect'
                                    },
                                    {
                                        tooltip : i18n.gettext('Circle'),
                                        dataType : dataTypes.SHAPE,
                                        glyph : criterion.consts.Glyph['mi-panorama_fish_eye'],
                                        shapeType : 'circle'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

        buttons : [
            {
                xtype : 'button',
                reference : 'delete',
                text : i18n.gettext('Delete'),
                cls : 'criterion-btn-remove',
                listeners : {
                    click : 'handleDeleteClick'
                },
                hidden : true,
                bind : {
                    disabled : '{disableDelete}',
                    hidden : '{hideDelete}'
                }
            },
            '->',
            {
                xtype : 'container',
                layout : 'hbox',
                defaults : {
                    xtype : 'button'
                },
                bind : {
                    hidden : '{!activeViewIndex}'
                },
                items : [
                    {
                        cls : ['criterion-btn-transparent', 'criterion-web-form-tool'],
                        tooltip : i18n.gettext('Previous Page'),
                        glyph : criterion.consts.Glyph['arrow-left-b'],
                        handler : 'handlePreviousPage',
                        bind : {
                            disabled : '{isFirstPage}'
                        }
                    },
                    {
                        xtype : 'container',
                        margin : '10 0 0 0',
                        bind : {
                            html : '{pageStatus}'
                        }
                    },
                    {
                        cls : ['criterion-btn-transparent', 'criterion-web-form-tool'],
                        tooltip : i18n.gettext('Next Page'),
                        glyph : criterion.consts.Glyph['arrow-right-b'],
                        handler : 'handleNextPage',
                        bind : {
                            disabled : '{isLastPage}'
                        }
                    }
                ]
            },
            '->',
            {
                xtype : 'button',
                reference : 'cancel',
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancelClick'
                },
                hidden : true,
                bind : {
                    text : '{cancelBtnText}',
                    disabled : '{blockedState}',
                    hidden : '{hideCancel}'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Back'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleBack'
                },
                hidden : true,
                bind : {
                    hidden : '{!activeViewIndex}'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Next'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleNext'
                },
                hidden : true,
                bind : {
                    hidden : '{activeViewIndex}'
                }
            },
            {
                xtype : 'button',
                reference : 'submit',
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleSubmitClick'
                },
                hidden : true,
                bind : {
                    disabled : '{disableSave}',
                    text : '{submitBtnText}',
                    hidden : '{hideSave || !activeViewIndex}'
                }
            }
        ]
    };

});
