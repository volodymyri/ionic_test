Ext.define('criterion.view.ess.CommentsPopup', function() {

    return {
        extend : 'criterion.ux.Panel',

        alias : 'widget.criterion_ess_comments_popup',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 500,
                width : 600
            }
        ],

        scrollable : true,

        bodyPadding : '0 20',

        title : i18n.gettext('Comments'),

        viewModel : {
            steros : {
                comments : null
            }
        },

        items : [
            {
                xtype : 'dataview',

                bind : {
                    store : '{comments}'
                },

                componentCls : 'criterion-item-container',

                itemSelector : 'div.item_',

                emptyText : '',

                tpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<div class="item">',
                    '<hr/>',
                    '<div class="commentator-photo" style="background-image: url({commentatorPhotoUrl});"></div>',
                    '<div class="comment-date">{date:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}</div>',
                    '<div class="commentator-name">{commentator}</div>',
                    '<div class="comment">{comment}</div>',
                    '</div>',
                    '</tpl>'
                )
            }
        ]
    }
});