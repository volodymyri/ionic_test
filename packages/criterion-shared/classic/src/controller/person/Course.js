Ext.define('criterion.controller.person.Course', function() {

    var RESULT_CODES = criterion.consts.Error.RESULT_CODES,
        API = criterion.consts.Api.API;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_person_course',

        requires : [
            'criterion.view.person.CoursePicker',
            'criterion.model.employer.Course',
            'criterion.model.employer.course.Class',
            'criterion.store.employer.course.Classes',
            'criterion.view.person.course.EmployeeCourseAttachmentForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleRecordLoad : function(record) {
            let loadParam = record.phantom ? null : record.getId(),
                vm = this.getViewModel(),
                courseId = record.get('courseId'),
                courseClassId = record.get('courseClassId');

            if (!record.phantom) {
                criterion.model.employer.Course.loadWithPromise(courseId)
                    .then(employerCourse => {
                        vm.set('employerCourse', employerCourse);
                    });

                if (courseClassId)
                    criterion.model.employer.course.Class.loadWithPromise(courseClassId)
                        .then(employerCourseClass => {
                            vm.set('employerCourseClass', employerCourseClass);
                        });
            }

            this.lookup('customFieldsEmployeeCourse').getController().load(loadParam);

            this.callParent(arguments);
        },

        onAfterSave : function(view, record) {
            let attachmentForm = this.attachmentForm,
                attachmentFile = attachmentForm && attachmentForm.lookup('attachmentFile'),
                customFieldsEmployeeCourse = this.lookup('customFieldsEmployeeCourse'),
                recordId = record.getId(),
                promises = [];

            view.setLoading(true);

            promises.push(customFieldsEmployeeCourse.getController().save(recordId));

            if (attachmentFile && attachmentFile.isDirty()) {
                promises.push(criterion.Api.submitFormWithPromise({
                    url : Ext.String.format(API.EMPLOYEE_COURSE_ATTACHMENT_UPLOAD, record.getId()),
                    form : attachmentForm.getForm()
                }));
            }

            Ext.promise.Promise.all(promises)
                .then(() => {
                    this.superclass.onAfterSave.call(this, view, record);
                })
                .always(() => {
                    view.setLoading(false);
                });
        },

        onFailureSave : function(record, operation) {
            let response = operation.error.response,
                data = response && (Ext.decode(response.responseText, true) || response.responseText || response.responseJson);

            if (data.code === RESULT_CODES.EMPLOYEE_COURSE_MAX_ENROLLMENT_LIMIT_REACHED) {
                criterion.Msg.confirm(
                    i18n.gettext('Assign'),
                    i18n.gettext('The maximum enrollment for the course has been reached. Would you like to still add the course to the employee?'),
                    (btn) => {
                        if (btn === 'yes') {
                            record.set('waitList', true);
                            this.handleRecordUpdate(record);
                        }
                    }
                );
            } else if (data.code === RESULT_CODES.EMPLOYEE_CLASS_MAX_ENROLLMENT_LIMIT_REACHED) {
                criterion.Msg.confirm(
                    i18n.gettext('Register'),
                    i18n.gettext('The maximum enrollment for the class has been reached. Would you like to still add the class to the employee?'),
                    (btn) => {
                        if (btn === 'yes') {
                            record.set('waitList', true);
                            this.handleRecordUpdate(record);
                        }
                    }
                );
            }
        },

        onCourseSearch : function() {
            let vm = this.getViewModel(),
                record = vm.get('record'),
                coursePickerWindow = Ext.create('criterion.view.person.CoursePicker', {
                    isActive : true
                    // employerId : criterion.Api.getEmployerId() Courses from all employers must be shown. Pepper requirement
                });

            coursePickerWindow.on('select', employerCourse => {
                vm.set({
                    employerCourse : employerCourse,
                    employerCourseClass : null
                });

                record.set({
                    courseId : employerCourse.getId(),
                    courseClassId : null
                });
            });

            coursePickerWindow.on('close', () => {
                this.setCorrectMaskZIndex(false);
            });

            coursePickerWindow.show();

            this.setCorrectMaskZIndex(true);
        },

        onCourseCodeClear : function() {
            let vm = this.getViewModel();

            vm.set({
                employerCourse : null
            });
        },

        onCourseClassSearch : function() {
            let vm = this.getViewModel(),
                classes = Ext.create('criterion.store.employer.course.Classes'),
                picker;

            classes.getProxy().setExtraParams({
                courseId : vm.get('record.courseId'),
                isActive : true
            });

            picker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select Course Class'),
                searchFields : [],
                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        flex : 1,
                        dataIndex : 'name'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Location'),
                        flex : 1,
                        dataIndex : 'location'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Instructor'),
                        flex : 1,
                        dataIndex : 'instructorName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Date'),
                        flex : 1,
                        minWidth : 200,
                        dataIndex : 'courseDateTime'
                    }
                ],
                store : classes,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
                    }
                ],
                cls : 'criterion-modal'
            });

            picker.on('select', record => {
                vm.set('employerCourseClass', record);
                vm.get('record').set({
                    courseClassId : record.getId(),
                });
            });

            picker.on('destroy', () => {
                this.setCorrectMaskZIndex(false);
            });

            picker.show();

            this.setCorrectMaskZIndex(true);
        },

        handleAddEmployeeClassAttachment : function() {
            let vm = this.getViewModel(),
                attachmentForm;

            attachmentForm = this.attachmentForm = Ext.create('criterion.view.person.course.EmployeeCourseAttachmentForm', {
                viewModel : {
                    data : {
                        person : vm.get('person'),
                        record : vm.get('record')
                    }
                }
            });

            attachmentForm.show();
        }
    };
});
