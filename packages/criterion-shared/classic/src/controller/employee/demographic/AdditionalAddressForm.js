Ext.define('criterion.controller.employee.demographic.AdditionalAddressForm', function() {

    return {
        alias : 'controller.criterion_employee_demographic_additional_address_form',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.common.SelectGeoCode'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleSelectGeocode : function() {
            let me = this,
                personAddressRecord = this.getRecord(),
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
            let address = this.getRecord();

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
        },

        handleRecordLoad : function(record) {
            let vm = this.getViewModel();

            vm.set('mailingReadOnly', !record.phantom && record.get('isMailingAddress'));

            this.callParent(arguments);
        }
    };

});
