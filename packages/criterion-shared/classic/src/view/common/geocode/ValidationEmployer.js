Ext.define('criterion.view.common.geocode.ValidationEmployer', function() {

    return {

        extend : 'criterion.view.common.geocode.ValidationBase',

        alias : 'widget.criterion_common_geocode_validation_employer',

        requires : [
            'criterion.store.geocode.EmployerAutoFixes',
            'criterion.store.geocode.EmployerFixes'
        ],

        viewModel : {
            stores : {
                autoFixes : {
                    type : 'criterion_geocode_employer_auto_fixes'
                },
                fixes : {
                    type : 'criterion_geocode_employer_fixes'
                }
            }
        },

        fixesURL : criterion.consts.Api.API.GEOCODE_EMPLOYER_FIX,

        getObjectColumns() {
            return [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Work Location'),
                    dataIndex : 'description',
                    width : 200
                }
            ];
        }

    }
});
