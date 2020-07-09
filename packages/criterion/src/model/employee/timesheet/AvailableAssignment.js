Ext.define('criterion.model.employee.timesheet.AvailableAssignment', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'assignmentId',
                type : 'integer'
            },
            {
                name : 'assignmentDetailId',
                type : 'integer'
            },
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'isPrimary',
                type : 'boolean'
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ],

        isAvailableByDate : function(date) {
            var effectiveDate = this.get('effectiveDate'),
                expirationDate = this.get('expirationDate');

            return effectiveDate <= date && (!expirationDate || expirationDate >= date);
        }
    };
});