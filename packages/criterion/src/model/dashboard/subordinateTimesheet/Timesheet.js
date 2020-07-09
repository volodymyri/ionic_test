Ext.define('criterion.model.dashboard.subordinateTimesheet.Timesheet', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.field.CodeDataValue'
        ],

        idProperty : 'timesheetId',

        fields : [
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'status',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                dataProperty : 'description',
                persist : false
            },
            {
                name : 'timesheetId',
                type : 'int'
            },
            {
                name : 'totalHours',
                type : 'float'
            },
            {
                name : 'totalDays',
                type : 'float'
            }
        ]
    };

});
