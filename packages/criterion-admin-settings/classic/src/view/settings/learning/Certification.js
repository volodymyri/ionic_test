Ext.define('criterion.view.settings.learning.Certification', function() {

    return {

        alias : 'widget.criterion_settings_learning_certification',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.learning.Certification',
            'criterion.view.settings.learning.certification.CourseForm',
            'criterion.store.employer.Courses',
            'criterion.store.learning.CertificationCourses'
        ],

        controller : {
            type : 'criterion_settings_learning_certification',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                allCourses : {
                    type : 'criterion_employer_courses'
                }
            }
        },

        bodyPadding : 0,

        title : i18n.gettext('Certificate Details'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    layout : 'hbox',

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    bodyPadding : 10,

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

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
                                    fieldLabel : i18n.gettext('Name'),
                                    name : 'name',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Description'),
                                    name : 'description',
                                    allowBlank : false
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Issued By'),
                                    name : 'issuedBy',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Min Courses Required'),
                                    name : 'minCoursesRequired'
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Validity Period (years)'),
                                    name : 'validityPeriod'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_gridview',
                    reference : 'courseGrid',

                    tbar : [
                        {
                            xtype : 'button',
                            reference : 'addButton',
                            text : i18n.gettext('Add'),
                            cls : 'criterion-btn-feature',
                            listeners : {
                                click : 'handleAddClick'
                            }
                        },
                        '->',
                        {
                            xtype : 'button',
                            reference : 'refreshButton',
                            cls : 'criterion-btn-transparent',
                            glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                            scale : 'medium',
                            bind : {
                                disabled : '{isPhantom}'
                            },
                            listeners : {
                                click : 'handleRefreshClick'
                            }
                        }
                    ],

                    flex : 1,

                    store : {
                        type : 'criterion_certification_courses'
                    },

                    controller : {
                        editor : {
                            xtype : 'learning_certification_course_form',
                            allowDelete : true
                        },
                        connectParentView : false
                    },

                    columns : [
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Course Name'),
                            flex : 1,
                            dataIndex : 'courseId',
                            renderer : function(value, metaData, record) {
                                return value ? me.getViewModel().getStore('allCourses').getById(record.get('courseId')).get('name') : '';
                            }
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Course Type'),
                            flex : 1,
                            dataIndex : 'courseId',
                            renderer : function(value, metaData, record) {
                                return value ? me.getViewModel().getStore('allCourses').getById(record.get('courseId')).get('courseType') : '';
                            }
                        }
                    ]
                }
            ];

            me.callParent(arguments);
        }
    };

});
