Ext.define('criterion.controller.settings.hr.onboarding.AssignDetail', function() {

    return {

        alias : 'controller.criterion_settings_onboarding_assign_detail',

        extend : 'criterion.controller.common.AssignBase',

        handleAssign() {
            let vm = this.getViewModel(),
                form = this.lookup('form'),
                view = this.getView(),
                employeeGroupIds = vm.get('employeeGroupIds'),
                employeeIds = vm.get('employeeIds'),
                params = {
                    onboardingDetailId : vm.get('onboardingDetailId')
                };

            if (form.isValid()) {
                if (employeeGroupIds && employeeGroupIds.length) {
                    params['employeeGroupIds'] = employeeGroupIds;
                }

                if (employeeIds && employeeIds.length) {
                    params['employeeIds'] = employeeIds;
                }

                view.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYER_ONBOARDING_DETAIL_ASSIGN,
                    method : 'POST',
                    jsonData : params
                }).then(() => {
                    criterion.Utils.toast(i18n.gettext('The onboarding detail is successfully assigned'));
                    view.setLoading(false);
                    view.destroy();
                }, () => {
                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                    view.setLoading(false);
                });
            }
        }

    }
});
