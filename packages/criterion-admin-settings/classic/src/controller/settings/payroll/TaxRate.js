Ext.define('criterion.controller.settings.payroll.TaxRate', function() {

    return {

        extend : 'criterion.controller.common.SelectTax',

        alias : 'controller.criterion_settings_tax_rate',

        handleAdd : function() {
            var record = this.getViewModel().get('record'),
                view = this.getView(),
                effectiveDateField = this.lookup('effectiveDateField'),
                effectiveDate = effectiveDateField.getValue(),
                selectionRecord = this.getGrid().getSelection()[0];

            if (!effectiveDate) {
                effectiveDateField.markInvalid(i18n.gettext('This field is required'));
                return;
            }

            record.set({
                taxId : selectionRecord.get('id'),
                effectiveDate : effectiveDate,
                isRounding : this.lookup('isRoundingField').getValue(),
                taxIdentifier : this.lookup('taxIdentifierField').getValue()
            });

            record.save({
                success : function() {
                    view.fireEvent('saved');
                    view.destroy();
                }
            });
        },

        onBeforeTaxSelect : function(row, record) {
            return !record.get('used');
        },

        getTaxRowClass : function(record) {
            return record.get('used') ? 'checkbox-hidden' : '';
        },

        onEffectiveDateChange : function(cmp, value) {
            var me = this,
                blockedTaxes = this.getViewModel().get('blockedTaxes');

            this.lookup('grid').getStore().each(function(taxRecord) {
                 if(me.findDuplicatedTaxes(taxRecord, blockedTaxes, value)){
                    taxRecord.set('used', true);
                 }else{
                     taxRecord.set('used', false);
                 }
            });
        },

        findDuplicatedTaxes : function(record, taxes, effectiveDate) {
            var blockedTaxes = taxes || this.getViewModel().get('blockedTaxes'),
                recordId = record.getId(),
                dateIsValid = effectiveDate && Ext.isDate(effectiveDate),
                duplicatedTaxIdx = blockedTaxes.findBy(
                    function(tax) {
                        var taxId = tax.get('taxId'),
                            taxIdIsEqual = taxId === recordId;

                        if (dateIsValid) {
                            return taxIdIsEqual && Ext.Date.isEqual(effectiveDate, tax.get('effectiveDate'));
                        } else {
                            return taxIdIsEqual;
                        }
                    }),
                result = dateIsValid && duplicatedTaxIdx > -1;

            if (result) {
                var grid = this.lookup('grid'),
                    selection = grid.getSelection();

                if (selection && selection.length && record === selection[0]) {
                    grid.getSelectionModel().deselect(selection);
                }
            }

            return result;
        }
    };

});
