Ext.define('criterion.controller.settings.hr.onboarding.Form', function() {

    return {

        alias : 'controller.criterion_settings_onboarding_form',

        extend : 'criterion.controller.common.OnboardingForm',

        requires : [
            'criterion.view.settings.hr.onboarding.AssignDetail'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAssign() {
            let me = this,
                vm = this.getViewModel(),
                assignWnd = Ext.create('criterion.view.settings.hr.onboarding.AssignDetail', {
                    viewModel : {
                        data : {
                            onboardingDetailId : vm.get('record.id'),
                            employerId : vm.get('record').getAssociatedData()['employer.Onboarding']['employerId']
                        }
                    }
                });

            assignWnd.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            assignWnd.show();

            me.setCorrectMaskZIndex(true);
        }
    }
});
