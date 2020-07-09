Ext.define('criterion.store.geocode.EmployerFixes', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_geocode_employer_fixes',

        model : 'criterion.model.geocode.EmployerFix',
        autoLoad : false,
        autoSync : false
    };
});
