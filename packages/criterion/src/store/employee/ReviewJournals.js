Ext.define('criterion.store.employee.ReviewJournals', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_review_journals',

        model : 'criterion.model.employee.ReviewJournal',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
