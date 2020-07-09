Ext.define('criterion.controller.payroll.Batch', function() {

    const PAYROLL_BATCH = criterion.consts.Route.PAYROLL.BATCH;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch',

        requires : [
            'criterion.view.payroll.batch.Definition'
        ],

        mixins : [
            'criterion.controller.mixin.ReRouting',
            'criterion.controller.mixin.NotesHandler'
        ],

        init : function() {
            let routes = {};

            routes[PAYROLL_BATCH.MAIN] = 'handleRoute';
            routes[PAYROLL_BATCH.MAIN + '/:id'] = 'handleRoute';
            routes[PAYROLL_BATCH.ENTRY] = 'onBatchCreate';
            routes[PAYROLL_BATCH.APPROVAL] = 'onBatchDetailsSave';

            this.setRoutes(routes);
            this.setReRouting();

            this.callParent(arguments);
        },

        handleRoute : function(id) {
            let definition = this.lookup('definition');

            if (
                !id &&
                !criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH, criterion.SecurityManager.CREATE)()
            ) {
                this.redirectTo(criterion.consts.Route.PAYROLL.PAYROLL);

                return;
            }

            this.lookup('cardContainer').setActiveItem(definition);
            this.updateProgressIndicator();

            definition.getController().beforeLoadActions().then(function() {
                definition.getController().load(id);
            });
        },

        onShowBatchDetails : function(batchId) {
            this.redirectTo(PAYROLL_BATCH.MAIN + '/' + batchId);
        },

        onBatchDetailStoreChange : function(store) {
            this.getViewModel().set('enableImport', !store.getCount());
        },

        updateProgressIndicator : function() {
            let cards = this.lookup('cardContainer');

            this.getViewModel().set('activeViewIndex', cards.items.indexOf(cards.getLayout().getActiveItem()));
        },

        onBatchCreate : function(batchRecord) {
            let me = this,
                view = this.getView(),
                payrollEntry = me.lookup('payrollEntry');

            if (typeof batchRecord === 'string') {
                view.setLoading(true);
                batchRecord = Ext.create('criterion.model.employer.payroll.Batch', {
                    id : parseInt(batchRecord, 10)
                });
                batchRecord.loadWithPromise().then(function() {
                    view.setLoading(false);
                    payrollEntry.getViewModel().set('batchRecord', batchRecord);
                    payrollEntry.getController().load();
                    me.lookup('cardContainer').setActiveItem('payrollEntry');
                    me.updateProgressIndicator();
                });
            } else {
                payrollEntry.getViewModel().set('batchRecord', batchRecord);
                me.lookup('cardContainer').setActiveItem('payrollEntry');
                me.updateProgressIndicator();
            }

            Ext.History.add(PAYROLL_BATCH.MAIN + '/' + batchRecord.getId() + '/entry', true);
        },

        onGetPayrollBatchNotes : function(view, notes, readOnlyMode) {
            this.getViewModel().set({
                notes : notes,
                readOnlyMode : readOnlyMode
            });
        },

        onClickNotes : function(e) {
            let vm = this.getViewModel();

            if (e.getTarget('.notes-icon', 1)) {
                this.showNotesPopup(vm.get('notes'), vm.get('readOnlyMode'));
            }
        },

        changeNotes : function(notes) {
            this.lookup('definition').getController().setNewNotes(notes);
        },

        onBatchDetailsSave : function(batchRecord) {
            let me = this,
                view = this.getView();

            if (typeof batchRecord === 'string') {
                view.setLoading(true);
                batchRecord = Ext.create('criterion.model.employer.payroll.Batch', {
                    id : parseInt(batchRecord, 10)
                });
                batchRecord.loadWithPromise().then(function() {
                    view.setLoading(false);
                    me.lookup('payrollApproval').getViewModel().set('batchRecord', batchRecord);
                    me.lookup('cardContainer').setActiveItem('payrollApproval');
                    me.updateProgressIndicator();
                });
            } else {
                me.lookup('payrollApproval').getViewModel().set('batchRecord', batchRecord);
                me.lookup('cardContainer').setActiveItem('payrollApproval');
                me.updateProgressIndicator();
            }

            Ext.History.add(PAYROLL_BATCH.MAIN + '/' + batchRecord.getId() + '/approval', true);
        },

        handleSelectEmployees : function() {
            this.lookup('payrollEntry').getController().handleSelectEmployees();
        },

        handleImportFileClick : function() {
            this.lookup('payrollEntry').getController().handleImportClick();
        },

        handleViewDetailsClick : function() {
            this.lookup('payrollEntry').getController().handleViewDetailsClick();
        },

        handleIncomeManage : function() {
            this.lookup('payrollEntry').getController().handleIncomeManage();
        }
    };
});
