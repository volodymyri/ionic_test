Ext.define('ess.utils.timesheet.CommonHelpers', function() {
    return {
        singleton : true,

        //todo Temporary unused. https://criteriondev1.atlassian.net/browse/D1-10174
        workLocationChangeHandler : (cmp, newValue, oldValue, taskField) => {
            const selectedWorkLocationId = cmp.getSelection().get('workLocationId'),
                availableTasks = taskField.getStore();

            availableTasks.removeFilter('locationFilter');

            availableTasks.addFilter({
                filterFn : (record) => {
                    const workLocationId = record.get('workLocationId');

                    return workLocationId ? workLocationId === selectedWorkLocationId : true;
                },
                id : 'locationFilter'
            });

            if (oldValue && availableTasks.findBy((record) => {
                return record.get('workLocationId') === selectedWorkLocationId;
            }) === -1) {
                taskField.reset();
            }
        }
    }
});