Ext.define('criterion.model.SalaryGradeGradeStep', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'salaryGroupCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SALARY_GROUP
            },
            {
                name : 'salaryGradeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SALARY_GRADE,
                critical : true
            },
            {
                name : 'salaryStepCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SALARY_STEP
            },
            {
                name : 'sequence',
                type : 'integer'
            },
            {
                name : 'maxRate',
                type : 'float'
            },
            {
                name : 'minRate',
                type : 'float'
            },
            {
                name : 'employerId',
                type : 'integer'
            },
            {
                name : 'frequencyCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT,
                persist : false
            },
            {
                name : 'frequencyValue',
                type : 'criterion_codedatavalue',
                referenceField : 'frequencyCd',
                dataProperty : 'description',
                depends : ['frequencyCd']
            },
            {
                name : 'currencySign',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'ratePrecision',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'currencyAtEnd',
                type : 'boolean',
                persist : false
            },
            {
                name : 'ratesPerPeriod',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    var minRate,
                        maxRate;

                    minRate = Ext.util.Format.currency(
                        data.minRate,
                        data.currencySign,
                        data.ratePrecision,
                        data.currencyAtEnd
                    );

                    maxRate = Ext.util.Format.currency(
                        data.maxRate,
                        data.currencySign,
                        data.ratePrecision,
                        data.currencyAtEnd
                    );

                    return data && Ext.util.Format.format(
                        '{0} - {1} {2}',
                        minRate,
                        maxRate,
                        data.frequencyValue && data.frequencyValue.charAt(0).toLowerCase() + data.frequencyValue.substring(1)
                    );
                }
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.SalaryGradeStep',
                name : 'steps',
                associationKey : 'steps'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.SALARY_GRADE
        }
    };
});
