Ext.define('criterion.view.hr.dashboard.ValuesPanelItem', function() {

    return {
        alias : 'widget.criterion_hr_dashboard_values_panel_item',

        extend : 'Ext.container.Container',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        config : {
            itemData : null,
            record : null
        },

        formatValue : function(value, type) {
            if (value === null) {
                return '-';
            }

            switch (type) {
                case 'currency':
                    return Ext.util.Format.currency(value);
                case '%':
                    value *= 100;
                    if (value !== Math.round(value)) {
                        value = value.toFixed(2);
                    }

                    return value + '%';

                case 'float':
                    return value.toFixed(2);

                default:
                    return Math.round(value);
            }
        },

        getRequestParams : function(record) {
            var params = {},
                data = record.getData({
                    serialize : true
                });

            if (data.metric) {
                Ext.Object.each(data.metric.additionalParams, function(key) {
                    data[key] ? params[key] = data[key] : null;
                });
            }

            return params;
        },

        setItemData : function(data) {
            this.rendered && this.down('#wrapper').setData(data);

            this.callParent(arguments);
        },

        setRecord : function(record) {
            var metric = record.get('metric');

            this.setItemData({
                value : '',
                title : metric.name,
                cls : 'ion-refreshing'
            });

            if (metric.url) {
                criterion.Api.request({
                    method : 'GET',
                    url : metric.url,
                    params : this.getRequestParams(record),
                    scope : this,
                    success : function(result) {
                        this.setItemData({
                            value : this.formatValue(result, metric.type),
                            title : metric.name,
                            cls : ''
                        });
                    }
                });
            }

            this.callParent(arguments);
        },

        initComponent : function(config) {
            var me = this;

            me.items = [
                {
                    xtype : 'component',
                    cls : 'criterion-hr-dashboard-values-panel-item-wrap',
                    itemId : 'wrapper',
                    tpl : [
                        '<tpl for=".">',
                        '<div class="criterion-hr-dashboard-values-panel-item-value {cls}">{value}</div>',
                        '<div class="criterion-hr-dashboard-values-panel-item-title">{title}</div>',
                        '</tpl>'
                    ]
                },
                {
                    xtype : 'button',
                    cls : 'criterion-hr-dashboard-panel-item-config',
                    itemId : 'config',
                    hidden : true,
                    bind : {
                        hidden : criterion.SecurityManager.getComplexSecurityFormula({
                            rules : {
                                AND : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM,
                                        actName : criterion.SecurityManager.UPDATE,
                                        reverse : true
                                    },
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM,
                                        actName : criterion.SecurityManager.DELETE,
                                        reverse : true
                                    }
                                ]
                            }
                        })
                    },
                    listeners : {
                        click : function(btn) {
                            me.fireEvent('configValuePanelItem', btn)
                        }
                    },
                    glyph : criterion.consts.Glyph['arrow-down-b']
                }
            ];

            me.callParent(arguments);
        },

        handleMouseEnter : function() {
            var me = this;

            me.configEl.setOpacity(1, {
                duration : 200,
                easing : 'ease-in'
            });
        },

        handleMouseLeave : function() {
            var me = this;

            me.configEl.setOpacity(0, {
                duration : 200,
                easing : 'ease-in'
            });
        },

        onBoxReady : function() {
            var me = this;

            me.callParent(arguments);
            me.configEl = me.down('#config').el;

            me.configEl.setOpacity(0);

            me.mon(me.el, {
                scope : me,
                mouseenter : me.handleMouseEnter
            });
            me.mouseMonitor = me.el.monitorMouseLeave(100, me.handleMouseLeave, me);
            this.down('#wrapper').setData(this.getItemData());
        }

    };
});
