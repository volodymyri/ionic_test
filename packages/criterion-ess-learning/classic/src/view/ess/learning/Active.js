Ext.define('criterion.view.ess.learning.Active', function() {

    const COURSE_COMPLETE_STATUS = criterion.Consts.COURSE_COMPLETE_STATUS,
        COURSE_DELIVERY = criterion.Consts.COURSE_DELIVERY;

    return {
        alias : 'widget.criterion_selfservice_learning_active',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.learning.Active',
            'criterion.controller.ess.learning.Active'
        ],

        controller : {
            type : 'criterion_selfservice_learning_active'
        },

        store : {
            type : 'criterion_learning_active',
            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        },

        stateId : 'learningActiveGrid',
        stateful : true,

        listeners : {
            startAction : 'handleStartAction',
            resumeAction : 'handleResumeAction',
            registerAction : 'handleRegisterAction',
            attendAction : 'handleAttendAction',
            withdrawAction : 'handleWithdrawAction',
            removeClAction : 'handleRemoveClAction'
        },

        header : {

            title : i18n.gettext('Active Courses'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Assign'),
                    ui : 'feature',
                    listeners : {
                        click : 'handleAssign'
                    }
                }
            ]
        },

        tbar : null,
        cls : 'criterion-grid-panel-simple-list',

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true
        },

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
                text : i18n.gettext('Course Name'),
                flex : 2,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Class Name'),
                hidden : true,
                flex : 1,
                dataIndex : 'courseClassName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                flex : 2,
                dataIndex : 'employerName'
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Delivery'),
                dataIndex : 'courseTypeCd',
                codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
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
                text : i18n.gettext('Due Date'),
                dataIndex : 'dueDate',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Waitlist'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                renderer : function(value, cell, record) {
                    var waitingEmployeePlace = record.get('waitingEmployeePlace'),
                        waitingEmployeesCount = record.get('waitingEmployeesCount'),
                        isInWaitlist = record.get('isInWaitlist');

                    if (!isInWaitlist) {
                        return;
                    }

                    return Ext.String.format('{0} {1} {2}', waitingEmployeePlace, i18n.gettext('of'), waitingEmployeesCount);
                }

            },
            {
                xtype : 'criterion_actioncolumn',
                width : 270,
                items : [
                    {
                        text : i18n.gettext('Start'),
                        asButton : true,
                        action : 'startAction',
                        getClass : function(v, m, record) {
                            var courseTypeCode = record.get('courseTypeCode'),
                                courseCompleteStatusCode = record.get('courseCompleteStatusCode'),
                                isInWaitlist = record.get('isInWaitlist');

                            if (record &&
                                courseTypeCode === COURSE_DELIVERY.ONDEMAND &&
                                (!courseCompleteStatusCode || Ext.Array.contains([COURSE_COMPLETE_STATUS.REGISTERED, COURSE_COMPLETE_STATUS.PAST_DUE], courseCompleteStatusCode)) &&
                                !isInWaitlist
                            ) {
                                return 'criterion-learning-action-button';
                            }

                            return 'hidden-el';
                        },
                        ui : 'frame'
                    },
                    {
                        text : i18n.gettext('Resume'),
                        action : 'resumeAction',
                        asButton : true,
                        style : {
                            'text-transform' : 'uppercase'
                        },
                        getClass : function(v, m, record) {
                            var courseTypeCode = record.get('courseTypeCode'),
                                courseCompleteStatusCode = record.get('courseCompleteStatusCode'),
                                isInWaitlist = record.get('isInWaitlist');

                            if (record &&
                                courseTypeCode === COURSE_DELIVERY.ONDEMAND &&
                                courseCompleteStatusCode === COURSE_COMPLETE_STATUS.INCOMPLETE &&
                                !isInWaitlist
                            ) {
                                return '';
                            }

                            return 'hidden-el';
                        },
                        ui : 'frame'
                    },
                    {
                        text : i18n.gettext('Register'),
                        action : 'registerAction',
                        asButton : true,
                        getClass : function(v, m, record) {
                            var courseTypeCode = record.get('courseTypeCode'),
                                courseCompleteStatusCode = record.get('courseCompleteStatusCode'),
                                hasClasses = record.get('hasClasses'),
                                isCourseClass = record.get('isCourseClass');

                            if (record &&
                                hasClasses &&
                                courseTypeCode === COURSE_DELIVERY.CLASSROOM &&
                                (!courseCompleteStatusCode || courseCompleteStatusCode === COURSE_COMPLETE_STATUS.REGISTERED) &&
                                !isCourseClass
                            ) {
                                return 'criterion-learning-action-button';
                            }

                            return 'hidden-el';
                        },
                        ui : 'frame'
                    },
                    {
                        text : i18n.gettext('Attend'),
                        action : 'attendAction',
                        asButton : true,
                        getClass : function(v, m, record) {
                            var courseTypeCode = record.get('courseTypeCode'),
                                courseCompleteStatusCode = record.get('courseCompleteStatusCode'),
                                hasPin = record.get('hasPin'),
                                courseDate = record.get('courseDate'),
                                isCourseClass = record.get('isCourseClass');

                            if (record &&
                                hasPin &&
                                courseTypeCode === COURSE_DELIVERY.CLASSROOM &&
                                courseCompleteStatusCode === COURSE_COMPLETE_STATUS.REGISTERED &&
                                courseDate <= Ext.Date.clearTime(new Date()) &&
                                isCourseClass
                            ) {
                                return 'criterion-learning-action-button';
                            }

                            return 'hidden-el';
                        },
                        ui : 'frame'
                    },
                    {
                        text : i18n.gettext('Withdraw'),
                        action : 'withdrawAction',
                        asButton : true,
                        getClass : function(v, m, record) {
                            var courseTypeCode = record.get('courseTypeCode'),
                                courseCompleteStatusCode = record.get('courseCompleteStatusCode'),
                                courseDate = record.get('courseDate'),
                                isCourseClass = record.get('isCourseClass'),
                                isInWaitlist = record.get('isInWaitlist');

                            if (record &&
                                courseTypeCode === COURSE_DELIVERY.CLASSROOM &&
                                (!courseCompleteStatusCode || courseCompleteStatusCode === COURSE_COMPLETE_STATUS.REGISTERED || isInWaitlist) &&
                                courseDate > Ext.Date.clearTime(new Date()) &&
                                isCourseClass
                            ) {
                                return '';
                            }

                            return 'hidden-el';
                        },
                        ui : 'secondary'
                    },
                    {
                        text : i18n.gettext('Remove'),
                        action : 'removeClAction',
                        asButton : true,
                        style : {
                            'min-width' : '120px'
                        },
                        getClass : function(v, m, record) {
                            var isSelfEnrolled = record.get('isSelfEnrolled'),
                                isCourseClass = record.get('isCourseClass'),
                                courseCompleteStatusCode = record.get('courseCompleteStatusCode'),
                                isInWaitlist = record.get('isInWaitlist');

                            if (record &&
                                isSelfEnrolled &&
                                !isCourseClass &&
                                (!courseCompleteStatusCode || courseCompleteStatusCode === COURSE_COMPLETE_STATUS.REGISTERED || isInWaitlist)
                            ) {
                                return '';
                            }

                            return 'hidden-el';
                        },
                        ui : 'secondary'
                    }
                ]
            }
        ]
    };

});
