Ext.define('criterion.controller.reports.dataGrid.Editor', function() {

    const API = criterion.consts.Api.API,
        DATA_GRID_TYPES = criterion.Consts.DATA_GRID_TYPES,
        DATA_GRID_FIELD_TYPES = criterion.Consts.DATA_GRID_FIELD_TYPE,
        FORM_INTERNAL_TYPE = criterion.Consts.FORM_INTERNAL_TYPE;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_reports_data_grid_editor',

        requires : [
            'criterion.view.reports.dataGrid.ColumnCriteriaEditor',
            'criterion.model.DataForm',
            'criterion.model.WebForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init : function() {
            // for normal vm set
            this.actLoadDataGrid = Ext.Function.createDelayed(this.actLoadDataGrid, 100, this);

            this.callParent(arguments);
        },

        getRecord() {
            return this.getViewModel().get('record');
        },

        handleRecordLoad(record) {
            let me = this,
                vm = this.getViewModel(),
                forms = vm.getStore('forms'),
                dataforms = vm.get('dataforms'),
                webforms = vm.get('webforms');

            forms.removeAll();

            dataforms.each(dataform => {
                let id = dataform.getId(),
                    type = FORM_INTERNAL_TYPE.DATA;

                forms.add({
                    id : Ext.String.format('{0}-{1}', type, id),
                    type : type,
                    formId : id,
                    name : dataform.get('name')
                })
            });

            webforms.each(webform => {
                let id = webform.getId(),
                    type = FORM_INTERNAL_TYPE.WEB;

                forms.add({
                    id : Ext.String.format('{0}-{1}', type, id),
                    type : type,
                    formId : id,
                    name : webform.get('name')
                })
            });

            Ext.defer(() => {
                me._handleAfterRecordLoad(record);
            }, 100);
        },

        _handleAfterRecordLoad(record) {
            if (record.phantom) {
                record.set('options', {});
                return;
            }

            let me = this,
                vm = this.getViewModel(),
                moduleColumns = vm.getStore('moduleColumns'),
                formsFields = vm.getStore('formsFields'),
                options = record.get('options'),
                parameters = options['parameters'],
                filters = options['filters'],
                orderBy = options['orderBy'],
                isForm = options.isForm,
                isSQL = options.isSQL,
                isTable = options.isTable,
                isModule = options.isModule,
                dataformId = options.dataformId,
                webformId = options.webformId;

            moduleColumns.removeAll();
            formsFields.removeAll();

            vm.set({
                dgOptions : Ext.clone(options),
                dataGridType : Ext.Array.clean([
                    isModule && DATA_GRID_TYPES.MODULES,
                    isTable && DATA_GRID_TYPES.TABLES,
                    isSQL && DATA_GRID_TYPES.SQL,
                    isForm && DATA_GRID_TYPES.FORMS
                ])[0],
                dataViewMode : 1,
                formId : null,
                moduleId : null
            });

            if (isTable) {
                vm.set({
                    tables : options.tables,
                    availableTableNames : options.availableTables || [],
                    dgTableParameters : parameters,
                    dgTableFilters : filters,
                    dgTableOrderBy : orderBy
                });

                me.handleShowDataGrid();
            }

            if (isModule) {
                Ext.Array.each(parameters, (parameter, idx) => {
                    let columnId = parameter['columnId'],
                        columnRecord = moduleColumns.add({
                            columnId : columnId,
                            gridLabel : parameter['gridLabel'],
                            type : parameter['type'],
                            isAggregated : parameter['isAggregated'],
                            position : parameter['position'] || idx
                        })[0],
                        criteria = columnRecord.get('criteria');

                    Ext.Array.each(filters, filter => {
                        if (filter['columnId'] === columnId) {
                            criteria.push(filter);
                        }
                    });

                    Ext.Array.each(orderBy, order => {
                        if (order['columnId'] === columnId) {
                            columnRecord.set('sort', order['dir']);
                        }
                    });
                });

                vm.set({
                    moduleId : options.moduleId
                });

                me.handleShowDataGrid();
            }

            if (isForm) {
                if (dataformId) {
                    criterion.model.DataForm.loadWithPromise(dataformId).then(dataform => {
                        formsFields.loadData(Ext.clone(parameters));

                        Ext.Array.each(filters, filter => {
                            let rec = formsFields.findRecord('columnId', filter['columnId'], 0, false, false, true),
                                criteria;

                            if (rec) {
                                criteria = rec.get('criteria');
                                criteria.push(filter);
                            }
                        });

                        Ext.Array.each(orderBy, order => {
                            let rec = formsFields.findRecord('columnId', order['columnId'], 0, false, false, true);

                            if (rec) {
                                rec.set('sort', order['dir']);
                            }
                        });

                        vm.set({
                            dataform : dataform,
                            formId : Ext.String.format('{0}-{1}', FORM_INTERNAL_TYPE.DATA, dataformId),
                            dataformId : dataformId,
                            webformId : null
                        });

                        me.handleShowDataGrid();
                    });
                } else {
                    criterion.model.WebForm.loadWithPromise(webformId).then(webform => {
                        formsFields.loadData(Ext.clone(parameters));

                        Ext.Array.each(filters, filter => {
                            let rec = formsFields.findRecord('columnId', filter['columnId'], 0, false, false, true),
                                criteria;

                            if (rec) {
                                criteria = rec.get('criteria');
                                criteria.push(filter);
                            }
                        });

                        Ext.Array.each(orderBy, order => {
                            let rec = formsFields.findRecord('columnId', order['columnId'], 0, false, false, true);

                            if (rec) {
                                rec.set('sort', order['dir']);
                            }
                        });

                        vm.set({
                            webform : webform,
                            formId : Ext.String.format('{0}-{1}', FORM_INTERNAL_TYPE.WEB, webformId),
                            dataformId : null,
                            webformId : webformId
                        });

                        me.handleShowDataGrid();
                    });
                }
            }

            if (isSQL) {
                this.lookup('code_editor_field').setStartEditorValue(options.sql);

                me.handleShowDataGrid();
            }
        },

        handleApplyNewTables(view, tables = []) {
            this.getViewModel().set('tables', tables);
        },

        handleSetNewTablesParams(view, data) {
            this.getViewModel().set(data);
        },

        cleanUp() {
            let record = this.getRecord(),
                vm = this.getViewModel(),
                options = vm.get('dgOptions');

            delete options.isModule;
            delete options.isForm;
            delete options.isSQL;
            delete options.isTable;

            if (record && record.phantom) {
                vm.set({
                    moduleId : null,
                    formId : null,

                    tables : [],
                    availableTableNames : [],
                    dgTableParameters : [],
                    dgTableFilters : [],
                    dgTableOrderBy : []
                });

                delete options.dataformId;
                delete options.webformId;
                delete options.moduleId;
                delete options.sql;

                vm.getStore('moduleColumns').removeAll();
                vm.getStore('formsFields').removeAll();

                this.lookup('code_editor_field').setStartEditorValue("");
            }

            vm.set('dgOptions', options);
        },

        handleChangeType(cmp, value) {
            let vm = this.getViewModel(),
                options = vm.get('dgOptions');

            this.cleanUp();

            if (value) {
                switch (value) {
                    case DATA_GRID_TYPES.MODULES:
                        options.isModule = true;

                        break;

                    case DATA_GRID_TYPES.TABLES:
                        options.isTable = true;

                        break;

                    case DATA_GRID_TYPES.SQL:
                        options.isSQL = true;

                        break;

                    case DATA_GRID_TYPES.FORMS:
                        options.isForm = true;

                        break;

                    default:
                        console && console.error('Non correct type value!')
                }
            }
        },

        handleChangeForm(cmp, value) {
            let record = this.getRecord(),
                vm = this.getViewModel(),
                dataforms = vm.get('dataforms'),
                webforms = vm.get('webforms'),
                form = cmp.getSelection();

            if (form) {
                let formId = form.get('formId');

                if (form.get('isWebForm')) {
                    vm.set({
                        webform : webforms.getById(formId),
                        dataform : null,
                        formId : Ext.String.format('{0}-{1}', FORM_INTERNAL_TYPE.WEB, formId)
                    });

                    vm.set('dgOptions.dataformId', null);
                    vm.set('dgOptions.webformId', formId);
                } else {
                    vm.set({
                        webform : null,
                        dataform : dataforms.getById(formId),
                        formId : Ext.String.format('{0}-{1}', FORM_INTERNAL_TYPE.DATA, formId)
                    });

                    vm.set('dgOptions.dataformId', formId);
                    vm.set('dgOptions.webformId', null);
                }

                vm.set('dgOptions.isForm', true);
            }

            if (record.phantom) {
                vm.getStore('formsFields').removeAll();
            }
        },

        handleChangeModule(cmp, value) {
            let record = this.getRecord(),
                vm = this.getViewModel(),
                moduleRecord = cmp.getSelection();

            if (moduleRecord) {
                vm.set('dgOptions.moduleId', value);
                vm.set('moduleRecord', moduleRecord);
            }

            if (record.phantom) {
                vm.getStore('moduleColumns').removeAll();
            }
        },

        handleLoadPreviousPage() {
            let vm = this.getViewModel();

            vm.set('dgPage', vm.get('dgPage') - 1);
            this.actLoadDataGrid();
        },

        handleLoadNextPage() {
            let vm = this.getViewModel();

            vm.set('dgPage', vm.get('dgPage') + 1);
            this.actLoadDataGrid();
        },

        handleChangeDataGridLimit(cmp, val) {
            let vm = this.getViewModel();

            vm.set({
                dgPage : 1,
                dgLimit : val
            });
            this.actLoadDataGrid();
        },

        actLoadDataGrid() {
            let vm = this.getViewModel();

            if (!vm) {
                return;
            }

            switch (vm.get('dataGridType')) {
                case DATA_GRID_TYPES.SQL:
                    this.prepareDataGridSql();
                    break;

                case DATA_GRID_TYPES.FORMS:
                    this.prepareDataGridForm();
                    break;

                case DATA_GRID_TYPES.MODULES:
                    this.prepareDataGridModule();
                    break;

                case DATA_GRID_TYPES.TABLES:
                    this.prepareDataGridTable();
                    break;
            }
        },

        _prepareColumnFieldByType(type, column, field) {
            let resColumn,
                resField;

            switch (type) {
                case DATA_GRID_FIELD_TYPES.STRING:
                case DATA_GRID_FIELD_TYPES.BLOB:
                    resColumn = Ext.merge(column, {
                        xtype : 'gridcolumn',
                        minWidth : 200
                    });
                    resField = Ext.merge(field, {
                        type : 'string',
                        allowNull : true
                    });
                    break;

                case DATA_GRID_FIELD_TYPES.TIME:
                    resColumn = Ext.merge(column, {
                        xtype : 'timecolumn',
                        minWidth : 150
                    });
                    resField = Ext.merge(field, {
                        type : 'date',
                        allowNull : true
                    });
                    break;

                case DATA_GRID_FIELD_TYPES.DATE:
                    resColumn = Ext.merge(column, {
                        xtype : 'datecolumn',
                        minWidth : 150
                    });
                    resField = Ext.merge(field, {
                        type : 'date',
                        dateFormat : criterion.consts.Api.DATE_FORMAT,
                        allowNull : true
                    });
                    break;

                case DATA_GRID_FIELD_TYPES.BOOLEAN:
                    resColumn = Ext.merge(column, {
                        xtype : 'booleancolumn',
                        trueText : '✓',
                        falseText : '',
                        minWidth : 150
                    });
                    resField = Ext.merge(field, {
                        type : 'boolean'
                    });
                    break;

                case DATA_GRID_FIELD_TYPES.DOUBLE:
                    resColumn = Ext.merge(column, {
                        xtype : 'numbercolumn',
                        minWidth : 150
                    });
                    resField = Ext.merge(field, {
                        type : 'number',
                        allowNull : true
                    });
                    break;

                case DATA_GRID_FIELD_TYPES.INTEGER:
                    resColumn = Ext.merge(column, {
                        xtype : 'numbercolumn',
                        format : '0',
                        minWidth : 150
                    });
                    resField = Ext.merge(field, {
                        type : 'integer',
                        allowNull : true
                    });
                    break;

                default:
                    console.warn('[W] Unknown data grid field type: ' + type);

                    resColumn = Ext.merge(column, {
                        xtype : 'gridcolumn',
                        minWidth : 200
                    });
                    resField = Ext.merge(field, {
                        type : 'string',
                        allowNull : true
                    });
                    break;
            }

            return {
                column : resColumn,
                field : resField
            };
        },

        prepareDataGridTable() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                record = this.getRecord(),
                dgTableParameters = vm.get('dgTableParameters'),
                dataGrid = this.lookup('dataGrid'),
                dataGridStore,
                dataGridStoreFields = [],
                dataGridColumns = [],
                options;

            view.setLoading(false);

            Ext.Array.each(Ext.Array.sort(dgTableParameters, (d1, d2) => d1.position > d2.position ? 1 : -1), columnParameter => {
                let columnId = columnParameter['columnId'];

                let {column, field} = me._prepareColumnFieldByType(
                    columnParameter['type'],
                    {
                        text : columnParameter['gridLabel'],
                        dataIndex : columnId,
                        flex : 1,
                        sortable : false,
                        menuDisabled : true,
                        hidden : columnParameter['isHidden']
                    },
                    {
                        name : columnId
                    }
                );

                dataGridColumns.push(column);
                dataGridStoreFields.push(field);
            });

            dataGridStore = Ext.create('Ext.data.Store', {
                fields : dataGridStoreFields
            });

            options = {
                isTable : true,
                tables : vm.get('tables'),
                availableTables : vm.get('availableTableNames'),
                parameters : dgTableParameters,
                filters : vm.get('dgTableFilters'),
                orderBy : vm.get('dgTableOrderBy')
            };

            criterion.Api.requestWithPromise({
                url : API.DATA_GRID_LOAD_TABLES,
                method : 'PUT',
                jsonData : {
                    options : options,
                    page : vm.get('dgPage'),
                    start : vm.get('dgStart'),
                    limit : vm.get('dgLimit')
                },
                rawResponse : true
            }).then(res => {
                let response = JSON.parse(res.responseText);

                record.set('options', options);
                vm.set('dgOptions', options);

                vm.set('dgCount', response.count);

                dataGridStore.add(response.result);
                dataGrid.reconfigure(dataGridStore, dataGridColumns);
                me.afterDGridLoaded();
            }).always(_ => {
                view.setLoading(false);
            });
        },

        prepareDataGridModule() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                record = this.getRecord(),
                moduleColumns = vm.getStore('moduleColumns'),
                dataGrid = this.lookup('dataGrid'),
                dataGridStore,
                dataGridStoreFields = [],
                dataGridColumns = [],
                key = 1,
                parameters = [], filters = [], orderBy = [],
                options;

            moduleColumns.each(columnRecord => {
                let gridLabel = columnRecord.get('gridLabel'),
                    type = columnRecord.get('type'),
                    columnId = columnRecord.getId(),
                    sort = columnRecord.get('sort');

                let {column, field} = this._prepareColumnFieldByType(
                    type,
                    {
                        text : gridLabel,
                        dataIndex : columnId,
                        flex : 1,
                        sortable : false,
                        menuDisabled : true
                    },
                    {
                        name : columnId
                    }
                );

                dataGridColumns.push(column);
                dataGridStoreFields.push(field);

                parameters.push(
                    {
                        columnId : columnId,
                        index : columnRecord.get('index'),
                        type : type,
                        gridLabel : gridLabel,
                        isAggregated : columnRecord.get('isAggregated')
                    }
                );

                Ext.Array.each(columnRecord.get('criteria'), criteria => {
                    filters.push(
                        {
                            columnId : columnId,
                            type : type,
                            operator : criteria['operator'],
                            value : criteria['value']
                        }
                    );
                });

                if (sort) {
                    orderBy.push(
                        {
                            key : key,
                            columnId : columnId,
                            dir : sort.toLowerCase()
                        }
                    );

                    key++;
                }
            });

            dataGridStore = Ext.create('Ext.data.Store', {
                fields : dataGridStoreFields
            });

            options = Ext.apply(vm.get('dgOptions'), {
                parameters : parameters,
                filters : filters,
                orderBy : orderBy
            });

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : API.DATA_GRID_LOAD_MODULE,
                method : 'PUT',
                params : {
                    id : vm.get('moduleId')
                },
                jsonData : {
                    options : options,
                    page : vm.get('dgPage'),
                    start : vm.get('dgStart'),
                    limit : vm.get('dgLimit')
                },
                rawResponse : true
            }).then(res => {
                let response = JSON.parse(res.responseText);

                record.set('options', options);
                vm.set('dgOptions', options);

                vm.set('dgCount', response.count);

                dataGridStore.add(response.result);
                dataGrid.reconfigure(dataGridStore, dataGridColumns);
                me.afterDGridLoaded();
            }).always(() => {
                view.setLoading(false);
            });
        },

        prepareDataGridForm() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                isDataform = !!vm.get('dataform'),
                record = this.getRecord(),
                formsFields = vm.getStore('formsFields'),
                dataGrid = this.lookup('dataGrid'),
                dataGridStore,
                options = Ext.clone(vm.get('dgOptions') || {}),
                key = 1,
                dataGridStoreFields = [
                    {
                        name : 'employeeId',
                        type : 'integer'
                    },
                    {
                        name : 'firstName',
                        type : 'string'
                    },
                    {
                        name : 'lastName',
                        type : 'string'
                    },
                    {
                        name : 'fullName',
                        type : 'string',
                        persist : false,
                        calculate : function(data) {
                            return data.firstName + ' ' + data.lastName;
                        }
                    },
                    {
                        name : 'employeeNumber',
                        type : 'string'
                    },
                    {
                        name : 'location',
                        type : 'string'
                    }
                ],
                dataGridColumns = [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee'),
                        dataIndex : 'fullName',
                        flex : 1,
                        sortable : false,
                        menuDisabled : true,
                        minWidth : 150,
                        draggable : false
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee Number'),
                        dataIndex : 'employeeNumber',
                        flex : 1,
                        sortable : false,
                        menuDisabled : true,
                        minWidth : 180,
                        draggable : false
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Location'),
                        dataIndex : 'location',
                        flex : 1,
                        sortable : false,
                        menuDisabled : true,
                        minWidth : 150,
                        draggable : false
                    }
                ];

            view.setLoading(true);

            options.parameters = [];
            options.filters = [];
            options.orderBy = [];

            if (isDataform) {
                delete options.webformId;
            } else {
                delete options.dataformId;
            }

            formsFields.each(field => {
                let fieldId = field.get('columnId'),
                    fieldName = 'name_' + fieldId,
                    label = field.get('label'),
                    sort = field.get('sort'),
                    parameter = {
                        label : label,
                        columnId : fieldId
                    },
                    orderBy = {};

                dataGridStoreFields.push({
                    name : fieldName,
                    type : 'string'
                });

                dataGridColumns.push({
                    xtype : 'gridcolumn',
                    text : label,
                    dataIndex : fieldName,
                    flex : 1,
                    sortable : false,
                    menuDisabled : true,
                    minWidth : 120
                });

                options.parameters.push(parameter);

                Ext.Array.each(field.get('criteria'), criteria => {
                    options.filters.push({
                        operator : criteria['operator'],
                        value : criteria['value'],
                        columnId : fieldId
                    });
                });

                if (sort) {
                    orderBy['key'] = key++;
                    orderBy['columnId'] = fieldId;
                    orderBy['dir'] = sort.toLowerCase();

                    options.orderBy.push(orderBy);
                }
            });

            dataGridStore = Ext.create('Ext.data.Store', {
                fields : dataGridStoreFields,
                listeners : {
                    endupdate : function() {
                        vm.set('dataGridChanged', !!this.getModifiedRecords().length);
                    }
                }
            });

            record.set('options', options);
            vm.set('dgOptions', options);

            criterion.Api.requestWithPromise({
                url : isDataform ? API.DATA_GRID_LOAD_DATA_FORM : API.DATA_GRID_LOAD_WEB_FORM,
                method : 'PUT',
                jsonData : {
                    options : options,
                    page : vm.get('dgPage'),
                    start : vm.get('dgStart'),
                    limit : vm.get('dgLimit')
                },
                rawResponse : true
            }).then(res => {
                let response = JSON.parse(res.responseText),
                    fieldIdent = 'columnId';

                vm.set('dgCount', response.count);

                Ext.each(response.result, rec => {
                    Ext.each(rec.fields, field => {
                        rec['name_' + field[fieldIdent]] = field.value;
                    });
                });

                dataGridStore.add(response.result);
                dataGrid.reconfigure(dataGridStore, dataGridColumns);
                me.afterDGridLoaded();
            }).always(() => {
                view.setLoading(false);
            });
        },

        prepareDataGridSql() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                sql = vm.get('dgOptions.sql');

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : API.DATA_GRID_LOAD_SQL,
                method : 'PUT',
                jsonData : {
                    sql : sql,
                    page : vm.get('dgPage'),
                    start : vm.get('dgStart'),
                    limit : vm.get('dgLimit')
                },
                rawResponse : true
            }).then(res => {
                let response = JSON.parse(res.responseText);

                vm.set('dgCount', response.count);

                me.createDataGridByRecords(response.columns, response.result);
                me.afterDGridLoaded();
            }).always(() => {
                view.setLoading(false);
            });
        },

        validateSQL(sql) {
            return criterion.Api.requestWithPromise({
                url : API.DATA_GRID_VALIDATE_SQL,
                method : 'PUT',
                jsonData : {
                    sql : sql
                }
            })
        },

        createDataGridByRecords(columnsCfg, records) {
            let vm = this.getViewModel(),
                dataGrid = this.lookup('dataGrid'),
                dataGridStore,
                dataGridStoreFields = [],
                dataGridColumns = [],
                parameters = vm.get('dgOptions.parameters'),
                valueMap = Ext.Array.toValueMap(columnsCfg, 'columnId'),
                present = Ext.Object.getKeys(valueMap),
                stored = Ext.Array.pluck(parameters || [], 'columnId');

            if (
                parameters
                && parameters.length
                && !Ext.Array.difference(present, stored).length
                && !Ext.Array.difference(stored, present).length
            ) {
                // has positions for columns
                Ext.Array.each(Ext.Array.sort(parameters, (d1, d2) => d1.position > d2.position ? 1 : -1), columnParameter => {
                    let columnId = columnParameter['columnId'],
                        columnCfg = valueMap[columnId],
                        type;

                    if (!columnCfg) {
                        return;
                    }

                    type = columnCfg.type;

                    let {column, field} = this._prepareColumnFieldByType(
                        type,
                        {
                            text : columnCfg.gridLabel,
                            dataIndex : columnId,
                            flex : 1,
                            sortable : false,
                            menuDisabled : true,
                            __dg_type : type
                        },
                        {
                            name : columnId
                        }
                    );

                    dataGridColumns.push(column);
                    dataGridStoreFields.push(field);
                });
            } else {
                Ext.Array.each(columnsCfg, columnCfg => {
                    let type = columnCfg.type,
                        columnId = columnCfg.columnId;

                    let {column, field} = this._prepareColumnFieldByType(
                        type,
                        {
                            text : columnCfg.gridLabel,
                            dataIndex : columnId,
                            flex : 1,
                            sortable : false,
                            menuDisabled : true,
                            __dg_type : type
                        },
                        {
                            name : columnId
                        }
                    );

                    dataGridColumns.push(column);
                    dataGridStoreFields.push(field);
                });
            }

            dataGridStore = Ext.create('Ext.data.Store', {
                fields : dataGridStoreFields
            });

            dataGridStore.add(records);
            dataGrid.reconfigure(dataGridStore, dataGridColumns);
        },

        isValid() {
            let vm = this.getViewModel(),
                res = true;

            if (vm.get('dataGridType') === DATA_GRID_TYPES.MODULES) {
                res = !!vm.get('moduleColumns').count() || i18n.gettext('Please select the module and column(s)');
            }

            if (vm.get('dataGridType') === DATA_GRID_TYPES.FORMS) {
                res = !!vm.get('formsFields').count() || i18n.gettext('Please select the form and field(s)');
            }

            if (vm.get('dataGridType') === DATA_GRID_TYPES.TABLES) {
                res = !!vm.get('dgTableParameters').length || i18n.gettext('You should select at least one table and a column in it');
            }

            if (vm.get('dataGridType') === DATA_GRID_TYPES.SQL) {
                res = !!vm.get('dgOptions.sql') || i18n.gettext('Please write SQL request');
            }

            return res;
        },

        afterDGridLoaded() {
            this.fillColumnPositions();
        },

        fillColumnPositions() {
            let vm = this.getViewModel(),
                dataGrid = this.lookup('dataGrid'),
                columns = dataGrid.getColumns(),
                moduleColumns = vm.get('moduleColumns'),
                formsFields = vm.get('formsFields'),
                dgTableParameters = vm.get('dgTableParameters'),
                dataIndexes,
                parameters = [];

            dataIndexes = Ext.Array.map(columns, col => {
                return col['dataIndex'];
            });

            if (vm.get('dataGridType') === DATA_GRID_TYPES.MODULES) {
                moduleColumns.each(moduleColumn => {
                    let columnId = moduleColumn.get('columnId');

                    moduleColumn.set('position', Ext.Array.indexOf(dataIndexes, columnId));
                });

                moduleColumns.each(columnRecord => {
                    parameters.push(
                        {
                            columnId : columnRecord.getId(),
                            index : columnRecord.get('index'),
                            type : columnRecord.get('type'),
                            gridLabel : columnRecord.get('gridLabel'),
                            isAggregated : columnRecord.get('isAggregated'),
                            position : columnRecord.get('position')
                        }
                    );
                });

                vm.get('dgOptions')['parameters'] = parameters;
            }

            if (vm.get('dataGridType') === DATA_GRID_TYPES.FORMS) {
                formsFields.each(field => {
                    let columnId = 'name_' + field.get('columnId');

                    field.set('position', Ext.Array.indexOf(dataIndexes, columnId));
                });

                formsFields.each(field => {
                    parameters.push({
                        label : field.get('label'),
                        columnId : field.get('columnId'),
                        position : field.get('position')
                    })
                });

                vm.get('dgOptions')['parameters'] = parameters;
            }

            if (vm.get('dataGridType') === DATA_GRID_TYPES.TABLES) {
                Ext.Array.each(dgTableParameters, dgTableParameter => {
                    dgTableParameter['position'] = Ext.Array.indexOf(dataIndexes, dgTableParameter['columnId']);
                });
            }

            if (vm.get('dataGridType') === DATA_GRID_TYPES.SQL) {
                let colMap = Ext.Array.toValueMap(columns, 'dataIndex');

                Ext.each(dataIndexes, (columnId, i) => {
                    parameters.push(
                        {
                            columnId,
                            position : i,
                            type : colMap[columnId]['__dg_type']
                        }
                    );
                });

                vm.get('dgOptions')['parameters'] = parameters;
            }
        },

        handleColumnMoving(ct, column, fromIdx, toIdx, eOpts) {
            this.fillColumnPositions();
        },

        handleNext() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                sql = vm.get('dgOptions.sql'),
                valid = this.isValid();

            if (valid !== true) {
                criterion.Utils.toast(valid);
                return;
            }

            vm.set({
                dgCount : 1,
                dgPage : 1
            });

            if (vm.get('dataGridType') === DATA_GRID_TYPES.SQL) {
                view.setLoading(true);

                this.validateSQL(sql).then(() => {
                    me.handleShowDataGrid();
                }).always(() => {
                    view.setLoading(false);
                });

            } else {
                this.handleShowDataGrid();
            }
        },

        handleShowDataGrid() {
            let vm = this.getViewModel();

            this.actLoadDataGrid();

            vm.set('dataViewMode', 1);
        },

        handleEdit() {
            this.lookup('dataGrid').reconfigure(null, []);
            this.getViewModel().set('dataViewMode', 0);
        },

        handleCancel() {
            let me = this,
                view = me.getView(),
                record = this.getViewModel().get('record');

            if (record && !record.phantom) {
                record.reject();
            }

            view.fireEvent('cancel', view, record);

            view.close();
        },

        handleMemorizeDataGrid() {
            let view = this.getView(),
                vm = this.getViewModel(),
                record = this.getRecord();

            record.set('options', vm.get('dgOptions'));

            criterion.Msg.prompt(
                i18n.gettext('Memorize'), i18n.gettext('Data Grid Name'),
                (btn, value) => {
                    if (btn === 'ok') {
                        record.set('name', value);

                        view.setLoading(true);

                        record.saveWithPromise().always(() => {
                            vm.set('isPhantom', record.phantom);
                            view.setLoading(false);
                        });
                    }
                });
        },

        handleSaveMemorized() {
            let view = this.getView(),
                vm = this.getViewModel(),
                record = this.getRecord();

            record.set('options', vm.get('dgOptions'));

            view.setLoading(true);

            record.saveWithPromise().always(() => {
                view.setLoading(false);
            });
        },

        handleDeleteDataGrid() {
            let view = this.getView(),
                record = this.getRecord();

            criterion.Msg.confirm(
                i18n.gettext('Delete DataGrid'),
                Ext.String.format(i18n.gettext('Do you want to delete {0}?'), record.get('name')),
                (btn) => {
                    if (btn === 'yes') {
                        view.setLoading(true);

                        record.eraseWithPromise().then(() => {
                            view.close();
                        }).otherwise(() => {
                            view.setLoading(false);
                        });
                    }
                }
            );
        },

        handleExportToExcel() {
            this.doExport(API.DATA_GRID_TO_EXCEL);
        },

        handleExportToCSV() {
            this.doExport(API.DATA_GRID_TO_CSV);
        },

        doExport(url) {
            let vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                url : url,
                method : 'PUT',
                jsonData : {
                    options : vm.get('dgOptions')
                }
            }).then(result => {
                window.open(criterion.Api.getSecureResourceUrl(
                    Ext.util.Format.format('{0}?fileId={1}', url, result['fileId']))
                );
            });
        }

    }
});
