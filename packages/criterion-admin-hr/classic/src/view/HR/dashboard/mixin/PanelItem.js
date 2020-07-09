/**
 *
 */
Ext.define("criterion.view.hr.dashboard.mixin.PanelItem", function() {

    return {

        extend : 'Ext.Mixin',

        mixinConfig : {
            id : 'dashboardPanelItem'
        },

        dashboardPanelItem : true,

        setRecord : function(record) {
            throw new Error('Abstract method call');
        }
    };
});


