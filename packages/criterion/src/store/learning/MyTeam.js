Ext.define('criterion.store.learning.MyTeam', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_learning_my_team',

        model : 'criterion.model.learning.MyTeam',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_MY_TEAM
        }
    };
});
