Ext.define('criterion.controller.hr.Dashboard', function() {

    var CFG = criterion.consts.Dashboard;

    function saveSettings(store) {
        var viewNumber = store.viewNumber,
            settingsStore = Ext.getStore('Dashboard'),
            settingsRecord, settingsData,
            data = store.getRange();

        settingsRecord = settingsStore.findRecord('viewNumber', viewNumber);

        if (data.length) {
            if (!settingsRecord) {
                settingsRecord = settingsStore.add({
                    viewNumber : viewNumber
                })[0];
                settingsRecord.phantom = true;
            }

            settingsData = Ext.Array.map(data, function(record) {
                var rec = record.getData();
                delete rec['metric'];
                return rec;
            });

            settingsRecord.set('settings', Ext.encode(settingsData));
        } else if (settingsRecord) {
            settingsStore.remove(settingsRecord);
        }

        settingsStore.sync();
    }

    function handleEditorAddClick(btn) {
        var form = btn.up('criterion_form'),
            record = form.getRecord();

        if (form.isValid()) {
            form.updateRecord(record);
            record.set('id', +new Date());

            form.store.add(record);
            saveSettings(form.store);
            form.close();
        }
    }

    function handleEditorUpdateClick(btn) {
        var form = btn.up('criterion_form'),
            record = form.getRecord();

        if (form.isValid()) {
            form.updateRecord(record);
            saveSettings(form.store);
            form.close();
        }
    }

    function handleEditorRemoveClick(btn) {
        var form = btn.up('criterion_form'),
            record = form.getRecord();

        form.close();
        form.store.remove(record);
        saveSettings(form.store);
    }

    function showEditor(editorClassName, store, record) {
        var add = !record,
            editor, buttons;

        if (add) {
            record = Ext.create(store.getModel());
        }

        buttons = [
            {
                xtype : 'button',
                text : add ? i18n.gettext('Create') : i18n.gettext('Update'),
                handler : add ? handleEditorAddClick : handleEditorUpdateClick,
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM, (add ? criterion.SecurityManager.CREATE : criterion.SecurityManager.UPDATE), true)
                }
            }
        ];

        if (!add) {
            buttons.unshift({
                xtype : 'button',
                text : i18n.gettext('Remove'),
                cls : 'criterion-btn-light',
                handler : handleEditorRemoveClick,
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM, criterion.SecurityManager.DELETE, true)
                }
            });
        }

        editor = Ext.create(editorClassName, {
            store : store,
            buttons : buttons,

            modal : true,
            draggable : true,
            cls : 'criterion-modal',
            closable : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                    height : 'auto',
                    modal : true
                }
            ]
        });

        editor.show();
        editor.loadRecord(record);
    }

    return {
        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.view.hr.dashboard.ValueEditor',
            'criterion.view.hr.dashboard.ChartEditor'
        ],

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        alias : 'controller.criterion_hr_dashboard',

        listen : {
            global : {
                employeeChanged : 'handleEmployeeChanged'
            }
        },

        _fillMetrics : function(viewNumber, settings) {
            return Ext.Array.filter(settings, function(row) {
                var metricId = row.metric_id,
                    metric;

                if (!metricId) {
                    return false;
                }

                metric = viewNumber == CFG.VIEW.VALUES ? CFG.getValueMetrics(metricId) : CFG.getChartMetrics(metricId);

                return !!(row.metric = metric);
            });
        },

        handleEmployeeChanged : function(employee) {
            var events = this.getStore('feed');

            events.getProxy().setExtraParam('employeeId', employee.getId());

            if (this.checkViewIsActive()) {
                events.loadPage(1);
            }
        },

        handleDashboardLoad : function(store) {
            store.each(function(record) {
                var viewNumber = record.get('viewNumber'),
                    store = this.getStore('store' + viewNumber),
                    settings;

                if (store) {
                    settings = this._fillMetrics(viewNumber, Ext.decode(record.get('settings'), true));

                    store.setData(settings);
                }
            }, this);
        },

        handleRoute : function() {
            this.getStore('dashboard').load({
                params : {
                    personId : criterion.Api.getCurrentPersonId()
                }
            });

            // the fix for mark loading
            Ext.defer(function() {
                var feed = this.getStore('feed'),
                    employeeId = feed.getProxy().getExtraParams()['employeeId'];

                if (employeeId) {
                    feed.loadPage(1);
                }
            }, 1000, this);
        },

        handleAddPanelElement : function(btn) {
            if (/ValuesPanel$/.test(btn.ident)) {
                showEditor(
                    'criterion.view.hr.dashboard.ValueEditor',
                    btn.up('criterion_hr_dashboard_values_panel').getStore()
                );
            } else {
                showEditor(
                    'criterion.view.hr.dashboard.ChartEditor',
                    btn.up('criterion_hr_dashboard_charts_panel').getStore()
                );
            }
        },

        handleConfigValuePanelItem : function(btn) {
            showEditor(
                'criterion.view.hr.dashboard.ValueEditor',
                btn.up('criterion_hr_dashboard_values_panel').getStore(),
                btn.up('criterion_hr_dashboard_values_panel_item').getRecord()
            );
        },

        handleConfigChartPanelItem : function(store, record) {
            showEditor(
                'criterion.view.hr.dashboard.ChartEditor',
                store,
                record
            );
        },

        init : function() {
            var me = this,
                routes = {};

            //TODO Move to common controller with rerouting
            this.setReRouting();

            routes[criterion.consts.Route.HR.DASHBOARD] = 'handleRoute';
            this.setRoutes(routes);

            me.callParent(arguments);
        }

    };

});
