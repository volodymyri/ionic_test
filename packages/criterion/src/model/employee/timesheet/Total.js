Ext.define('criterion.model.employee.timesheet.Total', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    function converter(value) {
        return criterion.Utils.timeObjToStr(criterion.Utils.hourStrParse(value+'', true))
    }

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'loggedHours',
                type : 'float',
                persist : false,
                convert : converter
            },
            {
                name : 'regularHours',
                type : 'float',
                persist : false,
                convert : converter
            },
            {
                name : 'overtimeHours',
                type : 'float',
                persist : false,
                convert : converter
            }
        ]

    };
});
