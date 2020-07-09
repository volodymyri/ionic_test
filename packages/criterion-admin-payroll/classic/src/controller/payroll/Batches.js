Ext.define('criterion.controller.payroll.Batches', function() {

    var PAYROLL = criterion.consts.Route.PAYROLL;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batches',

        handleActivate : function() {
            var me = this;

            Ext.defer(function() {
                me.onSearch();
            }, 200);
        },

        load : function() {
            var grid = this.lookupReference('payrollGrid'),
                currentBatches = this.getStore('currentBatches');

            grid.setLoading(true);

            this.getStore('payPeriods').loadWithPromise().then({
                scope : this,
                success : function() {
                    currentBatches.currentPage = 1;
                    currentBatches.loadWithPromise().always(function() {
                        grid.setLoading(false);
                    });
                }
            });
        },

        onBatchEdit : function(record) {
            this.redirectTo(PAYROLL.BATCH.MAIN + '/' + record.getId());
        },

        onBatchRemove : function(record) {
            var store = this.getViewModel().getStore('currentBatches');

            store.remove(record);
            store.sync();
        },

        onBatchAdd : function() {
            this.redirectTo(PAYROLL.BATCH.MAIN);
        },

        onSearch : function() {
            var vm = this.getViewModel(),
                store = vm.getStore('currentBatches'),
                form = this.lookupReference('searchForm'),
                searchCriteria = form && form.getValues();

            if (!searchCriteria) {
                return
            }

            Ext.Object.each(searchCriteria, function(key, value) {
                if (value === '' || value === false) {
                    // remove empty choices from criteria
                    delete searchCriteria[key];
                }
            });

            store.getProxy().setExtraParams(searchCriteria);
            this.load();
        },

        /**
         * @deprecated
         * @param cmp
         * @param value
         */
        onStatusFilterChange : function(cmp, value) {
            var isComplete = value !== null && criterion.CodeDataManager.getValue(value, criterion.consts.Dict.BATCH_STATUS, 'code') === 'COMPLETE';

            this.getViewModel().set('isStatusComplete', isComplete);
            this.onSearch();
        },

        onKeyPress : function(cmp, e) {
            if (e.keyCode === e.RETURN) {
                this.onSearch();
            }
        },

        handleSearchComboChange : function() {
            this.onSearch();
        }

    };
});
