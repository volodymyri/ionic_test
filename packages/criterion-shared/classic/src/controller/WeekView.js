Ext.define('criterion.controller.WeekView', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_weekview',

        config : {
            /**
             * @cfg {Boolean} loadByDateRange
             * Load data for current week only
             */
            loadByWeek : false,

            startParam : 'start',

            endParam : 'end'
        },

        handleActivate : function() {
            var calendarPanel = this.lookupReference('calendarPanel');
            calendarPanel.setActiveView(calendarPanel.id + '-week');

            this.callParent(arguments);
            calendarPanel.show();
        },

        handleTodayClick : function() {
            this.lookupReference('calendarPanel').onTodayClick();
        },

        handlePrevWeek : function() {
            this.lookupReference('calendarPanel').onPrevClick();
        },

        handleNextWeek : function() {
            this.lookupReference('calendarPanel').onNextClick();
        },

        onCalendarViewChange : function(a, b, info) {
            if (this.getLoadByWeek()) {
                this.load();
            }

            this.lookupReference('currentWeek').setHtml(Ext.Date.format(info.viewStart, criterion.consts.Api.SHOW_DATE_FORMAT) + ' &mdash; ' + Ext.Date.format(info.viewEnd, criterion.consts.Api.SHOW_DATE_FORMAT));
        },

        getHandleRoute : function() {
            return !!this.getBaseRoute();
        },

        convertRules : {
            'EventId' : 'id',
            'Recurrence' : 'recurring',
            'Title' : 'name',
            'StartDate' : 'startTimestamp',
            'EndDate' : 'endTimestamp',
            'IsAllDay' : 'fullDay'
        },

        convertToCalendar : function(record) {
            var result = {};

            Ext.Object.each(this.convertRules, function(calendarFieldName, recordFieldName) {
                result[calendarFieldName] = record.get(recordFieldName);
            });

            result['CalendarId'] = !result['Recurrence'] ? 1 : 2;

            return result;
        },

        convertFromCalendar : function(record) {
            var result = {},
                data = record.isModel ? record.getData() : record;

            Ext.Object.each(this.convertRules, function(calendarFieldName, recordFieldName) {
                result[recordFieldName] = data[calendarFieldName];
            });

            return result;
        },

        prepareCalendarData : function(store) {
            var data = [],
                me = this;

            store.each(function(rec) {
                data.push(Ext.apply(me.convertToCalendar(rec), {
                    __record : rec
                }))
            });

            return data;
        },

        startEdit : function(record, editor) {
            var me = this;

            if (editor) {
                editor = this.createEditor(editor, record);
            }

            if (!editor) {
                return;
            }

            editor.setLoading(true);

            if (editor) {
                if (!record.phantom) {
                    me._onCallbackLoad(editor, record);
                } else {
                    record.loadCodeData ? record.loadCodeData(Ext.bind(me._onCallbackLoad, me, [editor, record])) : me._onCallbackLoad(editor, record);
                }
            }

            return editor;
        },

        onCalendarEventClick : function(cmp, calendarRecord) {
            if (this.getView().fireEvent('calendarEventClick', calendarRecord.getId())) {
                this.handleEditAction(calendarRecord.get('__record'));
            }
        },

        onCalendarDayClick : function(vw, startDate, isAllDay) {
            var view = this.getView(),
                newRecord = this.addRecord(Ext.apply(this.getEmptyRecord(), this.convertFromCalendar({
                    Recurrence : false,
                    StartDate : Ext.Date.clone(startDate),
                    EndDate : Ext.Date.clone(Ext.Date.add(startDate, Ext.Date.MINUTE, 30)),
                    IsAllDay : isAllDay
                })));

            if (view.fireEvent('calendarDayClick', newRecord) === false) {
                return
            }

            if (view.getReadOnlyMode()) {
                return;
            }

            this.startEdit(newRecord, this.getEditor());
        },

        calendarRefresh : function() {
            var view = this.getView();

            view.eventStore.loadData(this.prepareCalendarData(view.getStore()));
            this.lookupReference('calendarPanel').down('weekview').refresh();
        },

        load : function(opts) {
            var params = {};

            if (this.getLoadByWeek()) {
                var calendarPanel = this.lookupReference('calendarPanel'),
                    viewBounds = calendarPanel.layout.getActiveItem().getViewBounds();

                params[this.getStartParam()] = Ext.Date.format(viewBounds.start, criterion.consts.Api.RAW_DATE_TIME_FORMAT);
                params[this.getEndParam()] = Ext.Date.format(viewBounds.end, criterion.consts.Api.RAW_DATE_TIME_FORMAT);
            }

            return this.callParent([
                Ext.Object.merge({
                    params : params
                }, opts || {})
            ]);
        }

    };
});
