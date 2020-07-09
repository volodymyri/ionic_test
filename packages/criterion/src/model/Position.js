Ext.define('criterion.model.Position', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        id : 'PositionModel',

        requires : [
            'criterion.model.employer.position.Skill'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION
        },

        fields : [
            {
                name : 'assignmentsCount',
                type : 'int',
                persist : false
            },
            {
                name : 'averageWeeks',
                type : 'number',
                allowNull : true,
                validators : [
                    criterion.Consts.getValidator().NON_EMPTY,
                    criterion.Consts.getValidator().WEEKS_PER_YEAR
                ]
            },
            {
                name : 'averageDays',
                type : 'number',
                allowNull : true,
                validators : [
                    criterion.Consts.getValidator().NON_EMPTY,
                    criterion.Consts.getValidator().DAYS_PER_WEEK
                ]
            },
            {
                name : 'averageHours',
                type : 'number',
                allowNull : true,
                validators : [
                    criterion.Consts.getValidator().NON_EMPTY,
                    criterion.Consts.getValidator().HOURS_PER_DAY
                ]
            },
            {
                name : 'code',
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'dateActive',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'dateInactive',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'costCenterCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COST_CENTER
            },
            {
                name : 'title',
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'employerId',
                type : 'int'
            },
            {
                name : 'jobId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'jobCode',
                type : 'string',
                persist : false
            },
            {
                name : 'jobDescription',
                type : 'string',
                persist : false
            },
            {
                name : 'job',
                calculate : function(data) {
                    return data.jobCode && data.jobDescription && Ext.util.Format.format('{0} / {1}', data.jobCode, data.jobDescription)
                },
                persist : false
            },
            {
                name : 'employeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employerWorkLocationId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'locationDescription',
                type : 'string'
            },
            {
                name : 'employerLegalName',
                type : 'string'
            },
            {
                name : 'positionTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.POSITION_TYPE,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'fullTimeEquivalency',
                type : 'float',
                validators : [criterion.Consts.getValidator().NON_EMPTY],
                defaultValue : 1
            },
            {
                name : 'isHighSalary',
                type : 'boolean'
            },
            {
                name : 'isOfficer',
                type : 'boolean'
            },
            {
                name : 'isManager',
                type : 'boolean'
            },
            {
                name : 'isSalary',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'isSeasonal',
                type : 'boolean'
            },
            {
                name : 'officerCodeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.OFFICER_CODE,
                allowNull : true
            },
            {
                name : 'rateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'payRate',
                type : 'number',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'departmentCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DEPARTMENT,
                allowNull : true,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'divisionCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DIVISION,
                allowNull : true
            },
            {
                name : 'sectionCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SECTION,
                allowNull : true
            },
            {
                name : 'workPeriodId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'securityClearanceCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SECURITY_CLEARANCE,
                allowNull : true
            },
            {
                name : 'travelRequirementsCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TRAVEL_REQUIREMENTS,
                allowNull : true
            },
            {
                name : 'dressCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DRESS,
                allowNull : true
            },
            {
                name : 'workFromHomeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORK_FROM_HOME,
                allowNull : true
            },
            {
                name : 'categoryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.POSITION_CATEGORY,
                allowNull : true
            },
            {
                name : 'workAuthorizationCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORK_AUTHORIZATION,
                allowNull : true
            },
            {
                name : 'workersCompensationCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORKERS_COMPENSATION,
                allowNull : true
            },
            {
                name : 'isExempt',
                type : 'boolean'
            },
            {
                name : 'isActive',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'categoryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.POSITION_CATEGORY,
                allowNull : true
            },
            {
                name : 'description',
                type : 'string',
                allowNull : true
            },
            {
                name : 'eeocCd',
                type : 'criterion_codedata',
                codeDataId : DICT.EEOC,
                allowNull : true
            },
            {
                name : 'salaryGradeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'minSalaryGradeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'maxSalaryGradeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'experienceCd',
                type : 'criterion_codedata',
                codeDataId : DICT.EXPERIENCE,
                allowNull : true
            },
            {
                name : 'educationCd',
                type : 'criterion_codedata',
                codeDataId : DICT.EDUCATION,
                allowNull : true
            },
            {
                name : 'org1PositionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'org2PositionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'org3PositionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'org4PositionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employeeName',
                type : 'string',
                persist : false,

                convert : function(value, model) {
                    var person = model && model.get('primaryAssignedPerson'),
                        count = model && model.get('assignmentsCount'),
                        middleName = person && person.middleName;

                    if (count && count > 1) {
                        return Ext.util.Format.format('{0} Employees', count);
                    }

                    return person && person.firstName + ' ' + (middleName ? middleName + ' ' : '') + person.lastName || ''
                }
            },
            {
                name : 'primaryAssignedEmployeeId',
                type : 'string',
                persist : false,

                convert : function(value, model) {
                    var employee = model && model.get('primaryAssignedEmployee');

                    return employee && employee.id
                }
            },
            // "virtual" fields needed to support custom value change via workflow
            {
                name : 'customValues',
                allowNull : true
            },
            {
                name : 'removedCustomValues',
                allowNull : true
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Person',
                name : 'primaryAssignedPerson',
                associationKey : 'primaryAssignedPerson',
                foreignKey : 'positionId'
            },
            {
                model : 'criterion.model.Employee',
                name : 'primaryAssignedEmployee',
                associationKey : 'primaryAssignedEmployee',
                foreignKey : 'positionId'
            },
            {
                model : 'criterion.model.WorkflowLog',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.position.Skill',
                name : 'skills',
                associationKey : 'skills'
            }
        ],

        /**
         * Prepares custom values for update via workflow.
         *
         * @param {Object} data
         * @param {criterion.store.customField.Values} data.modifiedCustomValues
         * @param {criterion.store.customField.Values} data.removedCustomValues
         */
        setCustomValues : function(data) {
            var modified = [], removed = [];

            if (data.modifiedCustomValues.length) {
                Ext.Array.each(data.modifiedCustomValues, function(r) {
                    modified.push(r.getData({serialize : true}));
                });
                this.set('customValues', modified);
            }

            if (data.removedCustomValues.length) {
                Ext.Array.each(data.removedCustomValues, function(r) {
                    removed.push(r.getData({serialize : true}));
                });
                this.set('removedCustomValues', removed);
            }
        }
    };
});
