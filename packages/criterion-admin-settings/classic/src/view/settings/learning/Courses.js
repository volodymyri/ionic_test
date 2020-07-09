Ext.define('criterion.view.settings.learning.Courses', function() {

    const LEARNING_COURSES_STATE_ID = 'learningCoursesGrid';

    return {

        alias : 'widget.criterion_settings_learning_courses',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.learning.Courses',
            'criterion.view.settings.EmployerBar',
            'criterion.view.settings.learning.Course',
            'criterion.store.employer.Courses',
            'criterion.ux.toolbar.ToolbarPaging',
            'criterion.view.FilterWithSelectorBar'
        ],

        controller : {
            type : 'criterion_settings_learning_courses',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : true,
            editor : {
                xtype : 'criterion_settings_learning_course',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        title : i18n.gettext('Courses'),

        store : {
            type : 'criterion_employer_courses',

            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        },

        stateId : LEARNING_COURSES_STATE_ID,

        stateful : true,

        tbar : {
            overflowHandler : 'scroller',

            items : [
                {
                    xtype : 'criterion_settings_employer_bar',
                    context : 'criterion_settings'
                },
                {
                    xtype : 'criterion_filter_with_selector_bar',
                    properties : {
                        data : [
                            { id : 'name', name : 'Name'},
                            { id : 'code', name : 'Code'},
                            { id : 'description', name : 'Description'}
                        ]
                    },
                    listeners : {
                        filterByProperty : 'handleFilterByProperty'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    reference : 'addButton',
                    text : i18n.gettext('Add'),
                    cls : 'criterion-btn-feature',
                    listeners : {
                        click : 'handleAddClick'
                    }
                },
                {
                    xtype : 'toggleslidefield',
                    reference : 'showInactive',
                    labelWidth : 100,
                    margin : '0 0 0 20',
                    inputValue : '1',
                    fieldLabel : i18n.gettext('Show inactive'),
                    listeners : {
                        change : 'handleChangeShowInactive'
                    }
                },
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
            ]
        },

        columns : [
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
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Course Type'),
                flex : 1,
                dataIndex : 'courseType'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Content Type'),
                flex : 1,
                dataIndex : 'courseContentType'
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'creationDate',
                text : i18n.gettext('Creation Date'),
                width : 150
            },
            {
                xtype : 'booleancolumn',
                dataIndex : 'isActive',
                text : i18n.gettext('Status'),
                trueText : i18n.gettext('Active'),
                falseText : i18n.gettext('Inactive'),
                flex : 1,
                filter : false
            }
        ],

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true,

            stateId : LEARNING_COURSES_STATE_ID,
            stateful : true
        }
    };
});
