Ext.define('ess.view.time.timesheet.TotalBarAggregate', function() {

    return {
        alias : 'widget.ess_modern_time_timesheet_total_bar_aggregate',

        cls : 'ess-modern-time-timesheet-total-bar',

        extend : 'ess.view.time.timesheet.TotalBar',

        config : {
            startDate : '',
            endDate : '',
            totalHours : '',
            totalFTE : 0,
            totalInFloat : false
        },

        tpl : new Ext.Template(
            '<div class="startDate valueBlock">' +
                '<p class="title">Start Date</p>' +
                '<p class="value">{startDate:date(criterion.consts.Api.SHOW_DATE_FORMAT)}</p>' +
            '</div>' +
            '<div class="endDate valueBlock">' +
                '<p class="title">End Date</p>' +
                '<p class="value">{endDate:date(criterion.consts.Api.SHOW_DATE_FORMAT)}</p>' +
            '</div>' +
            '<div class="separator"></div>' +
            '<div class="totalFTE valueBlock">' +
                '<p class="title">Total FTE</p>' +
            '<p class="value">{totalFTE:employerAmountPrecision}</p>' +
            '</div>' +
            '<div class="totalHours valueBlock">' +
                '<p class="title">Total Hours</p>' +
            '<p class="value">{totalHours}</p>' +
            '</div>'
        ),

        data : {
            startDate : '00/00/0000',
            endDate : '00/00/0000',
            totalHours : criterion.Utils.hourStrToFormattedStr('00:00'),
            totalFTE : 0
        },

        setNewData : function() {
            var hrs = this.getTotalHours(),
                timeObj = criterion.Utils.hoursToDuration(hrs),
                hrsStr;

            timeObj.hours = timeObj.hours + timeObj.days * 24;
            hrsStr = this.getTotalInFloat() ? criterion.Utils.timeObjToStr(timeObj) : hrs;

            this.setData({
                startDate : this.getStartDate(),
                endDate : this.getEndDate(),
                totalHours : criterion.Utils.hourStrToFormattedStr(hrsStr),
                totalFTE : this.getTotalFTE()
            })
        },

        updateTotalFTE : function(val) {
            this.setNewData();
        }
    }
});
