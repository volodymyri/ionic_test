Ext.define('criterion.controller.ess.Main', function() {

    let _activeEmployee = null;

    return {
        extend : 'criterion.controller.Module',

        alias : 'controller.criterion_selfservice_main',

        requires : [
            'Ext.Package'
        ],

        listen : {
            global : {
                employeeChanged : 'handleEmployeeChanged',
                employerChanged : 'handleEmployerChanged',
                updateEss : 'handleUpdateEss'
            }
        },

        handleUpdateEss : function() {
            let me = this,
                view = this.getView(),
                navigationStatic = view.down('criterion_ess_navigation_static');

            this.getViewModel().setSecurityData();

            me.checkNavigationVisible(navigationStatic);
        },

        checkNavigationVisible : function(navigation) {
            navigation && navigation.items && navigation.items.each(function(button) {
                let isLastVisible = true;

                Ext.Array.each(button.query('criterion_ess_navigation_menu_section'), function(section) {
                    if (isLastVisible) {
                        section.addCls('section-last-visible');
                    } else {
                        section.removeCls('section-last-visible');
                    }

                    isLastVisible = isLastVisible ? section.isHidden() : false;
                }, null, true);
            });
        },

        handleEmployeeChanged : function(employee) {
            let currentPerson = criterion.Api.getCurrentPerson(),
                view = this.getView(),
                staticHiringManagerSection = view.query('criterion_ess_navigation_static [_isHiringManagerSection]'),
                dynamicHiringManagerSection = view.query('criterion_ess_navigation_dynamic [_isHiringManagerSection]');

            _activeEmployee = employee;

            this.getViewModel().set({
                employerId : criterion.Api.getEmployerId(),
                employeeId : criterion.Api.getEmployeeId(),
                employeeName : currentPerson ? currentPerson.firstName : '',
                employeeFullName : currentPerson ? (currentPerson.firstName + ' ' + currentPerson.lastName) : ''
            });

            Ext.Array.each(staticHiringManagerSection, function(cmp) {
                cmp.hide();
            });
            Ext.Array.each(dynamicHiringManagerSection, function(cmp) {
                cmp.hide();
            });

            !employee.get('terminationDate') && Ext.defer(function() {
                let hiringManager = ess.Application.isEmployeeHiringManager();

                if (hiringManager && criterion.SecurityManager.getESSAccess(criterion.SecurityManager.ESS_KEYS.JOB_POSTINGS)) {
                    Ext.Array.each(staticHiringManagerSection, function(cmp) {
                        cmp.show();
                    });
                    Ext.Array.each(dynamicHiringManagerSection, function(cmp) {
                        cmp.show();
                    });
                }
            });
        },

        handleEmployerChanged : function(employer) {
            this.getViewModel().set('employerName', employer && employer.get('legalName'))
        },

        showStaticMenu : function() {
            let view = this.getView();

            view.down('criterion_ess_navigation_static').show();
            view.down('criterion_ess_navigation_dynamic').hide();
        },

        showDynamicMenu : function() {
            let view = this.getView();

            view.down('criterion_ess_navigation_static').hide();
            view.down('criterion_ess_navigation_dynamic').show();
        },

        handleBeforeCardRoute : function(card, itemId) {
            if (Ext.isModern) {
                return
            }

            let me = this,
                action = arguments[arguments.length - 1],
                view = this.getView(),
                cardCt = me.getCard(card),
                pkg = cardCt && cardCt.pkg;

            if (pkg) {
                if (Ext.Package.isLoaded(pkg)) {
                    me.handlePackage(card, itemId, cardCt, action, view);
                } else {
                    view.setLoading(true);
                    Ext.Package.load(pkg).then(me.handlePackage.bind(me, card, itemId, cardCt, action, view, pkg));
                }
            } else {
                me.handlePackage(card, itemId, cardCt, action, view);
            }
        },

        handlePackage : function(card, itemId, cardCt, action, view, pkg) {
            let me = this;

            view.setLoading(false);

            if (cardCt && cardCt.xtype !== 'menuitem') {
                Ext.Array.each(['static', 'dynamic'], function(navType) {
                    let navigation = view.down(Ext.util.Format.format('criterion_ess_navigation_{0}', navType)),
                        button = navigation.down(Ext.util.Format.format('criterion_view_ess_navigation_{0}_button[_routeRef={1}]', navType, card)),
                        item;

                    if (!button) {
                        return;
                    }

                    if (itemId && itemId !== action) {
                        let ref = itemId.split('/');

                        item = button.down(Ext.util.Format.format('{0}button[_routeRef={1}]', navType === 'static' ? '[cls~=ess-navigation-menu] ' : '', ref[ref.length - 1]));
                    } else {
                        item = button.down(Ext.util.Format.format('{0}button', navType === 'static' ? '[cls~=ess-navigation-menu] ' : ''));
                    }

                    Ext.Array.each(navigation.query('[_highlighted=true]'), function(highlighted) {
                        highlighted._highlighted = false;
                        highlighted.removeCls('highlighted-button');
                    });

                    button._highlighted = true;
                    button.addCls('highlighted-button');

                    if (item) {
                        item._highlighted = true;
                        item.addCls('highlighted-button');
                    }
                });
            } else {
                if (cardCt) {
                    delete arguments[0];
                }
            }

            if (cardCt.items && !cardCt.items.length && cardCt._child) {
                cardCt.add(cardCt._child);
            }

            me.mixins.cardrouter.handleBeforeCardRoute.apply(this, [card, action]);
        },

        onCalendarsCountChanged : function(count) {
            this.getViewModel().set('calendarsCount', count);
        }
    };
});

