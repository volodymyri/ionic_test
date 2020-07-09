Ext.define('criterion.view.settings.hr.onboarding.AssignDetail', function() {

    return {

        alias : 'widget.criterion_settings_onboarding_assign_detail',

        extend : 'criterion.view.common.AssignBase',

        requires : [
            'criterion.model.employee.Search',
            'criterion.controller.settings.hr.onboarding.AssignDetail'
        ],

        controller : {
            type : 'criterion_settings_onboarding_assign_detail'
        },

        viewModel : {
            formulas : {
                title : data => data('selectEmployeesMode') ? i18n.gettext('Onboarding Detail Assignment > Select Employees') : i18n.gettext('Onboarding Detail Assignment')
            },
            stores : {
                employees : {
                    type : 'criterion_abstract_store',
                    model : 'criterion.model.employee.Search',
                    autoLoad : false,
                    autoSync : false,

                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteSort : true,
                    remoteFilter : true,

                    proxy : {
                        type : 'criterion_rest',
                        url : criterion.consts.Api.API.EMPLOYEE_SEARCH
                    }
                }
            }
        }
    };
});
