Ext.define('ess.controller.Learning', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_learning',

        init : function() {
            this.handleSearchCourse = Ext.Function.createBuffered(this.handleSearchCourse, 500, this);
            this.callParent(arguments);
        },

        onActivate : function() {
            this.handleBackToActiveCourses();
        },

        handleActivate : Ext.emptyFn,

        loadActiveCourses : function() {
            var vm = this.getViewModel();

            vm.getStore('active').loadWithPromise();
        },

        handleBackToActiveCourses : function() {
            var view = this.getView();

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );
            view.setActiveItem(this.lookup('courseGrid'));
            this.loadActiveCourses();
        },

        handleEditAction : function(v, num, row, record) {
            var view = this.getView(),
                form = this.lookup('learningCourseForm');

            form.getViewModel().set('record', record);
            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );
            view.setActiveItem(form);
        },

        handleShowCourseFrame : function(url, title) {
            var view = this.getView(),
                frame = this.lookup('iframeContainer');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            frame.getViewModel().set({
                url : url,
                title : title
            });
            view.setActiveItem(frame);
        },

        handleAddCourse : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                enrollGrid = this.lookup('courseForEnrollGrid');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );
            view.setActiveItem(enrollGrid);
            vm.getStore('courseForEnroll').loadWithPromise();
        },

        handleEnrollCourse : function(courseId) {
            var me = this;

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_ENROLL_COURSE, courseId)
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Successfully'));
                me.handleBackToActiveCourses();
            });
        },

        handleSwitchToEnrollCourseForm : function(grid, index, cell, record) {
            var view = this.getView(),
                form = this.lookup('learningCourseFormForEnroll');

            form.getViewModel().set('record', record);
            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );
            view.setActiveItem(form);
        },

        handleBackToEnrollCourses : function() {
            var view = this.getView(),
                enrollGrid = this.lookup('courseForEnrollGrid');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );
            view.setActiveItem(enrollGrid);
        },

        handleSelectCourseClass : function(courseId) {
            var view = this.getView(),
                grid = this.lookup('courseClassesForEnrollGrid');

            grid.getViewModel().set('courseId', courseId);
            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );
            view.setActiveItem(grid);
        },

        handleBackToEmployeeAssign : function() {
            var view = this.getView(),
                form = this.lookup('learningCourseFormForEnroll');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );
            view.setActiveItem(form);
        },

        handleSwitchToEnrollCourseClassForm : function(grid, index, cell, record) {
            var view = this.getView(),
                form = this.lookup('learningCourseClassFormForEnroll');

            form.getViewModel().set('record', record);
            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );
            view.setActiveItem(form);
        },

        handleBackToCourseClassSelect : function() {
            var view = this.getView(),
                grid = this.lookup('courseClassesForEnrollGrid');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );
            view.setActiveItem(grid);
        },

        handleEnrollClass : function(classId) {
            var me = this;

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_ENROLL_COURSE_CLASS, classId)
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Successfully'));
                me.handleBackToActiveCourses();
            });
        }
    };
});
