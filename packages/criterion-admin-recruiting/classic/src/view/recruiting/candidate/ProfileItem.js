Ext.define('criterion.view.recruiting.candidate.ProfileItem', function() {
    return {
        alias : 'widget.criterion_recruiting_candidate_profile_item',

        extend : 'Ext.view.View',

        listeners : {
            itemclick : function(view, record, item, index, event) {
                var operation = Ext.Array.findBy(['edit', 'delete'], function(op) {
                    return Ext.Array.contains(event.target.classList, op);
                });

                if (operation) {
                    var parentPanel = view.up('panel');

                    parentPanel.fireEvent(operation + 'Candidate', parentPanel, record);
                }
            }
        },

        componentCls : 'criterion-item-container',

        itemSelector : 'div.item',

        trackOver : true,

        overItemCls : 'item-over'
    };
});
