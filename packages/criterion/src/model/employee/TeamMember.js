Ext.define('criterion.model.employee.TeamMember', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'groupName',
                type : 'string'
            },
            {
                name : 'timesheetTypeId',
                type : 'integer'
            },
            {
                name : 'positionTitle',
                type : 'string'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.TimesheetType',
                name : 'timesheetType',
                associationKey : 'timesheetType',
                foreignKey : 'timesheetTypeId'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TEAM_MEMBERS
        }
    };

});
