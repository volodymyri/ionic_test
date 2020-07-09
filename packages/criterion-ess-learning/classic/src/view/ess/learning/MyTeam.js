Ext.define('criterion.view.ess.learning.MyTeam', function() {

    var DICT = criterion.consts.Dict,
        LEARINING_MY_TEAM_SEARCH_TYPE = criterion.Consts.LEARINING_MY_TEAM_SEARCH_TYPE;

    return {
        alias : 'widget.criterion_selfservice_learning_my_team',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.store.learning.MyTeam',
            'criterion.controller.ess.learning.MyTeam',
            'criterion.store.learning.CourseByEmployee',
            'criterion.store.learning.EmployeeByCourseClass',
            'criterion.store.learning.EmployeeByCourse'
        ],

        controller : {
            type : 'criterion_selfservice_learning_my_team'
        },

        viewModel : {
            data : {
                activeViewIdx : 0,
                activeViewStore : null,

                type : LEARINING_MY_TEAM_SEARCH_TYPE.UP_COMING,

                currentCourseName : '',
                currentCourseId : null,

                currentClassName : '',
                currentClassId : null,

                currentEmployeeName : '',
                currentEmployeeId : null,

                courseNameFilter : '',
                employeeNameFilter : ''
            },

            formulas : {
                showReportBtn : function(data) {
                    return data('currentCourseId') || data('currentClassId') || data('currentEmployeeId');
                },

                isPastDueOrUpComing : function(data) {
                    return Ext.Array.contains([LEARINING_MY_TEAM_SEARCH_TYPE.PAST_DUE, LEARINING_MY_TEAM_SEARCH_TYPE.UP_COMING], data('type'));
                },
                isByCourse : function(data) {
                    return data('type') === LEARINING_MY_TEAM_SEARCH_TYPE.BY_COURSE;
                },
                isByClass : function(data) {
                    return data('type') === LEARINING_MY_TEAM_SEARCH_TYPE.BY_CLASS;
                },
                isByEmployee : function(data) {
                    return data('type') === LEARINING_MY_TEAM_SEARCH_TYPE.BY_EMPLOYEE;
                }
            },

            stores : {
                myTeam : {
                    type : 'criterion_learning_my_team',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    proxy : {
                        extraParams : {
                            type : '{type}',
                            employeeName : '{employeeNameFilter}',
                            courseName : '{courseNameFilter}'
                        }
                    }
                },
                courseByEmployee : {
                    type : 'criterion_learning_course_by_employee',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    proxy : {
                        extraParams : {
                            employeeId : '{currentEmployeeId}'
                        }
                    }
                },
                employeeByCourse : {
                    type : 'criterion_learning_employee_by_course',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    proxy : {
                        extraParams : {
                            courseId : '{currentCourseId}'
                        }
                    }
                },
                employeeByCourseClass : {
                    type : 'criterion_learning_employee_by_course_class',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    proxy : {
                        extraParams : {
                            courseClassId : '{currentClassId}'
                        }
                    }
                }
            }
        },

        layout : 'card',
        frame : true,
        ui : 'no-footer',
        cls : 'criterion-grid-panel-simple-list',

        bind : {
            activeItem : '{activeViewIdx}'
        },

        header : {

            title : {
                text : i18n.gettext('My Team'),
                minimizeWidth : true
            },

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'criterion_splitbutton',
                    text : i18n.gettext('Export to PDF'),
                    ui : 'secondary',
                    hidden : true,
                    bind : {
                        hidden : '{!showReportBtn}'
                    },
                    textAlign : 'left',
                    listeners : {
                        click : 'handleExportToPdf'
                    },

                    menu : [
                        {
                            text : i18n.gettext('Export to CSV'),
                            listeners : {
                                click : 'handleExportToCSV'
                            }
                        },
                        {
                            text : i18n.gettext('Export to Excel'),
                            listeners : {
                                click : 'handleExportToExcel'
                            }
                        }
                    ]
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Add Employee'),
                    ui : 'feature',
                    hidden : true,
                    bind : {
                        hidden : '{!(currentCourseId || currentClassId)}'
                    },
                    handler : 'handleAddEmployeeToCourse'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Add Course'),
                    ui : 'feature',
                    hidden : true,
                    bind : {
                        hidden : '{!currentEmployeeId}'
                    },
                    handler : 'handleAddCourseToEmployee'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Add Class'),
                    ui : 'feature',
                    hidden : true,
                    margin : '0 0 0 10',
                    bind : {
                        hidden : '{!currentEmployeeId}'
                    },
                    handler : 'handleAddClassToEmployee'
                }
            ]
        },

        dockedItems : [
            {
                xtype : 'container',
                dock : 'top',
                margin : '0 0 20 0',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'combobox',
                        queryMode : 'local',
                        reference : 'typeField',
                        editable : false,
                        sortByDisplayField : false,
                        valueField : 'id',
                        displayField : 'text',
                        width : 150,
                        store : new Ext.data.Store({
                            proxy : {
                                type : 'memory'
                            },
                            data : [
                                {
                                    id : LEARINING_MY_TEAM_SEARCH_TYPE.UP_COMING,
                                    text : i18n.gettext('Up Coming')
                                },
                                {
                                    id : LEARINING_MY_TEAM_SEARCH_TYPE.PAST_DUE,
                                    text : i18n.gettext('Past Due')
                                },
                                {
                                    id : LEARINING_MY_TEAM_SEARCH_TYPE.BY_COURSE,
                                    text : i18n.gettext('By Course')
                                },
                                {
                                    id : LEARINING_MY_TEAM_SEARCH_TYPE.BY_CLASS,
                                    text : i18n.gettext('By Class')
                                },
                                {
                                    id : LEARINING_MY_TEAM_SEARCH_TYPE.BY_EMPLOYEE,
                                    text : i18n.gettext('By Employee')
                                }
                            ]
                        }),
                        bind : '{type}',
                        listeners : {
                            change : 'handleSelectType'
                        }
                    },

                    {
                        xtype : 'criterion_search_field',
                        ui : 'search-alt',
                        checkChangeBuffer : 1000,
                        emptyText : i18n.gettext('Course Name'),
                        reference : 'courseNameField',
                        margin : '0 0 0 20',
                        hidden : true,
                        bind : {
                            hidden : '{!isPastDueOrUpComing}',
                            value : '{courseNameFilter}'
                        },
                        listeners : {
                            change : 'handleChangeSearchParam'
                        }
                    },
                    {
                        xtype : 'criterion_search_field',
                        ui : 'search-alt',
                        checkChangeBuffer : 1000,
                        emptyText : i18n.gettext('Employee Name'),
                        reference : 'employeeNameField',
                        margin : '0 0 0 40',
                        hidden : true,
                        bind : {
                            hidden : '{!isPastDueOrUpComing}',
                            value : '{employeeNameFilter}'
                        },
                        listeners : {
                            change : 'handleChangeSearchParam'
                        }
                    },

                    // By course
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel : i18n.gettext('Course'),
                        labelWidth : 80,
                        hidden : true,
                        bind : {
                            hidden : '{!isByCourse}'
                        },
                        margin : '0 0 0 20',
                        items : [
                            {
                                xtype : 'textfield',
                                flex : 1,
                                readOnly : true,
                                bind : {
                                    value : '{currentCourseName}'
                                },
                                readOnlyCls : Ext.baseCSSPrefix + 'form-readonly'
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                margin : '0 0 0 3',
                                cls : 'criterion-btn-light',
                                glyph : criterion.consts.Glyph['ios7-search'],
                                listeners : {
                                    click : 'handleCourseSearch'
                                }
                            }
                        ]
                    },

                    // By class
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel : i18n.gettext('Class'),
                        labelWidth : 80,
                        hidden : true,
                        bind : {
                            hidden : '{!isByClass}'
                        },
                        margin : '0 0 0 20',
                        items : [
                            {
                                xtype : 'textfield',
                                flex : 1,
                                readOnly : true,
                                bind : {
                                    value : '{currentClassName}'
                                },
                                readOnlyCls : Ext.baseCSSPrefix + 'form-readonly'
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                margin : '0 0 0 3',
                                cls : 'criterion-btn-light',
                                glyph : criterion.consts.Glyph['ios7-search'],
                                listeners : {
                                    click : 'handleClassSearch'
                                }
                            }
                        ]
                    },

                    // By employee
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        fieldLabel : i18n.gettext('Employee'),
                        labelWidth : 80,
                        hidden : true,
                        bind : {
                            hidden : '{!isByEmployee}'
                        },
                        margin : '0 0 0 20',
                        items : [
                            {
                                xtype : 'textfield',
                                flex : 1,
                                readOnly : true,
                                bind : {
                                    value : '{currentEmployeeName}'
                                },
                                readOnlyCls : Ext.baseCSSPrefix + 'form-readonly'
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                margin : '0 0 0 3',
                                cls : 'criterion-btn-light',
                                glyph : criterion.consts.Glyph['ios7-search'],
                                listeners : {
                                    click : 'handleEmployeeSearch'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_toolbar_paging',
                reference : 'pagingToolbar',
                dock : 'bottom',
                displayInfo : true,
                disabled : true,
                bind : {
                    store : '{activeViewStore}',
                    disabled : '{!activeViewStore.count}'
                }
            }
        ],

        tbar : null,

        items : [
            // past due, upcoming
            {
                xtype : 'criterion_gridview',
                tbar : null,
                controller : null,
                padding : 0,

                stateId : 'learningTeamByDateGrid',
                stateful : true,

                bind : {
                    store : '{myTeam}'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee Name'),
                        flex : 2,
                        dataIndex : 'employeeName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Job Title'),
                        flex : 1,
                        dataIndex : 'jobTitle'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Course Name'),
                        flex : 2,
                        dataIndex : 'courseName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employer'),
                        flex : 2,
                        dataIndex : 'employerName'
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Delivery'),
                        dataIndex : 'courseTypeCd',
                        codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Location'),
                        flex : 1,
                        dataIndex : 'location'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Class Time'),
                        flex : 1,
                        dataIndex : 'courseDateTime',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Due Date'),
                        dataIndex : 'dueDate',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Waitlist'),
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        renderer : function(value, cell, record) {
                            var waitingEmployeePlace = record.get('waitingEmployeePlace'),
                                waitingEmployeesCount = record.get('waitingEmployeesCount'),
                                isInWaitlist = record.get('isInWaitlist');

                            if (!isInWaitlist) {
                                return;
                            }

                            return Ext.String.format('{0} {1} {2}', waitingEmployeePlace, i18n.gettext('of'), waitingEmployeesCount);
                        }

                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Complete Status'),
                        dataIndex : 'courseCompleteStatusCd',
                        flex : 1,
                        codeDataId : DICT.COURSE_COMPLETE_STATUS
                    }
                ]
            },

            // by course
            {
                xtype : 'criterion_gridview',
                tbar : null,
                controller : null,
                padding : 0,

                stateId : 'learningTeamByCourseGrid',
                stateful : true,

                bind : {
                    store : '{employeeByCourse}'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee Name'),
                        flex : 2,
                        dataIndex : 'employeeName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Job Title'),
                        flex : 1,
                        dataIndex : 'jobTitle'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Course Name'),
                        flex : 2,
                        dataIndex : 'courseName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employer'),
                        flex : 2,
                        dataIndex : 'employerName'
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Delivery'),
                        dataIndex : 'courseTypeCd',
                        codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                        flex : 1
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Due Date'),
                        dataIndex : 'dueDate',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Waitlist'),
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        renderer : function(value, cell, record) {
                            var waitingEmployeePlace = record.get('waitingEmployeePlace'),
                                waitingEmployeesCount = record.get('waitingEmployeesCount'),
                                isInWaitlist = record.get('isInWaitlist');

                            if (!isInWaitlist) {
                                return;
                            }

                            return Ext.String.format('{0} {1} {2}', waitingEmployeePlace, i18n.gettext('of'), waitingEmployeesCount);
                        }

                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Complete Status'),
                        dataIndex : 'courseCompleteStatusCd',
                        flex : 1,
                        codeDataId : DICT.COURSE_COMPLETE_STATUS
                    }
                ]
            },

            // by class
            {
                xtype : 'criterion_gridview',
                tbar : null,
                controller : null,
                padding : 0,

                stateId : 'learningTeamByClassGrid',
                stateful : true,

                bind : {
                    store : '{employeeByCourseClass}'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee Name'),
                        flex : 2,
                        dataIndex : 'employeeName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Job Title'),
                        flex : 1,
                        dataIndex : 'jobTitle'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Course Name'),
                        flex : 2,
                        dataIndex : 'courseName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employer'),
                        flex : 2,
                        dataIndex : 'employerName'
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Delivery'),
                        dataIndex : 'courseTypeCd',
                        codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Location'),
                        flex : 1,
                        dataIndex : 'location'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Class Time'),
                        flex : 1,
                        dataIndex : 'courseDateTime',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Due Date'),
                        dataIndex : 'dueDate',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Waitlist'),
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        renderer : function(value, cell, record) {
                            var waitingEmployeePlace = record.get('waitingEmployeePlace'),
                                waitingEmployeesCount = record.get('waitingEmployeesCount'),
                                isInWaitlist = record.get('isInWaitlist');

                            if (!isInWaitlist) {
                                return;
                            }

                            return Ext.String.format('{0} {1} {2}', waitingEmployeePlace, i18n.gettext('of'), waitingEmployeesCount);
                        }

                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Complete Status'),
                        dataIndex : 'courseCompleteStatusCd',
                        flex : 1,
                        codeDataId : DICT.COURSE_COMPLETE_STATUS
                    }
                ]
            },

            // by employee
            {
                xtype : 'criterion_gridview',
                tbar : null,
                controller : null,
                padding : 0,

                stateId : 'learningTeamByEmployeeGrid',
                stateful : true,

                bind : {
                    store : '{courseByEmployee}'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee Name'),
                        flex : 2,
                        dataIndex : 'employeeName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Job Title'),
                        flex : 1,
                        dataIndex : 'jobTitle'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Course Name'),
                        flex : 2,
                        dataIndex : 'courseName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employer'),
                        flex : 2,
                        dataIndex : 'employerName'
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Delivery'),
                        dataIndex : 'courseTypeCd',
                        codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Location'),
                        flex : 1,
                        dataIndex : 'location'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Class Time'),
                        flex : 1,
                        dataIndex : 'courseDateTime',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Due Date'),
                        dataIndex : 'dueDate',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Waitlist'),
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        renderer : function(value, cell, record) {
                            var waitingEmployeePlace = record.get('waitingEmployeePlace'),
                                waitingEmployeesCount = record.get('waitingEmployeesCount'),
                                isInWaitlist = record.get('isInWaitlist');

                            if (!isInWaitlist) {
                                return;
                            }

                            return Ext.String.format('{0} {1} {2}', waitingEmployeePlace, i18n.gettext('of'), waitingEmployeesCount);
                        }

                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Complete Status'),
                        dataIndex : 'courseCompleteStatusCd',
                        flex : 1,
                        codeDataId : DICT.COURSE_COMPLETE_STATUS
                    }
                ]
            }
        ]
    };

});
