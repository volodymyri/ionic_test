Ext.define('criterion.view.ess.dashboard.infoActionPanel.TimeOff', function() {

    return {

        extend : 'criterion.ux.grid.Panel',

        alias : 'widget.criterion_selfservice_dashboard_info_action_panel_time_off',

        requires : [
            'Ext.grid.column.Template'
        ],

        header : {
            title : i18n.gettext('My Time Offs'),
            listeners : {
                scope : 'controller',
                click : 'gotoTimeOffs'
            },
            cls : 'cursor-pointer'
        },

        iconCls : 'icon-time-offs',

        layout : 'fit',

        width : '100%',

        scrollable : false,

        hideHeaders : true,

        collapsible : true,

        titleCollapse : true,

        animCollapse : false,

        cls : 'criterion-ess-dashboard-grid criterion-ess-dashboard-timeoffs info-panel-element',

        disableSelection : true,

        bind : {
            store : '{timeOffs}'
        },

        emptyText : i18n.gettext('You have no time offs'),

        columns : [
            {
                xtype : 'templatecolumn',
                tdCls : 'criterion-ess-dashboard-grid-td',
                text : '',
                tpl : Ext.create('Ext.XTemplate',
                    '<span class="count" data-qtip="{[this.tooltip()]}">{[this.format(values.totalUsed)]} / {[this.format(values.available)]}</span>',
                    '<div class="text" data-qtip="{types}">{types}</div>',
                    {
                        format : function(val) {
                            return val.toFixed(2);
                        },
                        tooltip : function() {
                            return i18n.gettext('Used / Available')
                        }
                    }
                ),
                flex : 1
            }
        ]
    }
});

