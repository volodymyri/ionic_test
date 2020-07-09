Ext.define('criterion.controller.employee.PositionsView', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_positions_view',

        handleLeftPositionSwitch : function() {
            var vm = this.getViewModel();

            vm.set('currentIndex', vm.get('currentIndex') - 1);
            vm.notify();

            this.load();
        },

        handleRightPositionSwitch : function() {
            var vm = this.getViewModel();

            vm.set('currentIndex', vm.get('currentIndex') + 1);
            vm.notify();

            this.load();
        },

        load : function() {
            var me = this,
                vm = this.getViewModel(),
                currentAssignmentDetail = vm.get('currentPosition'),
                assignment = Ext.create('criterion.model.Assignment', {id : currentAssignmentDetail.get('assignmentId')}),
                positionForm = this.lookupReference('positionView'),
                employer = vm.get('employer');

            // little delay for prevent reset by default criterion_employee_position behaviour
            Ext.defer(function() {
                positionForm.getViewModel().set({
                        employerId : employer.getId(),
                        employee : vm.get('employee'),
                        isPositionControl : employer && employer.get('isPositionControl'),
                        showPositionReporting : employer && employer.get('isPositionWorkflow')
                    }
                );

                positionForm.setActiveDetailId(currentAssignmentDetail.getId());

                positionForm.on('assignmentLoaded', me.onAssignmentLoaded, me);
                positionForm.getController().load(assignment);
            }, 100)
        },

        onAssignmentLoaded : function(assignment) {
            var vm = this.getViewModel(),
                currentAssignmentDetail = vm.get('currentPosition'),
                detail = assignment.assignmentDetails().getById(currentAssignmentDetail.getId());

            vm.set({
                _assignmentDetail : detail,
                isDeletable : (detail ? detail.get('isDeletable') : false)
            });
        },

        handleCancelClick : function() {
            var view = this.getView();

            if (arguments.length === 1 && Ext.isBoolean(arguments[0])) {
                view._preventReRoute = arguments[0]
            }

            view.close();
        },

        handleDeleteDetail : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                assignmentDetail = vm.get('_assignmentDetail');

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete'),
                    message : i18n.gettext('Do you want to delete this record?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        if (assignmentDetail && assignmentDetail.store) {
                            assignmentDetail.store.remove(assignmentDetail);
                            assignmentDetail.store.sync({
                                success : function() {
                                    view.fireEvent('afterDeleteAssignmentDetail');
                                    view.close();
                                }
                            })
                        }
                    }
                }
            );
        }
    };
});

