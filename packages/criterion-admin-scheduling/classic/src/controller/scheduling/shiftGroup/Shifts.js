Ext.define('criterion.controller.scheduling.shiftGroup.Shifts', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_scheduling_shift_group_shifts',

        requires : [
            'criterion.view.scheduling.shiftGroup.ShiftSchedule'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        getEmptyRecord() {
            return {
                shiftGroupId : this.getViewModel().get('record.id')
            };
        },

        handleBeforeCellClick(grid, td, cellIndex, record, tr, rowIndex, e) {
            let column = e.position && e.position.column,
                dataIndex = column && column.dataIndex;

            if (Ext.Array.contains(['name', 'sequence'], dataIndex)) {
                this.handleEditAction(record);
            }

            if (/^day_*/.test(dataIndex)) {
                this.editShiftSchedule(parseInt(dataIndex.replace('day_', ''), 10) + 1, record);
            }

            return false;
        },

        editShiftSchedule(day, record) {
            let me = this,
                scheduleWnd,
                shiftSchedule = Ext.create('criterion.store.AbstractStore', {
                    model : 'criterion.model.employer.shiftGroup.ShiftSchedule',
                    filters : [
                        {
                            property : 'day',
                            value : day,
                            exactMatch : true
                        }
                    ],
                    sorters : [
                        {
                            property : 'startTimeCurrentDate',
                            direction : 'ASC'
                        }
                    ]
                });

            record.shiftSchedule().cloneToStore(shiftSchedule);

            scheduleWnd = Ext.create('criterion.view.scheduling.shiftGroup.ShiftSchedule', {
                viewModel : {
                    data : {
                        shiftSchedule : shiftSchedule,
                        day : day,
                        shiftId : record.getId(),
                        title : criterion.Consts.DAYS_OF_WEEK_ARRAY[day - 1]
                    }
                }
            });

            scheduleWnd.show();

            scheduleWnd.on({
                cancel : _ => {
                    me.setCorrectMaskZIndex(false);
                    scheduleWnd.destroy();
                },
                changeState : (view, shiftSchedule) => {
                    me.setCorrectMaskZIndex(false);
                    me.changeGroupSchedule(shiftSchedule, day, record);
                    scheduleWnd.destroy();
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        changeGroupSchedule(shiftSchedule, day, record) {
            let presentShiftSchedule = record.shiftSchedule(),
                hasChanges = false,
                toBeRemoved = [],
                toBeAdded = [];

            // removed
            presentShiftSchedule.each(schedule => {
                if (!shiftSchedule.getById(schedule.getId())) {
                    toBeRemoved.push(schedule);
                }
            });

            if (toBeRemoved.length) {
                hasChanges = true;
                presentShiftSchedule.remove(toBeRemoved);
            }

            // added
            shiftSchedule.each(schedule => {
                if (!presentShiftSchedule.getById(schedule.getId())) {
                    toBeAdded.push(schedule);
                }
            });

            if (toBeAdded.length) {
                hasChanges = true;
                presentShiftSchedule.add(toBeAdded);
            }

            // modified
            presentShiftSchedule.each(schedule => {
                let nSchedule = shiftSchedule.getById(schedule.getId());

                if (nSchedule && schedule.modified) {
                    hasChanges = true;
                }
            });

            record.processSchedule();

            if (hasChanges) {
                // mark for dirty
                record.set('_ts', +(new Date()));
            }
        }
    }
});
