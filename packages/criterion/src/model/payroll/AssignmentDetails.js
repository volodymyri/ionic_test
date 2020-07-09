Ext.define('criterion.model.payroll.AssignmentDetails', function() {

    var DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'assignmentPayRate',
                type : 'float'
            },
            {
                name : 'assignmentPayRateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT,
                allowNull: true
            }
        ]
    };
});
