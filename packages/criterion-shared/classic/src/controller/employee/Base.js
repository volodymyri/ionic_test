Ext.define('criterion.controller.employee.Base', function() {

    const ROUTES = criterion.consts.Route,
        EMPLOYEES_ROUTES = [ROUTES.HR.EMPLOYEES, ROUTES.PAYROLL.EMPLOYEES],
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    let removedTabBarTabs = [];

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee',

        requires : [
            'criterion.store.search.Employees'
        ],

        isLoading : false,

        init : function() {
            this.initRoutes();

            this.callParent(arguments);
        },

        initRoutes : function() {
            let routes = {},
                routePrefix = this.routePrefix;

            let defaultRouteHandler = {
                action : 'handleRoute',
                conditions : {
                    ':employeeId' : '([0-9]+)'
                }
            };

            routes[routePrefix + '/:employeeId'] = Ext.clone(defaultRouteHandler);
            routes[routePrefix + '/:employeeId/:tab'] = Ext.clone(defaultRouteHandler);
            routes[routePrefix + '/:employeeId/:tab/:tab'] = Ext.clone(defaultRouteHandler);
            routes[routePrefix + '/:employeeId/:tab/:tab/:id'] = Ext.clone(defaultRouteHandler);

            this.setRoutes(routes);
        },

        onChildTabChange : function(panel, tab, parentTab) {
            let vm = this.getViewModel(),
                person = vm.get('person'),
                employee = vm.get('employee');

            if (!person || person.phantom || !employee || employee.phantom) {
                // we're creating new person/employee, allow tab change w/o changing the route
                return;
            }

            this.updateToken(employee.getId(), parentTab.getItemId(), tab.getItemId())
        },

        onHide : function() {
            this.flush();
        },

        onAfterRender : function() {
            this.getView().setBaseRoute(this.routePrefix);
        },

        /**
         * @param employeeId
         * @param [tab]
         * @param [childTab]
         * @param [entityId]
         */
        handleRoute : function(employeeId, tab, childTab, entityId) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                employee = vm.get('employee'),
                employeeHash = Ext.String.format('{0}/{1}', this.routePrefix, employeeId);

            if (this.isLoading) {
                return;
            }

            vm.set('fullPageMode', false);

            if (Ext.Array.contains(EMPLOYEES_ROUTES, Ext.History.prevHash) && Ext.History.hash === employeeHash) {
                window.history.replaceState({}, '', Ext.String.format('{0}#{1}', location.pathname, Ext.History.prevHash));
            }

            employeeId = parseInt(employeeId, 10);

            if (!employee || !employee.isModel || employee.getId() !== employeeId) {
                this.load(employeeId);
            }

            if (tab) {
                view.setActivePage(tab, childTab);
                view.updateLayout();

                if (!view.__reRoute) {
                    if (entityId) {
                        me.updateToken(employeeId, tab, childTab);
                        Ext.defer(function() {
                            view.__reRoute = true;
                            me.updateToken(employeeId, tab, childTab, entityId);
                        }, 10);
                    }
                }

            } else { // default route
                let currentPages = view.getActivePages();

                if (!currentPages || (currentPages[0] && !currentPages[1])) {
                    currentPages = view.findPageWithSub();
                    if (currentPages[1]) {
                        if (me.isLoading) {
                            me.on('loaded', () => {
                                me.updateToken(employeeId, currentPages[0].itemId, currentPages[1] ? currentPages[1].itemId : null);
                            }, me, {single : true});
                        } else {
                            me.updateToken(employeeId, currentPages[0].itemId, currentPages[1] ? currentPages[1].itemId : null);
                        }
                    }
                } else {
                    this.updateToken(employeeId, currentPages[0].itemId, currentPages[1] ? currentPages[1].itemId : null)
                }
            }
        },

        redirectToEmployee : function(employeeId) {
            this.updateToken(employeeId, 'employment', 'info');
        },

        redirectToPerson : function(personId) {
            Ext.History.add(this.routePrefix + '/add/' + personId);
        },

        makeToken : function(employeeId, tabId, secTabId, secTabElId) {
            let path = '';

            path += this.routePrefix;

            if (typeof employeeId !== 'undefined') {
                path += '/' + employeeId
            }

            if (tabId) {
                path += '/' + tabId
            }

            if (secTabId) {
                path += '/' + secTabId
            }

            if (secTabElId) {
                path += '/' + secTabElId
            }

            return path;
        },

        updateToken : function(employeeId, tabId, secTabId, secTabElId) {
            Ext.History.add(this.makeToken(employeeId, tabId, secTabId, secTabElId), true);
        },

        _applyWorkflow : function(employee) {
            let vm = this.getViewModel(),
                employeeData = employee.getData({associated : true}),
                relationshipWfData = employeeData['relationshipWorkflowLog'],
                isPendingRelationshipWorkflow = relationshipWfData && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], relationshipWfData['stateCode']),
                terminationWfData = employeeData['terminationWorkflowLog'],
                isPendingTerminationWorkflow = terminationWfData && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], terminationWfData['stateCode']);

            vm.set({
                isPendingRelationshipWorkflow : !!isPendingRelationshipWorkflow,
                isPendingTerminationWorkflow : !!isPendingTerminationWorkflow,
                pendingOrg1 : false,
                pendingOrg2 : false,
                pendingOrg3 : false,
                pendingOrg4 : false
            });

            if (relationshipWfData) {
                Ext.each(Object.keys(relationshipWfData.request), function(key) {
                    let index;

                    if (/^org[1-4]/.test(key)) {
                        index = key.slice(3, 4);

                        vm.set('pendingOrg' + index, true);
                        vm.notify();
                    }
                });
            }
        },

        load : function(employeeId) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                personId,
                person,
                addressesStore = vm.getStore('addresses'),
                employeeRec = Ext.create('criterion.model.Employee', {
                    id : employeeId
                }),
                tabBar = view.tabBar,
                isMultiPositionModeTabs = tabBar.query('[isMultiPositionMode]'),
                multiPositionTitleTabs = tabBar.query('[multiPositionTitle]'),
                basicDemographics = view.down('[reference=basicDemographics]'),
                employers = Ext.StoreManager.lookup('Employers');

            view.setLoading(true);
            this.isLoading = true;

            vm.set('employeeId', employeeId);

            employeeRec.getProxy().setExtraParams({
                joinWorkflowLog : true
            });

            employeeRec.load({
                scope : this,
                success : function(employee) {
                    employee.getProxy().setExtraParams({});

                    me._applyWorkflow(employee);

                    personId = employee.get('personId');

                    person = Ext.create('criterion.model.Person', {
                        personId : personId
                    });

                    Ext.promise.Promise.all([
                        person.loadWithPromise(),
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.PERSON_EMPLOYMENT_HISTORY_COUNT,
                            params : {
                                personId : personId
                            },
                            method : 'GET'
                        }),
                        addressesStore.loadWithPromise({
                            params : {
                                personId : person.getId()
                            }
                        }),
                        vm.getStore('phoneFormatTypes').loadWithPromise(),
                        employers.waitUntilLoaded()
                    ]).then({
                        scope : this,
                        success : function(data) {
                            let address = addressesStore.findRecord('isPrimary', true),
                                employer = employers.getById(employee.get('employerId')),
                                personHistoryCount = data[1],
                                isMultiPosition = employer.get('isMultiPosition'),
                                resetRoute = false;

                            // employment history tab
                            view.getTabBar().controlTabBySubItemXtype('criterion_person_employment_history', personHistoryCount < 2);

                            vm.set({
                                address : address,
                                geocode : address.get('geocode'),
                                employer : employer,
                                employee : employee,
                                person : person
                            });

                            if (!isMultiPosition) {
                                isMultiPositionModeTabs.forEach(function(tab) {
                                    //Saving index of component to restoring later
                                    tab._positionIndex = tabBar.items.indexOf(tab);

                                    tab.hide();

                                    removedTabBarTabs.push(tabBar.remove(tab, {destroy : false}));

                                    //Disable card to prevent direct access issues
                                    tab.subItem.disable(true);
                                    resetRoute = resetRoute || tab.active;

                                });
                                if (resetRoute) {
                                    view.getLayout().setActiveItem(0);
                                }
                            } else {
                                Ext.Array.each(removedTabBarTabs, function(rTab) {
                                    tabBar.insert(rTab._positionIndex, rTab).setVisible(rTab.parentCard.tab.expanded).setMargin(0);
                                    rTab.subItem.enable(true);
                                });

                                removedTabBarTabs = [];
                            }

                            multiPositionTitleTabs.forEach(function(tab) {
                                if (isMultiPosition) {
                                    tab._singlePositionTitle = tab._singlePositionTitle || tab.getText();
                                    tab.setText(tab.multiPositionTitle);
                                } else {
                                    tab._singlePositionTitle && tab.setText(tab._singlePositionTitle);
                                }
                            });

                            this.selectedEmployeeSet();
                            basicDemographics && basicDemographics.fireEvent('afterLoad');
                        }
                    }).always(function() {
                        this.isLoading = false;
                        view.setLoading(false);
                        me.fireEvent('loaded');
                        i18n.rebuild();
                    }, this);

                }
            });
        },

        onReloadEmployee : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                employeeRec = Ext.create('criterion.model.Employee', {
                    id : employeeId
                });

            employeeRec.getProxy().setExtraParams({
                joinWorkflowLog : true
            });

            view.setLoading(true);
            employeeRec.load({
                scope : this,
                success : function(employee) {
                    employee.getProxy().setExtraParams({});
                    me._applyWorkflow(employee);

                    if (employee['getEmployeeWorkLocation']) {
                        let location = employee.getEmployeeWorkLocation();

                        if (location) {
                            employee.set('employerWorkLocationId', location.get('employerWorkLocationId'));
                        }
                    }

                    vm.set('employee', employee);
                    view.setLoading(false);
                }
            });
        },

        selectedPersonSet : function() {
            let vm = this.getViewModel();

            this.fireEvent('selectedPersonSet', {
                person : vm.get('person'),
                personAddress : vm.get('address'),
                employer : vm.get('employer'),
                employee : Ext.create('criterion.model.Employee')
            }, this.getView());
        },

        flush : function() {
            this.getViewModel().set({
                person : null,
                employee : null,
                personAddress : null,
                position : null
            });
        },

        selectedEmployeeSet : function() {
            let vm = this.getViewModel(),
                employee = vm.get('employee'),
                employeeId = employee.getId();

            this.fireEvent('selectedEmployeeSet', {
                person : vm.get('person'),
                personAddress : vm.get('address'),
                employee : employee,
                employer : vm.get('employer'),
                position : vm.get('position')
            }, this.getView());

            criterion.LocalizationManager.setGlobalFormat(vm.get('employer').getData());

            this.searchNeighbors(employeeId);
        },

        /**
         * @private
         * @param currentEmployeeId
         */
        searchNeighbors : function(currentEmployeeId) {
            let me = this,
                searchEmployees = Ext.getStore('searchEmployees'),
                storeIsPreloaded = searchEmployees && searchEmployees.isLoaded() || false;

            if (!searchEmployees || !searchEmployees.count()) {
                searchEmployees = Ext.create('criterion.store.search.Employees', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    sorters : [
                        {
                            property : 'lastName',
                            direction : 'ASC'
                        }
                    ],
                    proxy : {
                        extraParams : {
                            isActive : true
                        }
                    }
                });
            }

            if (!storeIsPreloaded) {
                searchEmployees.loadWithPromise().then(function() {
                    me.requestNeighborsData(currentEmployeeId, searchEmployees);
                });
            } else {
                me.requestNeighborsData(currentEmployeeId, searchEmployees);
            }
        },

        requestNeighborsData : function(currentEmployeeId, employees) {
            let vm = this.getViewModel(),
                sorters = [],
                filters = [];

            employees.getSorters().each(function(sorter) {
                let config = sorter.getConfig();

                sorters.push({
                    property : config.property,
                    direction : config.direction
                })
            });

            employees.getFilters().each(function(filter) {
                let config = filter.getConfig();

                filters.push({
                    property : config.property,
                    operator : config.operator,
                    value : filter.getValue()
                })
            });

            criterion.Api.requestWithPromise({
                url : Ext.String.format(criterion.consts.Api.API.EMPLOYEE_SEARCH_NEIGHBORS, currentEmployeeId),
                method : 'GET',
                params : Ext.apply(
                    employees.getProxy().getExtraParams(),
                    {
                        limit : employees.getPageSize(),
                        sort : Ext.JSON.encode(sorters),
                        filter : Ext.JSON.encode(filters)
                    }
                )
            }).then(function(response) {
                if (response) {
                    vm.set({
                        nextEmployee : response.next,
                        prevEmployee : response.prev
                    });
                } else {
                    vm.set({
                        nextEmployee : null,
                        prevEmployee : null
                    });
                }
            });
        },

        /**
         * Connect photo identifier.
         * @param identifier
         */
        handleConnectIdentifierToPerson : function(identifier) {
            this.getViewModel().get('person').set('identifier', identifier);
        }

    }

});
