Ext.define('criterion.view.ess.dashboard.TaskComments', function() {

    return {

        alias : 'widget.criterion_selfservice_dashboard_task_comments',

        extend : 'Ext.view.View',

        itemSelector : 'div.comment-wrap',
        emptyText : '',

        baseCls : 'criterion-selfservice-dashboard-task-comments',

        initComponent : function() {
            this.tpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="comment-wrap">',
                '<div class="comment-text">{comment}</div>',
                '<div class="commentator-wrap">',
                '<div class="circular" style="background: url({[criterion.Utils.makePersonPhotoUrl(values.personId, 32, 32)]}) no-repeat">',
                '<img src="{[criterion.Utils.makePersonPhotoUrl(values.personId, 32, 32)]}" width="32" height="32" alt="" />',
                '</div>',
                '<div class="commentator">',
                '<p class="name">{commentator}</p>',
                '<p class="date">Publish on {date:date(criterion.consts.Api.SHOW_DATE_FORMAT)}</p>',
                '</div>',
                '</div>',
                '</div>',
                '</tpl>'
            );

            this.callParent(arguments);
        }
    };

});
