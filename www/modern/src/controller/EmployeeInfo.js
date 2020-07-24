Ext.define('ess.controller.EmployeeInfo', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_employee_info',

        listen : {
            global : {
                employeeChanged : 'onEmployeeChange',
                modern_employeeChanged : 'onMainEventEmployeeChange'
            }
        },

        onEmployeeChange : function() {
            this.lookup('mainTopPhoto').setData({
                imageUrl : criterion.Utils.makePersonPhotoUrl(criterion.Api.getCurrentPersonId())
            });
        },

        onMainEventEmployeeChange : function() {
            this.getViewModel().set({
                _employee : criterion.Application.getEmployee(),
                _employer : criterion.Application.getEmployer(),
                _person : criterion.Api.getCurrentPerson()
            });
        },

        onShowAdditionalMenu : function() {
            Ext.GlobalEvents.fireEvent('showAdditionalMenu');
        }
    }
});
