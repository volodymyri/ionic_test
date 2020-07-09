Ext.define('criterion.model.employer.timeOffPlan.type.Active', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_TIME_OFF_PLAN_TYPE_ACTIVE
        },

        fields : [
            {
                name : 'codeTableId',
                type : 'integer'
            },
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'attribute1',
                type : 'string'
            },
            {
                name : 'attribute2',
                type : 'string'
            },
            {
                name : 'attribute3',
                type : 'string'
            },
            {
                name : 'attribute4',
                type : 'string'
            },
            {
                name : 'attribute5',
                type : 'string'
            },
            {
                name : 'isDefault',
                type : 'boolean'
            },
            {
                name : 'isActive',
                type : 'boolean'
            }
        ]
    };
});
