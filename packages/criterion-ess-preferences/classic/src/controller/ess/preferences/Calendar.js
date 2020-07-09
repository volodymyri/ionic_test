Ext.define('criterion.controller.ess.preferences.Calendar', function() {

    return {
        alias : 'controller.criterion_ess_preferences_calendar',

        extend : 'criterion.controller.FormView',

        handleICalendarClick : function(checkbox, value) {
            var vm = this.getViewModel(),
                settings = vm.get('record');

            if (!value) {
                settings.set('isConvertAllDay', false);
            }
        }
    }
});