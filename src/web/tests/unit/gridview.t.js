describe("GridView with FormView Tests", function(t) {

    // setup test classes

    Ext.define('criterion.test.Model', {
        extend : 'Ext.data.Model',
        fields : ['string1', 'name'],
        proxy : {
            type : 'criterion_rest',
            url : '/src/web/api-mock/test/entity'
        }
    });

    Ext.define('criterion.test.Store', {
        extend : 'criterion.data.Store',
        alias : 'stores.criterion_test',
        model : 'criterion.test.Model',
        data : [
            {
                "id" : 1,
                "string1" : "string value 1",
                "date1" : "2014.08.13"
            },
            {
                "id" : 2,
                "string1" : "string value 2",
                "date1" : "2014.08.13"
            }
        ]
    });

    Ext.define('criterion.test.FormView', {
        extend : 'criterion.view.FormView',
        alias : 'widget.criterion_test_formview',
        plugins : [
            {
                ptype : 'criterion_sidebar'
            }
        ],
        items : [
            {
                xtype : 'textfield',
                dataIndex : 'string1',
                bind : {
                    value : '{record.string1}'
                }
            },
            {
                xtype : 'datefield',
                dataIndex : 'date1',
                bind : {
                    value : '{record.date1}'
                }
            }
        ]
    });

    Ext.define('criterion.test.GridView', {
        extend : 'criterion.view.GridView',
        layout : 'fit',
        columns : [
            {
                dataIndex : 'string1',
                flex : 1
            },
            {
                dataIndex : 'date1',
                flex : 1
            }
        ],
        controller : {
            editor : {
                xtype : 'criterion_test_formview'
            }
        }
    });

    // helpers
    var grid, gridC, store, WAIT_MS = 200;

    function cqd(query) {
        return Ext.ComponentQuery.query(query)[0]
    }

    function getForm() {
        return Ext.ComponentQuery.query('criterion_formview')[0]
    }

    function makeGrid(gridOpts) {
        var opts = Ext.Object.merge({
            store : store || makeStore(),
            renderTo : Ext.getBody(),
            loadRecordOnEdit : false,
            controller : {
                loadRecordOnEdit : false
            }
        }, gridOpts || {});

        grid = Ext.create('criterion.test.GridView', opts);
        gridC = grid.getController();
    }

    function makeStore(storeOpts) {
        return store = Ext.create('criterion.test.Store', storeOpts || {});
    }

    // setup environment

    criterion.detectDirtyForms = false;

    Ext.util.History.immediateHashChange = true;

    // setup / teardown methods

    t.beforeEach(function() {
    });

    t.afterEach(function() {
        grid = store = Ext.destroy(grid, store, getForm());
    });

    // tests

    t.describe("Opening FormView", function(t) {
        t.it('Should be able to open FormView by calling handleEditAction()', function(t) {
            makeGrid();
            var record = store.getAt(0);
            grid.getController().handleEditAction(record);
            t.waitForMs(WAIT_MS, function() {
                t.expect(t.isElementVisible('>> criterion_formview')).toBe(true);
                t.expect(getForm().getViewModel().get('record')).toEqual(record);
            });
        });

        t.it('Should be able to open FormView by calling handleAddClick()', function(t) {
            makeGrid();
            grid.getController().handleAddClick();
            t.waitForMs(WAIT_MS, function() {
                t.expect(t.isElementVisible('>> criterion_formview')).toBe(true);
                t.expect(getForm().getViewModel().get('record').phantom).toBe(true);
            });
        });
    });

    t.describe("Routing", function(t) {
        var gridCfg = {controller : {baseRoute : 'entity'}};

        t.beforeEach(function() {
            makeGrid(gridCfg);
        });

        t.afterEach(function() {
            Ext.History.add('#');
        });

        t.it('Should be able to open FormView from route', function(t) {
            Ext.History.add('entity/1');

            t.waitForMs(WAIT_MS, function() {
                t.expect(t.isElementVisible('>> criterion_formview')).toBe(true);
                t.expect(getForm().getViewModel().get('record').getId()).toBe(1);
            });
        });

        t.xit('Should be able to switch FormView instance from route', function(t) {
            Ext.History.add('entity/1');
            t.waitForMs(WAIT_MS, function() {
                t.expect(t.isElementVisible('>> criterion_formview')).toBe(true);
                t.expect(getForm().getViewModel().get('record').getId()).toBe(1);

                t.fail("first instance of formview isn't destructed; need to refactor GridView");

                return

                Ext.History.add('entity/2');
                t.waitForMs(WAIT_MS, function() {
                    t.expect(t.isElementVisible('>> criterion_formview')).toBe(true);
                    t.expect(getForm().getViewModel().get('record').getId()).toBe(2);
                });
            });
        });

        t.it('Should be able to open FormView from route which was set before init of GridView', function(t) {
            grid = Ext.destroy(grid);
            Ext.History.add('entity/2');
            t.waitForMs(WAIT_MS, function() {
                makeGrid({controller : {baseRoute : 'entity'}});
                t.waitForMs(WAIT_MS, function() {
                    t.expect(t.isElementVisible('>> criterion_formview')).toBe(true);
                    t.expect(getForm().getViewModel().get('record').getId()).toBe(2);
                });
            });
        });

        t.it('Should be able to open new FormView from route', function(t) {
            Ext.History.add('#entity/' + grid.getController().getNewEntityToken());
            t.waitForMs(WAIT_MS, function() {
                t.expect(t.isElementVisible('>> criterion_formview')).toBe(true);
                t.expect(getForm().getViewModel().get('record').phantom).toBeTruthy();
            });
        });

        t.it('Should ignore malformed routes', function(t) {
            Ext.History.add('#entity/-1');
            t.waitForMs(WAIT_MS, function() {
                t.expect(getForm()).toBeFalsy();
            });
        });

        t.it('Should set correct route on edit', function(t) {
            var record = store.getAt(1);
            grid.getController().handleEditAction(record);
            t.waitForMs(WAIT_MS, function() {
                t.expect(Ext.History.getHash()).toBe(grid.getController().getBaseRoute() + '/' + record.getId());
            });
        });

        t.it('Should set correct route after edit cancel', function(t) {
            var record = store.getAt(0);
            grid.getController().handleEditAction(record);
            t.waitForMs(WAIT_MS, function() {
                getForm().getController().handleCancelClick();
                t.expect(Ext.History.getHash()).toBe(grid.getController().getBaseRoute());
            });
        });

        t.it('Should set correct route after save', function(t) {
            var record = store.getAt(0);
            grid.getController().handleEditAction(record);
            t.waitForMs(WAIT_MS, function() {
                getForm().getController().getViewModel().get('record').set('string1', 'valueZ');
                getForm().getController().handleSubmitClick();
                t.expect(Ext.History.getHash()).toBe(grid.getController().getBaseRoute());
            });
        });

        t.it('Should set correct route after delete', function(t) {
            var record = store.getAt(0);

            grid.getController().handleEditAction(record);

            t.chain(
                {
                    waitFor : 'CQVisible',
                    args : ['criterion_test_formview']
                },
                function(next) {
                    getForm().getController().handleDeleteClick();
                    next();
                },
                {
                    wait : WAIT_MS
                },
                {
                    action : 'click',
                    target : '>> [text=Yes]'
                },
                function(next) {
                    t.expect(Ext.History.getHash()).toBe(grid.getController().getBaseRoute());
                }
            );
        });
    });

    t.describe("Dynamic routing", function(t) {
        t.beforeEach(function() {
            makeGrid();
        });

        t.afterEach(function() {
            Ext.History.add('');
        });

        t.it('Should setup controller routes on baseRoute update', function(t) {
            t.expect(gridC.getRoutes()).toBeFalsy();
            gridC.setBaseRoute('entity');
            t.expect(gridC.getRoutes()).toBeTruthy();
            gridC.setBaseRoute(null);
            t.expect(gridC.getRoutes()).toBeFalsy();
        });

        t.it('Should preserve other routes', function(t) {
            gridC.setRoutes({'otherRoute' : 'someMethod'});
            t.expect(Ext.Object.getSize(gridC.getRoutes())).toBe(1);
            gridC.setBaseRoute('entity');
            t.expect(Ext.Object.getSize(gridC.getRoutes())).toBeGreaterThan(1);
            gridC.setBaseRoute(null);
            t.expect(Ext.Object.getSize(gridC.getRoutes())).toBe(1);
        })
    });

    t.describe("Autosync", function(t) {
        t.it('Should suspend autoSync while editing', function(t) {
            var spyToggle;

            t.beforeEach(function() {
                makeStore({autoSync : true});
                makeGrid({controller : {confirmDelete : false}});
                spyToggle = t.spyOn(grid.getController(), 'toggleAutoSync').and.callThrough();
            });

            t.afterEach(function() {
                spyToggle = undefined;
            });

            t.it('Edit - Cancel', function(t) {
                t.expect(store.autoSyncSuspended).toBeFalsy();
                grid.getController().handleEditAction(store.getAt(0));
                t.waitForMs(WAIT_MS, function() {
                    t.expect(spyToggle).toHaveBeenCalled(1);
                    t.expect(store.autoSyncSuspended).toBeTruthy();
                    getForm().getController().handleCancelClick();
                    t.expect(spyToggle).toHaveBeenCalled(2);
                    t.expect(store.autoSyncSuspended).toBeFalsy();
                    t.pass('passed on edit cancel')
                });
            });

            t.it('Edit - Save', function(t) {
                t.expect(store.autoSyncSuspended).toBeFalsy();
                grid.getController().handleEditAction(store.getAt(0));
                t.waitForMs(WAIT_MS, function() {
                    t.expect(spyToggle).toHaveBeenCalled(1);
                    t.expect(store.autoSyncSuspended).toBeTruthy();
                    getForm().getController().getViewModel().get('record').set('string1', 'valueZ');
                    getForm().getController().handleSubmitClick();
                    t.expect(spyToggle).toHaveBeenCalled(2);
                    t.expect(store.autoSyncSuspended).toBeFalsy();
                    t.pass('passed on edit')
                });
            });

            t.it('Add - Cancel', function(t) {
                grid.getController().handleAddClick();
                t.waitForMs(WAIT_MS, function() {
                    t.expect(spyToggle).toHaveBeenCalled(1);
                    t.expect(store.autoSyncSuspended).toBeTruthy();
                    getForm().getController().handleCancelClick();
                    t.expect(spyToggle).toHaveBeenCalled(2);
                    t.expect(store.autoSyncSuspended).toBeFalsy();
                    t.pass('passed on add cancel')
                });
            });

            t.it('Edit - Remove', function(t) {
                var count = store.getCount();

                grid.getController().handleEditAction(store.getAt(0));

                t.chain(
                    {
                        waitFor : 'CQVisible',
                        args : ['criterion_test_formview']
                    },
                    function(next) {
                        t.expect(store.count()).toBe(count);
                        t.expect(spyToggle).toHaveBeenCalled(1);
                        t.expect(store.autoSyncSuspended).toBeTruthy();
                        getForm().getController().handleDeleteClick();
                        next();
                    },
                    {
                        action : 'click',
                        target : '>> [text=Yes]'
                    },
                    function(next) {
                        t.expect(spyToggle).toHaveBeenCalled(2);
                        t.expect(store.autoSyncSuspended).toBeFalsy();
                        t.expect(store.count()).toBe(count - 1);
                        t.pass('passed on remove')
                    }
                );
            });
        });
    });

});
