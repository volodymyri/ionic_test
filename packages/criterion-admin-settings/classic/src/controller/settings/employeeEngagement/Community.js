Ext.define('criterion.controller.settings.employeeEngagement.Community', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_community',

        requires : [
            'criterion.view.settings.employeeEngagement.CommunityEmployeeGroup'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        loadRecord : function(record) {
            var promises = [],
                vm = this.getViewModel(),
                employeeGroupCommunities = vm.getStore('employeeGroupCommunities'),
                employeeGroups = vm.getStore('employeeGroups'),
                employerSelector = this.lookupReference('employerSelector');

            employeeGroups.clearFilter();
            promises.push(employeeGroups.loadWithPromise());

            if (!record.phantom) {
                promises.push(employeeGroupCommunities.loadWithPromise({
                    params : {
                        communityId : record.getId()
                    }
                }));
            }

            if (!employerSelector.getStore().isLoaded()) {
                promises.push(employerSelector.getStore().loadWithPromise());
            }

            Ext.promise.Promise.all(promises).then({
                scope : this,
                success : function() {
                    var egValues = [],
                        names = [],
                        selectedEmployers = [];

                    employeeGroupCommunities.each(function(egCommunity) {
                        var employeeGroupId = egCommunity.get('employeeGroupId'),
                            group = employeeGroups.getById(employeeGroupId),
                            employerId = group.get('employerId');

                        egValues.push({
                            employeeGroupId : employeeGroupId,
                            canPost : egCommunity.get('canPost')
                        });

                        names.push(group.get('name'));

                        if (!Ext.Array.contains(selectedEmployers, employerId)) {
                            selectedEmployers.push(employerId);
                        }
                    });

                    vm.set('selectedGroups', egValues);
                    vm.set('selectedGroupsText', names.join(', '));

                    employeeGroups.setFilters({
                        property : 'employerId',
                        value : selectedEmployers,
                        operator : 'in'
                    });

                    if (selectedEmployers.length) {
                        employerSelector.setValue(selectedEmployers);
                    }
                }
            });
        },

        syncEmployeeGroups : function(record) {
            var vm = this.getViewModel(),
                selectedGroups = vm.get('selectedGroups'),
                egCommunities = vm.getStore('employeeGroupCommunities'),
                egCommunitiesToRemove = [];

            egCommunities.each(function(egCommunity) {
                if (!Ext.Array.findBy(selectedGroups, function (group) {
                        return group['employeeGroupId'] === egCommunity.get('employeeGroupId');
                    })) {
                    egCommunitiesToRemove.push(egCommunity);
                }
            });

            egCommunities.remove(egCommunitiesToRemove);

            Ext.Array.each(selectedGroups, function(group) {
                var groupRecord = egCommunities.findRecord('employeeGroupId', group['employeeGroupId'], 0, false, false, true);

                if (!groupRecord) {
                    egCommunities.add({
                        employeeGroupId : group['employeeGroupId'],
                        canPost : group['canPost'],
                        communityId : record.getId()
                    });
                } else {
                    groupRecord.set('canPost', group['canPost']);
                }
            });

            return egCommunities.syncWithPromise();
        },

        onAfterSave : function(view, record) {
            var me = this;

            this.syncEmployeeGroups(record).then({
                success : function() {
                    view.fireEvent('afterSave', view, record);
                    me.close();
                }
            });
        },

        deleteRecord : function() {
            var me = this,
                form = me.getView(),
                record = this.getRecord();

            this.syncEmployeeGroups(record).then(function() {
                record.erase({
                    success : function() {
                        form.fireEvent('afterDelete', me);
                        me.close();
                    },
                    failure : function() {
                        record.reject();
                    }
                });
            });
        },

        onSelectionChange : function(itemSelector, newValue, oldValue) {
            var toRemove = Ext.Array.difference(oldValue, newValue),
                vm = this.getViewModel(),
                employeeGroups = vm.getStore('employeeGroups'),
                selectedGroups = vm.get('selectedGroups'),
                employerStore = this.lookupReference('employerSelector').getStore(),
                selectedGroupsField = this.lookupReference('selectedGroupsField'),
                names = [];

            if (newValue == oldValue) {
                return;
            }

            if (toRemove.length) {
                selectedGroups = Ext.Array.filter(selectedGroups, function(group) {
                    var employerId = employeeGroups.getById(group['employeeGroupId']).get('employerId');

                    return !Ext.Array.contains(toRemove, employerId);
                });
            }

            Ext.Array.each(selectedGroups, function(group) {
                names.push(employeeGroups.getById(group['employeeGroupId']).get('name'));
            });

            vm.set('selectedGroups', selectedGroups);
            vm.set('selectedGroupsText', names.join(', '));

            employeeGroups.setFilters({
                property : 'employerId',
                value : newValue,
                operator : 'in'
            });

            selectedGroupsField.validator = function() {
                var selectedEmployers = Ext.Array.map(vm.get('selectedGroups'), function(group) {
                        return employeeGroups.getById(group['employeeGroupId']).get('employerId');
                    }), errorMsg;

                Ext.Array.each(newValue, function(employerId) {
                    if (!Ext.Array.contains(selectedEmployers, employerId)) {
                        errorMsg = Ext.util.Format.format(i18n.gettext('Please select at least one employee group for {0}.'), employerStore.getById(employerId).get('legalName'));

                        return false;
                    }
                });

                return errorMsg || true;
            };

            selectedGroupsField.validate();
        },

        handleSelectEmployeeGroups : function() {
            var vm = this.getViewModel(),
                employeeGroups = vm.getStore('employeeGroups'),
                selectedGroups = vm.get('selectedGroups'),
                clonedStore = Ext.create('criterion.store.EmployeeGroups');

            employeeGroups.cloneToStore(clonedStore);
            var selectEmployeeGroups = Ext.create('criterion.view.settings.employeeEngagement.CommunityEmployeeGroup', {
                viewModel : {
                    data : {
                        selectedGroups : selectedGroups
                    },
                    stores : {
                        employeeGroups_ : clonedStore
                    }
                }
            });

            selectEmployeeGroups.on('select', function(selection) {
                var groups = [],
                    names = [];

                Ext.Array.each(selection, function(employeeGroup) {
                    groups.push({
                        employeeGroupId : employeeGroup.getId(),
                        canPost : employeeGroup.get('canPost')
                    });
                    names.push(employeeGroup.get('name'));
                });

                vm.set('selectedGroups', groups);
                vm.set('selectedGroupsText', names.join(', '));
            });

            selectEmployeeGroups.on('destroy', function() {
                this.setCorrectMaskZIndex(false);
            }, this);

            selectEmployeeGroups.show();
            this.setCorrectMaskZIndex(true);
        }
    };

});
