Ext.define('criterion.controller.settings.payroll.schedule.Periods', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_payroll_settings_payroll_schedule_periods',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        load : function(opts) {
            var payrollScheduleId = this.getViewModel().get('record.id');

            if (!payrollScheduleId) {
                return;
            }

            this.callParent([
                {
                    params : Ext.apply({
                        payrollScheduleId : payrollScheduleId
                    }, opts || {})
                }
            ]);
        },

        getEmptyRecord : function() {
            var vm = this.getViewModel(),
                currentYear = vm.get('currentYear'),
                maxEndDate = vm.get('maxEndDate');
            
            return {
                payrollScheduleId : this.getViewModel().get('record.id'),
                year : (!currentYear ? new Date().getFullYear() : currentYear + 1),
                periodStartDate : (!maxEndDate ? new Date() : Ext.Date.add(maxEndDate, Ext.Date.DAY, 1)),
                isFirst : !currentYear
            };
        },

        getAffectedView : function() {
            return this.getView().up();
        },

        createEditor : function(editorCfg, record) {
            var editor = this.callParent(arguments);

            editor.on('afterSave', function(view, record) {
                if (record.getId() < 0) {
                    this.load();
                }
            }, this);

            return editor;
        },

        handleDeleteClick : function() {
            var me = this,
                view = this.getView(),
                payrollPeriods = this.getViewModel().getStore('payrollSchedulePayrollPeriods'),
                firstPeriod = payrollPeriods.getAt(0);

            if (!firstPeriod) {
                return
            }

            firstPeriod.underAction = true;

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete record'),
                    message : Ext.String.format(i18n.gettext('All {0} year records will be removed! Do you want to delete?'), firstPeriod.get('year'))
                },
                function(btn) {
                    if (btn === 'yes') {
                        view.setLoading(true);
                        firstPeriod.eraseWithPromise().then(function() {
                            me.load();
                        }).always(function() {
                            view.setLoading(false);
                        })
                    }

                    firstPeriod.underAction = false;
                }
            );
        }
    };
});
