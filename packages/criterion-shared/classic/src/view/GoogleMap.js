Ext.define('criterion.view.GoogleMap', function() {

    return {

        alias : 'widget.criterion_google_map',

        extend : 'criterion.ux.Panel',

        mixins : [
            'Ext.mixin.Mashup'
        ],

        requires : [
            'criterion.controller.GoogleMap'
        ],

        requiredScripts : window.navigator.onLine !== true || (typeof criterion.API_URL_PREFIX !== 'undefined' && criterion.API_URL_PREFIX !== '/api') ? [] : [
            '//maps.googleapis.com/maps/api/js?v=3&libraries=drawing&key=AIzaSyBE897kZEsVJ2LwgbMVRY9aDKL73D6bOFc'
        ],

        controller : {
            type : 'criterion_google_map'
        },

        bodyPadding : 20,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
            }
        ],

        config : {
            geoCodeAddr : null,
            lat : 0,
            lng : 0,
            zoom : 1
        },

        viewModel : {
            data : {
                title : '',
                geofenceData : '',
                saveBtnText : i18n.gettext('Save')
            }
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        modal : true,
        closable : true,
        layout : 'fit',
        draggable : true,

        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'cancelBtn',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : 'onCancelHandler'
            },
            {
                xtype : 'button',
                reference : 'saveButton',
                cls : 'criterion-btn-primary',
                scale : 'small',
                handler : 'onSaveButtonHandler',
                bind : {
                    text : '{saveBtnText}'
                }
            }
        ],

        bind : {
            title : '{title}'
        },

        initComponent : function() {
            var geoCodeAddr,
                center;

            if (typeof google === 'undefined') {
                this.callParent(arguments);

                return;
            }

            geoCodeAddr = this.getGeoCodeAddr();
            center = geoCodeAddr ? {geoCodeAddr : geoCodeAddr} : new google.maps.LatLng(this.getLat(), this.getLng());

            this.items = [
                {
                    xtype : 'criterion_gmappanel',
                    gmapType : 'map',
                    center : center,
                    mapOptions : {
                        mapTypeId : google.maps.MapTypeId.ROADMAP,
                        zoom : this.getZoom()
                    },
                    listeners : {
                        scope : 'controller',
                        mapready : 'onMapReady'
                    }
                }
            ];

            this.callParent(arguments);
        }
    }

});
