Ext.define('criterion.controller.employee.Timesheets', function() {

    return {

        alias : 'controller.criterion_employee_timesheets',

        extend : 'criterion.controller.employee.GridView',

        requires : [
            'criterion.view.employee.timesheet.Vertical',
            'criterion.view.employee.timesheet.Horizontal',
            'criterion.view.employee.timesheet.Aggregate'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        baseRoute : criterion.consts.Route.SELF_SERVICE.TIME_TIMESHEETS,

        loadRecordOnEdit : false, // handled by editor

        reloadAfterEditorSave : true,

        editor : {
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        },

        load : function(opts = {}) {
            let vm = this.getViewModel(),
                store = this.getView().getStore(),
                dfd = Ext.create('Ext.Deferred');

            this.callParent([opts]).then(() => {
                let isManualDay = store.find('isManualDay', true, 0, false, false, true) !== -1;

                vm.set('hideHours', isManualDay);

                dfd.resolve();
            }, () => {
                dfd.reject();
            });

            return dfd.promise;
        },

        handleAddClick : function() {
            this.add();
        },

        handleCreatePriorTimesheet : function() {
            this.add(true);
        },

        handleGridRoute : function(id) {
            this._managerMode = false;

            if (/-manager$/.test(id)) {
                this._managerMode = true;
                id = id.replace('-manager', '');

                criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS);

                this.routeHandler(parseInt(id, 10));
            } else {
                this.callParent([id]);
            }
        },

        routeHandler : function(id) {
            let store = this.getView().getStore(),
                view = this.getView(),
                me = this;

            if (store.getById(id)) {
                this.edit(store.getById(id));
            } else if (id === 'current') {
                let currentTs = store.findRecord('isCurrent', true);

                if (currentTs) {
                    this.edit(currentTs);
                } else {
                    criterion.Msg.info(i18n.gettext('Timesheet for the current date doesn\'t exist.'))
                }
            } else {
                let timesheet = Ext.create('criterion.model.employee.Timesheet', {
                    id : parseInt(id, 10)
                });

                view.setLoading(true);

                timesheet.loadWithPromise({
                    params : {
                        light : true
                    }
                }).then(() => {
                    me.edit(timesheet);
                }).always(() => {
                    view.setLoading(false);
                });
            }
        },

        add : function(isPrior) {
            let view = this.getView(),
                offset = new Date().getTimezoneOffset(),
                employeeId = this.getEmployeeId() || this.getViewModel().get('employeeId');

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET,
                method : 'POST',
                urlParams : {
                    employeeId : employeeId, // initiator
                    isNext : !isPrior,
                    timezoneOffset : offset
                },
                jsonData : {
                    employeeId : employeeId // target
                }
            }).then({
                scope : this,
                success : function(result) {
                    let store = view.getStore(),
                        recs;

                    recs = store.insert(!isPrior ? 0 : store.getCount(), result);
                    this.edit(recs[0]);
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        createEditor : function(editorCfg, record) {
            let editor,
                me = this,
                formatCode = record.get('formatCode');

            editor = Ext.apply({
                xtype : function() {
                    switch (formatCode) {
                        case criterion.Consts.TIMESHEET_FORMAT.VERTICAL:
                            return 'criterion_employee_timesheet_vertical';
                        case criterion.Consts.TIMESHEET_FORMAT.HORIZONTAL:
                            return 'criterion_employee_timesheet_horizontal';
                        case criterion.Consts.TIMESHEET_FORMAT.AGGREGATE:
                            return 'criterion_employee_timesheet_aggregate';
                        default :
                            throw new Error('Unsupported Timesheet Type: ' + formatCode);
                    }
                }(),

                viewModel : {
                    data : {
                        timesheetRecord : record,
                        timesheetId : record.getId(),
                        managerMode : me._managerMode
                    }
                },

                listeners : {
                    close : function() {
                        if (me._managerMode) {
                            Ext.defer(() => {
                                me.redirectTo(criterion.consts.Route.SELF_SERVICE.TIME_TIMESHEET_DASHBOARD, null);
                            }, 1);
                        }
                    },
                    editorCancel : function() {
                        // reload data because it can be changed by start/stop timer
                        me.load();
                    }
                }

            }, editorCfg || {});

            return this.callParent([editor, record]);
        }

    };

});
