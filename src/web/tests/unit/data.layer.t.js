describe("Data Layer tests", function(t) {

    // helpers
    var record, store, firstNested, secondNested;

    function captureFn(object, methodName, dest) {
        var method = object[methodName] || Ext.emptyFn;

        return (object[methodName] = function() {
            captureFn.data[dest] = method.apply(this, arguments);
            return captureFn.data[dest];
        });
    }

    captureFn.data = {};

    function createRecord(opts) {
        record = Ext.create('criterion.model.Nested', Ext.apply({}, opts || {}));

        captureFn(record.getProxy().getWriter(), 'getRecordData', 'recordData');
    }

    function createWithNested() {
        createRecord();

        firstNested = Ext.create('criterion.model.Test');
        secondNested = Ext.create('criterion.model.Test2');

        firstNested.nested1().add(secondNested);
        record.nested().add(firstNested);
    }

    // setup environment

    Ext.define('criterion.model.Test2', {
        extend : 'criterion.data.Model'
    });

    Ext.define('criterion.model.Test', {
        extend : 'criterion.data.Model',
        fields : [
            {
                name : 'string1',
                type : 'string'
            }
        ],
        hasMany : [
            {
                model : 'criterion.model.Test2',
                name : 'nested1',
                associationKey : 'nested1',
                commitUpdates : true
            }
        ]
    });

    Ext.define('criterion.model.Nested', {
        extend : 'criterion.data.Model',

        proxy : {
            type : 'criterion_rest',
            url : '/api-mock/test/dataLayer/nested'
        },

        hasMany : [
            {
                model : 'criterion.model.Test',
                name : 'nested',
                associationKey : 'nested',
                commitUpdates : true
            }
        ]
    });

    Ext.define('criterion.store.Nested', {
        extend : 'criterion.data.Store',
        model : 'criterion.model.Nested'
    });

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        record = Ext.destroy(record);
    });

    // asserts helpers

    // test

    t.describe('JSON writer', function(t) {
        t.it('Should include nested data with commitUpdates : true', function(t) {
            createWithNested();

            t.chain([
                function(next) {
                    record.saveWithPromise();
                    t.expect(captureFn.data.recordData.nested.length).toBe(1);
                    t.expect(captureFn.data.recordData.nested[0].nested1.length).toBe(1);
                    next();
                },
                {
                    waitFor : 'ThrottledAjax'
                }
            ])
        });

        // failing assert due to compatibility; should be fixed after commitUpdates are intriduced on all necessary associations
        /*
        t.it('Should not include nested data with commitUpdates : false, first level', function(t) {
            createWithNested();

            record.associations.nested.commitUpdates = false;

            t.chain([
                function(next) {
                    record.saveWithPromise();
                    t.expect(captureFn.data.recordData.nested).toBeFalsy();
                    record.associations.nested.commitUpdates = true;
                    next();
                },
                {
                    waitFor : 'ThrottledAjax'
                }
            ])
        });
        */

        t.it('Should not include nested data with commitUpdates : false, second level', function(t) {
            createWithNested();

            firstNested.associations.nested1.commitUpdates = false;

            t.chain([
                function(next) {
                    record.saveWithPromise();
                    t.expect(captureFn.data.recordData.nested.length).toBe(1);
                    t.expect(captureFn.data.recordData.nested[0].nested1).toBeFalsy();
                    firstNested.associations.nested1.commitUpdates = true;
                    next();
                },
                {
                    waitFor : 'ThrottledAjax'
                }
            ])
        });
    });

    t.describe('Nested models', function(t) {

        t.it('Should parse nested response from GET', function(t) {
            var firstNested, secondNested;

            createRecord({id : 1});

            t.chain([
                function(next) {
                    record.loadWithPromise();
                    next();
                },
                {
                    waitFor : 'ThrottledAjax'
                },
                function(next) {
                    t.expect(record.nested().getRange().length).toBe(1);

                    firstNested = record.nested().getAt(0);

                    t.expect(firstNested.getId()).toBe(2);
                    t.expect(firstNested.nested1().getRange().length).toBe(1);

                    secondNested = firstNested.nested1().getAt(0);

                    t.expect(secondNested.getId()).toBe(3);
                }
            ])
        });

        t.it('Should parse nested response from POST', function(t) {
            createWithNested();

            t.chain([
                function(next) {
                    record.saveWithPromise();
                    t.expect(captureFn.data.recordData.nested.length).toBe(1);
                    t.expect(captureFn.data.recordData.nested[0].nested1.length).toBe(1);
                    next();
                },
                {
                    waitFor : 'ThrottledAjax'
                },
                function(next) {
                    t.expect(record.getId()).toBe(1);
                    t.expect(firstNested.getId()).toBe(2);
                    t.expect(secondNested.getId()).toBe(3);
                }
            ])
        });

        t.todo('Should parse nested response from PUT', function(t) {
        });

    });

    });
