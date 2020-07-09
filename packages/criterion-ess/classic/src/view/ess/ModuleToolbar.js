Ext.define('criterion.view.ess.ModuleToolbar', function() {

    var ROUTES = criterion.consts.Route,
        SELF_SERVICE = ROUTES.SELF_SERVICE;

    return {
        alias : 'widget.criterion_selfservice_module_toolbar',

        extend : 'Ext.toolbar.Toolbar',

        requires : [
            'criterion.controller.ess.ModuleToolbar',
            'criterion.view.moduleToolbar.Modules',
            'criterion.view.moduleToolbar.EssActions',
            'criterion.view.moduleToolbar.EssSupport',
            'criterion.view.ess.Help',
            'criterion.view.moduleToolbar.SandboxMark'
        ],

        controller : {
            type : 'criterion_selfservice_module_toolbar'
        },

        viewModel : {
            data : {
                logoSrc : null,
                showLogo : false,
                hasLogo : false
            }
        },

        cls : 'criterion-moduletoolbar',

        defaults : {
            scale : 'large',
            iconAlign : 'left',
            hrefTarget : '_self',
            height : 60
        },

        trackMenus : false,

        margin : 0,

        items : [
            {
                xtype : 'criterion_moduletoolbar_modules',
                reference : 'modules',
                text : '',
                glyph : criterion.consts.Glyph['navicon'],
                arrowCls : '',
                menuAlign : 'tl-bl?',
                menuAlignOffset : [15, 5],
                width : 65
            },
            {
                xtype : 'component',
                cls : 'criterion-selfservice-moduletoolbar-title',
                html : i18n.gettext('Self Service'),
                minWidth : 125
            },
            {
                xtype : 'container',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                padding : 15,
                items : [
                    {
                        xtype : 'image',
                        alt : 'logo',
                        bind : {
                            hidden : '{!showLogo || !hasLogo}',
                            src : '{logoSrc}'
                        },
                        height : 30,
                        listeners : {
                            load : { // TODO width doesn't change after image source loaded
                                element : 'el',
                                fn : function(el, domEl) {
                                    if (domEl.naturalWidth > 1) {
                                        this.component.setWidth(domEl.height * domEl.naturalWidth / domEl.naturalHeight);
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype : 'container',
                        cls : 'criterion-selfservice-moduletoolbar-organization-name',
                        hidden : true,
                        bind : {
                            hidden : '{showLogo}',
                            html : '{organizationName}'
                        }
                    }
                ]
            },
            '->',
            {
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'middle'
                },
                items : [
                    {
                        xtype : 'criterion_moduletoolbar_sandbox_mark'
                    }
                ]
            },
            '->',
            {
                xtype : 'button',
                cls : [
                    'criterion-moduletoolbar-btn-secondary',
                    'criterion-moduletoolbar-ess-actions',
                    'criterion-toolbar-action-button'
                ],
                glyph : criterion.consts.Glyph['android-people'],
                tooltip : i18n.gettext('Delegation enable'),
                href : ROUTES.getDirect(SELF_SERVICE.PREFERENCES_DELEGATION),
                arrowVisible : false,
                hidden : true,
                bind : {
                    hidden : '{!hasDelegation}'
                }
            },
            {
                xtype : 'criterion_moduletoolbar_inbox'
            },
            {
                xtype : 'criterion_moduletoolbar_ess_support',

                cls : [
                    'criterion-moduletoolbar-btn-secondary',
                    'criterion-toolbar-action-button'
                ]
            },
            {
                xtype : 'criterion_moduletoolbar_ess_actions',
                moduleId : SELF_SERVICE.MAIN,
                cls : [
                    'criterion-moduletoolbar-btn-secondary',
                    'criterion-moduletoolbar-ess-actions',
                    'criterion-toolbar-action-button'
                ],
                glyph : criterion.consts.Glyph['ios7-plus-empty'],
                arrowVisible : false,
                menuAlign : 'tr-br?',
                menuAlignOffset : [-12, 5],
                bind : {
                    hidden : '{!securityPlusMenu}'
                },
                reference : 'actionButton'
            },
            {
                xtype : 'criterion_moduletoolbar_ess_user',
                moduleId : SELF_SERVICE.MAIN,
                cls : [
                    'criterion-moduletoolbar-ess-user',
                    'criterion-moduletoolbar-btn-secondary'
                ],
                arrowVisible : false,
                userModuleWithUserName : this.userModuleWithUserName,
                glyph : criterion.consts.Glyph['android-more-vertical'],
                reference : 'user'
            }
        ]
    }
});
