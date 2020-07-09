Ext.define('criterion.view.ess.recruiting.JobPortalWrap', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_job_portal_wrap',

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
                src : Ext.String.format(criterion.consts.Api.API.CAREERS_JOB_PORTAL, criterion.Api.getEmployerId(), criterion.Api.getToken())
            }
        ]
    };

});
