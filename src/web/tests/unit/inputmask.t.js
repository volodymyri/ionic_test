describe("InputMask Tests", function(t) {

    t.wait('require');

    Ext.require(['criterion.ux.form.field.plugin.InputMask', 'criterion.Consts'], function() {

        t.endWait('require');

        // helpers
        var field, fieldVm, plugin, WAIT_MS = 10;

        function makeField(config, pluginConfig) {
            var config = Ext.Object.merge({
                renderTo : Ext.getBody(),
                plugins : [
                    Ext.Object.merge({
                        ptype : 'inputmask'
                    }, pluginConfig || {})
                ]
            }, config || {});

            field = Ext.create('Ext.form.field.Text', config);

            fieldVm = field.getViewModel();

            plugin = field.getPlugin('inputmask');
        }

        // setup environment

        // setup / teardown methods

        t.beforeEach(function() {

        });

        t.afterEach(function() {
            field = Ext.destroy(field);
        });

        // asserts helpers

        function assertFieldValue(t, value, rawValue, noFocus) {
            t.expect(field.getValue()).toBe(value);

            !noFocus && field.focus();

            t.waitForMs(WAIT_MS, function() {
                t.expect(field.getValue()).toBe(value);
                t.expect(field.getRawValue()).toBe(rawValue);
            });
        }

        function textInputAssert(t, input, value, rawValue) {
            t.chain(
                {
                    click : field // need to focus first, otherwise caret will be incorrectly placed
                },
                {
                    waitFor : WAIT_MS
                },
                {
                    type : input,
                    target : field
                },
                {
                    waitFor : WAIT_MS
                },
                function(next) {
                    t.expect(field.getValue()).toBe(value);
                    t.expect(field.getRawValue()).toBe(rawValue);
                    field.blur();
                    next();
                },
                {
                    waitFor : WAIT_MS
                },
                function(next) {
                    t.expect(field.getValue()).toBe(value);
                }
            )
        }

        function vmInputAssert(t, input, value, rawValue) {
            fieldVm.set('v', input);
            fieldVm.notify();

            t.expect(field.getValue()).toBe(value);
            t.expect(field.getRawValue()).toBe(rawValue);
        }

        // test

        t.describe('Initialization', function(t) {

            t.it('It should initialize without any extra parameters', function(t) {
                makeField();

                assertFieldValue(t, '', '');
            });

            t.it('It should initialize with format config', function(t) {
                makeField(null, {
                    format : '****'
                });

                assertFieldValue(t, '', '____');
            });

            t.it('It should dynamically change format from empty to something', function(t) {
                makeField();

                plugin.setFormat('****');

                assertFieldValue(t, '', '____');
            });

            t.it('It should dynamically change format from something to something', function(t) {
                makeField(null, {
                    format : '****'
                });

                plugin.setFormat('**');

                assertFieldValue(t, '', '__');
            });

            t.it('It should dynamically change format from something to empty', function(t) {
                makeField(null, {
                    format : '****'
                });

                plugin.setFormat(null);

                assertFieldValue(t, '', '');
            });

            t.it('It should honor placeholder config', function(t) {
                makeField(null, {
                    format : '****',
                    placeholder : '-'
                });

                assertFieldValue(t, '', '----');
            });

            t.todo('Initialization with value', function(t) {
            });
        });

        t.describe('Initialization with value via ViewModel', function(t) {
            t.it('Should initialize with empty value', function(t) {
                makeField({
                    viewModel : { data : { v : null } },
                    bind : { value : '{v}'}
                }, {
                    format : '****'
                });

                assertFieldValue(t, '', '', true);
            })
        });

        t.describe('Input', function(t) {
            var format = '##-##-##';

            t.it('It should accept correct input', function(t) {
                makeField(null, {
                    format : format
                });

                textInputAssert(t, '123456', '123456','12-34-56');
            });

            t.it('It should accept correct input after format change from empty', function(t) {
                makeField();

                plugin.setFormat(format);

                textInputAssert(t, '123456', '123456','12-34-56');
            });

            t.it('It should accept correct input after format change to empty', function(t) {
                makeField(null, {
                    format : format
                });

                plugin.setFormat();

                textInputAssert(t, '123456', '123456','123456');
            });

            t.it('It should reject incorrect input', function(t) {
                makeField(null, {
                    format : format
                });

                textInputAssert(t, '1234', '', '12-34-__');
            });

            t.it('It should reject input in read only mode', function(t) {
                makeField({
                    readOnly : true
                }, {
                    format : format
                });

                textInputAssert(t, '123456', '', '');
            });

            t.it('It should reject input after readOnly set to true', function(t) {
                makeField(null, {
                    format : format
                });

                field.setReadOnly(true);

                textInputAssert(t, '123456', '', '');
            });

            t.it('It should accept input after readOnly set to false', function(t) {
                makeField({
                    readOnly : true
                }, {
                    format : format
                });

                field.setReadOnly(false);

                textInputAssert(t, '123456', '123456','12-34-56');
            });
        });

        t.describe('ViewModel binding', function(t) {
            var format = '##-##-##',
                fieldConfig = {
                    viewModel : { data : { v : null } },
                    bind : { value : '{v}'}
                };

            t.it('It should accept correct input', function(t) {
                makeField(fieldConfig, {
                    format : format
                });

                vmInputAssert(t, '123456','123456','12-34-56');
            });

            t.it('It should accept correct input after format change from empty', function(t) {
                makeField(fieldConfig);

                plugin.setFormat(format);

                vmInputAssert(t, '123456', '123456','12-34-56');
            });

            t.it('It should accept correct input after format change to empty', function(t) {
                makeField(fieldConfig, {
                    format : format
                });

                plugin.setFormat();

                vmInputAssert(t, '123456', '123456','123456');
            });

            t.it('It should reject incorrect input', function(t) {
                makeField(fieldConfig, {
                    format : format
                });

                vmInputAssert(t, '1234', '', '12-34-__');
            });
        });

        function assertValidity(t, v) {
            t.expect(field.isValid()).toBe(v);
            t.expect(field.validate()).toBe(v);
            t.expect(field.triggerWrap.hasCls(field.triggerWrapInvalidCls)).toBe(!v);
        }

        t.describe('Validation', function(t) {
            var format = "###-##-####",
                re = new RegExp("^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$"),
                pConf = {
                    format : format
                };

            Ext.form.field.VTypes['test'] = function(value) {
                return re.test('value');
            };

            t.it('Should validate incorrect by vtype', function(t) {
                makeField({
                    vtype : 'test'
                }, pConf);

                field.setValue('12345678');

                t.expect(field.isValid()).toBe(false);
            });

            t.it('Should validate empty by vtype if allowBlank is false', function(t) {
                makeField({
                    vtype : 'test',
                    allowBlank : false
                }, pConf);

                assertValidity(t, false);
            });

            t.it('Should not validate empty by vtype if allowBlank is true', function(t) {
                makeField({
                    vtype : 'test',
                    allowBlank : true,
                    validateOnBlur : true
                }, pConf);

                assertValidity(t, true);
            });

            t.it('Should not validate empty by vtype on blur', function(t) {
                makeField({
                    vtype : 'test',
                    allowBlank : true,
                    validateOnBlur : true
                }, pConf);

                t.chain(
                    function(next) {
                        field.focus();
                        next();
                    },
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        field.blur();
                        next();
                    },
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        assertValidity(t, true);
                    }
                );
            });
        });
    });
});
