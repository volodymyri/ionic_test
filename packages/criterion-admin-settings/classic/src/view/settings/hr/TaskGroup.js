Ext.define('criterion.view.settings.hr.TaskGroup', function() {

    return {

        alias : 'widget.criterion_settings_task_group',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.hr.TaskGroup',
            'criterion.store.employer.TaskGroupDetails',
            'criterion.view.settings.hr.TaskGroupDetail'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        bodyPadding : 0,

        title : i18n.gettext('Task Group Details'),

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
        },

        controller : {
            type : 'criterion_settings_task_group',
            externalUpdate : false
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_panel',
                    layout : 'hbox',

                    defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,
                    plugins : [
                        'criterion_responsive_column'
                    ],
                    bodyPadding : 10,

                    items : [
                        {
                            items : [
                                {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    disabled : true,
                                    hideTrigger : true
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Task Group Name'),
                                    name : 'name',
                                    bind : '{record.name}',
                                    allowBlank : false
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_settings_task_group_details',
                    bind : {
                        store : '{record.details}'
                    }
                }
            ];

            this.callParent(arguments);
        }
    };

});


