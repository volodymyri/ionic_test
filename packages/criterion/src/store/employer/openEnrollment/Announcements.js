Ext.define('criterion.store.employer.openEnrollment.Announcements', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_open_enrollment_announcements',

        model : 'criterion.model.employer.openEnrollment.Announcement',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
