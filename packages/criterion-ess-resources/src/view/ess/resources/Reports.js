Ext.define('criterion.view.ess.resources.Reports', function() {

    return {
        alias : 'widget.criterion_selfservice_resources_reports',

        extend : 'criterion.view.Reports',

        requires : [
            'criterion.controller.ess.resources.Reports'
        ],

        title : i18n.gettext('Reports'),

        frame : true,

        ui : 'no-footer',

        allowAdminFeatures : false,

        mainRoute : criterion.consts.Route.SELF_SERVICE.RESOURCES_REPORTS,

        controller : {
            type : 'criterion_selfservice_resources_reports'
        }
    };

});