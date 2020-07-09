Ext.define('criterion.view.recruiting.candidate.SendForm', function() {

    return {
        extend : 'criterion.ux.Panel',

        closable : false,

        title : i18n.gettext('Send Form'),

        layout : 'fit',

        bodyPadding : 20,

        requires : [
            'criterion.store.WebForms'
        ],

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
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Form Name'),
                editable : false,
                autoSelect : true,
                valueField : 'id',
                displayField : 'name',
                queryMode : 'local',
                allowBlank : false,
                store : {
                    type : 'criterion_web_forms',
                    autoLoad : true
                }
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
                    text : i18n.gettext('Send'),
                    listeners : {
                        scope : this,
                        click : 'onSend'
                    }
                }
            ];

            this.callParent(arguments);
        },

        onSend : function() {
            var formName = this.down('combobox');

            if (formName.isValid()) {
                this.fireEvent('send', formName.getValue());
            } else {
                formName.focus();
            }
        }
    };

});
