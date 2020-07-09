Ext.define('criterion.model.workflow.Detail', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW_DETAIL
        },

        fields : [
            {
                name : 'workflowId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'performer',
                type : 'string'
            },
            {
                name : 'actorCd',
                type : 'criterion_codedata',
                codeDataId: criterion.consts.Dict.WORKFLOW_ACTOR,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'actorCode',
                type : 'criterion_codedatavalue',
                depends : 'actorCd',
                referenceField : 'actorCd',
                dataProperty : 'code'
            },
            {
                name : 'stateCd',
                type : 'criterion_codedata',
                codeDataId: criterion.consts.Dict.WORKFLOW_STATE,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'stateCode',
                type : 'criterion_codedatavalue',
                depends : 'stateCd',
                referenceField : 'stateCd',
                dataProperty : 'code'
            },
            {
                name : 'sequence',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'orgType',
                type : 'int',
                allowNull: true
            },
            {
                name : 'orgLevel',
                type : 'int',
                allowNull: true
            },
            {
                name : 'positionId',
                type : 'int',
                allowNull: true
            },
            {
                name : 'performer',
                type : 'string',
                persist: false
            }
        ]
    };
});
