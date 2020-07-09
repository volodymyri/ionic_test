Ext.define('criterion.controller.settings.payroll.GLAccountMap', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_payroll_settings_gl_account_map',

        requires : [
            'criterion.view.settings.payroll.GLTaxAddForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init : function() {
            let creditAccountField = this.lookup('creditAccountField'),
                debitAccountField = this.lookup('debitAccountField'),
                creditAccountFieldContainer = this.lookup('creditAccountFieldContainer'),
                debitAccountFieldContainer = this.lookup('debitAccountFieldContainer');

            creditAccountField.validator = debitAccountField.validator = function() {
                let cVal = creditAccountField.getValue(),
                    dVal = debitAccountField.getValue();

                if (!cVal && !dVal) {
                    return i18n.gettext('Please choose a Credit Account, Debit Account or both.');
                }

                creditAccountFieldContainer.setHideRequiredMark(false);
                debitAccountFieldContainer.setHideRequiredMark(false);

                if (!creditAccountField.isHidden() && !debitAccountField.isHidden()) {
                    if (dVal && !cVal) {
                        creditAccountFieldContainer.setHideRequiredMark(true);
                    }

                    if (cVal && !dVal) {
                        debitAccountFieldContainer.setHideRequiredMark(true);
                    }
                }

                return true;
            };
        },

        onTaxSearch : function() {
            var me = this,
                record = this.getViewModel().get('record');

            var form = Ext.create('criterion.view.settings.payroll.GLTaxAddForm', {
                employerId : record.get('employerId')
            });

            form.on('select', function(tax) {
                record.set({
                    taxId : tax.getId(),
                    taxName : tax.get('description')
                });

            });
            form.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            form.show();

            me.setCorrectMaskZIndex(true);
        },

        validateAccount : function() {
            this.lookup('creditAccountField').validate();
            this.lookup('debitAccountField').validate();
        }
    };
});
