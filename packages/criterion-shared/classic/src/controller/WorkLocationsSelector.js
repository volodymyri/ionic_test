Ext.define('criterion.controller.WorkLocationsSelector', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_work_locations_selector',

        onShow : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                predefinedWorkLocations = view.getPredefinedWorkLocations(),
                workLocations = vm.getStore('workLocations'),
                selectedRecords = vm.get('selectedRecords'),
                selected = [];

            view.setLoading(true);

            if (predefinedWorkLocations) {
                workLocations.loadData(predefinedWorkLocations.getRange());
                _workLocationsLoaded();
            } else {
                workLocations.loadWithPromise().then({
                    scope : this,
                    success : function() {
                        _workLocationsLoaded();
                    }
                });
            }

            function _workLocationsLoaded() {
                var primary = selectedRecords.findRecord('isPrimary', true);

                selectedRecords.each(function(record) {
                    selected.push(workLocations.getById(record.getWorkLocation().getId()));
                });

                if (primary) {
                    var wlRecord = workLocations.getById(primary.get('workLocationId'));

                    if (wlRecord) {
                        wlRecord.set('isPrimary', true)
                    }
                }

                view.setLoading(false);
                view.center();

                me.lookupReference('grid').getSelectionModel().select(selected);
            }
        },

        onIsPrimaryChange : function(widget) {
            if (widget.getValue() && widget.$widgetRecord) {
                this.lookupReference('grid').getSelectionModel().select([widget.$widgetRecord], true);
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
                var selection = this.lookupReference('grid').getSelection();
                selection.length && selection[0].$widget && selection[0].$widget.setValue(true);
            }
        },

        onCancel : function() {
            this.getView().destroy();
        },

        onSubmit : function() {
            var gridSelection = this.lookupReference('grid').getSelection();

            this.getView().fireEvent('select', gridSelection, this.getViewModel().get('primaryLocationId'));
            this.getView().destroy();
        }
    };

});
