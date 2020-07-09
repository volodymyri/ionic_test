describe("DateTime Tests", function(t) {

    // helpers
    var field, fieldVm, date, datefield, timefield;

    function makeDate() {
        return date = new Date();
    }

    function makeField(config) {
        var config = Ext.Object.merge({
            renderTo : Ext.getBody()
        }, config || {});

        field = Ext.create('criterion.view.ux.form.DateTime', config);
        datefield = field.down('datefield');
        timefield = field.down('timefield');
        fieldVm = field.getViewModel();
    }

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        field = Ext.destroy(field);
    });

    t.waitForThrottledAjax(function() {

        t.describe('Set value to component', function(t) {

            t.it('Initial Null value', function(t) {
                var value = null;

                makeField({
                    value : value
                });

                t.expect(datefield.getValue()).toBeNull();
                t.expect(timefield.getValue()).toBeNull();
            });

            t.it('Initial date value', function(t) {
                var value = makeDate();

                makeField({
                    value : value
                });

                t.expect(Ext.Date.format(datefield.getValue(), 'Y-m-d')).toBe(Ext.Date.format(date, 'Y-m-d'));
                t.expect(Ext.Date.format(timefield.getValue(), 'G:i')).toBe(Ext.Date.format(date, 'G:i'));
            });

            t.it('Set date value', function(t) {
                var value = makeDate();

                makeField();

                field.setValue(value);

                t.expect(Ext.Date.format(datefield.getValue(), 'Y-m-d')).toBe(Ext.Date.format(date, 'Y-m-d'));
                t.expect(Ext.Date.format(timefield.getValue(), 'G:i')).toBe(Ext.Date.format(date, 'G:i'));
            });

            t.it('Update date value', function(t) {
                var value = makeDate(),
                    newDate = Ext.Date.add(Ext.Date.add(date, Ext.Date.HOUR, 1), Ext.Date.DAY, 1);

                makeField({
                    value : value
                });

                t.expect(Ext.Date.format(datefield.getValue(), 'Y-m-d')).toBe(Ext.Date.format(date, 'Y-m-d'));
                t.expect(Ext.Date.format(timefield.getValue(), 'G:i')).toBe(Ext.Date.format(date, 'G:i'));

                field.setValue(newDate);

                t.expect(Ext.Date.format(datefield.getValue(), 'Y-m-d')).toBe(Ext.Date.format(newDate, 'Y-m-d'));
                t.expect(Ext.Date.format(timefield.getValue(), 'G:i')).toBe(Ext.Date.format(newDate, 'G:i'));

            });

            t.it('Bind date value', function(t) {
                var value = makeDate();

                makeField({
                    viewModel : {
                        data : {
                            val : null
                        }
                    },
                    bind : {
                        value : '{val}'
                    }
                });

                fieldVm.set('val', value);
                fieldVm.notify();

                t.expect(Ext.Date.format(datefield.getValue(), 'Y-m-d')).toBe(Ext.Date.format(date, 'Y-m-d'));
                t.expect(Ext.Date.format(timefield.getValue(), 'G:i')).toBe(Ext.Date.format(date, 'G:i'));
            });
        });

        t.describe('Set values to fields', function(t) {

            t.it('Set fields values', function(t) {
                var value = makeDate();

                makeField();

                datefield.setValue(value);
                timefield.setValue(value);

                t.expect(Ext.Date.format(field.getValue(), 'Y-m-d G:i')).toBe(Ext.Date.format(date, 'Y-m-d') + ' ' + Ext.Date.format(date, 'G:i'));
            });

            t.it('Update fields values', function(t) {
                var value = makeDate(),
                    newDate = Ext.Date.add(Ext.Date.add(date, Ext.Date.HOUR, 1), Ext.Date.DAY, 1);

                makeField({
                    value : value
                });

                t.expect(Ext.Date.format(datefield.getValue(), 'Y-m-d')).toBe(Ext.Date.format(date, 'Y-m-d'));
                t.expect(Ext.Date.format(timefield.getValue(), 'G:i')).toBe(Ext.Date.format(date, 'G:i'));

                datefield.setValue(newDate);
                timefield.setValue(newDate);

                t.expect(Ext.Date.format(field.getValue(), 'Y-m-d G:i')).toBe(Ext.Date.format(newDate, 'Y-m-d') + ' ' + Ext.Date.format(newDate, 'G:i'));

            });
        });
    })
});