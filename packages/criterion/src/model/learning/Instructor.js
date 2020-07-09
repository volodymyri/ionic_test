Ext.define('criterion.model.learning.Instructor', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'personId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'personName',
                type : 'string',
                persist : false
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'company',
                type : 'string'
            },
            {
                name : 'emailAddress',
                type : 'string'
            },
            {
                name : 'phoneNumber',
                type : 'string'
            },
            {
                name : 'password',
                type : 'string',
                allowNull : true
            },
            {
                name : 'link',
                type : 'string',
                allowNull : true
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.INSTRUCTOR
        }
    };
});
