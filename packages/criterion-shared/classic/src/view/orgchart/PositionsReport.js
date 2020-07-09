Ext.define('criterion.view.orgchart.PositionsReport', function() {

    return {
        alias : 'widget.criterion_orgchart_positions_report',
        extend : 'Ext.Container',

        requires : [
            'criterion.view.orgchart.position.Base'
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        /**
         * xtype of position card
         */
        positionComponent : 'criterion_orgchart_position_base',

        mixins : [
            'Ext.util.StoreHolder'
        ],

        config : {
            showRootNode : true,
            goToProfile : false,
            isSingleEmployer : true
        },

        /**
         * Number of columns in row.
         */
        colNum : 3,

        initComponent : function() {
            if (this.store) {
                this.bindStore(this.store, true, true);
                // this.items = this.createComponents();
            }

            this.callParent(arguments);
        },

        getStoreListeners : function() {
            return {
                refresh : function() {
                    var components = this.createComponents(),
                        me = this;

                    this.removeAll();

                    components.length && me.add(components);
                }
            }
        },

        createItem : function(node) {
            var me = this;

            return {
                xtype : this.positionComponent,
                parentItemId : this.parentItemId,
                editable : this.editable,
                record : node,
                isEmployerNameHidden : me.isSingleEmployer,
                goToProfile : me.getGoToProfile(),
                listeners : {
                    gotoProfile : function(record) {
                        me.fireEvent('gotoProfile', record)
                    },
                    zoom : function(record) {
                        me.fireEvent('zoom', record);
                    }
                }
            }
        },

        createComponents : function() {
            var me = this,
                store = this.getStore(),
                result = [],
                rootNode,
                childNodes;

            if (!me.parentItemId) {
                throw new Error("'parentItemId' not found");
            }

            if (store) {
                rootNode = store.getRootNode();
            }

            if (!rootNode) { // empty store
                return [
                    {
                        xtype : 'panel',

                        items : [
                            {
                                xtype : this.positionComponent,
                                parentItemId : me.parentItemId,
                                editable : me.editable,
                                data : {}
                            }
                        ]
                    }
                ]
            }

            // construct root node
            if (this.getShowRootNode()) {

                if (Ext.isDefined(rootNode.get('supervisorId'))) {
                    result.push({
                        xtype : 'component',
                        cls : 'criterion-orgchart-supervisor',
                        html : '<span class="x-unselectable">' +
                                    '<span class="icon">&#' + criterion.consts.Glyph['ios7-undo'] + '</span>' +
                                    rootNode.get('supervisorName') +
                                '</span>',
                        listeners : {
                            render : {
                                single : true,
                                fn : function(cmp) {
                                    me.mon(cmp.el, {
                                        click : function() {
                                            me.fireEvent('goToSupervisor', rootNode);
                                        }
                                    });
                                }
                            }
                        }
                    });
                }

                result.push({
                    xtype : 'container',
                    layout : 'hbox',
                    cls : 'criterion-orgchart-header',

                    defaults : {
                        xtype : 'box'
                    },

                    items : [
                        {
                            flex : 1
                        },
                        Ext.apply(this.createItem(rootNode), {
                            flex : 1,
                            margin : '25 100',
                            cls : 'criterion-position-card-header'
                        }),
                        {
                            flex : 1
                        }
                    ]
                });
            }

            childNodes = rootNode.childNodes;

            var i, I;

            for (i = 0, I = childNodes.length; i < I; i++) {
                var childNode = childNodes[i];

                if (i % this.colNum === 0) { // push container
                    result.push({
                        xtype : 'container',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        defaults : {
                            columnWidth : 0.33,
                            flex : 1,
                            margin : '25 35'
                        },

                        items : []
                    });
                }

                result[result.length - 1].items.push(this.createItem(childNode));
            }

            if (result.length) {
                // fill in remaining empty spots
                for (i = 0, I = this.colNum - result[result.length - 1].items.length; i < I; i++) {
                    result[result.length - 1].items.push({
                        xtype : 'component'
                    });
                }
            }

            return result;
        }
    }
});
