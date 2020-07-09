Ext.define('criterion.controller.ess.ModuleToolbar', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_module_toolbar',

        listen : {
            global : {
                employeeChanged : 'handleEmployeeChanged'
            }
        },

        handleEmployeeChanged : function(employee) {
            var employer = criterion.Application.getEmployer(),
                employerId = employer.getId(),
                showLogo = employer.get('isEssLogo'),
                hasLogo = employer.get('hasLogo'),
                organizationName = employer.get('organizationName'),
                logo = criterion.Api.getEmployerLogo(employerId),
                logoSrc = criterion.Api.getSecureResourceUrl(logo),
                vm = this.getViewModel();

            vm.setData({
                showLogo : showLogo,
                hasLogo : hasLogo,
                logoSrc : logoSrc,
                organizationName : organizationName,
                hasDelegation : !!criterion.Api.getAuthResult().hasDelegation
            });
        }
    }
});
