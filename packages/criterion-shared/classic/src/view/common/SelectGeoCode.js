Ext.define('criterion.view.common.SelectGeoCode', function() {

    return {
        extend : 'criterion.view.RecordPicker',

        requires : [
            'criterion.store.GeoCodes'
        ],

        title : i18n.gettext('Select Geo Code'),

        columns : [
            {
                text : i18n.gettext('City'),
                dataIndex : 'city',
                flex : 1
            },
            {
                text : i18n.gettext('County'),
                dataIndex : 'county',
                flex : 1
            },
            {
                text : i18n.gettext('School District'),
                dataIndex : 'schdistName',
                flex : 1
            },
            {
                text : i18n.gettext('Geo Code'),
                dataIndex : 'geoCode',
                flex : 1
            },
            {
                text : i18n.gettext('School Code'),
                dataIndex : 'schdist',
                flex : 1
            },
            {
                text : i18n.gettext('PSD'),
                dataIndex : 'psd',
                flex : 1
            }
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '50%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
            }
        ],

        constructor : function(config) {
            var me = this;

            this.store = Ext.create('criterion.store.GeoCodes', {
                proxy : {
                    extraParams : config.extraParams || {}
                },
                listeners : {
                    load : function(store, records, successful) {
                        !successful && me.close();
                    }
                }
            });

            this.callParent(arguments);
        }
    };

});
