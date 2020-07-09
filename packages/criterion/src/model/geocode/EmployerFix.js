Ext.define('criterion.model.geocode.EmployerFix', function() {

    const DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.model.geocode.BaseFix',

        proxy : {
            type : 'memory'
        },

        requires : [
            'criterion.model.GeoCode'
        ],

        fields : [
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'code',
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
                name : 'countryCode',
                type : 'criterion_codedatavalue',
                referenceField : 'countryCd',
                dataProperty : 'attribute1'
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
                name : 'currentGeocode',
                type : 'string'
            },
            {
                name : 'currentSchdist',
                type : 'string',
                allowNull : true
            },

            {
                name : 'newgeoCode',
                type : 'string',
                allowNull : true,
                persist : false
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
        ],

        hasMany : [
            {
                model : 'criterion.model.GeoCode',
                name : 'geocodes',
                associationKey : 'geocodes'
            }
        ]
    };
});

