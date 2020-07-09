Ext.define('criterion.controller.settings.payroll.PayGroup', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_pay_group',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        requires : [
            'criterion.view.settings.payroll.payGroup.IncomeLists',
            'criterion.store.employer.IncomeLists',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleRecordLoaded : function(data) {
            var me = this,
                employerId = criterion.Api.getEmployerId(),
                vm = me.getViewModel(),
                payGroupId = data.record.get('id'),
                incomeLists = vm.getStore('incomeLists'),
                employerPayrollPeriodSchedule = vm.getStore('employerPayrollPeriodSchedule');

            Ext.promise.Promise.all([
                incomeLists.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                }),
                employerPayrollPeriodSchedule.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                })
            ]).then(function() {
                if (!data.record.phantom) {
                    me.lookupReference('incomeLists').getStore().load({
                        params : {
                            payGroupId : payGroupId
                        }
                    });
                }

                me.lookupReference('employeeGroupCombo').loadValuesForRecord(data.record);
            });
        },

        onAfterSave : function(view, record) {
            var me = this,
                payGroupId = record.getId(),
                incomeListsStore = me.lookupReference('incomeLists').store;

            incomeListsStore.each(function(rec) {
                rec.set('payGroupId', payGroupId);
            });

            Ext.Promise
                .all([
                    incomeListsStore.syncWithPromise(),
                    me.lookupReference('employeeGroupCombo').saveValuesForRecord(record)
                ]).then(function() {
                    view.fireEvent('afterSave', view, record);
                    criterion.Utils.toast(i18n.gettext('Pay Group Saved.'));
                    me.close();
                });
        },

        renderIncome : function(value) {
            var vm = this.getViewModel(),
                incomeLists = vm.getStore('incomeLists'),
                record = incomeLists.getById(value);

            return record && record.get('code');
        },

        handleAddIncome : function() {
            var me = this,
                vm = this.getViewModel(),
                incomeLists = vm.getStore('incomeLists'),
                selectedIncomes = this.lookupReference('incomeLists').getStore(),
                selectedIds = selectedIncomes.getDataAsArray().map(function(obj) {
                    return obj['incomeListId'];
                }),
                filteredIncomeLists = Ext.create('criterion.store.employer.IncomeLists', {
                    autoSync : false
                });

            incomeLists.each(function(record) {
                if (!Ext.Array.contains(selectedIds, record.getId())) {
                    filteredIncomeLists.add(record);
                }
            });

            incomeLists = Ext.create('criterion.view.settings.payroll.payGroup.IncomeLists', {
                viewModel : {
                    stores : {
                        incomeLists : filteredIncomeLists
                    }
                }
            });

            incomeLists.on('select', function(record) {
                this.selectIncome(record);
            }, this);
            incomeLists.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            incomeLists.show();

            me.setCorrectMaskZIndex(true);
        },

        remove : function(record) {
            var store = record.store;

            store.remove(record);
        },

        selectIncome : function(incomeRecord) {
            this.setCorrectMaskZIndex(false);
            var incomeLists = this.lookupReference('incomeLists').getStore();

            incomeLists.add({
                incomeListId : incomeRecord.getId()
            });
        }
    };
});
