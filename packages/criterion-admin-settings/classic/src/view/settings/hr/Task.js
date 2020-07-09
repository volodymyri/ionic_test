Ext.define('criterion.view.settings.hr.Task', function() {

    return {

        alias : 'widget.criterion_settings_hr_task',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.hr.Task',
            'criterion.store.employer.Projects'
        ],

        controller : {
            type : 'criterion_settings_task'
        },

        viewModel : {
            stores : {
                employerProjects : {
                    type : 'criterion_employer_projects'
                }
            }
        },

        bodyPadding : 0,

        title : i18n._('Task Details'),

        defaults : {
            labelWidth : 200
        },

        items : [
            {
                xtype : 'criterion_panel',
                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                plugins : [
                    'criterion_responsive_column'
                ],

                bodyPadding : 10,

                items : [
                    {
                        reference : 'fieldContainer',

                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n._('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Task Code'),
                                name : 'code',
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Task Name'),
                                name : 'name',
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_placeholder_field'
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n._('Project'),
                                bind : {
                                    store : '{employerProjects}',
                                    value : '{record.projectId}'
                                },
                                name : 'projectId',
                                displayField : 'name',
                                valueField : 'id',
                                queryMode : 'local',
                                allowBlank : true,
                                editable : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Task Description'),
                                name : 'description',
                                allowBlank : true
                            }
                        ]
                    }
                ]
            }
        ]
    }

});
