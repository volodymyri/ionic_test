Ext.define('criterion.model.Employee', function() {

    var Api = criterion.consts.Api,
        API = Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        metaName : 'employee',

        requires : [
            'criterion.data.proxy.Rest',
            'criterion.model.CustomData',
            'criterion.model.employee.WorkLocation',
            'criterion.model.Assignment',
            'criterion.model.Person',
            'criterion.model.WorkflowLog'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE
        },

        fields : [
            {
                name : 'employerId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'personId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'badgeNumber',
                type : 'string'
            },
            {
                name : 'hireDate',
                type : 'date',
                dateFormat : Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'hireDateOriginal',
                type : 'date',
                dateFormat : Api.DATE_FORMAT
            },
            {
                name : 'hireDateAdjusted',
                type : 'date',
                dateFormat : Api.DATE_FORMAT
            },
            {
                name : 'payrollNumber',
                type : 'string'
            },
            {
                name : 'employeeNumber',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'unionNumber',
                type : 'string'
            },
            {
                name : 'eligibleForRehire',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'terminationDate',
                type : 'date',
                dateFormat : Api.DATE_FORMAT
            },
            {
                name : 'terminationCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TERMINATION
            },
            {
                name : 'positionTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.POSITION_TYPE,
                persist : false
            },
            {
                name : 'timesheetTypeId',
                persist : 'false',
                type : 'int'
            },
            {
                name : 'emailOnPosting',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'emailOnReference',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'org1EmployeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'org2EmployeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'org3EmployeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'org4EmployeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'org1PersonName',
                type : 'string',
                persist : false
            },
            {
                name : 'org2PersonName',
                type : 'string',
                persist : false
            },
            {
                name : 'org3PersonName',
                type : 'string',
                persist : false
            },
            {
                name : 'org4PersonName',
                type : 'string',
                persist : false
            },
            {
                name : 'supervisors',
                type : 'auto',
                persist : false
            },
            {
                name : 'employerWorkLocationId',
                type : 'integer',
                persist : false
            },
            {
                name : 'isHiringManager',
                type : 'boolean'
            },
            {
                name : 'isSupervisor',
                type : 'boolean'
            },
            {
                name : 'isActive',
                type : 'boolean',
                persist : false,
                calculate : function(data) {
                    return (data.terminationDate == null && data.terminationCd == null) ||
                        (data.terminationDate && data.terminationDate > new Date());
                }
            },
            {
                name : 'relationshipWorkflowLogId',
                type : 'int',
                persist : false,
                allowNull : true
            },
            {
                name : 'terminationWorkflowLogId',
                type : 'int',
                persist : false,
                allowNull : true
            },
            {
                name : 'payrollNotes',
                type : 'string'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employee.WorkLocation',
                name : 'employeeWorkLocation',
                associationKey : 'employeeWorkLocation'
            },
            {
                model : 'criterion.model.Assignment',
                name : 'assignment',
                associationKey : 'assignment'
            },
            {
                model : 'criterion.model.WorkflowLog',
                name : 'relationshipWorkflowLog',
                associationKey : 'relationshipWorkflowLog'
            },
            {
                model : 'criterion.model.WorkflowLog',
                name : 'terminationWorkflowLog',
                associationKey : 'terminationWorkflowLog'
            },
            {
                model : 'criterion.model.Person',
                name : 'person',
                associationKey : 'person'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.WorkLocation',
                name : 'employeeWorkLocations',
                associationKey : 'employeeWorkLocations'
            }
        ]
    };

});
