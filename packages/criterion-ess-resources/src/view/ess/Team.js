Ext.define('criterion.view.ess.Team', function() {

    return {

        alias : 'widget.criterion_selfservice_team',

        extend : 'criterion.view.OrgChart',

        requires : [
            'criterion.controller.ess.Team',
            'criterion.store.Positions'
        ],

        controller : {
            type : 'criterion_selfservice_team'
        },

        listeners : {
            activate : 'handleActivate'
        },

        viewModel : {
            data : {
                disableEmployerSwitcher : true
            }
        },

        header : false,
        sideBarCollapsible : false,

        sidePanelCfg : {
            title : i18n.gettext('Team'),

            frame : true,

            split : {
                width : 5
            }
        },

        reportPanelCfg : {
            header : {
                title : i18n.gettext('Organization view')
            }
        },

        hideReportPanel : false,

        bottomToolbarCfg : {
            cls : 'criterion-ess-panel-toolbar',
            padding : '0 20 25'
        },

        goToProfile : false
    };
});
