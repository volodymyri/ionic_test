Ext.define('criterion.controller.payroll.PayProcessing', function() {

    var PAYROLL_PAY_PROCESSING = criterion.consts.Route.PAYROLL.PAY_PROCESSING,
        BATCH_STATUSES = criterion.Consts.BATCH_STATUSES,
        BATCH_AGGREGATED_STATUSES = criterion.Consts.BATCH_AGGREGATED_STATUSES,
        DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.model.employer.payroll.Batch'
        ],

        alias : 'controller.criterion_payroll_pay_processing',

        mixins : [
            'criterion.controller.mixin.ReRouting',
            'criterion.controller.mixin.SingleEmployer',
            'criterion.model.employer.payroll.Batch'
        ],

        loadingStores : false,

        init : function() {
            var routes = {};

            routes[PAYROLL_PAY_PROCESSING] = 'handleRoute';
            routes[PAYROLL_PAY_PROCESSING + '/:tab'] = 'handleRoute';
            routes[PAYROLL_PAY_PROCESSING + '/payBatch/:id'] = 'handleRouteView';

            this.setRoutes(routes);
            this.setReRouting();

            this.callParent(arguments);
        },

        handleActivate : function() {
            var me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                years = vm.getStore('years');

            view.setLoading(true);
            years.loadWithPromise().always(function() {
                if (!me.loadingStores) {
                    view.setLoading(false);
                }
            });
        },

        handleRoute : function(pageId) {
            if (!pageId) {
                Ext.History.add(PAYROLL_PAY_PROCESSING + '/payBatch');
            }

            this.getView().setActiveTab(pageId || 'payBatch');

            if (pageId === 'payBatch') {
                this.load();
            }
        },

        handleRouteView : function(id) {
            var record;

            id = parseInt(id, 10);

            this.getView().setActiveTab(0);

            if (id) {
                record = Ext.create('criterion.model.employer.payroll.Batch', {
                    id : id
                });
                record.loadWithPromise().then({
                    scope : this,
                    success : function(rec) {
                        this.onPayProcess(rec);
                    }
                });
            }
        },

        load : function() {
            var me = this,
                view = this.getView(),
                currentBatches = this.getViewModel().getStore('currentBatches');

            if (!view.rendered) {
                view.on('render', 'load', me);
                return;
            }
            view.setActiveTab(0);
            this.lookupReference('cardContainer').setActiveItem('grid');

            view.setLoading(true);
            me.loadingStores = true;

            currentBatches.getProxy().setUrl(criterion.consts.Api.API.EMPLOYER_PROCESSING_PAYROLL_BATCH);

            Ext.Deferred.sequence([
                function() {
                    return criterion.CodeDataManager.load([
                        DICT.BATCH_STATUS
                    ]);
                },
                function() {
                    return currentBatches.loadWithPromise({
                        params : me.getSearchParams()
                    });
                }
            ])
                .always(function() {
                    me.loadingStores = false;
                    view.setLoading(false);
                });
        },

        getSearchParams : function() {
            var res = {},
                employerId = this.lookup('employerCombo').getValue(),
                status = this.lookup('statusCombo').getValue();

            if (employerId) {
                res['employerId'] = employerId;
            }

            if (status === BATCH_AGGREGATED_STATUSES.OPEN) {
                // Open (this will show batches - To Be paid, Paid, Reversal)
                res['batchStatusCds'] = [
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.TO_BE_PAID, DICT.BATCH_STATUS).getId(),
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.PAID, DICT.BATCH_STATUS).getId(),
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.REVERSAL, DICT.BATCH_STATUS).getId()
                ].join(',');
            }

            if (status === BATCH_AGGREGATED_STATUSES.COMPLETED) {
                // Completed - show batches Completed and Reversal Completed
                res['batchStatusCds'] = [
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.COMPLETE, DICT.BATCH_STATUS).getId(),
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.REVERSAL_COMPLETE, DICT.BATCH_STATUS).getId()
                ].join(',');
            }

            return res;
        },

        handleSearch : function() {
            this.load();
        },

        onPayProcess : function(record) {
            var processPay = this.lookupReference('processPay'),
                cardContainer = this.lookupReference('cardContainer');

            processPay.getViewModel().set('batchRecord', record);
            cardContainer.setActiveItem('processPay');
            Ext.History.add(PAYROLL_PAY_PROCESSING + '/payBatch/' + record.getId(), true);
        },

        onTabChange : function(panel, tab) {
            if (tab) {
                this._tabitemId = tab.itemId;
            }

            Ext.History.add(PAYROLL_PAY_PROCESSING + '/' + this._tabitemId, true);
        }
    };
});
