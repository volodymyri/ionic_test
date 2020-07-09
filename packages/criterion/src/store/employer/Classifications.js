Ext.define('criterion.store.employer.Classifications', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employer_classifications',

        model : 'criterion.model.employer.Classification',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_CLASSIFICATION
        },

        getClassificationCodeDataNames : function() {
            var res = [];

            this.each(function(record) {
                res.push(criterion.CodeDataManager.getCodeTableNameById(record.get('codeDataTypeId')))
            });

            return res;
        }
    };
});
