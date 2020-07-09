/**
 * @deprecated
 */
Ext.define('criterion.model.employee.PayCode', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_PAYCODES
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'paycode',
                type : 'integer'
            },
            {
                name : 'paycodeRef',
                type : 'integer'
            },
            {
                name : 'hidden',
                type : 'string',
                defaultValue : '',
                persist : false
            },
            {
                name : 'enabled',
                type : 'boolean',
                defaultValue : true,
                persist : false
            }
        ]
    };
});
