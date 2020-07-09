Ext.define('criterion.controller.ess.learning.MyTeam', function() {

    var LEARINING_MY_TEAM_SEARCH_TYPE = criterion.Consts.LEARINING_MY_TEAM_SEARCH_TYPE,
        API = criterion.consts.Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_learning_my_team',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        requires : [
            'criterion.view.employee.EmployeePicker',
            'criterion.view.RecordPicker',
            'criterion.store.employer.Courses',
            'criterion.store.employer.course.Classes',
            'criterion.store.learning.SearchEmployees',
            'criterion.view.MultiRecordPickerRemoteAlt'
        ],

        init : function() {
            this.load = Ext.Function.createDelayed(this.load, 100, this);
            this.callParent(arguments);
        },

        handleSelectType : function(cmp, value, oldValue) {
            var vm = this.getViewModel(),
                myTeam = vm.getStore('myTeam'),
                courseByEmployee = vm.getStore('courseByEmployee'),
                employeeByCourse = vm.getStore('employeeByCourse'),
                employeeByCourseClass = vm.getStore('employeeByCourseClass');

            vm.set({
                currentCourseName : '',
                currentCourseId : null,

                currentClassName : '',
                currentClassId : null,

                currentEmployeeName : '',
                currentEmployeeId : null
            });

            if (oldValue) {
                courseByEmployee.setData([]);
                employeeByCourse.setData([]);
                employeeByCourseClass.setData([]);
                myTeam.setData([]);
            }

            switch (value) {
                case LEARINING_MY_TEAM_SEARCH_TYPE.PAST_DUE:
                case LEARINING_MY_TEAM_SEARCH_TYPE.UP_COMING:
                    vm.set({
                        activeViewIdx : 0,
                        activeViewStore : myTeam
                    });
                    break;

                case LEARINING_MY_TEAM_SEARCH_TYPE.BY_COURSE:
                    vm.set({
                        activeViewIdx : 1,
                        activeViewStore : employeeByCourse
                    });
                    break;

                case LEARINING_MY_TEAM_SEARCH_TYPE.BY_CLASS:
                    vm.set({
                        activeViewIdx : 2,
                        activeViewStore : employeeByCourseClass
                    });
                    break;

                case LEARINING_MY_TEAM_SEARCH_TYPE.BY_EMPLOYEE:
                    vm.set({
                        activeViewIdx : 3,
                        activeViewStore : courseByEmployee
                    });
                    break;
            }

            this.load();
        },

        handleAfterRender : Ext.emptyFn,
        handleActivate : Ext.emptyFn,
        handleShow : Ext.emptyFn,

        onEmployeeChange : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        load : function() {
            var vm = this.getViewModel(),
                activeViewIdx = vm.get('activeViewIdx'),
                currentCourseId = vm.get('currentCourseId'),
                currentClassId = vm.get('currentClassId'),
                currentEmployeeId = vm.get('currentEmployeeId'),
                myTeam = vm.getStore('myTeam'),
                courseByEmployee = vm.getStore('courseByEmployee'),
                employeeByCourse = vm.getStore('employeeByCourse'),
                employeeByCourseClass = vm.getStore('employeeByCourseClass');

            if (activeViewIdx === 0) {
                // past due, upcoming
                myTeam.load();
            } else if (activeViewIdx === 1 && currentCourseId) {
                // by course
                employeeByCourse.load();
            } else if (activeViewIdx === 2 && currentClassId) {
                // by class
                employeeByCourseClass.load();
            } else if (activeViewIdx === 3 && currentEmployeeId) {
                // by employee
                courseByEmployee.load();
            }
        },

        handleChangeSearchParam : function() {
            this.load();
        },

        handleCourseSearch : function() {
            var me = this,
                vm = me.getViewModel(),
                coursePicker,
                courses = Ext.create('criterion.store.employer.Courses', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    proxy : {
                        extraParams : {
                            isActive : true
                        }
                    }
                }),
                proxy = courses.getProxy();

            proxy.setUrl(API.LEARNING_COURSE_GET_COURSES_FOR_EMPLOYEE);

            coursePicker = Ext.create('criterion.view.RecordPicker', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        modal : true
                    }
                ],
                title : i18n.gettext('Select Course'),
                searchFields : [
                    {
                        fieldName : 'name', displayName : i18n.gettext('Name')
                    },
                    {
                        fieldName : 'code', displayName : i18n.gettext('Code')
                    }
                ],
                columns : [
                    {
                        xtype : 'widgetcolumn',
                        text : '',
                        width : 20,
                        align : 'center',
                        sortable : false,
                        resizable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'component',
                            cls : 'criterion-info-component',
                            margin : '10 0 0 2',
                            tooltipEnabled : true,
                            hidden : true,
                            bind : {
                                tooltip : '{record.description}',
                                hidden : '{!record.description}'
                            }
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Code'),
                        flex : 1,
                        dataIndex : 'code'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        flex : 2,
                        dataIndex : 'name',
                        filter : true
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
                        text : i18n.gettext('Open Spots'),
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        dataIndex : 'openSpots',
                        encodeHtml : false,
                        align : 'center',
                        renderer : function(value, cell, record) {
                            if (record.get('courseTypeCode') === criterion.Consts.COURSE_DELIVERY.CLASSROOM) {
                                return '';
                            }

                            if (value === null) {
                                return i18n.gettext('Available');
                            }

                            return value;
                        }
                    }
                ],
                store : courses
            });

            coursePicker.on('select', function(record) {
                vm.set({
                    currentCourseName : record.get('name'),
                    currentCourseId : record.getId()
                });

                me.load();
            });

            coursePicker.show();
        },

        handleClassSearch : function() {
            var me = this,
                vm = me.getViewModel(),
                classPicker,
                classes = Ext.create('criterion.store.employer.course.Classes', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    proxy : {
                        extraParams : {
                            isActive : true
                        }
                    }
                }),
                proxy = classes.getProxy();

            proxy.setUrl(API.LEARNING_COURSE_GET_COURSE_CLASSES_FOR_EMPLOYEE);

            classPicker = Ext.create('criterion.view.RecordPicker', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        modal : true
                    }
                ],
                title : i18n.gettext('Select Class'),
                searchFields : [
                    {
                        fieldName : 'name', displayName : i18n.gettext('Name')
                    }
                ],
                columns : [
                    {
                        xtype : 'widgetcolumn',
                        text : '',
                        width : 20,
                        align : 'center',
                        sortable : false,
                        resizable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'component',
                            cls : 'criterion-info-component',
                            margin : '10 0 0 2',
                            tooltipEnabled : true,
                            hidden : true,
                            bind : {
                                tooltip : '{record.description}',
                                hidden : '{!record.description}'
                            }
                        }
                    },
                    {
                        text : i18n.gettext('Name'),
                        dataIndex : 'name',
                        width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                        flex : 2
                    },
                    {
                        text : i18n.gettext('Employer'),
                        dataIndex : 'employerName',
                        flex : 2
                    },
                    {
                        text : i18n.gettext('Location'),
                        dataIndex : 'location',
                        flex : 2
                    },
                    {
                        text : i18n.gettext('Class Time'),
                        dataIndex : 'courseDateTime',
                        width : 180
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Open Spots'),
                        dataIndex : 'openSpots',
                        encodeHtml : false,
                        align : 'center',
                        width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                        renderer : function(value) {
                            if (value === null) {
                                return i18n.gettext('Available');
                            }

                            return value;
                        }
                    }
                ],
                store : classes
            });

            classPicker.on('select', function(record) {
                vm.set({
                    currentClassName : record.get('name'),
                    currentClassId : record.getId()
                });

                me.load();
            });

            classPicker.show();
        },

        handleEmployeeSearch : function() {
            var me = this,
                vm = me.getViewModel(),
                employeePicker,
                employees = Ext.create('criterion.store.learning.SearchEmployees', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                });

            employeePicker = Ext.create('criterion.view.RecordPicker', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        modal : true
                    }
                ],
                title : i18n.gettext('Select Employee'),
                searchFields : [
                    {
                        fieldName : 'lastName', displayName : i18n.gettext('Last Name')
                    },
                    {
                        fieldName : 'firstName', displayName : i18n.gettext('First Name')
                    }
                ],
                columns : [
                    {
                        text : i18n.gettext('Last Name'),
                        dataIndex : 'lastName',
                        flex : 1,
                        filter : true
                    },
                    {
                        text : i18n.gettext('First Name'),
                        dataIndex : 'firstName',
                        flex : 1,
                        filter : true
                    },
                    {
                        text : i18n.gettext('Middle Name'),
                        dataIndex : 'middleName',
                        flex : 1
                    },
                    {
                        text : i18n.gettext('Employer'),
                        dataIndex : 'employerName',
                        flex : 1
                    },
                    {
                        text : i18n.gettext('Job Title'),
                        dataIndex : 'jobTitle',
                        flex : 1
                    }
                ],
                store : employees
            });

            employeePicker.on('select', function(record) {
                vm.set({
                    currentEmployeeName : record.get('fullName'),
                    currentEmployeeId : record.get('employeeId')
                });

                me.load();
            });

            employeePicker.show();
        },

        handleExportToPdf : function() {
            this.getReport(criterion.Consts.REPORT_FILE_TYPES.PDF);
        },

        handleExportToCSV : function() {
            this.getReport(criterion.Consts.REPORT_FILE_TYPES.CSV);
        },

        handleExportToExcel : function() {
            this.getReport(criterion.Consts.REPORT_FILE_TYPES.EXCEL);
        },

        getReport : function(formatType) {
            let vm = this.getViewModel(),
                employeeId = vm.get('currentEmployeeId'),
                classId = vm.get('currentClassId'),
                courseId = vm.get('currentCourseId'),
                url;

            if (employeeId) {
                url = API.LEARNING_COURSE_REPORT_COURSES_BY_EMPLOYEE + '?employeeId=' + employeeId;
            } else if (courseId && vm.get('isByCourse')) {
                url = API.LEARNING_COURSE_REPORT_EMPLOYEES_BY_COURSE + '?courseId=' + courseId;
            } else if (classId && vm.get('isByClass')) {
                url = API.LEARNING_COURSE_REPORT_EMPLOYEES_BY_COURSE_CLASS + '?courseClassId=' + classId;
            }

            if (url) {
                window.open(criterion.Api.getSecureResourceUrl(url + '&formatType=' + formatType));
            }
        },

        handleAddEmployeeToCourse : function() {
            var me = this,
                employees = Ext.create('criterion.store.learning.SearchEmployees', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                selectedEmployees = Ext.create('criterion.store.learning.SearchEmployees'),
                vm = this.getViewModel(),
                isByCourse = vm.get('isByCourse'),
                addedEmployees = isByCourse ? vm.getStore('employeeByCourse') : vm.getStore('employeeByCourseClass'),
                excludedIds = [],
                storeParams = {
                    courseId : vm.get('currentCourseId'),
                    courseClassId : vm.get('currentClassId')
                },
                selectEmployeesWindow;

            if (!isByCourse) {
                employees.getProxy().setUrl(API.LEARNING_COURSE_GET_EMPLOYEES_FOR_COURSE_CLASS);
            }

            addedEmployees.each(function(empl) {
                var id = empl.get('personId') + '-' + empl.get('employeeId'),
                    employeeNameData = empl.get('employeeName').split(' ');

                excludedIds.push(id);

                selectedEmployees.add({
                    id : id,
                    firstName : employeeNameData[0],
                    lastName : employeeNameData[1],
                    jobTitle : empl.get('jobTitle')
                });
            });

            selectEmployeesWindow = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : '100%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        modal : true
                    }
                ],
                viewModel : {
                    data : {
                        title : i18n.gettext('Add Employees'),
                        gridColumns : [
                            {
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : true
                            },
                            {
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : true
                            },
                            {
                                text : i18n.gettext('Middle Name'),
                                dataIndex : 'middleName',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                text : i18n.gettext('Employer'),
                                dataIndex : 'employerName',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                text : i18n.gettext('Job Title'),
                                dataIndex : 'jobTitle',
                                flex : 1,
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : storeParams,
                        excludedIds : excludedIds,
                        allowDeleteSelected : false
                    },
                    stores : {
                        inputStore : employees,
                        selectedStore : selectedEmployees
                    }
                }
            });

            selectEmployeesWindow.on({
                selectRecords : function(records) {
                    var selectedEmployeeIds = [];

                    Ext.Array.each(records, function(record) {
                        selectedEmployeeIds.push(
                            record.get('employeeId')
                        );
                    });

                    criterion.Api.requestWithPromise({
                        url : vm.get('isByCourse') ? API.LEARNING_COURSE_ADD_EMPLOYEE_TO_COURSE : API.LEARNING_COURSE_ADD_EMPLOYEE_TO_COURSE_CLASS,
                        jsonData : {
                            employeeIds : selectedEmployeeIds,
                            courseId : vm.get('currentCourseId'),
                            courseClassId : vm.get('currentClassId')
                        },
                        method : 'PUT'
                    }).then(function() {
                        me.load();
                    });
                }
            });

            selectEmployeesWindow.show();
        },

        handleAddCourseToEmployee : function() {
            var me = this,
                courses = Ext.create('criterion.store.employer.Courses', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                selectedCourses = Ext.create('criterion.store.employer.Courses'),
                vm = this.getViewModel(),
                courseByEmployee = vm.getStore('courseByEmployee'),
                excludedIds = [],
                storeParams = {
                    employeeId : vm.get('currentEmployeeId'),
                    isActive : true
                },
                selectCoursesWindow;

            courseByEmployee.each(function(rec) {
                if (!rec.get('courseClassId')) {
                    excludedIds.push(rec.getId());

                    selectedCourses.add({
                        id : rec.get('courseId'),
                        name : rec.get('courseName'),
                        courseTypeCd : rec.get('courseTypeCd'),
                        dueDate : rec.get('dueDate')
                    });
                }
            });

            courses.getProxy().setUrl(API.LEARNING_COURSE_GET_COURSES_FOR_EMPLOYEE);

            selectCoursesWindow = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : '100%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        modal : true
                    }
                ],
                viewModel : {
                    data : {
                        title : i18n.gettext('Add Courses'),
                        gridColumns : [
                            {
                                xtype : 'widgetcolumn',
                                text : '',
                                width : 20,
                                align : 'center',
                                sortable : false,
                                resizable : false,
                                menuDisabled : true,
                                widget : {
                                    xtype : 'component',
                                    cls : 'criterion-info-component',
                                    margin : '10 0 0 2',
                                    tooltipEnabled : true,
                                    hidden : true,
                                    bind : {
                                        tooltip : '{record.description}',
                                        hidden : '{!record.description}'
                                    }
                                },
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Code'),
                                flex : 1,
                                dataIndex : 'code'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                flex : 2,
                                dataIndex : 'name',
                                filter : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Employer'),
                                flex : 2,
                                dataIndex : 'employerName',
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'criterion_codedatacolumn',
                                text : i18n.gettext('Delivery'),
                                dataIndex : 'courseTypeCd',
                                codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Open Spots'),
                                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                                dataIndex : 'openSpots',
                                encodeHtml : false,
                                align : 'center',
                                renderer : function(value, cell, record) {
                                    if (record.get('courseTypeCode') === criterion.Consts.COURSE_DELIVERY.CLASSROOM) {
                                        return '';
                                    }

                                    if (value === null) {
                                        return i18n.gettext('Available');
                                    }

                                    return value;
                                },
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : storeParams,
                        excludedIds : excludedIds,
                        allowDeleteSelected : false
                    },
                    stores : {
                        inputStore : courses,
                        selectedStore : selectedCourses
                    }
                }
            });

            selectCoursesWindow.on({
                selectRecords : function(records) {
                    var selectedCourseIds = [];

                    Ext.Array.each(records, function(record) {
                        selectedCourseIds.push(record.getId());
                    });

                    criterion.Api.requestWithPromise({
                        url : API.LEARNING_COURSE_ADD_COURSE_TO_EMPLOYEE,
                        jsonData : {
                            courseIds : selectedCourseIds,
                            employeeId : vm.get('currentEmployeeId')
                        },
                        method : 'PUT'
                    }).then(function() {
                        me.load();
                    });
                }
            });

            selectCoursesWindow.show();
        },

        handleAddClassToEmployee : function() {
            var me = this,
                courseClasses = Ext.create('criterion.store.employer.course.Classes', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                selectedCourseClasses = Ext.create('criterion.store.employer.course.Classes'),
                vm = this.getViewModel(),
                courseByEmployee = vm.getStore('courseByEmployee'),
                excludedIds = [],
                storeParams = {
                    employeeId : vm.get('currentEmployeeId'),
                    isActive : true
                },
                selectClassWindow;

            courseByEmployee.each(function(rec) {
                if (rec.get('courseClassId')) {
                    excludedIds.push(rec.get('courseClassId'));
                    selectedCourseClasses.add({
                        id : rec.get('courseClassId'),
                        name : rec.get('courseName')
                    });
                }
            });

            courseClasses.getProxy().setUrl(API.LEARNING_COURSE_GET_COURSE_CLASSES_FOR_EMPLOYEE);

            selectClassWindow = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : '100%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        modal : true
                    }
                ],
                viewModel : {
                    data : {
                        title : i18n.gettext('Add Course Class'),
                        gridColumns : [
                            {
                                xtype : 'widgetcolumn',
                                text : '',
                                width : 20,
                                align : 'center',
                                sortable : false,
                                resizable : false,
                                menuDisabled : true,
                                widget : {
                                    xtype : 'component',
                                    cls : 'criterion-info-component',
                                    margin : '10 0 0 2',
                                    tooltipEnabled : true,
                                    hidden : true,
                                    bind : {
                                        tooltip : '{record.description}',
                                        hidden : '{!record.description}'
                                    }
                                },
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Code'),
                                flex : 1,
                                dataIndex : 'code',
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                flex : 2,
                                dataIndex : 'name',
                                filter : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Location'),
                                flex : 1,
                                dataIndex : 'location',
                                filter : true,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Class Time'),
                                dataIndex : 'courseDateTime',
                                width : 180,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Open Spots'),
                                dataIndex : 'openSpots',
                                encodeHtml : false,
                                align : 'center',
                                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                                renderer : function(value) {
                                    if (value === null) {
                                        return i18n.gettext('Available');
                                    }

                                    return value;
                                },
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : storeParams,
                        excludedIds : excludedIds,
                        allowDeleteSelected : false
                    },
                    stores : {
                        inputStore : courseClasses,
                        selectedStore : selectedCourseClasses
                    }
                }
            });

            selectClassWindow.on({
                selectRecords : function(records) {
                    var selectedCourseClassIds = [];

                    Ext.Array.each(records, function(record) {
                        selectedCourseClassIds.push(record.getId());
                    });

                    criterion.Api.requestWithPromise({
                        url : API.LEARNING_COURSE_ADD_COURSE_CLASS_TO_EMPLOYEE,
                        jsonData : {
                            courseClassIds : selectedCourseClassIds,
                            employeeId : vm.get('currentEmployeeId')
                        },
                        method : 'PUT'
                    }).then(function() {
                        me.load();
                    });
                }
            });

            selectClassWindow.show();
        },

        handleBeforeCellClick : Ext.emptyFn
    };

});
