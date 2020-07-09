describe("CardRouter Tests", function(t) {
    // helpers
    var panel, panelC, layout;

    function makePanel(config) {
        panel = Ext.create('criterion.test.RoutedPanel', Ext.Object.merge({
            renderTo : Ext.getBody()
        }, config || {}));
        panelC = panel.getController();
        layout = panel.getLayout();
    }

    // setup environment
    Ext.define('criterion.test.RoutedController', {
        alias : 'controller.routed_controller',
        extend : 'criterion.app.ViewController',
        mixins : ['criterion.controller.mixin.CardRouter']
    });

    Ext.define('criterion.test.RoutedPanel', {
        extend : 'Ext.Panel',
        alias : 'widget.routed_panel',
        layout : 'card',
        controller : {
            type : 'routed_controller'
        }
    });

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {

    });

    t.describe('Default route.', function(t) {
        t.beforeEach(function() {
            makePanel({
                items : [
                    {reference : 'card1', html : 'card1'},
                    {reference : 'card2', html : 'card2'},
                    {reference : 'card3', html : 'card3'}
                ],
                controller : {
                    baseCardToken : 'baseToken'
                }
            })
        });

        t.afterEach(function() {
            panel = Ext.destroy(panel);
            Ext.History.add('');
        });

        t.it('Should show correct card if default is set', function(t) {
            panel.getController().defaultCard = 'card2';
            Ext.History.add('baseToken');
            t.waitForActiveCard(panel, '[reference=card2]', function() {
                t.done();
            });
        });

        t.it('Should show first card if default is not set', function(t) {
            panel.setActiveItem(1);
            t.expect(layout.getActiveItem().reference).toBe('card2');
            Ext.History.add('baseToken');
            t.waitForActiveCard(panel, '[reference=card1]', function() {
                t.done();
            });
        });

        t.it('Should remember last card and ignore default card', function(t) {
            panel.getController().defaultCard = 'card2';
            Ext.History.add('baseToken/card1');
            t.expect(layout.getActiveItem().reference).toBe('card1');
            Ext.History.add('baseToken');
            t.waitForActiveCard(panel, '[reference=card1]', function() {
                t.done();
            });
        })
    });

    t.describe('Simple routing.', function(t) {
        t.beforeEach(function() {

        });

        t.afterEach(function() {
            panel = Ext.destroy(panel);
            Ext.History.add('');
        });

        t.it('Should show correct cards without base route', function(t) {
            makePanel({
                items : [
                    {reference : 'card1', html : 'card1'},
                    {reference : 'card2', html : 'card2'},
                    {reference : 'card3', html : 'card3'}
                ]
            });

            t.chain([
                function(next) {
                    Ext.History.add('card3');
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card3]']
                },
                function(next) {
                    Ext.History.add('card2');
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card2]']
                },
                function(next) {
                    Ext.History.add('card1');
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card1]']
                }
            ]);
        });

        t.it('Should show correct cards with base route', function(t) {
            makePanel({
                items : [
                    {reference : 'card1', html : 'card1'},
                    {reference : 'card2', html : 'card2'},
                    {reference : 'card3', html : 'card3'}
                ],
                controller : {
                    baseCardToken : 'base'
                }
            });

            t.chain([
                function(next) {
                    Ext.History.add('base/card3');
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card3]']
                },
                function(next) {
                    Ext.History.add('base/card2');
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card2]']
                },
                function(next) {
                    Ext.History.add('base/card1');
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card1]']
                }
            ]);
        })
    });

    t.describe('Nested routing.', function(t) {
        function nestedPanelConfig(config) {
            return Ext.Object.merge({
                xtype : 'routed_panel',
                items : [
                    {reference : config.reference + '_1', html : config.reference + '_1'},
                    {reference : config.reference + '_2', html : config.reference + '_2'}
                ]
            }, config || {});
        }

        t.beforeEach(function() {
            makePanel({
                items : [
                    nestedPanelConfig({reference : 'card1'}),
                    nestedPanelConfig({reference : 'card2'}),
                    nestedPanelConfig({
                        reference : 'card3',
                        items : [nestedPanelConfig({reference : 'card3_1'})]
                    })
                ]
            })
        });

        t.afterEach(function() {
            panel = Ext.destroy(panel);
            Ext.History.add('');
        });

        t.it('Should show correct cards based on route', function(t) {
            t.chain([
                function(next) {
                    Ext.History.add('card2/card2_1');
                    t.diag(Ext.History.getToken());
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card2]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(1), '[reference=card2_1]']
                },
                function(next) {
                    Ext.History.add('card1/card1_2');
                    t.diag(Ext.History.getToken());
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card1]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(0), '[reference=card1_2]']
                },
                function(next) {
                    Ext.History.add('card1/card1_1');
                    t.diag(Ext.History.getToken());
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card1]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(0), '[reference=card1_1]']
                },
                function(next) {
                    Ext.History.add('card2/card2_2');
                    t.diag(Ext.History.getToken());
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card2]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(1), '[reference=card2_2]']
                },
                function(next) {
                    Ext.History.add('card3/card3_1/card3_1_2');
                    t.diag(Ext.History.getToken());
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card3]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(2), '[reference=card3_1]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(2).items.getAt(0), '[reference=card3_1_2]']
                }
            ]);
        })
    });

    t.describe('Lazy child routing.', function(t) {
        var twoLevel = {
            plugins : {
                ptype : 'criterion_lazyitems',
                items : [
                    {reference : 'card1'},
                    {
                        xtype : 'routed_panel',
                        reference : 'card2',
                        plugins : {
                            ptype : 'criterion_lazyitems',
                            items : [
                                {reference : 'card2_1', html : 'card2_1'},
                                {reference : 'card2_2', html : 'card2_2'}
                            ]
                        }
                    }
                ]
            }
        };
        var threeLevel = {
            plugins : {
                ptype : 'criterion_lazyitems',
                items : [
                    {reference : 'card1'},
                    {
                        xtype : 'routed_panel',
                        reference : 'card2',
                        plugins : {
                            ptype : 'criterion_lazyitems',
                            items : [
                                {reference : 'card2_1', html : 'card2_1'},
                                {
                                    xtype : 'routed_panel',
                                    reference : 'card2_2',
                                    plugins : {
                                        ptype : 'criterion_lazyitems',
                                        items : [
                                            {reference : 'card2_2_1', html : 'card2_2_1'},
                                            {reference : 'card2_2_2', html : 'card2_2_2'}
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };

        t.beforeEach(function() {
        });

        t.afterEach(function() {
            panel = Ext.destroy(panel);
            Ext.History.add('');
        });

        t.it('Should show correct cards based on route, two level lazy nesting', function(t) {
            Ext.History.add('card2/card2_2');
            t.diag(Ext.History.getToken());
            makePanel(twoLevel);

            t.chain([
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card2]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(1), '[reference=card2_2]']
                }
            ]);
        });

        t.it('Should show correct cards based on route, three level lazy nesting', function(t) {
            Ext.History.add('card2/card2_2/card2_2_2');
            t.diag(Ext.History.getToken());
            makePanel(threeLevel);

            t.chain([
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=card2]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(1), '[reference=card2_2]']
                },
                {
                    waitFor : 'activeCard',
                    args : [panel.items.getAt(1).items.getAt(1), '[reference=card2_2_2]']
                }
            ]);
        });
    });

    // this test mimics actual routing structure of application; disabled as too complicated :)
    t.xdescribe('Complex routing.', function(t) {
        function getConfig() {
            return {
                layout : {
                    type : 'card',
                    deferredRender : true
                },
                width : 400,
                height : 200,
                items : [
                    {
                        xtype : 'routed_panel',
                        reference : 'module1',
                        layout : {
                            type : 'card',
                            deferredRender : true
                        },
                        plugins : {
                            ptype : 'criterion_lazyitems',
                            items : [
                                {reference : 'page1_1', html : 'page1_1'},
                                {
                                    xtype : 'criterion_tabpanel',
                                    reference : 'page1_2',
                                    controller : {
                                        type : 'routed_controller'
                                    },
                                    plugins : {
                                        ptype : 'criterion_lazyitems',
                                        items : [
                                            {reference : 'page1_2_1', html : 'page1_2_1', title : 'page1_2_1'},
                                            {
                                                xtype : 'routed_panel',
                                                reference : 'page1_2_2',
                                                title : 'page1_2_2',
                                                layout : {
                                                    type : 'card',
                                                    deferredRender : true
                                                },
                                                items : [
                                                    { reference : 'page1_2_2_1', html : 'page1_2_2_1' },
                                                    { reference : 'page1_2_2_2', html : 'page1_2_2_2' }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        xtype : 'routed_panel',
                        reference : 'module2',
                        layout : {
                            type : 'card',
                            deferredRender : true
                        },
                        plugins : {
                            ptype : 'criterion_lazyitems',
                            items : [
                                {reference : 'page2_1', html : 'page2_1'},
                                {
                                    xtype : 'criterion_tabpanel',
                                    reference : 'page2_2',
                                    controller : {
                                        type : 'routed_controller'
                                    },
                                    plugins : {
                                        ptype : 'criterion_lazyitems',
                                        items : [
                                            {reference : 'page2_2_1', html : 'page2_2_1', title : 'page2_2_1'},
                                            {
                                                xtype : 'routed_panel',
                                                reference : 'page2_2_2',
                                                title : 'page2_2_2',
                                                layout : {
                                                    type : 'card',
                                                    deferredRender : true
                                                },
                                                items : [
                                                    { reference : 'page2_2_2_1', html : 'page2_2_2_1' },
                                                    { reference : 'page2_2_2_2', html : 'page2_2_2_2' }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }

        t.afterEach(function() {
            panel = Ext.destroy(panel);
            Ext.History.add('');
        });

        t.it('Should show correct cards based on initial route', function(t) {
            Ext.History.add('module1/page1_2/page1_2_2/page1_2_2_2');
            t.diag(Ext.History.getToken());
            makePanel(getConfig());

            t.chain([
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=module1]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=module1]', '[reference=page1_2]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=page1_2]', '[reference=page1_2_2]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=page1_2_2]', '[reference=page1_2_2_2]']
                }
            ]);
        });

        t.iit('Should show correct cards based on initial route', function(t) {
            Ext.History.add('module2/page2_2/page2_2_2/page2_2_2_2');
            t.diag(Ext.History.getToken());
            makePanel(getConfig());

            t.chain([
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=module2]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=module2]', '[reference=page2_2]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=page2_2]', '[reference=page2_2_2]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=page2_2_2]', '[reference=page2_2_2_2]']
                }
            ]);
        });

        t.it('Should show correct cards based on route', function(t) {
            makePanel(getConfig());

            t.chain([,
                function(next) {
                    Ext.History.add('module2/page2_2/page2_2_2/page2_2_2_2');
                    t.diag(Ext.History.getToken());
                    next();
                },
                {
                    waitFor : 'activeCard',
                    args : [panel, '[reference=module2]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=module2]', '[reference=page2_2]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=page2_2]', '[reference=page2_2_2]']
                },
                {
                    waitFor : 'activeCard',
                    args : ['[reference=page2_2_2]', '[reference=page2_2_2_2]']
                }
            ]);
        });
    });
});