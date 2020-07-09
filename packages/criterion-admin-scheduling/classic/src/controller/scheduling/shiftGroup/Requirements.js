Ext.define('criterion.controller.scheduling.shiftGroup.Requirements', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_scheduling_shift_group_requirements',

        requires : [
            'criterion.view.MultiRecordPickerRemoteAlt',
            'criterion.store.position.Search'
        ],

        onShow() {
            let cancelBtn = this.lookup('cancelBtn');

            Ext.defer(_ => {
                cancelBtn.focus();
            }, 100);
        },

        handlePositionSelect() {
            let vm = this.getViewModel(),
                presentPositions = vm.getStore('presentPositions'),
                positions = Ext.create('criterion.store.position.Search', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                selectedPositions = Ext.create('criterion.store.position.Search'),
                excludedIds = [],
                storeParams = {
                    employerId : vm.get('employerId')
                },
                selectWindow;

            presentPositions.each(function(pos) {
                excludedIds.push(pos.getId());

                selectedPositions.add({
                    id : pos.getId(),
                    title : pos.get('text')
                });
            });

            selectWindow = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : false,
                        height : '85%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
                    }
                ],
                modal : false,
                closable : false,
                cls : 'criterion-modal',
                viewModel : {
                    data : {
                        title : i18n.gettext('Positions'),
                        gridColumns : [
                            {
                                text : i18n.gettext('Title'),
                                dataIndex : 'title',
                                flex : 1,
                                filter : 'string'
                            }
                        ],
                        storeParams : storeParams,
                        excludedIds : excludedIds,
                        allowDeleteSelected : true
                    },
                    stores : {
                        inputStore : positions,
                        selectedStore : selectedPositions
                    }
                }
            });

            selectWindow.on({
                selectRecords : records => {
                    let positionIds = [];

                    presentPositions.removeAll();

                    Ext.Array.each(records, rec => {
                        let id = rec.get('id');

                        presentPositions.add({
                            id : id,
                            text : rec.get('title')
                        });

                        positionIds.push(id)
                    });

                    vm.set('positionIds', positionIds);
                }
            });

            selectWindow.show();
        },

        handleCancel() {
            this.fireViewEvent('cancel');
        },

        handleChange() {
            let vm = this.getViewModel();

            this.fireViewEvent('changeState', {
                positions : vm.getStore('presentPositions'),
                positionIds : vm.get('positionIds'),
                skillIds : vm.get('skillIds'),
                certificationIds : vm.get('certificationIds')
            });
        }
    }
});
