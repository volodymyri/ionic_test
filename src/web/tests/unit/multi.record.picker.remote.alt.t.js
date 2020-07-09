describe("MultiRecordPickerRemoteAlt", function(t) {

    // helpers
    var view, viewVm, viewC, WAIT_MS = 100,
        mainStore, selectedStore,
        spySelect,
        recs,
        excludedIds = [], selectedRecordsIds = [],
        tt = {
            it : function() {},
            afterEach : function() {}
        };

    function makeView(config) {
        var stores = {
            inputStore : mainStore
        },
        obj = {
            fn : function(r) {
                recs = r;
            }
        };

        spySelect = t.spyOn(obj, 'fn').and.callThrough();

        if (selectedStore) {
            stores['selectedStore'] = selectedStore;
        }

        var config_ = Ext.Object.merge({
            renderTo : Ext.getBody(),

            viewModel : {
                data : {
                    title : i18n.gettext('Select Records'),
                    gridColumns : [
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Last Name'),
                            dataIndex : 'lastName',
                            flex : 1,
                            filter : 'string',
                            defaultSearch : true
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('First Name'),
                            dataIndex : 'firstName',
                            flex : 1,
                            filter : 'string'
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Middle Name'),
                            dataIndex : 'middleName',
                            flex : 1,
                            filter : 'string'
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Employer'),
                            dataIndex : 'employerName',
                            flex : 1,
                            excludeFromFilters : true
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Title'),
                            dataIndex : 'positionTitle',
                            flex : 1,
                            excludeFromFilters : true
                        }
                    ],
                    storeParams : {
                        employeeId : 1
                    },
                    selectedRecords : selectedRecordsIds,
                    excludedIds : excludedIds
                },
                stores : stores
            }
        }, config || {});

        view = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', config_);
        viewVm = view.getViewModel();
        viewC = view.getController();
        view.on('selectRecords', obj.fn);
        view.show();
    }

    function findCell(grid, rowIdx, cellIdx) {
        return grid.getView().getCellInclusive({
            row : rowIdx,
            column : cellIdx
        });
    }

    function cq(query) {
        return Ext.ComponentQuery.query(query)[0]
    }

    // setup environment
    var storeData = [
        {
            "id" : 2227,
            "lastName" : "Test",
            "firstName" : "Test Name",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Primary Emergency Department Nurse"
        }, {
            "id" : 2368,
            "lastName" : "Test",
            "firstName" : "Test Name",
            "middleName" : null,
            "employerName" : "Google",
            "positionTitle" : "TTT"
        }, {
            "id" : 2228,
            "lastName" : "Test Test",
            "firstName" : "TEST 123",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "HR Administrator"
        }, {
            "id" : 2285,
            "lastName" : "Test Test",
            "firstName" : "TEST 123",
            "middleName" : null,
            "employerName" : "Google",
            "positionTitle" : "Chief Executive Officer"
        }, {
            "id" : 2229,
            "lastName" : "Test 123",
            "firstName" : "Test 123",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Test"
        }, {
            "id" : 2232,
            "lastName" : "Test",
            "firstName" : "Tesr 333T",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "TEST"
        }, {
            "id" : 2233,
            "lastName" : "Test",
            "firstName" : "test 333",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "123"
        }, {
            "id" : 2361,
            "lastName" : "Test",
            "firstName" : "Test 222",
            "middleName" : null,
            "employerName" : "Google",
            "positionTitle" : "TEST APPEARANCE IN GRID"
        }, {
            "id" : 3466,
            "lastName" : "test",
            "firstName" : "TEST 4444",
            "middleName" : null,
            "employerName" : "Google",
            "positionTitle" : "Copy of Sales top manager 2"
        }, {
            "id" : 2237,
            "lastName" : "Test",
            "firstName" : "TEST 55555",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "TEST"
        }, {
            "id" : 2238,
            "lastName" : "Test",
            "firstName" : "TEST 666",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "T"
        }, {
            "id" : 2245,
            "lastName" : "Retest",
            "firstName" : "Rehire",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Laboratory Technician 10"
        }, {
            "id" : 2377,
            "lastName" : "Test 123",
            "firstName" : "Test 123",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Registered Nurse 1"
        }, {
            "id" : 2391,
            "lastName" : "Test 21",
            "firstName" : "Test 12",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "T3"
        }, {
            "id" : 2406,
            "lastName" : "testemplyee",
            "firstName" : "testemployee",
            "middleName" : "testtt",
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "T2"
        }, {
            "id" : 2409,
            "lastName" : "Testeroff",
            "firstName" : "Tester",
            "middleName" : null,
            "employerName" : "Google",
            "positionTitle" : "2"
        }, {
            "id" : 2411,
            "lastName" : "nattestmanager",
            "firstName" : "nattestmanager",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Director of Nursing - -Bayside"
        }, {
            "id" : 2412,
            "lastName" : "Natatest",
            "firstName" : "Anastasia",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Registered Nurse 1"
        }, {
            "id" : 2432,
            "lastName" : "Tester",
            "firstName" : "Test",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Some Title"
        }, {
            "id" : 2559,
            "lastName" : "Test02282017174811379",
            "firstName" : "Auto",
            "middleName" : null,
            "employerName" : "Google",
            "positionTitle" : "TEST APPEARANCE IN GRID"
        }, {
            "id" : 3011,
            "lastName" : "Test",
            "firstName" : "YTD",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "T1"
        }, {
            "id" : 3230,
            "lastName" : "Test",
            "firstName" : "Assignment",
            "middleName" : "Deleteion",
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Radiologic Technician"
        }, {
            "id" : 3765,
            "lastName" : "Test",
            "firstName" : "Phone-Format",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Laboratory Technician 10"
        }, {
            "id" : 3887,
            "lastName" : "Payroll Auto-test ",
            "firstName" : "Bot",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Radiologic Technician"
        }, {
            "id" : 3962,
            "lastName" : "test2",
            "firstName" : "toni",
            "middleName" : null,
            "employerName" : "Atlantic Metro Health Network",
            "positionTitle" : "Director of Nursing - -Bayside"
        }, {
            "id" : 3984,
            "lastName" : "Test06052017101257987",
            "firstName" : "Automation",
            "middleName" : null,
            "employerName" : "Criterion",
            "positionTitle" : "Problem solver"
        }
    ];

    Ext.define('criterion.data.proxy.Test', function() {
        return {
            extend : 'Ext.data.proxy.Memory',
            alias : 'proxy.criterion_test_proxy',

            config : {
                extraParams : {}
            }
        }
    });

    Ext.define('criterion.model.Test', {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_test_proxy',
            data : Ext.clone(storeData)
        },

        fields : [
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'middleName',
                type : 'string'
            },
            {
                name : 'employerName',
                type : 'string'
            },
            {
                name : 'positionTitle',
                type : 'string'
            }
        ]
    });

    Ext.define('criterion.store.Test', function() {

        return {
            extend : 'criterion.data.Store',

            alias : 'store.criterion_test',

            model : 'criterion.model.Test',
            autoLoad : false,
            autoSync : false,
            pageSize : criterion.Consts.PAGE_SIZE.NONE,

            proxy : {
                type : 'criterion_test_proxy',
                data : Ext.clone(storeData)
            },

            load : function(opt) {
                this.callParent(arguments);
                this.loadData(Ext.clone(storeData));
            }
        };

    });

    mainStore = Ext.create('criterion.store.Test');


    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        view = Ext.destroy(view);
        selectedStore = Ext.destroy(selectedStore);
        viewVm = Ext.destroy(viewVm);
        viewC = Ext.destroy(viewC);

        excludedIds = [];
        selectedRecordsIds = [];

        spySelect = undefined;
        recs = undefined;
    });

    function mainTest() {
        t.describe('Initialization', function(t) {

            t.it('It should initialize in single select mode', function(t) {

                makeView({
                    multiSelect : false,
                    allowEmptySelect : false
                });

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        viewC.onShow();
                        viewC.onStoreLoad();
                        next();
                    },
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.expect(cq('[reference=selectButton]').disabled).toBe(true);
                        next();
                    },
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.click(findCell(cq('criterion_gridpanel[reference=grid]'), 0, 0), next)
                    },
                    function(next) {
                        t.expect(cq('[reference=selectButton]').disabled).toBe(false);
                        next();
                    },
                    function(next) {
                        t.click(findCell(cq('criterion_gridpanel[reference=grid]'), 1, 0), next)
                    },
                    function(next) {
                        t.click(cq('[reference=selectButton]'), next)
                    },
                    function(next) {
                        t.expect(spySelect).toHaveBeenCalled(1);
                        next();
                    },
                    function(next) {
                        t.expect(recs.length).toBe(1);
                        t.expect(recs[0].getId()).toBe(2368);
                        next();
                    }
                );
            });

            t.it('It should initialize in multy select mode', function(t) {
                selectedStore = Ext.create('criterion.store.Test');
                selectedStore.add({
                    "id" : 2368,
                    "lastName" : "Test",
                    "firstName" : "Test Name"
                });
                excludedIds = [2227];

                makeView({
                    allowEmptySelect : false
                });

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        viewC.onShow();
                        viewC.onStoreLoad();
                        next();
                    },
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.expect(viewVm.getStore('inputStore').count()).toBe(storeData.length - 2);
                        t.expect(viewVm.getStore('selectedStore').count()).toBe(1);
                        t.expect(viewVm.get('selectedRecordCount')).toBe(1);
                        t.expect(viewVm.get('selectedRecords')[0]).toBe(2368);
                        t.expect(cq('[reference=selectButton]').disabled).toBe(false);
                        next();
                    },
                    function(next) {
                        t.click(findCell(cq('criterion_gridpanel[reference=gridSelected]'), 0, 0).down('.x-action-col-icon'), next)
                    },
                    function(next) {
                        t.expect(viewVm.getStore('inputStore').count()).toBe(storeData.length - 1);
                        t.expect(viewVm.getStore('selectedStore').count()).toBe(0);
                        t.expect(viewVm.get('selectedRecordCount')).toBe(0);
                        t.expect(cq('[reference=selectButton]').disabled).toBe(true);
                        next();
                    },
                    function(next) {
                        t.click(findCell(cq('criterion_gridpanel[reference=grid]'), 0, 0).down('.x-action-col-icon'), next);
                    },
                    function(next) {
                        t.click(findCell(cq('criterion_gridpanel[reference=grid]'), 0, 0).down('.x-action-col-icon'), next);
                    },
                    function(next) {
                        t.click(findCell(cq('criterion_gridpanel[reference=grid]'), 2, 0).down('.x-action-col-icon'), next);
                    },
                    function(next) {
                        t.expect(viewVm.getStore('inputStore').count()).toBe(storeData.length - 4);
                        t.expect(viewVm.getStore('selectedStore').count()).toBe(3);
                        t.expect(viewVm.get('selectedRecordCount')).toBe(3);
                        t.expect(cq('[reference=selectButton]').disabled).toBe(false);
                        next();
                    },
                    function(next) {
                        t.click(cq('[reference=selectButton]'), next)
                    },
                    function(next) {
                        t.expect(spySelect).toHaveBeenCalled(1);
                        next();
                    },
                    function(next) {
                        t.expect(recs.length).toBe(3);
                        t.expect(recs[0].getId()).toBe(2368);
                        t.expect(recs[1].getId()).toBe(2228);
                        t.expect(recs[2].getId()).toBe(2232);
                        next();
                    }
                );
            });

        });
    }

    // ========

    t.wait('require');

    Ext.require(['criterion.ux.plugin.Sidebar', 'criterion.ux.grid.Panel', 'criterion.ux.toolbar.ToolbarPaging', 'criterion.Consts'], function() {

        t.endWait('require');

        mainTest();
    });





});
