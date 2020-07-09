Ext.define('criterion.model.reports.options.AvailableFilter', function() {

    return {
        extend : 'criterion.model.Abstract',

        idProperty : 'alias',

        fields : [
            {
                name : 'alias',
                type : 'string'
            },
            {
                name : 'codeTableId',
                type : 'integer'
            },
            {
                name : 'codeTableName',
                type : 'string'
            },
            {
                name : 'fieldName',
                type : 'string'
            },
            {
                name : 'tableAlias',
                type : 'string'
            },
            {
                name : 'tableName',
                type : 'string'
            },
            {
                name : 'type',
                type : 'string'
            },
            {
                name : 'tableSettings',
                type : 'auto'
            },
            {
                name : 'displayName',
                type : 'string',
                calculate : function(data) {
                    if (!data) {
                        return ''
                    }

                    var tableName = data.tableName,
                        fieldName = data.fieldName;

                    if (data.tableSettings) {
                        var setting = data.tableSettings.find('tableAlias', data.tableAlias);

                        if (setting) {
                            var fields = setting.get('fields');

                            tableName = setting.get('displayName');

                            if (fields) {
                                var field = Ext.Array.findBy(fields, function(field) {
                                    return field.alias === data.alias
                                });

                                if (field) {
                                    fieldName = field.displayName
                                }
                            }
                        }
                    }

                    return tableName + ' ' + fieldName
                }
            }
        ]
    };

});
