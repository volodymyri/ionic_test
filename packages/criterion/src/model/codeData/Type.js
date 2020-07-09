Ext.define('criterion.model.codeData.Type', function() {

    return {
        alternateClassName : [
            'criterion.model.codeData.Type'
        ],

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name: 'code',
                type: 'string'
            },
            {
                name: 'employerId',
                type: 'int'
            },
            {
                name: 'parentId',
                type: 'int',
                allowNull: true
            },
            {
                name : 'codeTableId',
                type : 'int',
                allowNull: true
            },
            {
                name : 'description',
                type : 'string'
            }
        ]
    };
});
