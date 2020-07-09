Ext.define('criterion.view.employee.SubmitConfirm', function() {

    return {

        alias : 'widget.criterion_employee_submit_confirm',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.ux.SignaturePad',
            'criterion.controller.employee.SubmitConfirm'
        ],

        title : i18n.gettext('Confirm'),

        controller : {
            type : 'criterion_employee_submit_confirm'
        },

        listeners : {
            scope : 'controller',
            show : 'handleShow'
        },

        viewModel : {
            data : {
                confirmText : '',
                isSignature : false,
                defaultActBtnText : i18n.gettext('Submit')
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_CONFIG.MODAL_NARROW_WIDTH,
                modal : true
            }
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,
        draggable : false,
        modal : true,
        closable : false,

        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'closeBtn',
                text : i18n.gettext('Close'),
                cls : 'criterion-btn-light',
                handler : 'onCancel'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                handler : 'onSubmit',
                bind : {
                    text : '{defaultActBtnText}'
                }
            }
        ],

        items : [
            {
                xtype : 'component',
                width : 200,
                bind : {
                    html : '{confirmText}'
                }
            },
            {
                xtype : 'component',
                html : i18n.gettext('Signature'),
                margin : '10 0 0 0',
                hidden : true,
                bind : {
                    hidden : '{!isSignature}'
                }
            },
            {
                xtype : 'criterion_signature_pad',
                reference : 'signaturePad',
                margin : '0 10 10 0',
                hidden : true,
                bind : {
                    hidden : '{!isSignature}'
                }
            }
        ]
    }
});
