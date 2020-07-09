Ext.define('criterion.view.settings.hr.onboarding.AssignList', function() {

    return {

        alias : 'widget.criterion_settings_onboarding_assign_list',

        extend : 'criterion.view.common.AssignBase',

        requires : [
            'criterion.model.employee.Search',
            'criterion.controller.settings.hr.onboarding.AssignList'
        ],

        controller : {
            type : 'criterion_settings_onboarding_assign_list'
        },

        viewModel : {
            formulas : {
                title : data => data('selectEmployeesMode') ? i18n.gettext('Onboarding List Assignment > Select Employees') : i18n.gettext('Onboarding List Assignment')
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
