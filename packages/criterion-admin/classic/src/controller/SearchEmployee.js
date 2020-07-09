Ext.define('criterion.controller.SearchEmployee', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_search_employee',

        mixins : [
            'criterion.controller.mixin.SingleEmployer'
        ],

        suspendSearchComboChange : false,

        init : function() {
            var routes = {},
                parent = this.getView().parentPage;

            routes[parent + '/employees/:positionId'] = {
                action : 'handleRoute',
                conditions : {
                    ':positionId' : '([0-9]+)'
                }
            };

            routes[parent + '/employees'] = {
                action : 'handleRoute'
            };

            routes[parent + '/employees/goto/:employeeId'] = {
                action : 'handleGotoEmployee',
                conditions : {
                    ':employeeId' : '([0-9]+)'
                }
            };

            this.setRoutes(routes);

            this.callParent(arguments);
        },

        getGrid : function() {
            return this.lookupReference('grid');
        },

        handleCreateButtonClick : function() {
            criterion.consts.Route.setPrevRoute(Ext.History.getToken());
            this.redirectTo(this.getView().parentPage + '/addEmployee', null);
        },

        handleRehire : function() {
            var wnd = Ext.create('criterion.view.employee.EmployeePicker', {
                canRehireOnly : true
            });

            wnd.show();
            wnd.on('select', function(record) {
                this.redirectTo(this.getView().parentPage + '/addEmployee/rehire/person/' + record.get('personId') + '/' + record.get('employerId'), null);
            }, this);
        },

        handleSearchAndCreate : function() {
            var wnd = Ext.create('criterion.view.employee.EmployeePicker', {
                isActive : true
            });

            wnd.show();
            wnd.on('select', function(record) {
                this.redirectTo(this.getView().parentPage + '/addEmployee/person/' + record.get('personId'), null);
            }, this);
        },

        handleTransfer : function() {
            var me = this,
                wnd;

            wnd = Ext.create('criterion.view.employee.EmployeePicker', {
                isActive : true, // a list of eligible persons that can be transferred
                eligibleForTransfer : true
            });

            wnd.show();
            wnd.on('select', function(record) {
                criterion.Msg.confirm(
                    i18n.gettext('Transfer'),
                    i18n.gettext('The employee will be terminated at the current employer. Do you want to continue?'),
                    function(btn) {
                        if (btn === 'yes') {
                            me.redirectTo(me.getView().parentPage + '/addEmployee/transfer/person/' + record.get('personId') + '/' + record.get('employerId'), null);
                        }
                    }
                );
            });
        },

        load : function(page) {
            if (!this.checkViewIsActive()) {
                return;
            }

            var store = this.lookup('grid').getStore(),
                searchForm = this.lookupReference('searchForm'),
                criteria = {};

            if (this.positionId) {
                criteria['positionId'] = this.positionId;
                criteria['isPrimaryOnly'] = false;
            }

            if (searchForm) {
                Ext.Object.each(searchForm.getValues(), function(key, value) {
                    Ext.isString(value) && (value = value.trim());
                    if (value) {
                        criteria[key] = value;
                    }
                });
            }

            store.getProxy().setExtraParams(criteria);
            store.loadPage(page || 1);
        },

        handleSearchButtonClick : function() {
            this.load();
        },

        handleRoute : function(positionId) {
            var store = this.lookup('grid').getStore(),
                page = store.currentPage,
                searchForm = this.lookupReference('searchForm'),
                prevRoute = criterion.consts.Route.getPrevRoute();

            this.positionId = positionId;

            if (prevRoute) {
                criterion.consts.Route.setPrevRoute();
            }

            var form = searchForm.getForm();

            Ext.Object.each(store.getProxy().getExtraParams(), function(key, value) {
                var field = form.findField(key);

                field && field.setValue(value)
            });

            this.load(page);
        },

        handleGotoEmployee : function(employeeId) {
            this.redirectTo(criterion.consts.Route.HR.EMPLOYEE + '/' + employeeId, null);
        },

        handleItemClick : function(grid, record) {
            var employeeId = record.get('employeeId');

            if (employeeId) {
                this.redirectTo(this.getView().parentPage + '/employee/' + employeeId, null);
            } else {
                this.redirectTo(this.getView().parentPage + '/employee/add/' + record.get('personId'), null);
            }
        },

        onKeyPress : function(cmp, e) {
            if (e.keyCode === e.RETURN) {
                this.handleSearchButtonClick();
            }
        },

        handleSearchComboChange : function() {
            if (this.suspendSearchComboChange) {
                return;
            }
            this.handleSearchButtonClick();
        },

        handleEmployerComboChange : function(combo) {
            if (this.suspendSearchComboChange || combo.getStore().count() === 1) {
                return;
            }
            this.handleSearchButtonClick();
        }
    }
});
