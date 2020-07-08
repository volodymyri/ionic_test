Ext.define('ess.controller.dashboard.timesheet.Base', function() {

    var DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_dashboard_timesheet_base',

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
                    criterion.CodeDataManager.load(codeTableCodes, me._load, me);
                } else {
                    me._load();
                }
            });
        },

        getTimesheetDetailStore : function() {
            return this.getViewModel().getStore('timesheetDetails');
        },

        loadTimesheetDetailStore : function() {
            var vm = this.getViewModel(),
                delegatedByEmployeeId = vm.get('delegatedByEmployeeId');

            return this.getTimesheetDetailStore().loadWithPromise({
                params : Ext.Object.merge(
                    {
                        timesheetId : vm.get('timesheetRecord').id
                    },
                    (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                )
            })
        },

        _load : function() {
            var me = this,
                vm = this.getViewModel(),
                container = this.getView().up(),
                delegatedByEmployeeId = vm.get('delegatedByEmployeeId');

            me.isApplicableToApproverByTaskDetailId = {};

            Ext.promise.Promise.all([
                me.loadTimesheetDetailStore(),
                vm.getStore('timesheetTypes').loadWithPromise({
                    params : delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {}
                })
            ]).then(function() {
                var detailDataView = me.lookupReference('detailDataView'),
                    customFieldsStr = '',
                    customDatas = vm.getStore('customdata'),
                    timesheetTypes = vm.getStore('timesheetTypes'),
                    timesheetType = timesheetTypes.getById(vm.get('timesheetRecord.timesheetTypeId')),
                    isManualDay = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY),
                    totalsByDate = {},
                    funcObj = {
                        convertTime : function(times) {
                            var isUnits = times['paycodeDetail'] ? times['paycodeDetail']['isUnits'] : false;

                            return isUnits ? times['units'] : (isManualDay ? Ext.util.Format.employerAmountPrecision(times['days']) : criterion.Utils.timeObjToStr(times));
                        }
                    },
                    timesheetRecord = vm.get('timesheetRecord'),
                    isShowTasks = timesheetRecord.getTimesheetType().get('isShowTasks');

                vm.set('isManualDay', isManualDay);

                timesheetRecord.timesheetTasks().each(function(timesheetTask) {
                    var isApplicableToApprover = timesheetTask.get('isApplicableToApprover');

                    timesheetTask.timesheetTaskDetails().each(function(timesheetTaskDetail) {
                        me.isApplicableToApproverByTaskDetailId[timesheetTaskDetail.getId()] = isApplicableToApprover;
                    });
                });

                timesheetRecord.totals().each(function(total) {
                    totalsByDate[Ext.Date.format(total.get('date'), 'Y.m.d')] = criterion.Utils.timeObjToStr(criterion.Utils.hoursToDuration(total.get('applicableToApproverHours')));
                });

                me.getTimesheetDetailStore().each(function(rec) {
                    var date = Ext.Date.format(new Date(rec.get('date')), 'Y.m.d');

                    rec.set({
                        totalValue : isManualDay ? Ext.util.Format.employerAmountPrecision(rec.get('totalDays')) : totalsByDate[date],
                        totalUnit : isManualDay ? i18n.gettext('days') : i18n.gettext('hrs.')
                    });
                });

                Ext.Array.each(['customField1Id', 'customField2Id', 'customField3Id', 'customField4Id'], function(fieldName, index) {
                    var customField = timesheetType.get(fieldName) && customDatas.getById(timesheetType.get(fieldName));

                    if (!customField || customField.get('isHidden')) {
                        return;
                    }

                    var customFieldStringAndFn = criterion.Utils.getCustomFieldStringAndFn(customField, index);

                    customFieldsStr += customFieldStringAndFn.customFieldsString || '';
                    funcObj = Ext.apply(funcObj, customFieldStringAndFn.funcObj);
                });

                detailDataView.setItemTpl(new Ext.XTemplate(
                    '<div class="{[values.isNotApplicableToApprover ? "is-not-applicable-to-approver" : ""]}">',
                        '<div class="left {[values.isNotApplicableToApprover ? "is-not-applicable-to-approver" : ""]}">',
                        (isShowTasks && !me.hasOneTask ? '<p class="task"><span class="bold">Task:</span> {employeeTaskName:htmlEncode}</p>' : ''),
                        '<p class="paycode"><span class="bold">Paycode:</span> {paycodeDetail.name}</p>',
                        (me.hasOneAssignment ? '' : '<p class="assignment">{assignmentName:htmlEncode}</p>'),
                        (me.hasOneEmployerWorkLocation ? '' : '<p class="location">{employerWorkLocationName:htmlEncode}</p>'),
                        '<tpl if="values.isInsideGeofence != null"><p class="marker"><span class="x-fa fa-map-marker ess-geolocation-marker {[values.isInsideGeofence ? "ess-geolocation-inside" : "ess-geolocation-outside"]}"></span></p></tpl>',
                        customFieldsStr,
                        '</div>',
                        '<div class="right {[values.isNotApplicableToApprover ? "is-not-applicable-to-approver" : ""]}"><p class="time">{[this.convertTime(values)]}</p></div>',
                        '<div class="x-clear"></div>',
                    '</div>',
                    funcObj
                ));

                container.setMasked(false);
            });
        },

        onTimesheetTap : function(cmp, index, target, record) {
            var me = this,
                vm = this.getViewModel();

            vm.set('showDetails', true);
            vm.set('detailRecord', record);

            record.details().each(function(detail) {
                detail.set('isNotApplicableToApprover', !me.isApplicableToApproverByTaskDetailId[detail.getId()]);
            });

            this.lookupReference('detailDataView').setStore(record.details());
        },

        onDetailsBack : function() {
            var vm = this.getViewModel();

            vm.set('showDetails', false);
            vm.set('detailRecord', null);
        }
    };
});
