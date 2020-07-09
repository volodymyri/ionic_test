Ext.define('criterion.model.DataGrid', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DATA_GRID_MEMORIZED
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'options',
                type : 'auto'
            },
            {
                name : 'type',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    let typeNames = {
                            isModule : i18n.gettext('Module'),
                            isForm : i18n.gettext('Form'),
                            isSQL : i18n.gettext('SQL'),
                            isTable : i18n.gettext('Table')
                        },
                        options = data.options,
                        name = '';

                    if (options) {
                        Ext.Object.each(typeNames, (type, val) => {
                            if (options[type]) {
                                name = val;

                                return false;
                            }
                        })
                    }


                    return name;
                }
            }
        ]
    };
});
