Ext.define('criterion.view.settings.Main', function() {

    return {
        alias : 'widget.criterion_settings',

        extend : 'criterion.ux.tab.Panel',

        requires : [
            'criterion.controller.settings.Main',
            'criterion.controller.settings.Section',
            'criterion.view.settings.*'
        ],

        controller : {
            type : 'criterion_settings'
        },

        title : i18n.gettext('Settings'),

        showFilter : true,
        focusFilter : true,

        activeTab : 0,
        filterInsertIndex : 1,
        sortSubItems : true,

        defaults : {
            defaults : {
                header : false,
                autoScroll : true,
                controlEmployerBar : true,
                defaults : {
                    header : false,
                    autoScroll : true,
                    controlEmployerBar : true
                }
            },
            controller : {
                type : 'criterion_settings_section'
            }
        },

        minTabWidth : 300,

        listeners : {
            childTabClick : 'childTabClick'
        },

        useHref : true,

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        xtype : 'panel',
                        hidden : true,
                        tabConfig : {
                            notFilterable : true
                        },

                        layout : {
                            type : 'vbox',
                            align : 'stretch',
                            pack : 'center'
                        },

                        items : [
                            {
                                xtype : 'component',
                                height : 120,
                                cls : 'criterion-no-settings-img'
                            },
                            {
                                xtype : 'component',
                                cls : 'criterion-no-settings-text',
                                html : i18n.gettext('Select a "Menu Item" to view the Settings')
                            },
                            {
                                xtype : 'component',
                                cls : 'criterion-arrow',
                                height : 30
                            }
                        ],
                        securityAccess : true
                    },
                    {
                        xtype : 'criterion_settings_hr',
                        title : i18n.gettext('HR Administration'),
                        isSubMenu : true,
                        reference : 'hr',
                        tabConfig : {
                            sectionLabel : i18n.gettext('Settings')
                        },
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SETTINGS_HRADMIN, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_settings_payroll',
                        title : i18n.gettext('Payroll Administration'),
                        isSubMenu : true,
                        reference : 'payroll',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SETTINGS_PAYADMIN, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_settings_recruiting',
                        title : i18n.gettext('Recruiting Administration'),
                        isSubMenu : true,
                        reference : 'recruiting',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SETTINGS_RECADMIN, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_settings_scheduling',
                        title : i18n.gettext('Scheduling Administration'),
                        isSubMenu : true,
                        reference : 'scheduling',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SETTINGS_SCHEDADMIN, criterion.SecurityManager.READ)
                    },

                    {
                        xtype : 'criterion_settings_general',
                        reference : 'general',
                        title : i18n.gettext('General'),
                        isSubMenu : true,
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SETTINGS_GEN, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_settings_learning_management',
                        title : i18n.gettext('Learning Management'),
                        isSubMenu : true,
                        reference : 'learningManagement',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SETTINGS_LEARNMAN, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_settings_performance_reviews',
                        title : i18n.gettext('Performance Reviews'),
                        isSubMenu : true,
                        reference : 'performanceReviews',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SETTINGS_PERF, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_settings_employee_engagement',
                        title : i18n.gettext('Employee Engagement'),
                        isSubMenu : true,
                        reference : 'employeeEngagement',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SETTINGS_ENGAGE, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_settings_system',
                        title : i18n.gettext('System Configuration'),
                        isSubMenu : true,
                        reference : 'system',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SYSTEM_CONFIGURATION, criterion.SecurityManager.READ)
                    }
                ]
            }
        ],

        initComponent : function() {
            var me = this;

            me.callParent(arguments);

            me.baseHref = me.moduleId;
            this.on('afterrender', function() {
                var node = document.createElement('span');

                node.className = 'appVersionLabel';
                node.innerHTML = 'Version : ' + criterion.VERSION;

                this.getEl().appendChild(node);
            }, this);
        }
    };

});
