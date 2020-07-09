Ext.define('criterion.view.GridView', function() {

    return {
        alias : [
            'widget.criterion_gridview'
        ],

        extend : 'criterion.view.Grid',

        requires : [
            'criterion.controller.GridView'
        ],

        config : {
            preventStoreLoad : false
        },

        controller : {
            type : 'criterion_gridview'
        },

        listeners : {
            scope : 'controller',
            itemtap : 'handleEditAction',
            painted : 'handleActivate'
        }

    };
});
