Ext.define('criterion.controller.scheduling.AssignmentForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_scheduling_assignment_form',

        onShow() {
            this.load();
        },

        load() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            vm.getStore('startData').loadWithPromise({
                params : {
                    employerId : vm.get('record.employerId')
                }
            }).always(function() {
                view.setLoading(false);

                view.fireEvent('afterLoad');
            })
        },

        handleCancel() {
            this.getView().destroy();
        },

        handleAddShiftAssignment() {
            let me = this,
                view = this.getView(),
                record = this.getViewModel().get('record'),
                startDate = record && record.get('startDate'),
                dates = this.getViewModel().get('shiftGroup.dates'),
                validStartDate = dates && dates.min('date');

            if (view.isValid()) {
                if (startDate && dates && (startDate !== validStartDate)) {
                    criterion.Msg.confirm(
                        i18n.gettext('Warning'),
                        Ext.String.format(
                            i18n.gettext('The last shift for this group is on {0}. By creating a shift starting on {1}, you will create a gap. Are you sure you want to proceed?'),
                            Ext.Date.format(validStartDate, criterion.consts.Api.SHOW_DATE_FORMAT),
                            Ext.Date.format(startDate, criterion.consts.Api.SHOW_DATE_FORMAT)
                        ),
                        function(btn) {
                            if (btn === 'yes') {
                                me.addAssignment(record).then(recordId => {
                                    me.fireEvent('added', recordId);
                                });
                            }
                        }
                    )
                } else {
                    me.addAssignment(record).then(recordId => {
                        view.fireEvent('added', recordId);
                    });
                }
            }
        },

        addAssignment(record) {
            let urlParams = {
                    shiftGroupId : record.get('shiftGroupId'),
                    startDate : Ext.Date.format(record.get('startDate'), criterion.consts.Api.DATE_FORMAT),
                    actionId : record.get('actionType')
                },
                previousShiftId = record.get('previousShiftId');

            return criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE,
                method : 'POST',
                urlParams : previousShiftId ? Ext.apply(urlParams, {
                    previousShiftId : previousShiftId
                }) : urlParams
            });
        }
    }
});
