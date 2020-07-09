Ext.define('criterion.controller.settings.hr.ACA', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        requires : [
            'criterion.view.settings.hr.AcaDetail'
        ],

        alias : 'controller.criterion_settings_aca',

        editor : {
            xtype : 'criterion_settings_aca_detail',
            allowDelete : true
        },

        loadRecordOnEdit: true,

        onGenerate : function() {
            criterion.Api.requestWithPromise({
                method : 'POST',
                url : criterion.consts.Api.API.EMPLOYER_ACA_GENERATE + '?employerId=' + this.getEmployerId()
            }).then({
                scope : this,
                success : this.load
            })
        }

    };
});
