Ext.define('criterion.model.employer.jobPosting.Candidate', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.Candidate',
            'criterion.model.employer.JobPosting',
            'criterion.model.employee.Onboarding'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING_CANDIDATE
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'candidateId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'jobPostingId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'appliedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'coverLetter',
                type : 'string',
                allowNull : true
            },
            {
                name : 'candidateStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.CANDIDATE_STATUS
            },
            {
                name : 'candidateStatus',
                type : 'criterion_codedatavalue',
                referenceField : 'candidateStatusCd'
            },
            {
                name : 'activeStatus',
                type : 'criterion_codedatavalue',
                referenceField : 'candidateStatusCd',
                dataProperty : 'attribute1'
            },
            {
                name : 'hiringManagerView',
                type : 'criterion_codedatavalue',
                referenceField : 'candidateStatusCd',
                dataProperty : 'attribute3'
            },
            {
                name : 'rejectionReasonCd',
                type : 'criterion_codedata',
                codeDataId : DICT.REJECTION_REASON,
                allowNull : true
            },
            {
                name : 'hasAnswers',
                type : 'boolean'
            },
            {
                name : 'publishSiteName',
                type : 'string'
            },
            {
                name : 'jobsApplied',
                type : 'integer'
            },
            {
                name : 'firstName',
                type : 'string',
                convert : function(val, rec) {
                    let candidate = rec.getData({associated : true}).candidate;

                    return candidate ? candidate.firstName : ''
                },
                persist : false
            },
            {
                name : 'lastName',
                type : 'string',
                convert : function(val, rec) {
                    let candidate = rec.getData({associated : true}).candidate;

                    return candidate ? candidate.lastName : ''
                },
                persist : false
            },
            {
                name : 'location',
                convert : function(val, rec) {
                    let jobPosting = rec.getData({associated : true}).jobPosting;

                    return jobPosting ? jobPosting['location'] : null;
                },
                persist : false
            },
            {
                name : 'jobPostingRequisitionCode',
                convert : function(newValue, rec) {
                    let jobPosting = rec.getData({associated : true}).jobPosting;

                    return jobPosting ? jobPosting['requisitionCode'] : null
                },
                persist : false
            },
            {
                name : 'jobPostingTitle',
                convert : function(newValue, rec) {
                    let jobPosting = rec.getData({associated : true}).jobPosting;

                    return jobPosting ? jobPosting['title'] : null
                },
                persist : false
            },
            {
                name : 'jobPostingPositionTitle',
                convert : function(newValue, rec) {
                    let jobPosting = rec.getData({associated : true}).jobPosting;

                    return jobPosting ? (jobPosting.position ? jobPosting.position['title'] : null) : null
                },
                persist : false
            },
            {
                name : 'jobPostingDepartmentCd',
                convert : function(newValue, rec) {
                    let jobPosting = rec.getData({associated : true}).jobPosting;

                    return jobPosting ? (jobPosting.position ? jobPosting.position['departmentCd'] : null) : null
                },
                persist : false
            },
            {
                name : 'jobPostingEmployerLocation',
                convert : function(newValue, rec) {
                    let jobPosting = rec.getData({associated : true}).jobPosting;

                    return jobPosting ? (jobPosting.position ? jobPosting.position['employerLocationDescription'] : null) : null
                },
                persist : false
            },
            {
                name : 'hasResume',
                convert : function(newValue, rec) {
                    let candidate = rec.getData({associated : true}).candidate;

                    return candidate ? candidate['hasResume'] : false
                },
                persist : false
            },
            {
                name : 'hasCoverLetter',
                convert : function(newValue, rec) {
                    let candidate = rec.getData({associated : true}).candidate;

                    return candidate ? candidate['hasCoverLetter'] : false
                },
                persist : false
            },
            {
                name : 'isEmploymentApplicationConfigured',
                type : 'boolean',
                persist : false
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Candidate',
                name : 'candidate',
                associationKey : 'candidate'
            },
            {
                model : 'criterion.model.employer.JobPosting',
                name : 'jobPosting',
                associationKey : 'jobPosting'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.Onboarding',
                name : 'onboarding',
                associationKey : 'onboarding'
            }
        ]
    };
});
