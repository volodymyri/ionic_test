Ext.define('criterion.view.hr.dashboard.Panel', function() {

    var SMALL_CHARTS = criterion.consts.Dashboard.VIEW.SMALL_CHARTS;

    return {
        extend : 'Ext.container.Container',

        mixins : [
            'criterion.ux.mixin.RecordsHolder'
        ],

        requires : [
            'Ext.layout.container.Center'
        ],

        config : {
            maxCount : 1
        },

        padding : '0 0 7',

        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        title : false,

        getRecordItems : function() {
            return this.query('> ' + this.defaultType);
        },

        getTotalCount : function() {
            return Ext.Array.sum(Ext.Array.pluck(this.getRecordItems(), 'dashboardFlex')) || 0;
        },

        updateFiller : function() {
            var filter = this.down('#filler'),
                store = this.getStore();

            if (store && store.viewNumber == SMALL_CHARTS && this.getTotalCount() > 0) {
                filter.setMargin('46 5 5 5');
            } else {
                filter.setMargin(5);
            }

            filter.setVisible(this.getTotalCount() < this.maxCount);
        },

        createRecordItem : function(record) {
            var me = this,
                maxCount = this.maxCount,
                summaryMaxCount = this.getTotalCount(),
                flex = record.get('flex') || 1,
                item;

            if (summaryMaxCount < maxCount) {
                flex = Math.min(flex, maxCount - summaryMaxCount);

                item = {
                    dashboardFlex : flex,
                    flex : 1,
                    listeners : {
                        configValuePanelItem : function(btn) {
                            me.fireEvent('configValuePanelItem', btn)
                        },
                        configChartPanelItem : function(store, record) {
                            me.fireEvent('configChartPanelItem', store, record)
                        }
                    }
                };
            }

            return item;
        },

        addRecordItem : function(item) {
            item = this.insert(this.items.getCount() - 1, item);
            this.updateFiller();

            return item;
        },

        removeRecordItem : function() {
            this.mixins.recordsholder.removeRecordItem.apply(this, arguments);
            this.updateFiller();
        },

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    xtype : 'container',
                    flex : 1,
                    margin : 5,
                    cls : 'criterion-empty-chart',
                    layout : 'center',
                    itemId : 'filler',
                    items : [
                        {
                            xtype : 'button',
                            action : 'add',
                            ident : Ext.getClassName(me),
                            listeners : {
                                click : function(btn) {
                                    me.fireEvent('addPanelElement', btn);
                                }
                            },
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM, criterion.SecurityManager.CREATE, true)
                            },
                            cls : 'criterion-btn-transparent',
                            glyph : criterion.consts.Glyph['plus'],
                            scale : 'large'
                        }
                    ]
                }
            ];

            me.callParent(arguments);
            me.mixins.recordsholder.init.call(me);
        }

    };

});
