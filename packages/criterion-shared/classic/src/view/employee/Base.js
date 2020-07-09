Ext.define('criterion.view.employee.Base', function() {

    return {

        extend : 'criterion.ux.tab.Panel',

        alias : 'widget.criterion_employee',

        requires : [
            'criterion.controller.employee.Base',

            'criterion.store.person.Addresses',
            'criterion.store.FieldFormatTypes',
            'criterion.store.Employees',

            'criterion.view.employee.Benefits',
            'criterion.view.employee.Employment',
            'criterion.view.employee.AdvancedProfile',
            'criterion.view.employee.Miscellaneous',
            'criterion.view.employee.Demographics',
            'criterion.view.employee.Payroll',
            'criterion.view.employee.Security',
            'criterion.view.employee.benefit.Benefits',
            'criterion.view.employee.benefit.TimeOff',
            'criterion.view.employee.timeOffPlan.Accruals',
            'criterion.view.employee.demographic.Employment',
            'criterion.view.employee.DocumentsContainer',

            'criterion.view.employee.TabBar',
            'criterion.view.employee.profile.PersonInfo',

            'criterion.view.worker.Compensations',
            'criterion.view.person.Contacts',
            'criterion.view.person.SkillsAndEducation',
            'criterion.view.person.PriorEmployments',
            'criterion.view.person.Performance',

            'criterion.view.employee.demographic.Social',
            'criterion.view.employee.demographic.AdditionalAddress'
        ],

        viewModel : {
            data : {
                setEmployer : false,
                person : null,
                employee : null,
                address : null,
                employer : null,
                position : null,
                nextEmployee : null,
                prevEmployee : null
            },

            stores : {
                addresses : {
                    type : 'criterion_person_addresses',
                    proxy : {
                        extraParams : {
                            isPrimary : 1
                        }
                    }
                },
                phoneFormatTypes : {
                    type : 'criterion_field_types',
                    proxy : {
                        extraParams : {
                            typeValue : criterion.Consts.FIELD_TYPES.PHONES
                        }
                    }
                },
                employees : {
                    type : 'criterion_employees'
                }
            }
        },

        controller : {
            type : 'criterion_employee'
        },

        title : i18n.gettext('Employee'),

        listeners : {
            hide : 'onHide',
            childTabChange : 'onChildTabChange',
            afterrender : 'onAfterRender',
            reloadEmployee : 'onReloadEmployee'
        },

        bodyPadding : 0,

        personInfoCmp : null,

        showFilter : true,
        focusFilter : true,

        defaults : {
            dockedItems : [
                {
                    xtype : 'criterion_person_info',
                    listeners : {
                        connectIdentifierToPerson : 'handleConnectIdentifierToPerson'
                    },
                    dock : 'top',
                    bind : {
                        nextEmployee : '{nextEmployee}',
                        prevEmployee : '{prevEmployee}'
                    }
                }
            ]
        },

        tabPosition : 'left',
        tabRotation : 0,

        tabBar : {
            xtype : 'criterion_employee_tabbar',
            defaults : {
                margin : 0,
                width : 300
            }
        },

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            }
        ],

        items : [
            {
                xtype : 'criterion_employee_demographics',
                itemId : 'profile',
                reference : 'employee-profile',
                title : i18n.gettext('Profile'),
                locked : true,
                isSubMenu : true
            },
            {
                xtype : 'criterion_employee_employment',
                itemId : 'employment',
                reference : 'employee-employment',
                title : i18n.gettext('Employment'),
                isSubMenu : true
            },
            {
                xtype : 'criterion_employee_benefits',
                itemId : 'benefits',
                reference : 'employee-benefits',
                title : i18n.gettext('Benefits'),
                isSubMenu : true
            },
            {
                xtype : 'criterion_person_payroll',
                itemId : 'payroll',
                reference : 'employee-payroll',
                title : i18n.gettext('Payroll'),
                isSubMenu : true
            },
            {
                xtype : 'criterion_employee_documents_container',
                itemId : 'documents',
                reference : 'employee-documents',
                title : i18n.gettext('Documents'),
                isSubMenu : true,
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DOCUMENTS, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_employee_advanced_profile',
                itemId : 'advancedProfile',
                reference : 'employee-advancedProfile',
                title : i18n.gettext('Advanced Profile'),
                isSubMenu : true
            },
            {
                xtype : 'criterion_person_skillsandeducation',
                itemId : 'skills',
                reference : 'employee-skills',
                title : i18n.gettext('Education and Skills'),
                isSubMenu : true
            },
            {
                xtype : 'criterion_person_performance',
                itemId : 'performance',
                reference : 'employee-performance',
                title : i18n.gettext('Performance'),
                isSubMenu : true
            },
            {
                xtype : 'criterion_employee_miscellaneous',
                itemId : 'miscellaneous',
                reference : 'employee-miscellaneous',
                title : i18n.gettext('Miscellaneous'),
                isSubMenu : true
            }
        ],

        setBaseRoute : function(routePrefix) {
            var me = this;

            me.items.each(function(item) {
                item.items.each(function(subItem) {
                    var controller = subItem.getController();

                    if (controller && Ext.isFunction(controller.setBaseRoute)) {
                        var routeTemplate = routePrefix + '/{0}/' + item.getItemId() + '/' + subItem.getItemId();

                        controller.setBaseRoute(Ext.String.format(routeTemplate, ':employee'));
                        controller.makeGridToken = function(id) {
                            if (!me.getViewModel().get('employee')) {
                                return ''; //CRITERION-6047 defect number 4
                            }

                            var baseRoute = Ext.String.format(routeTemplate, me.getViewModel().get('employee').getId());

                            if (!id) {
                                return baseRoute
                            } else {
                                return baseRoute + '/' + id
                            }
                        }
                    }
                }, this)
            }, this);
        },

        /**
         * @param pageId
         * @param [childPageId]
         */
        setActivePage : function(pageId, childPageId) {
            var me = this,
                fItem;

            if (pageId) {
                fItem = me.lookup('employee-' + pageId);
                if (fItem && me.getActivePages().indexOf(fItem) === -1) {
                    me.setActiveItem(fItem);
                }

                if (fItem) {
                    // activate child tab
                    if (childPageId && !fItem.hasDeferredItems) {
                        fItem.items.each(function(item) {
                            if (item.itemId === childPageId) {
                                if (fItem.getLayout().getActiveItem() !== item) {
                                    fItem.getLayout().setActiveItem(item);
                                }
                            }
                        });
                    } else if (childPageId) {
                        if (!fItem.deferredItemsReady) {
                            fItem.on('deferredItemsReady', () => {
                                me.getTabBar().items.each((item) => {
                                    if (item.subItem && item.subItem.itemId === childPageId) {
                                        me.getTabBar().doActivateTab(item);
                                    }
                                });
                            });
                        }

                        fItem.setActiveDeferredItem(childPageId);
                    }
                } else {
                    console && console.log('couldn\'t find page', pageId);
                }
            }

            this.updatePageTitle();
        },

        getActivePages : function() {
            var me = this,
                page = me.getLayout().getActiveItem(),
                subPage = page.getLayout().getActiveItem();

            return [page, subPage];
        },

        findPageWithSub() {
            let pageWithSubs = Ext.Array.findBy(this.getLayout().getLayoutItems(), item => {
                    return !!item.items.length;
                }),
                subPage = pageWithSubs && pageWithSubs.getLayout().getActiveItem();

            if (pageWithSubs && subPage) {
                return [pageWithSubs, subPage];
            } else {
                return [];
            }
        },

        updatePageTitle : function() {
            var activePages = this.getActivePages(),
                page = activePages[0],
                subPage = activePages[1];

            page.tab.title && criterion.Utils.setPageTitle(page.tab.title, true);
            if (subPage) {
                subPage.tab.title && criterion.Utils.setPageTitle(subPage.tab.title, true);
            }
        },

        getRecord : Ext.emptyFn
    }

});
