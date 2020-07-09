Ext.define('criterion.model.TimesheetType', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.timesheetLayout.Detail'
        ],

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'nameWithEmployer',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    var employers = Ext.StoreManager.lookup('Employers');

                    return data.name + (
                        data.employerId && employers && employers.isLoaded() && employers.count() > 1 ?
                            Ext.util.Format.format(' [{0}]', employers.getById(data.employerId).get('legalName'))
                            :
                            ''
                    );
                }
            },
            {
                name : 'frequencyCd',
                type : 'criterion_codedata',
                codeDataId : DICT.PAY_FREQUENCY,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'frequencyCode',
                type : 'criterion_codedatavalue',
                referenceField : 'frequencyCd',
                dataProperty : 'code'
            },
            {
                name : 'startTimeOfDay',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'startDayOfWeek',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY],
                defaultValue : 1
            },
            {
                name : 'startDayOfMonth',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isOddWeek',
                type : 'boolean'
            },
            {
                name : 'isVertical',
                type : 'boolean'
            },
            {
                name : 'timesheetFormatCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TIMESHEET_FORMAT
            },
            {
                name : 'timesheetFormatCode',
                type : 'criterion_codedatavalue',
                referenceField : 'timesheetFormatCd',
                dataProperty : 'code'
            },
            {
                name : 'alertDay',
                type : 'float',
                allowNull : true
            },
            {
                name : 'alertWeek',
                type : 'float',
                allowNull : true
            },
            {
                name : 'isFTE',
                type : 'boolean'
            },
            {
                name : 'isAutopopulateHours',
                type : 'boolean'
            },
            {
                name : 'isTimeoffAutoapprove',
                type : 'boolean'
            },
            {
                name : 'isEnterTimeoff',
                type : 'boolean'
            },
            {
                name : 'isEnterHoliday',
                type : 'boolean'
            },
            {
                name : 'customField1Id',
                type : 'int',
                allowNull : true
            },
            {
                name : 'customField2Id',
                type : 'int',
                allowNull : true
            },
            {
                name : 'customField3Id',
                type : 'int',
                allowNull : true
            },
            {
                name : 'customField4Id',
                type : 'int',
                allowNull : true
            },
            {
                name : 'rounding',
                type : 'duration',
                convert : function(v) {
                    if (!v) {
                        return
                    }

                    if (Ext.isNumeric(v)) {
                        return v
                    }

                    return criterion.Utils.durationToMinutes(v)
                }
            },
            {
                name : 'incomeListId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'incomeCode',
                type : 'string',
                persist : false,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'entryType',
                type : 'integer'
            },
            {
                name : 'isShowTasks',
                type : 'boolean'
            },
            {
                name : 'isShowTime',
                type : 'boolean'
            },
            {
                name : 'employeeGroups',
                persist : false
            },
            {
                name : 'labelAssignment',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'labelWorkLocation',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'labelWorkArea',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'labelTask',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'labelProject',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'isShowAssignment',
                type : 'boolean'
            },
            {
                name : 'isShowWorkLocation',
                type : 'boolean'
            },
            {
                name : 'isShowWorkArea',
                type : 'boolean'
            },
            {
                name : 'isShowProject',
                type : 'boolean'
            },
            {
                name : 'startDayCustomId',
                type : 'integer'
            },

            {
                name : 'isAggregate',
                type : 'boolean'
            },
            {
                name : 'isVertical',
                type : 'boolean'
            },
            {
                name : 'isHorizontal',
                type : 'boolean'
            },
            {
                name : 'isManualDay',
                type : 'boolean'
            },
            {
                name : 'attestationMessage',
                type : 'string',
                allowNull : true
            }
        ],

        hasMany : [
            {
                model : 'timesheetLayout.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.TIMESHEET_TYPE
        }
    };
});
