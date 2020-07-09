Ext.define('criterion.model.mobile.employee.timesheet.task.Detail', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.field.CustomFieldValue'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.MOBILE_EMPLOYEE_TIMESHEET_TASK_DETAIL
        },

        fields : [
            {
                name : 'taskId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'paycode',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'entityRef',
                type : 'integer'
            },
            {
                name : 'employerWorkLocationId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'assignmentId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'hours',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'minutes',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'formattedHours',
                persist : false
            },
            {
                name : 'customValue1',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue2',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue3',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue4',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue1Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue2Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue3Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue4Type',
                type : 'string',
                persist : false
            },
            {
                name : 'isStarted',
                type : 'boolean',
                persist : false,
                defaultValue : false
            }
        ]
    };
});
