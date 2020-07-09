Ext.define('ess.view.Learning', function() {

    return {
        alias : 'widget.ess_modern_learning',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.Learning',
            'criterion.store.learning.Active',
            'criterion.store.learning.CourseForEnroll',
            'ess.view.learning.Course',
            'ess.view.learning.ActiveCourses',
            'ess.view.learning.CoursesForEnroll',
            'ess.view.learning.CourseForEnroll',
            'ess.view.learning.CourseClassesForEnroll',
            'ess.view.learning.CourseClassForEnroll'
        ],

        layout : 'card',

        controller : {
            type : 'ess_modern_learning'
        },

        listeners : {
            scope : 'controller',
            activate : 'onActivate'
        },

        viewModel : {
            stores : {
                active : {
                    type : 'criterion_learning_active',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                },
                courseForEnroll : {
                    type : 'criterion_learning_course_for_enroll',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }
            }
        },

        items : [
            {
                xtype : 'ess_modern_learning_active_courses',
                reference : 'courseGrid',
                height : '100%'
           },

            // courses for enroll (assign)
            {
                xtype : 'ess_modern_learning_courses_for_enroll',
                reference : 'courseForEnrollGrid',
                height : '100%'
            },

            // course for enroll form
            {
                xtype : 'ess_modern_learning_course_for_enroll',
                reference : 'learningCourseFormForEnroll',
                height : '100%',
                listeners : {
                    goBack : 'handleBackToEnrollCourses',
                    enrollCourse : 'handleEnrollCourse',
                    selectClass : 'handleSelectCourseClass'
                }
            },

            // course classes for enroll
            {
                xtype : 'ess_modern_learning_course_classes_for_enroll',
                reference : 'courseClassesForEnrollGrid',
                height : '100%'
            },

            // course class for enroll form
            {
                xtype : 'ess_modern_learning_course_class_for_enroll',
                reference : 'learningCourseClassFormForEnroll',
                height : '100%',
                listeners : {
                    goBack : 'handleBackToCourseClassSelect',
                    enrollClass : 'handleEnrollClass'
                }
            },

            // course form
            {
                xtype : 'ess_modern_learning_course',
                reference : 'learningCourseForm',
                height : '100%',

                listeners : {
                    goBack : 'handleBackToActiveCourses',
                    showFrame : 'handleShowCourseFrame'
                }
            },

            // course iframe
            {
                xtype : 'container',
                reference : 'iframeContainer',
                height : '100%',
                layout : 'fit',

                viewModel : {
                    data : {
                        url : 'about:blank',
                        title : i18n.gettext('Course'),
                        height : 500
                    }
                },

                listeners : {
                    activate : function(cmp) {
                        Ext.defer(function() {
                            cmp.getViewModel().set('height', cmp.bodyElement.getHeight());
                        }, 200);
                    }
                },

                items : [
                    {
                        xtype : 'ess_modern_menubar',
                        docked : 'top',
                        bind : {
                            title : '{title}'
                        },
                        buttons : [
                            {
                                xtype : 'button',
                                iconCls : 'md-icon-arrow-back',
                                handler : function() {
                                    Ext.GlobalEvents.fireEvent('toggleMainMenu');
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'component',
                        bind : {
                            html : '<iframe src="{url}" width="100%" height="{height}" frameborder="0"></iframe>'
                        }
                    }
                ]
            }
        ]

    };

});
