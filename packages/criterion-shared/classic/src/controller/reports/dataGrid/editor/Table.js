Ext.define('criterion.controller.reports.dataGrid.editor.Table', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_reports_data_grid_editor_table',

        requires : [
            'criterion.view.reports.dataGrid.ColumnCriteriaEditor',
            'criterion.view.reports.dataGrid.ColumnJoinEditor',
            'criterion.view.MultiRecordPicker',
            'criterion.model.dataGrid.availableTable.Column'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleActivate() {
            let vm = this.getViewModel(),
                tables = vm.get('allTables');

            tables.suspendEvents();
            vm.get('availableTables').cloneToStore(tables);
            tables.resumeEvents(false);
            tables.fireEvent('datachanged', tables);

            if (!vm.get('record.phantom')) {
                this.applyTablesFilter(vm.get('availableTableNames'));
                this.applyTables(vm.get('tables'));
            } else {
                this.applyTablesFilter(null);
            }

            this.lookup('filterField').focus()
        },

        onChangeColumnShow(record) {
            record.set('isShow', !record.get('isShow'));

            this.sync();
        },

        handleAct(grid, td, cellIndex, record, tr, rowIndex, e) {
            let column = e.position && e.position.column,
                dataIndex = column && column.dataIndex,
                xtype = column && e.position.column.xtype,
                target = Ext.get(e.target);

            if (
                !xtype ||
                xtype === 'criterion_actioncolumn' ||
                !dataIndex
            ) {
                return;
            }

            if (
                dataIndex === 'name' &&
                !record.get('leaf') &&
                (target.hasCls('el-table') || target.hasCls('x-tree-node-text'))
            ) {
                this.handleEditColumnsAction(record);
            }

            if (
                record.get('leaf') &&
                (
                    (!record.get('isIDField') && Ext.Array.contains(['criteria', 'sort'], dataIndex))
                    ||
                    (record.get('isIDField') && dataIndex === 'sort')
                )
            ) {
                this.editSortCriteria(record);
            }

            if (
                dataIndex === 'joinedBy' &&
                record.get('leaf') &&
                record.get('isLinkable')
            ) {
                this.editJoin(record);
            }

            if (
                dataIndex === 'isShow' &&
                record.get('leaf')
            ) {
                this.onChangeColumnShow(record);
            }
        },

        editSortCriteria(record) {
            let me = this,
                columnEditor,
                isIDField = record.get('isIDField');

            columnEditor = Ext.create('criterion.view.reports.dataGrid.ColumnCriteriaEditor', {
                viewModel : {
                    data : {
                        columnData : Ext.clone(record.getData()),
                        blockCriteria : isIDField
                    }
                },
                plugins : {
                    ptype : 'criterion_sidebar',
                    modal : true,
                    height : isIDField ? 200 : '85%',
                    width : isIDField ? criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                }
            });

            columnEditor.show();

            Ext.defer(() => me.setCorrectMaskZIndex(true), 10);

            columnEditor.on({
                save : columnData => {
                    record.set(columnData);
                    me.sync();
                },
                close : () => me.setCorrectMaskZIndex(false)
            });
        },

        sync() {
            let vm = this.getViewModel(),
                tablesColumn = vm.get('tablesColumn'),
                key = 1,
                parameters = [],
                filters = [],
                orderBy = [],
                position = 0;

            tablesColumn.getRoot().eachChild(table => {
                if (table.hasChildNodes()) {

                    table.eachChild(column => {
                        let columnId = column.get('columnId'),
                            sort = column.get('sort'),
                            criteria = column.get('criteria');

                        parameters.push({
                            columnId : columnId,
                            gridLabel : column.get('label'),
                            type : column.get('type'),
                            isHidden : !column.get('isShow'),
                            position : position++
                        });

                        if (sort) {
                            orderBy.push({
                                key : 1,
                                columnId : columnId,
                                dir : sort
                            });

                            key++;
                        }

                        if (criteria.length) {
                            Ext.Array.each(criteria, item => {
                                filters.push({
                                    columnId : columnId,
                                    type : column.get('type'),
                                    operator : item.operator,
                                    value : item.value
                                })
                            });
                        }
                    });
                }
            });

            this.fireViewEvent('setNewTablesParams', {
                dgTableParameters : parameters,
                dgTableFilters : filters,
                dgTableOrderBy : orderBy
            });
        },

        syncTables() {
            let vm = this.getViewModel(),
                tables = Ext.clone(vm.get('tables')),
                tablesColumn = vm.get('tablesColumn'),
                struct = {};

            tablesColumn.getRoot().eachChild(table => {
                let tableAlias = table.get('tableAlias');

                struct[tableAlias] = {
                    columnsName : [],
                    columns : {}
                };

                if (table.hasChildNodes()) {
                    table.eachChild(column => {
                        let name = column.get('name');

                        struct[tableAlias]['columnsName'].push(name);
                        struct[tableAlias]['columns'][name] = column.getData();
                    });
                }
            });

            Ext.Array.each(tables, table => {
                let tableAlias = table['tableAlias'],
                    pColumns = table['columns'] || [],
                    pColumnsMap = Ext.Array.toValueMap(pColumns, 'fieldName'),
                    nColumns = [],
                    tStrictColumnsName = struct[tableAlias]['columnsName'],
                    tStrictColumns = struct[tableAlias]['columns'];

                Ext.Array.each(pColumns, present => {
                    if (Ext.Array.contains(tStrictColumnsName, present['fieldName'])) {
                        nColumns.push(present);
                    }
                });

                // added
                Ext.Array.each(tStrictColumnsName, columnName => {
                    if (!pColumnsMap[columnName]) {
                        let colData = tStrictColumns[columnName];

                        nColumns.push({
                            columnId : colData['columnId'],
                            fieldName : colData['name'],
                            type : colData['type'],
                            joinedTo : null
                        });
                    }
                });

                table['columns'] = nColumns;
            });

            this.fireViewEvent('applyNewTables', tables);
        },

        editJoin(record) {
            let me = this,
                vm = this.getViewModel(),
                tablesColumn = vm.get('tablesColumn'),
                columnEditor,
                data = {
                    columnData : Ext.clone(record.getData())
                },
                isLinked = record.get('isLinked'),
                joinedTo = record.get('joinedTo'),
                availableTables = vm.get('availableTables'),
                fieldName = record.get('name'),
                tableNode,
                fkRec;

            if (!isLinked) {
                // find FK for auto join
                fkRec = availableTables.getById(record.get('tableName')).foreignKeys().findRecord('foreignKey', fieldName, 0, false, false, true);

                if (fkRec) {
                    // auto join
                    me.applyJoin(
                        record.get('tableAlias'),
                        fieldName,
                        {
                            typeJoin : criterion.Consts.DATA_GRID_JOIN_TYPES.INNER,
                            table : fkRec.get('table'),
                            field : fkRec.get('referenceField')
                        }
                    );

                    return;
                }
            }

            if (isLinked) {
                tableNode = tablesColumn.getNodeById('table__' + joinedTo['tableAlias']);

                data['table'] = tableNode.get('tableName');
                data['field'] = joinedTo['fieldName'];
                data['typeJoin'] = joinedTo['joinType'];

                data['hash'] = data['table'] + data['field'] + data['typeJoin'];
            }

            columnEditor = Ext.create('criterion.view.reports.dataGrid.ColumnJoinEditor', {
                viewModel : {
                    data : data,
                    stores : {
                        tables : vm.get('availableTables')
                    }
                }
            });

            columnEditor.show();

            Ext.defer(() => me.setCorrectMaskZIndex(true), 10);

            columnEditor.on({
                save : data => {
                    me.applyJoin(record.get('tableAlias'), fieldName, data);
                },
                close : () => me.setCorrectMaskZIndex(false)
            });
        },

        applyJoin(tableAlias, fieldName, data) {
            let me = this,
                view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : API.DATA_GRID_UPDATE_RELATION,
                method : 'PUT',
                jsonData : {
                    dataTables : me.getTablesObject(),
                    newRelation : {
                        'from' : {
                            tableAlias : tableAlias,
                            fieldName : fieldName
                        },
                        'to' : {
                            tableName : data['table'],
                            fieldName : data['field']
                        },
                        'joinType' : data['typeJoin']
                    }
                }
            }).then(function(res) {
                me.applyTablesFilter(res.availableTables);
                me.applyTables(res.tables);
                me.sync();
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleEditColumnsAction(tableNode) {
            let me = this,
                vm = this.getViewModel(),
                columnsEditor,
                tableName = tableNode.get('tableName'),
                availableTables = vm.get('availableTables'),
                excludedIds = [],
                columns = Ext.create('Ext.data.Store', {
                    model : 'criterion.model.dataGrid.availableTable.Column',
                    sorters : [
                        {
                            property : 'name',
                            direction : 'ASC'
                        }
                    ]
                });

            availableTables.getById(tableName).columns().cloneToStore(columns);
            tableNode.eachChild(column => {
                excludedIds.push(column.get('name'));
            });

            columnsEditor = Ext.create('criterion.view.MultiRecordPicker', {
                modal : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 500,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Columns. Table: ') + ' ' + tableName,
                        submitBtnText : i18n.gettext('Done'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'name',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Type'),
                                dataIndex : 'type',
                                width : 150,
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : {},
                        excludedIds : excludedIds
                    },
                    stores : {
                        inputStore : columns
                    }
                },
                allowEmptySelect : true,
                inputStoreLocalMode : true
            });

            columnsEditor.on('selectRecords', records => {
                me.onSelectTableColumns(records, tableNode);
            });
            columnsEditor.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            columnsEditor.show();

            me.setCorrectMaskZIndex(true);
        },

        onSelectTableColumns(records, tableNode) {
            let tableAlias = tableNode.get('tableAlias'),
                tableName = tableNode.get('tableName');

            Ext.Array.each(records, rec => {
                tableNode.appendChild({
                    columnId : Ext.String.format('{0}-{1}', tableAlias, rec.get('name')),
                    tableName : tableName,
                    tableAlias : tableAlias,
                    label : rec.get('label'),
                    name : rec.get('name'),
                    joinedTo : null,
                    type : rec.get('type'),

                    leaf : true,
                    iconCls : 'el-column'
                });
            });

            this.sync();
            this.syncTables();
        },

        handleRemoveAction(record) {
            let me = this,
                view = this.getView(),
                isTable = !record.get('leaf'),
                isLinkedColumn = record.get('isLinked'),
                objName = isTable ? i18n.gettext('table') : (isLinkedColumn ? i18n.gettext('link') : i18n.gettext('column'));

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete'),
                    message : i18n.gettext('Do you want to delete the') + ' ' + objName + '?'
                },
                function(btn) {
                    if (btn === 'yes') {
                        if (isTable) {
                            // table
                            view.setLoading(true);

                            criterion.Api.requestWithPromise({
                                url : API.DATA_GRID_REMOVE_TABLE,
                                method : 'PUT',
                                jsonData : {
                                    dataTables : me.getTablesObject(),
                                    tableAlias : record.get('tableAlias')
                                }
                            }).then(function(res) {
                                me.applyTablesFilter(res.availableTables);
                                me.applyTables(res.tables);
                                me.sync();
                            }).always(function() {
                                view.setLoading(false);
                            });

                        } else if (isLinkedColumn) {
                            // relation column
                            let newRelation = {
                                "from" : {
                                    tableAlias : record.get('tableAlias'),
                                    fieldName : record.get('name')
                                },
                                "to" : null
                            };

                            view.setLoading(true);

                            criterion.Api.requestWithPromise({
                                url : API.DATA_GRID_UPDATE_RELATION,
                                method : 'PUT',
                                jsonData : {
                                    dataTables : me.getTablesObject(),
                                    newRelation : newRelation
                                }
                            }).then(function(res) {
                                me.applyTablesFilter(res.availableTables);
                                me.applyTables(res.tables);
                                me.sync();
                            }).always(function() {
                                view.setLoading(false);
                            });

                        } else {
                            // normal column
                            record.remove();

                            me.sync();
                            me.syncTables();
                        }
                    }
                }
            );
        },

        getTablesObject() {
            return {
                tables : this.getViewModel().get('tables')
            }
        },

        handleAddTable(grid, td, cellIndex, record, tr, rowIndex, e) {
            let cbModelClick = (grid.getSelectionModel() && grid.getSelectionModel().type === 'checkboxmodel' && cellIndex === 0),
                preventEdit = e.position && e.position.column && e.position.column.dataIndex !== 'join';

            if (!preventEdit && !cbModelClick && record) {
                this.addNewTable(record.get('name'));

                return false;
            }
        },

        addNewTable(tableName) {
            let me = this,
                view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : API.DATA_GRID_ADD_TABLE,
                method : 'PUT',
                jsonData : {
                    dataTables : this.getTablesObject(),
                    newTable : tableName
                }
            }).then(function(res) {
                me.applyTablesFilter(res.availableTables);
                me.applyTables(res.tables);
                me.sync();
            }).always(function() {
                view.setLoading(false);
            });
        },

        applyTables(tables = []) {
            let me = this,
                vm = this.getViewModel(),
                tablesColumn = vm.get('tablesColumn');

            this.fireViewEvent('applyNewTables', tables);

            tablesColumn.getRoot().removeAll();

            Ext.each(tables, table => {
                let tableNode,
                    tableName = table['tableName'],
                    tableAlias = table['tableAlias'],
                    name = Ext.String.format('{0}: {1}', i18n.gettext('Table'), tableName);

                tableNode = tablesColumn.getRoot().appendChild({
                    columnId : 'table__' + tableAlias,
                    tableName : tableName,
                    tableAlias : tableAlias,
                    label : name,
                    name : name,
                    joinedBy : table['joinedBy'],

                    leaf : false,
                    expanded : true,
                    iconCls : 'el-table'
                });

                Ext.each(table['columns'], column => {
                    tableNode.appendChild({
                        columnId : column['columnId'],
                        tableName : tableName,
                        tableAlias : tableAlias,
                        label : criterion.Utils.snakeCaseToRegular(column['fieldName']),
                        name : column['fieldName'],
                        joinedTo : column['joinedTo'],
                        type : column['type'],

                        leaf : true,
                        iconCls : 'el-column'
                    });
                });

                me.fillTableColumnsByParameters(tableName, tableAlias);
            });
        },

        fillTableColumnsByParameters(tableName, tableAlias) {
            let vm = this.getViewModel(),
                oDgTableParameters = Ext.Array.toValueMap(vm.get('dgTableParameters'), 'columnId'),
                dgTableFilters = vm.get('dgTableFilters'),
                oDgTableOrderBy = Ext.Array.toValueMap(vm.get('dgTableOrderBy'), 'columnId'),
                availableTables = vm.get('availableTables'),
                tablesColumn = vm.get('tablesColumn'),
                tableNode = tablesColumn.getNodeById('table__' + tableAlias);

            availableTables.getById(tableName).columns().each(column => {
                let name = column.get('name'),
                    columnId = tableAlias + '-' + name,
                    sorter = oDgTableOrderBy[columnId],
                    criteria = [],
                    colColumn = tablesColumn.getNodeById(columnId);

                if (!oDgTableParameters[columnId]) {
                    return;
                }

                if (!colColumn) {
                    colColumn = tableNode.appendChild({
                        columnId : columnId,
                        tableName : tableName,
                        tableAlias : tableAlias,
                        label : column.get('label'),
                        name : name,
                        joinedTo : null,
                        type : column.get('type'),

                        leaf : true,
                        iconCls : 'el-column'
                    });
                }

                // set for stored
                colColumn.set('label', column.get('label'));
                colColumn.set('isShow', !oDgTableParameters[columnId]['isHidden']);

                // filter
                Ext.each(dgTableFilters, filter => {
                    if (filter['columnId'] === columnId) {
                        criteria.push(filter);
                    }
                });
                if (criteria.length) {
                    colColumn.set('criteria', criteria);
                }

                // sort
                if (sorter) {
                    colColumn.set('sort', sorter['dir']);
                }
            });
        },

        applyTablesFilter(availableTableNames) {
            this.getViewModel().set({
                availableTableNames : availableTableNames,
                tableName : '' // clean filter
            });
        }
    };
});
