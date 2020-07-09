Ext.define('criterion.model.GeoCode', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.GEOCODE_SEARCH
        },

        fields : [
            {
                name : 'geoCode',
                type : 'string'
            },
            {
                name : 'county',
                type : 'string'
            },
            {
                name : 'city',
                type : 'string'
            },
            {
                name : 'schdist',
                type : 'string'
            },
            {
                name : 'schdistName',
                type : 'string'
            },
            {
                name : 'psd',
                type : 'string'
            },

            {
                name : 'geoIdent',
                type : 'string',
                persist : false,
                calculate : data => data.geoCode + '-' + (data.schdist || '')
            },
            {
                name : 'geoName',
                type : 'string',
                persist : false,
                calculate : data => data.geoCode + (data.schdist ? ' / ' + data.schdist + ' (' + data.schdistName + ')' : '')
            }
        ]
    };
});
