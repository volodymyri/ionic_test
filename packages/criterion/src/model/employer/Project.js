Ext.define('criterion.model.employer.Project', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.project.CertifiedRate',
            'criterion.model.employer.project.Task'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PROJECT
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employerWorkLocationId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'customValue1',
                type : 'string',
                allowNull : true
            },
            {
                name : 'customValue2',
                type : 'string',
                allowNull : true
            },
            {
                name : 'customValue3',
                type : 'string',
                allowNull : true
            },
            {
                name : 'customValue4',
                type : 'string',
                allowNull : true
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.project.CertifiedRate',
                name : 'certifiedRate',
                associationKey : 'certifiedRate'
            },
            {
                model : 'criterion.model.employer.project.Task',
                name : 'tasks',
                associationKey : 'tasks'
            }
        ]
    };
});
