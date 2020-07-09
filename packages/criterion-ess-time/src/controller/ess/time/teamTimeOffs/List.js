Ext.define('criterion.controller.ess.time.teamTimeOffs.List', function() {

    let _scrollPositionX = 0,
        _scrollPositionY = 0;

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_time_team_time_offs_list',

        requires : [
            'criterion.view.ess.time.teamTimeOffs.Options'
        ],

        suppressIdentity : ['employeeContext'],

        load() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                employeeGroupIds = vm.get('employeeGroupIds'),
                isEmployeeGroupsSelected = Ext.isArray(employeeGroupIds) && employeeGroupIds.length,
                showApproved = vm.get('showApproved'),
                params = {},
                teamTimeOffs = view.getStore();

            if (showApproved) {
                params.showApproved = true;
            }

            if (isEmployeeGroupsSelected) {
                params.employeeGroupIds = employeeGroupIds.join(',');
            }

            view.fireEvent('showLoadingState');

            teamTimeOffs.currentPage = 1;

            Ext.promise.Promise.all([
                criterion.CodeDataManager.load([
                    criterion.consts.Dict.TIME_OFF_TYPE
                ]),
                teamTimeOffs.loadWithPromise({
                    params : params
                })
            ]).then(datas => {
                me.createColumns(datas[1]);
            }).always(() => {
                view.fireEvent('hideLoadingState');
            });
        },

        handleAct(grid, td, cellIndex, record, tr, rowIndex, e) {
            let view = this.getView(),
                column = e.position && e.position.column,
                dataIndex = column && column.dataIndex,
                xtype = column && e.position.column.xtype;

            if (
                !xtype ||
                xtype === 'criterion_actioncolumn' ||
                !dataIndex
            ) {
                return;
            }

            if (dataIndex === 'employeeLastName') {
                view.fireEvent('goEmployeeTimeOff', record);
            }
        },

        createColumns(datas) {
            let vm = this.getViewModel(),
                view = this.getView(),
                scrollPosition = view.getScrollable().getPosition(),
                columns = [
                    {
                        xtype : 'gridcolumn',
                        width : 150,
                        text : i18n.gettext('Last Name'),
                        // locked : true, don't use locked because it's very buggy in this place!
                        sortable : true,
                        dataIndex : 'employeeLastName',
                        hideable : false,
                        encodeHtml : false,
                        renderer : (value, metaData, record) => '<span class="text-link" data-qtip="' + i18n.gettext('Go To Employee Time Offs') + '">' + value + '</span>'
                    },
                    {
                        text : i18n.gettext('Middle Name'),
                        width : 200,
                        sortable : true,
                        hidden : this.isColumnHidden('employeeMiddleName'),
                        dataIndex : 'employeeMiddleName'
                    },
                    {
                        text : i18n.gettext('First Name'),
                        width : 150,
                        sortable : true,
                        hideable : false,
                        dataIndex : 'employeeFirstName'
                    },
                    {
                        text : i18n.gettext('Employee Number'),
                        width : 200,
                        sortable : true,
                        hidden : this.isColumnHidden('employeeNumber'),
                        dataIndex : 'employeeNumber'
                    },
                    {
                        text : i18n.gettext('Nickname'),
                        width : 150,
                        sortable : true,
                        hidden : this.isColumnHidden('employeeNickName'),
                        dataIndex : 'employeeNickName'
                    },
                    {
                        text : i18n.gettext('Title'),
                        width : 250,
                        sortable : true,
                        hidden : this.isColumnHidden('employeeTitle'),
                        dataIndex : 'employeeTitle'
                    }
                ];

            if (datas.length) {
                datas[0].details().each(rec => {
                    let recId = rec.getId();

                    columns.push({
                        xtype : 'gridcolumn',
                        encodeHtml : false,
                        width : 90,
                        resizable : false,
                        sortable : false,
                        menuDisabled : true,
                        hideable : false,
                        align : 'center',
                        text : Ext.Date.format(rec.get('date'), 'D<br>m/d'),
                        renderer : (value, metaData, record) => {
                            let wRecord = record.details().getById(recId),
                                timeOffTypes = wRecord && wRecord.timeOffTypes(),
                                color = 'transparent',
                                containerCls = '',
                                count = timeOffTypes && timeOffTypes.count(),
                                info = [],
                                mark = count <= 1 ? '&nbsp;' : '<div class="f"></div><div class="s"></div><div class="t"></div>',
                                ttip;

                            if (count === 1) {
                                color = timeOffTypes.first().get('color');
                                containerCls = 'round';
                            } else if (count > 1) {
                                containerCls = 't-round';
                            }

                            wRecord.timeOffTypes().each(timeOffType => {
                                let df = Ext.Date.format,
                                    TF = criterion.consts.Api.TIME_FORMAT;

                                info.push('<div class="name">' + timeOffType.get('typeDescription') + '</div>');
                                info.push(timeOffType.get('isFullDay') ?
                                    '<div class="duration">' + i18n.gettext('Full day') + '</div>' :
                                    '<div class="duration">' + timeOffType.get('total') + ' ' + i18n.gettext('hours') + '</div>'
                                );
                                info.push(timeOffType.get('isFullDay') ?
                                    '' :
                                    '<div class="period">' + df(timeOffType.get('start'), TF) + ' - ' + df(timeOffType.get('end'), TF) + '</div>');
                            });

                            ttip = count > 0 ? ('<div class="detail-widget-info-tip">' + info.join(' ') + '</div>').replace(/"/g, '\'') : '';

                            return `<div class="detail-mark" data-qtip="${ttip}"><div class="container-mark ${containerCls}" style="background-color: ${color}">${mark}</div></div>`;
                        }
                    })
                });

                datas[0].plans().each(rec => {
                    let erPlanId = rec.get('erPlanId');

                    columns.push({
                        xtype : 'gridcolumn',
                        encodeHtml : false,
                        flex : 1,
                        minWidth : 120,
                        sortable : false,
                        menuDisabled : true,
                        hideable : false,
                        text : rec.get('timeOffTypes').join('<br>'),
                        renderer : (value, metaData, record) => {
                            let wRecord = record.plans().findRecord('erPlanId', erPlanId, 0, false, false, true),
                                planIsAccrualInDays = wRecord && wRecord.get('planIsAccrualInDays'),
                                unit = planIsAccrualInDays ? 'd' : 'h',
                                infoUnit = planIsAccrualInDays ? i18n.gettext('days') : i18n.gettext('hours'),
                                fv = value => (value ? Ext.util.Format.employerAmountPrecision(value) : value),
                                balance = wRecord && wRecord.get('balance'),
                                info,
                                planInfo,
                                ttip;

                            info = wRecord ? [
                                '<div class="name">' + wRecord.get('name') + '</div>',
                                '<div class="param net"><i class="mark"></i>' + i18n.gettext('Net Carryover') + '<div class="fl"></div>' + fv(wRecord.get('netCarryover')) + unit + '</div>',
                                '<div class="param accrued"><i class="mark"></i>' + i18n.gettext('Accrued') + '<div class="fl"></div>' + fv(wRecord.get('accrued')) + unit + '</div>',
                                '<div class="param taken"><i class="mark"></i>' + i18n.gettext('Taken') + '<div class="fl"></div>' + fv(wRecord.get('taken')) + unit + '</div>',
                                '<div class="param planned"><i class="mark"></i>' + i18n.gettext('Planned') + '<div class="fl"></div>' + fv(wRecord.get('planned')) + unit + '</div>',
                                '<div class="param balance"><i class="mark"></i>' + i18n.gettext('Balance') + '<div class="fl"></div>' + fv(wRecord.get('balance')) + unit + '</div>'
                            ] : [];

                            ttip = (`<div class="plan-widget-info-tip">${info.join('')}</div>`).replace(/"/g, '\'');

                            if (!wRecord || (!balance && !wRecord.get('periodId'))) {
                                planInfo = '<span class="criterion-darken-gray">&ndash;</span>';
                                ttip = '';
                            } else {
                                planInfo = Ext.String.format('{0:employerAmountPrecision} <span class="unit">{1}</span>', balance, infoUnit);
                            }

                            return `<div class="plan-info" data-qtip="${ttip}">${planInfo}</div>`;
                        }
                    })
                });
            }

            _scrollPositionX = scrollPosition.x;
            _scrollPositionY = scrollPosition.y;

            vm.set('gridColumns', columns);
        },

        isColumnHidden(dataIndex) {
            let columnManager = this.getView().columnManager,
                column = columnManager.getHeaderByDataIndex(dataIndex);

            return column ? column.hidden : true;
        },

        handleActivate() {
            if (this.checkViewIsActive()) {
                this.getViewModel().getStore('employeeGroups').loadWithPromise();
            }
        },

        handleOptions() {
            let wnd,
                me = this,
                vm = this.getViewModel();

            wnd = Ext.create('criterion.view.ess.time.teamTimeOffs.Options', {
                viewModel : {
                    data : {
                        employeeGroupIds : vm.get('employeeGroupIds')
                    },
                    stores : {
                        employeeGroups : vm.getStore('employeeGroups')
                    }
                }
            });

            wnd.on({
                cancel : function() {
                    wnd.destroy();
                },
                applyOptions : function(data) {
                    vm.set({
                        employeeGroupIds : data.employeeGroupIds
                    });

                    me.load();
                    wnd.destroy();
                }
            });

            wnd.show();
        },

        handleChangeShowApproved() {
            this.load();
        },

        onTeamTimeOffsDataChanged(store) {
            let vm = this.getViewModel(),
                details;

            vm.set('teamTimeOffsCount', store.count());

            if (store.count()) {
                details = store.first().details();
                vm.set({
                    startDate : details.first().get('date'),
                    endDate : details.last().get('date')
                });
            }
        },

        onTeamTimeOffsFilterChange() {
            this.getView().reconfigure();
        },

        onTeamTimeOffsBeforeLoad(store) {
            let vm = this.getViewModel(),
                startDate = vm.get('startDate'),
                employeeGroupIds = vm.get('employeeGroupIds');

            if (Ext.isDefined(startDate)) {
                store.getProxy().setExtraParams({
                    startDate : Ext.Date.format(startDate, criterion.consts.Api.DATE_FORMAT),
                    employeeGroupIds : employeeGroupIds.join(',')
                });
            }
        },

        loadTeamTimeOffDetails(params) {
            let vm = this.getViewModel(),
                teamTimeOffDetail = vm.getStore('teamTimeOffDetail'),
                teamTimeOffs = vm.getStore('teamTimeOffs'),
                teamTimeOffsOptions = teamTimeOffs.lastOptions,
                employeeGroupIds = vm.get('employeeGroupIds'),
                employeeIds = [];

            teamTimeOffs.each(teamTimeOff => {
                employeeIds.push(teamTimeOff.get('employeeId'));
            });

            if (employeeIds.length) {
                params['employeeIds'] = employeeIds.join(',');
            } else {
                params['employeeGroupIds'] = employeeGroupIds.join(',');
            }

            teamTimeOffDetail.getFilters().beginUpdate();
            teamTimeOffDetail.getSorters().beginUpdate();

            teamTimeOffDetail.setSorters(teamTimeOffsOptions.sorters);
            teamTimeOffDetail.setFilters(teamTimeOffsOptions.filters);

            teamTimeOffDetail.loadWithPromise({
                params : params
            }).then(this.onWeekDetailsLoaded, null, null, this);
        },

        handlePrevWeek() {
            let vm = this.getViewModel(),
                startPrev,
                showApproved = vm.get('showApproved'),
                params;

            this.getView().setLoading(true);

            startPrev = Ext.Date.add(vm.get('startDate'), Ext.Date.DAY, -7, true);

            params = {
                startDate : Ext.Date.format(startPrev, criterion.consts.Api.DATE_FORMAT)
            };

            if (showApproved) {
                params.showApproved = true;
            }

            this.loadTeamTimeOffDetails(params);
        },

        handleNextWeek() {
            let vm = this.getViewModel(),
                startNext,
                showApproved = vm.get('showApproved'),
                params;

            this.getView().setLoading(true);

            startNext = Ext.Date.add(vm.get('startDate'), Ext.Date.DAY, 7, true);

            params = {
                startDate : Ext.Date.format(startNext, criterion.consts.Api.DATE_FORMAT)
            };

            if (showApproved) {
                params.showApproved = true;
            }

            this.loadTeamTimeOffDetails(params);
        },

        onWeekDetailsLoaded(datas) {
            let vm = this.getViewModel(),
                view = this.getView(),
                teamTimeOffs = vm.getStore('teamTimeOffs');

            Ext.each(datas, detailRec => {
                let employeeId = detailRec.get('employeeId'),
                    teamTimeOffRec = teamTimeOffs.findRecord('employeeId', employeeId, 0, false, false, true);

                if (teamTimeOffRec) {
                    Ext.Array.each(detailRec.details().getRange(), (r, index) => {
                        let data = r.getData({associated : true}),
                            tRec = teamTimeOffRec.details().getAt(index);

                        tRec.set('date', data['date']);
                        tRec.timeOffTypes().setData(data['timeOffTypes']);
                    });
                }
            });

            this.createColumns(teamTimeOffs.getRange());

            teamTimeOffs.fireEvent('datachanged', teamTimeOffs);

            Ext.defer(() => {
                view.setLoading(false);
            }, 500);
        },

        onReconfigure() {
            Ext.defer(function() {
                this.getView().view.scrollBy(_scrollPositionX, _scrollPositionY);
            }, 1000, this)
        }
    };
});
