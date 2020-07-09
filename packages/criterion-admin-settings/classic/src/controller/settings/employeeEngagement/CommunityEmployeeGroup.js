Ext.define('criterion.controller.settings.employeeEngagement.CommunityEmployeeGroup', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_community_employee_group',

        onShow : function() {
            var vm = this.getViewModel(),
                selectedGroups = vm.get('selectedGroups'),
                employeeGroups = vm.getStore('employeeGroups_'),
                selected = [];

            Ext.Array.each(selectedGroups, function(egCommunity) {
                var employeeGroup = employeeGroups.getById(egCommunity['employeeGroupId']);

                employeeGroup.set('canPost', egCommunity['canPost']);
                selected.push(employeeGroup);
            });

            this.lookupReference('grid').getSelectionModel().select(selected);
        },

        onCanPostChange : function(widget) {
            widget.$widgetRecord.set('canPost', widget.getValue());

            if (widget.getValue() && widget.$widgetRecord) {
                this.lookupReference('grid').getSelectionModel().select([widget.$widgetRecord], true);
            }
        },

        onDeselect : function(grid, record) {
            record.$widget && record.$widget.setValue(false);
        },

        onCancel : function() {
            this.getView().destroy();
        },

        onSubmit : function() {
            var gridSelection = this.lookupReference('grid').getSelection();

            this.getView().fireEvent('select', gridSelection);
            this.getView().destroy();
        }
    };

});
