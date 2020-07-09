Ext.define('criterion.controller.employee.demographic.SelectWorkLocations', function() {

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_employee_demographic_select_work_locations',

        onShow : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                primaryLocationId = vm.get('primaryLocationId'),
                promises = [];

            view.setLoading(true);

            var employerWorkLocations = this.getStore('employerWorkLocations'),
                employeeWorkLocations = this.getStore('employeeWorkLocations');

            employeeId > 0 && promises.push(employeeWorkLocations.loadWithPromise({
                params : {
                    employeeId : vm.get('employeeId')
                }
            }));

            promises.push(employerWorkLocations.loadWithPromise({
                params : {
                    employerId : vm.get('employerId')
                }
            }));

            Ext.promise.Promise.all(promises).then({
                scope : this,
                success : function() {
                    view.setLoading(false);
                    view.center();

                    var currentLocations = [];

                    if (employeeId > 0) {
                        employeeWorkLocations.each(function(employeeWorkLocation) {
                            var employerLocation = employerWorkLocations.getById(employeeWorkLocation.get('employerWorkLocationId'));

                            currentLocations.push(employerLocation);

                            if (employeeWorkLocation.get('isPrimary')) {
                                employerLocation.set('isPrimaryForEmployee', true);
                                vm.set('primaryLocationId', employeeWorkLocation.get('employerWorkLocationId'));
                            }
                        }, this);
                    } else if (primaryLocationId) {
                        var employerLocation = employerWorkLocations.getById(primaryLocationId);

                        employeeWorkLocations.each(function(employeeWorkLocation) {
                            var employerLocation = employerWorkLocations.getById(employeeWorkLocation.get('employerWorkLocationId'));

                            currentLocations.push(employerLocation);
                        }, this);

                        employerLocation.set('isPrimaryForEmployee', true);
                        vm.set('primaryLocationId', primaryLocationId);
                    }

                   view.getSelectionModel().select(currentLocations);
                }
            })
        },

        onIsPrimaryChange : function(widget) {
            if (widget.getValue() && widget.$widgetRecord) {
                this.getView().getSelectionModel().select([widget.$widgetRecord], true);
                this.getViewModel().set('primaryLocationId', widget.$widgetRecord.getId());
            }
        },

        onSelect : function(grid, record) {
            if (!this.getViewModel().get('primaryLocationId')) {
                record.$widget && record.$widget.setValue(true);
            }
        },

        onDeselect : function(grid, record) {
            if (this.getViewModel().get('primaryLocationId') === record.getId()) {
                record.$widget && record.$widget.setValue(false);
                this.getViewModel().set('primaryLocationId', null);
                var selection = this.getView().getSelection();
                selection.length && selection[0].$widget && selection[0].$widget.setValue(true);
            }
        },

        onCancel : function() {
            this.getView().destroy();
        },

        onSubmit : function() {
            var view = this.getView(),
                gridSelection = view.getSelection(),
                selectedLocationIds = [];

            for (var i = 0; i < gridSelection.length; i++) {
                selectedLocationIds.push(gridSelection[i].getId());
            }

            view.fireEvent('submit', selectedLocationIds, this.getViewModel().get('primaryLocationId'));
            view.destroy();
        }
    };

});
