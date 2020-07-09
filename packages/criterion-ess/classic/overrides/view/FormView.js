Ext.define('criterion.overrides.view.FormView', {

    override : 'criterion.view.FormView',

    requires : [
        'criterion.ux.button.Back'
    ],

    setButtonConfig : function() {
        if (this.getNoButtons()) {
            return;
        }

        var buttons = [];

        if (this.getAllowDelete()) {
            buttons.push(
                {
                    xtype : 'button',
                    reference : 'delete',
                    text : i18n.gettext('Delete'),
                    ui : 'remove',
                    listeners : {
                        click : 'handleDeleteClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableDelete}',
                        hidden : '{hideDelete}'
                    }
                },
                '->'
            )
        }

        buttons.push(
            {
                xtype : 'button',
                ui : 'light',
                reference : 'cancel',
                listeners : {
                    click : 'handleCancelClick'
                },
                hidden : true,
                bind : {
                    text : '{cancelBtnText}',
                    disabled : '{blockedState}',
                    hidden : '{hideCancel}'
                }
            },
            {
                xtype : 'button',
                reference : 'submit',
                listeners : {
                    click : 'handleSubmitClick'
                },
                hidden : true,
                bind : {
                    disabled : '{disableSave}',
                    text : '{submitBtnText}',
                    hidden : '{hideSave}'
                }
            }
        );

        this.buttons = buttons;
    },

    //Override focusFirstField to prevent fields validation blinks.
    focusFirstField : function() {
        var submitButton = this.down('button[ui=default-small]');

        submitButton && submitButton.focus && Ext.Function.defer(function() {
            submitButton.focus && submitButton.focus();
        }, 100);
    }
});