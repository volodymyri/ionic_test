Ext.define('criterion.model.webForm.FillableForm', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Form',

        requires : [
            'criterion.model.webForm.FillableField',
            'criterion.model.webForm.Annotation'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_DOCUMENT_WEBFORM_FIELDS
        },

        hasMany : [
            {
                model : 'criterion.model.webForm.FillableField',
                name : 'formFields',
                associationKey : 'formFields'
            },
            {
                model : 'criterion.model.webForm.Annotation',
                name : 'annotations',
                associationKey : 'annotations'
            }
        ]
    };
});
