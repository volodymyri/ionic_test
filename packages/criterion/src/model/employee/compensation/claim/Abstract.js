Ext.define('criterion.model.employee.compensation.claim.Abstract', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'claimId',
                type : 'int',
                reference : {
                    parent : 'employee.compensation.Claim',
                    inverse : {
                        storeConfig : {
                            type : 'criterion_base'
                        }
                    }
                }
            }
        ]
    };
});