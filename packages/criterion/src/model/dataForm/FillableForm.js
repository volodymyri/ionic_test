Ext.define('criterion.model.dataForm.FillableForm', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Form',

        requires : [
            'criterion.model.dataForm.FillableField'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_DOCUMENT_DATAFORM_FIELDS
        },

        hasMany : [
            {
                model : 'criterion.model.dataForm.FillableField',
                name : 'formFields',
                associationKey : 'formFields'
            }
        ]
    };
});
