Ext.define('criterion.ux.form.field.EmployeeGroupComboBox', function() {

    return {

        alias : 'widget.criterion_employee_group_combobox',

        extend : 'Ext.form.field.Tag',

        requires : [
            'criterion.store.EmployeeGroups'
        ],

        config : {
            allowBlank : true,

            listenEmployerChange : false
        },

        fieldLabel : i18n.gettext('Employee Group'),

        store : {
            type : 'criterion_employee_groups',
            autoLoad : true
        },

        displayField : 'name',
        valueField : 'id',
        editable : true,
        emptyText : i18n.gettext('Not selected'),
        queryMode : 'local',
        minHeight : 36,
        useEmployerId : true,

        valuesStore : null,

        setValuesStore : function(valuesStore) {
            this.valuesStore = valuesStore;

            if (valuesStore.isLoaded()) {
                this.handleValuesStoreDataLoad();
            } else {
                this.mon(valuesStore, 'load', this.handleValuesStoreDataLoad, this);
            }
        },

        getValuesStore : function() {
            return this.valuesStore;
        },

        handleValuesStoreDataLoad : function() {
            var values = [];

            if (!this.valuesStore) {
                return;
            }

            this.valuesStore.each(function(rec) {
                values.push(rec.get('employeeGroupId'));
            });

            if (values.length) {
                this.setValue(values);
                this.resetOriginalValue();
            }
        },

        loadValuesForRecord : function(record) {
            var params = {},
                dfd = Ext.create('Ext.Deferred');

            this.reset();

            this.applyEmployerFilter(record.get('employerId'));

            if (record.phantom) {
                this.valuesStore.setData([], false);
                dfd.resolve();

                return dfd.promise
            }

            params[this.objectParam] = record.getId();

            if (this.valuesStore) {
                return this.valuesStore.loadWithPromise({
                    params : params
                });
            }

            dfd.resolve();

            return dfd.promise
        },

        applyEmployerFilter : function(employerId) {
            var store = this.getStore();

            store.isFiltered() && store.clearFilter();
            if (employerId && this.useEmployerId) {
                store.filter({
                    property : 'employerId',
                    value : employerId,
                    exactMatch : true
                });
            }
        },

        saveValuesForRecord : function(record) {
            var me = this,
                employeeGroupIdValues = this.getValue(),
                objectId = record.getId(),
                forRemove = [],
                presentValues = [],
                newValues,
                dfd;

            if (!this.valuesStore) {
                dfd = Ext.create('Ext.Deferred');
                dfd.resolve();

                return dfd.promise;
            }

            this.valuesStore.each(function(rec) {
                if (Ext.Array.indexOf(employeeGroupIdValues, rec.get('employeeGroupId')) !== -1) {
                    presentValues.push(rec.get('employeeGroupId'));
                } else {
                    forRemove.push(rec);
                }
            });
            if (forRemove.length) {
                this.valuesStore.remove(forRemove);
            }

            newValues = Ext.Array.difference(employeeGroupIdValues, presentValues);
            if (newValues.length) {
                Ext.Array.each(newValues, function(employeeGroupId) {
                    var value = {
                        employeeGroupId : employeeGroupId
                    };
                    value[me.objectParam] = objectId;

                    me.valuesStore.add(value);
                });
            }

            return this.valuesStore.syncWithPromise();
        },

        updateListenEmployerChange : function(value) {
            if (value) {
                Ext.GlobalEvents.on('employerChanged', this.onEmployerChange, this);
                this.useEmployerId = true;
            } else {
                Ext.GlobalEvents.un('employerChanged', this.onEmployerChange, this);
            }
        },

        onEmployerChange : function() {
            let employer;

            if (employer = criterion.Application.getEmployer()) {
                this.applyEmployerFilter(employer.getId());
            }
        },

        initComponent : function() {
            let me = this;

            me.callParent(arguments);

            if (me.getListenEmployerChange()) {
                let employer = criterion.Application.getEmployer();

                if (employer) {
                    me.applyEmployerFilter(employer.getId());
                }
            }
        }

    }
});
