Ext.define('criterion.overrides.view.MultiRecordPickerRemote', {

    override : 'criterion.view.MultiRecordPickerRemote',

    bbar : [
        '->',
        {
            xtype : 'button',
            reference : 'cancelButton',
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