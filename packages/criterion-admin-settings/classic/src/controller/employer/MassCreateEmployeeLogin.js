Ext.define('criterion.controller.employer.MassCreateEmployeeLogin', function() {

    return {
        alias : 'controller.criterion_employer_mass_create_employee_login',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.view.employee.ResetPassword',
            'criterion.store.security.Profiles'
        ],

        lastLoadParams : {},

        init : function() {
            this.searchTextHandler = Ext.Function.createBuffered(this.searchTextHandler, 500, this);

            this.callParent(arguments);
        },

        onShow : function() {
            var me = this,
                vm = this.getViewModel(),
                employeeGroups = vm.getStore('employeeGroups');

            employeeGroups.loadWithPromise({
                params : {
                    employerId : vm.get('employerId')
                }
            }).then(function() {
                me.loadWithParams();
            });
        },

        loadWithParams : function(params) {
            var vm = this.getViewModel(),
                storeParams = vm.get('storeParams') || {},
                store = vm.getStore('employeeSearch'),
                proxy = store.getProxy(),
                resParams = Ext.Object.merge({
                    isExisted : vm.get('isExisted')
                }, storeParams, params || {});

            proxy.setExtraParams(resParams);
            store.load();

            this.lastLoadParams = resParams;
        },

        handleSecurityProfileSelect : function() {
            var vm = this.getViewModel(),
                picker = Ext.create('criterion.view.RecordPicker', {
                    title : i18n.gettext('Select Security Profile'),
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            height : '90%',
                            width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                            modal : false
                        }
                    ],
                    modal : false,
                    cls : 'criterion-modal',
                    searchFields : [
                        {
                            fieldName : 'name', displayName : i18n.gettext('Profile Name')
                        }
                    ],
                    columns : [
                        {
                            text : i18n.gettext('Profile Name'),
                            dataIndex : 'name',
                            width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                        },
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('Module'),
                            dataIndex : 'module',
                            encodeHtml : false,
                            renderer : function(value) {
                                return criterion.Utils.getSecurityBinaryNamesFromInt(criterion.Consts.SECURITY_MODULES, value).join("<br />");
                            }
                        },
                        {
                            xtype : 'booleancolumn',
                            header : i18n.gettext('Full Access'),
                            align : 'center',
                            dataIndex : 'hasFullAccess',
                            trueText : '✓',
                            falseText : '',
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                        }
                    ],
                    store : Ext.create('criterion.store.security.Profiles', {
                        pageSize : 10
                    })
                });

            picker.show();

            picker.on('select', function(profileRecord) {
                vm.set({
                    securityProfileId : profileRecord.get('id'),
                    securityProfile : profileRecord.get('name')
                })
            });
        },

        handleChangeEmployeeGroups : function(cmp, value) {
            if (Ext.isArray(value) && value.length) {
                this.loadWithParams({
                    'employeeGroupIds' : value.join(',')
                });
            } else {
                this.loadWithParams()
            }
        },

        handleChangeExistedSetting() {
            let me = this;

            Ext.defer(() => {
                me.loadWithParams();
            }, 100);
        },

        searchTextHandler : function(searchText, newValue) {
            var currentSelFilter = this.getViewModel().get('searchCombo.selection'),
                params = {};

            if (newValue !== '') {
                params[currentSelFilter.get('dataIndex')] = newValue;
            }

            this.loadWithParams(params);
        },

        clearFilters : function() {
            this.lookup('searchText').setValue();
            this.lookup('employeeGroupsField').setValue([])
        },

        onSelectionChange : function(grid, selected) {
            this.getViewModel().set({
                selectedCount : selected.length,
                employeesIds : Ext.Array.map(selected, function(rec) {
                    return rec.getId()
                })
            });
        },

        handleSubmitClick : function() {
            var me = this,
                vm = this.getViewModel(),
                form = me.getView(),
                massMode = vm.get('selectedCount') > 1;

            if (form.isValid()) {
                let vm = this.getViewModel(),
                    resetWnd = Ext.create('criterion.view.employee.ResetPassword', {
                        title : i18n.gettext('Temporary Password'),
                        viewModel : {
                            data : {
                                massMode : massMode,
                                email : !massMode ? this.lookup('grid').getSelection()[0].get('email') : null,
                                resetButtonText : i18n.gettext('Create'),
                                statusText : Ext.String.format(
                                    i18n.gettext('Create logins for {0} employees with security profile "{1}"?'), vm.get('selectedCount'), vm.get('securityProfile')
                                )
                            }
                        },
                        alwaysOnTop : true,
                        modal : true
                    });

                resetWnd.show();

                resetWnd.on('reset', resetData => {
                    if (massMode) {
                        delete resetData['forceReset'];
                    }

                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.MASS_LOGIN,
                        method : 'POST',
                        jsonData : Ext.applyIf({
                            employerId : vm.get('employerId'),
                            securityProfileId : vm.get('securityProfileId'),
                            isEnable2FA : vm.get('isEnable2FA'),
                            employees : vm.get('employeesIds')
                        }, resetData)
                    }).then(
                        function() {
                            criterion.Utils.toast(i18n._('Success.'));
                            resetWnd.close();
                            me.loadWithParams(me.lastLoadParams);
                        }
                    );
                });
            } else {
                me.focusInvalidField();
            }
        },

        handleResetPassword() {
            let me = this,
                vm = this.getViewModel(),
                massMode = vm.get('selectedCount') > 1,
                resetWnd = Ext.create('criterion.view.employee.ResetPassword', {
                    viewModel : {
                        data : {
                            massMode : massMode,
                            email : !massMode ? this.lookup('grid').getSelection()[0].get('email') : null,
                        }
                    },
                    alwaysOnTop : true,
                    modal : true
                });

            resetWnd.show();

            resetWnd.on('reset', resetData => {
                let employeeIds = vm.get('employeesIds'),
                    requestData = {
                        employees : employeeIds
                    };

                if (employeeIds && employeeIds.length) {
                    if (massMode) {
                        delete resetData['forceReset'];
                    }

                    requestData = Ext.applyIf(requestData, resetData);

                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.MASS_LOGIN_RESET_PASSWORD,
                        jsonData : requestData,
                        method : 'POST'
                    }).then(() => {
                        criterion.Utils.toast(i18n._('Success.'));
                        me.loadWithParams(me.lastLoadParams);
                    });
                }

                resetWnd.close();
            });
        },

        handleUnlock() {
            let me = this,
                employeeIds = this.getViewModel().get('employeesIds');

            if (employeeIds && employeeIds.length) {
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.MASS_LOGIN_UNLOCK_LOGIN,
                    jsonData : {
                        employees : employeeIds
                    },
                    method : 'POST'
                }).then(() => {
                    criterion.Utils.toast(i18n._('Success.'));
                    me.loadWithParams(me.lastLoadParams);
                });
            }

        }
    };

});
