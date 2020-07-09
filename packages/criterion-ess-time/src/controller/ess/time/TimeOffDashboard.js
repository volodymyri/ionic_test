Ext.define('criterion.controller.ess.time.TimeOffDashboard', function() {

    let SELF_SERVICE = criterion.consts.Route.SELF_SERVICE;

    return {

        extend : 'criterion.controller.employee.benefit.TimeOff',

        alias : 'controller.criterion_selfservice_time_time_off_dashboard',

        requires : [
            'criterion.store.employee.timeOff.AvailableTypes',
            'criterion.view.ess.time.timeOffDashboard.Options'
        ],

        suppressIdentity : ['employeeContext'],

        listen : {
            global : {
                requestTimeOff : 'handleRequestTimeOff'
            }
        },

        init : function() {
            let routes = {},
                me = this,
                vm = this.getViewModel();

            if (!this.getView().isTeamTimeOff) {
                routes[SELF_SERVICE.TIME_TIME_OFF_ADD] = 'handleAddClick';
                routes[SELF_SERVICE.TIME_TIME_OFF_DASHBOARD] = 'handleSwitchToGridView';

                this.setRoutes(routes);
            }

            this.handleAddClick = Ext.Function.createBuffered(this.handleAddClick, 500, this);

            this.callParent(arguments);

            vm.bind(
                {
                    bindTo : '{managerMode}',
                    deep : true
                },
                function(value) {
                    me.lookup('history').setManagerMode(value);
                    me.lookup('calendar').setManagerMode(value);
                }
            );
        },

        handleRequestTimeOff : function() {
            if (this.getView().isTeamTimeOff) {
                return;
            }
            this.redirectTo(SELF_SERVICE.TIME_TIME_OFF_ADD, null);
        },

        handleAddClick : function() {
            let vm = this.getViewModel(),
                history = this.lookup('history'),
                availableTimeOffType = vm.getStore('availableTimeOffType');

            availableTimeOffType.loadWithPromise({
                params : {
                    employeeId : vm.get('employeeId')
                }
            }).then(() => {
                if (!availableTimeOffType.getCount()) {
                    criterion.Msg.error(i18n.gettext('No eligible plans to request.'));
                } else {
                    history.getController().handleAddClick();
                }
            });
        },

        loadChildPages : function() {
            let me = this,
                vm = this.getViewModel(),
                timeOffTypeIds = [],
                availableTimeOffType = vm.getStore('availableTimeOffType');

            if (!vm.get('employeeId')) {
                return;
            }

            if (!availableTimeOffType.isLoaded() && !availableTimeOffType.isLoading()) {
                availableTimeOffType.loadWithPromise({
                    params : {
                        employeeId : vm.get('employeeId')
                    }
                }).then(function() {
                    timeOffTypeIds = Ext.Array.map(availableTimeOffType.getRange(), function(record) {
                        return record.getId();
                    });
                    vm.set('timeOffTypeIds', timeOffTypeIds);
                    me.lookup('calendar').setFilterTimeOffTypeIds(timeOffTypeIds);
                    me._loadChildPages();
                });
            } else {
                me._loadChildPages();
            }
        },

        _loadChildPages : function() {
            let me = this,
                vm = this.getViewModel(),
                activeViewIdx;

            activeViewIdx = vm.get('activeViewIdx');

            if (!vm.get('managerMode')) {
                vm.set('employeeId', criterion.Api.getEmployeeId());
            }

            if (activeViewIdx === 0) {
                me.lookup('history').getController().load();
                me.lookup('charts').getController().load();
            } else if (activeViewIdx === 1) {
                me.lookup('calendar').getController().load();
            }
        },

        handleReturnToTeamDashboard : function() {
            this.getView().fireEvent('returnToTeamDashboard');
        },

        handleTimeOffEmployeeChange : function(cmp, employeeId, oldEmployeeId) {
            let vm = this.getViewModel(),
                rec = cmp.getSelection();

            if (employeeId !== oldEmployeeId && employeeId) {
                vm.set({
                    employeeId : employeeId,
                    timezoneCd : rec.get('timezoneCd'),
                    timezoneDescription : rec.get('timezoneDescription')
                });

                this.loadChildPages();
            }
        },

        handleDateSelect : function(cmp, value) {
            this.getViewModel().set('date', value);
            this.lookup('charts').fireEvent('changedate', value)
        },

        showPlanned : function() {
            this.lookup('history').fireEvent('showplanned');
        },

        showTaken : function() {
            this.lookup('history').fireEvent('showtaken');
        },

        onYearPrev : function() {
            this.lookup('history').fireEvent('yearprev');
        },

        onYearNext : function() {
            this.lookup('history').fireEvent('yearnext');
        },

        handleRefreshClick : function() {
            this.loadChildPages();
        },

        handleOptions : function() {
            let me = this,
                vm = this.getViewModel(),
                availableTimeOffType = vm.getStore('availableTimeOffType'),
                calendar = me.lookup('calendar'),
                timeOffTypeIds = vm.get('timeOffTypeIds'),
                dialog;

            if (timeOffTypeIds == null) {
                timeOffTypeIds = Ext.Array.map(availableTimeOffType.getRange(), function(record) {
                    return record.getId();
                });
            }

            dialog = Ext.widget('criterion_selfservice_time_time_off_dashboard_options', {
                viewModel : {
                    data : {
                        timeOffTypeIds : timeOffTypeIds
                    },
                    stores : {
                        timeOffTypes : availableTimeOffType
                    }
                }
            });

            dialog.on({
                cancel : function() {
                    dialog.destroy();
                },

                applyOptions : function(data) {
                    vm.set('timeOffTypeIds', data.timeOffTypeIds);
                    calendar.setFilterTimeOffTypeIds(data.timeOffTypeIds);
                    dialog.destroy();
                }
            });

            dialog.show();
        },

        switchToTaken() {
            let showTakenButton = this.lookup('showTakenButton');

            showTakenButton && showTakenButton.setPressed(true);
        },

        switchToPlanned() {
            let showPlannedButton = this.lookup('showPlannedButton');

            showPlannedButton && showPlannedButton.setPressed(true);
        },

        setOpacityEditorShow() {
            this.getView().setStyle('opacity', 0);
        },

        setOpacityEditorDestroy() {
            this.getView().setStyle('opacity', 1);
        }
    };
});
