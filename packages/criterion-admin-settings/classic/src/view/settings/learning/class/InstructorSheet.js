Ext.define('criterion.view.settings.learning.class.InstructorSheet', function() {

    var DICT = criterion.consts.Dict,
        COURSE_CLASS_ACTIONS = criterion.Consts.COURSE_CLASS_ACTIONS;

    return {

        alias : 'widget.criterion_settings_learning_class_instructor_sheet',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.store.employer.course.class.Attendees',
            'criterion.controller.settings.learning.class.InstructorSheet'
        ],

        title : i18n.gettext('Instructor Sheet'),

        viewModel : {
            data : {
                actionType : COURSE_CLASS_ACTIONS.SET_COMPLETE_STATUS,
                selectionCount : 0,
                courseIds : []
            },
            stores : {
                courseClassAttendees : {
                    type : 'criterion_employer_course_class_attendees'
                }
            },
            formulas : {
                isSetCompleteStatus : function(data) {
                    return data('actionType') === COURSE_CLASS_ACTIONS.SET_COMPLETE_STATUS;
                },
                isSetSuccessStatus : function(data) {
                    return data('actionType') === COURSE_CLASS_ACTIONS.SET_SUCCESS_STATUS;
                },
                isSetScore : function(data) {
                    return data('actionType') === COURSE_CLASS_ACTIONS.SET_SCORE;
                },

                selectedText : function(data) {
                    var count = data('selectionCount');

                    return Ext.String.format(i18n.gettext('{0} employee{1} selected'), count, (count > 1 ? 's' : ''));
                },
                enableAction : function(data) {
                    return data('selectionCount');
                }
            }
        },

        controller : {
            type : 'criterion_settings_learning_class_instructor_sheet'
        },

        listeners : {
            show : 'handleShow'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 0,
        closable : true,
        modal : true,
        alwaysOnTop : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : '70%',
                width : '70%',
                modal : true
            }
        ],

        items : [
            {
                xtype : 'criterion_gridpanel',
                reference : 'courseClassAttendeesGrid',
                flex : 1,
                bind : {
                    store : '{courseClassAttendees}'
                },
                selType : 'checkboxmodel',
                selModel : {
                    checkOnly : true,
                    mode : 'MULTI',
                    listeners : {
                        scope : 'controller',
                        selectionchange : 'handleSelectionChange'
                    }
                },
                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee Name'),
                        dataIndex : 'name',
                        flex : 1
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Complete Status'),
                        dataIndex : 'courseCompleteStatusCd',
                        flex : 1,
                        codeDataId : DICT.COURSE_COMPLETE_STATUS
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Success Status'),
                        dataIndex : 'courseSuccessStatusCd',
                        flex : 1,
                        codeDataId : DICT.COURSE_SUCCESS_STATUS
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Score'),
                        dataIndex : 'score',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    }
                ]
            },

            {
                xtype : 'criterion_form',
                reference : 'form',
                layout : 'hbox',
                bodyPadding : 10,

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        items : [
                            {
                                xtype : 'component',
                                margin : '0 0 20 0',
                                hidden : true,
                                bind : {
                                    hidden : '{!selectionCount}',
                                    html : '{selectedText}'
                                }
                            },

                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Action Type'),
                                sortByDisplayField : false,
                                editable : false,
                                store : Ext.create('Ext.data.Store', {
                                    fields : ['text', 'value'],
                                    data : [
                                        {
                                            text : i18n.gettext('Complete Status'),
                                            value : COURSE_CLASS_ACTIONS.SET_COMPLETE_STATUS
                                        },
                                        {
                                            text : i18n.gettext('Success Status'),
                                            value : COURSE_CLASS_ACTIONS.SET_SUCCESS_STATUS
                                        },
                                        {
                                            text : i18n.gettext('Score'), value : COURSE_CLASS_ACTIONS.SET_SCORE
                                        },
                                        {
                                            text : i18n.gettext('Remove'), value : COURSE_CLASS_ACTIONS.SET_WITHDRAW
                                        }
                                    ]
                                }),
                                disabled : true,
                                bind : {
                                    value : '{actionType}',
                                    disabled : '{!selectionCount}'
                                },
                                displayField : 'text',
                                valueField : 'value',
                                queryMode : 'local',
                                forceSelection : true,
                                autoSelect : true
                            },

                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Value'),
                                hidden : true,
                                disabled : true,
                                codeDataId : DICT.COURSE_COMPLETE_STATUS,
                                allowBlank : false,
                                reference : 'setCompleteStatusField',
                                bind : {
                                    hidden : '{!isSetCompleteStatus}',
                                    disabled : '{!selectionCount || !isSetCompleteStatus}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Value'),
                                hidden : true,
                                disabled : true,
                                codeDataId : DICT.COURSE_SUCCESS_STATUS,
                                allowBlank : false,
                                reference : 'setSuccessStatusField',
                                bind : {
                                    hidden : '{!isSetSuccessStatus}',
                                    disabled : '{!selectionCount || !isSetSuccessStatus}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Value'),
                                hidden : true,
                                disabled : true,
                                checkChangeBuffer : 200,
                                minValue : 0,
                                maxValue : 100,
                                step : 1,
                                allowBlank : false,
                                reference : 'setScoreField',
                                bind : {
                                    hidden : '{!isSetScore}',
                                    disabled : '{!selectionCount || !isSetScore}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            //
                        ]
                    }
                ]
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Submit'),
                disabled : true,
                bind : {
                    disabled : '{!enableAction}'
                },
                handler : 'handleAct'
            }
        ]
    }
});
