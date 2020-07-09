Ext.define('criterion.view.settings.performanceReviews.manageReviews.Statuses', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_manage_reviews_statuses',

        extend : 'criterion.ux.Panel',

        title : i18n.gettext('Details'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '70%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        viewModel : {},

        layout : 'fit',

        bbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Ok'),
                cls : 'criterion-btn-primary',
                scale : 'small',
                handler : function() {
                    this.up('criterion_settings_performance_reviews_manage_reviews_statuses').fireEvent('ok');
                }
            }
        ],

        items : [
            {
                xtype : 'criterion_gridpanel',

                bind : {
                    store : '{statuses}'
                },

                columns : [
                    {
                        text : i18n.gettext('Reviewer'),
                        dataIndex : 'reviewer',
                        flex : 1
                    },
                    {
                        text : i18n.gettext('Status'),
                        dataIndex : 'status',
                        flex : 1
                    }
                ]
            }
        ]
    }
});
