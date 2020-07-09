Ext.define('criterion.view.settings.learning.Classes', function() {

    const LEARNING_CLASSES_STATE_ID = 'learningClassesGrid';

    return {

        alias : 'widget.criterion_settings_learning_classes',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.view.settings.EmployerBar',
            'criterion.controller.settings.learning.Classes',
            'criterion.view.settings.learning.Class',
            'criterion.store.employer.course.Classes',
            'criterion.ux.toolbar.ToolbarPaging',
            'criterion.view.FilterWithSelectorBar'
        ],

        controller : {
            type : 'criterion_settings_learning_classes',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_settings_learning_class',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        title : i18n.gettext('Classes'),

        store : {
            type : 'criterion_employer_course_classes',

            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        },

        stateId : LEARNING_CLASSES_STATE_ID,

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
                            { id : 'location', name : 'Location'},
                            { id : 'code', name : 'Course Code'},
                            { id : 'description', name : 'Course Description'}
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
                    margin : '0 20 0 20',
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
                text : i18n.gettext('Name'),
                flex : 2,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Location'),
                flex : 1,
                dataIndex : 'location'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Instructor'),
                flex : 1,
                dataIndex : 'instructorName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Date'),
                flex : 1,
                minWidth : 200,
                dataIndex : 'courseDateTime'
            }
        ],

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true,

            stateId : LEARNING_CLASSES_STATE_ID,
            stateful : true
        }
    };
});
