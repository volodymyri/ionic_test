Ext.define('criterion.overrides.view.MultiRecordPicker', {

    override : 'criterion.view.MultiRecordPicker',

    frame : true,

    bbar : [
        '->',
        {
            xtype : 'button',
            reference : 'cancelBtn',
            text : i18n.gettext('Cancel'),
            ui : 'light',
            handler : 'onCancelHandler'
        },
        {
            xtype : 'button',
            reference : 'selectButton',
            bind : {
                text : '{submitBtnText}'
            },
            disabled : true,
            handler : 'onSelectButtonHandler'
        }
    ]
});