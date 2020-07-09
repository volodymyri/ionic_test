Ext.define('ess.view.learning.CourseClassesForEnroll', function() {

    return {
        alias : 'widget.ess_modern_learning_course_classes_for_enroll',

        extend : 'Ext.container.Container',

        requires : [
            'criterion.store.learning.CourseClassForEnroll'
        ],

        viewModel : {
            stores : {
                courseClassForEnroll : {
                    type : 'criterion_learning_course_class_for_enroll',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    proxy : {
                        extraParams : {
                            courseId : '{courseId}'
                        }
                    }
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        listeners : {
            activate : Ext.Function.createBuffered(function() {
                this.getViewModel().get('courseClassForEnroll').load();
            }, 100)
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : i18n.gettext('Employee Assign -> Select a Class'),
                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-arrow-back',
                        handler : 'handleBackToEmployeeAssign'
                    }
                ]
            },
            {
                xtype : 'container',
                docked : 'top',
                items : [
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Class Name'),
                        labelAlign : 'left',
                        cls : 'cb_left_filter',
                        margin : '0 10 10 10',
                        triggers : {
                            search : {
                                type : 'search',
                                side : 'right'
                            }
                        },
                        listeners : {
                            change : Ext.Function.createBuffered(function(cmp, value) {
                                cmp.up('ess_modern_learning_course_classes_for_enroll').getViewModel().get('courseClassForEnroll').load({
                                    params : {
                                        name : value
                                    }
                                })
                            }, 500)
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_grid',
                bind : {
                    store : '{courseClassForEnroll}'
                },
                flex : 1,

                plugins : [
                    {
                        type : 'criterion_pagingtoolbar'
                    },
                    {
                        type : 'columnresizing'
                    }
                ],

                rowLines : true,

                listeners : {
                    scope : 'controller',
                    itemtap : 'handleSwitchToEnrollCourseClassForm'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Code'),
                        flex : 1,
                        minWidth : 150,
                        dataIndex : 'code'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        flex : 2,
                        minWidth : 200,
                        dataIndex : 'name'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Location'),
                        flex : 1,
                        minWidth : 200,
                        dataIndex : 'location',
                        filter : true
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Due Date'),
                        dataIndex : 'dueDate',
                        minWidth : 130
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Open Spots'),
                        minWidth : 130,
                        dataIndex : 'openSpots',
                        encodeHtml : false,
                        align : 'center',
                        renderer : function(value) {
                            if (value === null) {
                                return i18n.gettext('Available');
                            }

                            return value;
                        }
                    }
                ]
            }
        ]
    }
});
