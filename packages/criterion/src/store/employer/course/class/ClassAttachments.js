Ext.define('criterion.store.employer.course.class.ClassAttachments', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_course_class_attachments',

        model : 'criterion.model.employer.course.class.ClassAttachment',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COURSE_CLASS_ATTACHMENTS
        }
    };
});
