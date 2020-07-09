Ext.define('criterion.controller.ess.time.attendanceDashboard.Exception', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_time_attendance_dashboard_exception',

        handleShow : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                workPeriodExceptions = vm.getStore('workPeriodExceptions'),
                globalException = vm.get('globalException'),
                params = {
                    date : Ext.Date.format(vm.get('date'), 'Y.m.d')
                };

            if (globalException) {
                params['employeeGroupIds'] = vm.get('employeeGroupIds').join(',');
            } else {
                params['employeeId'] = vm.get('employeeId');
            }

            workPeriodExceptions.loadWithPromise({
                params : params
            }).then(this.afterLoadData, null, null, this);

            view.el.down('.trigger').on('click', function() {
                vm.set('openState', !vm.get('openState'));
            });

            vm.bind('{openState}', function() {
                // time for relayout
                Ext.defer(function() {
                    view.el.center();
                }, 100);
            });
        },

        afterLoadData : function(data) {
            var vm = this.getViewModel(),
                globalException = vm.get('globalException'),
                first;

            if (!globalException && data.length) {
                first = data[0];

                vm.set({
                    outAllDay : first.get('isRemoved'),
                    start : first.get('scheduledStart'),
                    end : first.get('scheduledEnd')
                });
            }
        },

        handleDelete : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                globalException = vm.get('globalException');

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete exception'),
                    message : i18n.gettext('Do you want to delete the exception?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.EMPLOYEE_ATTENDANCE_WORK_PERIOD_EXCEPTION + '?' + (
                                globalException ?
                                    'employeeGroupIds=' + vm.get('employeeGroupIds').join(',')
                                    :
                                    'employeeId=' + vm.get('employeeId')
                            ) + '&date=' + Ext.Date.format(vm.get('date'), criterion.consts.Api.DATE_FORMAT),
                            method : 'DELETE'
                        }).then(function() {
                            view.fireEvent('afterModified');
                        }, function() {
                            criterion.Utils.toast(i18n.gettext('Something went wrong'));
                        });
                    }
                }
            );
        },

        handleCancel : function() {
            this.getView().fireEvent('cancel')
        },

        checkPresentExceptions : function() {
            var vm = this.getViewModel(),
                workPeriodExceptions = vm.getStore('workPeriodExceptions'),
                hasExceptions = false;

            workPeriodExceptions.each(function(workPeriodException) {
                if (
                    workPeriodException.get('scheduledStart')
                    ||
                    workPeriodException.get('scheduledEnd')
                    ||
                    workPeriodException.get('isRemoved')
                ) {
                    hasExceptions = true;
                }
            });

            return hasExceptions;
        },

        handleSave : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                globalException = vm.get('globalException'),
                dfd = Ext.create('Ext.promise.Deferred');

            if (!view.isValid()) {
                return;
            }

            if (globalException && this.checkPresentExceptions()) {
                criterion.Msg.confirm(
                    i18n.gettext('Attention'),
                    i18n.gettext('These changes will over-ride exceptions for individual employees.<br />These changes cannot be undone. Proceed?'),
                    function(btn) {
                        if (btn === 'yes') {
                            dfd.resolve();
                        }
                    }
                );
            } else {
                dfd.resolve();
            }

            dfd.promise.then(
                function() {
                    var outAllDay = vm.get('outAllDay');

                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYEE_ATTENDANCE_WORK_PERIOD_EXCEPTION + '?' + (
                            globalException ?
                                'employeeGroupIds=' + vm.get('employeeGroupIds').join(',')
                                :
                                'employeeId=' + vm.get('employeeId')
                        ),
                        method : 'POST',
                        jsonData : {
                            date : Ext.Date.format(vm.get('date'), criterion.consts.Api.DATE_FORMAT),
                            scheduledStart : !outAllDay ? Ext.Date.format(vm.get('start'), criterion.consts.Api.TIME_FORMAT) : null,
                            scheduledEnd : !outAllDay ? Ext.Date.format(vm.get('end'), criterion.consts.Api.TIME_FORMAT) : null,
                            isRemoved : outAllDay
                        }
                    }).then(function() {
                        view.fireEvent('afterModified');
                    }, function() {
                        criterion.Utils.toast(i18n.gettext('Something went wrong'));
                    });
                }
            );
        }

    }
});
