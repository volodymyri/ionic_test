Ext.define('criterion.view.ess.dashboard.infoActionPanel.ExternalLinks', function() {

    const SAML2TYPE = 2;

    return {

        extend : 'criterion.ux.grid.Panel',

        requires : [
            'Ext.grid.column.Template'
        ],

        alias : 'widget.criterion_selfservice_dashboard_info_action_panel_external_links',

        title : i18n.gettext('External Links'),

        iconCls: 'icon-links',

        hideHeaders : true,

        layout : 'fit',

        width : '100%',

        scrollable : false,

        collapsible : true,

        titleCollapse : true,

        cls : 'criterion-ess-dashboard-grid-links info-panel-element',

        disableSelection : true,

        bind : {
            store : '{essLinks}'
        },

        emptyText : i18n.gettext('You have no external links'),

        columns : [
            {
                xtype : 'templatecolumn',
                tdCls : 'criterion-ess-dashboard-grid-td-link',
                text : '',
                tpl : Ext.create('Ext.XTemplate',
                '<tpl if="type != ' + SAML2TYPE + '">',
                        '<a href="{url}" data-qtip="{description}" target="_blank">{description}</a>',
                    '</tpl>',
                    '<tpl if="type == ' + SAML2TYPE + '">',
                        '<a href="' + criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYER_ESS_LINK_GET_SAML2_FORM + '?id={id}&_dc=' + (+Date.now())) + '" data-qtip="{tooltip}" target="_blank">{description}</a>',
                    '</tpl>'
                ),
                flex : 1
            }
        ]
    }
});
