Ext.define('criterion.view.recruiting.jobs.PublishDetails', function() {

    return {
        alias : 'widget.criterion_recruiting_jobs_publish_details',

        extend : 'criterion.ux.Panel',

        title : i18n.gettext('Details'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        viewModel : {
            data : {
                jobPostingUrl : null,
                jobApplyUrl : null
            }
        },

        controller : {
            type : 'criterion_recruiting_jobs_publish_details'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        draggable : true,

        defaults : {
            xtype : 'panel',
            layout : {
                type : 'hbox'
            },
            margin : 5
        },

        items : [
            {
                items : [
                    {
                        xtype : 'textarea',
                        fieldLabel : i18n.gettext('Job Posting'),
                        readOnly : true,
                        bind : {
                            value : '{jobPostingUrl}'
                        },
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        listeners : {
                            click : 'handleCopyToClipboardClick'
                        },
                        scale : 'small',
                        margin : '0 5',
                        text : i18n.gettext('Copy to Clipboard')
                    }
                ]
            },
            {
                items : [
                    {
                        xtype : 'textarea',
                        fieldLabel : i18n.gettext('Apply'),
                        readOnly : true,
                        bind : {
                            value : '{jobApplyUrl}'
                        },
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        listeners : {
                            click : 'handleCopyToClipboardClick'
                        },
                        scale : 'small',
                        margin : '0 5',
                        text : i18n.gettext('Copy to Clipboard')
                    }
                ]
            }
        ],
        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Close'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleClose'
                }
            }
        ]
    }
});
