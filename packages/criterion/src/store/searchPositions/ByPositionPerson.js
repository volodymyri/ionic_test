Ext.define('criterion.store.searchPositions.ByPositionPerson', function () {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_searchpositions_bypositionperson',

        extend : 'criterion.data.Store',

        requires : [ 'criterion.data.proxy.Rest' ],

        model : 'criterion.model.searchPositions.ByPositionPerson',
        autoLoad : false,

        remoteFilter : true,

        proxy : {
            type : 'criterion_rest',
            url : API.SEARCH_POSITIONS_BY_POSITION_OR_PERSON
        }
    };

});
