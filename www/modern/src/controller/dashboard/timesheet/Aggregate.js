Ext.define('ess.controller.dashboard.timesheet.Aggregate', function() {

    var DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_dashboard_timesheet_aggregate',

        init : function() {
            var vm = this.getViewModel();

            vm.bind('{timesheetRecord}', this.load, this);
            this.callParent(arguments);
        },

        load : function(timesheetRecord) {
            var me = this,
                vm = this.getViewModel(),
                container = this.getView().up(),
                delegatedByEmployeeId = vm.get('delegatedByEmployeeId');

            if (!timesheetRecord) {
                return;
            }

            this.hasOneAssignment = timesheetRecord.get('hasOneAssignment');
            this.hasOneEmployerWorkLocation = timesheetRecord.get('hasOneEmployerWorkLocation');
            this.hasOneTask = timesheetRecord.get('hasOneTask');

            container.setMasked({
                xtype : 'loadmask',
                message : 'Loading...'
            });

            vm.set('showDetails', false);

            vm.getStore('customdata').loadWithPromise({
                params : Ext.Object.merge(
                    {
                        entityTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_TIMESHEET_DETAIL.code, DICT.ENTITY_TYPE).getId()
                    },
                    (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                )
            }).then(function() {
                // loading used codetables
                var customDatas = vm.getStore('customdata'),
                    codeTableCodes = [];

                customDatas.each(function(customField) {
                    var dataType = criterion.CodeDataManager.getCodeDetailRecord('id', customField.get('dataTypeCd'), DICT.DATA_TYPE).get('code');

                    if (dataType === DATA_TYPE.DROPDOWN) {
                        codeTableCodes.push(
                            criterion.CodeDataManager.getCodeTableNameById(customField.get('codeTableId'))
                        );
                    }
                });

                if (codeTableCodes.length) {
                    criterion.CodeDataManager.load(codeTableCodes, me.prepareData, me);
                } else {
                    me.prepareData();
                }
            });
        },

        prepareData : function() {
            var me = this,
                vm = this.getViewModel(),
                container = this.getView().up(),
                timesheetRecord = vm.get('timesheetRecord'),
                timesheetType = timesheetRecord.getTimesheetType(),
                detailDataView = me.lookupReference('detailDataView'),
                customFieldsStr = '',
                customDatas = vm.getStore('customdata'),
                funcObj = {},
                fteStr,
                isShowTasks = timesheetType.get('isShowTasks');

            Ext.Array.each(['customField1Id', 'customField2Id', 'customField3Id', 'customField4Id'], function(fieldName, index) {
                var customField = timesheetType.get(fieldName) && customDatas.getById(timesheetType.get(fieldName));

                if (!customField || customField.get('isHidden')) {
                    return;
                }

                var customFieldStringAndFn = criterion.Utils.getCustomFieldStringAndFn(customField, index);

                customFieldsStr += customFieldStringAndFn.customFieldsString || '';
                funcObj = Ext.apply(funcObj, customFieldStringAndFn.funcObj);
            });

            fteStr = timesheetRecord.get('isFTE') ? '<p class="time"><span class="bold">FTE:</span> {fte}</p>' : '';

            detailDataView.setItemTpl(new Ext.XTemplate(
                '<div class="timesheetTaskItem">',
                    '<div class="left">',
                        (isShowTasks && !me.hasOneTask ? '<p class="task"><span class="bold">Task:</span> {employeeTaskName:htmlEncode}</p>' : ''),
                        '<p class="paycode"><span class="bold">Paycode:</span> {paycodeDetail.name}</p>',
                        (me.hasOneAssignment ? '' : '<p class="assignment">{assignmentName:htmlEncode}</p>'),
                        (me.hasOneEmployerWorkLocation ? '' : '<p class="location">{employerWorkLocationName:htmlEncode}</p>'),
                        customFieldsStr,
                    '</div>',
                    '<div class="right"><p class="time"><span class="bold">Hours:</span> {totalHours}</p>' + fteStr + '</div>',
                    '<div class="x-clear"></div>',
                '</div>',
                funcObj
            ));

            detailDataView.setStore(timesheetRecord.timesheetTasks());

            container.setMasked(false);
        }

    };
});
