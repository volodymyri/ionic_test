Ext.define('criterion.store.person.Educations', function() {

    return {
        alias : 'store.criterion_person_educations',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.person.Education',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PERSON_EDUCATION
        }
    };

});
