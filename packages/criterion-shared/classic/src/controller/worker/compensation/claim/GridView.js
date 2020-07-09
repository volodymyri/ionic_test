Ext.define('criterion.controller.worker.compensation.claim.GridView', function() {

    return {
        extend: 'criterion.controller.GridView',

        alias : 'controller.criterion_worker_compensation_claim_gridview',

        claim : null,

        getClaimForm : function() {
            var parent;

            parent = this.getView().up('criterion_worker_compensation_claim');

            return parent;
        },

        getClaimId : function() {
            var claimForm = this.getClaimForm(),
                claim = claimForm.getRecord(),
                claimId;

            if (claim && !claim.phantom) {
                claimId = claim.getId();
            }

            return claimId;
        },


        load : function() {
            var claimId = this.getClaimId();

            if (claimId) {
                this.callParent([
                    {
                        params : {
                            wcClaimId : claimId
                        }
                    }
                ]);
            } else {
                this.getView().getStore().removeAll();
            }
        },

        save : function(entityId, callback, scope) {
            var view = this.getView(),
                store = view.getStore();

            store.setClaimId(entityId);

            if (store.getModifiedRecords().length || store.getRemovedRecords().length) {
                store.sync({
                    success : function() {
                        Ext.callback(callback, scope);
                    }
                });
            } else {
                Ext.callback(callback, scope);
            }
        },


        getEmptyRecord : function() {
            var claimId = this.getClaimId(),
                record;

            record = this.callParent(arguments);
            record.wcClaimId = claimId;

            return record;
        },

        handleActivate : Ext.emptyFn
    };

});
