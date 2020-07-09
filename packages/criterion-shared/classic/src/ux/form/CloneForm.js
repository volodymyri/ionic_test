Ext.define('criterion.ux.form.CloneForm', function() {

    return {

        alias : 'widget.criterion_form_clone_form',

        extend : 'Ext.form.Panel',

        viewModel : {
            data : {
                disableCloneBtn : false,
                itemsToClone : {}
            }
        },

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
        title : i18n.gettext('Clone'),

        items : [],

        buttons : [
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                handler : function() {
                    this.up('criterion_form_clone_form').fireEvent('cancel');
                },
                text : i18n.gettext('Cancel')
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Clone'),
                handler : function() {
                    let view = this.up('criterion_form_clone_form');

                    if (view.getForm().isValid()) {
                        view.fireEvent('clone', Ext.clone(view.getViewModel().getData()));
                    }
                },
                disabled : true,
                bind : {
                    disabled : '{disableCloneBtn}'
                }
            }
        ],

        focusFirstField() {
            let field = this.getForm().getFields().findBy(field => !field.disabled && !field.readOnly);

            Ext.Function.defer(() => {
                field && field.focus && field.focus();
            }, 100);
        }

    }
});
