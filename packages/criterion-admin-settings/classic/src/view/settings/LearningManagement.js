Ext.define('criterion.view.settings.LearningManagement', function() {

    return {
        alias : 'widget.criterion_settings_learning_management',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.settings.learning.*'
        ],

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('Learning Management'),

        items : [
            {
                xtype : 'criterion_settings_learning_skills',
                title : i18n.gettext('Skills'),
                reference : 'skills'
            },
            {
                xtype : 'criterion_settings_learning_courses',
                title : i18n.gettext('Courses'),
                reference : 'courses'
            },
            {
                xtype : 'criterion_settings_learning_classes',
                title : i18n.gettext('Classes'),
                reference : 'classes'
            },
            {
                xtype : 'criterion_settings_learning_instructors',
                title : i18n.gettext('Instructors'),
                reference : 'instructors'
            },
            {
                xtype : 'criterion_settings_learning_certifications',
                title : i18n.gettext('Certification'),
                reference : 'certification'
            },
            {
                xtype : 'criterion_settings_learning_paths',
                title : i18n.gettext('Learning Paths'),
                reference : 'learningPaths'
            }
        ]
    };

});
