Ext.define('criterion.controller.ess.learning.Assign', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_learning_assign',

        handleShow : function() {
            var vm = this.getViewModel();

            if (vm.get('activeViewIdx') === 0) {
                this.lookup('courseGrid').handleSearchClick();
            }
        },

        handleAssign : function(record) {
            var view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_ENROLL_COURSE, record.getId())
            }).then(function() {
                view.setLoading(false);
                view.close();
            });
        },

        handleRegister : function(record) {
            var view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_ENROLL_COURSE_CLASS, record.getId())
            }).then(function() {
                view.setLoading(false);
                view.close();
            });
        },

        handleSelectClass : function(record) {
            this.selectCourse(record.getId());
        },

        selectCourse : function(courseId) {
            var vm = this.getViewModel();

            this.lookup('classGrid').getStore().getProxy().setExtraParam('courseId', courseId);
            vm.set({
                activeViewIdx : 1,
                title : i18n.gettext('Employee Assign') + ' -> ' + i18n.gettext('Select a Class')
            });
        },

        handleBack : function() {
            var vm = this.getViewModel();

            vm.set({
                activeViewIdx : 0,
                title : i18n.gettext('Employee Assign')
            });
        }
    }
});
