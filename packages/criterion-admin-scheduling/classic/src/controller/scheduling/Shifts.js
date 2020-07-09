Ext.define('criterion.controller.scheduling.Shifts', function() {

    const STARTING_DAY = 1; // Monday

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_scheduling_shifts',

        handleSearchComboChange() {
            this.load();
        },

        handleSearchButtonClick() {
            this.load();
        },

        onKeyPress : function(cmp, e) {
            if (e.keyCode === e.RETURN) {
                this.handleSearchButtonClick();
            }
        },

        load() {
            let vm = this.getViewModel(),
                employerWorkLocations = vm.get('employerWorkLocations'),
                workLocationAreas = vm.get('workLocationAreas'),
                shiftGroups = vm.get('shiftGroups'),
                searchForm = this.lookup('searchForm'),
                employerId,
                criteria = {};

            if (!this.checkViewIsActive()) {
                return;
            }

            employerId = vm.get('employerId');
            if (!employerId) {
                return;
            }
            criteria.employerId = employerId;

            if (searchForm) {
                Ext.Object.each(searchForm.getValues(), function(key, value) {
                    Ext.isString(value) && (value = value.trim());

                    if (value) {
                        criteria[key] = value;
                    }
                });
            }

            Ext.promise.Promise.all(Ext.Array.clean([
                !employerWorkLocations.isLoaded() && employerWorkLocations.loadWithPromise(),
                !workLocationAreas.isLoaded() && workLocationAreas.loadWithPromise(),
                shiftGroups.loadWithPromise({
                    params : criteria
                })
            ]))
        },

        getEmptyRecord : function() {
            let vm = this.getViewModel();

            return {
                employerId : vm.get('employerId'),
                startingDay : STARTING_DAY
            };
        },

    };

});
