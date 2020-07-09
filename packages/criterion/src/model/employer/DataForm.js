Ext.define('criterion.model.employer.DataForm', function() {

    const API = criterion.consts.Api.API,
          VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.dataForm.Field'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_DATAFORM
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'dataformId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.dataForm.Field',
                name : 'formFields',
                associationKey : 'formFields'
            }
        ]
    };
});
