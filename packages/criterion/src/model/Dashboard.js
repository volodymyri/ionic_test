Ext.define('criterion.model.Dashboard', {

    extend: 'criterion.model.Abstract',

    fields: [
        {
            name: 'viewNumber',
            type: 'int'
        },
        {
            name: 'settings',
            type : 'string' // 'criterion_json' no trigger modification for store
        }
    ],

    proxy : {
        type : 'criterion_rest',
        url : criterion.consts.Api.API.DASHBOARD
    }
});
