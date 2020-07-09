Ext.define('criterion.view.ux.form.field.Format', function() {

    var createValidator = function(re) {
        return function(v) {
            return re.test(v);
        };
    };

    return {

        extend : 'Ext.form.field.Text',

        alias : 'widget.criterion_formatfield',

        requires : [
            'criterion.ux.form.field.plugin.InputMask'
        ],

        mixins : [
            'Ext.util.StoreHolder'
        ],

        plugins : [
            {
                ptype : 'inputmask',
                placeholder : 'X'
            }
        ],

        constructor : function() {
            this.callParent(arguments);
            Ext.GlobalEvents.on('baseStoresLoaded', this.onStoreLoad, this);
        },

        config : {
            /**
             * @type {criterion.store.FieldFormatTypes}
             */
            store : null,
            fieldType : null,
            countryCd : null
        },

        initComponent : function() {
            var store;

            this.callParent(arguments);

            if (!this.getStore()) {
                store = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.FIELD_FORMAT.storeId);

                this.setStore(store);

                if (store.isLoaded()) {
                    this.onStoreLoad();
                }
            }
        },

        updateStore : function(store, oldStore) {
            this.bindStore(store, !oldStore);
        },

        getStoreListeners : function() {
            return {
                load : this.onStoreLoad
            };
        },

        onStoreLoad : function() {
            var store = this.getStore();

            if (!store) {
                return;
            }

            store.each(function(format) {
                Ext.form.field.VTypes[format.get('vtype')] = createValidator(new RegExp(format.get('validityTest')));
                Ext.form.field.VTypes[format.get('vtype') + 'Text'] = i18n.gettext('Format is not valid.');
            });

            this.updateFormat();
        },

        updateCountryCd : function() {
            this.updateFormat();
        },

        updateFieldType : function() {
            this.updateFormat();
        },

        updateFormat : function() {
            var inputMask = this.getPlugin('inputmask');

            if (!inputMask) {
                return;
            }

            var store = this.getStore(),
                fieldType = this.getFieldType(),
                countryCd = this.getCountryCd(),
                format;

            if (!store) {
                return;
            }

            if (fieldType && countryCd) {
                format = store.getAt(store.findBy(function(record) {
                    return record.get('fieldType') == fieldType && record.get('countryCd') == countryCd;
                }));
            }

            if (format) {
                this.vtype = format.get('vtype');
                inputMask.setFormat(format.get('mask'));
            } else {
                this.vtype = null;
                inputMask.setFormat(null);
            }
        }
    };
});
