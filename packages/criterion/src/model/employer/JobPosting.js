Ext.define('criterion.model.employer.JobPosting', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.Position',
            'criterion.model.employer.jobPosting.HiringManager'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_JOB_POSTING
        },

        fields : [
            {
                name : 'positionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY],
                allowNull : true
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'salary',
                type : 'string'
            },
            {
                name : 'title',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'requisitionCode',
                type : 'string'
            },
            {
                name : 'location',
                type : 'string'
            },
            {
                name : 'questionSetId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'reviewTemplateId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'hiringManagerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'recruiterId',
                type : 'integer'
            },
            {
                name : 'recruiterFullName',
                type : 'string',
                persist : false
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.JOB_POSTING_STATUS,
                validators : [VALIDATOR.NON_EMPTY],
                allowNull : true
            },
            {
                name : 'status',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
            },
            {
                name : 'openDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'internalOpenDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'daysOpen',
                type : 'integer',
                persist : false
            },
            {
                name : 'positionName',
                convert : function(newValue, model) {
                    let position = model.getData({associated : true}).position;

                    return position ? position['code'] : ''
                },
                persist : false
            },
            {
                name : 'departmentCd',
                convert : function(newValue, model) {
                    let position = model.getData({associated : true}).position;

                    return position ? position['departmentCd'] : null
                },
                persist : false
            },
            {
                name : 'employerWorkLocationId',
                convert : function(newValue, model) {
                    let position = model.getData({associated : true}).position;

                    return position ? position['employerWorkLocationId'] : null
                },
                persist : false
            },
            {
                name : 'jobPostingEmployerLocation',
                convert : function(newValue, model) {
                    let jobPosting = model.getData({associated : true}).jobPosting;

                    return jobPosting ? (jobPosting.position ? jobPosting.position['employerLocationDescription'] : null) : null
                },
                persist : false
            },
            {
                name : 'questionSetId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employmentApplicationWebformId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isShowEaJobPortal',
                type : 'boolean'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Position',
                name : 'position',
                associationKey : 'position'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.jobPosting.HiringManager',
                name : 'hiringManagers',
                associationKey : 'hiringManagers'
            }
        ]
    };
});
