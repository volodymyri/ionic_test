Ext.define('criterion.ux.form.ReportParameter', function() {
    var selectedEmployeeName = '';

    return {
        extend : 'Ext.form.FieldContainer',

        alias : 'widget.criterion_report_parameter',

        requires : [
            //Used by Reports Only
            'criterion.store.employee.benefit.Events',
            'criterion.store.light.*'
        ],

        viewModel : {},

        config : {
            parameterRecord : null,
            parentView : null
        },

        layout : 'hbox',

        afterRender : function() {
            this.callParent(arguments);
        },

        updateParameterRecord : function(parameter) {
            var view = this.getParentView(),
                vm = view.getViewModel(),
                intVm = this.getViewModel();

            this.parameter = parameter;

            if (!parameter) {
                return;
            }

            var defaultValue = parameter.get('defaultValue'),
                value = parameter.get('value'),
                initialValue = Ext.isDefined(value) ? value : (Ext.isDefined('defaultValue') ? defaultValue : null),
                hidden = parameter.get('hidden'),
                mandatory = (!hidden) ? parameter.get('mandatory') : false,
                isTransferParameter = parameter.get('isTransferParameter'),
                paramName = isTransferParameter && parameter.get('parameterConfig') || parameter.get('name'),
                field;

            intVm.set('initialValue', initialValue);

            if (parameter.get('hasPredefinedValues')) {
                let store = Ext.create('Ext.data.Store', {
                        fields : ['value']
                    }),
                    orderByParam = parameter.get('orderBy');

                Ext.Array.each(parameter.get('paramValues'), function(paramValue) {
                    store.add({value : paramValue});
                });

                if (orderByParam !== 'NOORDER') {
                    store.sort('value', orderByParam || 'ASC');
                }

                field = {
                    xtype : 'combo',
                    store : store,
                    sortByDisplayField : false,
                    resetOnDataChanged : true,
                    editable : !mandatory,
                    allowBlank : !mandatory,
                    hidden : hidden,
                    queryMode : 'local',
                    displayField : 'value',
                    valueField : 'value',
                    listeners : {
                        added : function() {
                            this.setValue(initialValue)
                        },
                        change : function(field, newValue) {
                            parameter.set('value', newValue);
                        }
                    }
                }
            } else {
                switch (parameter.get('valueType')) {
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_STRING:
                        if (paramName.indexOf('employee.id') === 0) {
                            var compParam = paramName.split('/'),
                                isSingle = compParam.length > 1 && (compParam[1] === 'single');

                            field = {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                ref : 'employeeSelector',
                                viewModel : {
                                    data : {
                                        selectedEmployees : [],
                                        selectedPersons : []
                                    },
                                    formulas : {
                                        allIfNone : function(get) {
                                            var selectedEmployees = get('selectedEmployees');

                                            if (!selectedEmployees.length && initialValue) {

                                                selectedEmployees = Ext.isArray(initialValue) ? initialValue : [{
                                                    id : initialValue,
                                                    name : parameter.get('textHelper')
                                                }];
                                                this.set('selectedEmployees', selectedEmployees);
                                            }

                                            return !isSingle ?
                                                i18n.gettext('Selected') + ' ' + (selectedEmployees && selectedEmployees.length || i18n.gettext('All')) :
                                                (selectedEmployees && selectedEmployees.length && (selectedEmployees[0].name || selectedEmployeeName) || i18n.gettext('Selected All'))
                                        }
                                    }
                                },

                                listeners : {
                                    employerChanged : function() {
                                        initialValue = [];
                                        selectedEmployeeName = '';

                                        this.getViewModel().set({
                                            selectedEmployees : [],
                                            selectedPersons : []
                                        });

                                        parameter.set('value', null);
                                    }
                                },

                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        readOnly : true,
                                        bind : {
                                            value : '{allIfNone}',
                                            disabled : '{!employerId}'
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        text : i18n.gettext('Clear'),
                                        scale : 'small',
                                        margin : '0 0 0 3',
                                        cls : '',
                                        hidden : true,
                                        bind : {
                                            hidden : '{!selectedEmployees.length}'
                                        },
                                        handler : function() {
                                            initialValue = [];
                                            selectedEmployeeName = '';

                                            this.up().getViewModel().set({
                                                selectedEmployees : [],
                                                selectedPersons : []
                                            });

                                            parameter.set('value', null);
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        scale : 'small',
                                        margin : '0 0 0 3',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        bind : {
                                            //disabled : '{!employerId}'
                                        },
                                        listeners : {
                                            click : function() {
                                                var employees = Ext.create('criterion.store.search.Employees', {
                                                        pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                                                    }),
                                                    vm = this.up().getViewModel(),
                                                    employerId = vm.get('employerId'),
                                                    storeParams = employerId ? {
                                                        employerId : employerId
                                                    } : {},
                                                    selectedPersons = vm.get('selectedPersons'),
                                                    selectEmployeesWindow = !isSingle ? Ext.create('criterion.view.MultiRecordPickerRemote', {
                                                        viewModel : {
                                                            data : {
                                                                title : i18n.gettext('Select Employees'),
                                                                gridColumns : [
                                                                    {
                                                                        xtype : 'gridcolumn',
                                                                        text : i18n.gettext('Employee Number'),
                                                                        dataIndex : 'employeeNumber',
                                                                        flex : 1,
                                                                        filter : 'string'
                                                                    },
                                                                    {
                                                                        xtype : 'gridcolumn',
                                                                        text : i18n.gettext('First Name'),
                                                                        dataIndex : 'firstName',
                                                                        flex : 1,
                                                                        filter : 'string'
                                                                    },
                                                                    {
                                                                        xtype : 'gridcolumn',
                                                                        text : i18n.gettext('Last Name'),
                                                                        dataIndex : 'lastName',
                                                                        flex : 1,
                                                                        filter : 'string'
                                                                    }
                                                                ],
                                                                storeParams : storeParams,
                                                                selectedRecords : selectedPersons,
                                                                excludedIds : []
                                                            },
                                                            stores : {
                                                                inputStore : employees
                                                            }
                                                        }
                                                    }) : Ext.create('criterion.view.employee.EmployeePicker');

                                                if (isSingle) {
                                                    selectEmployeesWindow.on({
                                                        select : function(employee) {
                                                            var selectedEmployees = [],
                                                                employeeId = employee.get('employeeId'),
                                                                name = employee.get('fullName');

                                                            selectedEmployees.push({
                                                                id : employeeId,
                                                                name : name
                                                            });
                                                            vm.set('selectedEmployees', selectedEmployees);
                                                            parameter.set({
                                                                value : employeeId.toString(),
                                                                textHelper : name
                                                            });
                                                            selectedEmployeeName = name;
                                                        },
                                                        destroy : function() {
                                                            view.show();
                                                        }
                                                    });
                                                } else {
                                                    selectEmployeesWindow.on({
                                                        selectRecords : function(records) {
                                                            var selectedEmployees = [],
                                                                selectedPersons = [];
                                                            Ext.Array.each(records, function(record) {
                                                                selectedEmployees.push(
                                                                    record.get('employeeId')
                                                                );
                                                                selectedPersons.push(
                                                                    record.getId()
                                                                )
                                                            });
                                                            vm.set('selectedEmployees', selectedEmployees);
                                                            vm.set('selectedPersons', selectedPersons);
                                                            parameter.set('value', selectedEmployees.toString());
                                                            view.show();
                                                        },
                                                        cancel : function() {
                                                            view.show();
                                                        }
                                                    })
                                                }

                                                selectEmployeesWindow.show();
                                                view.hide();
                                            }
                                        }
                                    }
                                ]
                            }
                        } else if (paramName.indexOf('mctd_') === 0) {
                            field = {
                                xtype : 'criterion_code_detail_field_multi_select',
                                codeDataId : paramName.substring(5).toUpperCase(),
                                allowBlank : !mandatory,
                                stacked : false,
                                width : 220,
                                hidden : hidden,
                                listeners : {
                                    change : function(field, newValue) {
                                        parameter.set('value', newValue);
                                    }
                                },
                                flex : 1,
                                value : initialValue
                            }
                        } else if (paramName.indexOf('^') > -1) {
                            var entityParameters = paramName.split('^'),
                                eType = entityParameters && entityParameters[0],
                                entityParent = (entityParameters.length > 1) && entityParameters[1].split('|'),
                                entityParentName = entityParent[0],
                                entityParentParam = (entityParent.length > 1) && entityParent[1],
                                paramStore = !!Ext.ClassManager.getByAlias('store.' + eType + '_light') ?
                                    Ext.createByAlias('store.' + eType + '_light') : Ext.createByAlias('store.' + eType),
                                model = paramStore && paramStore.getModel(),
                                fields = model && model.getFields(),
                                initialValues = initialValue && initialValue.split(','),
                                currentEntityParent = entityParentName && Ext.Array.findBy(vm.get('currentOptions.parameters') || [], function(elem) {
                                    return elem.name === entityParentName
                                }),
                                currentEntityParentValue = currentEntityParent && currentEntityParent.value,
                                labeledFieldDataIndex;

                            if (!paramStore) {
                                field = {
                                    xtype : 'displayfield',
                                    value : eType + ' storage not found.'
                                }
                            } else {
                                var bindName = entityParentParam && entityParentParam || eType,
                                    valuesArray = [], fieldsHaveLabels = false;

                                function hasNameField(element, index, array) {
                                    return (element && element.name == 'name');
                                }

                                function hasDescriptionField(element, index, array) {
                                    return (element && element.name == 'description');
                                }

                                function hasDisplayDataField(element, index, array) {
                                    return (element && element.name == 'displayData');
                                }

                                if (fields.some(element => {
                                    if (!!element['fieldLabel'] && !labeledFieldDataIndex) {
                                        labeledFieldDataIndex = element['name'];
                                    }
                                    return !!element['fieldLabel'];
                                })) {
                                    fieldsHaveLabels = true;
                                }

                                var useNameField = fields.some(hasNameField),
                                    useDescriptionField = fields.some(hasDescriptionField),
                                    useDisplayDataField = fields.some(hasDisplayDataField),
                                    dataIndex = useDisplayDataField && 'displayData' || useNameField && 'name' || useDescriptionField && 'description';

                                field = {
                                    xtype : 'fieldcontainer',
                                    layout : 'hbox',
                                    ref : paramName,
                                    viewModel : {
                                        data : {
                                            selectedData : ''
                                        }
                                    },

                                    items : [
                                        {
                                            xtype : 'textfield',
                                            flex : 1,
                                            readOnly : true,
                                            allowBlank : !mandatory,
                                            bind : {
                                                value : '{selectedData}'
                                            },
                                            triggers : {
                                                clear : {
                                                    type : 'clear',
                                                    cls : 'criterion-clear-trigger',
                                                    handler : function(cmp) {
                                                        parameter.set('value', null);
                                                        cmp.setValue(null);
                                                    },
                                                    hideOnReadOnly : false,
                                                    hideWhenEmpty : true
                                                }
                                            },
                                            listeners : {
                                                change : function(cmp, value) {
                                                    var el = cmp.getEl();

                                                    //Ext.tip.QuickTipManager.unregister() has a bug. Workaround:
                                                    // delete Ext.tip.QuickTipManager.tip.targets[Ext.id(el)];

                                                    Ext.tip.QuickTipManager.unregister(el);

                                                    if (value) {
                                                        var metrics = Ext.util.TextMetrics.measure(el, value);

                                                        if (metrics.width > cmp.getWidth()) {
                                                            Ext.tip.QuickTipManager.register({
                                                                target : el,
                                                                text : value.split(', ').join(', <br/>'),
                                                                enabled : true,
                                                                showDelay : 20,
                                                                trackMouse : true,
                                                                autoShow : true
                                                            })
                                                        }
                                                    }
                                                },
                                                destroy : function(cmp) {
                                                    var el = cmp.getEl();

                                                    Ext.tip.QuickTipManager.unregister(el);
                                                }
                                            }
                                        },
                                        {
                                            xtype : 'button',
                                            scale : 'small',
                                            margin : '0 0 0 3',
                                            cls : 'criterion-btn-light',
                                            glyph : criterion.consts.Glyph['ios7-search'],
                                            listeners : {
                                                click : function() {
                                                    var paramValue = parameter.get('value'),
                                                        selectedRecords = paramValue && paramValue.split(','),
                                                        store = paramStore,
                                                        selectDataWindow = Ext.create('criterion.view.MultiRecordPicker', {
                                                            inputStoreLocalMode : true,
                                                            setRecordsSelected : false,
                                                            canBeUnselectable : false,
                                                            plugins : [
                                                                {
                                                                    ptype : 'criterion_sidebar',
                                                                    modal : true,
                                                                    height : '85%',
                                                                    width : fieldsHaveLabels ? criterion.Consts.UI_DEFAULTS.MODAL_NORMAL_HEIGHT : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                                                                }
                                                            ],
                                                            viewModel : {
                                                                data : {
                                                                    title : i18n.gettext('Select Records'),
                                                                    searchComboSortByDisplayField : false,
                                                                    gridColumns : fieldsHaveLabels ?
                                                                        Ext.Array.map(Ext.Array.filter(fields, filter => {
                                                                            return !!filter['fieldLabel'];
                                                                        }), field => {
                                                                            let isAutoFieldType = (field['type'] === 'auto');

                                                                            if (!labeledFieldDataIndex) {
                                                                                labeledFieldDataIndex = field['name'];
                                                                            }

                                                                            return {
                                                                                xtype : 'gridcolumn',
                                                                                text : field['fieldLabel'],
                                                                                dataIndex : field['name'],
                                                                                flex : isAutoFieldType ? 2 : 1,
                                                                                filter : isAutoFieldType ? 'string' : field['type'],
                                                                                renderer : function(value) {
                                                                                    if (isAutoFieldType && value) {
                                                                                        return value.join(', ');
                                                                                    } else {
                                                                                        return value;
                                                                                    }
                                                                                }
                                                                            };
                                                                        }) :
                                                                        [
                                                                            {
                                                                                xtype : 'gridcolumn',
                                                                                text : i18n.gettext('Data'),
                                                                                dataIndex : dataIndex,
                                                                                flex : 1,
                                                                                filter : 'string'
                                                                            }
                                                                        ],
                                                                    selectedRecords : selectedRecords
                                                                },
                                                                stores : {
                                                                    inputStore : store
                                                                }
                                                            }
                                                        });

                                                    selectDataWindow.show();
                                                    selectDataWindow.on('selectRecords', function(records) {
                                                        var selectedIds = [],
                                                            selectDisplayData = [];

                                                        Ext.Array.each(records, function(record) {
                                                            selectDisplayData.push(
                                                                record.get(dataIndex || labeledFieldDataIndex)
                                                            );
                                                            selectedIds.push(
                                                                record.getId()
                                                            )
                                                        });

                                                        this.up().getViewModel().set('selectedData', selectDisplayData.join(', '));
                                                        parameter.set('value', selectedIds.toString());
                                                    }, this);
                                                    selectDataWindow.on('cancel', function() {
                                                    }, this);
                                                }
                                            }
                                        }
                                    ]
                                };

                                initialValues && initialValues.length && paramStore.on('load', function() {
                                    var cmp = this.down('[ref= ' + paramName + ']');

                                    Ext.Array.each(initialValues, function(val) {
                                        var rec = paramStore.getById((Ext.isString(val) && val.indexOf('-') > -1) ? val : parseInt(val, 10));

                                        if (rec) {
                                            valuesArray.push(rec.get(dataIndex || labeledFieldDataIndex));
                                        }
                                    });

                                    cmp && cmp.getViewModel().set('selectedData', valuesArray.join(', '));
                                }, this, {single : true});

                                if (entityParentName) {
                                    if (!field.bind) {
                                        field.bind = {};
                                    }

                                    vm.bind('{' + entityParentName + '}', function(value) {
                                        if (!currentEntityParentValue || value !== currentEntityParentValue) {
                                            parameter.set('value', null);
                                            this.down('[ref= ' + paramName + ']').getViewModel().set('selectedData', null);
                                        }

                                        if (value) {
                                            paramStore.getProxy().setExtraParam(entityParentName || entityParentParam, value);
                                        } else {
                                            paramStore.getProxy().setExtraParams({});
                                        }

                                        paramStore.load();
                                    }, this);

                                    Ext.defer(() => {
                                        if (!paramStore.isLoaded() && !paramStore.isLoading()) {
                                            paramStore.load();
                                        }
                                    }, 100);
                                } else {
                                    paramStore.load();
                                }
                            }
                        } else {
                            field = {
                                xtype : 'textfield',
                                value : initialValue,
                                allowBlank : !mandatory,
                                hidden : hidden,
                                listeners : {
                                    change : function(field, newValue) {
                                        parameter.set('value', newValue);
                                    }
                                },
                                flex : 1
                            };
                        }
                        break;
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_INTEGER:
                        if (paramName === 'employer.id' || paramName === 'employerId') {
                            var employers = Ext.StoreManager.lookup('Employers'),
                                oneEmployer = employers && (employers.count() == 1);

                            if (oneEmployer) {
                                this.hide();
                            }

                            vm.set('employerId', initialValue ? parseInt(initialValue, 10) : null);

                            field = {
                                xtype : 'criterion_employer_combo',
                                value : parseInt(initialValue, 10),
                                allowBlank : !mandatory,
                                hidden : hidden,
                                autoSetFirst : oneEmployer,
                                excludeForm : isTransferParameter,
                                bind : {
                                    value : '{employerId}'
                                },
                                listeners : {
                                    change : function(field, newValue) {
                                        parameter.set('value', newValue);

                                        var employeeSelector = view.down('[ref=employeeSelector]');
                                        employeeSelector && employeeSelector.fireEvent('employerChanged', newValue);
                                    },
                                    render : function() {
                                        var me = this;

                                        Ext.defer(function() {
                                            me.fireEvent('change', me, me.getValue());
                                        }, 100)
                                    }
                                }
                            }
                        } else if (paramName.indexOf('^') > -1) {
                            var entityParameters = paramName.split('^'),
                                eType = entityParameters && entityParameters[0],
                                entityParent = (entityParameters.length > 1) && entityParameters[1].split('|'),
                                entityParentName = entityParent[0],
                                entityParentParam = (entityParent.length > 1) && entityParent[1],
                                paramStore = Ext.createByAlias('store.' + eType),
                                model = paramStore && paramStore.getModel(),
                                fields = model && model.getFields(),
                                remoteOrderByProp = parameter.get('remoteOrderByProp'),
                                remoteOrderByDir = parameter.get('remoteOrderByDir');

                            if (!paramStore) {
                                field = {
                                    xtype : 'displayfield',
                                    value : eType + ' storage not found.'
                                }
                            } else {
                                var bindName = entityParentParam && entityParentParam || eType;

                                function hasNameField(element, index, array) {
                                    return (element && element.name == 'name');
                                }

                                var useNameField = fields.some(hasNameField);

                                function hasDescriptionField(element, index, array) {
                                    return (element && element.name == 'description');
                                }

                                var useDescriptionField = fields.some(hasDescriptionField);

                                function hasDisplayDataField(element, index, array) {
                                    return (element && element.name == 'displayData');
                                }

                                var useDisplayDataField = fields.some(hasDisplayDataField);

                                if (remoteOrderByProp) {
                                    paramStore.setSorters({
                                        property : remoteOrderByProp,
                                        direction : remoteOrderByDir ? remoteOrderByDir.toUpperCase() : 'ASC'
                                    });

                                    paramStore.setRemoteSort(true);
                                }

                                field = {
                                    xtype : 'combo',
                                    store : paramStore,
                                    resetOnDataChanged : true,
                                    excludeForm : isTransferParameter,
                                    allowBlank : !mandatory,
                                    hidden : hidden,
                                    queryMode : 'local',
                                    value : parseInt(initialValue, 10),
                                    displayField : useDisplayDataField && 'displayData' || useNameField && 'name' || useDescriptionField && 'description',
                                    valueField : 'id',
                                    bind : {
                                        value : '{' + bindName + '}'
                                    },
                                    listeners : {
                                        change : function(field, newValue) {
                                            parameter.set('value', newValue);
                                            vm.set(bindName, newValue);
                                        }
                                    }
                                };

                                if (entityParentName) {
                                    vm.set('disable' + eType, true);
                                    field.bind.disabled = '{disable' + eType + '}';

                                    vm.bind('{' + entityParentName + '}', function(value) {
                                        if (value) {
                                            paramStore.getProxy().setExtraParam(entityParentName || entityParentParam, value);
                                            paramStore.load();
                                            vm.set('disable' + eType, false);
                                        } else {
                                            vm.set('disable' + eType, true);
                                        }
                                    }, this);
                                } else {
                                    paramStore.load();
                                }
                            }
                        } else if (paramName == '_employeeId') {
                            var employeeId = vm.get('employeeId');

                            employeeId && (field = {
                                xtype : 'numberfield',
                                value : parseInt(employeeId),
                                hidden : hidden,
                                listeners : {
                                    afterrender : function(field) {
                                        parameter.set('value', field.getValue());
                                    }
                                }
                            });
                        } else if (paramName.indexOf('ctd_') == 0) {
                            field = {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : paramName.substring(4).toUpperCase(),
                                nullValueText : i18n.gettext('All'),
                                allowBlank : !mandatory,
                                hidden : hidden,
                                listeners : {
                                    change : function(field, newValue) {
                                        parameter.set('value', newValue);
                                    }
                                },
                                flex : 1,
                                value : parseInt(initialValue, 10),
                                bind : {
                                    value : '{initialValue}'
                                }
                            }
                        } else {
                            field = {
                                xtype : 'numberfield',
                                value : parseInt(initialValue, 10),
                                allowBlank : !mandatory,
                                hidden : hidden,
                                allowDecimals : false,
                                listeners : {
                                    change : function(field, newValue) {
                                        parameter.set('value', newValue);
                                    }
                                },
                                flex : 1
                            };
                        }
                        break;
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_DOUBLE:
                        field = {
                            xtype : 'numberfield',
                            value : Ext.Number.parseFloat(initialValue, 10),
                            allowBlank : !mandatory,
                            hidden : hidden,
                            hideTrigger : false,
                            listeners : {
                                change : function(field, newValue) {
                                    parameter.set('value', newValue);
                                }
                            },
                            flex : 1
                        };
                        break;
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_TIMESTAMP:
                        var tsValue = initialValue && new Date(initialValue) || mandatory && new Date() || null,
                            field = {
                                xtype : 'container',
                                layout : 'hbox',
                                flex : 1,
                                items : [
                                    {
                                        xtype : 'datefield',
                                        value : tsValue,
                                        allowBlank : !mandatory,
                                        hidden : hidden,
                                        listeners : {
                                            change : function(field, newValue) {
                                                parameter.set('value', newValue);
                                            }
                                        },
                                        margin : '0 10 0 0',
                                        flex : 2
                                    },
                                    {
                                        xtype : 'timefield',
                                        value : tsValue,
                                        allowBlank : !mandatory,
                                        hidden : hidden,
                                        listeners : {
                                            change : function(field, newValue) {
                                                parameter.set('value', newValue);
                                            }
                                        },
                                        flex : 1
                                    }
                                ]
                            };
                        parameter.set('value', tsValue);
                        break;
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_DATE:
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_LOCAL_DATE:
                        let dateValue = null;

                        if (initialValue) {
                            if ((/^\d{4}\.\d{2}\.\d{2}$/).test(initialValue)) {
                                initialValue = initialValue.replace(/\./g, '-');
                            }
                            dateValue = Ext.isString(initialValue) ? Ext.Date.parse(initialValue, criterion.consts.Api.DATE_FORMAT_ISO) : new Date(initialValue);
                        } else if (mandatory) {
                            dateValue = new Date();
                        }

                        if (paramName.indexOf('/') > -1) {
                            var compParam = paramName.split('/'),
                                isCombo = compParam.length > 1 && compParam[1] === 'select';

                            if (isCombo) {
                                var store = Ext.createByAlias('store.criterion_' + compParam[0].split('.')[0]),
                                    fieldName = compParam[0].split('.')[1];

                                field = {
                                    xtype : 'combo',
                                    store : store,
                                    valueField : fieldName,
                                    displayField : fieldName,
                                    allowBlank : !mandatory,
                                    hidden : hidden,
                                    editable : false,
                                    tpl : Ext.create('Ext.XTemplate',
                                        '<tpl for=".">',
                                        '<div class="x-boundlist-item">{' + fieldName + ':date("m/d/Y")}</div>',
                                        '</tpl>'
                                    ),
                                    displayTpl : Ext.create('Ext.XTemplate',
                                        '<tpl for=".">',
                                        '{' + fieldName + ':date("m/d/Y")}',
                                        '</tpl>'
                                    ),
                                    listeners : {
                                        change : function(field, newValue) {
                                            parameter.set('value', newValue);
                                        }
                                    }
                                }
                            }

                        } else {
                            var valueBind,
                                fieldName;

                            switch (paramName.toLowerCase()) {
                                case 'enddate':
                                case 'end_date':
                                case 'stopdate':
                                case 'periodend':
                                    valueBind = {
                                        disabled : '{disableDates}',
                                        value : '{endDate}',
                                        minValue : '{startDate}'
                                    };
                                    vm.set('endDate', dateValue);
                                    fieldName = 'endDate';
                                    break;
                                case 'begindate':
                                case 'begin_date':
                                case 'startdate':
                                case 'periodstart':
                                    valueBind = {
                                        disabled : '{disableDates}',
                                        value : '{startDate}',
                                        maxValue : '{endDate}'
                                    };
                                    vm.set('startDate', dateValue);
                                    fieldName = 'startDate';
                            }

                            field = {
                                xtype : 'datefield',
                                reference : fieldName,
                                value : dateValue,
                                allowBlank : !mandatory,
                                hidden : hidden,
                                listeners : {
                                    change : function(field, newValue) {
                                        parameter.set('value', newValue);
                                    }
                                },
                                flex : 1,
                                bind : valueBind || {}
                            };
                        }
                        parameter.set('value', dateValue);
                        break;
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_TIME:
                        var timeValue = initialValue && new Date(initialValue) || mandatory && new Date() || null,
                            field = {
                                xtype : 'timefield',
                                sortByDisplayField : false,
                                value : timeValue,
                                allowBlank : !mandatory,
                                hidden : hidden,
                                listeners : {
                                    change : function(field, newValue) {
                                        parameter.set('value', newValue);
                                    }
                                },
                                flex : 1
                            };
                        parameter.set('value', timeValue);
                        break;
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_CD:
                        field = {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : criterion.CodeDataManager.getCodeTableNameById(parameter.get('codeTableId')),
                            value : parseInt(initialValue, 10),
                            allowBlank : !mandatory,
                            hidden : hidden,
                            flex : 1,
                            listeners : {
                                change : function(field, newValue) {
                                    parameter.set('value', newValue);
                                }
                            }
                        };
                        break;
                    case criterion.Consts.REPORT_FILTER_TYPE.FILTER_BOOLEAN:
                        var bValue = Ext.isBoolean(initialValue) ? initialValue : (initialValue == 'true' ? true : false);

                        field = {
                            xtype : 'checkbox',
                            value : bValue,
                            allowBlank : !mandatory,
                            hidden : hidden,
                            listeners : {
                                change : function(field, newValue) {
                                    parameter.set('value', newValue);
                                }
                            }
                        };
                        break;
                    //case criterion.Consts.REPORT_FILTER_TYPE.FILTER_LIST:
                    //    if (filter.get('fieldName') == 'EmployerID') {
                    //        field = {
                    //            xtype : 'criterion_employer_combo',
                    //            value : value,
                    //            allowBlank : !isStatic,
                    //            listeners : {
                    //                change : function(field, newValue) {
                    //                    filter.set('value', newValue);
                    //                }
                    //            }
                    //        };
                    //    } else {
                    //        throw new Error("Unsupported static filter: " + filter.get('fieldName'))
                    //    }
                    //    break;
                }
            }

            if (this.rendered) {
                this.removeAll();

                this.add(field);
            } else {
                this.items = [field];
            }

        }
    }
});
