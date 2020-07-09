Ext.define('criterion.overrides.form.field.VTypes', function() {

    //  hacky way to enable override
    Ext.apply(Ext.form.field.VTypes, {
        phoneText : 'The phone number format is wrong, ie: +1-222-333-1111',
        phone : function() { // see
            // http://stackoverflow.com/questions/123559/a-comprehensive-regex-for-phone-number-validation
            //var re = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-‌​9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})$/;
            //var re = /^\d{11}$/;
            var re = /^\+\d{1}-\d{3}-\d{3}-\d{4}$/,
                nullValue = '+X-XXX-XXX-XXXX';
            return function(v) {
                return re.test(v) || v == nullValue;
            };
        }(),

        faxText : 'The fax format is wrong',
        fax : function() {
            var re = /^[\(\)\.\- ]{0,}[0-9]{3}[\(\)\.\- ]{0,}[0-9]{3}[\(\)\.\- ]{0,}[0-9]{4}[\(\)\.\- ]{0,}$/;
            return function(v) {
                return re.test(v);
            };
        }(),

        zipCodeText : 'The zip code format is wrong, e.g., 94105-0011 or 94105',
        zipCode : function() {
            var re = /^\d{5}(-\d{4})?$/;
            return function(v) {
                return re.test(v);
            };
        }(),

        /**
         * @see http://try.sencha.com/extjs/4.0.7/examples/form/adv-vtypes/viewer.html
         * @param val
         * @param field
         * @returns {boolean}
         */
        daterangeText : 'Start date must be less than end date',
        daterange : function(val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField) || field.up('form').getForm().findField(field.startDateField);
                start.setMaxValue(date);
                start.getValidation();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField) || field.up('form').getForm().findField(field.endDateField);
                end.setMinValue(date);
                end.getValidation();
                this.dateRangeMin = date;
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },

        separatorText : 'Separator validation error',
        separator : function(val, field) {
            if (field.separatorField) {
                var separatorField = field.up('form').down('#' + field.separatorField) || field.up('form').getForm().findField(field.separatorField);

                if (separatorField.getValue() == val) {
                    this.separatorText = Ext.util.Format.format('Value of {0} must not be equal to {1}', field.getFieldLabel(), separatorField.getFieldLabel());
                    return false;
                }
            }

            return true;
        }
    });

    return {
        override : 'Ext.form.field.VTypes'
    }

});