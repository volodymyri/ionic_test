Ext.define('criterion.view.recruiting.candidate.Viewer', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_viewer',

        extend : 'criterion.ux.Panel',

        viewModel : {
            data : {
                candidateId : null,
                /**
                 * @type criterion.model.Candidate
                 */
                candidate : null
            }
        },

        scrollable : 'vertical',
        closable : true,

        cls : 'criterion-fullscreen-popup',

        initComponent : function() {
            var me = this;

            this.header = {
                cls : 'criterion-fullscreen-header',
                bind : {
                    title : '{candidate.firstName} {candidate.lastName}'
                },
                items : [
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-transparent',
                        margin : '0 20 0 0',
                        glyph : criterion.consts.Glyph['ios7-email-outline'],
                        scale : 'medium',
                        handler : function() {
                            window.open('mailto:' + me.getViewModel().get('candidate').get('email'));
                        }
                    }
                ]
            };

            this.callParent(arguments);
        },

        items: [
            {
                xtype : 'criterion_simple_iframe',
                reference : 'iframe'
            }
        ],

        flush : function() {
            var iframe = this.down('[reference=iframe]');

            iframe.flush.apply(iframe, arguments);
        },

        setSrc : function() {
            var iframe = this.down('[reference=iframe]');

            iframe.setSrc.apply(iframe, arguments);
        }
    }
});
