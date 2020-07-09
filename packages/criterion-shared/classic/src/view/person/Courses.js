Ext.define('criterion.view.person.Courses', function() {

    return {
        alias : 'widget.criterion_person_courses',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.person.Courses',
            'criterion.view.person.Course',
            'criterion.store.employee.Courses'
        ],

        uses : [
            'criterion.view.person.Course'
        ],

        store : {
            type : 'criterion_employee_courses'
        },

        controller : {
            type : 'criterion_person_courses',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_person_course',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                allowDelete : true
            }
        },

        title : i18n.gettext('Courses'),

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_COURSES, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Course Name'),
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Class Name'),
                flex : 1,
                dataIndex : 'courseClassName'
            },
            {
                dataIndex : 'employerName',
                text : i18n.gettext('Employer'),
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                flex : 1,
                text : i18n.gettext('Delivery'),
                codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                dataIndex : 'courseTypeCd'
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
                flex : 1,
                text : i18n.gettext('Due Date'),
                dataIndex : 'dueDate'
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Enrollment Status'),
                dataIndex : 'courseCompleteStatusCd',
                codeDataId : criterion.consts.Dict.COURSE_COMPLETE_STATUS,
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'datecolumn',
                flex : 1,
                text : i18n.gettext('Completed Date'),
                dataIndex : 'completedDate'
            }
       ]
    };
});
