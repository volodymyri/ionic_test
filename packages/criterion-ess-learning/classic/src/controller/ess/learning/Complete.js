Ext.define('criterion.controller.ess.learning.Complete', function() {

    const COURSE_CONTENT_TYPE = criterion.Consts.COURSE_CONTENT_TYPE,
        COMPLETED_COURSES_BY_EMPLOYEE = 'completed_courses_by_employee';

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_learning_complete',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.learning.Popups'
        ],

        handleActivate : function() {
            var view = this.getView(),
                vm = view.getViewModel();

            criterion.Api.request({
                url : criterion.consts.Api.API.REPORT_CHECK_ACCESS,
                method : 'GET',
                silent : true,
                params : {
                    name : COMPLETED_COURSES_BY_EMPLOYEE
                },
                scope : this,
                success : function() {
                    vm.set('isShowDownloadReportButton', true);
                }
            });

            this.callParent(arguments);
        },

        onEmployeeChange : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        load : function() {
            this.getView().getStore().loadWithPromise();
        },

        handleGetReport : function() {
            var employeeId = this.getEmployeeId(),
                options = Ext.JSON.encode({
                    filters : [],
                    hiddenColumns : [],
                    orderBy : [],
                    groupBy : [],
                    parameters : [
                        {
                            name : 'employeeId',
                            mandatory : true,
                            valueType : 'integer',
                            value : employeeId
                        }
                    ]
                });

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(criterion.consts.Api.API.REPORT_DOWNLOAD_BY_NAME, COMPLETED_COURSES_BY_EMPLOYEE, encodeURI(options))
            ));
        },

        handleViewAction : function(record) {
            var me = this,
                popup = this._createPopUp(record, i18n.gettext('View')),
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
                        var queryParamsObj = {
                                EmployerId : criterion.Api.getEmployerId(),
                                Authorization : criterion.Api.getToken()
                            },
                            frameUrl = criterion.consts.Api.API.EMPLOYEE_COURSE_PREVIEW + '/' + recordId + '?' + Ext.Object.toQueryString(queryParamsObj);

                        me.iFramePopUp(record, frameUrl).show();
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
        }
    };

});
