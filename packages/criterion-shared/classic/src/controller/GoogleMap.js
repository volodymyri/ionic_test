Ext.define('criterion.controller.GoogleMap', function() {

    var map;

    return {
        alias : 'controller.criterion_google_map',

        extend : 'criterion.app.ViewController',

        onShow : function() {
            var me = this,
                cancelBtn = me.lookup('cancelBtn');

            Ext.defer(function() {
                cancelBtn.focus();
            }, 100);
        },

        onMapReady : function(mapContainer, gmap) {
            var me = this,
                vm = me.getViewModel(),
                geofenceData = vm.get('geofenceData');

            map = gmap;

            if (map && geofenceData) {
                try {
                    map.data.addGeoJson(geofenceData);
                } catch (e) {
                    criterion.Utils.toast(i18n.gettext('Current geofence data is broken'));
                }
            }
        },

        onSaveButtonHandler : function() {
            var me = this,
                view = me.getView(),
                vm = this.getViewModel(),
                isAllowPunchOutsideGeofence;

            map && map.data.toGeoJson(function(geoJson) {
                view.fireEvent('defineFence', geoJson, vm.get('isAllowPunchOutsideGeofence'), vm.get('isSendPunchOutsideGeofenceNotification'));
                view.destroy();
            });
        },

        onCancelHandler : function() {
            var view = this.getView();

            view.fireEvent('cancel');
            view.destroy();
        }

    }
});
