Ext.define('criterion.model.employer.jobPosting.HiringManager', function() {

    var DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'jobPostingId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'personId',
                type : 'integer',
                persist : false
            },
            {
                name : 'fullName',
                persist : false
            },
            {
                name : 'positionTitle',
                type : 'string',
                persist : false
            },
            {
                name : 'lastName',
                type : 'string',
                persist : false
            },
            {
                name : 'firstName',
                type : 'string',
                persist : false
            },
            {
                name : 'middleName',
                type : 'string',
                persist : false
            },
            {
                name : 'employeeNumber',
                type : 'string',
                persist : false
            }
        ]
    };
});
