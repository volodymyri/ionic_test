Ext.define('criterion.controller.settings.learning.Certification', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_learning_certification',

        handleRecordLoad : function(record) {
            var me = this,
                vm = this.getViewModel(),
                allCourses = vm.getStore('allCourses');

            if (!allCourses.isLoaded()) {
                allCourses.load({
                    params : {
                        employerId : criterion.Api.getEmployerId()
                    },
                    callback : function () {
                        if (!record.phantom) {
                            me.loadCourses();
                        }
                    }
                });
            } else if (!record.phantom) {
                me.loadCourses();
            }
        },

        loadCourses : function() {
            var view = this.getView(),
                certificationCourses = this.lookup('courseGrid').getStore();

            view.setLoading(true);

            certificationCourses.getProxy().setExtraParams({
                certificationId : this.getRecord().getId()
            });

            certificationCourses.load({
                callback : function() {
                    view.setLoading(false);
                }
            });
        },

        onAfterSave : function (view, record) {
            var me = this,
                certificationCourses = this.lookup('courseGrid').getStore(),
                certificationId = record.getId();

            certificationCourses.each(function (course) {
                course.set('certificationId', certificationId);
            });

            certificationCourses.syncWithPromise().then(function() {
                view.fireEvent('afterSave', view, record);
                me.close();
            });
        }
    };
});
