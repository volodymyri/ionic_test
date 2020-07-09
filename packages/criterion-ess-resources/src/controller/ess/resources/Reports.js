Ext.define('criterion.controller.ess.resources.Reports', function() {

    return {
        extend : 'criterion.controller.Reports',

        alias : 'controller.criterion_selfservice_resources_reports',

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        moduleId : criterion.Consts.REPORT_MODULE.SELF_SERVICE,

        init : function() {
            this.callParent(arguments);

            this.setReRouting();
        }

    };

});