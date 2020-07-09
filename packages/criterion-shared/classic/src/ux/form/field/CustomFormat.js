Ext.define('criterion.view.ux.form.field.CustomFormat', function() {

    function createValidator(re) {
        return function(v) {
            return re.test(v);
        }
    }
    
    return {

        extend : 'Ext.form.field.Text',

        alias : 'widget.criterion_customformatfield',

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

        config : {
            /**
             * @type {criterion.store.FieldFormatTypes}
             */
            store : null,
            fieldType : null
        },

        constructor : function() {
            this.callParent(arguments);
            Ext.GlobalEvents.on('baseStoresLoaded', this.onStoreLoad, this);
        },

        initComponent : function() {
            var store;

            this.callParent(arguments);

            if (!this.getStore()) {
                store = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.FIELD_FORMAT_CUSTOM.storeId);

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

        updateFieldType : function() {
            this.updateFormat();
        },

        updateFormat : function() {
            var inputMask = this.plugins[0],
                store = this.getStore(),
                fieldType = this.getFieldType(),
                format;

            if (!store) {
                return;
            }

            if (fieldType) {
                format = store.getById(fieldType);
            }

            if (format) {
                this.vtype = format.get('vtype');
                inputMask.format = format.get('mask');
                inputMask.init(this);
            }
        }
    }
});
