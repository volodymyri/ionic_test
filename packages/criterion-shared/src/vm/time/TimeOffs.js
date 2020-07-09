Ext.define('criterion.vm.time.TimeOffs', {

    extend : 'Ext.app.ViewModel',

    alias : 'viewmodel.criterion_time_timeoffs',

    requires : [
        'criterion.store.employee.TimeOffs',
        'criterion.store.employee.timeOff.AvailableTypes',
        'criterion.store.employee.timeOff.TimeBalances'
    ],

    data : {
        blockAdd : true,
        modificationMode : false
    },

    stores : {
        timeOffs : {
            type : 'criterion_employee_time_offs',
            autoSync : false,
            sorters : [{
                property : 'startDate',
                direction : 'DESC'
            }]
        },
        employeeTimeOffType : {
            type : 'criterion_employee_time_off_available_types'
        },
        timeBalances : {
            type : 'criterion_employee_time_off_time_balances'
        }
    }

});
