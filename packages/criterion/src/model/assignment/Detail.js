Ext.define('criterion.model.assignment.Detail', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.proxy.Rest',
            'criterion.model.workflow.transaction.Log',
            'criterion.store.customField.Values'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.ASSIGNMENT_DETAIL
        },

        metaName : 'assignment_detail',

        fields : [
            {
                name : 'assignmentId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'assignmentActionCd',
                type : 'criterion_codedata',
                codeDataId : DICT.ASSIGNMENT_ACTION,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'costCenterCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COST_CENTER,
                allowNull : true
            },
            {
                name : 'isSalary',
                type : 'boolean'
            },
            {
                name : 'salaryGradeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'salaryGradeName', // persisting for workflow?
                type : 'string'
            },
            {
                name : 'payRate',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'rateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'positionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'positionTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.POSITION_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'averageHours',
                type : 'float',
                defaultValue : null,
                validators : [
                    VALIDATOR.NON_EMPTY,
                    VALIDATOR.HOURS_PER_DAY
                ]
            },
            {
                name : 'averageDays',
                type : 'float',
                defaultValue : null,
                validators : [
                    VALIDATOR.NON_EMPTY,
                    VALIDATOR.DAYS_PER_WEEK
                ]
            },
            {
                name : 'averageWeeks',
                type : 'number',
                defaultValue : null,
                validators : [
                    VALIDATOR.NON_EMPTY,
                    VALIDATOR.WEEKS_PER_YEAR
                ]
            },
            {
                name : 'workPeriodId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'workPeriod', // for UI approving page
                type : 'string'
            },
            {
                name : 'workPeriodName',
                type : 'string',
                persist : false
            },
            {
                name : 'fullTimeEquivalency',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY],
                defaultValue : 1

            },
            {
                name : 'code',
                type : 'string',
                persist : false
            },
            {
                name : 'title',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'eeocCd',
                type : 'criterion_codedata',
                codeDataId : DICT.EEOC,
                allowNull : true
            },
            {
                name : 'isExempt',
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
                name : 'officerCodeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.OFFICER_CODE,
                allowNull : true
            },
            {
                name : 'isHighSalary',
                type : 'boolean'
            },
            {
                name : 'isSeasonal',
                type : 'boolean'
            },
            {
                name : 'departmentCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DEPARTMENT,
                validators : [VALIDATOR.NON_EMPTY],
                allowNull : false
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
                name : 'categoryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.POSITION_CATEGORY,
                allowNull : true
            },
            {
                name : 'workersCompensationCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORKERS_COMPENSATION,
                allowNull : true
            },
            {
                name : 'certifiedRateId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'sequence',
                type : 'int'
            },
            {
                name : 'cloned',
                type : 'boolean',
                persist : false
            },
            {
                name : 'workflowLogId',
                type : 'integer',
                allowNull : true,
                persist : false
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
