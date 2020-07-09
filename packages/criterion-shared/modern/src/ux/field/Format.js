Ext.define('criterion.ux.field.Format', function() {

    function createValidator(re) {
        return function(v) {
            return re.test(v);
        }
    }

    return {

        alias : 'widget.criterion_field_format',

        extend : 'Ext.field.Text',

        config : {
            fieldType : null,
            countryCd : null
        },

        classCls : 'criterion-field-format',

        getTemplate : function() {
            return [
                {
                    reference : 'labelElement',
                    cls : Ext.baseCSSPrefix + 'label-el',
                    tag : 'label',
                    children : [
                        {
                            reference : 'labelTextElement',
                            cls : Ext.baseCSSPrefix + 'label-text-el',
                            tag : 'span'
                        }
                    ]
                },
                {
                    reference : 'bodyWrapElement',
                    cls : Ext.baseCSSPrefix + 'body-wrap-el',
                    children : [
                        {
                            reference : 'bodyElement',
                            cls : Ext.baseCSSPrefix + 'body-el',
                            children : this.getBodyTemplate()
                        },
                        {
                            reference : 'errorElement',
                            cls : Ext.baseCSSPrefix + 'error-el',
                            children : [
                                {
                                    reference : 'errorIconElement',
                                    cls : Ext.baseCSSPrefix + 'error-icon-el ' +
                                    Ext.baseCSSPrefix + 'font-icon'
                                },
                                {
                                    reference : 'errorMessageElement',
                                    cls : Ext.baseCSSPrefix + 'error-message-el'
                                }
                            ]
                        }
                    ]
                },
                {
                    reference : 'formatElement',
                    cls : Ext.baseCSSPrefix + 'format-el',
                    tag : 'div'
                }
            ];
        },

        constructor : function() {
            var me = this;

            this.callParent(arguments);

            this.formatStore = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.FIELD_FORMAT.storeId);

            if (!this.formatStore) {
                return;
            }

            if (!this.formatStore.isLoaded()) {
                this.formatStore.on('load', me.onFormatStoreLoaded, me);
            } else {
                me.onFormatStoreLoaded();
            }
        },

        onFormatStoreLoaded : function() {
            this.updateFormat();
        },

        updateCountryCd : function(countryCd) {
            this.updateFormat();
        },

        updateFormat : function() {
            var store = this.formatStore,
                fieldType = this.getFieldType(),
                countryCd = this.getCountryCd(),
                format;

            if (!store) {
                return;
            }

            if (fieldType && countryCd) {
                format = store.getAt(store.findBy(function(record) {
                    return record.get('fieldType') === fieldType && record.get('countryCd') === countryCd
                }));
            }

            if (format) {
                this.validator = createValidator(new RegExp(format.get('validityTest')));
                this.formatElement.setHtml(format.get('mask'));
            } else {
                this.validator = null;
                this.formatElement.setHtml('');
            }
        },

        setValue : function(value) {
            this.callParent(arguments);

            if (!this.validateFormat(value)) {
                this.markInvalid('Check value');
            } else {
                this.clearInvalid();
            }
        },

        validateFormat : function(value) {
            return this.validator && value ? this.validator(value) : true;
        }
    };

});
