Ext.define('criterion.controller.moduleToolbar.Employment', function() {

    function isCurrentEmployment(record) {
        return record.get('employeeId') === criterion.Api.getEmployeeId();
    }

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_moduletoolbar_employment',

        listen : {
            global : {
                baseStoresLoaded : 'onBaseStoresLoaded',
                employeeChanged : 'onEmployeeChange'
            }
        },

        getMenuItem : function(record) {
            var data = {
                checked : isCurrentEmployment(record),
                text : record.get('positionTitle') + ' &ndash; ' + record.get('employerTitle')
            };

            return {
                employment : record,
                listeners : {
                    scope : 'controller',
                    click : 'handleItemClick'
                },
                text : criterion.Utils.getTpl('BULLED_MENU_ITEM').apply(data),
                cls : 'criterion-moduletoolbar-employer-menu-item'
            };
        },

        getMenuItems : function() {
            return Ext.Array.map(this.getStore('employments').getRange(), this.getMenuItem);
        },

        onBaseStoresLoaded : function(employers, employees) {
            var employments = this.getStore('employments');

            employees.each(function(employee) {
                var assignment = employee.getAssignment();

                employments.add({
                    employeeId : employee.getId(),
                    employerId : employee.get('employerId'),
                    positionTitle : assignment ? assignment.get('positionTitle') : 'Unemployed',
                    employerTitle : employers.getById(employee.get('employerId')).get('legalName')
                })
            });
        },

        onEmployeeChange : function() {
            this.updateSwitcher();
        },

        updateSwitcher : function() {
            var employments = this.getStore('employments');

            this.getViewModel().set({
                selected : employments.findRecord('employeeId', criterion.Api.getEmployeeId(), 0, false, false, true),
                menuItems : this.getMenuItems()
            })
        },

        handleItemClick : function(item) {
            var employment = item.employment;

            if (!isCurrentEmployment(employment)) {
                criterion.Application.setEmployer(employment.get('employerId'));
                criterion.Application.setEmployee(employment.get('employeeId'));
            }
        }

    };

});
