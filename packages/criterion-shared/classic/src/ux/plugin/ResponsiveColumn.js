Ext.define('criterion.ux.plugin.ResponsiveColumn', function() {

    return {
        extend : 'Ext.plugin.Abstract',

        alias : 'plugin.criterion_responsive_column',

        pluginId : 'criterionResponsiveColumn',

        insertAfterEach : false,

        init : function(view) {
            this.callParent(arguments);

            if (this.insertAfterEach) {
                view.items.each(function(item) {
                    var r = view.add({
                        xtype : 'component',

                        flex : 0.3,

                        responsiveConfig : criterion.Utils.createResponsiveConfig([
                            {
                                rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDER,
                                config : {
                                    hidden : false
                                }
                            },
                            {
                                rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDE,
                                config : {
                                    hidden : true
                                }
                            }
                        ])
                    });

                    view.moveAfter(r, item);
                });
            } else {
                view.add({
                    xtype : 'component',

                    flex : 1,

                    responsiveConfig : criterion.Utils.createResponsiveConfig([
                        {
                            rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDER,
                            config : {
                                hidden : false
                            }
                        },
                        {
                            rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDE,
                            config : {
                                hidden : true
                            }
                        }
                    ])
                });
            }
        }
    };

});
