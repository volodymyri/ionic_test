Ext.define('criterion.view.ess.learning.InstructorPortalWrap', function() {

    return {
        alias : 'widget.criterion_selfservice_learning_instructor_portal_wrap',

        extend : 'criterion.ux.Panel',

        requires : [
            'Ext.ux.IFrame'
        ],

        layout : 'fit',
        frame : true,
        ui : 'no-footer',

        items : [
            {
                xtype : 'uxiframe',
                src : criterion.consts.Api.API.LERNING_INSTRUCTOR_PORTAL
            }
        ]
    };

});
