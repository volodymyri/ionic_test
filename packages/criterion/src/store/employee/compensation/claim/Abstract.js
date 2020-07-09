Ext.define('criterion.store.employee.compensation.claim.Abstract', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        autoSync : false,

        setClaimId : function(entityId) {
            this.each(function(record) {
                record.set('wcClaimId', entityId)
            })
        }
    };

});
