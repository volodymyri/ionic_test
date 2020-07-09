Ext.define('criterion.store.workLocation.Areas', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.work_location_areas',

        model : 'criterion.model.workLocation.Area',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.WORK_LOCATION_AREA
        }
    };
});

