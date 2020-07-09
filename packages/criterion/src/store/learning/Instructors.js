Ext.define('criterion.store.learning.Instructors', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_learning_instructors',

        model : 'criterion.model.learning.Instructor',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.INSTRUCTOR
        }
    }
});
