Ext.define('criterion.view.settings.learning.Path', function() {

    return {

        alias : 'widget.criterion_settings_learning_path',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.learning.Path',
            'criterion.store.employer.Courses',
            'criterion.view.settings.learning.PathCourses',
            'criterion.store.employeeGroup.LearningPaths'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        bodyPadding : 0,

        title : i18n.gettext('Learning Path Courses'),

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
        },

        controller : {
            type : 'criterion_settings_learning_path',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                allCourses : {
                    type : 'criterion_employer_courses'
                },
                employeeGroupLearningPaths : {
                    type : 'criterion_employee_group_learning_paths'
                }
            }
        },

        items : [
            {
                xtype : 'criterion_panel',

                plugins : [
                    'criterion_responsive_column'
                ],

                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                bodyPadding : '0 10 10',

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
                                fieldLabel : i18n.gettext('Code'),
                                name : 'code',
                                bind : '{record.code}',
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                name : 'name',
                                bind : '{record.name}',
                                allowBlank : false
                            },
                            {
                                xtype : 'criterion_employee_group_combobox',
                                reference : 'employeeGroupCombo',
                                objectParam : 'learningPathId',
                                bind : {
                                    valuesStore : '{employeeGroupLearningPaths}'
                                }
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_settings_learning_path_courses',
                reference : 'courseGrid'
            }
        ]
    };
});
