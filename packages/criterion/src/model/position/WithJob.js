Ext.define('criterion.model.position.WithJob', function () {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'code',
                type : 'string'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_POSITION_WITH_JOB
        }
    };
});
