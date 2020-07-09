Ext.define('criterion.controller.employee.position.FieldValueSelector', function() {

    var DICT = criterion.consts.Dict;
    
    return {
        alias : 'controller.criterion_employee_position_field_value_selector',

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.view.customData.Field'
        ],

        _fieldsMap : null,
        _customFieldsMap : null,

        handleShow : function() {
            var me = this,
                view = this.getView();

            this._fieldsMap = [];
            this._customFieldsMap = {};

            this.lookup('fieldValueItemsContainer').removeAll();
            this.createValueItems();

            view.setLoading(true);

            this.loadingCustomFields().then(function() {
                me.createCustomFieldItems();
                view.setLoading(false);
            });

        },

        loadingCustomFields : function() {
            var vm = this.getViewModel(),
                employerId = vm.get('position.employerId'),
                positionEntryTypeCd = criterion.CodeDataManager.getCodeDetailRecord(
                    'code',
                    criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_POSITION.code,
                    DICT.ENTITY_TYPE
                ).getId(),
                assignmentDetailEntryTypeCd = criterion.CodeDataManager.getCodeDetailRecord(
                    'code',
                    criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_ASSIGNMENT_DETAIL.code,
                    DICT.ENTITY_TYPE
                ).getId();

            return Ext.promise.Promise.all([
                vm.getStore('positionCustomFields').loadWithPromise({
                    params : {
                        employerId : employerId,
                        entityTypeCd : positionEntryTypeCd
                    }
                }),

                vm.getStore('assignmentCustomFields').loadWithPromise({
                    params : {
                        employerId : employerId,
                        entityTypeCd : assignmentDetailEntryTypeCd
                    }
                }),

                vm.getStore('positionCustomFieldValues').loadWithPromise({
                    params : {
                        employerId : employerId,
                        entityTypeCd : positionEntryTypeCd,
                        entityId : vm.get('position.id')
                    }
                }),

                vm.getStore('assignmentCustomFieldValues').loadWithPromise({
                    params : {
                        employerId : employerId,
                        entityTypeCd : assignmentDetailEntryTypeCd,
                        entityId : vm.get('activeDetail.clonedDetailId')
                    }
                })
            ]);
        },

        createCustomFieldItems : function() {
            var me = this,
                fieldValueItemsContainer = this.lookup('fieldValueItemsContainer'),
                vm = this.getViewModel(),
                customFields = [],
                positionCustomFieldValues = vm.getStore('positionCustomFieldValues'),
                assignmentCustomFieldValues = vm.getStore('assignmentCustomFieldValues');

            vm.getStore('positionCustomFields').each(function(positionCustomField) {
                var code = positionCustomField.get('code'),
                    rec;

                if (rec = vm.getStore('assignmentCustomFields').findRecord('code', code, 0, false, false, true)) {
                    customFields.push({
                        positionCustomField : positionCustomField,
                        assignmentCustomField : rec
                    });
                }
            });

            if (customFields.length) {
                fieldValueItemsContainer.add({
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'center'
                    },
                    border : '0 0 1 0',
                    style : {
                        borderColor : '#CCC',
                        borderStyle : 'dotted'
                    },
                    margin : '10 0 10 0',
                    items : [
                        {
                            xtype : 'component',
                            html : i18n.gettext('Custom Fields'),
                            padding : '5 10',
                            cls : 'bold',
                            flex : 1
                        }
                    ]
                });

                Ext.Array.each(customFields, function(customFieldCfg) {
                    var assignmentCustomFieldCfg = customFieldCfg.assignmentCustomField,
                        customFieldId = assignmentCustomFieldCfg.getId(),
                        key = 'customField_' + customFieldId,
                        item,
                        positionCustomFieldValue = positionCustomFieldValues.findRecord('customFieldId', customFieldCfg.positionCustomField.getId(), 0, false, false, true),
                        assignmentCustomFieldValue = assignmentCustomFieldValues.findRecord('customFieldId', customFieldId, 0, false, false, true),
                        oldValueField,
                        newValueField;

                    item = {
                        xtype : 'container',
                        layout : {
                            type : 'hbox',
                            align : 'center'
                        },
                        viewModel : {},
                        margin : '0 0 10 0',
                        items : [
                            {
                                xtype : 'component',
                                html : assignmentCustomFieldCfg.get('label'),
                                padding : '5 10',
                                width : 200
                            },
                            // old
                            {
                                xtype : 'container',
                                flex : 1,
                                layout : {
                                    type : 'hbox',
                                    align : 'center'
                                },
                                items : [
                                    {
                                        xtype : 'checkbox',
                                        value : false,
                                        bind : {
                                            value : '{!' + key + '_new}'
                                        },
                                        listeners : {
                                            change : function(cmp, value) {
                                                vm.set(key + '_new', !value);
                                            }
                                        },
                                        padding : '0 5 0 0'
                                    },
                                    {
                                        xtype : 'criterion_customdata_field',
                                        reference : 'customField_' + key + '_old',
                                        hideLabel : true,
                                        readOnly : true
                                    }
                                ]
                            },
                            // new
                            {
                                xtype : 'container',
                                flex : 1,
                                layout : {
                                    type : 'hbox',
                                    align : 'center'
                                },
                                items : [
                                    {
                                        xtype : 'checkbox',
                                        value : true,
                                        bind : {
                                            value : '{' + key + '_new}'
                                        },
                                        padding : '0 5 0 0'
                                    },
                                    {
                                        xtype : 'criterion_customdata_field',
                                        reference : 'customField_' + key + '_new',
                                        hideLabel : true,
                                        readOnly : true
                                    }
                                ]
                            }
                        ]
                    };

                    me._fieldsMap.push(key);
                    vm.set(key + '_new', true);

                    fieldValueItemsContainer.add(item);

                    oldValueField = me.lookup('customField_' + key + '_old');
                    newValueField = me.lookup('customField_' + key + '_new');

                    newValueField.updateRecord(customFieldCfg.positionCustomField);
                    oldValueField.updateRecord(assignmentCustomFieldCfg);

                    positionCustomFieldValue && newValueField.setValue(positionCustomFieldValue.get('value'));
                    assignmentCustomFieldValue && oldValueField.setValue(assignmentCustomFieldValue.get('value'));

                    me._customFieldsMap[key] = {
                        customFieldId : customFieldId,
                        value : positionCustomFieldValue ? positionCustomFieldValue.get('value') : null
                    }
                });
            }
        },

        createValueItems : function() {
            var me = this,
                fieldValueItemsContainer = this.lookup('fieldValueItemsContainer'),
                vm = this.getViewModel(),
                position = vm.get('position'),
                types = {
                    departmentCd : {
                        fieldLabel : i18n.gettext('Department'),
                        field : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.DEPARTMENT
                        }
                    },
                    costCenterCd : {
                        fieldLabel : i18n.gettext('Cost Center'),
                        field : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.COST_CENTER
                        }
                    },
                    workersCompensationCd : {
                        fieldLabel : i18n.gettext('Workers Compensation'),
                        field : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.WORKERS_COMPENSATION
                        }
                    },
                    isSalary : {
                        fieldLabel : i18n.gettext('Salary'),
                        field : {
                            xtype : 'toggleslidefield'
                        }
                    },
                    payRate : {
                        fieldLabel : i18n.gettext('Pay Rate'),
                        field : {
                            xtype : 'criterion_currencyfield',
                            isRatePrecision : true
                        }
                    },
                    rateUnitCd : {
                        fieldLabel : i18n.gettext('Pay Rate Unit'),
                        field : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.RATE_UNIT
                        }
                    },
                    positionTypeCd : {
                        fieldLabel : i18n.gettext('Type'),
                        field : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.POSITION_TYPE
                        }
                    },
                    averageWeeks : {
                        fieldLabel : i18n.gettext('Weeks per Year'),
                        field : {
                            xtype : 'numberfield'
                        }
                    },
                    averageHours : {
                        fieldLabel : i18n.gettext('Hours per Day'),
                        field : {
                            xtype : 'numberfield'
                        }
                    },
                    averageDays : {
                        fieldLabel : i18n.gettext('Days per Week'),
                        field : {
                            xtype : 'numberfield'
                        }
                    },
                    workPeriodId : {
                        fieldLabel : i18n.gettext('Work Period'),
                        field : {
                            xtype : 'combobox',
                            valueField : 'id',
                            displayField : 'name',
                            queryMode : 'local',
                            bind : {
                                store : '{employerWorkPeriods}'
                            }
                        }
                    },
                    isOfficer : {
                        fieldLabel : i18n.gettext('Officer'),
                        field : {
                            xtype : 'toggleslidefield'
                        }
                    },
                    officerCodeCd : {
                        fieldLabel : i18n.gettext('Officer Code'),
                        field : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.OFFICER_CODE
                        }
                    },
                    isManager : {
                        fieldLabel : i18n.gettext('Manager'),
                        field : {
                            xtype : 'toggleslidefield'
                        }
                    },
                    isHighSalary : {
                        fieldLabel : i18n.gettext('HCE'),
                        field : {
                            xtype : 'toggleslidefield'
                        }
                    },
                    isSeasonal : {
                        fieldLabel : i18n.gettext('Seasonal'),
                        field : {
                            xtype : 'toggleslidefield'
                        }
                    },
                    categoryCd : {
                        fieldLabel : i18n.gettext('Category'),
                        field : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.POSITION_CATEGORY
                        }
                    },
                    eeocCd : {
                        fieldLabel : i18n.gettext('EEO Category'),
                        field : {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.EEOC
                        }
                    },
                    isExempt : {
                        fieldLabel : i18n.gettext('Exempt'),
                        field : {
                            xtype : 'toggleslidefield'
                        }
                    }
                },
                typesInPosition = Ext.Object.getKeys(types);

            Ext.Array.each(Ext.Object.getKeys(position.getData()), function(key) {
                var item,
                    typeCfg,
                    oldValueField,
                    newValueField;

                if (!Ext.Array.contains(typesInPosition, key)) {
                    return;
                }

                me._fieldsMap.push(key);
                typeCfg = types[key];

                oldValueField = Ext.clone(typeCfg.field);
                newValueField = Ext.clone(typeCfg.field);

                if (!oldValueField.bind) {
                    oldValueField.bind = {};
                }
                oldValueField.bind.value = '{activeDetail.' + key + '}';
                oldValueField.readOnly = true;
                oldValueField.padding = '5 20 5 0';
                oldValueField.flex = 1;

                if (!newValueField.bind) {
                    newValueField.bind = {};
                }
                newValueField.bind.value = '{position.' + key + '}';
                newValueField.readOnly = true;
                newValueField.padding = '5 10 5 0';
                newValueField.flex = 1;

                item = {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'center'
                    },
                    viewModel : {},
                    items : [
                        {
                            xtype : 'component',
                            html : typeCfg['fieldLabel'],
                            padding : '5 10',
                            width : 200
                        },
                        // old
                        {
                            xtype : 'container',
                            flex : 1,
                            layout : {
                                type : 'hbox',
                                align : 'center'
                            },
                            items : [
                                {
                                    xtype : 'checkbox',
                                    value : false,
                                    bind : {
                                        value : '{!' + key + '_new}'
                                    },
                                    listeners : {
                                        change : function(cmp, value) {
                                            vm.set(key + '_new', !value);
                                        }
                                    },
                                    padding : '0 5 0 0'
                                },
                                oldValueField
                            ]
                        },
                        // new
                        {
                            xtype : 'container',
                            flex : 1,
                            layout : {
                                type : 'hbox',
                                align : 'center'
                            },
                            items : [
                                {
                                    xtype : 'checkbox',
                                    value : true,
                                    bind : {
                                        value : '{' + key + '_new}'
                                    },
                                    padding : '0 5 0 0'
                                },
                                newValueField
                            ]
                        }
                    ]
                };

                vm.set(key + '_new', true);

                fieldValueItemsContainer.add(item)
            });

        },

        handleCancel : function() {
            this.getView().destroy();
        },

        handleApply : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                res = {
                    fields : [],
                    customFields : []
                };

            Ext.Array.each(this._fieldsMap, function(fieldName) {
                if (vm.get(fieldName + '_new')) {
                    if (/customField_/.test(fieldName)) {
                        res.customFields.push(me._customFieldsMap[fieldName]);
                    } else {
                        res.fields.push(fieldName);
                    }
                }
            });

            view.fireEvent('applyValues', res);
            view.destroy();
        }
    };

});
