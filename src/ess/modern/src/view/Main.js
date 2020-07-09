Ext.define('ess.view.Main', function() {

    var PAGE_IDENTS = {
        SELF_SERVICE : 'selfService',
        TIME_ENTRY : 'timeEntry',
        EXTERNAL_LINKS : 'externalLinks'
    };

    return {

        extend : 'Ext.Container',

        alias : 'widget.ess_main',

        requires : [
            'criterion.vm.ess.Main',
            'ess.controller.Main',
            'ess.view.EmployeeInfo',
            'ess.view.MainMenu',
            'ess.view.PersonalInformation',
            'ess.view.Dashboard',
            'ess.view.time.Timesheet',
            'ess.view.time.TeamPunch',
            'ess.view.time.TimeOffs',
            'ess.view.Payroll',
            'ess.view.MenuBar',
            'ess.view.Scheduling',
            'ess.view.Communities',
            'ess.view.Recruiting',
            'ess.view.Learning',
            'ess.view.ExternalLinks',
            'ess.view.TimeEntry',
            'Ext.ActionSheet',

            'ess.view.NativeMenu',

            'Ext.plugin.PullRefresh',
            'Ext.Toast',
            'Ext.form.Panel',
            'Ext.form.FieldSet',
            'Ext.field.DatePicker',
            'Ext.field.Hidden',
            'criterion.view.GridView',
            'criterion.ux.field.CodeDetail',
            'criterion.ux.field.CodeDetailMulty',
            'criterion.ux.field.DatePicker',
            'criterion.ux.field.Format',
            'criterion.ux.Msg',
            'criterion.grid.plugin.PagingToolbar'
        ],

        layout : {
            type : 'card'
        },

        PAGE_IDENTS : PAGE_IDENTS,

        viewModel : {
            type : 'criterion_ess_main',

            data : {
                pageIdent : PAGE_IDENTS.SELF_SERVICE,

                disableTimeEntry : true
            }
        },

        controller : {
            type : 'ess_modern_main'
        },

        listeners : {
            scope : 'controller'
        },

        items : [
            {
                xtype : 'ess_view_main_menu',
                reference : 'mainMenu'
            },
            {
                xtype : 'ess_modern_dashboard',
                reference : 'dashboard',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_personal_information',
                reference : 'profile',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_time_timesheet',
                reference : 'timesheet',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_time_team_punch',
                reference : 'teamPunch',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_time_timeoffs',
                reference : 'timeoffs',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_payroll',
                reference : 'payroll',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_scheduling',
                reference : 'scheduling',
                hasMenuBar : true
            },
            {
                xtype : 'ess_communities',
                reference : 'communities',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_recruiting',
                reference : 'recruiting',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_learning',
                reference : 'learning',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_external_links',
                reference : 'externalLinks',
                hasMenuBar : true
            },
            {
                xtype : 'ess_modern_time_entry',
                reference : 'timeEntry',
                hasMenuBar : true
            },

            {
                xtype : 'ess_modern_native_menu',
                reference : 'nativeMenu'
            },

            {
                xtype : 'container',
                docked : 'bottom',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                cls : 'main-bottom-toolbar',
                items : [
                    {
                        xtype : 'button',
                        iconAlign : 'top',
                        iconCls : 'self_service',
                        flex : 1,
                        bind : {
                            cls : '{pageIdent === "' + PAGE_IDENTS.SELF_SERVICE + '" ? "selected" : ""}'
                        },
                        text : i18n.gettext('Self Service'),
                        handler : 'goToSelfService'
                    },
                    {
                        xtype : 'button',
                        iconAlign : 'top',
                        iconCls : 'time_entry',
                        flex : 1,
                        hidden : true,
                        disabled : true,
                        bind : {
                            cls : '{pageIdent === "' + PAGE_IDENTS.TIME_ENTRY + '" ? "selected" : ""}',
                            disabled : '{disableTimeEntry}'
                        },
                        text : i18n.gettext('Time Entry'),
                        handler : 'goToTimeEntry',
                        reference : 'timeEntryButton'
                    },
                    {
                        xtype : 'button',
                        iconAlign : 'top',
                        iconCls : 'external_links',
                        flex : 1,
                        bind : {
                            cls : '{pageIdent === "' + PAGE_IDENTS.EXTERNAL_LINKS + '" ? "selected" : ""}'
                        },
                        text : i18n.gettext('External Links'),
                        handler : 'goToExternalLinks'
                    }
                ]
            }
        ],

        constructor : function(config) {
            var employerLocations = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.ESS_USER_WIDGET_EMPLOYER_LOCATIONS.storeId),
                vm;

            this.callParent(arguments);

            vm = this.getViewModel();

            employerLocations.on('load', function(store) {
                if (vm.destroyed) {
                    return
                }
                var checkInLocationId = vm.get('employee.checkInLocationId'),
                    checkInLocation;

                if (checkInLocationId) {
                    checkInLocation = store.getById(checkInLocationId);

                    vm.set('placeName', checkInLocation ? checkInLocation.get('description') : '&nbsp;');
                } else {
                    vm.set('placeName', '&mdash;');
                }
            });

            vm.setStores({
                employerLocations : employerLocations
            });

            document.addEventListener('backbutton', e => {
                let maybeButtons = Ext.ComponentQuery.query(
                    'ess_modern_menubar:visible(true) button[itemId=backButton]:visible(true), ' +
                    'ess_modern_menubar:visible(true) button[itemId=menuButton]:visible(true)');

                if (maybeButtons.length) {
                    maybeButtons[0].onTap && maybeButtons[0].onTap();

                    e.preventDefault();
                }

            });
        }
    }
});
