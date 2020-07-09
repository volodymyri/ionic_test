Ext.define('criterion.store.payroll.batch.TransmissionFiles', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_payroll_transmission_files',

        model : 'criterion.model.payroll.batch.TransmissionFile',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
