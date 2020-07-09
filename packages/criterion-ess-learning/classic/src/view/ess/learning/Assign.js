Ext.define('criterion.view.ess.learning.Assign', function() {

    return {
        alias : 'widget.criterion_selfservice_learning_assign',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.store.learning.CourseForEnroll',
            'criterion.store.learning.CourseClassForEnroll',
            'criterion.controller.ess.learning.Assign',
            'criterion.view.ess.learning.assign.Courses'
        ],

        viewModel : {
            data : {
                activeViewIdx : 0,
                title : i18n.gettext('Assign Courses'),
                hideBack : false
            }
        },

        bind : {
            activeItem : '{activeViewIdx}',
            title : '{title}'
        },

        layout : 'card',

        modal : true,
        closable : true,
        draggable : true,

        controller : {
            type : 'criterion_selfservice_learning_assign'
        },

        listeners : {
            show : 'handleShow'
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_selfservice_learning_assign_courses',
                    reference : 'courseGrid',
                    searchFields : [
                        {
                            fieldName : 'name', displayName : i18n.gettext('Name')
                        },
                        {
                            fieldName : 'description', displayName : i18n.gettext('Description')
                        }
                    ],
                    gridListeners : {
                        assignAction : 'handleAssign',
                        selectClassAction : 'handleSelectClass'
                    }
                },

                // classes
                {
                    xtype : 'criterion_record_picker',
                    reference : 'classGrid',
                    plugins : null,
                    modal : false,
                    title : null,
                    showHeader : false,
                    closable : false,
                    draggable : false,
                    gridCls : 'criterion-record-picker hideOnly',
                    searchFields : [
                        {
                            fieldName : 'name', displayName : i18n.gettext('Class Name')
                        },
                        {
                            fieldName : 'location', displayName : i18n.gettext('Location')
                        },
                        {
                            fieldName : 'description', displayName : i18n.gettext('Description')
                        }
                    ],
                    store : Ext.create('criterion.store.learning.CourseClassForEnroll', {
                        pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                    }),
                    gridListeners : {
                        registerAction : 'handleRegister'
                    },
                    dockedItems : [
                        {
                            xtype : 'toolbar',
                            dock : 'bottom',
                            ui : 'footer',
                            padding : '10 15',

                            defaults : {
                                minWidth : criterion.Consts.UI_DEFAULTS.MIN_BUTTON_WIDTH,
                                padding : 10,
                                margin : '0 5'
                            },

                            hidden : true,
                            bind : {
                                hidden : '{hideBack}'
                            },

                            items : [
                                '->',
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Back'),
                                    cls : 'criterion-btn-light',
                                    listeners : {
                                        click : 'handleBack'
                                    }
                                }
                            ]
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
                            text : i18n.gettext('Location'),
                            flex : 1,
                            dataIndex : 'location',
                            filter : true
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Class Time'),
                            dataIndex : 'courseDateTime',
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
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
                    actionColumns : [
                        {
                            xtype : 'criterion_actioncolumn',
                            width : 160,
                            items : [
                                {
                                    text : i18n.gettext('Assign'),
                                    asButton : true,
                                    action : 'registerAction'
                                }
                            ]
                        }
                    ],

                    handleSelectClick : Ext.emptyFn
                }
            ];

            this.callParent(arguments);
        },

        selectCourse : function(courseId) {
            this.getController().selectCourse(courseId);
        }
    };

});
