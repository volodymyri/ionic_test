Ext.define('criterion.model.timesheetLayout.Detail', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.field.Duration'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.TIMESHEET_TYPE_BREAK
        },

        fields : [
            {
                name : 'timesheetTypeId',
                type : 'int'
            },
            {
                name : 'isPaid',
                type : 'boolean'
            },
            {
                name : 'incomeListId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'minElapseHours',
                type : 'duration',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'breakHours',
                type : 'duration',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'minReturnHours',
                type : 'duration',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
