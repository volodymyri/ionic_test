Ext.define('criterion.store.geocode.EmployerAutoFixes', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_geocode_employer_auto_fixes',

        model : 'criterion.model.geocode.EmployerAutoFix',
        autoLoad : false,
        autoSync : false
    };
});
