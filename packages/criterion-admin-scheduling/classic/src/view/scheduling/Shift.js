Ext.define('criterion.view.scheduling.Shift', {

    extend : 'criterion.view.FormView',

    alias : 'widget.criterion_scheduling_shift',

    plugins : [
        {
            ptype : 'criterion_sidebar',
            modal : true,
            height : 'auto',
            width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
        }
    ],

    bodyPadding : 20,
    modal : true,
    draggable : true,
    title : i18n.gettext('Shift'),

    items : [
        {
            xtype : 'textfield',
            fieldLabel : i18n.gettext('Name'),
            name : 'name',
            bind : '{record.name}'
        },
        {
            xtype : 'numberfield',
            fieldLabel : i18n.gettext('Sequence'),
            name : 'sequence',
            bind : '{record.sequence}',
            maxValue : 10000,
            minValue : 0
        }
    ]
});
