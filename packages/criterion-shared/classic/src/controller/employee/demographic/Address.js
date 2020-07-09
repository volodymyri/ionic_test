Ext.define('criterion.controller.employee.demographic.Address', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_demographic_address',

        requires : [
            'criterion.view.common.SelectGeoCode'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        onBeforeEmployeeChange : function() {
            let stateField = this.lookupReference('stateField');

            if (!stateField) {
                return false;
            }

            stateField.getStore().clearFilter();

            return false;
        },

        handleSelectGeocode : function() {
            let me = this,
                employeePanel = this.getView().up('criterion_employee_demographics') || this.getView(),
                form = employeePanel.getForm(),
                personAddressRecord = employeePanel.getViewModel().get('address'),
                cityField = this.lookupReference('cityField'),
                postalCodeField = this.lookupReference('postalCodeField'),
                city = cityField && cityField.getValue(),
                postalCode = postalCodeField && postalCodeField.getValue(),
                selectGeoCodeWindow;

            if (!postalCode) {
                criterion.Msg.warning({
                    title : i18n.gettext('Zip code'),
                    message : i18n.gettext('Enter postal code.')
                });

                return;
            }

            if (employeePanel.isValidSection('criterion_employee_demographic_address', true)) {
                form.updateRecord(personAddressRecord);
            }

            selectGeoCodeWindow = Ext.create('criterion.view.common.SelectGeoCode', {
                modal : true,
                extraParams : {
                    zip : postalCode,
                    city : city,
                    countryCode : personAddressRecord.get('countryCode')
                }
            });

            selectGeoCodeWindow.on('select', function(geocode) {
                me.setGeocode(geocode, !city);
            });
            selectGeoCodeWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            selectGeoCodeWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        /**
         * @private
         * @param {criterion.model.vertex.GeoCode} geocode
         * @param {Boolean} isSetCity
         */
        setGeocode : function(geocode, isSetCity) {
            let employeePanel = this.getView().up('criterion_employee_demographics') || this.getView(),
                vm = employeePanel.getViewModel(),
                address = vm.get('address');

            address.set(
                {
                    geocode : geocode.get('geoCode'),
                    county : geocode.get('county'),
                    schdist : geocode.get('schdist'),
                    schdistName : geocode.get('schdistName')
                }
            );

            if (isSetCity) {
                address.set('city', geocode.get('city'));
            }
        }
    };

});
