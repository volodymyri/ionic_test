Ext.define('criterion.controller.reports.ReportOptions', function() {

    var uniqueAvailableFiltersStore,
        PAYDATES_LIST_LIMIT = 50,
        paydatesIsUpdating = false,
        phantomFilters = [];

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_reports_options',

        requires : [
            'criterion.store.employer.payroll.Schedules',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods'
        ],

        createAllFieldsStore : function(allowBlank) {
            var records = this.getViewModel().get('availOptionsRecord').filters().getRange(),
                newStore = Ext.create('Ext.data.Store', {
                    fields : ['id', 'displayName', 'fieldName']
                });

            if (allowBlank) {
                records.unshift({
                    displayName : 'None',
                    fieldName : null
                });
            }

            newStore.loadData(records);

            return newStore;
        },

        onResize : function() {
            var view = this.getView();

            if (view.getHeight() + view.getLocalY() > Ext.getBody().getHeight()) {
                view.setHeight(Ext.getBody().getHeight() - view.getLocalY());
            }

            view.updateLayout();
        },

        load : function(show) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                optionsRecord = vm.get('optionsRecord'),
                optionsAvailRecord = vm.get('availOptionsRecord'),
                codeTableIds = [],
                optionsRecordFiltersStore = optionsRecord.filters(),
                hasPredefinedFilters = optionsRecordFiltersStore.count() > 0,
                optionsRecordGroupBy = optionsRecord.groupBy(),
                optionsRecordOrderBy = optionsRecord.orderBy(),
                optionsRecordHiddenColumns = optionsRecord.hiddenColumns(),
                tableSettings = optionsRecord.tableSettings().getData(),
                currentOptions = vm.get('currentOptions'),
                availableFormatsStore = vm.getStore('availableFormatsStore');

            view.setLoading(true);

            if (vm.get('showFormats')) {
                if (optionsAvailRecord && optionsAvailRecord.get('availableFormats') && optionsAvailRecord.get('availableFormats').length) {
                    Ext.Array.each(optionsAvailRecord.get('availableFormats'), function(formatItem) {
                        availableFormatsStore.add({
                            id : formatItem,
                            text : formatItem.toUpperCase()
                        });
                    });

                    if (availableFormatsStore.count()) {
                        me.lookup('reportFormat').setValue(currentOptions && currentOptions['reportFormat'] || availableFormatsStore.getAt(0).getId());
                    }
                }
            }

            if (currentOptions) {
                currentOptions.groupBy && currentOptions.groupBy.length && optionsRecordGroupBy.add(currentOptions.groupBy);
                currentOptions.orderBy && currentOptions.orderBy.length && optionsRecordOrderBy.add(currentOptions.orderBy);
                currentOptions.hiddenColumns && currentOptions.hiddenColumns.length && optionsRecordHiddenColumns.add(currentOptions.hiddenColumns);
            }

            tableSettings && optionsAvailRecord && optionsAvailRecord.filters().each(function(filter) {
                filter.set('tableSettings', tableSettings)
            });

            uniqueAvailableFiltersStore = Ext.create('Ext.data.Store', {
                model : 'criterion.model.reports.options.AvailableFilter',
                sorters : [{
                    property : 'displayName',
                    direction : 'ASC'
                }],
                filters : [
                    {
                        property : 'type',
                        operator : 'in',
                        value : Ext.Object.getValues(criterion.Consts.REPORT_FILTER_TYPE)
                    }
                ]
            });

            optionsAvailRecord && optionsAvailRecord.filters().each(function(filter) {
                var codeTableName = filter.get('codeTableName');

                if (codeTableName) {
                    codeTableIds.push(codeTableName);
                }

                if (hasPredefinedFilters) {
                    var predefinedFilter = optionsRecordFiltersStore.getById(filter.get('tableAlias'));

                    if (predefinedFilter && Ext.Array.indexOf(predefinedFilter.get('fields'), filter.get('alias').replace(filter.get('tableAlias') + '.', '')) > -1) {
                        uniqueAvailableFiltersStore.add(filter.getData());
                    }
                } else {
                    uniqueAvailableFiltersStore.add(filter.getData());
                }

            });

            if (codeTableIds.length) {
                criterion.CodeDataManager.load(codeTableIds, function() {
                    this.createItems(show);
                }, this);
            } else {
                this.createItems(show);
            }

            view.parentView.setLoading(false);
            view.setLoading(false);
        },

        createItems : function(show) {
            var employerContainer = this.lookup('employer'),
                filtersContainer = this.lookup('filters'),
                columnsContainer = this.lookup('columns'),
                groupersContainer = this.lookup('groupers'),
                sortersContainer = this.lookup('sorters'),
                parametersContainer = this.lookup('parameters'),
                vm = this.getViewModel(),
                view = this.getView(),
                availableOptions;

            availableOptions = vm && vm.get('availOptionsRecord');

            if (!availableOptions
                || !employerContainer
                || !parametersContainer
                || !filtersContainer
                || !columnsContainer
                || !sortersContainer
                || !groupersContainer
            ) {
                // possible destroyed state ?
                return;
            }

            employerContainer.setHidden(!availableOptions.get('hasEmployerFilter'));
            parametersContainer.setHidden(!availableOptions.parameters().count());
            filtersContainer.setHidden(!availableOptions.filters().count());
            columnsContainer.setHidden(!availableOptions.availableColumns().count());
            sortersContainer.setHidden(!availableOptions.orderBy().count());

            parametersContainer.removeAll();
            parametersContainer.add(this.createParameters());

            filtersContainer.removeAll();
            filtersContainer.add(this.createParameters(true));
            filtersContainer.add(this.createFilters());

            columnsContainer.removeAll();
            columnsContainer.add(this.createDisplayColumns());

            sortersContainer.removeAll();
            sortersContainer.add(this.createSorters());

            groupersContainer.removeAll();
            groupersContainer.add(this.createGroupers());
            groupersContainer.setHidden(!availableOptions.groupBy().count() && !groupersContainer.query('criterion_report_parameter').length);

            show && Ext.defer(view.show, 100, view);
        },

        createParameterComponent : function(parameter) {
            var view = this.getView();

            return {
                xtype : 'criterion_report_parameter',
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                fieldLabel : parameter.get('label') + (parameter.get('mandatory') ? ' <sup class="criterion-fieldLabelMark">(required)</sup>' : ''),
                parameterRecord : parameter,
                hidden : parameter.get('hidden'),
                parentView : view,
                flex : 1
            };
        },

        createFilterComponent : function(filter) {
            var filters = this.getViewModel().get('optionsRecord').filters(),
                items = [
                    {
                        xtype : 'criterion_report_filter',
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                        fieldLabel : this.getFilterDisplayName(filter.getId()),
                        filterRecord : filter,
                        flex : 1
                    }
                ];

            items.push({
                xtype : 'button',
                text : i18n.gettext('Remove'),
                cls : 'criterion-btn-remove',
                margin : '0 0 0 10',
                hidden : true,
                bind : {
                    hidden : '{!advancedMode}'
                },
                listeners : {
                    click : function(btn) {
                        var wrapper = btn.up();

                        filters.remove(filter);
                        wrapper.destroy();
                    }
                }
            });

            return {
                xtype : 'container',
                layout : 'hbox',
                items : items
            }
        },

        createParameters : function(isAdvanced) {
            var me = this,
                vm = this.getViewModel(),
                currentOptions = vm.get('currentOptions'),
                currentParameters = currentOptions && currentOptions.parameters,
                parameters = vm.get('availOptionsRecord').parameters(),
                items = [],
                optionsRecord = vm.get('optionsRecord'),
                showPeriods = parseInt(optionsRecord.get('showPeriods'), 10),
                advancedParams = optionsRecord.get('advancedParams'),
                groupByParams = optionsRecord.get('groupByParams'),
                showAdvanced = false;

            parameters.each(function(parameter) {
                var paramName = parameter.get('name');

                if (
                    (!isAdvanced && Ext.Array.contains(advancedParams, paramName)) ||
                    (isAdvanced && !Ext.Array.contains(advancedParams, paramName)) ||
                    Ext.Array.contains(groupByParams, paramName)
                ) {
                    return
                }

                var lowerParamName = paramName && paramName.toLowerCase();

                if (currentParameters) {
                    var settedParameter = currentParameters.filter(function(element) {
                        return (element.name === parameter.get('name'));
                    });

                    if (settedParameter.length) {
                        parameter.set({
                            value : settedParameter[0].value,
                            textHelper : settedParameter[0].textHelper
                        });

                        if (Ext.Array.contains(advancedParams, paramName)) {
                            showAdvanced = true;
                        }
                    }
                }

                if ((lowerParamName === 'begindate' || lowerParamName === 'startdate') && showPeriods) {
                    var payDateStore = Ext.create('Ext.data.Store', {
                            fields : [
                                {
                                    name : 'text',
                                    type : 'string'
                                },
                                {
                                    name : 'value',
                                    type : 'string'
                                }
                            ]
                        }),
                        schedulesStore = Ext.create('criterion.store.employer.payroll.Schedules'),
                        payPeriodsStore = Ext.create('criterion.store.employer.payroll.payrollSchedule.PayrollPeriods'),
                        employerParameter = currentParameters && Ext.Array.findBy(currentParameters, function(param) {
                            return param.name === 'employerId';
                        }),
                        periodsData = [];

                    vm.set('payDateValue', employerParameter && employerParameter.value && vm.get('payDateValue'));

                    if (showPeriods === 1) {
                        periodsData.push({value : 'payDate', title : i18n.gettext('Pay Date')});
                    } else if (vm.get('reportPeriod') === 'payDate') {
                        vm.set('reportPeriod', 'custom');
                    }

                    periodsData.push({
                        value : 'payPeriod',
                        title : i18n.gettext('Pay Period')
                    });

                    periodsData.push(
                        {
                            value : 'custom',
                            title : (showPeriods === 1) ? i18n.gettext('Custom') : i18n.gettext('Choose Start/End')
                        },
                        {value : 'thisMonth', title : i18n.gettext('This Month')},
                        {value : 'thisQuarter', title : i18n.gettext('This Quarter')},
                        {value : 'thisYear', title : i18n.gettext('This Year')},
                        {value : 'lastMonth', title : i18n.gettext('Last Month')},
                        {value : 'lastQuarter', title : i18n.gettext('Last Quarter')},
                        {value : 'lastYear', title : i18n.gettext('Last Year')}
                    );

                    items.push(
                        {
                            xtype : 'combo',
                            fieldLabel : i18n.gettext('Report Period'),
                            sortByDisplayField : false,
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            store : Ext.create('Ext.data.Store', {
                                fields : ['value', 'title'],
                                data : periodsData
                            }),
                            displayField : 'title',
                            valueField : 'value',
                            bind : {
                                value : '{reportPeriod}'
                            },
                            listeners : {
                                // eslint-disable-next-line complexity
                                change : function(cmp, value) {
                                    var date = new Date(),
                                        endDate = new Date(),
                                        qm = Math.floor(date.getMonth() / 3) + 2,
                                        q = qm > 4 ? qm - 4 : qm,
                                        m = date.getMonth(),
                                        y = date.getFullYear();

                                    if (value) {
                                        switch (value) {
                                            case 'payDate':

                                                break;
                                            case 'custom':

                                                break;
                                            case 'thisMonth':
                                                vm.set({
                                                    startDate : Ext.Date.getFirstDateOfMonth(date),
                                                    endDate : Ext.Date.getLastDateOfMonth(date)
                                                });
                                                break;
                                            case 'thisQuarter':
                                                switch (q) {
                                                    case 1:
                                                        date.setMonth(9);
                                                        endDate.setMonth(11);
                                                        break;
                                                    case 2:
                                                        date.setMonth(0);
                                                        endDate.setMonth(2);
                                                        break;
                                                    case 3:
                                                        date.setMonth(3);
                                                        endDate.setMonth(5);
                                                        break;
                                                    case 4:
                                                        date.setMonth(6);
                                                        endDate.setMonth(8);
                                                        break;

                                                    // no default
                                                }

                                                vm.set({
                                                    startDate : Ext.Date.getFirstDateOfMonth(date),
                                                    endDate : Ext.Date.getLastDateOfMonth(endDate)
                                                });
                                                break;
                                            case 'thisYear':
                                                date.setMonth(0);
                                                endDate.setMonth(11);
                                                vm.set({
                                                    startDate : Ext.Date.getFirstDateOfMonth(date),
                                                    endDate : Ext.Date.getLastDateOfMonth(endDate)
                                                });
                                                break;
                                            case 'lastMonth':
                                                if (m === 0) {
                                                    date.setYear(y - 1);
                                                    date.setMonth(11)
                                                } else {
                                                    date.setMonth(m - 1)
                                                }

                                                vm.set({
                                                    startDate : Ext.Date.getFirstDateOfMonth(date),
                                                    endDate : Ext.Date.getLastDateOfMonth(date)
                                                });
                                                break;
                                            case 'lastQuarter':
                                                switch (q) {
                                                    case 1:
                                                        date.setMonth(6);
                                                        endDate.setMonth(8);
                                                        break;
                                                    case 2:
                                                        date.setMonth(9);
                                                        date.setYear(y - 1);
                                                        endDate.setMonth(11);
                                                        endDate.setYear(y - 1);
                                                        break;
                                                    case 3:
                                                        date.setMonth(0);
                                                        endDate.setMonth(2);
                                                        break;
                                                    case 4:
                                                        date.setMonth(3);
                                                        endDate.setMonth(5);
                                                        break;

                                                    // no default
                                                }

                                                vm.set({
                                                    startDate : Ext.Date.getFirstDateOfMonth(date),
                                                    endDate : Ext.Date.getLastDateOfMonth(endDate)
                                                });

                                                break;
                                            case 'lastYear':
                                                date.setMonth(0);
                                                date.setYear(y - 1);
                                                endDate.setMonth(11);
                                                endDate.setYear(y - 1);
                                                vm.set({
                                                    startDate : Ext.Date.getFirstDateOfMonth(date),
                                                    endDate : Ext.Date.getLastDateOfMonth(endDate)
                                                });
                                                break;

                                            // no default
                                        }

                                        if (value !== 'payDate') {
                                            vm.set('payDateValue', null)
                                        }
                                    }
                                }
                            }
                        }
                    );

                    items.push(
                        {
                            xtype : 'combo',
                            fieldLabel : i18n.gettext('Payroll Schedule'),
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            reference : 'payrollSchedule',
                            store : schedulesStore,
                            bind : {
                                disabled : '{reportPeriod !== "payPeriod"}',
                                hidden : '{reportPeriod !== "payPeriod"}'
                            },
                            listeners : {
                                change : (cmp, payrollScheduleId) => {
                                    if (payrollScheduleId) {
                                        payPeriodsStore.load({
                                            params : {
                                                payrollScheduleId : payrollScheduleId
                                            }
                                        });
                                    } else {
                                        payPeriodsStore.removeAll();
                                    }
                                }
                            },
                            displayField : 'name',
                            valueField : 'id',
                            allowBlank : true,
                            queryMode : 'local',
                            emptyText : i18n.gettext('Not Selected')
                        },
                        {
                            xtype : 'combo',
                            fieldLabel : i18n.gettext('Pay Period'),
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            store : payPeriodsStore,
                            bind : {
                                disabled : '{!payrollSchedule.selection}',
                                hidden : '{reportPeriod !== "payPeriod"}'
                            },
                            listeners : {
                                change : (cmp, value) => {
                                    if (value) {
                                        let period = cmp.getSelection();

                                        vm.set({
                                            startDate : period.get('periodStartDate'),
                                            endDate : period.get('periodEndDate')
                                        });
                                    } else {
                                        vm.set({
                                            startDate : null,
                                            endDate : null
                                        });
                                    }
                                }
                            },
                            tpl : Ext.create(
                                'Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item {list-cls}">{number}, {periodStartDate:date} to {periodEndDate:date}</div>',
                                '</tpl>'
                            ),
                            displayTpl : Ext.create(
                                'Ext.XTemplate',
                                '<tpl for=".">',
                                '{number}, {periodStartDate:date} to {periodEndDate:date}',
                                '</tpl>'
                            ),
                            valueField : 'id',
                            editable : false,
                            allowBlank : true,
                            queryMode : 'local',
                            emptyText : i18n.gettext('Not Selected')
                        }
                    );

                    if (showPeriods === 1) {
                        items.push(
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Pay Date'),
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                sortByDisplayField : false,
                                resetOnDataChanged : true,
                                queryMode : 'local',
                                disabled : false,
                                store : payDateStore,
                                displayField : 'text',
                                valueField : 'value',
                                bind : {
                                    disabled : '{!usePayDate}',
                                    value : '{payDateValue}'
                                },
                                listeners : {
                                    select : function(cmp, selection) {
                                        if (selection) {
                                            let date = Ext.Date.parse(selection.get('value'), Ext.Date.defaultFormat);

                                            vm.set({
                                                startDate : date,
                                                endDate : date
                                            });
                                        }
                                    }
                                }
                            }
                        );
                    }

                    var onUpdateEmployerId = function(employerId) {
                        if (showPeriods === 1) {
                            if (paydatesIsUpdating) {
                                return;
                            }

                            paydatesIsUpdating = true;
                            payDateStore.removeAll();

                            var params = {
                                num : PAYDATES_LIST_LIMIT
                            };

                            if (employerId) {
                                params['employerId'] = employerId
                            }

                            criterion.Api.requestWithPromise({
                                url : criterion.consts.Api.API.LAST_PAY_DATES,
                                method : 'GET',
                                params : params
                            }).then(function(data) {
                                var dateFormat = Ext.Date.defaultFormat,
                                    startDate = me.lookup('startDate'),
                                    endDate = me.lookup('endDate');

                                if (employerId) {
                                    var employersStore = Ext.StoreManager.lookup('Employers'),
                                        employer = employersStore && employersStore.getById(employerId);

                                    if (employer) {
                                        dateFormat = employer.get('dateFormat');
                                    }
                                }

                                if (startDate) {
                                    startDate.format = dateFormat;
                                    startDate.setValue(startDate.getValue());
                                }

                                if (endDate) {
                                    endDate.format = dateFormat;
                                    endDate.setValue(endDate.getValue());
                                }

                                paydatesIsUpdating = false;
                                Ext.Array.each(data, function(val) {
                                    if ((/^\d{4}\.\d{2}\.\d{2}$/).test(val)) {
                                        val = val.replace(/\./g, '-');
                                    }

                                    let dVal = Ext.Date.parse(val, criterion.consts.Api.DATE_FORMAT_ISO),
                                        dValCorrect = Ext.Date.add(dVal, Ext.Date.HOUR, 1); // correction for Daylight Saving Time (DST);

                                    payDateStore.add({
                                        text : Ext.util.Format.date(dValCorrect, dateFormat),
                                        value : Ext.util.Format.date(dValCorrect, Ext.Date.defaultFormat)
                                    })
                                });
                            });
                        }

                        if (employerId) {
                            schedulesStore.load({
                                params : {
                                    employerId : employerId
                                }
                            });
                        } else {
                            schedulesStore.removeAll();
                        }
                    };

                    vm.bind('{optionsRecord.employerId}', onUpdateEmployerId);
                    vm.bind('{employerId}', onUpdateEmployerId);
                }

                if (isAdvanced && !!parameter.get('defaultValue')) {
                    showAdvanced = true;
                }

                items.push(me.createParameterComponent(parameter));
            }, this);

            vm.set('advancedMode', showAdvanced);

            return items;
        },

        createFilters : function() {
            var me = this,
                vm = this.getViewModel(),
                currentOptions = vm.get('currentOptions'),
                items = [],
                hasFilter = false;

            if (currentOptions && currentOptions.filters) {
                Ext.Array.each(currentOptions.filters, function(filter) {
                    var setFilter = Ext.create('criterion.model.reports.options.Filter', filter);

                    uniqueAvailableFiltersStore.remove(setFilter);
                    items.push(me.createFilterComponent(setFilter));
                    vm.get('optionsRecord').filters().add(filter);
                    hasFilter = true;
                })
            }

            if (hasFilter) {
                vm.set('advancedMode', true)
            }

            if (uniqueAvailableFiltersStore.count()) {
                items.push({
                    xtype : 'container',
                    layout : 'hbox',
                    margin : '20 0 0 0',
                    items : [
                        {
                            xtype : 'combobox',
                            store : uniqueAvailableFiltersStore,
                            displayField : 'displayName',
                            valueField : 'alias',
                            queryMode : 'local',
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            fieldLabel : i18n.gettext('New Filter'),
                            reference : 'newFilterCombo',
                            allowBlank : true,
                            forceSelection : true,
                            anyMatch : true,
                            matchFieldWidth : false
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Add'),
                            margin : '0 0 0 10',
                            listeners : {
                                click : 'addNewFilter'
                            }
                        }
                    ],
                    hidden : true,
                    bind : {
                        hidden : '{!advancedMode}'
                    }
                });
            } else {
                items.push({
                    xtype : 'component',
                    margin : '20 0 0 0',
                    html : i18n._('No filters available')
                });
            }

            return items;
        },

        addNewFilter : function() {
            var vm = this.getViewModel(),
                newFilterCombo = this.lookup('newFilterCombo'),
                fieldName = newFilterCombo.getValue(),
                filtersContainer = this.lookup('filters');

            var availFilterRecord = vm.get('availOptionsRecord').filters().getById(fieldName);

            if (!fieldName) {
                return;
            }

            var filter = Ext.create('criterion.model.reports.options.Filter', availFilterRecord.getData());

            uniqueAvailableFiltersStore.remove(uniqueAvailableFiltersStore.getById(fieldName));
            newFilterCombo.setValue(null);

            phantomFilters.push(vm.get('optionsRecord').filters().add(filter)[0]);

            filtersContainer.insert(filtersContainer.items.length - 1, this.createFilterComponent(filter));
        },

        createDisplayColumns : function() {
            var vm = this.getViewModel(),
                hiddenColumns = vm.get('optionsRecord').hiddenColumns(),
                allColumns = vm.get('availOptionsRecord').availableColumns(),
                items = [];

            allColumns.each(function(column) {
                var fieldId = column.getId();

                items.push({
                    xtype : 'checkbox',
                    fieldLabel : this.getColumnDisplayName(fieldId),
                    checked : !this.isColumnHidden(fieldId),
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                    _fieldId : fieldId,
                    listeners : {
                        change : function(field, newValue) {
                            if (newValue) {
                                hiddenColumns.remove(hiddenColumns.getById(fieldId));
                            } else {
                                hiddenColumns.add({
                                    fieldName : fieldId
                                });
                            }
                        }
                    }
                })
            }, this);

            return items;
        },

        createSorters : function() {
            var vm = this.getViewModel(),
                sorters = vm.get('optionsRecord').orderBy(),
                allSorters = vm.get('availOptionsRecord').orderBy(),
                allFields = this.createAllFieldsStore(false),
                items = [];

            allSorters.each(function(availSorter) {
                if (!sorters.getById(availSorter.getId())) {
                    sorters.add(availSorter.getData());
                }
            });

            sorters.sort([
                {
                    property : 'selected',
                    direction : 'DESC'
                },
                {
                    property : 'displayName',
                    direction : 'ASC'
                }
            ]);

            sorters.each(function(sorter, idx) {
                if (!sorter.get('selected')) {
                    sorter.set('selected', false);
                }

                if (!sorter.get('dir')) {
                    sorter.set('dir', 'asc');
                }

                if (!sorter.get('displayName')) {
                    var allFieldsRecord = allFields.findRecord('alias', sorter.get('fieldName')),
                        displayName = allFieldsRecord && allFieldsRecord.get('fieldName').replace(/\.|_/g, ' ').replace(/\w\S*/g, function(txt) {
                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                        }) || sorter.get('fieldName');

                    sorter.set('displayName', displayName);
                }

                items.push(
                    {
                        layout : 'hbox',
                        padding : '10 0 0 0',
                        viewModel : {
                            data : {
                                sorterValue : sorter.get('selected') ? sorter.get('fieldName') : ''
                            }
                        },
                        items : [
                            {
                                xtype : 'combobox',
                                store : sorters,
                                labelWidth : 70,
                                width : 320,
                                displayField : 'displayName',
                                valueField : 'fieldName',
                                disabled : idx > 0,
                                bind : {
                                    value : '{sorterValue}'
                                },
                                fieldLabel : i18n.gettext('Field ') + (idx + 1),
                                emptyText : i18n.gettext('Not selected'),
                                queryMode : 'local',
                                name : 'sorter_' + (idx + 1),
                                listeners : {
                                    change : function(field, newValue, oldValue) {
                                        sorters.clearFilter();

                                        var newRec = newValue && sorters.findRecord('fieldName', newValue),
                                            oldRec = oldValue && sorters.findRecord('fieldName', oldValue),
                                            recOnPlace = sorters.findRecord('idx', idx),
                                            nextCombo = Ext.query('[name=sorter_' + (idx + 2) + ']', false);

                                        if (newRec) {
                                            if (recOnPlace) {
                                                recOnPlace.set('idx', newRec.get('idx'))
                                            }

                                            newRec.set('selected', true);
                                            newRec.set('idx', idx);
                                        }

                                        if (oldRec) {
                                            oldRec.set('selected', false)
                                        }

                                        if (nextCombo.length) {
                                            nextCombo[0].component.setDisabled(!newValue);

                                            if (!newValue) {
                                                nextCombo[0].component.setValue();
                                            }
                                        }
                                    }
                                },
                                tpl : Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item" <tpl if="selected">hidden</tpl>>{displayName}</li>',
                                    '</tpl></ul>'),
                                allowBlank : true,

                                cls : 'criterion-hide-default-clear',
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        hideWhenEmpty : true
                                    }
                                }
                            },
                            {
                                xtype : 'button',
                                glyph : criterion.consts.Glyph[sorter.get('dir') && (sorter.get('dir').toLowerCase() === 'asc' ? 'arrow-up-b' : 'arrow-down-b') || 'arrow-up-b'],
                                cls : 'criterion-btn-transparent',
                                text : '',
                                textAlign : 'left',
                                direction : sorter.get('dir') && sorter.get('dir').toLowerCase() || 'asc',
                                disabled : true,
                                bind : {
                                    disabled : '{!sorterValue}'
                                },
                                listeners : {
                                    click : function(btn) {
                                        var rec = sorters.findRecord('idx', idx);

                                        if (btn.direction === 'asc') {
                                            btn.direction = 'desc';
                                            btn.setGlyph(criterion.consts.Glyph['arrow-down-b']);
                                            rec.set('dir', 'desc');
                                        } else {
                                            btn.direction = 'asc';
                                            btn.setGlyph(criterion.consts.Glyph['arrow-up-b']);
                                            rec.set('dir', 'asc');
                                        }
                                    }
                                }
                            }
                        ]
                    }
                )
            });

            return items;
        },

        createGroupers : function() {
            var me = this,
                vm = this.getViewModel(),
                groupers = vm.get('optionsRecord').groupBy(),
                allGroupers = vm.get('availOptionsRecord').groupBy(),
                allFields = this.createAllFieldsStore(false),
                items = [{items : []}, {items : []}],
                optionsRecord = vm.get('optionsRecord'),
                groupByParams = optionsRecord.get('groupByParams');

            if (groupByParams.length) {
                var parameters = vm.get('availOptionsRecord').parameters(),
                    currentOptions = vm.get('currentOptions'),
                    currentParameters = currentOptions && currentOptions.parameters;

                parameters.each(function(parameter) {
                    if (Ext.Array.contains(groupByParams, parameter.get('name'))) {
                        if (currentParameters) {
                            var settedParameter = currentParameters.filter(function(element) {
                                return (element.name === parameter.get('name'));
                            });

                            if (settedParameter.length) {
                                parameter.set({
                                    value : settedParameter[0].value,
                                    textHelper : settedParameter[0].textHelper
                                });
                            }
                        }

                        items[0].items.push(me.createParameterComponent(parameter));
                    }
                });
            }

            allGroupers.each(function(availGrouper) {
                var availGrouperId = availGrouper.getId();

                if (!groupers.getById(availGrouperId) && !Ext.isNumeric(availGrouperId)) {
                    groupers.add(availGrouper.getData());
                }
            });

            groupers.each(function(grouper, idx) {
                var fieldName = grouper.getId(),
                    container;

                if (Ext.isNumeric(fieldName)) {
                    return;
                }

                container = items[idx % items.length].items;

                container.push({
                    xtype : 'combobox',
                    store : allFields,
                    displayField : 'displayName',
                    valueField : 'fieldName',
                    value : grouper.get('fieldName'),
                    queryMode : 'local',
                    fieldLabel : i18n.gettext('Field ') + (idx + 1),
                    listeners : {
                        change : function(field, newValue) {
                            grouper.set('fieldName', newValue);
                        }
                    }
                })
            });

            return items;
        },

        getFilterDisplayName : function(fieldName) {
            var record = this.getViewModel().get('availOptionsRecord'),
                field = record.filters().getById(fieldName);

            return field && field.get('displayName');
        },

        getColumnDisplayName : function(fieldName) {
            var record = this.getViewModel().get('availOptionsRecord');

            return record.availableColumns().getById(fieldName).get('displayName');
        },

        isColumnHidden : function(fieldName) {
            var vm = this.getViewModel(),
                currentOptions = this.getViewModel().get('currentOptions');

            if (!currentOptions || !currentOptions.hiddenColumns) {
                var optionsRecord = vm.get('optionsRecord'),
                    hiddenColumns = optionsRecord.hiddenColumns();

                return !!hiddenColumns.getById(fieldName);
            }

            var isHidden = false;

            Ext.Object.each(currentOptions.hiddenColumns, function(idx, column) {
                if (column.fieldName === fieldName) {
                    isHidden = true;

                    return false;
                }
            });

            return isHidden;
        },

        onAdvancedClick : function() {
            var vm = this.getViewModel();

            vm.set('advancedMode', !vm.get('advancedMode'));
            this.onResize();
        },

        handleCancelClick : function() {
            let view = this.getView(),
                vm = this.getViewModel();

            vm.get('optionsRecord').orderBy().each(function(rec) {
                rec.set('selected', false)
            });

            vm.get('optionsRecord').filters().remove(phantomFilters);

            view.fireEvent('cancel');
            view.destroy();
        },

        handleSubmitClick : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                availOptions = vm.get('availOptionsRecord'),
                optionsRecord = vm.get('optionsRecord'),
                sorters = optionsRecord.orderBy(),
                parametersContainer = this.lookup('parameters'),
                filtersContainer = this.lookup('filters'),
                columnsContainer = this.lookup('columns'),
                reportFormat = this.lookup('reportFormat'),
                reportFormatValue = reportFormat && reportFormat.getValue(),
                invalidField, payload,
                parameters = [],
                payloadSorters = [],
                hiddenColumns = [],
                filters = [];

            if (!view.getForm().isValid()) {
                invalidField = view.getForm().getFields().findBy(function(field) {
                    return !field.isValid();
                });

                if (this.lookup('filters').down(invalidField)) {
                    vm.set('advancedMode', true);
                }

                return;
            }

            sorters.clearFilter();
            sorters.sort('idx');

            sorters.each(function(rec, idx) {
                payloadSorters.push({
                    key : 'order_' + (idx + 1),
                    fieldName : rec.get('fieldName'),
                    dir : rec.get('dir'),
                    displayName : rec.get('displayName'),
                    selected : rec.get('selected')
                })
            });

            payload = optionsRecord.getData({associated : true, serialize : true});

            payload.filters.forEach(function(filter) {
                delete filter['tableSettings'];

                if (!filter.hasOwnProperty('fields')) {
                    if (filter.type === criterion.Consts.REPORT_FILTER_TYPE.FILTER_BOOLEAN && !filter.hasOwnProperty('value')) {
                        filter['value'] = false;
                    }

                    filters.push(filter);
                }
            });

            delete payload['tableSettings'];

            payload.filters = filters;

            payload.orderBy = payloadSorters;
            sorters.sort();
            sorters.each(function(rec) {
                rec.set('selected', false)
            });

            parametersContainer.items && parametersContainer.items.each(function(parameterItem) {
                if (!parameterItem.getParameterRecord) {
                    return
                }

                var parameterRecord = parameterItem.getParameterRecord(),
                    paramName = parameterRecord.get('name');

                if (parameterRecord) {
                    var length = parameters.push(parameterRecord.getData({associated : false, persist : true}));

                    if (paramName.indexOf('mctd_') === 0 || paramName.indexOf('-m') === paramName.length - 2) {
                        var value = parameters[length - 1].value;

                        if (value) {
                            parameters[length - 1].value = value.toString();
                        }
                    }
                }
            });

            filtersContainer.items && filtersContainer.items.each(function(advancedParameterItem) {
                if (!advancedParameterItem.getParameterRecord) {
                    return
                }

                var parameterRecord = advancedParameterItem.getParameterRecord(),
                    paramName = parameterRecord.get('name');

                if (parameterRecord) {
                    var length = parameters.push(parameterRecord.getData({associated : false, persist : true}));

                    if (paramName.indexOf('mctd_') === 0 || paramName.indexOf('-m') === paramName.length - 2) {
                        var value = parameters[length - 1].value;

                        if (value) {
                            parameters[length - 1].value = value.toString();
                        }
                    }
                }
            });

            Ext.Array.each(this.lookup('groupers').query('criterion_report_parameter'), function(groupParameter) {
                if (!groupParameter.getParameterRecord) {
                    return
                }

                var groupParameterRecord = groupParameter.getParameterRecord();

                if (groupParameterRecord) {
                    parameters.push(groupParameterRecord.getData({associated : false, persist : true}));
                }
            });

            parameters.length && (
                payload['parameters'] = parameters
            );

            delete payload['id'];

            !availOptions.get('hasEmployerFilter') && delete payload['employerId'];

            columnsContainer.items.each(function(item) {
                if (!item.getValue()) {
                    hiddenColumns.push({
                        fieldName : item._fieldId
                    });
                }
            });

            payload.hiddenColumns = hiddenColumns;

            view.setLoading(true);

            if (vm.get('isMemorized')) {
                var url = criterion.consts.Api.API.MEMORIZED_REPORT_OPTIONS + '/' + vm.get('reportId'),
                    options = Ext.clone(payload);

                if (options && options.parameters && options.parameters.length) {
                    Ext.Array.each(options.parameters, function(param) {
                        if (Ext.Array.contains([
                            criterion.Consts.REPORT_FILTER_TYPE.FILTER_DATE,
                            criterion.Consts.REPORT_FILTER_TYPE.FILTER_LOCAL_DATE
                        ], param.valueType) && Ext.isDate(param.value)) {
                            param.value = Ext.Date.format(param.value, 'Y.m.d');
                        }
                    });
                }

                criterion.Api.request({
                    url : url,
                    method : 'PUT',
                    jsonData : options,
                    scope : this,
                    headers : {
                        'Content-Type' : 'text/plain'
                    },
                    callback : function(optionsCallback, success) {
                        view.setLoading(true);

                        if (success) {
                            view.fireEvent('saved', options);
                            view.setLoading(false);
                            criterion.Utils.toast(i18n.gettext('Options Saved.'));
                            view.destroy();
                        }
                    }
                })
            } else {
                if (payload.showPeriods) {
                    payload['reportPeriod'] = vm.get('reportPeriod');
                    payload['payDateValue'] = vm.get('payDateValue');
                }

                if (reportFormatValue) {
                    payload['reportFormat'] = reportFormatValue;
                }

                view.fireEvent('saved', payload);
                view.setLoading(false);
                view.destroy();
            }

        },

        onShow : function() {
            var cancelBtn = this.lookup('cancel'),
                vm = this.getViewModel(),
                employerCombo = this.lookup('employerCombo');

            vm && employerCombo && vm.set('optionsRecord.employerId', employerCombo.getValue());

            Ext.defer(function() {
                cancelBtn.focus();
            }, 100);
        },

        onEsc : function() {
            this.handleCancelClick();
        }
    }
});
