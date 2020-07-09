/**
 * criterion_time_field.t
 */
describe('criterion.ux.form.field.Time', function(t) {

    // helpers

    var app, view,
        WAIT_MS = 10;

    function makeView(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody()
        }, config || {});

        view = Ext.create('criterion.ux.form.field.Time', config);
    }

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        //view = Ext.destroy(view);
    });

    // asserts

    // setup environment

    t.wait('setup');

    Ext.Deferred.sequence([
        function() {
            return criterion.Api.isAuthenticated();
        },
        function() {
            return criterion.CodeDataManager.loadCodeTables();
        }
    ]).then(function() {
        app = Ext.create('criterion.Application', {name : 'ut'});

        Ext.GlobalEvents.on('baseStoresLoaded', function() {

            t.endWait('setup');

            // base
            t.describe('Base init', function(t) {

                t.it('check', function(t) {
                    makeView();

                    t.chain([
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            view.setValue(new Date());
                            next();
                        }
                    ])
                });
            });

        });
    });
});
