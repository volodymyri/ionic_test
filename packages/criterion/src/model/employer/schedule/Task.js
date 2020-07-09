Ext.define('criterion.model.employer.schedule.Task', function() {

    const DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'scheduleId',
                type : 'integer'
            },
            {
                name : 'type',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reportId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'reportName',
                type : 'string',
                persist : false
            },
            {
                name : 'transferId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'transferName',
                type : 'string',
                persist : false
            },
            {
                name : 'appId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'appName',
                type : 'string',
                persist : false
            },
            {
                name : 'systemTaskCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SYSTEM_LEVEL_TASK,
                allowNull : true
            },
            {
                name : 'systemTaskCode',
                type : 'criterion_codedatavalue',
                referenceField : 'systemTaskCd',
                dataProperty : 'code',
                persist : false
            },
            {
                name : 'systemTaskName',
                type : 'criterion_codedatavalue',
                referenceField : 'systemTaskCd',
                dataProperty : 'description',
                persist : false
            },
            {
                name : 'options',
                type : 'string'
            },
            {
                name : 'recipientType',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employeeGroupList',
                type : 'string',
                allowNull : true
            },
            {
                name : 'employeeGroupListNames',
                type : 'string',
                allowNull : true
            },
            {
                name : 'employeeList',
                type : 'string',
                allowNull : true
            },
            {
                name : 'employeeListNames',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'employeeListData',
                persist : false
            },
            {
                name : 'emailList',
                type : 'string',
                allowNull : true,
                validators : [VALIDATOR.EMAIL_LIST]
            },
            {
                name : 'externalSystemId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'orgList',
                type : 'string',
                allowNull : true
            },
            {
                name : '_orgListCd', // internal field for CD load
                type : 'criterion_codedata',
                codeDataId : DICT.ORG_STRUCTURE,
                allowNull : true,
                persist : false
            }
        ]
    };
});
