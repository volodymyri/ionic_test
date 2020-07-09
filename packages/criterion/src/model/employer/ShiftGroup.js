Ext.define('criterion.model.employer.ShiftGroup', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.shiftGroup.Certification',
            'criterion.model.employer.shiftGroup.Position',
            'criterion.model.employer.shiftGroup.Skill',
            'criterion.model.employer.shiftGroup.Shift'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_GROUP
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employerWorkLocationId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'workLocationAreaId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'startingDay',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'requiredNumber',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isRotating',
                type : 'boolean'
            },

            {
                name : 'shiftCount',
                type : 'integer',
                persist : false
            },
            {
                name : 'employerWorkLocation',
                type : 'string',
                persist : false
            },
            {
                name : 'workLocationArea',
                type : 'string',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.shiftGroup.Certification',
                name : 'certifications',
                associationKey : 'certifications'
            },
            {
                model : 'criterion.model.employer.shiftGroup.Position',
                name : 'positions',
                associationKey : 'positions'
            },
            {
                model : 'criterion.model.employer.shiftGroup.Skill',
                name : 'skills',
                associationKey : 'skills'
            },
            {
                model : 'criterion.model.employer.shiftGroup.Shift',
                name : 'shifts',
                associationKey : 'shifts'
            }
        ]
    };
});
