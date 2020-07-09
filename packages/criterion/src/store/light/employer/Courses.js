Ext.define('criterion.store.light.employer.Courses', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_courses_light',

        model : 'criterion.model.light.employer.Course',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };
});
