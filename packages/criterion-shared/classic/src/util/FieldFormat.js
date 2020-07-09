Ext.define('criterion.util.FieldFormat', {

    requires : [
        'criterion.store.FieldFormatTypes'
    ],

    singleton : true,

    config : {
        fieldFormatTypes : null,
        employerWorkLocations : null
    },

    definitions : criterion.Consts.FIELD_FORMAT_TYPE_DEFINITIONS,

    constructor : function() {
        var me = this;

        if (!me.getFieldFormatTypes()) {
            me.setFieldFormatTypes(Ext.create('criterion.store.FieldFormatTypes'));
        }

        if (!me.getEmployerWorkLocations()) {
            me.setEmployerWorkLocations(Ext.create('criterion.store.employer.WorkLocations', {
                filters : {
                    property : 'isPrimary',
                    value : true
                }
            }));
        }

        Ext.Array.each(Ext.Object.getKeys(me.definitions), function(key) {
            me.defs[key] = new RegExp(me.definitions[key]);
        });
    },

    fieldRenderer : function(fieldType) {
        var me = this;

        return function(value, metaData, record, rowIndex, colIndex, store, view) {
            var types = me.getFieldFormatTypes(),
                locations = me.getEmployerWorkLocations();

            if (types.isLoaded() && locations.isLoaded()) {
                var wLocation = locations.findRecord('employerId', record.get('employerId'), 0, false, false, true),
                    countryCd = wLocation && wLocation.getWorkLocation().get('countryCd'),
                    maskRecord = countryCd && types.getAt(types.findBy(function(type) {
                    return type.get('fieldType') == fieldType && type.get('countryCd') == countryCd
                })),
                    mask = maskRecord && maskRecord.get('mask');

                if (mask) {
                    return me.format(value, mask);
                }
            } else if (!types.isLoading() && !locations.isLoading()) {
                Ext.promise.Promise.all([
                    types.loadWithPromise(),
                    locations.loadWithPromise()
                ]).then(function() {
                    view.refresh();
                });
            }

            return value;
        }
    },

    format : function(value, mask) {
        var formatted = '',
            i = 0,
            lastIndex;

        for (var j = 0; j < mask.length; j++) {
            var re = this.defs[mask[j]];

            lastIndex = i;

            if (!re) {
                formatted += mask[j];
            } else if (!re.test(value[i]) || !value[i]) {
                return value;
            } else {
                formatted += value[i];
                i++;
            }
        }

        if (lastIndex != value.length - 1) {
            return value;
        }

        return formatted;
    },

    privates : {
        defs : {}
    }
});
