Ext.define('criterion.controller.settings.system.SecurityProfile', function() {

    return {
        alias : 'controller.criterion_settings_security_profile',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.settings.system.securityProfile.EmployerSelector'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        getRecord : function() {
            return this.getViewModel().get('record');
        },

        onEmployersDataChange : function(employers) {
            var vm = this.getViewModel(),
                count = employers.count();

            if (employers.count() === 0) {
                console.warn('employers.count() === 0');
            }

            vm.set({
                employersCount : count,
                isSingleEmployer : count === 1
            });
        },

        handleAfterRecordLoad : function(record) {
            var view = this.getView(),
                vm = this.getViewModel(),
                employeeGroups = vm.getStore('employeeGroups');

            view.setLoading(true);

            Ext.promise.Promise.all([
                employeeGroups.loadWithPromise(),
                criterion.CodeDataManager.load([
                    criterion.consts.Dict.SECURITY_FUNCTION,
                    criterion.consts.Dict.SECURITY_ESS_FUNCTION
                ]),
                this.getStore('metaFields').loadWithPromise(),
                this.getStore('reports').loadWithPromise(),
                this.getStore('employers').loadWithPromise()
            ]).then({
                scope : this,
                success : function() {
                    var roles = record.roles(),
                        role = roles.getAt(0),
                        employeeGroupIds = [];

                    // reset dirty
                    roles.each(function(rol) {
                        rol.modified = {};
                        rol.dirty = false;
                    });

                    if (role) {
                        Ext.each(role.get('groups'), function(group) {
                            employeeGroupIds.push(group.employeeGroupId);
                        });
                    }
                    vm.set({
                        employeeGroupIds : employeeGroupIds,
                        firstRoleRoleCd : (role && role.isModel ? role.get('roleCd') : null),
                        firstRoleOrgType : (role && role.isModel ? role.get('orgType') : null),
                        firstRoleOrgLevel : (role && role.isModel ? role.get('orgLevel') : null),
                        rolesCount : roles.count()
                    });

                    this.prepareFieldStores(record);
                    this.prepareReportStores(record);
                }
            }).always(function() {
                view.setLoading(false);
            });

            this.callParent(arguments);
        },

        prepareFieldStores : function(record) {
            var allFields = this.getStore('allSecurityFields'),
                currentFields = record.fields();

            allFields.removeAll();

            this.getStore('metaFields').each(function(metaField) {
                var record = Ext.create('criterion.model.security.profile.Field', {
                        metaFieldId : metaField.getId(),
                        fieldName : metaField.get('description'),
                        tableName : metaField.get('tableName')
                    }),
                    currentRecord = currentFields.findRecord('metaFieldId', metaField.getId(), 0, false, false, true);

                if (currentRecord) {
                    record.set('accessLevel', currentRecord.getAccessLevel());
                }

                allFields.add(record);
            });
        },

        prepareReportStores : function(record) {
            var allReports = this.getStore('allSecurityReports'),
                currentReports = record.reports();

            allReports.removeAll();

            this.getStore('reports').each(function(report) {
                var record = Ext.create('criterion.model.security.Report', {
                        reportId : report.getId(),
                        reportName : report.get('name')
                    }),
                    currentRecord = currentReports.findRecord('reportId', report.getId(), 0, false, false, true);

                if (currentRecord) {
                    record.set('accessLevel', currentRecord.getAccessLevel());
                }

                allReports.add(record);
            });
        },

        handleRecordUpdate : function(profile) {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                securityRole = this.lookup('securityRole'),
                orgType = this.lookup('orgType'),
                orgLevel = this.lookup('orgLevel'),
                employeeGroupField = this.lookup('employeeGroupField'),
                allFields = this.getStore('allSecurityFields'),
                allReports = this.getStore('allSecurityReports'),
                roles = profile.roles(),
                employers = this.getStore('employers'),
                role,
                groups = [],
                profileId = profile.getId();

            view.setLoading(true);

            // single employer actions
            if (vm.get('isSingleEmployer') && !profile.get('hasFullAccess')) {
                role = roles.getAt(0);
                if (role) {
                    role.set({
                        roleCd : securityRole.getValue(),
                        orgType : orgType.getValue(),
                        orgLevel : orgLevel.getValue()
                    });
                } else {
                    roles.add({
                        securityProfileId : profile.getId(),
                        employerId : employers.getAt(0).getId(),
                        roleCd : securityRole.getValue(),
                        orgType : orgType.getValue(),
                        orgLevel : orgLevel.getValue()
                    });
                    role = roles.getAt(0);
                }

                if (securityRole.getSelection() && securityRole.getSelection().get('code') === criterion.Consts.SECURITY_ROLES.EMPLOYEE_GROUP) {
                    Ext.Array.each(employeeGroupField.getValue(), function(employeeGroupId) {
                        groups.push({
                            employeeGroupId : employeeGroupId
                        })
                    });
                }

                role.set('groups', groups);
            }

            // multi employer
            if (!vm.get('isSingleEmployer') && !profile.get('hasFullAccess')) {
                Ext.each(roles.getModifiedRecords(), function(modifiedRole) {
                    var groupEmployeeGroupIds = modifiedRole.get('groupEmployeeGroupIds'),
                        newGroups = [];

                    if (modifiedRole.get('roleCode') === criterion.Consts.SECURITY_ROLES.EMPLOYEE_GROUP) {
                        Ext.Array.each(groupEmployeeGroupIds, function(employeeGroupId) {
                            newGroups.push({
                                employeeGroupId : employeeGroupId
                            })
                        });
                    }

                    modifiedRole.set('groups', newGroups);
                });
            }

            profile.adminFunctions().each(rec => {
                rec.set('accessLevel', rec.getAccessLevel());
            });

            this.updateSecurityStore(allFields, profile.fields(), 'metaFieldId', profileId);
            this.updateSecurityStore(allReports, profile.reports(), 'reportId', profileId);

            profile.saveWithPromise().then({
                scope : this,
                success : function(record) {
                    criterion.Utils.toast(i18n.gettext('Profile saved.'));
                    me.onAfterSave.call(me, view, profile);
                    view.close();
                }
            }).otherwise(function() {
                view.setLoading(false);
            });
        },

        handleEditRoles : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                rolesWindow;

            rolesWindow = Ext.create('criterion.view.settings.system.securityProfile.SecurityProfileRoles', {
                viewModel : {
                    data : {
                        record : this.getRecord()
                    },
                    stores : {
                        employers : vm.getStore('employers'),
                        employeeGroups : vm.getStore('employeeGroups')
                    }
                }
            });

            view.add(rolesWindow);

            rolesWindow.show();

            rolesWindow.on('destroy', function() {
                this.setCorrectMaskZIndex(false);
            }, this);

            this.setCorrectMaskZIndex(true);
        },

        /**
         * Update security store according to selected security access rules.
         *
         * @param allEntities
         * @param currentEntities
         * @param identityField
         */
        updateSecurityStore : function(allEntities, currentEntities, identityField, profileId, accessChecker, withRemove) {
            allEntities.each(function(record) {
                var recordData = record.getData({serialize : true}),
                    hasAccess = accessChecker ? accessChecker(recordData) : !!parseInt(recordData['accessLevel'], 2),
                    currentEntity = currentEntities.findRecord(identityField, record.get(identityField));

                delete recordData['id'];
                recordData['securityProfileId'] = profileId;
                if (currentEntity) {
                    if (withRemove && !hasAccess) {
                        // remove entity when no access
                        currentEntities.remove(currentEntity);
                    } else {
                        // update accessLevel
                        currentEntity.set(recordData);
                    }
                } else if (hasAccess) {
                    currentEntities.add(recordData);
                }
            });
        },

        handleEditFunctionList : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                isAdminCard = vm.get('activeTab') === view.ADMIN_CARD,
                record = vm.get('record'),
                store = isAdminCard ? record.adminFunctions() : record.essFunctions(),
                inputStore = criterion.CodeDataManager.getStore(
                    isAdminCard ? criterion.consts.Dict.SECURITY_FUNCTION : criterion.consts.Dict.SECURITY_ESS_FUNCTION
                ),
                selectWindow;

            inputStore.sort('description', 'ASC');

            selectWindow = Ext.create('criterion.view.MultiRecordPicker', {
                modal : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 400,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Functions'),
                        submitBtnText : i18n.gettext('Done'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Functions'),
                                dataIndex : 'description',
                                flex : 1,
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : {},
                        excludedIds : Ext.Array.map(store.getRange(), function(item) {
                            return item.get(isAdminCard ? 'securityFunctionCd' : 'securityEssFunctionCd');
                        })
                    },
                    stores : {
                        inputStore : inputStore
                    }
                },
                allowEmptySelect : true,
                inputStoreLocalMode : true
            });

            selectWindow.on('selectRecords', this.onSelectFunction, this);
            selectWindow.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            selectWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        handleAddDocumentLocations : function() {
            let me = this,
                vm = this.getViewModel(),
                record = vm.get('record'),
                recordId = record.getId(),
                store = record.documentLocations(),
                inputStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.DOCUMENT_LOCATION_TYPE),
                selectWindow;

            inputStore.sort('description', 'ASC');

            selectWindow = Ext.create('criterion.view.MultiRecordPicker', {
                modal : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 400,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Document Locations'),
                        submitBtnText : i18n.gettext('Done'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Document Locations'),
                                dataIndex : 'description',
                                flex : 1,
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : {},
                        excludedIds : Ext.Array.map(store.getRange(), function(item) {
                            return item.get('documentLocationCd');
                        })
                    },
                    stores : {
                        inputStore : inputStore
                    }
                },
                allowEmptySelect : true,
                inputStoreLocalMode : true
            });

            selectWindow.on('selectRecords', function(records) {
                Ext.Array.each(records, (record) => {
                    store.add({
                        securityProfileId : recordId,
                        documentLocationCd : record.getId()
                    });
                });
            }, this);

            selectWindow.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            selectWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        onSelectFunction : function(records) {
            var vm = this.getViewModel(),
                view = this.getView(),
                isAdminCard = vm.get('activeTab') === view.ADMIN_CARD,
                record = vm.get('record'),
                store = isAdminCard ? record.adminFunctions() : record.essFunctions(),
                data = {
                    securityProfileId : record.getId()
                },
                removed = store.getRemovedRecords(),
                newRecords = [];

            Ext.each(records, function(record) {
                var securityFunctionData,
                    acrudVal = parseInt(record.get('attribute1'), 10),
                    acrud = acrudVal && Ext.isNumber(acrudVal) ? Ext.String.leftPad(acrudVal.toString(2), 5, '0') : '00000';

                securityFunctionData = Ext.clone(data);

                if (isAdminCard) {
                    securityFunctionData['securityFunctionCd'] = record.getId();

                    securityFunctionData['accessLevel'] = acrud;
                    securityFunctionData['acrud'] = acrud;

                } else {
                    securityFunctionData['securityEssFunctionCd'] = record.getId();
                }

                securityFunctionData['securityFunctionName'] = record.get('description');

                var removedRecord = Ext.Array.findBy(removed, function(removedRecord) {
                    return securityFunctionData['securityFunctionCd'] === removedRecord.get('securityFunctionCd');
                });

                if (removedRecord) {
                    removedRecord.set(securityFunctionData);
                    newRecords.push(removedRecord);
                } else {
                    newRecords.push(securityFunctionData)
                }
            });

            store.add(newRecords)
        },

        handleRemoveSecurityChildRecord : function(record) {
            record.drop();
        }
    };

});

