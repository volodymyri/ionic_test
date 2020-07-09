Ext.define('criterion.Application', function() {

    function getStore(storeId, type) {
        var StoreManager = Ext.StoreManager;

        return StoreManager.lookup(storeId) || StoreManager.lookup({
            storeId : storeId,
            type : type
        });
    }

    function getEmployersStore() {
        return getStore('Employers', 'criterion_employers');
    }

    function getEmployeesStore() {
        return getStore('Employees', 'criterion_employees');
    }

    let fieldFormatTypes = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.FIELD_FORMAT),
        customFieldFormats = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.FIELD_FORMAT_CUSTOM),
        currentFormIdent = null,
        serviceMessagePopup = null;

    return {

        extend : 'Ext.app.Application',

        requires : [
            'criterion.Consts',
            'criterion.Api',
            'criterion.CodeDataManager',
            'criterion.ViewSettingsManager',
            'criterion.LocalizationManager',
            'criterion.SecurityManager',
            'criterion.store.Employers',
            'criterion.store.Employees',
            'criterion.store.CustomFieldFormats',
            'criterion.plugin.LazyItems',
            'criterion.plugin.SecurityItems',
            'criterion.consts.Api',
            'criterion.store.FieldFormatTypes',
            'criterion.store.DocumentLocations',
            'Ext.Responsive',
            'Ext.util.TaskManager',
            'criterion.Log'
        ],

        getEmployersStore : getEmployersStore,

        getEmployeesStore : function() {
            return getStore('Employees', 'criterion_employees');
        },

        init : function() {
            Ext.ariaWarn = Ext.emptyFn;
            criterion.Application.loadBaseStores();

            window.onbeforeunload = function(e) {
                if (criterion.detectDirtyForms) {
                    let forms = Ext.ComponentQuery.query('form[skipDirtyConfirmation=false][rendered=true][hidden=false]'),
                        message = null;

                    Ext.Array.each(forms, function(form) {
                        if (form.hasDirty()) {
                            message = form.unsavedMessage;

                            return false;
                        }
                    });

                    if (!message) {
                        return;
                    }

                    if (typeof e == "undefined") {
                        e = window.event;
                    }

                    if (e) {
                        e.returnValue = message;
                    }

                    return message
                }
            };

            Ext.GlobalEvents.on('setCurrentFormIdent', (ident) => {
                currentFormIdent = ident;
            });

            Ext.globalEvents.on('isActiveMasks', this.onIsActiveMasks, this);
        },

        onIsActiveMasks(maskExists) {
            let body = Ext.fly(document.body);

            if (maskExists) {
                body.addCls('busy');
            } else {
                body.removeCls('busy');
            }
        },

        _getRoutesTree : function(routes) {
            var tree = {};

            Ext.Array.each(Ext.Object.getValues(routes), function(route) {
                var parts = route.getUrl().split('/'),
                    current = tree;

                Ext.Array.each(parts, function(part) {
                    if (!current.hasOwnProperty(part)) {
                        current[part] = {};
                    }
                    current = current[part];
                });

                if (!current.hasOwnProperty('')) {
                    current[''] = [];
                }
                current[''].push(route);
            });

            return tree;
        },

        _sortRoutes : function(routes) {
            var newRoutes = [];

            function eachLeaf(branch) {
                Ext.Array.each(Ext.Object.getKeys(branch).sort(), function(key) {
                    var leaf = branch[key];

                    if (key === '') {
                        newRoutes.push.apply(newRoutes, leaf);
                    } else {
                        eachLeaf(leaf);
                    }
                });

                return newRoutes;
            }

            return eachLeaf(this._getRoutesTree(routes));
        },

        launch : function() {
            var Router = Ext.route.Router,
                basePath = location.origin + location.pathname,
                hostnameParts = window.location.hostname.split('.'),
                hostnameTenant = (hostnameParts[0] === 'www' ? hostnameParts[1] : hostnameParts[0]).toLowerCase(),
                checkUpdateTask = {
                    run : function() {
                        Ext.Ajax.request({
                            url : basePath + 'loader/version',
                            _noAuth : true,
                            success : function(response) {
                                if (Ext.isDefined(criterion.BUILD) && (criterion.BUILD !== response.responseText)) {
                                    Ext.TaskManager.stop(checkUpdateTask);
                                    criterion.Application.clearStorage();
                                    criterion.Api.clearCookies();
                                    location.reload(true);
                                }
                            }
                        });
                    },
                    interval : criterion['checkUpdateInterval'] || 1000 * 60 * 60 * 8,
                    fireOnStart : false
                };

            Router.routes = this._sortRoutes(Router.routes);

            this.callParent(arguments);

            if (!window['device'] && (Ext.isDefined(criterion.PRODUCTION) && hostnameTenant !== criterion.Consts.TURING_IDENT)) {
                Ext.Ajax.request({
                    url : basePath + 'loader/version',
                    _noAuth : true,
                    success : function(response) {
                        criterion.BUILD = response.responseText;
                    }
                });
                Ext.TaskManager.start(checkUpdateTask);
            }
        },

        onAppUpdate : function() {
            criterion.Application.clearStorage();
        },

        statics : {
            loadBaseStores : function() {
                var me = this,
                    employees = getEmployeesStore(),
                    employers = getEmployersStore();

                employees.on('load', me.handleEmployeesLoad, me);
                employers.on('load', me.handleEmployersLoad, me);

                if (criterion.useLogger) {
                    criterion.Log.init();
                    criterion.Log.on('afterErrorLog', () => {
                        criterion.Utils.removeMasks();
                    })
                }

                Ext.promise.Promise.all([
                    employers.loadWithPromise(),
                    employees.loadWithPromise({
                        params : {
                            personId : criterion.Api.getCurrentPerson().id
                        }
                    }),
                    fieldFormatTypes.loadWithPromise(),
                    customFieldFormats.loadWithPromise(),
                    Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.DOCUMENT_LOCATIONS).loadWithPromise(),
                    criterion.CodeDataManager.loadIfEmpty(criterion.consts.Dict.DATA_TYPE)
                ]).then({
                    scope : this,
                    success : function() {
                        this.initIdentity();
                        Ext.GlobalEvents.fireEvent('baseStoresLoaded', employers, employees);
                    }
                });
            },

            initIdentity : function() {
                var employee = this.getDefaultEmployee();

                criterion.Application.setEmployee(employee.getId());
                criterion.Application.setEmployer(employee.get('employerId'), true);
            },

            getDefaultEmployee : function() {
                return getEmployeesStore().findRecord('employerId', criterion.Api.getEmployerId(), 0, false, false, true);
            },

            handleEmployersLoad : function(store, records) {
                Ext.GlobalEvents.fireEvent('employersLoaded', store, records);
            },

            handleEmployeesLoad : function(store, records) {
                Ext.GlobalEvents.fireEvent('employeesLoaded', store, records);
            },

            getEmployer : function() {
                return getEmployersStore().getById(criterion.Api.getEmployerId());
            },

            setEmployer : function(employerId, force) {
                var employer = getEmployersStore().getById(employerId),
                    currEmployer = this.getEmployer();

                if (force || employer !== currEmployer) {
                    criterion.Api.setEmployerId(employer.get('id'));

                    Ext.GlobalEvents.fireEvent('employerChanged', employer, currEmployer);
                }

                criterion.Utils.setDateAndTimeFormat(employer.get('dateFormat'), employer.get('timeFormat'))
            },

            getEmployee : function() {
                var employeeId = criterion.Api.getEmployeeId();

                return employeeId ? Ext.StoreManager.lookup('Employees').getById(employeeId) : null;
            },

            setEmployee : function(employeeId, silent) {
                var employee = Ext.StoreManager.lookup('Employees').getById(employeeId),
                    currEmployee = this.getEmployee();

                if (employee !== currEmployee) {
                    criterion.Api.setEmployeeId(employeeId);

                    if (!silent) {
                        Ext.GlobalEvents.fireEvent('employeeChanged', employee, currEmployee);
                    }
                }
            },

            isAdmin : function() {
                return criterion.appName === 'admin';
            },

            clearStorage : function() {
                if (window['localStorage']) {
                    for (var i = 0, len = localStorage.length, key; i < len; ++i) {
                        key = localStorage.key(i);
                        // for remove a specific cache value with key like _ext:/build/production/web/default.json-e9c73bb1-8c17-474f-9719-827a807acf90
                        if (/^_ext/.test(key)) {
                            localStorage.removeItem(key);
                        }
                    }
                }
            },

            getCurrentFormIdent : function() {
                return currentFormIdent;
            },

            showServiceMessage(title, message, opts) {
                if (!Ext.isModern) {
                    if (!serviceMessagePopup || serviceMessagePopup.isHidden()) {
                        let bodyWidth = Ext.getBody().getWidth();

                        serviceMessagePopup = Ext.create('Ext.window.Window', {
                            title : title,
                            closable : true,
                            draggable : false,
                            resizable : false,
                            glyph : criterion.consts.Glyph['ios7-information'],
                            alwaysOnTop : true,
                            x : (opts && opts.isAuthRequest) ? ((bodyWidth - criterion.Consts.UI_DEFAULTS.POPUP_WINDOW_WIDTH) / 2) : bodyWidth - criterion.Consts.UI_DEFAULTS.POPUP_WINDOW_WIDTH - 25,
                            y : (opts && opts.isAuthRequest) ? 10 : 80,
                            cls : 'waiting-connection-window',
                            width : criterion.Consts.UI_DEFAULTS.POPUP_WINDOW_WIDTH,
                            items : [
                                {
                                    xtype : 'component',
                                    html : message
                                }
                            ]
                        });

                        serviceMessagePopup.show();
                    }
                } else {
                    Ext.Viewport && Ext.Viewport.mask({
                        xtype : 'loadmask',
                        message : message,
                        cls : Ext.baseCSSPrefix + 'loading-mask waiting-connection-mask'
                    });
                }
            },

            hideServiceMessage() {
                if (!Ext.isModern) {
                    serviceMessagePopup && serviceMessagePopup.close();
                } else {
                    Ext.Viewport && Ext.Viewport.unmask();
                }
            }
        }
    };

});
