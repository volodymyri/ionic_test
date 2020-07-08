Ext.define('ess.view.learning.Course', function() {

    return {
        alias : 'widget.ess_modern_learning_course',

        extend : 'Ext.form.Panel',

        requires : [
            'ess.controller.learning.Course'
        ],

        controller : {
            type : 'ess_modern_learning_course'
        },

        cls : 'ess-modern-learning-course',

        viewModel : {
            data : {
                allowMainBtns : true,
                showEnrollBtn : false
            },

            formulas : {
                showStartBtn : function(data) {
                    var record = data('record');

                    return data('allowMainBtns') &&
                        record.get('courseDeliveryCode') === criterion.Consts.COURSE_DELIVERY.ONDEMAND &&
                        !record.get('courseCompleteStatusCode') &&
                        !record.get('isInWaitlist');
                },

                showResumeBtn : function(data) {
                    var record = data('record');

                    return data('allowMainBtns') &&
                        record.get('courseDeliveryCode') === criterion.Consts.COURSE_DELIVERY.ONDEMAND &&
                        record.get('courseCompleteStatusCode') === criterion.Consts.COURSE_COMPLETE_STATUS.INCOMPLETE &&
                        !record.get('isInWaitlist');
                },

                showRegisterBtn : function(data) {
                    var record = data('record');

                    return data('allowMainBtns') &&
                        record.get('hasClasses') &&
                        record.get('courseDeliveryCode') === criterion.Consts.COURSE_DELIVERY.CLASSROOM &&
                        !record.get('courseCompleteStatusCode') &&
                        !record.get('isCourseClass');
                },

                showUnenrollBtn : function(data) {
                    var record = data('record');

                    return data('allowMainBtns') &&
                        record.get('isSelfEnrolled') &&
                        !record.get('courseCompleteStatusCode') &&
                        !record.get('isCourseClass');
                },

                showWithdrawBtn : function(data) {
                    var record = data('record');

                    return data('allowMainBtns') &&
                        record.get('courseDeliveryCode') === criterion.Consts.COURSE_DELIVERY.CLASSROOM &&
                        record.get('courseCompleteStatusCode') === criterion.Consts.COURSE_COMPLETE_STATUS.REGISTERED &&
                        record.get('courseDate') > Ext.Date.clearTime(new Date()) &&
                        record.get('isCourseClass');
                },

                showAttendBtn : function(data) {
                    var record = data('record');

                    return data('allowMainBtns') &&
                        record.get('courseDeliveryCode') === criterion.Consts.COURSE_DELIVERY.CLASSROOM &&
                        record.get('courseCompleteStatusCode') === criterion.Consts.COURSE_COMPLETE_STATUS.REGISTERED &&
                        record.get('courseDate') <= Ext.Date.clearTime(new Date()) &&
                        record.get('isCourseClass');
                },

                showRemoveBtn : function(data) {
                    var record = data('record');

                    return data('allowMainBtns') &&
                        record.get('isSelfEnrolled') &&
                        !record.get('courseCompleteStatusCode') &&
                        record.get('isCourseClass');
                },

                showUnregisterBtn : function(data) {
                    var record = data('record');

                    return data('allowMainBtns') &&
                        record.get('courseDeliveryCode') === criterion.Consts.COURSE_DELIVERY.CLASSROOM &&
                        record.get('isInWaitlist');
                }

            }
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : i18n.gettext('Course Details'),
                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-arrow-back',
                        handler : 'handleBack',
                        itemId : 'backButton'
                    }
                ]
            },
            {
                xtype : 'component',
                bind : {
                    html : '<span class="titleEl">Course Name:</span> {record.name}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Description:</span> {record.description}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Delivery:</span> {record.courseDelivery}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Location:</span> {record.location}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Course Date:</span> {record.courseDate:date("m/d/Y")}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Due Date:</span> {record.dueDate:date("m/d/Y")}'
                }
            },

            {
                xtype : 'container',
                layout : 'hbox',

                margin : '20 20 10 20',
                docked : 'bottom',
                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Start'),
                        ui : 'act-btn-light',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showStartBtn}'
                        },
                        handler : 'handleStart'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Resume'),
                        ui : 'act-btn-light',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showResumeBtn}'
                        },
                        handler : 'handleResume'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Register'),
                        ui : 'act-btn-light',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showRegisterBtn}'
                        },
                        handler : 'handleRegister'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Remove'),
                        ui : 'act-btn-delete',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showUnenrollBtn}'
                        },
                        handler : 'handleUnenroll'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Withdraw'),
                        ui : 'act-btn-light',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showWithdrawBtn}'
                        },
                        handler : 'handleWithdraw'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Attend'),
                        ui : 'act-btn-light',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showAttendBtn}'
                        },
                        handler : 'handleAttend'
                    },

                    {
                        xtype : 'button',
                        text : i18n.gettext('Remove'),
                        ui : 'act-btn-delete',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showRemoveBtn}'
                        },
                        handler : 'handleRemoveAct'
                    },

                    {
                        xtype : 'button',
                        text : i18n.gettext('Unregister'),
                        ui : 'act-btn-delete',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!showUnregisterBtn}'
                        },
                        handler : 'handleUnregister'
                    }
                ]
            }
        ]

    };

});
