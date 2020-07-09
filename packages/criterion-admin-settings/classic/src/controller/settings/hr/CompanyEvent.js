Ext.define('criterion.controller.settings.hr.CompanyEvent', function() {

    return {
        alias : 'controller.criterion_settings_company_event',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.view.MultiRecordPicker',
            'criterion.store.EmployeeGroups'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        loadRecord : function(record) {
            var vm = this.getViewModel(),
                view = this.getView(),
                employeeGroupIds = [],
                canPostEmployeeGroupIds = [],
                employeeGroups = vm.getStore('employeeGroups'),
                employeeGroupCompanyEvents = vm.getStore('employeeGroupCompanyEvents');

            if (!record.phantom) {
                view.setLoading(true);

                Ext.promise.Promise.all([
                    employeeGroups.loadWithPromise({
                        params : {
                            employerId : record.get('employerId')
                        }
                    }),
                    vm.getStore('eventDetails').loadWithPromise({
                        params : {
                            companyEventId : record.getId()
                        }
                    }),
                    employeeGroupCompanyEvents.loadWithPromise({
                        params : {
                            companyEventId : record.getId()
                        }
                    })
                ]).then({
                    scope : this,
                    success : function() {
                        var employeeGroupsDesc = [];

                        view.setLoading(false);

                        employeeGroupCompanyEvents.each(function(egcvRec) {
                            employeeGroupIds.push(egcvRec.get('employeeGroupId'));
                            if (egcvRec.get('canPostEss')) {
                                canPostEmployeeGroupIds.push(egcvRec.get('employeeGroupId'));
                            }
                        });

                        Ext.Array.each(employeeGroupIds, function(employeeGroupId) {
                            employeeGroupsDesc.push(employeeGroups.getById(employeeGroupId).get('name'));
                        });

                        employeeGroups.each(function(employeeGroupRec) {
                            if (Ext.Array.indexOf(canPostEmployeeGroupIds, employeeGroupRec.getId()) !== -1) {
                                employeeGroupRec.set('_canPost', true);
                            } else {
                                employeeGroupRec.set('_canPost', false);
                            }
                        });

                        vm.set({
                            employeeGroupIds : employeeGroupIds,
                            canPostEmployeeGroupIds : canPostEmployeeGroupIds,
                            employeeGroupsDesc : employeeGroupsDesc.join(', ')
                        });
                    }
                });
            } else {
                employeeGroups.loadWithPromise({
                    params : {
                        employerId : record.get('employerId')
                    }
                });
            }
        },

        onAfterSave : function(view, companyEvent) {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                eventDetails = vm.getStore('eventDetails'),
                recId = vm.get('record').getId();

            eventDetails.each(function(record) {
                record.set('companyEventId', recId);
            });

            view.setLoading(true);
            Ext.promise.Promise.all([
                eventDetails.syncWithPromise(),
                this.saveEmployeeGroupsForCompanyEvent(recId, vm.get('employeeGroupIds'), vm.get('canPostEmployeeGroupIds'))
            ]).then({
                scope : this,
                success : function() {
                    view.fireEvent('afterSave', view, companyEvent);
                    view.setLoading(false);
                    me.close();
                }
            });

            companyEvent.set('eventCount', eventDetails.count());
        },

        handleEmployeeGroupChange : function() {
            var vm = this.getViewModel(),
                selectedRecords = vm.get('employeeGroupIds'),
                selector;

            selector = Ext.create('criterion.view.MultiRecordPicker', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Groups'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'name',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'widgetcolumn',
                                text : i18n.gettext('Can Post'),
                                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                                widget : {
                                    xtype : 'checkbox',
                                    listeners : {
                                        change : function(field, value) {
                                            var rec = field.getWidgetRecord();

                                            if (rec) {
                                                rec.set('_canPost', value);
                                            }
                                        }
                                    }
                                },
                                onWidgetAttach : function(column, widget, record) {
                                    widget.setHidden(!record.get('_selected'));
                                    widget.setValue(!!record.get('_canPost'));

                                    record.store.on('update', function(store, rec) {
                                        if (record.id === rec.id) {
                                            widget.setHidden(!rec.get('_selected'));
                                        }
                                    });
                                },
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : {
                            employerId : vm.get('record.employerId')
                        },
                        selectedRecords : selectedRecords
                    },
                    stores : {
                        inputStore : vm.getStore('employeeGroups')
                    }
                },
                allowEmptySelect : true,
                inputStoreLocalMode : true
            });

            selector.show();
            selector.on('selectRecords', this.onSelectEmployeeGroup, this);
            this.setCorrectMaskZIndex(true);
        },

        onSelectEmployeeGroup : function(recs) {
            var vm = this.getViewModel(),
                employeeGroupIds = [],
                canPostEmployeeGroupIds = [],
                employeeGroupsDesc = [],
                employeeGroups = vm.getStore('employeeGroups');

            this.setCorrectMaskZIndex(false);

            Ext.Array.each(recs, function(rec) {
                var employeeGroupId = rec.getId();

                employeeGroupIds.push(employeeGroupId);
                if (rec.get('_canPost')) {
                    canPostEmployeeGroupIds.push(employeeGroupId);
                }
            });

            Ext.Array.each(employeeGroupIds, function(employeeGroupId) {
                employeeGroupsDesc.push(employeeGroups.getById(employeeGroupId).get('name'));
            });

            vm.set({
                employeeGroupIds : employeeGroupIds,
                canPostEmployeeGroupIds : canPostEmployeeGroupIds,
                employeeGroupsDesc : employeeGroupsDesc.join(', ')
            });
        },

        saveEmployeeGroupsForCompanyEvent : function(companyEventId, employeeGroupIdValues, canPostEmployeeGroupIds) {
            var employeeGroupCompanyEvents = this.getViewModel().getStore('employeeGroupCompanyEvents'),
                forRemove = [],
                presentValues = [],
                newValues;

            employeeGroupCompanyEvents.each(function(rec) {
                if (Ext.Array.indexOf(employeeGroupIdValues, rec.get('employeeGroupId')) !== -1) {
                    presentValues.push(rec.get('employeeGroupId'));
                } else {
                    forRemove.push(rec);
                }
            });
            if (forRemove.length) {
                employeeGroupCompanyEvents.remove(forRemove, null, null);
            }

            newValues = Ext.Array.difference(employeeGroupIdValues, presentValues);

            if (newValues.length) {
                Ext.Array.each(newValues, function(employeeGroupId) {
                    var value = {
                        employeeGroupId : employeeGroupId
                    };
                    value['companyEventId'] = companyEventId;

                    employeeGroupCompanyEvents.add(value);
                });
            }

            employeeGroupCompanyEvents.each(function(rec) {
                if (Ext.Array.indexOf(canPostEmployeeGroupIds, rec.get('employeeGroupId')) !== -1) {
                    rec.set('canPostEss', true);
                } else {
                    rec.set('canPostEss', false);
                }
            });

            return employeeGroupCompanyEvents.syncWithPromise();
        }

    };

});
