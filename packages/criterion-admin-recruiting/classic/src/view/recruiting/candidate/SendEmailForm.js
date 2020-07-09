Ext.define('criterion.view.recruiting.candidate.SendEmailForm', function() {

    return {
        extend : 'criterion.ux.Panel',

        closable : false,

        title : i18n.gettext('Send Email'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        requires : [
            'criterion.store.Forms'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_CONFIG.MODAL_NARROWER_WIDTH,
                modal : true
            }
        ],

        viewModel : {
            recruitingEmail : null
        },

        defaults : {
            padding : '10 10 0 10'
        },

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Subject'),
                allowBlank : false,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                bind : '{recruitingEmail.subjectProcessed}'
            },
            {
                xtype : 'criterion_htmleditor',
                fieldLabel : i18n.gettext('Body'),
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH - 5,
                bind : '{recruitingEmail.bodyProcessed}',
                allowBlank : false,
                height : 300
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
            var vm = this.getViewModel();

            this.fireEvent('send', vm.get('recruitingEmail'));
        }
    };

});