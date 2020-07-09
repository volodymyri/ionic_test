Ext.define('criterion.view.settings.benefits.benefit.AddRatesForm', function() {

    return {
        extend : 'criterion.ux.Panel',

        closable : false,

        title : i18n.gettext('Add Rates'),

        layout : 'fit',

        bodyPadding : 20,

        modal : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_CONFIG.MODAL_NARROWER_WIDTH,
                modal : true
            }
        ],

        items : [
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Effective Date'),
                allowBlank : false
            }
        ],

        constructor : function() {
            this.bbar = [
                '->',
                {
                    xtype : 'button',
                    text : i18n.gettext('Cancel'),
                    cls : 'criterion-btn-light',
                    listeners : {
                        scope : this,
                        click : function() {
                            this.fireEvent('close');
                        }
                    }
                },
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Create'),
                    listeners : {
                        scope : this,
                        click : 'onCreate'
                    }
                }
            ];

            this.callParent(arguments);
        },

        onCreate : function() {
            var formName = this.down('datefield');

            if (formName.isValid()) {
                this.fireEvent('create', formName.getValue());
            } else {
                formName.focus();
            }
        }
    };
});
