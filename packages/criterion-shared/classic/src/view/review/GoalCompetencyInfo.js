Ext.define('criterion.view.review.GoalCompetencyInfo', function() {

    return {
        alias : 'widget.criterion_review_goal_competency_info',

        extend : 'criterion.ux.Panel',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : criterion.Consts.UI_DEFAULTS.MODAL_NORMAL_HEIGHT,
                alwaysOnTop : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        cls : 'criterion-modal criterion-review-goal-competency-info',

        y : 100,

        scrollable : true,

        viewModel : {
            data : {
                data : null,
                scales : null
            }
        },

        defaultListenerScope : true,

        bind : {
            title : '{data.name}'
        },

        bodyPadding : '0 20',

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Close'),
                handler : 'close'
            }
        ],

        items : [
            {
                xtype : 'component',

                cls : 'description',

                bind : {
                    html : '{data.description}'
                }
            },
            {
                xtype : 'dataview',

                cls : 'scales',

                tpl : new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="scale-item">',
                    '<span class="name">{name}</span>',
                    '<span class="rating"><span class="label">', i18n.gettext('Value'), '</span>: {rating}</span>',
                    '<br/><span class="description">{description}</span>',
                    '</div>',
                    '</tpl>'
                ),

                itemSelector : 'div.scale-item',

                bind : {
                    store : '{scales}'
                }
            }
        ]
    };
});
