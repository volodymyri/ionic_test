Ext.define('criterion.store.geocode.EmployeeAutoFixes', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_geocode_employee_auto_fixes',

        model : 'criterion.model.geocode.EmployeeAutoFix',
        autoLoad : false,
        autoSync : false
    };
});
