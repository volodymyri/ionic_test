Ext.define('criterion.controller.OrgChart', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_orgchart',

        mainRoute : criterion.consts.Route.HR.ORGANIZATION,

        requires : [
            'criterion.view.ManagerSelectorPopup'
        ],

        mixins : [
            'criterion.controller.mixin.SingleEmployer'
        ],

        reloadChart : function() {
            this.loadChart(this.currentReportingId);
        },

        isChartLoading : false,
        currentReportingId : null,
        isUnassigned : false,
        isUnassignedActive : false,

        loadChart : function(reportingId) {
            var view = this.getView(),
                vm = this.getViewModel(),
                reportType = vm.get('reportType'),
                exploreStore = this.getStore('exploreStore'),
                me = this,
                params = {
                    orgStructure : reportType
                };

            this.currentReportingId = reportingId;

            if (this.isChartLoading || !reportType) {
                return;
            }

            this.isChartLoading = true;
            view.setLoading(true);

            if (this.isUnassigned) {
                params['isUnassigned'] = true;
            }

            exploreStore.getProxy().setExtraParam('orgStructure', reportType);

            reportingId && (params['employeeId'] = reportingId);

            Ext.promise.Promise.all([
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_ORG_CHART,
                    method : 'GET',
                    params : params
                }),
                exploreStore.loadWithPromise({
                    listenEvent : true
                })
            ]).then(function(response) {
                me.prepareChartStore(response[0]);
                me.prepareTreeStore(response[1]);
                me.selectExploreNode(reportingId);
            }).always(function() {
                view.setLoading(false);
                me.isChartLoading = false;
            })
        },

        /**
         * Parse response from server and create tree structure for main chart.
         * @param data
         */
        prepareChartStore : function(data) {
            var root = Ext.apply({
                    expanded : true,
                    children : []
                }, data['keyEmployee']),
                orgChartStore = this.getStore('orgChartStore'),
                supervisors = data['supervisors'],
                oldRoot = orgChartStore.getRoot(),
                supervisor;

            if (supervisors && supervisors.length) {
                supervisor = supervisors[0];
                // if position reporting is turned on -> many supervisors
                if (supervisors.length > 1) {
                    Ext.apply(root, {
                        supervisorId : 0,
                        supervisors : Ext.Array.map(supervisors, item => ({
                            title : item['title'],
                            employeeId : item['employeeId']
                        })),
                        supervisorName : supervisor['positionTitle'] // all supervisors have same position
                    });
                } else {
                    Ext.apply(root, {
                        supervisorId : supervisor['employeeId'],
                        supervisors : [],
                        supervisorName : supervisor['inaccessible'] ? i18n.gettext('Reporting Manager') : supervisor['title']
                    });
                }
            }

            Ext.Array.each(data['subordinates'], function(subordinate) {
                root.children.push(Ext.apply({
                    leaf : true
                }, subordinate));
            });
            Ext.Array.each(data['openPositions'], function(openPosition) {
                root.children.push(Ext.apply({
                    leaf : true,
                    positionTitle : openPosition['positionTitle'],
                    fullTimeEquivalency : openPosition['openFTE']
                }));
            });

            orgChartStore.setRoot(root);

            if (!oldRoot) {
                orgChartStore.fireEvent('refresh');
            }

        },

        prepareTreeStore : function(store) {
            store && store.isTreeStore && store.each(function(node) {
                if (node.get('inaccessible')) {
                    node.set('combined', i18n.gettext('No Access to This Employee'));
                }
            }, this, {collapsed : true});
        },

        makeToken : function(reportingId) {
            return this.mainRoute + (reportingId ? '/' + reportingId : '');
        },

        updateToken : function(reportingId, hashOnly) {
            this.hashChangeOnly = hashOnly;
            Ext.History.add(this.makeToken(reportingId), true);
        },

        handleRoute : function(reportingId) {
            if (this.hashChangeOnly) { // hack to update hash url without reloading stores, see updateToken
                this.hashChangeOnly = false;

                return;
            }

            this.loadChart.call(this, reportingId ? parseInt(reportingId, 10) : undefined);
        },

        initReportType : function() {
            var vm = this.getViewModel(),
                reportTypeCombo = this.lookupReference('reportTypeCombo');

            if (vm.get('reportType') === null && reportTypeCombo.getStore().count()) {
                var codeDetail = reportTypeCombo.getStore().getAt(0);

                reportTypeCombo.suspendEvents();

                reportTypeCombo.select(codeDetail);
                vm.set('reportType', codeDetail.get('attribute1'));

                reportTypeCombo.resumeEvents();

                this.reloadChart();
            }
        },

        /**
         * Get top node of explore store. Will return undefined if not present.
         *
         * @returns {Ext.data.NodeInterface|undefined}
         */
        getExploreRootNode : function() {
            // store's root is virtual node, we need to look at his first child for actual data node
            return this.getViewModel().getStore('exploreStore').getRootNode().getChildAt(0);
        },

        selectExploreNode : function(reportingId) {
            var vm = this.getViewModel(),
                rootNode = this.getExploreRootNode(),
                selectedNode = vm.getStore('exploreStore').findNode('employeeId', reportingId) || rootNode,
                positionExplorer = this.lookup('positionExplorer');

            if (selectedNode) {
                selectedNode.expand();
                var currentNode = selectedNode;

                while (currentNode !== rootNode) {
                    currentNode = currentNode.parentNode;
                    currentNode.expand();
                }

                positionExplorer.setSelection(selectedNode);
                positionExplorer.doEnsureVisible(selectedNode); // warn, using private method

                this.updateToken(reportingId);
            }
        },

        onExploreTreeSelect : function(self, record) {
            this.updateToken(this.getReportingId(record));
        },

        /**
         * @param  {criterion.model.employee.OrgChart} record
         */
        onGotoProfile : function(record) {
            var url = criterion.consts.Route.HR.EMPLOYEE + '/' + this.getReportingId(record);

            criterion.consts.Route.setPrevRoute(Ext.History.getToken());
            this.redirectTo(url, false);
        },

        onReportTypeChange : function(cmp, newVal) {
            this.getViewModel().set('reportType', cmp.getStore().getById(newVal).get('attribute1'));
            this.updateToken(undefined, true);
            this.loadChart();
        },

        onSearchEmployeeSelect : function(combo, record) {
            this.updateToken(this.getReportingId(record));
        },

        onReportComboDataChange : function() {
            Ext.Function.defer(this.initReportType, 10, this); // CRITERION-5373
        },

        onZoomPosition : function(record) {
            this.isUnassignedActive = this.isUnassigned;

            if (record.get('isUnassignedNode')) {
                this.isUnassigned = true;
                this.loadChart(this.currentReportingId);
            } else {
                this.updateToken(this.getReportingId(record));
            }

        },

        onGoToSupervisor : function(record) {
            let supervisors = record.get('supervisors');

            if (this.isUnassigned) {
                this.isUnassigned = this.isUnassignedActive;

                if (this.isUnassignedActive) {
                    this.isUnassignedActive = false;
                    this.updateToken();
                } else {
                    this.loadChart(this.currentReportingId);
                }
            } else {
                if (supervisors && supervisors.length) {
                    this.showManagerSelectorPopup(record, supervisors);
                } else {
                    this.updateToken(record.get('supervisorId'));
                }
            }
        },

        showManagerSelectorPopup : function(record, supervisors) {
            let me = this,
                managerSelectorPopup = Ext.create('criterion.view.ManagerSelectorPopup', {
                    viewModel : {
                        stores : {
                            supervisors : {
                                type : 'store',
                                proxy : {
                                    type : 'memory'
                                },
                                fields : [
                                    {
                                        name : 'title',
                                        type : 'string'
                                    },
                                    {
                                        name : 'employeeId',
                                        type : 'integer'
                                    }
                                ],
                                data : supervisors
                            }
                        }
                    }
                });

            managerSelectorPopup.on({
                afterManagerSelect : function(managerId) {
                    me.updateToken(managerId);
                    managerSelectorPopup.destroy();
                }
            });

            managerSelectorPopup.show();
        },

        getReportingId : function(record) {
            return record.get('employeeId');
        },

        onScrollTreeUp : function() {
            this.scrollTree(-30);
        },

        onScrollTreeDown : function() {
            this.scrollTree(30);
        },

        scrollTree : function(direction) {
            var positionExplorer = this.lookup('positionExplorer');

            positionExplorer.scrollBy({x : 0, y : direction}, true);
        },

        /**
         * Do not listen to global employer change events.
         */
        handleEmployerChanged : Ext.emptyFn,

        /**
         * @private
         */
        initRoutes : function() {
            var routes = {},
                me = this;

            routes[me.mainRoute] = 'handleRoute';
            routes[me.mainRoute + '/:id'] = 'handleRoute';

            this.setRoutes(routes);
        },

        init : function init() {
            var me = this;

            this.initRoutes();

            me.callParent(arguments);
        },

        onExportOrgChart : function() {
            var vm = this.getViewModel(),
                reportType = vm.get('reportType'),
                parameters = [];

            if (reportType) {
                parameters.push('orgStructure=' + reportType);
            }

            if (this.currentReportingId) {
                parameters.push('employeeId=' + this.currentReportingId);
            }

            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYEE_ORG_CHART_DOWNLOAD + '?' + parameters.join('&')));
        },

        onExploreStoreLoad : function(store, records) {
            let searchStore = this.getViewModel().getStore('searchStore');

            function processData(rec) {
                let subordinates = rec.isModel ? rec.get('subordinates') : rec['subordinates'];

                subordinates && Ext.Array.each(subordinates, subordinate => {
                    if (subordinate['employeeId']) {
                        searchStore.add({
                            id : subordinate['employeeId'],
                            employeeId : subordinate['employeeId'],
                            fullName : subordinate['title']
                        });
                    }
                    processData(subordinate);
                });
            }

            searchStore.removeAll();

            Ext.Array.each(records, record => {
                processData(record);
            });
        }
    };

});
