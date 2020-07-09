Ext.define('criterion.model.employee.timeOff.AvailableType', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.codeTable.Detail',

        fields : [
            {
                name : 'isAllDayOnly',
                type : 'boolean'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_AVAILABLE_TYPES
        }
    };

});
