describe("Criterion TimeField Tests", function(t) {
    // helpers
    var field, fieldVm, WAIT_MS = 10;

    function makeField(config) {
        var config = Ext.Object.merge({}, config || {});

        field = Ext.create('criterion.ux.field.Time', config);

        Ext.Viewport.items.first().add(field);

        fieldVm = field.getViewModel();
    }

    // setup environment

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        //field = Ext.destroy(field);
    });

    Ext.application({name : 'ut', mainView : 'Ext.Container'});

    t.describe('Initial value.', function(t) {

        t.it('set bind value', function(t) {
            var value = Ext.Date.parse('1970-01-01 08:30:00', criterion.consts.Api.RAW_DATE_TIME_FORMAT);

            makeField({
                viewModel : {data : {val : null}},
                bind : {
                    value : '{val}'
                },
                format : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            });

            fieldVm.set('val', value);
            fieldVm.notify();

            t.expect(field.getValue()).toBe('08:30');

        });

        t.it('set bind value not in 15 minute range', function(t) {
            var expectedValue = Ext.Date.parse('12:55:00', criterion.consts.Api.TIME_FORMAT_FULL),
                value = Ext.Date.parse('1970-01-01 12:55:00', criterion.consts.Api.RAW_DATE_TIME_FORMAT);

            makeField({
                viewModel : {data : {val : null}},
                bind : {
                    value : '{val}'
                },
                format : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            });
            fieldVm.set('val', value);
            fieldVm.notify();

            t.expect(field.getValue()).toBe('12:55');

        });
    });

    t.describe('change value.', function(t) {

        t.it('set value', function(t) {
            makeField({
                viewModel : {data : {val : null}},
                bind : {
                    value : '{val}'
                },
                format : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            });

            field.showPicker();

            t.chain(
                {
                    action : 'click',
                    target : field.getConfig('picker', false, true)
                },
                {
                    wait : WAIT_MS
                },
                function(next) {
                    t.expect(field.getValue()).toBe('00:45');
                    t.expect(fieldVm.get('val')).toBe('00:45');
                    next();
                }
            )
        });

        t.it('set value. format 2', function(t) {
            var expectedValue = Ext.Date.parse('00:45:00', criterion.consts.Api.TIME_FORMAT_FULL);

            makeField({
                viewModel : {data : {val : null}},
                bind : {
                    value : '{val}'
                },
                format : criterion.consts.Api.TIME_FORMAT
            });

            field.showPicker();

            t.chain(
                {
                    wait : 1
                },
                {
                    action : 'click',
                    target : field.getConfig('picker', false, true)
                },
                {
                    wait : WAIT_MS
                },
                function(next) {
                    t.expect(fieldVm.get('val')).toBe(Ext.Date.format(expectedValue, criterion.consts.Api.TIME_FORMAT));
                    next();
                }
            )
        });

    });
});
