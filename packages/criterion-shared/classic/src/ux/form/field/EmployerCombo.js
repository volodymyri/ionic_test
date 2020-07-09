Ext.define('criterion.ux.form.field.EmployerCombo', function() {

    const inactiveText = Ext.String.format(' ({0})', i18n.gettext('Inactive'));

    return {

        alias : 'widget.criterion_employer_combo',

        extend : 'Ext.form.field.ComboBox',

        requires : [
            'criterion.store.Employers'
        ],

        valueField : 'id',
        displayField : 'legalName',

        forceSelection : true,

        autoSelect : true,

        editable : true,

        minChars : 1,

        typeAhead : true,

        typeAheadDelay : 50,

        allowBlank : false,

        queryMode : 'local',

        nullValueText : i18n.gettext('All'),

        nullRecord : null,

        autoSetFirst : false,

        autoSetSingleEmployer : true,

        tpl : Ext.create(
            'Ext.XTemplate',
            '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{legalName:htmlEncode}',
                    '<tpl if="!isActive">' + inactiveText + '</tpl></li>',
                '</tpl>' +
            '</ul>'
        ),

        displayTpl : Ext.create(
            'Ext.XTemplate',
            '<tpl for=".">',
                '{legalName}',
                '<tpl if="!isActive">' + inactiveText + '</tpl>',
            '</tpl>'
        ),

        initComponent : function() {
            let employersStore = Ext.StoreManager.lookup('Employers');

            this.bindStore(Ext.create('criterion.store.Employers', {
                autoSync : false
            }), true);

            this.callParent(arguments);

            if (employersStore.isLoaded()) {
                Ext.defer(this.handleEmployersLoaded, 10, this);
            }

            employersStore.on({
                scope : this,
                load : this.handleEmployersLoaded,
                datachanged : this.handleEmployersLoaded
            });
        },

        getValue : function() {
            let value = this.callParent(arguments);

            if (this.nullRecord && value < 0) {
                value = null;
            }

            return value;
        },

        setValue : function(value) {
            if (this.nullRecord && value == null) {
                value = this.nullRecord.getId();
            } else if (this.autoSetFirst && !value) {
                value = this.getFirstValue();
            }

            return this.callParent([value]);
        },

        getFirstValue : function() {
            let first = this.getStore().getAt(0);

            return first ? first.getId() : null;
        },

        handleEmployersLoaded : function() {
            let me = this,
                employersStore = Ext.StoreManager.lookup('Employers'),
                records = employersStore.getRange(),
                item = {},
                sorters;

            if (!me.store) {
                return;
            }

            if (me.allowBlank && employersStore.count() > 1) {
                item[me.valueField] = null;
                item[me.displayField] = me.nullValueText;
                item['autoGroup'] = 0;

                if (me.sortByDisplayField) {
                    Ext.Array.each(records, function(rec) {
                        rec.set('autoGroup', 1, {
                            dirty : false,
                            silent : true
                        });
                    });
                    me.store.group('autoGroup', 'ASC');
                }

                records.unshift(item);
            }

            me.store.loadData(records);
            sorters = me.store.getSorters();

            if (sorters && !sorters.find('_property', me.displayField)) {
                me.store.sort({
                    property : me.displayField,
                    direction : 'ASC'
                });
            }

            me.allowBlank ? me.nullRecord = me.getStore().getAt(0) : null;
            me.setValue(me.getValue());

            if (me.autoSetSingleEmployer && (employersStore.count() === 1)) {
                let employerBar = me.up('criterion_settings_employer_bar');

                if (employerBar) {
                    employerBar.setHidden(true);
                }

                this.setValue(this.getFirstValue());
                me.setReadOnly(true);
                me.setHidden(true);
            }

            me.fireEvent('employersLoaded');
        }
    };

});
