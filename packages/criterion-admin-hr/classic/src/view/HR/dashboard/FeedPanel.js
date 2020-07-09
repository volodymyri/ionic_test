Ext.define('criterion.view.hr.dashboard.FeedPanel', function() {

    return {
        extend : 'criterion.ux.Panel',

        mixins : [
            'criterion.ux.mixin.RecordsHolder'
        ],

        requires : [
            'Ext.view.View'
        ],

        alias : 'widget.criterion_hr_dashboard_feed',

        width : 300,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaultListenerScope : true,

        viewModel : {
            formulas : {
                weekStart : function() {
                    var today = new Date,
                        start = today.getDate() - today.getDay();

                    return new Date(today.setDate(start));
                },
                weekEnd : function(get) {
                    return Ext.Date.add(get('weekStart'), Ext.Date.DAY, 6);
                },
                weekTitle : function(get) {
                    var weekStart = Ext.Date.format(get('weekStart'), criterion.consts.Api.WEEK_DATE_FORMAT),
                        weekEnd = Ext.Date.format(get('weekEnd'), criterion.consts.Api.WEEK_DATE_FORMAT),
                        title = i18n.gettext('This Week');

                    return Ext.util.Format.format('{0}<span class="date">, {1} - {2}</span>', title, weekStart, weekEnd);
                },
                hideLoadMore : get => !get('feed') || get('feed.totalCount') <= get('feed.currentPage') * get('feed.pageSize')
            }
        },

        items : [
            {
                xtype : 'component',
                cls : 'criterion-feed-item-week',
                bind : {
                    html : '{weekTitle}'
                }
            },
            {
                xtype : 'dataview',

                flex : 1,

                scrollable : 'vertical',

                bind : {
                    store : '{feed}'
                },

                listeners : {
                    itemclick : (v, record) => {
                        let redirectTo = record.get('redirectTo');

                        if (redirectTo) {
                            criterion.consts.Route.setPrevRoute(Ext.History.getToken());

                            Ext.util.History.add(redirectTo);
                        }
                    }
                },

                componentCls : 'criterion-feed-container',
                itemSelector : 'div.criterion-feed-item-event span.event-title.clickable',
                emptyText : '<div class="empty">Your feed is empty</div>',

                tpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                        '<div class="criterion-feed-item-event">',
                            '<div class="feed-description">',
                                '{description}',
                            '</div>',
                        '</div>',
                    '</tpl>'
                )
            }
        ],

        bbar : {
            xtype : 'button',
            hidden : true,
            bind : {
                hidden : '{hideLoadMore}'
            },
            margin : 20,
            text : i18n.gettext('Load More'),
            handler : 'loadPage'
        },

        loadPage : function() {
            var vm = this.ownerCt.getViewModel();

            vm.getStore('feed').nextPage();
        }

    }

});
