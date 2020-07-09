Ext.define('criterion.model.geocode.EmployeeAutoFix', function() {

    const DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
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
                name : 'address1',
                type : 'string'
            },
            {
                name : 'address2',
                type : 'string'
            },
            {
                name : 'city',
                type : 'string'
            },
            {
                type : 'criterion_codedata',
                name : 'stateCd',
                allowNull : true,
                codeDataId : DICT.STATE
            },
            {
                type : 'criterion_codedata',
                name : 'countryCd',
                allowNull : true,
                codeDataId : DICT.COUNTRY
            },
            {
                name : 'postalCode',
                type : 'string'
            },
            {
                name : 'county',
                type : 'string'
            },
            {
                name : 'geocode',
                type : 'string'
            },
            {
                name : 'schdist',
                type : 'string',
                allowNull : true
            }
        ]
    };
});
