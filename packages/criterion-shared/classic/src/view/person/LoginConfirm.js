Ext.define('criterion.view.person.LoginConfirm', function() {

    return {
        alias : 'widget.employee_login_confirm_panel',

        extend : 'criterion.ux.Panel',

        itemId : 'employee_login_confirm_panel',

        bodyPadding : 10,

        border : true,
        shadow : false,

        /**
         * criterion.model.Person
         * @required
         */
        person : null,

        /**
         * @required
         */
        password : '',
        isReset : false,
        resetData : null,
        hasWorkflow : false,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto'
            }
        ],

        initComponent : function() {
            var me = this,
                bodyTpl,
                data = Ext.merge({
                    password : this.password,
                    login : this.person.data.email,
                    resetEmail : this.resetData && Ext.isDefined(this.resetData.email) ? this.resetData.email : ''
                }, this.person.data),
                messageClass = this.isReset ? 'password-reset' : 'new-employee-created';

            me.items = [
                {
                    xtype : 'container',
                    cls : 'headerPanel',

                    items : [
                        {
                            html : '<h1 class="' + messageClass + '">' + (this.isReset ? i18n.gettext('Password has been reset') : (this.hasWorkflow ? i18n.gettext('New Employee has been sent to approval') : i18n.gettext('New Employee Created'))) + '</h1>',
                            style : {
                                'font-size' : '40px'
                            }
                        }
                    ]
                }
            ];

            if (me.isReset) {
                if (this.resetData && Ext.isDefined(this.resetData.email)) {
                    bodyTpl = Ext.create(
                        'Ext.XTemplate',
                        '<p>' + i18n.gettext('The password reset instructions were sent <br />to employee email address - <a href="mailto:{resetEmail}">{resetEmail}</a>') + '</p>'
                    );
                } else {
                    bodyTpl = Ext.create(
                        'Ext.XTemplate',
                        '<p>' + i18n.gettext('In case you reset a password for your subordinate, <br />make sure the employee is aware about the password change.') + '</p>'
                    );
                }
            } else {
                bodyTpl = Ext.create(
                    'Ext.XTemplate',
                    '<p>' + i18n.gettext('{firstName} {lastName} is now set up as an employee.') + '</p>'
                );
            }

            me.items.push({
                itemId : 'bodyPanel',
                cls : 'bodyPanel ' + messageClass,
                html : bodyTpl.apply(data)
            });

            me.buttons = [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Ok'),
                    scale : 'small',
                    handler : function() {
                        this.up('panel').destroy();
                    }
                }
            ];

            this.setTitle(this.isReset ? i18n.gettext('Successful Reset') : i18n.gettext('Add Employee'));

            this.callParent(arguments);
        }
    }
});
