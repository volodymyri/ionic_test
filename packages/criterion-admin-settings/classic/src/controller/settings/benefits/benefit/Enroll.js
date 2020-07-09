Ext.define('criterion.controller.settings.benefits.benefit.Enroll', function() {

    return {

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.store.employer.benefitPlan.EligibleEmployees'
        ],

        alias : 'controller.criterion_settings_benefits_benefit_enroll',

        onShow : function() {
            var me = this,
                employees = this.getStore('employees'),
                vm = this.getViewModel(),
                view = this.getView();

            view.setLoading(true);

            employees.getProxy().setExtraParam('benefitPlanId', vm.get('planRecord.id'));

            employees.loadWithPromise()
                .then(function() {
                    view.lookup('optionGroups').items.each(function(field) {
                        var selection = field.getSelection && field.getSelection();

                        if (!selection) {
                            return
                        }

                        var isAllowBeneficiaryFieldName = 'isAllowBeneficiary_' + field.optionGroup,
                            isAllowDependentFieldName = 'isAllowDependent_' + field.optionGroup;

                        employees.each(function(record) {
                            var allowValue = {};
                            allowValue[isAllowBeneficiaryFieldName] = selection && selection.get('isAllowBeneficiary') || false;
                            allowValue[isAllowDependentFieldName] = selection && selection.get('isAllowDependent') || false;
                            record.set(allowValue);
                        });
                    });

                    view.reconfigure(employees, me._createColumns());
                    view.setLoading(false);

                }).otherwise(function() {
                view.setLoading(false);
            });
        },

        _createColumns : function() {
            var vm = this.getViewModel(),
                planRecord = vm.get('planRecord'),
                hasBeneficiaries = false,
                hasDependents = false;

            if (!planRecord) {
                throw ('No planRecord passed.');
            }

            var columns = [
                {
                    text : i18n.gettext('Employee'),
                    dataIndex : 'employeeName',
                    flex : 1,
                    minWidth : 200
                }
            ];

            // grid.reconfigure fires Ext.grid.RowContext.free() which removes 'record' from widget's vm.
            // store is null at this moment. that raises "Cannot read property 'getCount' of null" at Ext.form.field.Tag.setValue
            var setWidgetStore = function(store) {
                if (!store) {
                    store = Ext.create('Ext.data.Store', {
                        data : []
                    });
                    this.valueStore = Ext.create('Ext.data.Store', {
                        model : store.getModel(),
                        proxy : 'memory',
                        useModelWarning : false
                    });
                }
                this.superclass.setStore.apply(this, [store]);
            };

            Ext.Array.each(planRecord.getGroupFields(), function(fieldName, idx) {
                if (planRecord.get(fieldName)) {
                    var ogIdx = idx + 1;

                    var column = {
                        xtype : 'criterion_widgetcolumn',
                        text : planRecord.get(fieldName),
                        flex : 1,
                        updateRecord : true,
                        dataIndex : 'optionGroup' + ogIdx,
                        minWidth : 200
                    };

                    if (planRecord.get(Ext.String.format('optionGroup{0}IsManual', ogIdx))) {
                        columns.push(Ext.apply(column, {
                            widget : {
                                xtype : 'numberfield',
                                emptyText : i18n.gettext('Use default'),
                                bind : {
                                    disabled : '{!record.selected}'
                                }
                            }
                        }));
                    } else {
                        var store = Ext.create('criterion.store.employer.benefit.Options');

                        planRecord.options().each(function(option) {
                            if (option.get('isActive') && option.get('optionGroup') == ogIdx) {
                                store.add(option);
                                if (option.get('isAllowBeneficiary')) {
                                    hasBeneficiaries = true;
                                }
                                if (option.get('isAllowDependent')) {
                                    hasDependents = true;
                                }
                            }
                        });

                        column = Ext.apply(column, {
                            widget : {
                                xtype : 'combobox',
                                queryMode : 'local',
                                store : store,
                                displayField : 'code',
                                valueField : 'id',
                                emptyText : i18n.gettext('Use default'),
                                bind : {
                                    disabled : '{!record.selected}'
                                },
                                listeners : {
                                    change : function() {
                                        var selection = this.getSelection(),
                                            isAllowBeneficiaryFieldName = 'isAllowBeneficiary_' + ogIdx,
                                            isAllowDependentFieldName = 'isAllowDependent_' + ogIdx,
                                            setAllowValue = {};

                                        setAllowValue[isAllowBeneficiaryFieldName] = selection && selection.get('isAllowBeneficiary') || false;
                                        setAllowValue[isAllowDependentFieldName] = selection && selection.get('isAllowDependent') || false;

                                        this.getWidgetRecord().set(setAllowValue);
                                    }
                                }

                            }
                        });

                        columns.push(column);
                    }
                }
            });

            if (hasBeneficiaries) {
                columns.push(
                    {
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Beneficiaries'),
                        flex : 1,
                        minWidth : 200,
                        updateRecord : true,

                        widget : {
                            xtype : 'criterion_tagfield',
                            valueField : 'id',
                            displayField : 'name',
                            stacked : true,
                            value : null,
                            bind : {
                                value : '{record.beneficiaries}',
                                store : '{record.contacts}',
                                disabled : '{record.widgetBeneficiary_disabled}'
                            },
                            queryMode : 'local',
                            listeners : {
                                disable : function(tagfield) {
                                    tagfield.clearValue();
                                },
                                storechange : function(field, store) {
                                    var record = field.$widgetRecord,
                                        beneficiaries;

                                    if (record && store) {
                                        beneficiaries = record.get('beneficiaries');
                                        field.setValue(beneficiaries);
                                    }
                                }
                            },
                            setStore : setWidgetStore
                        }
                    }
                )
            }

            if (hasDependents) {
                columns.push(
                    {
                        xtype : 'criterion_widgetcolumn',
                        text : i18n.gettext('Dependents'),
                        flex : 1,
                        minWidth : 200,
                        updateRecord : true,

                        widget : {
                            xtype : 'criterion_tagfield',
                            valueField : 'id',
                            stacked : true,
                            displayField : 'name',
                            value : null,
                            bind : {
                                value : '{record.dependents}',
                                store : '{record.contacts}',
                                disabled : '{record.widgetDependent_disabled}'
                            },
                            queryMode : 'local',
                            listeners : {
                                disable : function(tagfield) {
                                    tagfield.clearValue();
                                },
                                storechange : function(field, store) {
                                    var record = field.$widgetRecord,
                                        dependents;

                                    if (record && store) {
                                        dependents = record.get('dependents');
                                        field.setValue(dependents);
                                    }
                                }
                            },
                            setStore : setWidgetStore
                        }
                    }
                )
            }

            return columns
        },

        onBeforeReconfigure : function() {
            this.getView().setLoading(true);
        },

        onReconfigure : function() {
            this.getView().setLoading(false);
        },

        onDeselect : function(cmp, record, index, eOpts) {
            record.set('selected', false);
            this.getViewModel().set('selected', cmp.getSelection().length);
        },

        onSelect : function(cmp, record, index, eOpts) {
            record.set('selected', true);
            this.getViewModel().set('selected', cmp.getSelection().length);
        },

        onRefresh : function() {
            var view = this.getView(),
                selection = view.getSelection();

            Ext.Array.each(selection, function(record) {
                record.set('selected', true);
            })
        },

        onCancel : function() {
            this.getView().close();
        },

        onEnroll : function() {
            var view = this.getView(),
                jsonData = {
                    defaultOptions : [],
                    customOptions : []
                },
                planRecord = this.getViewModel().get('planRecord'),
                employees = this.getStore('employees'),
                usedGroups = [];

            if (!view.isValid()) {
                return;
            }

            this.lookupReference('optionGroups').items.each(function(field) {
                jsonData.defaultOptions.push({
                    optionGroup : field.optionGroup,
                    value : field.getValue()
                });

                usedGroups.push(field.optionGroup);
            });

            Ext.Array.each(view.getSelectionModel().getSelection(), function(employee) {
                var data = employee.getData(),
                    employeeData = {
                        employeeId : data.id,
                        optionGroups : []
                    },
                    beneficiaries = employee.get('beneficiaries'),
                    dependents = employee.get('dependents');

                employeeData['beneficiaries'] = beneficiaries || [];
                employeeData['dependents'] = dependents || [];

                Ext.Array.each(planRecord.getGroupFields(), function(fieldName, idx) {
                    var ogIdx = idx + 1;

                    if (usedGroups.indexOf(ogIdx) == -1) {
                        return
                    }

                    if (data.hasOwnProperty('optionGroup' + ogIdx)) {
                        var groupValues = {
                            optionGroup : ogIdx,
                            value : data['optionGroup' + ogIdx]
                        };
                    }
                    employeeData.optionGroups.push(groupValues);
                });
                jsonData.customOptions.push(employeeData);
            });

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN_ENROLL,
                urlParams : {
                    benefitPlanId : planRecord.getId()
                },
                jsonData : jsonData,
                method : 'POST'
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Success.'));
                view.destroy();
            })
        }

    };

});