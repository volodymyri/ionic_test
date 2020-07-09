Ext.define('criterion.controller.scheduling.ShiftGroup', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_scheduling_shift_group',

        requires : [
            'criterion.view.scheduling.shiftGroup.Requirements',
            'criterion.store.employer.Certifications'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        loadRecord(record) {
            let vm = this.getViewModel(),
                view = this.getView(),
                skills = vm.get('skills'),
                certifications = vm.get('certifications');

            view.setLoading(true);

            record.shifts().each(shift => shift.processSchedule());

            Ext.promise.Promise.all(Ext.Array.clean([
                !skills.isLoaded() && skills.loadWithPromise(),
                !certifications.isLoaded() && certifications.loadWithPromise()
            ])).then(_ => {
                view.setLoading(false);
            })
        },

        handleChangeLocation(cmp, val) {
            let vm = this.getViewModel(),
                employerWorkLocations = vm.get('employerWorkLocations'),
                employerWorkLocation = val && employerWorkLocations.getById(val),
                timezoneCd = employerWorkLocation && employerWorkLocation.getWorkLocation().get('timezoneCd');

            vm.set('timezoneCd', timezoneCd);
        },

        handleGroupSettings() {
            let picker,
                me = this,
                vm = this.getViewModel(),
                record = vm.get('record'),
                employerId = record.get('employerId'),
                positions = [],
                positionIds = [],
                skillIds = [],
                certificationIds = [],
                certificationsFiltered = Ext.create('criterion.store.employer.Certifications', {
                    filters : [
                        {
                            property : 'employerId',
                            value : employerId,
                            exactMatch : true
                        }
                    ]
                });

            vm.get('certifications').cloneToStore(certificationsFiltered);

            record.positions().each(position => {
                let positionId = position.get('positionId');

                positions.push({
                    id : positionId,
                    text : position.get('title')
                });
                positionIds.push(positionId);
            });

            record.skills().each(skill => {
                skillIds.push(skill.get('skillId'));
            });

            record.certifications().each(certification => {
                certificationIds.push(certification.get('certificationId'))
            });

            picker = Ext.create('criterion.view.scheduling.shiftGroup.Requirements', {
                viewModel : {
                    data : {
                        employerId : employerId,
                        positionIds : positionIds,
                        skillIds : skillIds,
                        certificationIds : certificationIds,

                        skills : vm.get('skills'),
                        certifications : certificationsFiltered
                    },

                    stores : {
                        presentPositions : {
                            type : 'store',
                            proxy : {
                                type : 'memory'
                            },
                            fields : [
                                {
                                    name : 'id',
                                    type : 'integer'
                                },
                                {
                                    name : 'text',
                                    type : 'string'
                                }
                            ],
                            data : positions
                        }
                    }
                }
            });

            picker.show();

            picker.on({
                cancel : _ => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                changeState : (view, data) => {
                    me.setCorrectMaskZIndex(false);
                    me.changeGroupSettings(data, record);
                    picker.destroy();
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        changeGroupSettings(config, record) {
            let {positionIds, skillIds, certificationIds, positions} = config,
                shiftGroupId = record.getId();

            this.syncValuesStore(positionIds, record.positions(), 'positionId', shiftGroupId, positions);
            this.syncValuesStore(skillIds, record.skills(), 'skillId', shiftGroupId);
            this.syncValuesStore(certificationIds, record.certifications(), 'certificationId', shiftGroupId);
        },

        syncValuesStore(selectedValues, valuesStore, linkField, shiftGroupId, dataStore) {
            let forRemove = [],
                presentValues = [],
                newValues;

            valuesStore.each(rec => {
                if (Ext.Array.indexOf(selectedValues, rec.get(linkField)) !== -1) {
                    presentValues.push(rec.get(linkField));
                } else {
                    forRemove.push(rec);
                }
            });

            if (forRemove.length) {
                valuesStore.remove(forRemove);
            }

            newValues = Ext.Array.difference(selectedValues, presentValues);

            if (newValues.length) {
                Ext.Array.each(newValues, selectedRecordId => {
                    let value = {
                        shiftGroupId : shiftGroupId
                    };

                    value[linkField] = selectedRecordId;

                    if (dataStore) {
                        value['title'] = dataStore.getById(selectedRecordId).get('text')
                    }

                    valuesStore.add(value);
                });
            }
        },

        handleRecordUpdate(record) {
            this.getViewModel().set('blockedState', true);
            this.callParent(arguments);
        },

        onAfterSave(view, record) {
            this.getViewModel().set('blockedState', false);
            this.callParent(arguments);
        }
    }
});
