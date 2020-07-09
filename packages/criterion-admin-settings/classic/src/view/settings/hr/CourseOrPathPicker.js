Ext.define('criterion.view.settings.hr.CourseOrPathPicker', function() {

    var JOB_COURSE_TYPE = criterion.Consts.JOB_COURSE_TYPE;

    return {

        extend : 'criterion.view.MultiRecordPickerRemote',

        requires : [
            'criterion.controller.settings.hr.CourseOrPathPicker',
            'criterion.store.employer.Courses',
            'criterion.store.learning.Paths'
        ],

        alias : 'widget.criterion_settings_hr_course_or_path_picker',

        multiSelect : true,

        config : {
             allowFilterByName : true
        },

        viewModel : {
            data : {
                title : i18n.gettext('Select Course'),
                isFilterByCourse : true
            },
            stores : {
                inputStore : {
                    type : 'criterion_employer_courses',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteFilter : true,
                    remoteSort : true
                }
            },
            formulas : {
                isTextFilter : function() {
                    return true;
                }
            }
        },

        controller : {
            type : 'criterion_settings_hr_course_or_path_picker'
        },

        draggable : false,

        initComponent : function() {
            var gridColumns = [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Course Code'),
                    dataIndex : 'code',
                    flex : 1,
                    filter : 'string',
                    filterType : JOB_COURSE_TYPE.COURSE,
                    bind : {
                        hidden : '{!isFilterByCourse}'
                    },
                    filterCfg : {
                        xtype : 'textfield'
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Course Name'),
                    dataIndex : 'name',
                    flex : 1,
                    filter : 'string',
                    filterType : JOB_COURSE_TYPE.COURSE,
                    bind : {
                        hidden : '{!isFilterByCourse}'
                    },
                    filterCfg : {
                        xtype : 'textfield'
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Learning Path Name'),
                    dataIndex : 'name',
                    flex : 1,
                    filter : 'string',
                    filterType : JOB_COURSE_TYPE.LEARNING_PATH,
                    bind : {
                        hidden : '{isFilterByCourse}'
                    },
                    filterCfg : {
                        xtype : 'textfield'
                    }
                }
            ];

            this.getViewModel().set({
                gridColumns : gridColumns,
                hideFilters : !this.getAllowFilterByName()
            });

            this.callParent(arguments);
        }
    }
});
