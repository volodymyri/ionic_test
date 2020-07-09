Ext.define('criterion.controller.settings.learning.Class', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_learning_class',

        requires : [
            'criterion.store.employer.Courses',
            'criterion.view.settings.learning.class.InstructorSheet',
            'criterion.view.settings.learning.class.ClassAttachments',
            'criterion.store.Workflows'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleRecordLoad : function(record) {
            var view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            Ext.promise.Promise.all([
                vm.getStore('instructorsStore').loadWithPromise(),
                vm.getStore('webForms').loadWithPromise()
            ]).always(function() {
                view.setLoading(false);
            });

            criterion.Api.request({
                url : criterion.consts.Api.API.REPORT_CHECK_ACCESS,
                method : 'GET',
                silent : true,
                params : {
                    name : 'attendees_list_by_class'
                },
                scope : this,
                success : function() {
                    vm.set('isShowAttendeesListButton', true);
                }
            });

            this.callParent(arguments);
        },

        handleCourseSearch : function() {
            var me = this,
                vm = me.getViewModel();

            var picker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select Course'),
                searchFields : [
                    {
                        fieldName : 'name', displayName : i18n.gettext('Name')
                    },
                    {
                        fieldName : 'code', displayName : i18n.gettext('Code')
                    }
                ],
                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Code'),
                        flex : 1,
                        dataIndex : 'code'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        flex : 1,
                        dataIndex : 'name'
                    }
                ],
                store : Ext.create('criterion.store.employer.Courses', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    proxy : {
                        extraParams : {
                            courseType : criterion.Consts.COURSE_TYPE.CLASSROOM,
                            employerId : vm.get('employerId'),
                            isActive : true
                        }
                    }
                }),
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
                    }
                ],
                cls : 'criterion-modal'
            });

            picker.on('select', function(record) {
                vm.get('record').set({
                    courseId : record.getId(),
                    name : record.get('name'),
                    courseName : record.get('name'),
                    courseCode : record.get('code'),
                    employerId : record.get('employerId'),
                    maxEnrollmentLimit : record.get('maxEnrollmentLimit')
                });
            });
            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        handleShowAttendeeListReportOptions : function() {
            let me = this,
                popup = Ext.create('criterion.ux.form.Panel', {
                    title : i18n.gettext('Download Attendee List'),
                    modal : true,
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                            height : 'auto',
                            modal : true
                        }
                    ],

                    viewModel : {
                        data : {
                            showScore : false,
                            showStatus : false
                        }
                    },

                    items : [
                        {
                            xtype : 'checkbox',
                            fieldLabel : i18n.gettext('Show Score'),
                            bind : '{showScore}'
                        },
                        {
                            xtype : 'checkbox',
                            fieldLabel : i18n.gettext('Show Status'),
                            bind : '{showStatus}'
                        }
                    ],

                    buttons : [
                        '->',
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-light',
                            handler : function() {
                                this.up('criterion_form').fireEvent('cancel');
                            },
                            text : i18n.gettext('Cancel')
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-primary',
                            handler : function() {
                                let vm = popup.getViewModel();

                                me.downloadAttendeeList(vm.get('showScore'), vm.get('showStatus'));
                                popup.destroy();
                            },
                            text : i18n.gettext('Download')
                        }
                    ]
                });

            popup.show();

            popup.on('cancel', function() {
                popup.destroy();
                me.setCorrectMaskZIndex(false);
            });

            me.setCorrectMaskZIndex(true);
        },

        downloadAttendeeList : function(showScore, showStatus) {
            var record = this.getRecord(),
                options = Ext.JSON.encode({
                    filters : [],
                    hiddenColumns : [],
                    orderBy : [
                        {
                            key : 'order_1',
                            fieldName : 'emp_name',
                            displayName : 'Employee Name'
                        }
                    ],
                    groupBy : [],
                    parameters : [
                        {
                            name : 'classId',
                            mandatory : true,
                            valueType : 'integer',
                            value : record.getId()
                        },
                        {
                            name : 'showScore',
                            mandatory : true,
                            valueType : 'boolean',
                            value : showScore
                        },
                        {
                            name : 'showStatus',
                            mandatory : true,
                            valueType : 'boolean',
                            value : showStatus
                        }
                    ]
                });

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(criterion.consts.Api.API.REPORT_DOWNLOAD_BY_NAME, 'attendees_list_by_class', encodeURI(options))
            ));
        },

        onRequestCourseReview : function() {
            var selectPopup,
                record  = this.getRecord(),
                employerId = record.get('employerId'),
                reviewId = record.getId();

            selectPopup = Ext.create('criterion.ux.form.Panel', {
                title : i18n.gettext('Select Workflow'),
                modal : true,
                draggable : true,
                cls : 'criterion-modal',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 'auto',
                        modal : true
                    }
                ],

                viewModel : {
                    stores : {
                        workflows : {
                            type : 'criterion_workflows',
                            filters : [
                                {
                                    property : 'workflowTypeCode',
                                    value : criterion.Consts.WORKFLOW_TYPE_CODE.FORM
                                }
                            ]
                        }
                    }
                },

                layout : 'hbox',
                bodyPadding : 20,

                items : [
                    {
                        xtype : 'combo',
                        fieldLabel : i18n.gettext('Workflow Name'),
                        reference : 'workflow',
                        bind : {
                            store : '{workflows}'
                        },
                        valueField : 'id',
                        displayField : 'name',
                        queryMode : 'local',
                        editable : false,
                        allowBlank : false
                    }
                ],

                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',
                        handler : function() {
                            this.up('criterion_form').fireEvent('cancel');
                        },
                        text : i18n.gettext('Cancel')
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        handler : function() {
                            var form = this.up('criterion_form');

                            if (form.isValid()) {
                                form.fireEvent('change', form.getViewModel().get('workflow.selection.id'));
                            }
                        },
                        text : i18n.gettext('Select')
                    }
                ]
            });

            selectPopup.on('show', function() {
                selectPopup.setLoading(true);
                selectPopup.getViewModel().getStore('workflows').loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                }).always(function() {
                    selectPopup.setLoading(false);
                });
            });
            selectPopup.on('cancel', function() {
                selectPopup.destroy();
            });
            selectPopup.on('change', function(workflowId) {
                criterion.Api.request({
                    url : Ext.String.format(criterion.consts.Api.API.EMPLOYER_COURSE_CLASS_REQUEST_REVIEW, reviewId),
                    method : 'POST',
                    jsonData : {
                        reviewFormWorkflowId : workflowId
                    },
                    scope : this,
                    success : function() {
                        criterion.Utils.toast(i18n.gettext('Successfully.'));
                    }
                });

                selectPopup.destroy();
            });

            selectPopup.show();
        },

        onDownloadReviews : function() {
            window.open(criterion.Api.getSecureResourceUrl(
                Ext.String.format(criterion.consts.Api.API.EMPLOYER_COURSE_CLASS_DOWNLOAD_REVIEWS, this.getRecord().getId())
            ));
        },

        handleInstructorSheet : function() {
            var sheet = Ext.create('criterion.view.settings.learning.class.InstructorSheet', {
                viewModel : {
                    data : {
                        classId : this.getRecord().getId()
                    }
                }
            });

            sheet.show();
        },

        handleAddClassAttachment : function() {
            Ext.create('criterion.view.settings.learning.class.ClassAttachments', {
                viewModel : {
                    data : {
                        classId : this.getRecord().getId()
                    }
                }
            }).show();
        }
    };
});
