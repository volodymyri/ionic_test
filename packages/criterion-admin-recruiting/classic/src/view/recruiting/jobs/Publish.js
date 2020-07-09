Ext.define('criterion.view.recruiting.jobs.Publish', function() {

    return {
        alias : 'widget.criterion_recruiting_jobs_publish',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.PublishSites',
            'criterion.store.publishSite.JobPosting',
            'criterion.controller.recruiting.jobs.Publish',
            'Ext.toolbar.Spacer'
        ],

        viewModel : {
            data : {
                showSocial : false,
                linkedInCount : 0,
                twitterCount : 0,
                facebookCount : 0,
                googlePlusCount : 0
            },
            stores : {
                publishSiteJobPosting : {
                    type : 'criterion_publish_site_job_posting'
                }
            },

            formulas : {
                isShowSocial : function(data) {
                    return data('showSocial') && data('jobPosting.jobPortalUrl')
                },

                linkedInBtnText : function(data) {
                    var count = data('linkedInCount');
                    return 'Linked In&nbsp;' + (count ? '<i>' + count + '</i>' : '');
                },
                twitterBtnText : function(data) {
                    var count = data('twitterCount');
                    return 'Twitter&nbsp;' + (count ? '<i>' + count + '</i>' : '');
                },
                facebookBtnText : function(data) {
                    var count = data('facebookCount');
                    return 'Facebook&nbsp;' + (count ? '<i>' + count + '</i>' : '');
                },
                googlePlusBtnText : function(data) {
                    var count = data('googlePlusCount');
                    return 'Google+&nbsp;' + (count ? '<i>' + count + '</i>' : '');
                }
            }
        },

        controller : {
            type : 'criterion_recruiting_jobs_publish'
        },

        title : i18n.gettext('Publish'),

        store : {
            type : 'criterion_publish_sites',
            filters : [
                {
                    property : 'isEnabled',
                    value : true
                }
            ]
        },

        tbar : null,

        dockedItems : [
            {
                xtype : 'panel',
                dock : 'top',
                header : {
                    bind : {
                        title : '{jobPosting.title}'
                    }
                }
            },
            {
                xtype : 'toolbar',
                dock : 'top',
                padding : '15 25',
                bind : {
                    hidden : '{!isShowSocial}'
                },
                hidden : true,
                items : [
                    i18n.gettext('Social share'),
                    {
                        xtype : 'tbspacer',
                        width : 10
                    },
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['social-linkedin'],
                        bind : {
                            text : '{linkedInBtnText}'
                        },
                        cls : 'criterion-btn-feature',
                        handler : 'handleShareLinkedIn'
                    },
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['social-twitter'],
                        bind : {
                            text : '{twitterBtnText}'
                        },
                        cls : 'criterion-btn-feature',
                        handler : 'handleShareTwitter'
                    },
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['social-facebook'],
                        bind : {
                            text : '{facebookBtnText}'
                        },
                        cls : 'criterion-btn-feature',
                        handler : 'handleShareFacebook'
                    },
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['social-googleplus'],
                        bind : {
                            text : '{googlePlusBtnText}'
                        },
                        cls : 'criterion-btn-feature',
                        handler : 'handleShareGoogle'
                    }
                ]
            }
        ],

        viewConfig : {
            markDirty : false
        },

        columns : [
            {
                xtype : 'gridcolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                text : i18n.gettext('Site Name'),
                dataIndex : 'name'
            },
            {
                xtype : 'datecolumn',
                flex : 1,
                text : i18n.gettext('Publish Date'),
                dataIndex : 'publishDate'
            },
            {
                xtype : 'widgetcolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                widget : {
                    xtype : 'button',
                    scale : 'medium',
                    text : i18n.gettext('Details'),
                    handler : 'handleDetailsButton',
                    margin : 5,
                    bind : {
                        hidden : '{!record.isPortal}'
                    }
                }
            },
            {
                xtype : 'widgetcolumn',
                dataIndex : 'actionName',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                widget : {
                    xtype : 'button',
                    scale : 'medium',
                    handler : 'handleActionButton',
                    listeners : {
                        textchange : 'handleTextChange'
                    },
                    margin : 5
                }
            }
        ]
    };

});
