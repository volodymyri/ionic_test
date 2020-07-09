Ext.define('criterion.controller.employee.payroll.IncomeForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_payroll_income_form',

        requires : [
            'criterion.model.employee.Income'
        ],

        onDestroy : function() {
            this.getView().destroy();
        },

        getRecord : function() {
            return this.record;
        },

        loadRecord : function(record) {
            var view = this.getView(),
                vm = this.getViewModel(),
                me = this,
                workingRecord = Ext.create('criterion.model.employee.Income', record.getData()),
                incomeListsStore = this.getViewModel().get('incomeListsStore');

            view.setLoading(true, null);

            this.record = record;
            workingRecord.phantom = record.phantom;

            incomeListsStore.load({
                scope : this,
                params : {
                    employerId : vm.get('employer').getId()
                },
                callback : function() {
                    me.getViewModel().set('record', workingRecord);
                    view.setLoading(false);
                }
            })
        },

        handleSubmitClick : function() {
            if (this.getView().isValid()) {
                this.saveRecord();
            }
        },

        saveRecord : function() {
            var workingRecord = this.getViewModel().get('record'),
                me = this,
                view = this.getView();

            view.setLoading(true, null);

            this.record.set(workingRecord.getData());
            this.record.saveWithPromise()
                .then({
                    scope : this,
                    success : function() {
                        view.fireEvent('afterSave', me.record);
                        view.setLoading(false, null);
                        me.onDestroy();
                    }
                })
                .always(function() {
                    view.setLoading(false);
                })
        },

        handleIncomeListChange : function(combo, newValue, oldValue) {
            var vm = this.getViewModel(),
                record = vm.get('record'),
                selectedIncomeList = vm.get('selectedIncomeList');

            if (!selectedIncomeList) {
                return;
            }

            record.set({
                incomeListDescription : selectedIncomeList.get('description')
            });

            if (record.phantom) {
                record.set({
                    amount : selectedIncomeList.get('rate')
                });
            }
        }
    };
});
