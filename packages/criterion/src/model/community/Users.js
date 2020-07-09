Ext.define('criterion.model.community.User', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_USERS
        },

        idProperty : {
            name : 'employeeId',
            type : 'int'
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'personId',
                type : 'integer'
            },
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'middleName',
                type : 'string'
            },
            {
                name : 'personName',
                calculate : function(data) {
                    var middleName = data.middleName;

                    return data.firstName + ' ' + (middleName && middleName + ' ') + data.lastName;
                },
                persist : false
            },
            {
                name : 'shortName',
                calculate : function(data) {
                    return Ext.util.Format.format('{0} {1}', data.firstName, data.lastName)
                },
                persist : false
            },
            {
                name : 'searchName',
                calculate : function(data) {
                    var middleName = data.middleName;

                    return Ext.util.Format.format('{0}.{1} ({2})', data.firstName.toLowerCase(), data.lastName.toLowerCase(), data.personName)
                },
                persist : false
            }
        ]
    };
});
