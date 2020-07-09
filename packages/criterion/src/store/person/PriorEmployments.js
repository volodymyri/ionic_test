Ext.define('criterion.store.person.PriorEmployments', function() {

    var API = criterion.consts.Api.API;

    return {
        alternateClassName : [
            'criterion.store.person.PriorEmploymen'
        ],

        alias : 'store.criterion_person_prioremployments',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.person.PriorEmployment',

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_PRIOR_EMPLOYMENT
        }
    };

});