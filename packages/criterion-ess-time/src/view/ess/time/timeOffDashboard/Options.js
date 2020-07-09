Ext.define('criterion.view.ess.time.timeOffDashboard.Options', function() {

    return {

        extend : 'Ext.form.Panel',

        alias : 'widget.criterion_selfservice_time_time_off_dashboard_options',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                modal : true
            }
        ],

        viewModel : {
            data : {
                timeOffTypeIds : []
            }
        },

        title : i18n.gettext('Options'),

        draggable : false,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        items : [
            {
                xtype : 'criterion_tagfield',
                fieldLabel : i18n.gettext('Time Off Type'),
                bind : {
                    store : '{timeOffTypes}',
                    value : '{timeOffTypeIds}'
                },
                queryMode : 'local',
                valueField : 'id',
                displayField : 'description'
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                listeners : {
                    click : function() {
                        var view = this.up('criterion_selfservice_time_time_off_dashboard_options');

                        view.fireEvent('cancel');
                    }
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Apply'),
                listeners : {
                    click : function() {
                        var view = this.up('criterion_selfservice_time_time_off_dashboard_options'),
                            vm = view.getViewModel();

                        view.fireEvent('applyOptions', {
                            timeOffTypeIds : vm.get('timeOffTypeIds')
                        });
                    }
                }
            }
        ]
    }
});
