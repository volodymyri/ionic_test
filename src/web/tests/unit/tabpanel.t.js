describe("CardRouter Tests", function(t) {
    // helpers
    var panel, layout;

    function makePanel(config) {
        panel = Ext.create('criterion.test.TabPanel', Ext.Object.merge({
            renderTo : Ext.getBody(),
            width : 500,
            height : 500,
            minTabWidth : 0
        }, config || {}));
        layout = panel.getLayout();
    }

    function makeTabConfig(id, config) {
        return Ext.Object.merge({
            reference : id,
            title : id,
            itemId : id
        }, config || {});
    }

    // setup environment

    Ext.define('criterion.test.TabPanel', {
        extend : 'criterion.ux.tab.Panel',
        alias : 'widget.test_tab_panel'
    });

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {

    });

    t.waitForThrottledAjax(function() {

        t.describe('Basic test, no sub items.', function(t) {
            t.beforeEach(function() {
                makePanel({
                    items : [
                        makeTabConfig('tab1'),
                        makeTabConfig('tab2'),
                        makeTabConfig('tab3')
                    ]
                })
            });

            t.afterEach(function() {
                panel = Ext.destroy(panel);
            });

            t.it('Should open tab on click.', function(t) {
                t.chain([
                    function(next) {
                        t.expect(Ext.all('tab').length).toBe(3);
                        next()
                    },
                    {
                        waitFor : 'CQVisible',
                        args : ['[reference=tab1]']
                    },
                    {
                        click : '>> tab[text=tab2]'
                    },
                    {
                        waitFor : 'CQVisible',
                        args : ['[reference=tab2]']
                    }
                ]);
            });

            t.it('Should trigger activation of child items', function(t) {
                t.willFireNTimes(panel.items.getAt(0), 'activate', 0);
                t.willFireNTimes(panel.items.getAt(1), 'activate', 1);
                t.willFireNTimes(panel.items.getAt(2), 'activate', 1);

                t.chain([
                    {
                        click : '>> tab[text=tab2]'
                    },
                    {
                        click : '>> tab[text=tab3]'
                    }
                ]);
            });
        });

        t.describe('Basic test, with sub items.', function(t) {
            function makePanelConfig() {
                return {
                    items : [
                        makeTabConfig('tab1', {
                            isSubMenu : true,
                            layout : 'card',
                            items : [
                                makeTabConfig('tab1_1'),
                                makeTabConfig('tab1_2')
                            ]
                        }),
                        makeTabConfig('tab2', {
                            isSubMenu : true,
                            tabConfig : {
                                expanded : true
                            },
                            layout : 'card',
                            items : [
                                makeTabConfig('tab2_1'),
                                makeTabConfig('tab2_2')
                            ]
                        })
                    ]
                }
            }

            t.beforeEach(function() {
            });

            t.afterEach(function() {
                panel = Ext.destroy(panel);
            });

            t.it('Should render sub tabs.', function(t) {
                var config = makePanelConfig();
                config.items[1].tabConfig = { expanded : false};
                makePanel(config);

                t.expect(Ext.all('tab').length).toBe(6);
                t.expect(Ext.all('tab[isSubItem]').length).toBe(4);
                t.expect(Ext.first('tab[text=tab1]').expanded).toBe(true);
                t.expect(Ext.first('tab[text=tab2]').expanded).toBe(false);
            });

            t.it('Should expand and collapse sub menus.', function(t) {
                makePanel(makePanelConfig());

                t.chain([
                    function(next) {
                        t.expect(Ext.all('tab[expanded=true]').length).toBe(2);
                        next();
                    },
                    {
                        click : '>> tab[text=tab1]'
                    },
                    function(next) {
                        t.expect(Ext.all('tab[expanded=true]').length).toBe(1);
                        next();
                    },
                    {
                        click : '>> tab[text=tab2]'
                    },
                    function(next) {
                        t.expect(Ext.all('tab[expanded=true]').length).toBe(0);
                        next();
                    }
                ]);
            });

            /**
             * Initially, card layout will fire 'activate' events, but we can not catch them in tests.
             * This test ensures that no extra activation events are fired.
             *
             * @todo modify test to make it able to catch those events
             */
            t.it('Should not activate initial tabs', function(t) {
                makePanel(makePanelConfig());

                t.willFireNTimes(panel.items.getAt(0), 'activate', 0, 'tab1');
                t.willFireNTimes(panel.items.getAt(0).items.getAt(0), 'activate', 0, 'tab1_1');
                t.willFireNTimes(panel, 'childTabChange', 0, 'total childTabChange');
            });

            t.it('Should activate sub tab on click, same tab', function(t) {
                makePanel(makePanelConfig());

                t.willFireNTimes(panel.items.getAt(0), 'activate', 0, 'tab1');
                t.willFireNTimes(panel.items.getAt(0).items.getAt(0), 'activate', 1, 'tab1_1');
                t.willFireNTimes(panel.items.getAt(0).items.getAt(1), 'activate', 1, 'tab1_2');
                t.willFireNTimes(panel, 'childTabChange', 2, 'total childTabChange');

                t.chain([
                    {
                        click : '>> tab[text=tab1_2]'
                    },
                    {
                        click : '>> tab[text=tab1_1]'
                    }
                ]);
            });

            t.it('Should activate sub tab on click, different tab', function(t) {
                makePanel(makePanelConfig());

                t.willFireNTimes(panel.items.getAt(0), 'activate', 0, 'tab1');
                t.willFireNTimes(panel.items.getAt(0).items.getAt(0), 'activate', 0, 'tab1_1');
                t.willFireNTimes(panel.items.getAt(1), 'activate', 1, 'tab2');
                t.willFireNTimes(panel.items.getAt(1).items.getAt(0), 'activate', 2, 'tab2_1');
                t.willFireNTimes(panel, 'childTabChange', 1, 'total childTabChange');

                t.chain([
                    {
                        click : '>> tab[text=tab2_1]'
                    }
                ]);
            });

            t.it('Should re-activate previously active sub item, CRITERION-3016', function(t) {
                makePanel(makePanelConfig());

                t.willFireNTimes(panel.items.getAt(0), 'activate', 1, 'tab1');
                t.willFireNTimes(panel.items.getAt(0).items.getAt(0), 'activate', 1, 'tab1_1');
                t.willFireNTimes(panel.items.getAt(1), 'activate', 2, 'tab2');
                t.willFireNTimes(panel.items.getAt(1).items.getAt(0), 'activate', 3, 'tab2_1');
                t.willFireNTimes(panel, 'childTabChange', 3, 'total childTabChange');

                t.chain([
                    {
                        click : '>> tab[text=tab2_1]'
                    },
                    {
                        click : '>> tab[text=tab1_1]'
                    },
                    {
                        click : '>> tab[text=tab2_1]'
                    }
                ]);
            });
        })
    });

});
