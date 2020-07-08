/**
 * Main application controller
 */
Ext.define('ess.Application', function() {

    let ROUTES = criterion.consts.Route,
        timezoneRecord,
        timezoneCd,
        isHiringManager;

    return {
        name : 'ess',

        extend : 'criterion.Application',

        requires : [
            'ess.view.Main',
            'criterion.ThemeManager',
            'criterion.store.employee.Calendars',
            'criterion.store.workflowLogs.PendingLogs',
            'criterion.store.employer.WorkLocations',
            'Ext.Responsive'
        ],

        defaultToken : ROUTES.SELF_SERVICE.DASHBOARD,

        mainView : 'ess.view.Main',

        init : function() {
            let me = this,
                employeeCalendars = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.ESS_EMPLOYEE_CALENDARS),
                workflowLogPendingLogs = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS),
                employerLocations = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.ESS_USER_WIDGET_EMPLOYER_LOCATIONS);

            me.callParent(arguments);

            Ext.on('employeeChanged', function(employee) {
                let employeeId = employee.getId();

                isHiringManager = employee.get('isHiringManager');

                criterion.Utils.fieldsLocalCache = new Ext.util.LocalStorage({
                    id : 'fieldsLocalCache-' + employeeId
                });

                criterion.Utils.fieldsLocalCacheHolder = new Ext.util.LocalStorage({
                    id : 'fieldsLocalCacheHolder-' + employeeId
                });

                if (!Ext.isModern) {
                    workflowLogPendingLogs.load({
                        params : {
                            employeeId : employeeId,
                            withoutDetails : true
                        }
                    });

                    employeeCalendars.on({
                        load : () => {
                            Ext.GlobalEvents.fireEvent('employeeCalendarsLoaded');
                        }
                    });

                    employeeCalendars.loadWithPromise({
                        params : {
                            employeeId : employeeId
                        }
                    });
                }

                Ext.promise.Promise.all([
                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.PERSON_ADDRESS,
                        method : 'GET',
                        params : {
                            personId : criterion.Api.getCurrentPersonId(),
                            isPrimary : true
                        }
                    }),
                    employerLocations.loadWithPromise({
                        params : {
                            employerId : employee.get('employerId')
                        }
                    }),
                    criterion.CodeDataManager.load([criterion.consts.Dict.ENTITY_TYPE])
                ]).then({
                    success : function() {
                        let positionEmployerLocationId,
                            employerLocation,
                            timezoneCdDefaultRecord = criterion.CodeDataManager.getCodeDetailRecord('id', criterion.Utils.getCurrentTimezoneCode(), criterion.consts.Dict.TIME_ZONE),
                            employeeWorkLocation = employee.getEmployeeWorkLocation();

                        if (!Ext.isModern) {
                            Ext.GlobalEvents.fireEvent('workflowLogPendingLogsLoaded');
                        }

                        // employee_work_location.employer_work_location_id where employee_work_location.is_primary = TRUE > employer_work_location.work_location_id > work_location.timezone_cd

                        if (Ext.GlobalEvents.fireEvent('updateProfileWidget', employerLocations, arguments[0])) {
                            Ext.GlobalEvents.on('profileWidgetReady', function() {
                                Ext.GlobalEvents.fireEvent('updateProfileWidget', employerLocations, arguments[0]);
                            });
                        }
                        positionEmployerLocationId = employeeWorkLocation ? employeeWorkLocation.get('employerWorkLocationId') : null;
                        if (positionEmployerLocationId) {
                            employerLocation = employerLocations.getById(positionEmployerLocationId);
                            if (employerLocation) {
                                timezoneCd = employerLocation.getWorkLocation().get('timezoneCd')
                            }
                        }
                        timezoneCd = timezoneCd || (timezoneCdDefaultRecord ? timezoneCdDefaultRecord.getId() : null);

                        timezoneRecord = criterion.CodeDataManager.getCodeDetailRecord('id', timezoneCd, criterion.consts.Dict.TIME_ZONE);
                        Ext.GlobalEvents.fireEvent('employeeTimezone', timezoneCd, timezoneRecord);
                    }
                });
            });

            criterion.Utils.applyThemeStyle();
        },

        initIdentity : function() {
            let employee,
                employees = this.getEmployeesStore(),
                employers = this.getEmployersStore(),
                employerId = criterion.Utils.getCookie(criterion.Consts.COOKIE.CURRENT_EMPLOYER_ID),
                employeeId = criterion.Utils.getCookie(criterion.Consts.COOKIE.CURRENT_EMPLOYEE_ID);

            if (employerId && employeeId && employers.getById(employerId) && employees.getById(employeeId)) {
                criterion.Application.setEmployer(employerId, true);
                criterion.Application.setEmployee(employeeId);
            } else {
                employee = this.getDefaultEmployee();

                criterion.Application.setEmployee(employee.getId());
                criterion.Application.setEmployer(employee.get('employerId'), true);
            }
        },

        statics : {
            getEmployeeTimezoneRecord : function() {
                return timezoneRecord;
            },

            getEmployeeTimezoneCd : function() {
                return timezoneCd;
            },

            isEmployeeHiringManager : function() {
                return isHiringManager;
            }
        }

    };

});
