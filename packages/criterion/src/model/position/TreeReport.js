/**
 * @deprecated
 */
Ext.define('criterion.model.position.TreeReport', function() {

    return {
        extend : 'criterion.model.Abstract',

        idProperty : {
            name : 'id',
            type : 'auto',

            depends : ['positionId', 'assignmentId'],

            calculate : function(data) {
                var positionId = data['positionId'],
                    assignmentId = data['assignmentId'];

                return Ext.util.Format.format('{0}-{1}', positionId || 0, assignmentId || 0);
            }
        },

        fields : [
            {
                name : 'positionId',
                type : 'int'
            },
            {
                name : 'assignmentId',
                type : 'int'
            },
            {
                name : 'jobCode',
                type : 'string'
            },
            {
                name : 'desc',
                type : 'string'
            },
            {
                name : 'personName',
                type : 'string'
            },
            {
                name : 'total',
                type : 'int'
            },
            {
                name : 'combined',
                type : 'string',

                convert : function(newValue, model) {
                    var personName = model.get('personName') || 'unassigned',
                        jobCode = model.get('jobCode') ? Ext.util.Format.format(' ({0})', model.get('jobCode')) : '';

                    return personName + jobCode;
                }
            }
        ]
    };
});
