Ext.define('criterion.model.employee.TeamTimeOff', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.employee.teamTimeOff.Plan',
            'criterion.model.employee.teamTimeOff.DetailInner'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TEAM_TIME_OFF
        },

        fields : [
            {
                name : 'employeeFirstName',
                type : 'string'
            },
            {
                name : 'employeeLastName',
                type : 'string'
            },
            {
                name : 'employeeMiddleName',
                type : 'string'
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'employeeNickName',
                type : 'string'
            },
            {
                name : 'employeeTitle',
                type : 'string'
            },
            {
                name : 'timezoneCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TIME_ZONE
            },
            {
                name : 'timezoneDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'timezoneCd',
                dataProperty : 'description',
                depends : 'timezoneCd'
            },
            {
                name : 'employeeName',
                type : 'string',
                persist : false,
                calculate : data => Ext.String.format(
                    '{0} {1}',
                    data.employeeLastName, data.employeeFirstName
                )
            },
            {
                name : 'fullName',
                type : 'string',
                persist : false,
                calculate : data => Ext.String.format(
                    '{0} {1} {2} {3} {4} {5}',
                    data.employeeLastName, data.employeeFirstName, data.employeeMiddleName, data.employeeNumber, data.employeeNickName, data.employeeTitle
                )
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.teamTimeOff.Plan',
                name : 'plans',
                associationKey : 'plans'
            },
            {
                model : 'criterion.model.employee.teamTimeOff.DetailInner',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
