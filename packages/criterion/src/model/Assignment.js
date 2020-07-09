Ext.define('criterion.model.Assignment', function() {

    var Api = criterion.consts.Api,
        API = Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.assignment.Detail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.ASSIGNMENT
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer',
                allowNull : true,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'terminationCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TERMINATION
            },
            {
                name : 'personName', // deprecated ?
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY], // for UI validation
                persist : false
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : Api.DATE_FORMAT,
                persist : true // workflow
            },
            {
                name : 'positionCode',
                type : 'string',
                persist : false
            },
            {
                name : 'positionTitle',
                type : 'string',
                persist : true // workflow
            },
            {
                name : 'assignmentDetailTitle',
                type : 'string',
                persist : true // workflow
            },
            {
                name : 'wf1EmployeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'wf2EmployeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'wf1EmployeeName',
                type : 'string'
            },
            {
                name : 'wf2EmployeeName',
                type : 'string'
            },
            {
                name : 'terminate', // passed as model field when terminating with workflow
                type : 'boolean',
                allowNull : true
            },
            {
                name : 'isTerminated',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isPrimary',
                type : 'boolean',
                persist : false
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'statusCode',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                dataProperty : 'code'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Position',
                name : 'position',
                associationKey : 'position'
            },
            {
                model : 'criterion.model.workflow.transaction.Log',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.assignment.Detail',
                name : 'assignmentDetails',
                associationKey : 'assignmentDetails'
            }
        ],

        getActiveOrLastDetail : function() {
            var assignmentDetails = this.assignmentDetails(),
                activeDetail;

            if (assignmentDetails && assignmentDetails.count()) {
                // findRecord doesn't work here by some reason
                activeDetail = assignmentDetails.getAt(assignmentDetails.findBy(r => r.get('expirationDate') == null));

                if (activeDetail) {
                    return activeDetail;
                } else {
                    var sorted = Ext.Array.sort(assignmentDetails.getRange(), function(a, b) {
                        // sort desc by expiration date
                        return (a.get('expirationDate').getTime() > b.get('expirationDate').getTime()) ? -1 : 1;
                    });

                    return sorted[0];
                }
            } else {
                return null;
            }
        }
    };

});
