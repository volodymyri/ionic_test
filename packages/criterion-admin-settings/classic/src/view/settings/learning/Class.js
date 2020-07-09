Ext.define('criterion.view.settings.learning.Class', function() {

    return {

        alias : 'widget.criterion_settings_learning_class',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.learning.Class',
            'criterion.store.learning.Instructors',
            'criterion.ux.HorizontalDivider',
            'criterion.view.ux.form.DateTime',
            'criterion.store.WebForms',
            'criterion.ux.form.trigger.Copy'
        ],

        controller : {
            type : 'criterion_settings_learning_class',
            externalUpdate : false
        },

        viewModel : {
            data : {
                isShowAttendeesListButton : false
            },
            stores : {
                instructorsStore : {
                    type : 'criterion_learning_instructors'
                },
                webForms : {
                    type : 'criterion_web_forms',
                    proxy : {
                        extraParams : {
                            documentTypeCode : criterion.Consts.DOCUMENT_RECORD_TYPE_CODE.COURSE_REVIEW
                        }
                    }
                }
            }
        },

        scrollable : 'vertical',

        bodyPadding : 0,

        header : {
            title : i18n.gettext('Class Details'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',

                    text : i18n.gettext('Attachments'),
                    handler : 'handleAddClassAttachment',
                    cls : 'criterion-btn-feature',
                    glyph : criterion.consts.Glyph['paperclip'],
                    hidden : true,
                    bind : {
                        hidden : '{record.phantom}'
                    }
                },
                {
                    xtype : 'button',

                    text : i18n.gettext('Instructor Sheet'),
                    handler : 'handleInstructorSheet',
                    cls : 'criterion-btn-feature',
                    hidden : true,
                    bind : {
                        hidden : '{record.phantom}'
                    }
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Request Course Review'),
                    handler : 'onRequestCourseReview',
                    cls : 'criterion-btn-feature',
                    bind : {
                        disabled : '{record.isActive || record.phantom || !record.courseReviewId}'
                    }
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['ios7-download'],
                    handler : 'onDownloadReviews',
                    tooltip : i18n.gettext('Download Reviews'),
                    cls : 'criterion-btn-like-link',
                    scale : 'medium',
                    margin : 0,
                    disabled : true,
                    bind : {
                        disabled : '{record.isActive || record.phantom || !record.courseReviewId}'
                    }
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['person-stalker'],
                    handler : 'handleShowAttendeeListReportOptions',
                    tooltip : i18n.gettext('Attendee List'),
                    cls : 'criterion-btn-like-link',
                    scale : 'medium',
                    margin : 0,
                    disabled : true,
                    hidden : true,
                    bind : {
                        disabled : '{record.phantom}',
                        hidden : '{!isShowAttendeesListButton}'
                    }
                }
            ]
        },

        items : [
            {
                layout : 'hbox',
                bodyPadding : 10,

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                bind : '{record.employerId}',
                                disabled : true,
                                hideTrigger : true
                            },

                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Course Code'),
                                layout : 'hbox',
                                requiredMark : true,
                                items : [
                                    {
                                        xtype : 'textfield',
                                        bind : '{record.courseCode}',
                                        allowBlank : false,
                                        flex : 1,
                                        readOnly : true
                                    },
                                    {
                                        xtype : 'button',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        cls : 'criterion-btn-primary',
                                        margin : '0 0 0 5',
                                        listeners : {
                                            click : 'handleCourseSearch'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Course Name'),
                                bind : '{record.courseName}',
                                disabled : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Class Name'),
                                bind : '{record.name}'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Active'),
                                name : 'isActive',
                                bind : {
                                    value : '{record.isActive}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Date'),
                                bind : '{record.courseDate}'
                            },
                            {
                                xtype : 'timefield',
                                fieldLabel : i18n.gettext('Time'),
                                bind : '{record.courseTime}'

                            },
                            {
                                xtype : 'criterion_ux_form_datetime',
                                fieldLabel : i18n.gettext('Registration Open'),
                                bind : {
                                    value : '{record.registrationOpen}'
                                },
                                disableDirtyCheck : true,
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Access URL'),
                                name : 'link',
                                editable : false,
                                triggers : {
                                    copy : {
                                        type : 'copy',
                                        cls : 'criterion-copy-trigger-transparent'
                                    }
                                }
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_horizontal_divider'
            },

            {
                layout : 'hbox',
                bodyPadding : 10,

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Instructor'),
                                bind : {
                                    store : '{instructorsStore}',
                                    value : '{record.instructorId}'
                                },
                                valueField : 'id',
                                displayField : 'name',
                                queryMode : 'local',
                                autoSelect : true,
                                forceSelection : true,
                                allowBlank : false,
                                editable : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Location'),
                                bind : '{record.location}',
                                maxLength : 100
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('PIN'),
                                bind : '{record.pin}',
                                maxLength : 6
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Cost'),
                                bind : '{record.cost}'
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Max Enrollment'),
                                minValue : 0,
                                bind : '{record.maxEnrollmentLimit}'
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Course Review'),
                                bind : {
                                    store : '{webForms}',
                                    value : '{record.courseReviewId}'
                                },
                                valueField : 'id',
                                displayField : 'name',
                                queryMode : 'local',
                                forceSelection : true
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
