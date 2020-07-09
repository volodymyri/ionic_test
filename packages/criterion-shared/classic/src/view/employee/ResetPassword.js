Ext.define('criterion.view.employee.ResetPassword', function() {

    return {
        alias : 'widget.criterion_employee_reset_password',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.employee.ResetPassword'
        ],

        controller : {
            type : 'criterion_employee_reset_password'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : 500,
                height : 'auto'
            }
        ],

        bodyPadding : '10 10 10 25',

        title : i18n.gettext('Reset Password'),

        viewModel : {
            data : {
                typeEmail : true,
                typePassword : false,
                forceReset : true,
                massMode : false,
                resetButtonText : i18n.gettext('Reset'),
                statusText : ''
            }
        },

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                scale : 'small',
                handler : 'handleReset',
                bind : {
                    text : '{resetButtonText}'
                }
            }
        ],

        defaults : {
            labelWidth : 400
        },

        items : [
            {
                xtype : 'component',
                hidden : true,
                padding : '17 0',
                bind : {
                    html : '{statusText}',
                    hidden : '{!statusText}'
                }
            },
            {
                xtype : 'radiofield',
                boxLabel : i18n.gettext('Email password reset instructions'),
                inputValue : 'email',
                name : 'type',
                bind : '{typeEmail}'
            },
            {
                xtype : 'textfield',
                name : 'email',
                hidden : true,
                allowBlank : false,
                vtype : 'email',
                bind : {
                    value : '{email}',
                    hidden : '{typePassword || massMode}',
                    disabled : '{typePassword || massMode}'
                }
            },
            {
                xtype : 'radiofield',
                inputValue : 'password',
                name : 'type',
                bind : {
                    value : '{typePassword}',
                    boxLabel : '{massMode?"' + i18n.gettext('Generate random') + '":"' + i18n.gettext('Let me create a password') + '"}'
                }
            },
            {
                xtype : 'textfield',
                name : 'password',
                hidden : true,
                allowBlank : false,
                bind : {
                    value : '{password}',
                    hidden : '{typeEmail || massMode}',
                    disabled : '{typeEmail || massMode}'
                }
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Make this user change their password when they first sign in'),
                name : 'forceReset',
                hidden : true,
                bind : {
                    value : '{forceReset}',
                    hidden : '{typeEmail}'
                }
            }
        ]

    }
});
