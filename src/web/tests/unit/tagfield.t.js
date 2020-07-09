describe("TagField Tests", function(t) {

    // setup test classes
    Ext.define('criterion.test.TagModel', {
        extend : 'Ext.data.Model',
        proxy : {
            type : 'memory'
        },
        fields : [
            {
                type : 'string',
                name : 'name'
            }
        ]
    });

    Ext.define('criterion.test.TagValuesModel', {
        extend : 'Ext.data.Model',
        proxy : {
            type : 'memory'
        },
        fields : [
            {
                type : 'int',
                name : 'linkId'
            }
        ]
    });

    Ext.define('criterion.test.TagStore', {
        extend : 'Ext.data.Store',
        model : 'criterion.test.TagModel',
        data : [
            {
                'id' : 1,
                'name' : 'Name 1'
            },
            {
                'id' : 2,
                'name' : 'Name 2'
            }
        ]
    });

    Ext.define('criterion.test.TagValuesStore', {
        extend : 'Ext.data.Store',
        model : 'criterion.test.TagValuesModel'
    });

    // helpers
    var field, fieldVm, store, valuesStore;

    function makeTagValuesModel(linkId) {
        return Ext.create('criterion.test.TagStore', {
            linkId : linkId
        });
    }

    function makeTagStore(storeOpts) {
        return store = Ext.create('criterion.test.TagStore', storeOpts || {});
    }

    function makeTagValuesStore(storeOpts) {
        return valuesStore = Ext.create('criterion.test.TagValuesStore', storeOpts || {});
    }

    function makeField(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody(),

            valueField : 'id',
            displayField : 'name',

            linkField : 'linkId'
        }, config || {});

        field = Ext.create('criterion.ux.form.field.Tag', config);
        fieldVm = field.getViewModel();
    }

    // setup environment

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        field = Ext.destroy(field);
    });

    t.waitForThrottledAjax(function() {

        t.describe('Sync values store to value', function(t) {

            t.it('Initial Null value', function(t) {
                var value = null;

                makeField({
                    value : value,
                    store : store || makeTagStore(),
                    valuesStore : makeTagValuesStore()
                });

                t.expect(valuesStore.getCount()).toBe(0);
            });

            t.it('Initial String value', function(t) {
                var value = '1,2';

                makeField({
                    value : value,
                    store : store || makeTagStore(),
                    valuesStore : makeTagValuesStore()
                });

                t.expect(valuesStore.getCount()).toBe(2);
                t.expect(valuesStore.findRecord('linkId', 1)).not.toBeNull();
                t.expect(valuesStore.findRecord('linkId', 2)).not.toBeNull();
            });

            t.it('Initial Array value', function(t) {
                var value = [1, 2];

                makeField({
                    value : value,
                    store : store || makeTagStore(),
                    valuesStore : makeTagValuesStore()
                });

                t.expect(valuesStore.getCount()).toBe(2);
                t.expect(valuesStore.findRecord('linkId', 1)).not.toBeNull();
                t.expect(valuesStore.findRecord('linkId', 2)).not.toBeNull();
            });

            t.it('Initial Array value, bind stores', function(t) {
                var value = [1, 2];

                makeField({
                    value : value,
                    viewModel : {
                        stores : {
                            store : store || makeTagStore(),
                            valuesStore : makeTagValuesStore()
                        }
                    },
                    bind : {
                        store : '{store}',
                        valuesStore : '{valuesStore}'
                    }
                });

                fieldVm.notify();

                t.expect(valuesStore.getCount()).toBe(2);
                t.expect(valuesStore.findRecord('linkId', 1)).not.toBeNull();
                t.expect(valuesStore.findRecord('linkId', 2)).not.toBeNull();
            });

            t.it('Set value', function(t) {
                makeField({
                    store : store || makeTagStore(),
                    valuesStore : makeTagValuesStore()
                });

                field.setValue(1);
                t.expect(valuesStore.getCount()).toBe(1);
                t.expect(valuesStore.findRecord('linkId', 1)).not.toBeNull();

                field.setValue(2);
                t.expect(valuesStore.getCount()).toBe(1);
                t.expect(valuesStore.findRecord('linkId', 2)).not.toBeNull();

                field.setValue([1, 2]);
                t.expect(valuesStore.getCount()).toBe(2);
                t.expect(valuesStore.findRecord('linkId', 1)).not.toBeNull();
                t.expect(valuesStore.findRecord('linkId', 2)).not.toBeNull();
            });

            t.it('Set Array value, bind stores & value', function(t) {
                makeField({
                    viewModel : {
                        stores : {
                            store : store || makeTagStore(),
                            valuesStore : makeTagValuesStore()
                        },
                        data : {
                            val : null
                        }
                    },
                    bind : {
                        store : '{store}',
                        valuesStore : '{valuesStore}',
                        value : '{val}'
                    }
                });

                fieldVm.set('val', 1);
                fieldVm.notify();
                t.expect(valuesStore.getCount()).toBe(1);
                t.expect(valuesStore.findRecord('linkId', 1)).not.toBeNull();

                fieldVm.set('val', 2);
                fieldVm.notify();
                t.expect(valuesStore.getCount()).toBe(1);
                t.expect(valuesStore.findRecord('linkId', 2)).not.toBeNull();

                fieldVm.set('val', [1, 2]);
                fieldVm.notify();
                t.expect(valuesStore.getCount()).toBe(2);
                t.expect(valuesStore.findRecord('linkId', 1)).not.toBeNull();
                t.expect(valuesStore.findRecord('linkId', 2)).not.toBeNull();
            });
        });


        t.describe('Sync value to values store', function(t) {

            t.it('Load data to store', function(t) {
                var valuesStore = makeTagValuesStore(),
                    records = [
                        makeTagValuesModel(1),
                        makeTagValuesModel(2)
                    ];

                makeField({
                    store : store || makeTagStore(),
                    valuesStore : valuesStore
                });

                valuesStore.loadData(records);
                valuesStore.fireEvent('load', valuesStore, records);

                var value = field.getValue();

                t.expect(value).not.toBeNull();
                t.expect(value.length).toBe(2);
                t.expect(value[0]).toBe(1);
                t.expect(value[1]).toBe(2);
            });

            t.it('Load data to store, bind stores & value', function(t) {
                var valuesStore = makeTagValuesStore(),
                    records = [
                        makeTagValuesModel(1),
                        makeTagValuesModel(2)
                    ];

                makeField({
                    viewModel : {
                        stores : {
                            store : store || makeTagStore(),
                            valuesStore : valuesStore
                        },
                        data : {
                            val : null
                        }
                    },
                    bind : {
                        store : '{store}',
                        valuesStore : '{valuesStore}',
                        value : '{val}'
                    }
                });

                fieldVm.notify();

                valuesStore.loadData(records);
                valuesStore.fireEvent('load', valuesStore, records);

                var value = fieldVm.get('val');

                t.expect(value).not.toBeNull();
                t.expect(value.length).toBe(2);
                t.expect(value[0]).toBe(1);
                t.expect(value[1]).toBe(2);
            });
        });
    })
});