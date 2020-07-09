Ext.define('criterion.controller.settings.payroll.ShiftRate', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_payroll_settings_shift_rate',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        requires : [
            'criterion.store.employeeGroup.ShiftRates',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        loadRecord : function(record) {
            var view = this.getView(),
                employeeGroupCombo = this.lookup('employeeGroupCombo');

            if (!record.phantom) {
                view.setLoading(true);

                employeeGroupCombo.loadValuesForRecord(record).always(function() {
                    view.setLoading(false);
                });
            } else {
                employeeGroupCombo.applyEmployerFilter(record.get('employerId'));
            }
        },

        handleEmployerChange : function(cmp, val) {
            let employeeGroupCombo = this.lookup('employeeGroupCombo');

            val && employeeGroupCombo && employeeGroupCombo.applyEmployerFilter(val);
        },

        onAfterSave : function(view, record) {
            var me = this;

            view.setLoading(true);

            me.lookup('employeeGroupCombo').saveValuesForRecord(record)
                .then(function() {
                    view.fireEvent('afterSave', view, record);

                    criterion.Utils.toast(i18n.gettext('Shift Rate Saved.'));

                    me.close();
                })
                .always(function() {
                    view.setLoading(false);
                });
        }
    };

});
