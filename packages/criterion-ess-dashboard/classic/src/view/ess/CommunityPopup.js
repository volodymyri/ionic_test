Ext.define('criterion.view.ess.CommunityPopup', function() {

    return {
        extend : 'criterion.ux.Panel',

        alias : 'widget.criterion_ess_community_popup',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROWER_WIDTH
            }
        ],

        viewModel : {
            data : {
                community : null
            }
        },

        closable : false,

        y : 100,

        bodyPadding : '0 20 10',

        bind : {
            title : '{community.name}',
            icon : '{community.imageUrl}'
        },

        items : [
            {
                xtype : 'component',
                bind : {
                    html : '<div class="criterion-text-gray">' + i18n.gettext('Created ') + '{community.creationDate:date("m/d/Y")}</div>' +
                    '<div>{community.description}</div>'
                }
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('OK'),
                handler : function() {
                    this.up('criterion_ess_community_popup').close()
                }
            }
        ]
    }
});