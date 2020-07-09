Ext.define('criterion.view.settings.learning.PathCourses', function() {

    return {
        alias : 'widget.criterion_settings_learning_path_courses',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.learning.PathCourses',
            'criterion.store.learning.PathCourses'
        ],

        flex : 1,

        controller : {
            type : 'criterion_settings_learning_path_courses'
        },

        store : {
            type : 'criterion_learning_path_courses'
        },

        title : i18n.gettext('Courses'),

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

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Course Name'),
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
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };
});
