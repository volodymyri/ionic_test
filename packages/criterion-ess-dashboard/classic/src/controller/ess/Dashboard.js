Ext.define('criterion.controller.ess.Dashboard', function() {

    return {

        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_dashboard',

        requires : [
            'criterion.model.dashboard.InfoBox'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        listen : {
            global : {
                changeHideWorkflowState : 'onChangeHideWorkflowState',
                reloadWorkflowStore : 'onReloadWorkflowStore'
            }
        },

        load : function() {
            Ext.GlobalEvents.fireEvent('reloadWorkflowStore');
        },

        handleRoute : Ext.emptyFn,

        onEmployeeChange : function() {
            this.load();
        },

        onReloadWorkflowStore : function() {
            this.loadWidgetsData();
        },

        loadWidgetsData : function() {
            let vm = this.getViewModel(),
                attendanceStore = vm.getStore('attendanceStore'),
                eventsStore = vm.getStore('eventsStore'),
                today = new Date(),
                year = today.getFullYear(),
                month = today.getMonth(),
                attendanceDays = [];

            this.updateTitle();

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.DASHBOARD_WIDGETS,
                method : 'GET'
            }).then(function(data) {
                vm.set('widgets', data ? data.widgets : null);
            });

            Ext.promise.Promise.all([
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.DASHBOARD_ATTENDANCE,
                    method : 'GET'
                }),
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.DASHBOARD_UPCOMING_TIMEOFF,
                    method : 'GET'
                }),
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.DASHBOARD_LAST_NEXT_PAYDATE,
                    method : 'GET'
                }),
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.DASHBOARD_UPCOMING_EVENTS,
                    method : 'GET'
                }),
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.DASHBOARD_INFOBOX,
                    method : 'GET'
                })
            ]).then(function(response) {
                var attendance = response[0],
                    timeOff = response[1],
                    myPay = response[2],
                    upcomingEvents = response[3],
                    infoBox = response[4];

                Ext.Array.each(Ext.Date.dayNames, function(dayName) {
                    attendanceDays.push({
                        dateValue : dayName.charAt(0).toUpperCase(),
                        isDayName : true
                    });
                });

                for (var i = 0; i < Ext.Date.getFirstDayOfMonth(today); i++) {
                    attendanceDays.push({
                        dateValue : '',
                        isDayName : true
                    })
                }

                for (var day = 1; day <= Ext.Date.getDaysInMonth(today); day++) {
                    var attendanceData = Ext.Array.findBy(attendance, function(dayData) {
                        return Ext.Date.parse(dayData['date'], criterion.consts.Api.DATE_FORMAT).getDate().toString() === day.toString();
                    });

                    attendanceDays.push({
                        dateValue : day.toString(),
                        hoursValue : attendanceData ? Ext.String.format('{0}{1}', (attendanceData['minutes'] / 60).toFixed(1), i18n.gettext('h')) : null,
                        hasHours : !!attendanceData,
                        isWeekend : Ext.Date.isWeekend(new Date(year, month, day))
                    });
                }

                Ext.Array.each(attendanceDays, function(attendanceDay, index) {
                    if (index > 0 && index % 7 === 0) {
                        attendanceDay['endOfWeek'] = true;
                    }
                });

                attendanceStore.removeAll();

                attendanceStore.add(attendanceDays);

                eventsStore.removeAll();

                eventsStore.add(upcomingEvents);

                if (timeOff) {
                    if (timeOff['startDate']) {
                        timeOff['startDate'] = Ext.Date.parse(timeOff['startDate'], criterion.consts.Api.RAW_DATE_TIME_FORMAT);
                    }
                    if (timeOff['endDate']) {
                        timeOff['endDate'] = Ext.Date.parse(timeOff['endDate'], criterion.consts.Api.RAW_DATE_TIME_FORMAT);
                    }
                }

                vm.set({
                    upcomingTimeOff : (!timeOff || Ext.Object.isEmpty(timeOff)) ? null : timeOff,
                    myPay : !Ext.Object.isEmpty(myPay) ? {
                        lastPayDate : myPay['lastPay'] && myPay['lastPay']['date'] ? Ext.Date.format(Ext.Date.parse(myPay['lastPay']['date'], criterion.consts.Api.DATE_FORMAT), criterion.consts.Api.SHOW_DATE_FORMAT) : '...',
                        lastPayNet : myPay['lastPay'] && myPay['lastPay']['net'] || '...',
                        nextPayDate : myPay['nextPayDate'] ? Ext.Date.format(Ext.Date.parse(myPay['nextPayDate'], criterion.consts.Api.DATE_FORMAT), criterion.consts.Api.SHOW_DATE_FORMAT) : '...'
                    } : null,
                    infoBox : (!infoBox || Ext.Object.isEmpty(infoBox)) ? null : criterion.model.dashboard.InfoBox.loadData(infoBox)
                });

                vm.notify();
            });
        },

        init : function() {
            var me = this;

            this.onReloadWorkflowStore = Ext.Function.createDelayed(this.onReloadWorkflowStore, 500, this, null, null);

            me.updateTitle();
            me.getViewModel().bind('{fullPageMode}', me.onFullPageMode, me);

            me.callParent(arguments);
        },

        updateTitle : function() {
            var person = criterion.Api.getCurrentPerson(),
                employer = criterion.Application.getEmployer(),
                personName = person && Ext.util.Format.format('{0} {1}', person.firstName, person.lastName),
                employerName = employer && employer.get('legalName'),
                title = i18n.gettext('Self Service');

            if (personName) {
                title = personName + ' - ' + title;
            }

            if (employerName) {
                title = title + ' - ' + employerName;
            }

            document.title = title; // Employee Name - Self Service - Employer Name
        },

        onChangeHideWorkflowState : function(hideWorkflow) {
            this.getViewModel().set('hidePostMessage', !hideWorkflow);
        },

        onSelfserviceDashboardLeftPanelBoxReady : function() {
            Ext.GlobalEvents.fireEvent('profileWidgetReady');
        },

        onFullPageMode : function(fullPageMode) {
            var body = Ext.getBody();

            body.toggleCls('full-page-mode', fullPageMode);
            Ext.platformTags[criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.FULL_PAGE_MODE] = fullPageMode;
            Ext.mixin.Responsive.notify();
        }
    };
});
