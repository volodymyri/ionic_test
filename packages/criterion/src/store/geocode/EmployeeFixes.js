Ext.define('criterion.store.geocode.EmployeeFixes', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_geocode_employee_fixes',

        model : 'criterion.model.geocode.EmployeeFix',
        autoLoad : false,
        autoSync : false
    };
});
