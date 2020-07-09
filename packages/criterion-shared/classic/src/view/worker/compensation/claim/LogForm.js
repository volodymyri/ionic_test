Ext.define('criterion.view.worker.compensation.claim.LogForm', function() {

    return {

        extend : 'criterion.view.FormView',

        alias : 'widget.criterion_worker_compensation_claim_log_form',

        modal : true,

        title : i18n.gettext('Log'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],

        defaults : {
            allowBlank : false
        },

        items : [
            {
                xtype : 'datefield',
                name : 'activityDate',
                fieldLabel : i18n.gettext('Activity Date'),
                flex : 1
            },
            {
                xtype : 'textfield',
                name : 'notes',
                fieldLabel : i18n.gettext('Notes')
            }
        ]
    };
});