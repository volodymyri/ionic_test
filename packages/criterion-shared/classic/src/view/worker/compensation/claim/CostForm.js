Ext.define('criterion.view.worker.compensation.claim.CostForm', function() {

    return {

        extend : 'criterion.view.FormView',

        alias : 'widget.criterion_worker_compensation_claim_cost_form',

        modal : true,
        draggable : true,

        title : i18n.gettext('Cost'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                modal : true,
                height : 'auto'
            }
        ],

        defaults : {
            allowBlank : false
        },

        items : [
            {
                xtype : 'textfield',
                name : 'description',
                fieldLabel : i18n.gettext('Description'),
                flex : 1
            },
            {
                xtype : 'numberfield',
                name : 'cost',
                fieldLabel : i18n.gettext('Cost')
            }
        ]
    };
});
