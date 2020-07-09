Ext.define('criterion.overrides.util.GroupCollection', {
    override: 'Ext.util.GroupCollection',
    
    privates: {
        checkRemoveQueue: function() {
            var me = this,
                emptyGroups = me.emptyGroups,
                groupKey, group, reschedule;

            for (groupKey in emptyGroups) {
                group = emptyGroups[groupKey];

                // If the group's retain time has expired, destroy it.
                if (group.ejectTime && (!group.getCount() && Ext.now() - group.ejectTime > me.emptyGroupRetainTime)) { // <- changed
                    // group.ejectTime && ... When group will be reused, it's ejectTime set to null, but number - null is number so add check for
                    // unset ejectTime to prevent destroy group to which items will be added right after that with crash
                    Ext.destroy(group);
                    delete emptyGroups[groupKey];
                } else {
                    reschedule = true;
                }
            }

            // Still some to remove in the future. Check back in emptyGroupRetainTime
            if (reschedule) {
                Ext.undefer(me.checkRemoveQueueTimer);
                me.checkRemoveQueueTimer = Ext.defer(me.checkRemoveQueue, me.emptyGroupRetainTime, me);
            }
        }

    }
});
