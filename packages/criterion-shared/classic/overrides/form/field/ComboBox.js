Ext.define('criterion.classic.overrides.form.field.ComboBox', {

    override : 'Ext.form.field.ComboBox',

    config : {
        expandOnFocus : true
    },

    measurer : null,
    selectOnFocus : true,
    sortByDisplayField : true,
    resetOnDataChanged : false,
    widthToContent : false,
    encodeHtml : true,
    forceSelection : true,
    editable : false,
    anyMatch : true, // to allow matching of the typed characters at any position in the valueField's value.

    listConfig : {
        getInnerTpl : function(displayField) {
            return '{' + displayField + (this.pickerField.encodeHtml ? ':htmlEncode' : '') + '}';
        }
    },

    initComponent : function() {
        if (this.selectOnFocus && !this.editable) {
            this.selectOnFocus = false;
        }

        this.callParent(arguments);

        let store = this.getStore();

        if (store && this.sortByDisplayField) {
            store.on('load', this.applyDefaultSorter, this, {single : true});
        }
    },

    applyDefaultSorter : function() {
        let store = this.getStore(),
            displayField = this.getDisplayField(),
            sorters = store && store.getSorters();

        if (sorters && !sorters.count()) {
            store.sort({
                property : displayField,
                direction : 'ASC'
            });
        }
    },

    initEvents : function() {
        if (this.editable && this.getExpandOnFocus()) {
            this.mon(this.inputEl, 'click', this.onTriggerClick, this);
        }

        this.callParent(arguments);
    },

    onBindStore : function(store, initial) {
        this.callParent(arguments);

        if (this.resetOnDataChanged) {
            this.reset && this.reset();
        }

        if (store && this.sortByDisplayField) {
            this.applyDefaultSorter();
        }

        this.fireEvent('bindstore', this, store);
    },

    onDataChanged : function() {
        this.callParent(arguments);

        if (this.resetOnDataChanged) {
            this.reset && this.reset();
        }
    },

    getDisplayValue : function() {
        return this.displayTpl && this.callParent(arguments);
    },

    setRawValue : function(value) {
        if (this.widthToContent) {

            if (!this.measurer) {
                this.measurer = new Ext.util.TextMetrics(this.inputEl);
            }

            let width = this.measurer.getWidth(value);

            width += this.inputEl.getPadding('lr') + this.inputEl.getMargin('lr') + this.triggers.picker.el.getWidth();
            this.setWidth(width);
        }

        this.callParent(arguments);
    },

    setValue : function(value) {
        this.callParent(arguments);

        //Resetting initial value. Required for dirty forms and associated data as well.
        if (this.bind && this.bind.value && this.bind.value.stub && this.bind.value.stub.parentValue && !this.bind.value.stub.parentValue.dirty) {
            this.resetOriginalValue();
        }
    },

    doSetValue : function(value) {
        let result = this.callParent(arguments);

        if (value && this.disabled && this.valueNotFoundText && this.getStore().findExact(this.valueField, value) === -1) {
            this.setRawValue(this.valueNotFoundText);
        }

        return result;
    },

    completeEdit : function() {
        if (!this.disabled && !this.readOnly) {
            this.callParent(arguments);
        }
    },

    /**
     *  fixed this.displayTpl -> this.getDisplayTpl()
     */
    updateDisplayField : function(displayField) {
        // force displayTpl refresh when displayField changes
        if (displayField && !this.getDisplayTpl() || this.getDisplayTpl().auto) {
            this.setDisplayTpl(false);
        }
    }
});
