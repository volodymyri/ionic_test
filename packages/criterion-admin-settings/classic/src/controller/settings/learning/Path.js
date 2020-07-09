Ext.define('criterion.controller.settings.learning.Path', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_learning_path',

        handleRecordLoad : function(record) {
            var me = this,
                vm = me.getViewModel(),
                allCourses = vm.getStore('allCourses'),
                employeeGroupCombo = me.lookupReference('employeeGroupCombo');

            if (!allCourses.isLoaded() && !allCourses.isLoading()) {
                allCourses.load({
                    params : {
                        employerId : criterion.Api.getEmployerId(),
                        isActive : true
                    },
                    callback : function() {
                        if (!record.phantom) {
                            employeeGroupCombo.loadValuesForRecord(record);
                            me.loadCourses();
                        }
                    }
                });
            } else if (!record.phantom) {
                employeeGroupCombo.loadValuesForRecord(record);
                me.loadCourses();
            }

            employeeGroupCombo.applyEmployerFilter(record.get('employerId'));
        },

        loadCourses : function() {
            var me = this,
                view = me.getView(),
                learningPathCourses = me.lookup('courseGrid').getStore(),
                record = me.getRecord();

            view.setLoading(true);
            learningPathCourses.load({
                params : {
                    learningPathId : record.getId()
                },
                callback : function() {
                    view.setLoading(false);
                }
            });
        },

        onAfterSave : function(view, record) {
            var me = this,
                learningPathCourses = me.lookup('courseGrid').getStore(),
                learningPathId = record.getId();

            learningPathCourses.each(function(course) {
                course.set('learningPathId', learningPathId);
            });

            Ext.Promise
                .all([
                    learningPathCourses.syncWithPromise(),
                    me.lookupReference('employeeGroupCombo').saveValuesForRecord(record)
                ]).then(function() {
                view.fireEvent('afterSave', view, record);
                me.close();
            });
        }
    };
});
