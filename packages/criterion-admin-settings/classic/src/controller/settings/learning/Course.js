Ext.define('criterion.controller.settings.learning.Course', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        COURSE_CONTENT_TYPE = criterion.Consts.COURSE_CONTENT_TYPE,
        daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_learning_course',

        requires : [
            'criterion.view.MultiRecordPickerRemote',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleRecordLoad : function(record) {
            var vm = this.getViewModel(),
                view = this.getView(),
                allSkills = vm.getStore('allSkills'),
                jobs = vm.getStore('jobs'),
                employeeGroupCourses = vm.getStore('employeeGroupCourses'),
                promises = [];

            view.setLoading(true);

            if (!allSkills.isLoaded() && !allSkills.isLoading()) {
                promises.push(allSkills.loadWithPromise(
                    {
                        params : {
                            employerId : record.get('employerId')
                        }
                    }
                ));
            }
            if (!jobs.isLoaded() && !jobs.isLoading()) {
                promises.push(jobs.loadWithPromise());
            }

            if (!record.phantom) {
                promises.push(employeeGroupCourses.loadWithPromise(
                    {
                        params : {
                            courseId : record.getId()
                        }
                    }
                ));
            }

            criterion.Api.request({
                url : criterion.consts.Api.API.REPORT_CHECK_ACCESS,
                method : 'GET',
                silent : true,
                params : {
                    name : 'attendees_list_by_course'
                },
                scope : this,
                success : function() {
                    vm.set('isShowAttendeesListButton', true);
                }
            });

            Ext.promise.Promise.all(promises)
                .always(function() {
                    view.setLoading(false);
                });
        },

        handleRecordUpdate : function(record) {
            var view = this.getView(),
                skills = record.skills(),
                courseId = record.getId();

            if (!record.phantom) {
                skills.each(function(courseSkill) {
                    courseSkill.set('courseId', courseId);
                });
            }

            view.setLoading(true);

            this.callParent(arguments);
        },

        onFailureSave : function() {
            this.getView().setLoading(false);
        },

        onAfterSave : function(view, record) {
            var me = this,
                vm = this.getViewModel(),
                employeeGroupCoursesStore = this.getStore('employeeGroupCourses'),
                courseId = record.getId(),
                courseContentSourceField,
                fields,
                extraData,
                promises = [];

            if (vm.get('isContentTypeURL')) {
                courseContentSourceField = this.lookup('courseContentURL');
                fields = [];
                extraData = {
                    courseId : courseId,
                    courseContentTypeCd : record.get('courseContentTypeCd'),
                    url : courseContentSourceField.getValue()
                };
            } else {
                courseContentSourceField = this.lookup('courseContentFile');
                fields = [courseContentSourceField];
                extraData = {
                    courseId : courseId,
                    courseContentTypeCd : record.get('courseContentTypeCd')
                };
            }

            if (courseContentSourceField.isDirty()) {
                promises.push(criterion.Api.submitFormWithPromise({
                    url : API.LEARNING_COURSE_CONTENT_UPLOAD,
                    fields : fields,
                    extraData : extraData
                }));
            }

            if (this.lookup('employeeGroups').isDirty()) {
                employeeGroupCoursesStore.each(function(employeeGroupCourseRecord) {
                    employeeGroupCourseRecord.set({
                        courseId : courseId
                    })
                });

                promises.push(employeeGroupCoursesStore.syncWithPromise());
            }

            Ext.promise.Promise.all(promises)
                .then(function() {
                    view.fireEvent('afterSave', view, record);
                    me.close();
                })
                .always(function() {
                    view.setLoading(false);
                });
        },

        handleShowDescriptionForm : function() {
            var me = this,
                vm = this.getViewModel(),
                descriptionPopup = Ext.create('criterion.ux.form.Panel', {
                    title : i18n.gettext('Description'),
                    modal : true,
                    cls : 'criterion-modal',
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                            height : 'auto',
                            modal : true
                        }
                    ],

                    viewModel : {
                        data : {
                            description : vm.get('record.description')
                        }
                    },

                    items : [
                        {
                            xtype : 'htmleditor',
                            reference : 'description',
                            enableAlignments : false,
                            height : 300,
                            bind : {
                                value : '{description}'
                            }
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

                                form.fireEvent('change', form.getViewModel().get('description'));
                            },
                            text : i18n.gettext('Change')
                        }
                    ]
                });

            descriptionPopup.show();

            descriptionPopup.on('cancel', function() {
                descriptionPopup.destroy();
            });
            descriptionPopup.on('change', function(description) {
                vm.get('record').set('description', description);
                descriptionPopup.destroy();
                me.setCorrectMaskZIndex(false);
            });

            me.setCorrectMaskZIndex(true);
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
                            name : 'courseId',
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
                Ext.util.Format.format(criterion.consts.Api.API.REPORT_DOWNLOAD_BY_NAME, 'attendees_list_by_course', encodeURI(options))
            ));
        },

        handleContentTypeComboChange : function(cmp, val) {
            var vm = this.getViewModel(),
                courseContentTypeCode;

            if (Ext.isEmpty(val)) {
                vm.set({
                    courseContentTypeCd : null,
                    isContentTypeURL : null
                });

                return;
            }

            courseContentTypeCode = criterion.CodeDataManager.getCodeDetailRecord('id', val, DICT.COURSE_CONTENT_TYPE).get('code');

            vm.set({
                courseContentTypeCd : val,
                isContentTypeURL : courseContentTypeCode === COURSE_CONTENT_TYPE.URL
            });
        },

        handleRecurrenceMonthChange : function(combo, newVal) {
            var record = this.getRecord(),
                date = record.get('recurrenceDate') || new Date(),
                recurrenceDayCombo = this.lookupReference('recurrenceDay'),
                recurrenceDayStore = recurrenceDayCombo.getStore(),
                recurrenceDayCurrentSelection = recurrenceDayCombo.getSelection(),
                selectedMonth = newVal - 1,
                maxDay = daysInMonths[selectedMonth],
                recurrenceDate = new Date(date.getFullYear(), selectedMonth, date.getDate()); // create new date object to mark record as dirty

            record.set('recurrenceDate', recurrenceDate);

            recurrenceDayStore.clearFilter();
            recurrenceDayStore.setFilters([
                function(item) {
                    return item.get('day') <= maxDay;
                }
            ]);

            if (recurrenceDayCurrentSelection && recurrenceDayCurrentSelection.get('day') > maxDay) {
                var newMaxDayIdx = recurrenceDayStore.getAt(recurrenceDayStore.findBy(function(record) {
                    return parseInt(record.get('day'), 10) === maxDay;
                }));

                recurrenceDayCombo.select(newMaxDayIdx);
            }
        },

        handleRecurrenceDayChange : function(combo, newVal) {
            var record = this.getRecord(),
                date = record.get('recurrenceDate') || new Date(),
                recurrenceDate = new Date(date.getFullYear(), date.getMonth(), newVal); // create new date object to mark record as dirty

            record.set('recurrenceDate', recurrenceDate);
        },

        handleViewCourseContentFile : function() {
            var record = this.getRecord(),
                url = criterion.Api.getSecureResourceUrl(Ext.util.Format.format('{0}/{1}', API.LEARNING_COURSE_CONTENT_DOWNLOAD, record.getId()));

            window.open(url, '_blank');
        }
    };
});
