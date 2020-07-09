Ext.define('criterion.controller.settings.performanceReviews.ReviewTemplate', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_review_template',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.view.settings.performanceReviews.GroupsWeight',
            'Ext.tree.plugin.TreeViewDragDrop'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleModifyTemplateDetails : function() {
            var selectCompetencies,
                vm = this.getViewModel();

            selectCompetencies = Ext.create('criterion.view.MultiRecordPicker', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Competencies'),
                        gridColumns : [
                            {
                                xtype : 'criterion_codedatacolumn',
                                flex : 1,
                                text : i18n.gettext('Group'),
                                dataIndex : 'reviewCompetencyGroupCd',
                                codeDataId : criterion.consts.Dict.REVIEW_COMPETENCY_GROUP,
                                filterType : 'code_detail_field',
                                filterCfg : {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : criterion.consts.Dict.REVIEW_COMPETENCY_GROUP
                                }
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Competency Name'),
                                dataIndex : 'name',
                                flex : 1
                            }
                        ],
                        excludedIds : Ext.Array.map(vm.get('record.competencies').getRange(), function(item) {
                            return item.get('reviewCompetencyId');
                        })
                    },
                    stores : {
                        inputStore : vm.getStore('reviewCompetencies')
                    }
                }
            });

            selectCompetencies.show();
            selectCompetencies.on('selectRecords', this.selectCompetencies, this);

            this.setCorrectMaskZIndex(true);
        },

        selectCompetencies : function(searchRecords) {
            var vm = this.getViewModel(),
                store = vm.get('record.competencies'),
                groups = vm.get('record.weights'),
                reviewTemplateId = vm.get('record.id'),
                reviewTemplateCompetenciesTree = this.getStore('reviewTemplateCompetenciesTree'),
                group;

            this.setCorrectMaskZIndex(false);

            Ext.Array.each(searchRecords, function(record) {
                var reviewCompetencyId = record.getId(),
                    competencyGroupCd = record.get('reviewCompetencyGroupCd'),
                    competencyName = record.get('name'),
                    recs = store.queryRecords('competencyGroupCd', competencyGroupCd),
                    sequence = 1,
                    reviewCompetencyGroupNode,
                    addedRec;

                if (recs.length) {
                    sequence = recs[recs.length - 1].get('sequence') + 1;
                }

                addedRec = store.add({
                    reviewTemplateId : reviewTemplateId,
                    reviewCompetencyId : reviewCompetencyId,
                    competencyName : competencyName,
                    competencyGroupCd : competencyGroupCd,
                    sequence : sequence
                })[0];

                // delay for modification connected stores
                Ext.defer(function() {
                    // add to tree
                    reviewCompetencyGroupNode = reviewTemplateCompetenciesTree.getNodeById('g_' + competencyGroupCd);

                    if (!reviewCompetencyGroupNode) {
                        group = groups.getAt(groups.findExact('competencyGroupCd', competencyGroupCd));
                        reviewCompetencyGroupNode = reviewTemplateCompetenciesTree.getRootNode().appendChild({
                            id : 'g_' + competencyGroupCd,
                            name : group.get('competencyGroupDescription'),
                            competencyGroupCd : competencyGroupCd,
                            reviewCompetencyId : null,
                            connectedItemId : group.getId(),
                            leaf : false
                        });
                    }

                    reviewCompetencyGroupNode.appendChild({
                        id : competencyGroupCd + '_' + reviewCompetencyId,
                        name : competencyName,
                        competencyGroupCd : competencyGroupCd,
                        reviewCompetencyId : reviewCompetencyId,
                        leaf : true,
                        connectedItemId : addedRec.getId()
                    })

                }, 100)
            });

        },

        fillTree : function() {
            var vm = this.getViewModel(),
                store = vm.get('record.competencies'),
                groups = vm.get('record.weights'),
                reviewTemplateCompetenciesTree = this.getStore('reviewTemplateCompetenciesTree'),
                rootNode = reviewTemplateCompetenciesTree.getRootNode();

            Ext.Array.each(rootNode.childNodes, function(childNode) {
                rootNode.removeChild(childNode);
            });

            groups.each(function(group) {
                var competencyGroupCd = group.get('competencyGroupCd');

                reviewTemplateCompetenciesTree.getRootNode().appendChild({
                    id : 'g_' + competencyGroupCd,
                    name : group.get('competencyGroupDescription'),
                    competencyGroupCd : competencyGroupCd,
                    reviewCompetencyId : null,
                    connectedItemId : group.getId(),
                    leaf : false
                });
            });

            Ext.Array.each(store.getRange(), function(record) {
                var reviewCompetencyId = record.get('reviewCompetencyId'),
                    competencyGroupCd = record.get('competencyGroupCd'),
                    competencyName = record.get('competencyName'),
                    reviewCompetencyGroupNode;

                // add to tree
                reviewCompetencyGroupNode = reviewTemplateCompetenciesTree.getNodeById('g_' + competencyGroupCd);
                if (reviewCompetencyGroupNode) {
                    reviewCompetencyGroupNode.appendChild({
                        id : competencyGroupCd + '_' + reviewCompetencyId,
                        name : competencyName,
                        competencyGroupCd : competencyGroupCd,
                        reviewCompetencyId : reviewCompetencyId,
                        connectedItemId : record.getId(),
                        leaf : true
                    });
                } else {
                    console.error('Competency group with competencyGroupCd = ' + competencyGroupCd + ' not found!');
                }

            });

            reviewTemplateCompetenciesTree.getRootNode().expand(true);
        },

        getLastSequenceValueForCompetencyGroup : function() {
            var groups = this.getViewModel().get('record.weights');

            return groups.count() ? groups.last().get('sequence') : 0;
        },

        getLastSequenceValueForCompetencyInGroup : function(competencyGroupCd) {
            var vm = this.getViewModel(),
                filteredCompetencies = Ext.create('Ext.data.Store', {
                    model : 'criterion.model.reviewTemplate.Competency',
                    sorters : [
                        {
                            property : 'sequence',
                            direction : 'ASC'
                        }
                    ],
                    filters : [
                        {
                            property : 'competencyGroupCd',
                            value : competencyGroupCd
                        }
                    ]
                }),
                competencies = vm.get('record.competencies');

            competencies.cloneToStore(filteredCompetencies);

            return filteredCompetencies.count() ? filteredCompetencies.last().get('sequence') : 0;
        },

        handleDropCompetencyItem : function(node, data, overModel, dropPosition, dropFunction, eOpts) {
            var vm = this.getViewModel(),
                reviewCompetencies = vm.get('record.competencies'),
                groups = vm.get('record.weights'),
                replacedRecord = data['records'][0],
                placedRecord = overModel,
                replacedReviewCompetencyId = replacedRecord.get('reviewCompetencyId'),
                placedReviewCompetencyId = placedRecord.get('reviewCompetencyId'),
                isGroupReplace = !replacedReviewCompetencyId,
                itemsStore,
                replacedSequence,
                placedSequence;

            // don't allow place group into other group or competency on the group
            if (
                !replacedReviewCompetencyId && placedReviewCompetencyId ||
                replacedReviewCompetencyId && !placedReviewCompetencyId
            ) {
                return false;
            }

            // don't allow replace review competency into different group
            if (
                replacedReviewCompetencyId &&
                placedReviewCompetencyId &&
                (replacedRecord.get('competencyGroupCd') !== placedRecord.get('competencyGroupCd'))
            ) {
                return false;
            }

            itemsStore = isGroupReplace ? groups : reviewCompetencies;
            replacedSequence = itemsStore.getById(replacedRecord.get('connectedItemId')).get('sequence');
            placedSequence = itemsStore.getById(placedRecord.get('connectedItemId')).get('sequence');

            this.storeSequenceChange(
                itemsStore,
                isGroupReplace ? null : replacedRecord.get('competencyGroupCd'),
                replacedSequence,
                placedSequence,
                dropPosition
            );

            return true;
        },

        storeSequenceChange : function(store, filterParam, movingItemSequence, overItemSequence, dropPosition) {
            var records,
                tmpStore = Ext.create('Ext.data.Store'),
                start, end, index, changingRec;

            if (filterParam) {
                records = store.queryRecords('competencyGroupCd', filterParam);
            } else {
                records = store.getRange();
            }

            tmpStore.loadRecords(records);

            if (dropPosition === 'before') {
                // up
                if (movingItemSequence > overItemSequence) {
                    start = tmpStore.findExact('sequence', overItemSequence);
                    end = tmpStore.findExact('sequence', movingItemSequence);

                    for (index = start; index < end; index++) {
                        changingRec = store.getById(tmpStore.getAt(index).getId());
                        changingRec.set('sequence', changingRec.get('sequence') + 1);
                    }
                    store.getById(tmpStore.getAt(end).getId()).set('sequence', overItemSequence);
                }
                // down
                if (movingItemSequence < overItemSequence) {
                    start = tmpStore.findExact('sequence', movingItemSequence);
                    end = tmpStore.findExact('sequence', overItemSequence);

                    for (index = start + 1; index < end; index++) {
                        changingRec = store.getById(tmpStore.getAt(index).getId());
                        changingRec.set('sequence', changingRec.get('sequence') - 1);
                    }
                    store.getById(tmpStore.getAt(start).getId()).set('sequence', overItemSequence - 1);
                }
            } else {
                // up
                if (movingItemSequence > overItemSequence) {
                    start = tmpStore.findExact('sequence', overItemSequence);
                    end = tmpStore.findExact('sequence', movingItemSequence);

                    for (index = start + 1; index < end; index++) {
                        changingRec = store.getById(tmpStore.getAt(index).getId());
                        changingRec.set('sequence', changingRec.get('sequence') + 1);
                    }
                    store.getById(tmpStore.getAt(end).getId()).set('sequence', overItemSequence + 1);
                }

                // down
                if (movingItemSequence < overItemSequence) {
                    start = tmpStore.findExact('sequence', movingItemSequence);
                    end = tmpStore.findExact('sequence', overItemSequence);

                    for (index = start + 1; index <= end; index++) {
                        changingRec = store.getById(tmpStore.getAt(index).getId());
                        changingRec.set('sequence', changingRec.get('sequence') - 1);
                    }
                    store.getById(tmpStore.getAt(start).getId()).set('sequence', overItemSequence);
                }
            }
        },

        storeSequenceChangeAfterRemove : function(store, filterParam, removingItem) {
            var records,
                tmpStore = Ext.create('Ext.data.Store'),
                start, end, index,
                startSequence = removingItem.get('sequence'),
                changingRec;

            if (filterParam) {
                records = store.queryRecords('competencyGroupCd', filterParam);
            } else {
                records = store.getRange();
            }

            tmpStore.loadRecords(records);
            start = tmpStore.findExact('sequence', startSequence);
            end = tmpStore.count() - 1;

            for (index = start; index <= end; index++) {
                changingRec = store.getById(tmpStore.getAt(index).getId());
                changingRec.set('sequence', changingRec.get('sequence') - 1);
            }
        },

        handleAfterRecordLoad : function(record) {
            var vm = this.getViewModel(),
                me = this;

            this.callParent(arguments);

            // fill 0 values (old data without migrations)
            record.weights().each(function(weight) {
               Ext.defer(function() {
                   if (weight.get('sequence') === 0) {
                       weight.set('sequence', me.getLastSequenceValueForCompetencyGroup() + 1);
                   }
               }, 10)
            });
            record.competencies().each(function(competency) {
                Ext.defer(function() {
                    if (competency.get('sequence') === 0) {
                        competency.set('sequence', me.getLastSequenceValueForCompetencyInGroup(competency.get('competencyGroupCd')) + 1);
                    }
                }, 10)
            });

            record.weights().setSorters(
                {
                    property : 'sequence',
                    direction : 'ASC'
                }
            );

            record.competencies().setSorters(
                {
                    property : 'sequence',
                    direction : 'ASC'
                }
            );

            record.competencies().on('datachanged', me.handleReviewTemplateDetailsChange, me);

            Ext.promise.Promise.all([
                vm.getStore('reviewCompetencies').loadWithPromise(),
                vm.getStore('reviewScales').loadWithPromise()
            ]).then(function() {
                me.fillTree();
            });

        },

        handleManageGroups : function() {
            var manageWnd,
                vm = this.getViewModel();

            manageWnd = Ext.create('criterion.view.settings.performanceReviews.GroupsWeight', {
                viewModel : {
                    data : {
                        record : vm.get('record')
                    }
                }
            });

            manageWnd.show();
            manageWnd.on('destroy', function() {
                this.getViewModel().set('_recalculate', +new Date());
            }, this);

            this.setCorrectMaskZIndex(true);
        },

        handleReviewTemplateDetailsChange : function(store) {
            var me = this,
                vm = this.getViewModel(),
                weights = vm.get('record.weights'),
                reviewTemplateId = vm.get('record.id'),
                toRemove = [];

            // add new
            store.each(function(rec) {
                var competencyGroupCd = rec.get('competencyGroupCd'),
                    weight;

                weight = weights.findRecord('competencyGroupCd', competencyGroupCd, 0, false, false, true);

                if (!weight) {
                    weights.add({
                        reviewTemplateId : reviewTemplateId,
                        competencyGroupCd : competencyGroupCd,
                        weight : 0,
                        sequence : me.getLastSequenceValueForCompetencyGroup() + 1
                    })
                }
            });

            // remove deleted
            weights.each(function(weight) {
                var competencyGroupCd = weight.get('competencyGroupCd'),
                    rec;

                rec = store.findRecord('competencyGroupCd', competencyGroupCd, 0, false, false, true);

                if (!rec) {
                    toRemove.push(weight);
                }
            });

            Ext.Array.each(toRemove, function(rrec) {
                me.storeSequenceChangeAfterRemove(weights, null, rrec);
                weights.remove(rrec);
            });

            vm.set('_recalculate', +new Date());
        },

        handleRemoveCompetency : function(rec) {
            var vm = this.getViewModel(),
                store = vm.get('record.competencies'),
                parent,
                removingRec;

            removingRec = store.findRecord('reviewCompetencyId', rec.get('reviewCompetencyId'), 0, false, false, true);
            this.storeSequenceChangeAfterRemove(store, rec.get('competencyGroupCd'), removingRec);
            store.remove(removingRec);

            parent = rec.parentNode;
            rec.remove();
            // if last - remove parent
            if (!parent.childNodes.length) {
                parent.remove();
            }
        },

        handleRecordUpdate : function(record) {
            this.getViewModel().set('blockedState', true);
            this.callParent(arguments);
        },

        onAfterSave : function(view, record) {
            this.getViewModel().set('blockedState', false);
            this.callParent(arguments);
        },

        onFailureSave : function(record, operation) {
            this.getViewModel().set('blockedState', false);
            this.callParent(arguments);
        }
    };

});
