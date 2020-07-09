Ext.define('criterion.view.settings.benefits.openEnrollment.OpenEnrollment', function() {

    return {
        alias : 'widget.criterion_settings_open_enrollment',

        extend : 'criterion.ux.BreadcrumbPanel',

        requires : [
            'criterion.ux.BreadcrumbPanel',
            'criterion.controller.settings.benefits.openEnrollment.OpenEnrollment',
            'criterion.view.settings.benefits.openEnrollment.OpenEnrollmentSetup',
            'criterion.view.settings.benefits.openEnrollment.Announcements',
            'criterion.view.settings.benefits.openEnrollment.Steps',
            'criterion.view.settings.benefits.openEnrollment.AutoRollover'
        ],

        controller : {
            type : 'criterion_settings_open_enrollment'
        },

        viewModel : {
            data : {
                openEnrollment : null,
                openEnrollmentEmployeeGroupIds : null
            }
        },

        header : {
            title : i18n.gettext('Open Enrollment'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Clone'),
                    handler : 'handleClone',
                    hidden : true,
                    bind : {
                        disabled : '{disableSave}',
                        hidden : '{!openEnrollment}'
                    }
                }
            ]
        },

        defaults : {
            skipDirtyConfirmation : true
        },

        items : [
            {
                xtype : 'criterion_settings_open_enrollment_setup',
                title : i18n.gettext('Setup'),
                header : false,
                reference : 'setup',
                listeners : {
                    cancel : 'onCancel',
                    delete : 'onDelete',
                    save : 'onSetupSave'
                }
            },
            {
                xtype : 'criterion_settings_open_enrollment_announcements',
                reference : 'announcements',
                title : i18n.gettext('Announcements'),
                header : false,
                listeners : {
                    cancel : 'onCancel',
                    save : 'onAnnouncementsSave',
                    prev : 'onAnnouncementsPrev'
                }
            },
            {
                xtype : 'criterion_settings_open_enrollment_steps',
                reference : 'steps',
                title : i18n.gettext('Steps'),
                header : false,
                listeners : {
                    cancel : 'onCancel',
                    save : 'onStepSave',
                    prev : 'onStepsPrev'
                }
            },
            {
                xtype : 'criterion_settings_open_enrollment_auto_rollover',
                reference : 'autoRollover',
                title : i18n.gettext('Auto Rollover'),
                header : false,
                listeners : {
                    cancel : 'onCancel',
                    save : 'onSave',
                    prev : 'onAutoRolloverPrev'
                }
            }
        ],

        loadRecord : function(record) {
            if (record.phantom) {
                this.items.remove(this.down('[reference=autoRollover]'));
                this.updateStates();
            }

            this.getController().load(record);

            Ext.GlobalEvents.fireEvent('disableSettingsPanel', false);
        },

        initComponent : function() {
            criterion.detectDirtyForms && !this.skipDirtyConfirmation && Ext.GlobalEvents.on('beforeHideForm', this.onBeforeHideForm, this);

            this.callParent(arguments);
        },

        onBeforeHideForm : function() {
            this.getController().onCancel();

            return true;
        }
    };

});
