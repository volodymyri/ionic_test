Ext.define('ess.view.learning.CoursesForEnroll', function() {

    return {
        alias : 'widget.ess_modern_learning_courses_for_enroll',

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
                title : i18n.gettext('Employee Assign'),
                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-arrow-back',
                        handler : 'handleBackToActiveCourses'
                    }
                ]
            },
            {
                xtype : 'container',
                docked : 'top',
                items : [
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Course Name'),
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
                                cmp.up('ess_modern_learning_courses_for_enroll').getViewModel().get('courseForEnroll').load({
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
                    store : '{courseForEnroll}'
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
                    itemtap : 'handleSwitchToEnrollCourseForm'
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
                        text : i18n.gettext('Course Name'),
                        flex : 2,
                        minWidth : 200,
                        dataIndex : 'name'
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Delivery'),
                        dataIndex : 'courseDeliveryCd',
                        codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                        minWidth : 150,
                        flex : 1
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Creation Date'),
                        dataIndex : 'creationDate',
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
