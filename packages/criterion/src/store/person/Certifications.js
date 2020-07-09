Ext.define('criterion.store.person.Certifications', function() {

    return {
        alias : 'store.criterion_person_certifications',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.person.Certification',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PERSON_CERTIFICATION
        }
    };

});
