Ext.define('ess.view.time.timesheet.vertical.TopBar', function() {

    return {
        alias : 'widget.criterion_time_timesheet_vertical_top_bar',

        cls : 'criterion-time-timesheet-vertical-top-bar',

        extend : 'Ext.Component',

        config : {
            timezone : '',
            overtime : '',
            regIncome : '',
            totalHours : ''
        },

        tpl : new Ext.Template(
            '<div class="timezone valueBlock">' +
                '<p class="title">Timezone</p>' +
                '<p class="value">{timezone}</p>' +
            '</div>' +
            '<div class="separator"></div>' +
            '<div class="overtime valueBlock">' +
                '<p class="title">Over Time</p>' +
                '<p class="value">{overtime}</p>' +
            '</div>' +
            '<div class="regIncome valueBlock">' +
                '<p class="title">Reg Income</p>' +
                '<p class="value">{regIncome}</p>' +
            '</div>' +
            '<div class="totalHours valueBlock">' +
                '<p class="title">Total Hours</p>' +
            '<p class="value">{totalHours}</p>' +
            '</div>'
        ),

        data : {
            timezone : '',
            overtime : '',
            regIncome : '',
            totalHours : criterion.Utils.hourStrToFormattedStr('00:00')
        },

        constructor : function(config) {
            this.callParent(arguments);

            this.setNewData = Ext.Function.createBuffered(this.setNewData, 500, this);
        },

        setNewData : function() {
            this.setData({
                timezone : this.getTimezone(),
                overtime : criterion.Utils.hourStrToFormattedStr(this.getOvertime()),
                regIncome : criterion.Utils.hourStrToFormattedStr(this.getRegIncome()),
                totalHours : criterion.Utils.hourStrToFormattedStr(this.getTotalHours())
            })
        },

        updateTimezone : function() {
            this.setNewData();
        },

        updateOvertime : function() {
            this.setNewData();
        },

        updateRegIncome : function() {
            this.setNewData();
        },

        updateTotalHours : function() {
            this.setNewData();
        }
    }
});
