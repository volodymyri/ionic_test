Ext.define('ess.view.time.timeOff.TimeBalances', function() {

    return {

        alias : 'widget.criterion_time_timeoff_time_balances',

        cls : 'criterion-time-timeoff-time-balances',

        extend : 'Ext.dataview.DataView',

        inline : true,
        wrap : false,

        itemTpl : '<div class="timeItem">' +
            '<div class="name"><span>{name:ellipsis(35)}</span></div>' +
            '<div class="value">{balance:round(2)}</div>' +
            '<div class="desc">{[values.planIsAccrualInDays ? "' + i18n.gettext('Days') + '" : "' + i18n.gettext('Hours') + '"]} Left</div>' +
            '</div>'
    }
});
