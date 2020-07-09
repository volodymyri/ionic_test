describe("CurrencyField Tests", function(t) {
    // helpers
    var field, fieldVm, WAIT_MS = 10;

    function makeField(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody()
        }, config || {});

        field = Ext.create('criterion.ux.form.CurrencyField', config);

        fieldVm = field.getViewModel();
    }

    // setup environment

    // setup / teardown methods

    t.beforeEach(function() {
        criterion.LocalizationManager.setGlobalFormat({
            thousandSeparator : ',',
            decimalSeparator : '.',
            amountPrecision : 2,
            currencySign : '$',
            currencyAtEnd : false
        });
    });

    t.afterEach(function() {
        field = Ext.destroy(field);
    });

    t.waitForThrottledAjax(function() {
        t.describe('Formatting w/o global settings - todo.', function(t) {
            t.todo('useGlobalFormat', function(t) {
            });
            t.todo('currencySymbolPos', function(t) {
            });
            t.todo('currencySeparator', function(t) {
            });
            t.todo('useThousandSeparator', function(t) {
            });
            t.todo('thousandSeparator', function(t) {
            });
            t.todo('decimalSeparator', function(t) {
            });
            t.todo('alwaysDisplayDecimals', function(t) {
            });
        });

        t.describe('Formatting of initial value.', function(t) {

            t.it('Should add precision symbol for whole numbers', function(t) {
                var value = 1;

                makeField({
                    value : value
                });

                t.expect(field.getRawValue()).toContain(Ext.util.Format.decimalSeparator);
                t.expect(field.getRawValue()).toBe('$1.00');
                t.expect(field.getValue()).toBe(value);
                t.expect(field.isValid()).toBe(true);
            });

            t.it('Should correctly format floats with given precision', function(t) {
                var value = 1.01;

                makeField({
                    value : value
                });

                t.expect(field.getRawValue()).toContain(Ext.util.Format.decimalSeparator);
                t.expect(field.getRawValue()).toBe('$1.01');
                t.expect(field.getValue()).toBe(value);
                t.expect(field.isValid()).toBe(true);
            });

            t.it('Should correctly format floats with extra precision', function(t) {
                var value = 1.011;

                makeField({
                    value : value
                });

                t.expect(field.getRawValue()).toContain(Ext.util.Format.decimalSeparator);
                t.expect(field.getRawValue()).toBe('$1.01');
                t.expect(field.getValue()).toBe(1.01);
                t.expect(field.isValid()).toBe(true);
            });

            t.it('Should display thousands separator', function(t) {
                var value = 1000;

                makeField({
                    value : value
                });

                t.expect(field.getRawValue()).toContain(Ext.util.Format.thousandSeparator);
                t.expect(field.getRawValue()).toBe('$1,000.00');
                t.expect(field.getValue()).toBe(value);
                t.expect(field.isValid()).toBe(true);
            });

            t.it('Should correctly format large numbers', function(t) {
                var value = 1000000.01;

                makeField({
                    value : value
                });

                t.expect(field.getRawValue()).toBe('$1,000,000.01');
                t.expect(field.getValue()).toBe(value);
                t.expect(field.isValid()).toBe(true);
            });

            t.it('Should correctly format negative numbers', function(t) {
                var value = -1000000.01;

                makeField({
                    value : value
                });

                t.expect(field.getRawValue()).toBe('-$1,000,000.01');
                t.expect(field.getValue()).toBe(value);
                t.expect(field.isValid()).toBe(true);
            });

            t.it('Should correctly format null', function(t) {
                var value = null;

                makeField({
                    value : value
                });

                t.expect(field.getRawValue()).toBe('');
                t.expect(field.getValue()).toBe(value);
                t.expect(field.isValid()).toBe(true);
            });

        });

        t.describe('Reformat on global settings change.', function(t) {
            t.it('Should correctly reformat on global settings change', function(t) {
                var value = 1000000.01;

                makeField({
                    value : value
                });

                t.expect(field.getRawValue()).toBe('$1,000,000.01');
                t.expect(field.getValue()).toBe(value);

                criterion.LocalizationManager.setGlobalFormat({
                    thousandSeparator : ' ',
                    decimalSeparator : ',',
                    amountPrecision : 3,
                    currencySign : '£',
                    currencyAtEnd : true
                });

                t.expect(field.getRawValue()).toBe('1 000 000,010£');
                t.expect(field.getValue()).toBe(value);
                t.expect(field.isValid()).toBe(true);
            });
        });

        t.describe('Formatting on setValue()', function(t) {

            t.it('Should correctly format whole numbers', function(t) {
                var value = 1;

                makeField();
                field.setValue(value);

                t.expect(field.getRawValue()).toBe('$1.00');
                t.expect(field.getValue()).toBe(value);
            });

            t.it('Should correctly format floats', function(t) {
                var value = 1.01;

                makeField();
                field.setValue(value);

                t.expect(field.getRawValue()).toBe('$1.01');
                t.expect(field.getValue()).toBe(value);
            });

            t.it('Should correctly format large numbers', function(t) {
                var value = 1000000.01;

                makeField();
                field.setValue(value);

                t.expect(field.getRawValue()).toBe('$1,000,000.01');
                t.expect(field.getValue()).toBe(value);
            });

        });

        t.describe('Formatting on focus()', function(t) {

            t.it('Should correctly reformat on focus', function(t) {
                var value = 1000;

                makeField({value : value});
                field.focus();

                t.waitForMs(WAIT_MS, function() {
                    t.expect(field.getRawValue()).toBe('1000.00');
                });
            });

            t.it('Should correctly reformat on focus leave', function(t) {
                var value = 1000;

                makeField({value : value});
                field.focus();

                t.waitForMs(WAIT_MS, function() {
                    field.blur();
                    t.waitForMs(1, function() {
                        t.expect(field.getRawValue()).toBe('$1,000.00');
                    });
                });
            });

        });

        function textInputAssert(t, config) {
            return function(t) {
                t.it('Should not reformat on enter', function(t) {
                    makeField(config);

                    t.chain(
                        {
                            click : field // need to focus first, otherwise caret will be incorrectly placed
                        },
                        {
                            wait : WAIT_MS
                        },
                        {
                            type : '1000',
                            target : field
                        },
                        {
                            waitFor : WAIT_MS
                        },
                        function(next) {
                            t.expect(field.getRawValue()).toBe('1000');
                            field.blur();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(field.getRawValue()).toBe('$1,000.00');
                            t.expect(field.getValue()).toBe(1000);
                        }
                    );
                });

                t.it('Should not allow incorrect characters', function(t) {
                    makeField(config);

                    t.chain(
                        {
                            click : field // need to focus first, otherwise caret will be incorrectly placed
                        },
                        {
                            type : '10  00 &*.0,12',
                            target : field
                        },
                        function(next) {
                            t.expect(field.getRawValue()).toBe('1000.012');
                            t.expect(field.getValue()).toBe(1000.01);
                            field.blur();
                            next();
                        },
                        {
                            wait : WAIT_MS
                        },
                        function(next) {
                            t.expect(field.getRawValue()).toBe('$1,000.01');
                            t.expect(field.getValue()).toBe(1000.01);
                        }
                    );
                });
            }
        }

        t.describe('Formatting on text input', textInputAssert(t));
        t.describe('Formatting on text input, VM binding', textInputAssert(t, {
            viewModel : {data : {val : null}},
            bind : {value : '{val}'}
        }));

        t.describe('Formatting of ViewModel value.', function(t) {
            var config = {
                viewModel : {data : {val : null}},
                bind : {value : '{val}'}
            };

            t.it('Should correctly format sample number', function(t) {
                var value = 1000000.01;

                makeField(config);
                fieldVm.set('val', value);
                fieldVm.notify();

                t.expect(field.getRawValue()).toBe('$1,000,000.01');
                t.expect(field.getValue()).toBe(value);
            });

            t.it('Should correctly format on update', function(t) {
                var value = 1000000.01, value2 = 2000000.01;

                makeField(config);

                fieldVm.set('val', value);
                fieldVm.notify();
                t.expect(field.getRawValue()).toBe('$1,000,000.01');
                t.expect(field.getValue()).toBe(value);

                fieldVm.set('val', value2);
                fieldVm.notify();
                t.expect(field.getRawValue()).toBe('$2,000,000.01');
                t.expect(field.getValue()).toBe(value2);
            });
        });
    })
});
