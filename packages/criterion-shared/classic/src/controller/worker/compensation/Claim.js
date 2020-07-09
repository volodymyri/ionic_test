Ext.define('criterion.controller.worker.compensation.Claim', function() {

    return {
        alias : 'controller.criterion_worker_compensation_claim',

        extend : 'criterion.controller.FormView',

        getCosts : function() {
            return this.lookupReference('costs');
        },

        getDetails : function() {
            return this.lookupReference('details');
        },

        handleAfterRecordLoad : function(record) {
            var me = this;

            this.getCosts().getController().load();
            this.getDetails().getController().load();

            Ext.Function.defer(function() {
                me.lookupReference('natureClaim').setValue(record.get('wcNatureOfInjuryCd'));
            }, 100)
        },

        onAfterSave : function(view, record) {
            var me = this,
                view = this.getView(),
                id = record.getId();

            this.getDetails().getController().save(id, function() {
                this.getCosts().getController().save(id, function() {
                    view.fireEvent('afterSave', view, record);
                    me.close();
                }, this)
            }, this);
        },

        handleAddObject : function(btn) {
            btn.up('tabpanel').getActiveTab().getController().handleAddClick();
        }
    };

});
