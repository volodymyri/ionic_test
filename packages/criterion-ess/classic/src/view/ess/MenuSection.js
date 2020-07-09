/**
 * @depreccated
 */
Ext.define('criterion.view.ess.MenuSection', function() {

    return {
        alias : 'widget.criterion_ess_menu_section',

        extend : 'Ext.container.Container',

        defaultType : 'button',

        defaults : {
            cls : 'criterion-ess-menu-btn',
            listeners : {
                click : function(menuButton) {
                    this.up('button').hideMenu();
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

        componentCls : 'criterion-ess-menu-section',

        initComponent : function() {
            this.items = this.items || [];

            this.callParent(arguments);

            if (this.title) {
                this.insert(0, {
                    xtype : 'component',
                    cls : 'criterion-ess-menu-heading',
                    html : this.title
                });
            }
        }

    }
});