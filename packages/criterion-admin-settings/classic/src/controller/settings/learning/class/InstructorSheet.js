Ext.define('criterion.controller.settings.learning.class.InstructorSheet', function() {

    var COURSE_CLASS_ACTIONS = criterion.Consts.COURSE_CLASS_ACTIONS;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_learning_class_instructor_sheet',

        handleShow : function() {
            var vm = this.getViewModel(),
                courseClassAttendees = vm.getStore('courseClassAttendees');

            courseClassAttendees.getProxy().setUrl(criterion.consts.Api.API.EMPLOYER_COURSE_CLASS_ATTENDEES + '/' + vm.get('classId'));
            courseClassAttendees.loadWithPromise();
        },

        handleCancel : function() {
            this.getView().close();
        },

        handleAct : function() {
            var view = this.getView(),
                form = this.lookup('form'),
                vm = this.getViewModel(),
                actionType = vm.get('actionType'),
                data = {
                    action : actionType,
                    courseIds : vm.get('courseIds')
                };

            if (form.isValid()) {
                switch (actionType) {
                    case COURSE_CLASS_ACTIONS.SET_COMPLETE_STATUS:
                        data['value'] = this.lookup('setCompleteStatusField').getValue();
                        break;

                    case COURSE_CLASS_ACTIONS.SET_SUCCESS_STATUS:
                        data['value'] = this.lookup('setSuccessStatusField').getValue();
                        break;

                    case COURSE_CLASS_ACTIONS.SET_SCORE:
                        data['value'] = this.lookup('setScoreField').getValue();
                        break;
                }

                view.setLoading(true);
                criterion.Api.requestWithPromise({
                    method : 'POST',
                    url : criterion.consts.Api.API.EMPLOYER_COURSE_CLASS_APPLY_ACTIONS,
                    jsonData : data
                }).then(function() {
                    view.setLoading(false);
                    view.close();
                }, function() {
                    view.setLoading(false);
                });
            }
        },

        handleSelectionChange : function(grid, selections) {
            this.getViewModel().set({
                selectionCount : selections.length,
                courseIds : Ext.Array.map(selections, function(rec) {
                    return rec.getId()
                })
            });
        }
    };
});
