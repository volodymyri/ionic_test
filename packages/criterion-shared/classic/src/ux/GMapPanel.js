Ext.define('criterion.ux.GMapPanel', function() {

    return {

        alias : 'widget.criterion_gmappanel',

        extend : 'Ext.ux.GMapPanel',

        getMap : function() {
            return this.gmap;
        },

        createMap : function(center, marker) {
            var me = this,
                options = Ext.apply({}, this.mapOptions),
                map = me.gmap;

            options = Ext.applyIf(options, {
                zoom : 14,
                center : center,
                mapTypeId : google.maps.MapTypeId.HYBRID
            });
            map = new google.maps.Map(this.body.dom, options);
            if (marker) {
                me.addMarker(Ext.applyIf(marker, {
                    position : center
                }));
            }

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode : google.maps.drawing.OverlayType.POLYGON,
                drawingControl : true,
                drawingControlOptions : {
                    position : google.maps.ControlPosition.TOP_CENTER,
                    drawingModes : ['rectangle', 'polygon']
                },
                editable : false,
                draggable : false,
                clickable : false,
                isDrawingModeEnabled : true
            });
            drawingManager.setMap(map);

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                switch (event.type) {
                    case google.maps.drawing.OverlayType.RECTANGLE:
                        var bounds = event.overlay.getBounds(),
                            southWestBound = bounds.getSouthWest(),
                            northEastBound = bounds.getNorthEast(),
                            southWestLat = southWestBound.lat(),
                            northEastLat = northEastBound.lat(),
                            southWestLng = southWestBound.lng(),
                            northEastLng = northEastBound.lng(),
                            p = [southWestBound, {
                                lat : southWestLat,
                                lng : northEastLng
                            }, northEastBound, {
                                lng : southWestLng,
                                lat : northEastLat
                            }];
                        map.data.add(new google.maps.Data.Feature({
                            geometry : new google.maps.Data.Polygon([p])
                        }));
                        break;
                    case google.maps.drawing.OverlayType.POLYGON:
                        map.data.add(new google.maps.Data.Feature({
                            geometry : new google.maps.Data.Polygon([event.overlay.getPath().getArray()])
                        }));
                        break;
                }

                event.overlay.setMap(null);
            });

            google.maps.event.addListener(map.data, 'rightclick', me.featureRightClicked, me);

            Ext.each(me.markers, me.addMarker, me);
            this.fireEvent('mapready', me, map);
        },

        featureRightClicked : function(data) {
            this.getMap().data.remove(data.feature);
        }
    }
});