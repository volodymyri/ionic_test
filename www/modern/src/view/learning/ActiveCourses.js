Ext.define('ess.view.learning.ActiveCourses', function() {

    return {
        alias : 'widget.ess_modern_learning_active_courses',

        extend : 'Ext.container.Container',

        viewModel : true,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : i18n.gettext('Active Courses'),

                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-add',
                        handler : 'handleAddCourse'
                    }
                ]
            },
            {
                xtype : 'criterion_grid',
                bind : {
                    store : '{active}'
                },
                flex : 1,

                listeners : {
                    itemtap : 'handleEditAction'
                },

                plugins : [
                    {
                        type : 'criterion_pagingtoolbar'
                    },
                    {
                        type : 'columnresizing'
                    }
                ],

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Course Name'),
                        flex : 2,
                        dataIndex : 'name',
                        minWidth : 200
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Class Name'),
                        flex : 1,
                        dataIndex : 'courseClassName',
                        minWidth : 150
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Delivery'),
                        dataIndex : 'courseDeliveryCd',
                        codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                        minWidth : 150
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Location'),
                        flex : 1,
                        dataIndex : 'location',
                        minWidth : 150
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Course Date'),
                        flex : 1,
                        dataIndex : 'courseDate',
                        minWidth : 150
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Due Date'),
                        dataIndex : 'dueDate',
                        minWidth : 150
                    }
                ]
            }
        ]
    }
});
