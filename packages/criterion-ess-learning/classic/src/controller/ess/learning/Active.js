Ext.define('criterion.controller.ess.learning.Active', function() {

    var COURSE_CONTENT_TYPE = criterion.Consts.COURSE_CONTENT_TYPE;

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_learning_active',

        requires : [
            'Ext.ux.IFrame',
            'criterion.store.learning.CourseForEnroll',
            'criterion.view.ess.learning.Assign',
            'criterion.model.learning.Active'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.ReRouting',
            'criterion.controller.mixin.learning.Popups'
        ],

        init : function() {
            var routes = {};

            routes[criterion.consts.Route.SELF_SERVICE.LEARNING_ACTIVE + '/class/:id'] = 'handleRouteClassRegister';

            this.setRoutes(routes);
            this.setReRouting();

            this.callParent(arguments);
        },

        handleRouteClassRegister : function(classId) {
            var me = this,
                popup,
                record;

            if (!classId) {
                return;
            }

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_REGISTER, classId)
            }).then(function(data) {
                record = Ext.create('criterion.model.learning.Active', data);

                if (data.isRegistered) {
                    // already registered
                    me._createPopUp(record, null, i18n.gettext('Close'), i18n.gettext('Class')).show();
                } else {
                    if (!data.isHaveOpenSpots) {
                        data.description = i18n.gettext('Do you want to enroll in the waitlist of this course?');
                    }

                    popup = me._createPopUp(record, i18n.gettext('Register'));
                    popup.on('actAction', function() {
                        criterion.Api.requestWithPromise({
                            method : 'PUT',
                            url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_ENROLL_COURSE_CLASS, classId)
                        }).then(function(url) {
                            me.redirectTo(criterion.consts.Route.SELF_SERVICE.LEARNING_ACTIVE, null);
                            me.load();
                        });
                    });
                    popup.show();
                }
            });
        },

        onEmployeeChange : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        load : function() {
            this.getView().getStore().loadWithPromise();
        },

        showAiccScormWindow : function(record) {
            let me = this,
                employerId = criterion.Api.getEmployerId(),
                queryParamsObj = {
                    EmployerId : employerId,
                    Authorization : criterion.Api.getToken()
                },
                id = record.getId(),
                frameUrl = criterion.consts.Api.API.EMPLOYEE_COURSE_PLAYER + '/' + id + '?' + Ext.Object.toQueryString(queryParamsObj),
                courseContentType = record.get('courseContentType'),
                iFramePopUp;

            if (courseContentType === COURSE_CONTENT_TYPE.AICC) {
                iFramePopUp = me.iFramePopUp(record, frameUrl, {preventLoadAfterClose : true});

                iFramePopUp.on('destroy', function() {
                    let view = me.getView();

                    view.setLoading(true);
                    criterion.Api.requestWithPromise({
                        method : 'PUT',
                        url : Ext.String.format(criterion.consts.Api.API.EMPLOYEE_COURSE_UPDATE_AICC, id, employerId)
                    }).then(function() {
                        me.load();
                    }).always(function() {
                        view.setLoading(false);
                    });
                });
            } else {
                iFramePopUp = me.iFramePopUp(record, frameUrl);
            }

            iFramePopUp.show();
        },

        handleStartAction : function(record) {
            var me = this,
                popup = this._createPopUp(record, i18n.gettext('Start')),
                courseContentType = record.get('courseContentType'),
                recordId = record.getId();

            popup.on('actAction', function() {
                criterion.Api.requestWithPromise({
                    method : 'PUT',
                    url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_START, recordId)
                }).then(function(data) {
                    if (courseContentType === COURSE_CONTENT_TYPE.URL) {
                        window.open(data.url, '_blank');
                        me.load();
                    } else if (Ext.Array.contains([COURSE_CONTENT_TYPE.SCORM, COURSE_CONTENT_TYPE.AICC], courseContentType)) {
                        me.showAiccScormWindow(record);
                    } else {
                        if (data.isOfficeAppsPlayType) {
                            if (data.url) {
                                me.iFramePopUp(record, data.url).show();
                            } else {
                                me.showDownloadConfirm(record);
                            }
                        } else {
                            var queryParamsObj = {
                                    EmployerId : criterion.Api.getEmployerId(),
                                    Authorization : criterion.Api.getToken()
                                },
                                frameUrl = Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_VIEW, recordId) + '?' + Ext.Object.toQueryString(queryParamsObj);

                            me.iFramePopUp(record, frameUrl).show();
                        }
                    }
                });
            });
            popup.show();
        },

        handleResumeAction : function(record) {
            var me = this,
                popup = this._createPopUp(record, i18n.gettext('Resume')),
                courseContentType = record.get('courseContentType'),
                recordId = record.getId();

            popup.on('actAction', function() {
                criterion.Api.requestWithPromise({
                    method : 'PUT',
                    url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_RESUME, recordId)
                }).then(function(data) {
                    if (courseContentType === COURSE_CONTENT_TYPE.URL) {
                        window.open(data.url, '_blank');
                    } else if (Ext.Array.contains([COURSE_CONTENT_TYPE.SCORM, COURSE_CONTENT_TYPE.AICC], courseContentType)) {
                        me.showAiccScormWindow(record);
                    } else {
                        if (data.isOfficeAppsPlayType) {
                            if (data.url) {
                                me.iFramePopUp(record, data.url).show();
                            } else {
                                me.showDownloadConfirm(record);
                            }
                        } else {
                            var queryParamsObj = {
                                    EmployerId : criterion.Api.getEmployerId(),
                                    Authorization : criterion.Api.getToken()
                                },
                                frameUrl = Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_VIEW, recordId) + '?' + Ext.Object.toQueryString(queryParamsObj);

                            me.iFramePopUp(record, frameUrl).show();
                        }
                    }
                });
            });
            popup.show();
        },

        handleRegisterAction : function(record) {
            var me = this,
                coursePicker;

            coursePicker = Ext.create('criterion.view.ess.learning.Assign', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : '90%',
                        modal : true
                    }
                ],
                viewModel : {
                    data : {
                        activeViewIdx : 1,
                        hideBack : true
                    }
                }
            });

            coursePicker.on('close', function(record) {
                me.load();
            });

            coursePicker.show();
            coursePicker.selectCourse(record.get('courseId'));
        },

        handleAttendAction : function(record) {
            var me = this,
                popup = this._createPopUpAttend(record, i18n.gettext('Attend'));

            popup.on('actAction', function(pin) {
                criterion.Api.requestWithPromise({
                    method : 'PUT',
                    jsonData : {
                        pin : pin
                    },
                    url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_ATTEND, record.getId())
                }).then(function(url) {
                    me.load();
                });
            });
            popup.show();
            popup.focusPin();
        },

        handleWithdrawAction : function(record) {
            var me = this,
                popup = this._createPopUp(record, i18n.gettext('Withdraw'));

            popup.on('actAction', function() {
                criterion.Api.requestWithPromise({
                    method : 'PUT',
                    url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_UNENROLL, record.getId())
                }).then(function(url) {
                    me.load();
                });
            });
            popup.show();
        },

        handleRemoveClAction : function(record) {
            var me = this,
                popup = this._createPopUp(record, i18n.gettext('Remove'));

            popup.on('actAction', function() {
                criterion.Api.requestWithPromise({
                    method : 'PUT',
                    url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_CANCEL, record.getId())
                }).then(function(url) {
                    me.load();
                });
            });
            popup.show();
        },

        handleAssign : function() {
            var me = this,
                coursePicker;

            coursePicker = Ext.create('criterion.view.ess.learning.Assign', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : '90%',
                        modal : true
                    }
                ]
            });

            coursePicker.on('close', function(record) {
                me.load();
            });

            coursePicker.show();
        }
    };

});
