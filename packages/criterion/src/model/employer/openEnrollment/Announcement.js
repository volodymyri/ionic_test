Ext.define('criterion.model.employer.openEnrollment.Announcement', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OPEN_ENROLLMENT_ANNOUNCEMENT
        },

        fields : [
            {
                name : 'openEnrollmentId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'announcement',
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'isProcessed',
                type : 'boolean'
            },
            {
                name : 'announcementDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            }
        ]
    };
});
