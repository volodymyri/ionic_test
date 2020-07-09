Ext.define('criterion.view.common.geocode.ValidationEmployee', function() {

    return {

        extend : 'criterion.view.common.geocode.ValidationBase',

        alias : 'widget.criterion_common_geocode_validation_employee',

        requires : [
            'criterion.store.geocode.EmployeeAutoFixes',
            'criterion.store.geocode.EmployeeFixes'
        ],

        viewModel : {
            stores : {
                autoFixes : {
                    type : 'criterion_geocode_employee_auto_fixes'
                },
                fixes : {
                    type : 'criterion_geocode_employee_fixes'
                }
            }
        },

        fixesURL : criterion.consts.Api.API.GEOCODE_EMPLOYEE_FIX,

        getObjectColumns() {
            return [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('First Name'),
                    dataIndex : 'firstName',
                    width : 200
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Last Name'),
                    dataIndex : 'lastName',
                    width : 200
                }
            ];
        }

    }
});
