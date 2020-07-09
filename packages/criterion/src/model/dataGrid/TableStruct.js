// deprecated
Ext.define('criterion.model.dataGrid.TableStruct', function() {
    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.dataGrid.availableTable.Column'
        ],

        proxy : {
            type : 'memory'
        },

        idProperty : 'tableId',

        fields : [
            {
                name : 'tableId',
                type : 'integer'
            },

            {
                name : 'table',
                type : 'string'
            },
            {
                name : 'tableLabel',
                type : 'string'
            },
            {
                name : 'alias',
                type : 'string'
            },
            {
                name : 'isMain',
                type : 'boolean'
            },
            {
                name : 'level',
                type : 'integer'
            },
            {
                name : 'typeJoin',
                type : 'string',
                allowNull : true
            },
            {
                name : 'link',
                type : 'string',
                allowNull : true
            },
            {
                name : 'parentId',
                type : 'integer',
                allowNull : true
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.dataGrid.availableTable.Column',
                name : 'columns',
                associationKey : 'columns'
            }
        ],

        fillColumnsData(tableRec) {
            let columns,
                currColumns = this.columns();

            if (!tableRec || !tableRec.isModel) {
                return false;
            }

            columns = Ext.Array.map(tableRec.columns().getRange(), column => Ext.clone(column.getData()));

            if (columns.length) {
                currColumns.add(columns);
            }

            tableRec.foreignKeys().each(key => {
                let foreignKey = key.get('foreignKey'),
                    recColumn;

                recColumn = currColumns.getById(foreignKey);

                if (recColumn) {
                    recColumn.get('links').push({
                        typeJoin : criterion.Consts.DATA_GRID_JOIN_TYPES.INNER,
                        table : key.get('table'),
                        field : key.get('referenceField'),
                        isLinked : false,
                        isMainTableFK : true
                    });
                }
            });

            return true;
        }
    }
});
