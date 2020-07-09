Ext.define('criterion.controller.settings.hr.LocationDetails', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_location_details',

        requires : [
            'criterion.model.employer.WorkLocation',
            'criterion.view.GoogleMap',
            'criterion.store.workLocation.AvailableEmployees',
            'criterion.store.Employers',
            'criterion.view.MultiRecordPickerRemote',
            'criterion.view.MultiRecordPicker'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init() {
            let me = this,
                vm = this.getViewModel();

            this.callParent(arguments);

            vm.bind({
                bindTo : '{showSelectEmployees}'
            }, (showSelectEmployees) => {
                if (showSelectEmployees) {
                    me.loadEmployees();
                }
            });

            vm.bind({
                bindTo : '{showSelectEmployers}'
            }, (showSelectEmployers) => {
                if (showSelectEmployers) {
                    me.loadEmployers();
                }
            });
        },

        loadRecord : function(record) {
            let me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                workLocationAreas = vm.getStore('workLocationAreas'),
                workLocationTasks = vm.getStore('workLocationTasks'),
                certifiedRate = vm.getStore('certifiedRate'),
                overtimes = vm.getStore('overtimes'),
                recordId = record.getId();

            view.setLoading(true);

            if (!record.phantom) {
                Ext.Deferred.all([
                    workLocationAreas.loadWithPromise({
                        params : {
                            workLocationId : recordId
                        }
                    }),
                    workLocationTasks.loadWithPromise({
                        params : {
                            workLocationId : recordId
                        }
                    }),
                    certifiedRate.loadWithPromise(),
                    overtimes.loadWithPromise()
                ]).then(() => {
                    me.prepareOvertimes();
                }).always(() => {
                    view.setLoading(false);
                });
            } else {
                Ext.Deferred.all([
                    certifiedRate.loadWithPromise(),
                    overtimes.loadWithPromise()
                ]).then(() => {
                    me.prepareOvertimes();
                }).always(() => {
                    view.setLoading(false);
                });
            }
        },

        loadEmployees() {
            let vm = this.getViewModel(),
                view = this.getView(),
                workLocationEmployees = vm.getStore('workLocationEmployees');

            view.setLoading(true);

            workLocationEmployees.loadWithPromise({
                params : {
                    workLocationId : vm.get('record.id')
                }
            }).always(_ => {
                view.setLoading(false);
            });
        },

        loadEmployers() {
            let vm = this.getViewModel(),
                view = this.getView(),
                workLocationEmployers = vm.getStore('workLocationEmployers');

            view.setLoading(true);

            workLocationEmployers.loadWithPromise({
                params : {
                    workLocationId : vm.get('record.id')
                }
            }).always(_ => {
                view.setLoading(false);
            });
        },

        prepareOvertimes() {
            let vm = this.getViewModel(),
                overtimes = vm.getStore('overtimes'),
                overtimeCodes = vm.getStore('overtimeCodes');

            overtimeCodes.loadData(Ext.Array.map(overtimes.collect('code'), (val) => {
                return {
                    code : val
                };
            }));

            // we must update field after data loading
            this.lookup('overtimeCodeField').setValue(vm.get('record.overtimeCode'));
        },

        handleEditGeoFence() {
            let me = this,
                vm = me.getViewModel(),
                record = vm.get('record'),
                country = vm.get('countryCDField.selection'),
                countryName = country && country.get('description'),
                city = record.get('city'),
                address = record.get('address1') || record.get('address2'),
                selectGeoCodeWindow, geoCodeAddr = [];

            countryName && geoCodeAddr.push(countryName);
            city && geoCodeAddr.push(city);
            address && geoCodeAddr.push(address);

            selectGeoCodeWindow = Ext.create('criterion.view.GoogleMap', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Set Geofence'),
                        geofenceData : record.get('geofence'),
                        isAllowPunchOutsideGeofence : record.get('isAllowPunchOutsideGeofence'),
                        isSendPunchOutsideGeofenceNotification : record.get('isSendPunchOutsideGeofenceNotification')
                    }
                },
                geoCodeAddr : geoCodeAddr.length ? geoCodeAddr.join(', ') : null,
                zoom : geoCodeAddr.length ? 12 : 1,
                bbar : [
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n._('Allow Punch Outside Geofence'),
                        labelWidth : 'auto',
                        labelStyle : 'white-space: nowrap;',
                        margin : '0 50 0 0',
                        bind : {
                            value : '{isAllowPunchOutsideGeofence}'
                        }
                    },
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n._('Send Punch Outside Geofence Notification'),
                        labelWidth : 'auto',
                        labelStyle : 'white-space: nowrap;',
                        bind : {
                            value : '{isSendPunchOutsideGeofenceNotification}'
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        reference : 'cancelBtn',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        scale : 'small',
                        handler : 'onCancelHandler'
                    },
                    {
                        xtype : 'button',
                        reference : 'saveButton',
                        cls : 'criterion-btn-primary',
                        scale : 'small',
                        handler : 'onSaveButtonHandler',
                        bind : {
                            text : '{saveBtnText}'
                        }
                    }
                ]
            });

            selectGeoCodeWindow.on({
                defineFence : me.afterGeoFenceEdited,
                close : function() {
                    me.setCorrectMaskZIndex(false);
                },
                scope : me
            });

            selectGeoCodeWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        afterGeoFenceEdited(geofenceData, isAllowPunchOutsideGeofence, isSendPunchOutsideGeofenceNotification) {
            this.getViewModel().get('record').set({
                geofence : geofenceData,
                isAllowPunchOutsideGeofence : isAllowPunchOutsideGeofence,
                isSendPunchOutsideGeofenceNotification : isSendPunchOutsideGeofenceNotification
            });
        },

        handleSelectGeocode() {
            let me = this,
                vm = this.getViewModel(),
                record = vm.get('record'),
                postalCode = record.get('postalCode'),
                city = record.get('city'),
                selectGeoCodeWindow;

            if (!postalCode) {
                criterion.Msg.warning({
                    title : i18n.gettext('Zip code'),
                    message : i18n.gettext('Enter postal code.')
                });

                return;
            }

            selectGeoCodeWindow = Ext.create('criterion.view.common.SelectGeoCode', {
                modal : true,
                extraParams : {
                    zip : postalCode,
                    city : city,
                    countryCode : record.get('countryCode')
                }
            });

            selectGeoCodeWindow.on({
                select : (geocode) => me.afterGeoCodeSelected(geocode, !city),
                close : () => {
                    me.setCorrectMaskZIndex(false);
                },
                scope : me
            });

            selectGeoCodeWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        afterGeoCodeSelected(geoCodeRecord, isSetCity) {
            let record = this.getViewModel().get('record');

            record.set({
                geocode : geoCodeRecord.get('geoCode'),
                schdist : geoCodeRecord.get('schdist'),
                schdistName : geoCodeRecord.get('schdistName')
            });

            if (isSetCity) {
                record.set('city', geoCodeRecord.get('city'));
            }
        },

        onAfterSave(view, record) {
            let me = this,
                vm = me.getViewModel(),
                recordId = record.getId(),
                workLocationAreas = vm.getStore('workLocationAreas'),
                workLocationTasks = vm.getStore('workLocationTasks'),
                preSavedAreas = [];

            Ext.Array.each(workLocationAreas.getNewRecords(), function(area) {
                let areaId = area.getId(),
                    relatedTasks = Ext.Array.map(workLocationTasks.getNewRecords(), addedTask => {
                        if (addedTask.get('workLocationAreaId') === areaId) {
                            return addedTask;
                        }
                    });

                area.set('workLocationId', recordId);

                if (relatedTasks.length) {
                    preSavedAreas.push(area.saveWithPromise().then(function(record) {
                        Ext.Array.each(relatedTasks, function(task) {
                            task.set('workLocationAreaId', record.getId());
                        });
                    }));
                }
            });

            view.setLoading(true);

            Ext.promise.Promise.all(preSavedAreas).then(function() {
                Ext.promise.Promise.all([
                    workLocationAreas.syncWithPromise(),
                    workLocationTasks.syncWithPromise()
                ]).then(() => {
                    view.fireEvent('afterSave', view, record);
                    criterion.Utils.toast(i18n.gettext('Work Location Saved.'));
                    view.setLoading(false);
                    me.close();
                }).otherwise(() => {
                    view.setLoading(false);
                });
            });
        },

        deleteRecord() {
            let me = this,
                form = me.getView(),
                vm = me.getViewModel(),
                workLocationAreas = vm.getStore('workLocationAreas'),
                workLocationTasks = vm.getStore('workLocationTasks'),
                record = me.getRecord();

            Ext.Array.each(workLocationAreas.getNewRecords(), function(area) {
                area.erase();
            });

            Ext.Array.each(workLocationTasks.getNewRecords(), function(task) {
                task.erase();
            });

            Ext.promise.Promise.all([
                workLocationAreas.syncWithPromise(),
                workLocationTasks.syncWithPromise()
            ]).then(function() {
                record.erase({
                    success : function() {
                        form.fireEvent('afterDelete', me);
                        me.close();
                    }
                });
            });
        },

        handleAddObject(btn) {
            btn.up('tabpanel').getActiveTab().getController().handleAddClick();
        },

        handleControlEmployers() {
            let vm = this.getViewModel();

            vm.set('showSelectEmployers', true);
        },

        handleControlEmployees() {
            let vm = this.getViewModel();

            vm.set('showSelectEmployees', true);
        },

        backToWorkLocation() {
            let vm = this.getViewModel();

            vm.set({
                showSelectEmployers : false,
                showSelectEmployees : false
            });
        },

        // Employees

        handleEmployeesSelectionChange(mdl, selected) {
            this.getViewModel().set('countEmployeesSelected', selected.length);
        },

        handleAddEmployees() {
            let selectEmployeesWnd,
                me = this,
                vm = this.getViewModel(),
                employees = Ext.create('criterion.store.workLocation.AvailableEmployees', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                });

            selectEmployeesWnd = Ext.create('criterion.view.MultiRecordPickerRemote', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Employees'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : 'string',
                                defaultSearch : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Employee Number'),
                                dataIndex : 'employeeNumber',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'booleancolumn',
                                text : i18n.gettext('Status'),
                                dataIndex : 'isActive',
                                trueText : i18n.gettext('Active'),
                                falseText : i18n.gettext('Inactive'),
                                width : 150,
                                excludeFromFilters : true
                            }
                        ],
                        additionalFilters : [
                            {
                                xtype : 'container',
                                width : '100%',
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                items : [
                                    {
                                        xtype : 'component',
                                        flex : 1
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Show Inactive'),
                                        value : false,
                                        margin : '0 10 0 0',
                                        name : 'isActive',
                                        filterType : criterion.controller.MultiRecordPickerRemote.FILTER_TYPE_BOOLEAN_REVERSED,
                                        listeners : {
                                            change : 'additionalFilterHandler'
                                        }
                                    }
                                ]
                            }
                        ],
                        storeParams : {
                            workLocationId : vm.get('record.id'),
                            isActive : true
                        }
                    },
                    stores : {
                        inputStore : employees
                    }
                }
            });

            selectEmployeesWnd.show();

            selectEmployeesWnd.on({
                selectRecords : me.selectEmployees,
                close : () => {
                    me.setCorrectMaskZIndex(false);
                },
                scope : me
            });

            me.setCorrectMaskZIndex(true);
        },

        selectEmployees(employees) {
            let me = this,
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.WORK_LOCATION_EMPLOYEE,
                method : 'POST',
                jsonData : {
                    workLocationId : vm.get('record.id'),
                    employeeIds : Ext.Array.map(employees, rec => rec.get('employeeId'))
                }
            }).then(() => {
                me.loadEmployees();
            }, () => {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            });
        },

        handleRemoveEmployees() {
            let me = this,
                vm = this.getViewModel(),
                grid = this.lookup('employeesGrid'),
                selection = grid.getSelection();

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete'),
                    message : i18n.gettext('Do you want to delete ') + ` ${selection.length} ` + i18n.ngettext('employee', 'employees', selection.length) + '?'
                },
                btn => {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.WORK_LOCATION_EMPLOYEE,
                            method : 'DELETE',
                            jsonData : {
                                workLocationId : vm.get('record.id'),
                                employeeIds : Ext.Array.map(selection, sel => sel.get('employeeId'))
                            }
                        }).always(() => {
                            grid.getSelectionModel().deselectAll();
                            me.loadEmployees();
                        });
                    }
                }
            );
        },

        // Employers

        handleEmployersSelectionChange(mdl, selected) {
            this.getViewModel().set('countEmployersSelected', selected.length);
        },

        handleAddEmployers() {
            let me = this,
                selectEmployersWnd,
                vm = this.getViewModel(),
                appEmployers = web.getApplication().getEmployersStore(),
                workLocationEmployers = vm.getStore('workLocationEmployers'),
                employers = Ext.create('criterion.store.Employers');

            appEmployers.cloneToStore(employers);

            selectEmployersWnd = Ext.create('criterion.view.MultiRecordPicker', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Employers'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                flex : 1,
                                text : i18n.gettext('Company Name'),
                                dataIndex : 'legalName',
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                flex : 1,
                                text : i18n.gettext('Alternate Name'),
                                dataIndex : 'alternativeName',
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                flex : 1,
                                text : i18n.gettext('National Identifier'),
                                dataIndex : 'nationalIdentifier',
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : {},
                        excludedIds : Ext.Array.map(workLocationEmployers.getRange(), item => item.getId())
                    },
                    stores : {
                        inputStore : employers
                    },
                    inputStoreLocalMode : true
                }
            });

            selectEmployersWnd.show();

            selectEmployersWnd.on({
                selectRecords : me.selectEmployers,
                close : () => {
                    me.setCorrectMaskZIndex(false);
                },
                scope : me
            });

            me.setCorrectMaskZIndex(true);
        },

        selectEmployers(employers) {
            let me = this,
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.WORK_LOCATION_EMPLOYER,
                method : 'POST',
                jsonData : {
                    workLocationId : vm.get('record.id'),
                    employerIds : Ext.Array.map(employers, rec => rec.getId())
                }
            }).then(() => {
                me.loadEmployers();
            }, () => {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            });
        },

        handleRemoveEmployers() {
            let me = this,
                vm = this.getViewModel(),
                grid = this.lookup('employersGrid'),
                selection = grid.getSelection();

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete'),
                    message : i18n.gettext('Do you want to delete ') + ` ${selection.length} ` + i18n.ngettext('employer', 'employers', selection.length) + '?'
                },
                btn => {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.WORK_LOCATION_EMPLOYER,
                            method : 'DELETE',
                            jsonData : {
                                workLocationId : vm.get('record.id'),
                                employerIds : Ext.Array.map(selection, sel => sel.getId())
                            }
                        }).always(() => {
                            grid.getSelectionModel().deselectAll();
                            me.loadEmployers();
                        });
                    }
                }
            );
        }
    };
});
