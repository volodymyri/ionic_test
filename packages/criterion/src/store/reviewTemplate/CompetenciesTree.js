Ext.define('criterion.store.reviewTemplate.CompetenciesTree', function() {

    return {

        alias : 'store.criterion_review_template_competencies_tree',

        extend : 'Ext.data.TreeStore',

        requires : [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.reviewTemplate.CompetenciesTree',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'memory',
            appendId : false,
            reader : 'treeData'
        }
    };
});
