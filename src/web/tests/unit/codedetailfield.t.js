describe("CodeDetail MultiSelect Combobox Tests", function(t) {

    var form,
        field;

    function makeForm() {
        if (!form) {
            form = Ext.create('criterion.view.FormView', {
                renderTo : Ext.getBody(),
                viewModel : {
                    data : {
                        value_set : 3,
                        value_null : null
                    }
                }
            });
        }
        return form;
    }

    function makeField(config) {
        var config = Ext.Object.merge({
            labelWidth : 300,
            width : 100
        }, config || {});

        field = Ext.create('criterion.ux.form.field.CodeDetail', config);
        makeForm().add(field);

        return field;
    }

    function makeMultiField(config) {
        var config = Ext.Object.merge({
            labelWidth : 300,
            width : 100
        }, config || {});

        field = Ext.create('criterion.ux.form.field.CodeDetailMultiSelect', config);
        makeForm().add(field);

        return field;
    }

    // setup environment

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        //field = Ext.destroy(field);
    });

    t.waitForThrottledAjax(function() {

        t.spyOn(criterion.CodeDataManager, 'getStore').and.callFake(function(codeTableCode) {
            var storeId = 'codeTable_' + codeTableCode,
                store,
                data;

            if (/TEST/.test(codeTableCode)) {
                storeId = storeId + '_FAKE_' + Math.random();
            }

            store = Ext.data.StoreManager.lookup(storeId);
            if (!store) {
                data = [
                    {
                        id : 1,
                        code : 'CODE_1',
                        description : 'VALUE 1',
                        isDefault : false,
                        isActive : true
                    },
                    {
                        id : 2,
                        code : 'CODE_2',
                        description : 'VALUE 2',
                        isDefault : false,
                        isActive : true
                    },
                    {
                        id : 3,
                        code : 'CODE_3',
                        description : 'VALUE 3',
                        isDefault : false,
                        isActive : true
                    },
                    {
                        id : 4,
                        code : 'CODE_4',
                        description : 'VALUE 4',
                        isDefault : false,
                        isActive : true
                    }
                ];

                switch (codeTableCode) {
                    case 'TEST_DEFAULT':
                        data.push({
                            id : 5,
                            code : 'CODE_5',
                            description : 'DEFAULT VALUE',
                            isDefault : true,
                            isActive : true
                        });
                        break;

                    case 'TEST_NON_ACTIVE':
                        data.push({
                            id : 6,
                            code : 'CODE_6',
                            description : 'VALUE 6 (NOT ACTIVE)',
                            isDefault : false,
                            isActive : false
                        });

                        break;
                }

                store = new Ext.data.Store({
                    proxy : {
                        type : 'memory'
                    },
                    model : 'criterion.model.codeTable.Detail',
                    storeId : storeId,
                    codeTableId : codeTableCode,
                    data : data
                });
            }

            return store;
        });

        t.describe('datastore', function(t) {

            t.it('init store', function(t) {
                var spyCodedetailsLoaded = t.createSpy('codedetailsLoaded');

                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 'ThrottledAjax'
                    },
                    function() {
                        t.expect(field.getStore().getCount()).toBe(4);
                    }
                );

            });
        });

        t.describe('values', function(t) {

            t.it('check valueCode', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST',
                            valueCode : 'CODE_1',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual(1);
                    }
                );
            });

            t.it('check valueCode for the multi select field', function(t) {
                t.chain(
                    function(next) {
                        makeMultiField({
                            codeDataId : 'TEST',
                            valueCode : 'CODE_1',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual([1]);
                    }
                );
            });

            t.it('check set value', function(t) {
                makeField({
                    codeDataId : 'TEST',
                    value : 1,
                    fieldLabel : t.name
                });
                t.expect(field.getValue()).toEqual(1);
            });

            t.it('check set value (viewmodel)', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST',
                            bind : '{value_set}',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual(3);
                    }
                );

            });

            t.it('check set value for the multi select field', function(t) {
                makeMultiField({
                    codeDataId : 'TEST',
                    value : 1,
                    fieldLabel : t.name
                });
                t.expect(field.getValue()).toEqual([1]);
            });

            t.it('check set multi value', function(t) {
                makeMultiField({
                    codeDataId : 'TEST',
                    value : [1, 2],
                    fieldLabel : t.name
                });
                t.expect(field.getValue()).toEqual([1, 2]);
            });

            t.it('check set multi value as string', function(t) {
                makeMultiField({
                    codeDataId : 'TEST',
                    value : '1,2,3',
                    fieldLabel : t.name
                });
                t.expect(field.getValue()).toEqual(['1', '2', '3']);
            });
        });

        t.describe('default for values', function(t) {
            t.it('check set default', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST_DEFAULT',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual(5);
                    }
                );
            });

            t.it('check not allow set default', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST_DEFAULT',
                            allowSetDefault : false,
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual(null);
                    }
                );
            });

            t.it('check value priority', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST_DEFAULT',
                            value : 1,
                            valueCode : 'CODE_2',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual(1);
                    }
                );
            });

            t.it('check valueCode priority', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST_DEFAULT',
                            valueCode : 'CODE_2',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual(2);
                    }
                );
            });

            t.it('check value priority (viewModel)', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST_DEFAULT',
                            bind : '{value_set}',
                            valueCode : 'CODE_2',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual(3);
                    }
                );
            });

            t.it('check valueCode priority (viewModel + value = null)', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST_DEFAULT',
                            bind : '{value_null}',
                            valueCode : 'CODE_2',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toEqual(2);
                    }
                );
            });
        });

        t.describe('working with not active records', function(t) {

            t.it('check set not active value', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST_NON_ACTIVE',
                            fieldLabel : t.name,
                            value : 6
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.getValue()).toBe(null);
                        t.expect(field.getRawValue()).toBe('');
                    }
                );
            });

            t.it('check validation not active value', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST_NON_ACTIVE',
                            fieldLabel : t.name,
                            allowBlank : false,
                            value : 6
                        });
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.isValid()).toBe(false);
                    }
                );
            });

        });

        t.describe('destruction', function(t) {

            t.it('check field destroy', function(t) {
                t.chain(
                    function(next) {
                        makeField({
                            codeDataId : 'TEST',
                            valueCode : 'CODE_1',
                            fieldLabel : t.name
                        });
                        next();
                    },
                    function(next) {
                        field.destroy();
                        next();
                    },
                    {
                        waitFor : 500
                    },
                    function() {
                        t.expect(field.destroyed).toBeTruthy();
                    }
                );
            });

        });

    })
});
