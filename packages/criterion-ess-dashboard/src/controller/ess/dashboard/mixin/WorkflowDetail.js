Ext.define('criterion.controller.mixin.WorkflowDetail', function() {

    const DICT = criterion.consts.Dict,
        WORKFLOW_TYPE_CODE = criterion.Consts.WORKFLOW_TYPE_CODE;

    return {

        extend : 'Ext.Mixin',

        mixinId : 'criterion_workflow_detail',

        requires : [
            'criterion.model.workflowLog.PendingLogDetail',
            'criterion.model.employee.Timesheet',
            'criterion.model.Person',
            'criterion.model.person.Address',
            'criterion.model.employee.Tax',
            'criterion.model.employee.Goal',
            'criterion.model.employee.OpenEnrollment',
            'criterion.model.person.BankAccount',
            'criterion.model.person.Contact',
            'criterion.model.Employee',
            'criterion.model.assignment.Detail',
            'criterion.model.Position',
            'criterion.model.employee.Benefit',
            'criterion.model.person.Education',
            'criterion.model.person.Skill',
            'criterion.model.person.Certification',

            'criterion.view.common.EmployeeBenefitDocuments',
            'criterion.store.employee.openEnrollment.Documents',
            'criterion.ux.form.FillableWebForm'
        ],

        onDetailsLoadSuccess(record) {
            let me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                requestData = record.get('requestData'),
                actualData = record.get('actualData'),
                workflowTypeCode = record.get('workflowTypeCode'),
                workflowRequestType = record.get('requestType'),
                fillableForm = me.lookup(actualData['webformId'] ? 'fillableWebForm' : 'fillableDataForm'),
                reviewForm = me.lookup('reviewForm'),
                assignmentForm = me.lookup('assignmentForm'),
                employeeHireForm = me.lookup('employeeHireForm'),
                positionForm = me.lookup('positionForm'),
                employeeBenefitForm = me.lookup('employeeBenefitForm'),
                delegatedByEmployeeId = record.get('delegatedByEmployeeId'),
                hideLoading = true;

            vm.set({
                workflowLog : record.getData(),
                hideWorkflow : false,
                hideStream : true,
                hideTasks : true,
                hideRequestType : true
            });

            switch (workflowTypeCode) {

                case WORKFLOW_TYPE_CODE.TIMESHEET:
                    let contentPanel = this.lookup('contentPanel'),
                        reader = Ext.create('Ext.data.reader.Json', {
                            model : (actualData['formatCode'] === criterion.Consts.TIMESHEET_FORMAT.AGGREGATE) ? 'criterion.model.employee.timesheet.Aggregate' : 'criterion.model.employee.Timesheet'
                        }),
                        editor;

                    editor = function() {
                        switch (actualData['formatCode']) {
                            case criterion.Consts.TIMESHEET_FORMAT.VERTICAL:
                                return me.lookup('timesheetVertical');
                            case criterion.Consts.TIMESHEET_FORMAT.HORIZONTAL:
                                return me.lookup('timesheetHorizontal');
                            case criterion.Consts.TIMESHEET_FORMAT.AGGREGATE:
                                return me.lookup('timesheetAggregate');
                            default :
                                throw new Error('Unsupported Timesheet Type: ' + actualData['formatCode']);
                        }
                    }();

                    if (!editor) {
                        editor = function() {
                            switch (actualData['formatCode']) {
                                case criterion.Consts.TIMESHEET_FORMAT.VERTICAL:
                                    return Ext.create('criterion.view.employee.timesheet.Vertical', {
                                        reference : 'timesheetVertical',
                                        height : 'auto',
                                        plugins : null,
                                        buttons : null,
                                        hidden : true,
                                        bind : {
                                            hidden : '{!isVerticalTimesheet}'
                                        },
                                        isWorkflowView : true,
                                        viewModel : {
                                            data : {
                                                viewDetailOnly : true
                                            }
                                        }
                                    });
                                case criterion.Consts.TIMESHEET_FORMAT.HORIZONTAL:
                                    return Ext.create('criterion.view.employee.timesheet.Horizontal', {
                                        reference : 'timesheetHorizontal',
                                        height : 350,
                                        buttons : null,
                                        viewDetailOnly : true,
                                        isWorkflowView : true,
                                        hidden : true,
                                        bind : {
                                            hidden : '{!isHorizontalTimesheet}'
                                        }
                                    });
                                case criterion.Consts.TIMESHEET_FORMAT.AGGREGATE:
                                    return Ext.create('criterion.view.employee.timesheet.Aggregate', {
                                        reference : 'timesheetAggregate',
                                        height : 350,
                                        buttons : null,
                                        hidden : true,
                                        bind : {
                                            hidden : '{!isAggregateTimesheet}'
                                        },
                                        isWorkflowView : true,
                                        viewDetailOnly : true
                                    });
                                default :
                                    throw new Error('Unsupported Timesheet Type: ' + actualData['formatCode']);
                            }
                        }();

                        contentPanel.add(editor);
                    }

                    editor.getViewModel().set({
                        delegatedByEmployeeId : delegatedByEmployeeId,
                        timesheetRecord : reader.read(Ext.clone(actualData)).records[0],
                        timesheetId : actualData['id'],
                        employeeId : me.getEmployeeId()
                    });

                    if (!Ext.isModern) {
                        editor.getController().load(true);
                    }

                    if (!editor.isHidden() && Ext.isFunction(editor.getController().onShow)) { // force reload
                        editor.getController().onShow();
                    }

                    break;

                case WORKFLOW_TYPE_CODE.FORM:
                    fillableForm && fillableForm.loadForm(actualData.id, null, delegatedByEmployeeId);
                    break;
                case WORKFLOW_TYPE_CODE.EMPLOYEE_ONBOARDING:
                    let url = actualData.webformId ? criterion.consts.Api.API.EMPLOYEE_ONBOARDING_WEBFORM_FIELDS : criterion.consts.Api.API.EMPLOYEE_ONBOARDING_DATAFORM_FIELDS;

                    fillableForm && fillableForm.loadForm(actualData.id, url, delegatedByEmployeeId);
                    break;

                case WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW:
                    if (reviewForm) {
                        reviewForm.loadReview({
                            reviewId : actualData.id,
                            employeeId : me.getEmployeeId(),
                            requestData : Ext.clone(requestData),
                            workflowStatusCode : record.get('statusCode'),
                            workflowQueueId : record.get('workflowQueueId'),
                            comments : record.get('comments'),
                            delegatedByEmployeeId : delegatedByEmployeeId
                        }).always(function() {
                            view.setLoading(false);
                        });

                        return true;
                    }
                    break;

                case WORKFLOW_TYPE_CODE.EMPLOYEE_OPEN_ENROLLMENT:
                    this.loadOpenEnrollment(Ext.create('criterion.model.employee.OpenEnrollment', requestData));
                    break;

                case WORKFLOW_TYPE_CODE.PERSON:
                    this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.Person'), workflowTypeCode, workflowRequestType);
                    break;

                case WORKFLOW_TYPE_CODE.PERSON_ADDRESS:
                    this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.person.Address'), workflowTypeCode, workflowRequestType);
                    break;

                case WORKFLOW_TYPE_CODE.EMPLOYEE_TAX:
                    this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.employee.Tax'), workflowTypeCode, workflowRequestType);
                    break;

                case WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL:
                    hideLoading = false;
                    this.loadGoal(record);
                    break;

                case WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT:
                    criterion.CodeDataManager.load([DICT.DEPOSIT_TYPE])
                        .then(function() {
                            me.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.person.BankAccount'), workflowTypeCode, workflowRequestType);
                        });

                    break;

                case WORKFLOW_TYPE_CODE.TIME_OFF:
                    this.loadUpdatedData(requestData, actualData, record);
                    break;

                case WORKFLOW_TYPE_CODE.RELATIONSHIP:
                case WORKFLOW_TYPE_CODE.EMPLOYEE_TERM:
                    this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.Employee'), workflowTypeCode, workflowRequestType);
                    break;

                case WORKFLOW_TYPE_CODE.ASSIGNMENT:
                    if (workflowRequestType !== criterion.Consts.WORKFLOW_REQUEST_TYPE.EMPLOYEE_HIRE) {
                        if (Ext.isModern) {
                            let flatRequestData = Ext.Object.merge(requestData, requestData['assignmentDetails'] ? requestData['assignmentDetails'][0] : {}),
                                flatActualData = Ext.Object.merge(actualData, actualData['assignmentDetails'] ? actualData['assignmentDetails'][0] : {});

                            delete flatRequestData['assignmentDetails'];
                            delete flatActualData['assignmentDetails'];

                            this.loadUpdatedData(flatRequestData, flatActualData, Ext.create('criterion.model.assignment.Detail'), workflowTypeCode, workflowRequestType);
                        } else {
                            assignmentForm && assignmentForm.load(requestData, actualData, delegatedByEmployeeId);
                        }
                    } else {
                        if (!Ext.isModern) {
                            employeeHireForm && employeeHireForm.loadData(requestData, actualData, workflowRequestType);
                        }
                    }

                    break;

                case WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS:
                    this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.person.Contact'), workflowTypeCode, workflowRequestType);
                    break;

                case WORKFLOW_TYPE_CODE.POSITION:
                    if (workflowRequestType !== criterion.Consts.WORKFLOW_REQUEST_TYPE.DELETE) {
                        if (Ext.isModern) {
                            this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.Position'), workflowTypeCode, workflowRequestType);
                        } else {
                            positionForm && positionForm.load(requestData, actualData, workflowRequestType, delegatedByEmployeeId);
                        }
                    } else {
                        this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.Position'), workflowTypeCode, workflowRequestType);
                    }

                    break;

                case WORKFLOW_TYPE_CODE.EE_BENEFIT:
                    if (Ext.isModern) {
                        this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.employee.Benefit'), workflowTypeCode, workflowRequestType);
                    } else {
                        employeeBenefitForm && employeeBenefitForm.load(requestData, actualData, workflowRequestType);
                    }
                    break;

                case WORKFLOW_TYPE_CODE.PERSON_EDUCATION:
                    this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.person.Education'), workflowTypeCode, workflowRequestType);
                    break;

                case WORKFLOW_TYPE_CODE.PERSON_SKILL:
                    this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.person.Skill'), workflowTypeCode, workflowRequestType);
                    break;

                case WORKFLOW_TYPE_CODE.PERSON_CERTIFICATION:
                    this.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.person.Certification'), workflowTypeCode, workflowRequestType);
                    break;
            }

            if (hideLoading) {
                view.setLoading(false);
            }

            return true;
        },

        loadUpdatedData(requestData, actualData, record, workflowTypeCode, workflowRequestType) {
            let me = this,
                vm = me.getViewModel(),
                compareChanges = vm.getStore('compareChanges'),
                timeoffDetails = vm.getStore('timeoffDetails'),
                removedData = vm.getStore('removedData');

            if (requestData) {
                this.prepareUpdatedData(requestData, actualData, record, workflowTypeCode, workflowRequestType).then(changedData => {
                    compareChanges.loadData(changedData);
                    vm.set('compareGridCount', compareChanges.count());
                });
            } else {
                compareChanges.loadData([]);
                vm.set('compareGridCount', compareChanges.count());
            }

            if (record.get('workflowTypeCode') === WORKFLOW_TYPE_CODE.TIME_OFF) {
                Ext.Array.each(actualData['details'], data => {
                    if (data['isFullDay']) {
                        data['duration'] = i18n.gettext('All Day');
                    }
                });

                timeoffDetails.loadData(actualData['details']);
            } else {
                timeoffDetails.loadData([]);
            }

            // removed data
            if (workflowRequestType === criterion.Consts.WORKFLOW_REQUEST_TYPE.DELETE) {
                this.prepareUpdatedData(actualData, actualData, record, workflowTypeCode, workflowRequestType).then(data => {
                    removedData.loadData(data);
                });
            }
        },

        prepareUpdatedData(requestData, actualData, record, workflowTypeCode, workflowRequestType) {
            let changedData = [],
                me = this,
                ignoredKeys = [
                    'id', 'personId', 'teFilingStatusId', 'employeeId', 'statusCd', 'workPhoneInternational',
                    'assignmentId', 'salaryGradeId', 'terminate', 'cloned',
                    'wf1EmployeeId', 'wf2EmployeeId', 'workflowLogId', 'positionId', 'customValues', 'removedCustomValues',
                    'employerLegalName', 'employerWorkLocationId', 'dateActive', 'dateInactive', 'employerId',
                    'workflowLog', 'skills', 'sequence', 'workerCompensation', 'signature'
                ],
                isAssignmentWF = workflowTypeCode === WORKFLOW_TYPE_CODE.ASSIGNMENT,
                isDependentsContactsWF = workflowTypeCode === WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS,
                isPositionWF = workflowTypeCode === WORKFLOW_TYPE_CODE.POSITION,
                requestDataKeys,
                pendingCodeData = [],
                dfd = Ext.create('Ext.Deferred');

            requestDataKeys = Object.keys(requestData);

            if (workflowTypeCode === WORKFLOW_TYPE_CODE.RELATIONSHIP) {
                Ext.each(Object.keys(requestData), key => {
                    let index,
                        orgRec,
                        orgName;

                    if (/^org[1-4]Employee$/.test(key)) {
                        index = key.slice(3, 4);

                        orgRec = criterion.CodeDataManager.getStore(criterion.consts.Dict.ORG_STRUCTURE).findRecord('attribute1', index);
                        orgName = i18n.gettext('Org Structure: ') + (orgRec ? orgRec.get('description') : '');

                        changedData.push({
                            oldData : orgName + '<br />' +
                                i18n.gettext('Employee: ') + (actualData['org' + index + 'PersonName'] || ''),
                            newData : orgName + '<br />' +
                                i18n.gettext('Employee: ') + (requestData[key] || '')
                        });
                    }
                });
            } else {

                if (
                    (isAssignmentWF || isDependentsContactsWF || isPositionWF)
                    &&
                    (
                        Ext.Array.indexOf(requestDataKeys, 'customValues') !== -1 ||
                        Ext.Array.indexOf(requestDataKeys, 'removedCustomValues') !== -1
                    )
                ) {
                    me.formatCustomFieldValues(requestData['customValues'], requestData['removedCustomValues']);
                } else {
                    me.formatCustomFieldValues();
                }

                Ext.each(requestDataKeys, key => {
                    if (Ext.Array.contains(ignoredKeys, key) || Ext.String.endsWith(key, 'Id')) {
                        return;
                    }

                    if (Ext.String.endsWith(key, 'Cd')) {
                        let rRec = record.getField(key),
                            codeDataId = rRec ? rRec['codeDataId'] : null,
                            codeData,
                            codeDataStore;

                        if (!codeDataId) {
                            return;
                        }

                        codeData = DICT[codeDataId];
                        codeDataStore = criterion.CodeDataManager.getStore(codeData);

                        if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                            pendingCodeData.push({
                                codeData : codeData,
                                key : key
                            });
                        } else {
                            let actualCd = codeDataStore.getById(actualData[key]),
                                requestCd = codeDataStore.getById(requestData[key]),
                                actual = actualCd ? actualCd.get('description') : actualData[key],
                                request = requestCd ? requestCd.get('description') : requestData[key];

                            key = key.slice(0, -2);
                            changedData.push(me.formatUpdatedData(key, actual, request, workflowTypeCode));
                        }

                    } else if (workflowTypeCode === WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT && key === 'value') {
                        let actualDepositTypeDesc, requestDepositTypeDesc, getDepositTypeDescFn;

                        getDepositTypeDescFn = id => criterion.CodeDataManager.getCodeDetailRecord('id', id, DICT.DEPOSIT_TYPE).get('description');

                        actualDepositTypeDesc = getDepositTypeDescFn(actualData['depositTypeCd']);

                        if (requestData['depositTypeCd']) {
                            requestDepositTypeDesc = getDepositTypeDescFn(requestData['depositTypeCd']);
                        }

                        changedData.push({
                            key : key,
                            oldData : Ext.String.format('<strong>{0}</strong>: {1}', actualDepositTypeDesc, actualData['value']),
                            newData : Ext.String.format('<strong>{0}</strong>: {1}', requestDepositTypeDesc || actualDepositTypeDesc, requestData['value'])
                        });
                    } else if (key === 'customFields') {
                        Ext.Array.each(requestData['customFields'], customField => {
                            let aData = Ext.Array.findBy(actualData['customFields'], function(acf) {
                                return acf['id'] === customField['id']
                            });

                            changedData.push({
                                key : key,
                                oldData : Ext.String.format('<strong>{0}</strong>: {1}', aData['label'], aData['customValue'] && (aData['customValue']['value'] || aData['customValue']['memo'] || '-')),
                                newData : Ext.String.format('<strong>{0}</strong>: {1}', aData['label'], customField['value'] || customField['memo'] || '-')
                            });
                        });
                    } else {
                        changedData.push(me.formatUpdatedData(key, actualData[key], requestData[key], workflowTypeCode));
                    }
                });
            }

            if (pendingCodeData.length) {
                criterion.CodeDataManager.load(pendingCodeData.map(obj => obj['codeData'])).then(() => {
                    Ext.each(pendingCodeData, obj => {
                        let key = obj['key'],
                            codeData = obj['codeData'],
                            actualCd = actualData[key] ? criterion.CodeDataManager.getCodeDetailRecord('id', actualData[key], codeData) : null,
                            requestCd = requestData[key] ? criterion.CodeDataManager.getCodeDetailRecord('id', requestData[key], codeData) : null,
                            actual = actualCd ? actualCd.get('description') : actualData[key],
                            request = requestCd ? requestCd.get('description') : requestData[key];

                        key = key.slice(0, -2);
                        changedData.push(me.formatUpdatedData(key, actual, request, workflowTypeCode));
                    });

                    dfd.resolve(changedData);
                });
            } else {
                dfd.resolve(changedData);
            }

            return dfd.promise;
        },

        formatCustomFieldValues(customFieldValues, removedCustomValues) {
            let vm = this.getViewModel();

            if (vm.get('containsCustomFields')) {
                this.lookup('customFieldsForm').setCustomFieldsData(customFieldValues, removedCustomValues);
                vm.set('hasCustomFields', !!customFieldValues || !!removedCustomValues);
            }
        },

        formatUpdatedData(key, actual, request, workflowTypeCode) {
            let actualFormatted,
                requestFormatted,
                prettyItem;

            if (/org[0-9]*Position/.test(key)) {
                let orgStructureAttr = /org([0-9]*)Position/.exec(key)[1],
                    orgStructure;

                orgStructure = criterion.CodeDataManager.getCodeDetailRecord('attribute1', orgStructureAttr, criterion.consts.Dict.ORG_STRUCTURE);

                if (!orgStructure) {
                    return;
                }

                prettyItem = orgStructure.get('description');
            } else {
                prettyItem = key.replace(/^(is)([A-Z,0-9])/, '$2');

                prettyItem = prettyItem.charAt(0).toUpperCase() + prettyItem.slice(1);

                prettyItem = prettyItem.replace(/([A-Z,0-9])/g, function(first) {
                    return ' ' + first.toUpperCase();
                });
            }

            if (actual === null) {
                actualFormatted = '-';
            } else if (typeof actual === 'boolean') {
                actualFormatted = actual ? i18n.gettext('Enabled') : i18n.gettext('Disabled');
            } else {
                actualFormatted = actual;
            }

            if (request === null) {
                requestFormatted = '-';
            } else if (typeof request === 'boolean') {
                requestFormatted = request ? i18n.gettext('Enabled') : i18n.gettext('Disabled');
            } else if (Ext.isModern && workflowTypeCode === WORKFLOW_TYPE_CODE.ASSIGNMENT) {
                switch (key) {
                    case 'effectiveDate':
                        requestFormatted = Ext.Date.format(
                            Ext.Date.parse(request, criterion.consts.Api.DATE_FORMAT),
                            criterion.consts.Api.SHOW_DATE_FORMAT
                        );
                        break;

                    case 'payRate':
                        requestFormatted = Ext.util.Format.currency(request, Ext.util.Format.currencySign, Ext.util.Format.currencyRatePrecision);
                        break;

                    default:
                        requestFormatted = request;
                        break;
                }
            } else {
                requestFormatted = request;
            }

            // description sometimes has WYSIWYG as editor
            if (key !== 'description') {
                actualFormatted = Ext.String.htmlEncode(actualFormatted);
                requestFormatted = Ext.String.htmlEncode(requestFormatted);
            }

            return {
                key : key,
                oldData : Ext.String.format('<strong>{0}</strong>: {1}', prettyItem, actualFormatted),
                newData : Ext.String.format('<strong>{0}</strong>: {1}', prettyItem, requestFormatted),

                isSSN : /National Identifier/.test(prettyItem),
                item : prettyItem,
                actual : actual,
                request : request
            };
        },

        loadOpenEnrollment(enrollment) {
            let openEnrollment = this.lookup('openEnrollment'),
                steps = enrollment.get('steps'),
                seq = [];

            openEnrollment.removeAll();

            if (steps && steps.length) {

                Ext.Array.each(steps, step => {
                    let options = [],
                        openEnrollmentStepId = step.openEnrollmentStepId,
                        webform,
                        benefitDocuments;

                    if (step.isEnroll) {
                        options.push({
                            html : Ext.util.Format.format('<strong>{0}</strong>', step.planName)
                        });

                        if (step.options) {
                            options.push.apply(options, step.options.map(function(option) {
                                return {
                                    html : Ext.util.Format.format('{0}: {1}', option.optionName, option.manualValue || option.optionValue)
                                }
                            }));
                        }
                    } else {
                        options.push({
                            html : Ext.util.Format.format('<strong>{0}</strong>', i18n.gettext('No Next Year Plan'))
                        });
                    }

                    openEnrollment.add({
                        xtype : 'container',
                        layout : 'hbox',

                        cls : 'summary-item',

                        defaults : {
                            xtype : 'component',
                            padding : '20 0',
                            flex : 1
                        },

                        items : [
                            {
                                cls : 'title',
                                padding : 20,
                                html : step.benefitName
                            },
                            {
                                xtype : 'container',
                                padding : '10 0',
                                defaults : {
                                    xtype : 'component',
                                    padding : '10 0'
                                },
                                items : options
                            }
                        ]
                    });

                    benefitDocuments = openEnrollment.add({
                        xtype : 'criterion_common_employee_benefit_documents',
                        downloadURL : criterion.consts.Api.API.EMPLOYEE_OPEN_ENROLLMENT_DOCUMENT_DOWNLOAD,
                        store : {
                            type : 'criterion_employee_open_enrollment_documents'
                        },
                        cls : 'workflow-details-oe-step-document',
                        margin : 0,
                        hideHeaders : true,
                        header : {

                            title : {
                                text : i18n.gettext('Documents') + ' (' + step.planName + ')',
                                cls : 'workflow-details-oe-step-document-title'

                            },
                            padding : '10 0 10 15',
                            margin : 0
                        },
                        columns : [
                            {
                                xtype : 'gridcolumn',
                                dataIndex : 'documentName',
                                text : i18n.gettext('Name'),
                                flex : 1
                            },
                            {
                                xtype : 'criterion_actioncolumn',
                                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                items : [
                                    {
                                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                                        tooltip : i18n.gettext('Download'),
                                        action : 'downloadAction'
                                    }
                                ]
                            }
                        ]
                    });

                    seq.push(benefitDocuments.getStore().loadWithPromise({
                        params : {
                            employeeOpenEnrollmentStepId : step.id
                        }
                    }).then(() => {
                        if (!benefitDocuments.getStore().count()) {
                            benefitDocuments.hide();
                        }
                    }));

                    if (step.webformId) {
                        webform = openEnrollment.add({
                            xtype : 'criterion_fillable_webform',
                            header : {
                                title : i18n.gettext('Form') + ' (' + step.planName + ')',
                                padding : '10 0 10 15',
                                margin : 0
                            },
                            reference : 'webform_for_' + openEnrollmentStepId,
                            margin : '20 0 20 0',
                            border : 1,
                            style : {
                                borderColor : '#EEE',
                                borderStyle : 'solid',
                                borderWidth : 0
                            },
                            correctHeightValue : 76,
                            scrollable : true,
                            editable : false
                        });

                        webform.setMainUrl(Ext.String.format(criterion.consts.Api.API.EMPLOYEE_OPEN_ENROLLMENT_STEP_WEBFORM_FIELDS, step.id));
                        seq.push(webform.loadForm());
                    }

                    openEnrollment.add({
                        xtype : 'component',
                        autoEl : 'hr',
                        cls : 'criterion-horizontal-ruler'
                    });
                });

                seq.length && Ext.promise.Promise.all(seq);
            }
        },

        loadGoal(record) {
            let me = this,
                workflowTypeCd,
                requestData = record.get('requestData'),
                actualData = record.get('actualData'),
                workflowRequestType = record.get('requestType'),
                vm = me.getViewModel(),
                rename = {
                    name : 'goalName',
                    description : 'goalDescription',
                    reviewComments : 'reviewDescription'
                },
                reviewPeriods = Ext.getStore({type : 'criterion_review_template_periods'}),
                reviewScaleDetails = Ext.getStore({type : 'criterion_review_scale_details'}),
                workflows = Ext.getStore({type : 'criterion_workflows'});

            function formatWeight(data) {
                if (data.weight) {
                    data.weight = parseInt((data.weight * 100).toFixed(2), 10) + '%';
                }
            }

            if (workflowRequestType === criterion.Consts.WORKFLOW_REQUEST_TYPE.DELETE) {
                for (let key in actualData) {
                    if (actualData.hasOwnProperty(key)) {
                        requestData[key] = undefined;
                    }
                }

                vm.set('isCompareGrid', true);
                vm.set('hideRequestType', false);
            } else {
                Ext.applyIf(requestData, actualData);
            }

            Ext.Deferred.all([
                reviewPeriods.loadWithPromise(),
                reviewScaleDetails.loadWithPromise(),
                Ext.Deferred.sequence([
                    function() {
                        return criterion.CodeDataManager.getCodeDetailRecordStrict('code', criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL, criterion.consts.Dict.WORKFLOW).then(function(workflowTypeRec) {
                            workflowTypeCd = workflowTypeRec.getId();
                        })
                    },
                    function() {
                        return workflows.loadWithPromise({
                            params : {
                                workflowTypeCd : workflowTypeCd
                            }
                        })
                    }
                ])
            ]).always(function() {
                me.setNameByStore(requestData, 'workflowId', 'workflow', workflows);
                me.setNameByStore(actualData, 'workflowId', 'workflow', workflows);
                me.setNameByStore(requestData, 'reviewPeriodId', 'reviewPeriod', reviewPeriods);
                me.setNameByStore(actualData, 'reviewPeriodId', 'reviewPeriod', reviewPeriods);
                me.setNameByStore(requestData, 'reviewScaleDetailId', 'rating', reviewScaleDetails);
                me.setNameByStore(actualData, 'reviewScaleDetailId', 'rating', reviewScaleDetails);
                formatWeight(requestData);
                formatWeight(actualData);

                me.renameProperties(requestData, rename, true);
                me.renameProperties(actualData, rename);
                me.loadUpdatedData(requestData, actualData, Ext.create('criterion.model.employee.Goal'), WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL);
                me.getView().setLoading(false);
            });
        },

        renameProperties(obj, renameTo, force = false) {
            for (let key in renameTo) {
                if (renameTo.hasOwnProperty(key) && (obj[key] !== undefined || force)) {
                    obj[renameTo[key]] = obj[key];
                    delete obj[key];
                }
            }
        },

        setNameByStore(data, key, newKey, store) {
            if (data[key]) {
                let record = store.getById(data[key]);

                if (record) {
                    data[newKey] = record.get('name');
                }
            }
        }
    };

});
