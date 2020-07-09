Ext.define('criterion.controller.Reports', function() {

        var Api = criterion.Api,
            ApiConfig = criterion.consts.Api,
            API = ApiConfig.API,
            REPORTS_URL = criterion.consts.Route.REPORTS,
            REPORTS_MEMORIZED_URL = criterion.consts.Route.REPORTS_MEMORIZED,
            defaultFormatChoice = 'pdf',
            currentOptions, optionsWindow,
            expandedNodes = Ext.create('Ext.util.Collection'),
            activeTask;

        return {

            extend : 'criterion.app.ViewController',

            alias : 'controller.criterion_reports',

            requires : [
                'criterion.view.reports.ReportOptions',
                'criterion.view.reports.Memorize',
                'criterion.model.reports.Status'
            ],

            moduleId : null,

            init : function() {
                var routes = {},
                    mainRoute = this.getView().mainRoute,
                    view = this.getView();

                routes[mainRoute.MAIN] = 'handleRoute';
                routes[mainRoute.MAIN + '/:id'] = 'handleRoute';

                if (view.getAllowAdminFeatures()) {
                    routes[mainRoute.MEMORIZED + '/:id'] = 'handleRouteMemorized';
                    routes[mainRoute.DATA_GRID] = 'handleRouteDataGrid';
                    routes[mainRoute.DATA_TRANSFER] = 'handleRouteDataTransfer';
                }

                this.setRoutes(routes);

                this.handleReportsFilter = Ext.Function.createBuffered(this.handleReportsFilter, 300);
                this.handleRoute = Ext.Function.createBuffered(this.handleRoute, 300); // prevent tree store not ready state

                this.callParent(arguments);
            },

            load : function(id, isMemorized, options, reloadStore) {
                var vm = this.getViewModel(),
                    store = vm.getStore('reportsTreeStore'),
                    filterField = this.lookup('filterField'),
                    filterFieldValue = filterField && filterField.getValue(),
                    optionsButton = this.lookup('options');

                Ext.isNumber(this.moduleId) && store.getProxy().setExtraParam('module', this.moduleId);

                if (typeof id === 'undefined') {
                    this.lookup('reportIframe').flush();
                    this.getViewModel().set('activeReport', null);
                }

                vm.set('addReportActivate', false);

                if (optionsButton && vm.get('reportProgress') === 1) {
                    optionsButton.setDisabled(false);
                }

                if (!store.isLoaded() || reloadStore) {
                    store.isFiltered() && store.clearFilter();

                    store.setRoot({
                        expanded : true,
                        id : 'root'
                    });

                    store.on('load', function() {
                        filterField && (filterFieldValue !== '') && filterField.fireEvent('change', filterField, filterFieldValue);

                        if (typeof id !== 'undefined') {
                            this.selectReport(id, isMemorized, options);
                        }
                    }, this, {single : true});
                } else {
                    if (typeof id !== 'undefined') {
                        this.selectReport(id, isMemorized, options);
                    }
                }
            },

            /**
             * @param [reportId]
             * @param [isMemorized]
             * @returns {string}
             */
            makeToken : function(reportId, isMemorized) {
                var mainRoute = this.getView().mainRoute;

                return mainRoute.MAIN
                    + (isMemorized ? '/memorized' : '')
                    + (typeof reportId !== 'undefined' ? '/' + reportId : '');
            },

            handleRoute : function(id) {
                if (id === undefined || Ext.isNumeric(id)) {
                    var activeReport = this.getViewModel().get('activeReport'),
                        dataTree = this.lookup('dataTree');

                    this.lookup('card').getLayout().setActiveItem(this.lookup('reports'));
                    dataTree && dataTree.getSelectionModel().deselectAll();

                    if (typeof id === 'undefined' || !activeReport || id !== activeReport.get('reportId')) {
                        this.load(id, false);
                    }
                }
            },

            handleRouteMemorized : function(id) {
                var activeReport = this.getViewModel().get('activeReport');

                this.lookup('card').getLayout().setActiveItem(this.lookup('reports'));
                this.lookup('dataTree').getSelectionModel().deselectAll();

                if (typeof id === 'undefined' || !activeReport || id !== activeReport.get('reportId')) {
                    this.load(id, true);
                }
            },

            handleRouteDataGrid : function() {
                this.lookup('card').getLayout().setActiveItem(this.lookup('dataGrid'));
                this.lookup('reportsTree').getSelectionModel().deselectAll();
            },

            handleRouteDataTransfer : function() {
                this.lookup('card').getLayout().setActiveItem(this.lookup('dataTransfer'));
                this.lookup('reportsTree').getSelectionModel().deselectAll();
            },

            selectReport : function(id, isMemorized, options) {
                var reportsTree = this.lookup('reportsTree'),
                    vm = this.getViewModel(),
                    reportsTreeStore = vm.getStore('reportsTreeStore'),
                    availableFormatsStore = vm.getStore('availableFormatsStore'),
                    reportFormat = this.lookup('reportFormat'),
                    selectedNode;

                currentOptions = options;

                reportsTreeStore.getRootNode().cascadeBy(function(node) {
                    if (node.get('reportId') === parseInt(id, 10) && node.get('memorized') === isMemorized) {
                        selectedNode = node;
                    }
                });

                if (selectedNode) {
                    reportsTree.expandPath(selectedNode.getPath('id'), 'id');
                    reportsTree.getSelectionModel().select(selectedNode, true);
                }

                reportFormat && availableFormatsStore.getCount() && reportFormat.setValue(availableFormatsStore.getAt(0).getId());

                this.processSelectReport(selectedNode);
            },

            showReport : function(report, checkOptions) {
                var me = this,
                    view = me.getView(),
                    vm = this.getViewModel(),
                    reportId = report.get('reportId'),
                    optionsRecord = vm.get('optionsRecord'),
                    optionsRecordId = optionsRecord.getId(),
                    memorized = report.get('memorized'),
                    options = Ext.clone(currentOptions),
                    reportFormat = this.lookup('reportFormat'),
                    reportsTree = this.lookup('reportsTree');

                vm.set('activeReport', report);

                if (checkOptions && (!optionsRecord || optionsRecordId !== reportId || !currentOptions)) {
                    if (!optionsRecord) {
                        optionsRecord = Ext.create('criterion.model.reports.Options', {id : reportId});
                    }

                    if (optionsRecord.phantom) {
                        optionsRecord.getProxy().setUrl(report.get('memorized') ?
                            criterion.consts.Api.API.MEMORIZED_REPORT_OPTIONS : optionsRecord.getProxy().setUrl(criterion.consts.Api.API.REPORT_OPTIONS));
                        optionsRecord.loadWithPromise().then(function() {
                            vm.set('optionsRecord', optionsRecord);

                            if (optionsRecord.get('showOnLaunch')) {
                                me._createOptionsWindow(true);
                            }
                        });
                    } else if (optionsRecord.get('showOnLaunch')) {
                        me._createOptionsWindow(true);
                    }
                } else {
                    var employeeId = criterion.Api.getEmployeeId(),
                        urlPath = memorized ? REPORTS_MEMORIZED_URL : REPORTS_URL,
                        queryParamsObj = {
                            reportId : reportId,
                            TenantId : Api.getTenantId(),
                            Authorization : Api.getToken(),
                            format : reportFormat ? reportFormat.getValue() : defaultFormatChoice // for ess default option
                        },
                        url;

                    if (!options || !options.parameters) {
                        if (!options) {
                            options = Ext.applyIf(vm.get('optionsRecord').getData({associated : true}), {parameters : []});
                        } else {
                            options['parameters'] = [];
                        }
                    }

                    options.parameters.push({
                        name : '_employeeId',
                        value : employeeId,
                        hidden : true,
                        mandatory : false,
                        isTransferParameter : false,
                        valueType : criterion.Consts.REPORT_FILTER_TYPE.FILTER_INTEGER
                    });

                    options.parameters.push({
                        name : '_isESS',
                        value : this.moduleId === criterion.Consts.REPORT_MODULE.SELF_SERVICE,
                        hidden : true,
                        mandatory : false,
                        isTransferParameter : false,
                        valueType : criterion.Consts.REPORT_FILTER_TYPE.FILTER_BOOLEAN
                    });

                    Ext.Array.each(options.parameters, function(param) {
                        if (Ext.Array.contains([
                            criterion.Consts.REPORT_FILTER_TYPE.FILTER_DATE,
                            criterion.Consts.REPORT_FILTER_TYPE.FILTER_LOCAL_DATE
                        ], param.valueType) && Ext.isDate(param.value)) {
                            param.value = Ext.Date.format(param.value, 'Y.m.d');
                        }
                    });

                    url = Ext.String.format('{0}?{1}', urlPath, Ext.Object.toQueryString(queryParamsObj));

                    if (!view.isMasked()) {
                        view.setLoadingDots(true);
                    }

                    if (memorized) {
                        criterion.Api.request({
                            url : url,
                            method : 'GET',
                            scope : me,
                            success : response => {
                                reportsTree.setDisabled(false);
                                me.startCheckingStatus(reportId);
                            },
                            failure : _ => {
                                reportsTree.setDisabled(false);
                                view.setLoadingDots(false);
                            }
                        });
                    } else {
                        vm.set({
                            reportProgress : 0
                        });

                        criterion.Api.submitFakeForm([], {
                            url : url,
                            scope : this,
                            extraData : {
                                options : Ext.encode(options)
                            },

                            success : response => {
                                reportsTree.setDisabled(false);
                                me.startCheckingStatus(reportId);
                            },
                            failure : _ => {
                                reportsTree.setDisabled(false);
                                view.setLoadingDots(false);
                            }
                        });
                    }

                    Ext.History.add(this.makeToken(reportId, memorized), true);
                }
            },

            processSelectReport : function(node) {
                var me = this,
                    view = me.getView(),
                    vm = me.getViewModel(),
                    reportsTree = me.lookup('reportsTree'),
                    activeReport = vm.get('activeReport'),
                    availableFormatsStore = vm.getStore('availableFormatsStore'),
                    reportId = node.get('reportId'),
                    optionsRecord = Ext.create('criterion.model.reports.Options', {id : reportId}),
                    optionsAvailRecord = Ext.create('criterion.model.reports.AvailableOptions', {id : reportId}),
                    isMemorized = node.get('memorized'),
                    formatsData = [], currentFormat,
                    reportUrl = isMemorized ? API.MEMORIZED_REPORT_DOWNLOAD : API.REPORT_DOWNLOAD,
                    statusUrl = isMemorized ? API.MEMORIZED_REPORT_STATUS : API.REPORT_STATUS;

                me.lookup('reportIframe').flush();

                if (isMemorized) {
                    optionsRecord.getProxy().setUrl(API.MEMORIZED_REPORT_OPTIONS);
                    optionsAvailRecord.getProxy().setUrl(API.MEMORIZED_REPORT_AVAILABLE_OPTIONS);
                } else {
                    optionsRecord.getProxy().setUrl(API.REPORT_OPTIONS);
                    optionsAvailRecord.getProxy().setUrl(API.REPORT_AVAILABLE_OPTIONS);
                }

                if (node.isLeaf() && reportId) {

                    view.setLoadingDots(true);

                    if (me.destroyActiveTask()) {
                        vm.set('reportProgress', 0);
                    }

                    let status = Ext.create('criterion.model.reports.Status', {
                            id : reportId
                        }), statusProxy = status.getProxy(),
                        reportOptions = null,
                        reportFormat = me.lookup('reportFormat');

                    statusProxy.setUrl(statusUrl);

                    statusProxy.setExtraParam('initialCheck', true);

                    status.loadWithPromise().then(reportStatus => {

                        if (reportStatus.get('statusCode') === criterion.Consts.REPORT_GENERATION_STATUS_CODES.COMPLETED) {
                            me.lookup('reportIframe').setSrc(Ext.String.format(reportUrl, reportStatus.get('reportGenerationTaskId')));

                            reportOptions = reportStatus.get('options');

                            if (reportFormat) {
                                reportFormat.suspendEvents(false);
                                reportFormat.setValue(reportStatus.get('format'));
                                reportFormat.resumeEvents();
                            }

                            currentOptions = {
                                advancedParams : reportOptions.advancedParams,
                                groupByParams : reportOptions.groupByParams,
                                isExternalLoaded : reportOptions.isExternalLoaded,
                                showOnLaunch : reportOptions.showOnLaunch,
                                filters : reportOptions.filters,
                                hiddenColumns : reportOptions.hiddenColumns,
                                orderBy : reportOptions.orderBy,
                                groupBy : reportOptions.groupBy,
                                parameters : reportOptions.parameters
                            };

                            vm.set({
                                activeReport : node,
                                reportProgress : 1
                            });

                            view.setLoading(false);
                            reportsTree.setDisabled(false);

                        } else if (reportStatus.get('statusCode') === criterion.Consts.REPORT_GENERATION_STATUS_CODES.IN_PROGRESS) {
                            vm.set({
                                activeReport : node,
                                reportProgress : reportStatus.get('progress')
                            });

                            reportsTree.setDisabled(false);

                            me.startCheckingStatus(reportId);
                        } else {
                            Ext.promise.Promise.all([
                                optionsRecord.loadWithPromise(),
                                optionsAvailRecord.loadWithPromise()
                            ]).then(function() {
                                vm.set({
                                    optionsRecord : optionsRecord,
                                    availOptionsRecord : optionsAvailRecord
                                });

                                if (optionsAvailRecord && optionsAvailRecord.get('availableFormats') && optionsAvailRecord.get('availableFormats').length) {
                                    Ext.Array.each(optionsAvailRecord.get('availableFormats'), function(formatItem) {
                                        formatsData.push({
                                            id : formatItem,
                                            text : formatItem.toUpperCase()
                                        });
                                    });
                                }
                                // ess doesn't have format chooser
                                currentFormat = defaultFormatChoice;
                                formatsData.length && availableFormatsStore.loadData(formatsData);
                                if (reportFormat && availableFormatsStore.getCount()) {
                                    reportFormat.suspendEvents();

                                    if (formatsData.length && !Ext.Array.findBy(formatsData, item => item.id === defaultFormatChoice)) {
                                        currentFormat = formatsData[0].id;
                                    }

                                    reportFormat.setValue(currentFormat);
                                    reportFormat.resumeEvents(false);
                                }

                                if (activeReport && activeReport.getId() !== node.getId() || !activeReport) {
                                    currentOptions = null;
                                }

                                if (isMemorized) {
                                    currentOptions = optionsRecord && optionsRecord.getData({
                                        associated : true,
                                        serialize : true
                                    });
                                }

                                if (!optionsRecord.get('showOnLaunch') || currentOptions || isMemorized) {
                                    me.showReport(node);
                                } else {
                                    view.setLoading(false);
                                    vm.set('activeReport', node);
                                    me._createOptionsWindow(true);
                                }
                            }).otherwise(function() {
                                view.setLoading(false);
                                reportsTree.setDisabled(false);
                            });
                        }
                    }).otherwise(function() {
                        view.setLoading(false);
                    });
                }
            },

            startCheckingStatus(reportId) {
                let me = this,
                    vm = this.getViewModel(),
                    reportsStore = vm.getStore('reportsTreeStore');

                if (reportsStore.isLoaded()) {
                    me.executeCheckingTask(reportsStore, reportId);
                } else {
                    reportsStore.on('load', function() {
                        me.executeCheckingTask(reportsStore, reportId);
                    }, me, {single : true});
                }
            },

            executeCheckingTask(store, reportId) {
                let me = this,
                    vm = me.getViewModel(),
                    report = store.findNode('reportId', reportId, 0, false, false, true),
                    reportUrl = report && report.get('memorized') ? API.MEMORIZED_REPORT_DOWNLOAD : API.REPORT_DOWNLOAD,
                    statusUrl = report && report.get('memorized') ? API.MEMORIZED_REPORT_STATUS : API.REPORT_STATUS,
                    status = Ext.create('criterion.model.reports.Status', {
                        id : reportId
                    }), statusProxy = status.getProxy(),
                    reportFormat = me.lookup('reportFormat'),
                    task;

                statusProxy.setUrl(statusUrl);

                statusProxy.setExtraParam('initialCheck', false);

                me.destroyActiveTask();

                if (report) {
                    task = Ext.TaskManager.newTask({
                        run : _ => {
                            me.getView().setLoading(false);

                            status.loadWithPromise().then(reportStatus => {
                                let statusCode = reportStatus.get('statusCode'),
                                    reportOptions = null;

                                if (statusCode === criterion.Consts.REPORT_GENERATION_STATUS_CODES.COMPLETED) {
                                    me.lookup('reportIframe').setSrc(Ext.String.format(reportUrl, reportStatus.get('reportGenerationTaskId')));

                                    reportOptions = reportStatus.get('options');

                                    if (reportFormat) {
                                        reportFormat.suspendEvents(false);
                                        reportFormat.setValue(reportStatus.get('format'));
                                        reportFormat.resumeEvents();
                                    }

                                    currentOptions = {
                                        advancedParams : reportOptions.advancedParams,
                                        groupByParams : reportOptions.groupByParams,
                                        isExternalLoaded : reportOptions.isExternalLoaded,
                                        showOnLaunch : reportOptions.showOnLaunch,
                                        filters : reportOptions.filters,
                                        hiddenColumns : reportOptions.hiddenColumns,
                                        orderBy : reportOptions.orderBy,
                                        groupBy : reportOptions.groupBy,
                                        parameters : reportOptions.parameters
                                    };

                                    vm.set({
                                        activeReport : report,
                                        reportProgress : 1
                                    });

                                    task.destroy();
                                } else if (statusCode === criterion.Consts.REPORT_GENERATION_STATUS_CODES.IN_PROGRESS) {
                                    vm.set('reportProgress', reportStatus.get('progress'));
                                } else {
                                    if (reportStatus.get('statusCode') === criterion.Consts.REPORT_GENERATION_STATUS_CODES.FAILED) {
                                        criterion.Msg.error(i18n.gettext('Report generation has failed. Please, try again or contact the support services.'));
                                    }

                                    vm.set({
                                        activeReport : null,
                                        optionsRecord : null,
                                        availOptionsRecord : null,
                                        reportProgress : 0
                                    });
                                    task.destroy();
                                }
                            });
                        },
                        interval : 1000
                    });

                    activeTask = task;

                    task.start();
                }
            },

            handleClick : function(view, node) {
                if (node.isLeaf()) {
                    let mainRoute = this.getView().mainRoute,
                        reportId = node.get('reportId');

                    this.lookup('reportsTree').setDisabled(true);

                    this.redirectTo((node.get('memorized') ? mainRoute.MEMORIZED : mainRoute.MAIN) + '/' + reportId);
                } else if (node.isExpanded()) {
                    node.collapse();
                } else {
                    node.expand();
                }
            },

            handleDataClick : function(view, node) {
                this.lookup('dataTree').getSelectionModel().select(node);
                this.redirectTo(node.get('href_'));
            },

            handleChangeTypeReport : function() {
                let vm = this.getViewModel(),
                    report = vm.get('activeReport'),
                    selectedNode = this.lookup('reportsTree').getSelection(),
                    selectedReport = selectedNode && selectedNode.length && selectedNode[0];

                if (!report || !selectedReport || report.getId() !== selectedReport.getId()) {
                    return;
                }

                this.showReport(report, false);
            },

            showReportOptions : function(btn) {
                let me = this,
                    vm = this.getViewModel(),
                    optionsRecord, optionsAvailRecord,
                    activeReportId = vm.get('activeReport.reportId');

                btn.setDisabled(true);
                me.getView().setLoading(true);

                if (activeReportId) {
                    optionsRecord = Ext.create('criterion.model.reports.Options', {id : activeReportId});
                    optionsAvailRecord = Ext.create('criterion.model.reports.AvailableOptions', {id : activeReportId});

                    Ext.promise.Promise.all([
                        optionsRecord.loadWithPromise(),
                        optionsAvailRecord.loadWithPromise()
                    ]).then(_ => {
                        vm.set({
                            optionsRecord : optionsRecord,
                            availOptionsRecord : optionsAvailRecord
                        });
                        me._createOptionsWindow(true);
                    });
                } else {
                    me._createOptionsWindow(true);
                }
            },

            _createOptionsWindow : function(show) {
                var vm = this.getViewModel(),
                    activeReport = vm.get('activeReport'),
                    optionsButton = this.lookup('options'),
                    reportIframe = this.lookup('reportIframe'),
                    reportsTree = this.lookup('reportsTree');

                optionsWindow = Ext.create('criterion.view.reports.ReportOptions', {
                    y : 50,
                    title : activeReport.get('name'),
                    viewModel : {
                        data : {
                            reportId : activeReport.get('reportId'),
                            isMemorized : activeReport.get('memorized'),
                            currentOptions : currentOptions,
                            optionsRecord : vm.get('optionsRecord'),
                            availOptionsRecord : vm.get('availOptionsRecord'),
                            reportPeriod : currentOptions && currentOptions.reportPeriod || 'payDate',
                            payDateValue : currentOptions && currentOptions.payDateValue || null
                        }
                    },
                    parentView : this.getView()
                });

                optionsWindow.on('show', function() {
                    if (Ext.isIE) {
                        reportIframe && reportIframe.hide();
                    }
                }, this);

                optionsWindow.getController().load(show);

                optionsWindow.on('saved', function(options) {
                    reportsTree.setDisabled(true);

                    this.load(activeReport.get('reportId'), activeReport.get('memorized'), options);
                }, this);

                optionsWindow.on('cancel', () => {
                    reportsTree.setDisabled(false);
                });

                optionsWindow.on('destroy', function() {
                    let reportProgress = vm.get('reportProgress');

                    if (Ext.isIE) {
                        reportIframe && reportIframe.show();
                    }

                    if (optionsButton && (reportProgress === 0 || reportProgress === 1)) {
                        optionsButton.setDisabled(false);
                    }
                }, this);
            },

            memorizeReport : function() {
                var me = this,
                    vm = this.getViewModel(),
                    memorizeWindow = Ext.create('criterion.view.reports.Memorize'),
                    options = Ext.clone(currentOptions);

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

                memorizeWindow.loadRecord(
                    Ext.create('criterion.model.reports.Memorized', {
                        reportId : vm.get('activeReport').get('reportId'),
                        options : Ext.JSON.encode(options)
                    })
                );
                memorizeWindow.show();
                memorizeWindow.on('afterSave', function(view, record) {
                    me.load(record.getId(), true, null, true);
                });
            },

            deleteMemorized : function() {
                var report = this.getViewModel().get('activeReport');

                Api.request({
                    url : API.MEMORIZED_REPORT + '/' + report.get('reportId'),
                    method : 'DELETE',
                    scope : this,
                    callback : function(record, operation, success) {
                        if (success) {
                            this.redirectTo(this.makeToken());
                        }
                    }
                });
            },

            handleFrameParentResize : function(cmp, newW, newH) {
                this.lookup('reportIframe').setSize(newW - 13, newH - 13);
            },

            handleReportsFilter : function(field, value) {
                var reportsTree = this.lookup('reportsTree'),
                    store = this.getViewModel().getStore('reportsTreeStore'),
                    view = this.getView();

                view.suspendLayouts();

                store.clearFilter();

                if (!value) {
                    reportsTree.collapseAll();
                    expandedNodes.clear();
                    view.resumeLayouts();
                    view.updateLayout();

                    return;
                }

                value = value.toLowerCase();

                expandedNodes.clear();
                store.filterBy(function(record) {
                    if (!record.isLeaf()) {

                        return true;
                    }

                    if (record.get('nameLowerCase').indexOf(value) > -1) {
                        expandedNodes.add(record);

                        return true;
                    }

                    expandedNodes.remove(record);

                    return false;
                });

                expandedNodes.each(function(record) {
                    Ext.defer(function() {
                        reportsTree.expandPath(record.getPath('id'), 'id');
                    }, 10);
                });

                view.resumeLayouts();
                view.updateLayout();
            },

            onIFrameBoxReady : function(iframe) {
                var view = this.getView();
                iframe.getDOM().addEventListener('load', function() {
                    view.setLoading(false);
                });
            },

            handleHide() {
                this.destroyActiveTask();
            },

            destroyActiveTask() {
                if (activeTask) {
                    activeTask.destroy();
                    activeTask = null;

                    return true;
                }
            }

        };

    }
);
