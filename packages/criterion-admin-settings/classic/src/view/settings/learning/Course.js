Ext.define('criterion.view.settings.learning.Course', function() {

    var DICT = criterion.consts.Dict,
        API = criterion.consts.Api.API;

    return {

        alias : 'widget.criterion_settings_learning_course',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.learning.Course',
            'criterion.store.EmployeeGroups',
            'criterion.store.Jobs',
            'criterion.store.learning.EmployeeGroupCourses',
            'criterion.store.Skills',
            'criterion.ux.HorizontalDivider',
            'criterion.view.ux.form.DateTime',
            'criterion.view.settings.common.SkillForm'
        ],

        controller : {
            type : 'criterion_settings_learning_course',
            externalUpdate : false
        },

        viewModel : {
            data : {
                record : null,
                courseContentTypeCd : null,
                isContentTypeURL : false,
                isShowAttendeesListButton : false
            },
            stores : {
                allSkills : {
                    type : 'criterion_skills'
                },
                employeeGroups : {
                    type : 'criterion_employee_groups',
                    autoLoad : true,
                    proxy : {
                        extraParams : {
                            employerId : '{record.employerId}'
                        }
                    }
                },
                employeeGroupCourses : {
                    type : 'criterion_learning_employee_group_courses'
                },
                jobs : {
                    type : 'criterion_jobs'
                }
            }
        },

        scrollable : 'vertical',

        bodyPadding : 0,

        header : {
            title : i18n.gettext('Course Details'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',
                    handler : 'handleShowDescriptionForm',
                    cls : 'criterion-btn-feature',
                    text : i18n.gettext('Description')
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
                                bind : {
                                    value : '{record.employerId}'
                                },
                                disabled : true,
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Code'),
                                bind : {
                                    value : '{record.code}'
                                },
                                allowOnlyWhitespace : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                bind : {
                                    value : '{record.name}'
                                },
                                allowOnlyWhitespace : false,
                                maxLength : 100
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Type'),
                                bind : {
                                    value : '{record.courseTypeCd}'
                                },
                                codeDataId : DICT.COURSE_DELIVERY,
                                allowBlank : false
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Duration (mins)'),
                                bind : {
                                    value : '{record.duration}'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Enrollment'),
                                store : Ext.create('Ext.data.Store', {
                                    fields : ['value', 'text'],
                                    data : Ext.Object.getValues(criterion.Consts.COURSE_ENROLLMENT_TYPE)
                                }),
                                bind : {
                                    value : '{record.enrollment}'
                                },
                                valueField : 'value',
                                displayField : 'text',
                                queryMode : 'local',
                                forceSelection : true,
                                editable : false,
                                autoSelect : true,
                                allowBlank : false
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Max Enrollment'),
                                minValue : 0,
                                name : 'maxEnrollmentLimit',
                                bind : {
                                    value : '{record.maxEnrollmentLimit}'
                                }
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
                                fieldLabel : i18n.gettext('Creation Date'),
                                allowBlank : false,
                                bind : {
                                    value : '{record.creationDate}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Content Type'),
                                bind : {
                                    value : '{record.courseContentTypeCd}'
                                },
                                codeDataId : DICT.COURSE_CONTENT_TYPE,
                                allowBlank : true,
                                editable : true,
                                forceSelection : true,
                                listeners : {
                                    change : 'handleContentTypeComboChange'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Content Source'),
                                bind : {
                                    value : '{record.courseContentSourceCd}'
                                },
                                codeDataId : DICT.COURSE_CONTENT_SOURCE,
                                allowBlank : true,
                                editable : true,
                                forceSelection : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('URL'),
                                vtype : 'url',
                                name : 'url',
                                reference : 'courseContentURL',
                                hidden : true,
                                allowBlank : true,
                                bind : {
                                    allowBlank : '{!isContentTypeURL}',
                                    hidden : '{!isContentTypeURL}'
                                }
                            },
                            {
                                xtype : 'criterion_filefield',
                                fieldLabel : i18n.gettext('File'),
                                name : 'content',
                                reference : 'courseContentFile',
                                maxFileSizeUrl : API.LEARNING_COURSE_CONTENT_MAX_FILE_SIZE, // result will be returned in bytes!
                                hidden : false,
                                disabled : true,
                                bind : {
                                    hidden : '{isContentTypeURL}',
                                    disabled : '{isContentTypeURL || !courseContentTypeCd}',
                                    rawValue : '{record.contentFileName}',
                                    showViewTrigger : '{record.contentFileName}',
                                    maxFileSizeUrlOptions : {
                                        params : {
                                            courseContentTypeCd : '{courseContentTypeCd}'
                                        }
                                    }
                                },
                                listeners : {
                                    viewFile : 'handleViewCourseContentFile'
                                }
                            },
                            {
                                xtype : 'criterion_tagfield',
                                fieldLabel : i18n.gettext('Employee Groups'),
                                reference : 'employeeGroups',
                                bind : {
                                    store : '{employeeGroups}',
                                    valuesStore : '{employeeGroupCourses}'
                                },
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'name',
                                linkField : 'employeeGroupId'
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
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Complete In (days)'),
                                name : 'completeBy'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Notification (days before)'),
                                bind : {
                                    value : '{record.notification}'
                                },
                                allowBlank : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Retake (days after)'),
                                name : 'retake'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Recurrence (years)'),
                                name : 'recurrence'
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Recurrence Date'),
                                layout : 'hbox',
                                margin : '0 0 18 0',
                                items : [
                                    {
                                        xtype : 'combobox',
                                        reference : 'recurrenceMonth',
                                        valueField : 'month',
                                        sortByDisplayField : false,
                                        allowBlank : true,
                                        editable : true,
                                        forceSelection : true,
                                        flex : 1,
                                        bind : {
                                            value : '{record.recurrenceMonth}'
                                        },
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['month', 'text'],
                                            data : Ext.Array.map(Ext.Date.monthNames, function(item, index) {
                                                return {
                                                    month : index + 1,
                                                    text : item
                                                };
                                            })
                                        }),
                                        listeners : {
                                            change : 'handleRecurrenceMonthChange'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        reference : 'recurrenceDay',
                                        valueField : 'day',
                                        allowBlank : true,
                                        sortByDisplayField : false,
                                        editable : true,
                                        forceSelection : true,
                                        margin : '0 0 0 10',
                                        flex : 1,
                                        bind : {
                                            value : '{record.recurrenceDay}'
                                        },
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['day', 'text'],
                                            data : Ext.Array.map(criterion.Utils.range(1, 31), function(day) {
                                                return {
                                                    day : day,
                                                    text : day
                                                };
                                            })
                                        }),
                                        listeners : {
                                            change : 'handleRecurrenceDayChange'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_gridview',
                reference : 'skills',
                title : i18n.gettext('Skills'),
                bind : {
                    store : '{record.skills}'
                },
                tbar : [
                    '->',
                    {
                        xtype : 'button',
                        reference : 'addButton',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddClick'
                        }
                    }
                ],
                preventStoreLoad : true,
                controller : {
                    editor : {
                        xtype : 'criterion_settings_common_skill_form'
                    },
                    connectParentView : false
                },
                columns : [
                    {
                        xtype : 'codedatacolumn',
                        dataIndex : 'skillCategoryCd',
                        codeDataId : DICT.SKILL_CATEGORY,
                        reference : 'skillCategory',
                        text : i18n.gettext('Category'),
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Skill'),
                        flex : 1,
                        dataIndex : 'skillId',
                        renderer : function(value) {
                            var allSkills = this.up('criterion_settings_learning_course').getViewModel().getStore('allSkills'),
                                skill = value && allSkills.getById(value);

                            return value ? skill && skill.get('name') : '';
                        }
                    },
                    {
                        xtype : 'codedatacolumn',
                        dataIndex : 'skillLevelCd',
                        codeDataId : DICT.SKILL_LEVEL,
                        text : i18n.gettext('Level'),
                        flex : 1
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                        sortable : false,
                        menuDisabled : true,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                text : '',
                                action : 'removeaction'
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
