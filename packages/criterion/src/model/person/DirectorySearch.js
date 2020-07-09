Ext.define('criterion.model.person.DirectorySearch', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_DIRECTORY_SEARCH
        },

        fields : [
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'email',
                type : 'string'
            },
            {
                name : 'workPhoneInternational',
                type : 'string'
            },
            {
                name : 'homePhoneInternational',
                type : 'string'
            },
            {
                name : 'mobilePhoneInternational',
                type : 'string'
            },
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'workLocation',
                type : 'string'
            }
        ]
    };
});
