Ext.define('criterion.view.person.Course', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_person_course',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.person.Course',
            'criterion.view.CustomFieldsContainer',
            'criterion.ux.HorizontalDivider'
        ],

        controller : {
            type : 'criterion_person_course',
            externalUpdate : false
        },

        viewModel : {
            data : {
                /**
                 * @link {criterion.model.employee.Course}
                 */
                record : null,
                /**
                 * @link {criterion.model.employer.Course}
                 */
                employerCourse : null,
                /**
                 * @link {criterion.model.employer.course.Class}
                 */
                employerCourseClass : null
            },

            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_COURSES, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_COURSES, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaultType : 'container',

        items : [
            {
                xtype: 'criterion_panel',

                layout : 'hbox',
                plugins: [
                    'criterion_responsive_column'
                ],
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                items : [
                    {
                        items : []
                    },
                    {
                        layout : {
                            type : 'hbox',
                            pack : 'end'
                        },
                        items : [
                            {
                                xtype : 'button',
                                handler : 'handleAddEmployeeClassAttachment',
                                cls : 'criterion-btn-transparent',
                                glyph : criterion.consts.Glyph['paperclip'],
                                scale : 'large'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_horizontal_divider'
            },
            {
                xtype : 'criterion_panel',

                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                items : [
                    {
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                fieldLabel : i18n.gettext('Code'),
                                requiredMark : true,
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        readOnly : true,
                                        allowBlank : false,
                                        bind : {
                                            value : '{employerCourse.code}'
                                        },

                                        cls : 'criterion-hide-default-clear',
                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger',
                                                handler : 'onCourseCodeClear',
                                                hideOnReadOnly : false,
                                                hideWhenEmpty : true
                                            }
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        scale : 'small',
                                        margin : '0 0 0 3',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        listeners : {
                                            click : 'onCourseSearch'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                fieldLabel : i18n.gettext('Class'),
                                bind : {
                                    hidden : '{!employerCourse.isInstructorCourse}'
                                },
                                hidden : true,
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        readOnly : true,
                                        allowBlank : true,
                                        bind : {
                                            value : '{employerCourseClass.name}',
                                            disabled : '{!employerCourse.isInstructorCourse}'
                                        },

                                        cls : 'criterion-hide-default-clear'
                                    },
                                    {
                                        xtype : 'button',
                                        scale : 'small',
                                        margin : '0 0 0 3',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        listeners : {
                                            click : 'onCourseClassSearch'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                readOnly : true,
                                bind : {
                                    value : '{employerCourse.name}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Delivery'),
                                codeDataId : DICT.COURSE_DELIVERY,
                                readOnly : true,
                                bind : {
                                    value : '{employerCourse.courseTypeCd}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Creation Date'),
                                readOnly : true,
                                hidden : true,
                                bind : {
                                    value : '{record.creationDate}',
                                    hidden : '{record.phantom}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Class Time'),
                                readOnly : true,
                                hidden : true,
                                bind : {
                                    value : '{employerCourseClass.courseDateTime}',
                                    hidden : '{!employerCourse.isInstructorCourse}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Location'),
                                readOnly : true,
                                hidden : true,
                                bind : {
                                    value : '{employerCourseClass.location}',
                                    hidden : '{!employerCourse.isInstructorCourse}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                name : 'dueDate',
                                fieldLabel : i18n.gettext('Due Date'),
                                allowBlank : true
                            },
                            {
                                xtype : 'datefield',
                                name : 'completedDate',
                                fieldLabel : i18n.gettext('Completed Date'),
                                allowBlank : true
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Complete Status'),
                                codeDataId : DICT.COURSE_COMPLETE_STATUS,
                                name : 'courseCompleteStatusCd',
                                allowBlank : true
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Success Status'),
                                codeDataId : DICT.COURSE_SUCCESS_STATUS,
                                name : 'courseSuccessStatusCd',
                                allowBlank : true
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Score'),
                                name : 'score',
                                maxValue : 100,
                                minValue : 0
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_horizontal_divider'
            },
            {
                xtype : 'criterion_panel',

                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                items : [
                    {
                        flex : 4,
                        items : [
                            {
                                xtype : 'textareafield',
                                name : 'notes',
                                fieldLabel : i18n.gettext('Notes'),
                                height : 200
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_customfields_container',
                reference : 'customFieldsEmployeeCourse',
                entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_EMPLOYEE_COURSE,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
            }
        ]
    };

});
