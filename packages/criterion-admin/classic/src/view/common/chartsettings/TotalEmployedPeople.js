Ext.define('criterion.view.common.chartsettings.TotalEmployedPeople', function () {

    var CHART_TYPES = criterion.consts.Dashboard.getChartTypes();

    return {

        alias : 'widget.criterion_chart_settings_total_employed_people',

        extend : 'criterion.ux.form.Panel',

        initComponent : function () {
            var me = this;

            Ext.apply(me, {
                items : [
                    {
                        xtype : 'radiogroup',
                        fieldLabel : i18n.gettext('Type'),
                        columns : 1,
                        vertical : true,
                        items : [
                            {
                                boxLabel : i18n.gettext('Pie'),
                                name : 'chartType',
                                inputValue : CHART_TYPES.PIE.name,
                                checked : true
                            },
                            {
                                boxLabel : i18n.gettext('Bar'),
                                name : 'chartType',
                                inputValue : CHART_TYPES.BAR.name
                            }
                        ]
                    }
                ]
            });

            me.callParent(arguments);
        }
    }
});
