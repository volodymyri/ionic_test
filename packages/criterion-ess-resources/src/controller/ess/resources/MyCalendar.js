Ext.define('criterion.controller.ess.resources.MyCalendar', function() {

    return {

        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_resources_my_calendar',

        holidayCls : 'ext-cal-day-holiday',

        init : function() {
            this.callParent(arguments);

            var calendarPanel = this.lookupReference('calendarPanel');

            calendarPanel.on('viewchange', function(a, b, info) {
                this.lookupReference('currentDate').setHtml(Ext.Date.monthNames[info.activeDate.getMonth()] + ' ' + info.activeDate.getFullYear());
            }, this);

            this.loadData();
        },

        loadData : function() {
            var component = this.lookupReference('calendarPanel'),
                record = this.getView().record;

            if (component) {
                component.eventStore.loadData(this.getPreparedData(record));
            }
        },

        getPreparedData : function(calendar) {
            var data = [];

            if (!calendar) {
                return data;
            }

            var birthdays = calendar.birthdays(),
                holidays = calendar.holidays(),
                events = calendar.get('events'),
                courses = calendar.courses(),
                hasNotOnlyMyTimeoff = !!(calendar.get('content') & 2) || !!(calendar.get('content') & 32),
                timeOffs = calendar.timeOffs(),
                holidayCls = this.holidayCls,
                timeOffType = criterion.CodeDataManager.getStore(criterion.consts.Dict.TIME_OFF_TYPE);

            timeOffs.sort('timeOffDate', 'ASC');

            timeOffs.each(function(rec) {
                var timeOffDate = rec.get('timeOffDate'),
                    employeeName = hasNotOnlyMyTimeoff ? rec.get('employeeName') : null,
                    timeoffDesc = rec.get('timeOffTypeDesc');

                data.push({
                    'CalendarId' : 1,
                    'Title' : timeoffDesc + (employeeName ? ' - ' + employeeName : ''),
                    'StartDate' : timeOffDate,
                    'EndDate' : timeOffDate,

                    '-isTimeoffObj' : true,
                    '-isModifiedFullDay' : true,
                    '-isFullDay' : rec.get('isFullDay'),
                    '-color' : timeOffType.getById(rec.get('timeOffTypeCd')).get('attribute1'),
                    '-startTime' : timeOffDate,
                    '-endTime' : Ext.Date.add(timeOffDate, Ext.Date.HOUR, rec.get('durationHours')),
                    '-employeeName' : rec.get('employeeName'),
                    '-timeoffDesc' : timeoffDesc,
                    '-timeoffNote' : rec.get('notes')
                });
            });

            birthdays.each(function(birthday) {
                var date = new Date(birthday.get('date')),
                    currentYear = new Date().getFullYear(),
                    currentYearBirthday = new Date(date.setFullYear(currentYear, date.getMonth(), date.getDate()));

                data.push({
                    'CalendarId' : 2,
                    'Title' : birthday.get('name'),
                    'StartDate' : currentYearBirthday,
                    'EndDate' : currentYearBirthday,
                    'IsAllDay' : true,

                    '-additionalText' : i18n.gettext('Birthday')
                })
            });

            holidays.each(function(holiday) {
                data.push({
                    'CalendarId' : 3,
                    'Title' : holiday.get('description'),
                    'StartDate' : holiday.get('date'),
                    'EndDate' : holiday.get('date'),
                    'IsAllDay' : true,
                    'highlightDayCls' : holidayCls
                })
            });

            Ext.Array.each(events, function(event) {
                data.push({
                    'CalendarId' : 4,
                    'Title' : event.description,
                    'StartDate' : event.date,
                    'EndDate' : event.date,
                    'IsAllDay' : true
                })
            });

            courses.each(function(course) {
                var date = course.get('courseDate');

                date && data.push({
                    'CalendarId' : 5,
                    'Title' : Ext.String.format('{0}', course.get('name')),
                    'StartDate' : date,
                    'EndDate' : date,
                    '-additionalText' : Ext.Date.format(course.get('courseTime'), criterion.consts.Api.SHOW_TIME_FORMAT)
                });
            });

            return data;
        },

        onNextMonth : function() {
            this.lookupReference('calendarPanel').onNextClick();
        },

        onPrevMonth : function() {
            this.lookupReference('calendarPanel').onPrevClick();
        },

        handleRefreshClick : function() {
            var view = this.getView();

            view.fireEvent('reloadCalendar', view);
        }

    }
});
