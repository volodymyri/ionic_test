Ext.define('criterion.model.PublishSiteSetting', function() {

    var VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'listGrouping',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isListShowCityState',
                type : 'boolean'
            },
            {
                name : 'isListShowPositionType',
                type : 'boolean'
            },
            {
                name : 'isViewShowCityState',
                type : 'boolean'
            },
            {
                name : 'isViewShowPositionType',
                type : 'boolean'
            },
            {
                name : 'isListShowRequisitionCode',
                type : 'boolean'
            },
            {
                name : 'isListShowPostingDate',
                type : 'boolean'
            },
            {
                name : 'isApplyWithIndeed',
                type : 'boolean'
            },
            {
                name : 'isAskQuestions',
                type : 'boolean'
            },
            {
                name : 'isInternal',
                type : 'boolean'
            },
            {
                name : 'isListShowDepartment',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'isViewShowDepartment',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'publishSiteId',
                type : 'integer',
                persist : false
            },
            {
                name : 'bgColor',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY],
                convert : function(value) {
                    return !value ? '000000' : value;
                }
            },
            {
                name : 'textColor',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY],
                convert : function(value) {
                    return !value ? '000000' : value;
                }
            },
            {
                name : 'width',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});

