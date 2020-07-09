Ext.define('criterion.controller.settings.hr.Onboarding', function() {

    return {
        alias : 'controller.criterion_settings_onboarding',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.settings.hr.onboarding.AssignList'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAssign() {
            let me = this,
                vm = this.getViewModel(),
                assignWnd = Ext.create('criterion.view.settings.hr.onboarding.AssignList', {
                    viewModel : {
                        data : {
                            onboardingId : vm.get('record.id'),
                            employerId : vm.get('record.employerId')
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
