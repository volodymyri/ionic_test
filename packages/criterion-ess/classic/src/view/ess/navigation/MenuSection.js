Ext.define('criterion.view.ess.navigation.MenuSection', function() {

    return {
        alias : 'widget.criterion_ess_navigation_menu_section',

        extend : 'Ext.container.Container',

        defaultType : 'button',

        defaults : {
            cls : 'criterion-ess-navigation-menu-btn',
            textAlign : 'left',
            listeners : {
                click : function(menuButton) {
                    let button = this.up('button');
                    
                    if (button) {
                        button.hideMenu();
                    }
                    /*
                        Part of solution D2-8. For touch devices with small resolution button hyperlink may not fire
                        but button click works, so if redirection doesn't happen in short period then try to force it
                     */
                    if (menuButton.href && Ext.platformTags.touch) {
                        Ext.defer(function() {
                            if (location.origin + menuButton.href !== location.href) {
                                menuButton.doNavigate();
                            }
                        }, 100);
                    }
                }
            },
            hrefTarget : '_self'
        },

        layout : 'vbox',

        componentCls : 'criterion-ess-navigation-menu-section',

        initComponent : function() {
            let isStaticMenu = this.isStaticMenu;

            this.items = this.items || [];

            Ext.each(this.items, item => {
                item.width = isStaticMenu ? 300 : 220
            });

            this.callParent(arguments);

            if (this.title) {
                this.insert(0, {
                    xtype : 'component',
                    cls : 'criterion-ess-navigation-menu-heading',
                    html : this.title
                });
            }

            Ext.GlobalEvents.on('employeeChanged', 'onEmployeeChange', this);
        },

        onEmployeeChange : function(employee) {
            let employer = Ext.getStore('Employers').getById(employee.get('employerId')),
                isMultiPosition = employer.get('isMultiPosition');

            if (!this._monitorMultiPosition) {
                return;
            }

            Ext.Array.each(this.query('button[isMultiPositionMode=true]'), function(button) {
                if (isMultiPosition && criterion.SecurityManager.getESSAccess(criterion.SecurityManager.ESS_KEYS.ADDITIONAL_POSITIONS)) {
                    button.show();
                } else {
                    button.hide();
                }
            });

            Ext.Array.each(this.query('button[multiPositionTitle]'), function(button) {
                if (isMultiPosition) {
                    button._singlePositionTitle = button._singlePositionTitle || button.getText();
                    button.setText(button.multiPositionTitle);
                } else {
                    Ext.isDefined(button._singlePositionTitle) && button.setText(button._singlePositionTitle);
                }
            });
        },

        onAdd : function(item) {
            let itemRef = item.href && item.href.split('/');

            itemRef = itemRef && itemRef[itemRef.length - 1];
            item._routeRef = itemRef;

            if (Ext.isDefined(item.isMultiPositionMode) || Ext.isDefined(item.multiPositionTitle)) {
                this._monitorMultiPosition = true;
            }
        }

    }
});
