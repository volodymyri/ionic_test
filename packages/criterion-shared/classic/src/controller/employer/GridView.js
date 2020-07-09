Ext.define('criterion.controller.employer.GridView', function() {

    return {
        alias : 'controller.criterion_employer_gridview',

        extend : 'criterion.controller.GridView',

        loadRecordOnEdit: false,

        employerId : null,

        getEmployerId : function() {
            return this.employerId;
        },

        /**
         * @param opts
         * @returns {Ext.promise.Deferred.promise}
         */
        load : function(opts = {}) {
            let employerId = this.getEmployerId(),
                view = this.getView(),
                dfd = Ext.create('Ext.Deferred');

            if (employerId && view) {
                let store = view.getStore(),
                    proxy = store ? store.getProxy() : null;

                if (proxy) {
                    // Store can be reloaded directly, for example by paging toolbar, so employerId and other params should be set in the proxy
                    proxy.setExtraParams(Ext.apply({}, opts.params || {}, {
                        employerId : employerId
                    }));
                }

                this.callParent(arguments).then((records) => {
                    dfd.resolve(records);
                });

                this.setEmployerBarDisabled(false);
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        setEmployerBarDisabled : function(disabled) {
            if (this.getView().controlEmployerBar) {
                criterion.Utils.upToNearCmp(this.getView(), 'criterion_settings_employer_bar').setDisabled(disabled);
            }
        },

        startEdit : function() {
            this.setEmployerBarDisabled(true);
            return this.callParent(arguments);
        },

        cancelEdit : function() {
            this.setEmployerBarDisabled(false);
            this.callParent(arguments);
        },

        handleAfterEdit : function() {
            this.setEmployerBarDisabled(false);
            this.callParent(arguments);
        },

        handleAfterDelete : function() {
            this.setEmployerBarDisabled(false);
            this.callParent(arguments);
        },

        getEmptyRecord : function() {
            return Ext.apply(this.callParent(arguments), {
                employerId : this.getEmployerId()
            });
        },

        onBeforeEmployerChange : function(employer) {
            this.employerId = employer ? employer.getId() : null;
        },

        onEmployerChange : function() {
            this.load();
        }

    };

});
