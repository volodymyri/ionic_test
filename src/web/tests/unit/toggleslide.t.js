describe("ToggleSlide Tests", function(t) {

    // helpers
    var field, fieldVm, WAIT_MS = 200;

    function makeField(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody()
        }, config || {});

        field = Ext.create('criterion.ux.form.field.ToggleSlide', config);

        fieldVm = field.getViewModel();
    }

    // setup environment

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        //field = Ext.destroy(field);
    });

    // asserts helpers

    function assertFieldValue(t, value, rawValue) {
        t.expect(field.getValue()).toBe(value);
    }

    function clickInputAssert(t, input, expectedValue) {
        t.chain(
            {
                action : 'click',
                target : input.inputEl
            },
            function(next) {
                t.expect(input.getValue()).toBe(expectedValue);
                next();
            }
        )
    }

    function vmInputAssert(t, input, value) {
        fieldVm.set('v', input);
        fieldVm.notify();

        t.expect(field.getValue()).toBe(value);
    }

    // test

    t.describe('Initialization', function(t) {
        t.it('It should initialize without value', function(t) {
            makeField();

            assertFieldValue(t, false, false);
        });

        t.it('It should initialize with false value', function(t) {
            makeField();

            assertFieldValue(t, false, false);
        });

        t.it('It should initialize with true value', function(t) {
            makeField({
                value : true
            });

            assertFieldValue(t, true, true);
        });
    });

    t.describe('Initialization with value via ViewModel', function(t) {
        t.it('Should initialize with empty value', function(t) {
            makeField({
                viewModel : { data : { v : null } },
                bind : { value : '{v}'}
            });

            fieldVm.notify();

            assertFieldValue(t, false, false);
        });

        t.it('It should initialize with false value', function(t) {
            makeField({
                viewModel : { data : { v : false } },
                bind : { value : '{v}'}
            });

            fieldVm.notify();

            assertFieldValue(t, false, false);
        });

        t.it('It should initialize with true value', function(t) {
            makeField({
                viewModel : { data : { v : true } },
                bind : { value : '{v}'}
            });

            fieldVm.notify();

            assertFieldValue(t, true, true);
        });
    });

    t.describe('Input', function(t) {
        t.it('It should change value from false to true', function(t) {
            makeField();
            assertFieldValue(t, false, false);
            clickInputAssert(t, field, true);
        });
        t.it('It should change value from true to false', function(t) {
            makeField({value : true});
            assertFieldValue(t, true, true);
            clickInputAssert(t, field, false);
        });
    });

    t.describe('Input via ViewModel', function(t) {
        var fieldConfig = {
            viewModel : { data : { v : null } },
            bind : { value : '{v}'}
        };

        t.it('It should change value from false to true on click', function(t) {
            makeField(fieldConfig);
            vmInputAssert(t, true, true);
        });
        t.it('It should change value from true to false on click', function(t) {
            makeField(fieldConfig);
            vmInputAssert(t, false, false);
        });
    });

    /**
     * these two test doesn't have asserts, you need to check it visually.
     */
    t.describe('CRITERION-4749', function(t) {
        var panel;

        t.afterEach(function() {
            panel = Ext.destroy(panel);
        });

        t.it('should correctly change value in hidden container', function(t) {
            panel = Ext.create('Ext.panel.Panel', {
                renderTo : Ext.getBody(),
                items : [
                    {
                        xtype : 'toggleslidefield',
                        value : true
                    }
                ]
            });

            var field = panel.down('toggleslidefield');

            t.chain(
                function(next) {
                    panel.hide();
                    field.setValue(false);
                    next();
                },
                {
                    waitFor : WAIT_MS
                },
                function(next) {
                    panel.show();
                    next();
                }
            );
        });

        t.it('should correctly render element in hidden container', function(t) {
            panel = Ext.create('Ext.panel.Panel', {
                renderTo : Ext.getBody(),
                hidden : true,
                items : [
                    {
                        xtype : 'toggleslidefield',
                        value : true
                    }
                ]
            });

            t.chain(
                {
                    waitFor : WAIT_MS
                },
                function(next) {
                    panel.show();
                    next();
                }
            );
        });
    })

});
