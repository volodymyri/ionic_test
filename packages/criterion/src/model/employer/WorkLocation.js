Ext.define('criterion.model.employer.WorkLocation', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.WorkLocation'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_WORK_LOCATION
        },

        fields : [
            {
                name : 'workLocationId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isPrimary',
                type : 'boolean'
            },

            {
                name : 'code',
                type : 'string',
                convert : function(value, record) {
                    var workLocation = record && record.get('workLocation');

                    return workLocation && workLocation.code
                }
            },
            {
                name : 'description',
                type : 'string',
                convert : function(value, record) {
                    var workLocation = record && record.get('workLocation');

                    return value ? value : (workLocation ? workLocation.description : '');
                }
            },
            {
                name : 'geocode',
                type : 'string',
                convert : function(value, record) {
                    var workLocation = record && record.get('workLocation');

                    return workLocation && workLocation.geocode
                }
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.WorkLocation',
                name : 'workLocation',
                associationKey : 'workLocation'
            }
        ]
    };
});
