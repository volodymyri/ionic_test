Ext.define('criterion.model.employer.jobPosting.candidate.interview.Detail', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'jobPostingCandidateInterviewId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'interviewerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },

            {
                name : 'personId',
                type : 'integer',
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
                name : 'employeeNumber',
                type : 'string',
                persist : false
            },
            {
                name : 'positionTitle',
                type : 'string',
                persist : false
            },
            {
                name : 'interviewerName',
                type : 'string',
                persist : false,
                calculate : data => data.firstName + ' ' + data.lastName
            },
            {
                name : 'employeeId',
                type : 'integer',
                persist : false,
                calculate : data => data.interviewerId
            }
        ]
    };
});
