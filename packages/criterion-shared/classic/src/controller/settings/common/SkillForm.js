Ext.define('criterion.controller.settings.common.SkillForm', function() {

    return {
        alias : 'controller.criterion_settings_common_skill_form',

        extend : 'criterion.controller.FormView',

        handleCategoryChange : function(combo, newVal) {
            var skillStore = this.lookupReference('skillCombo').getStore();
            skillStore.clearFilter();
            skillStore.setFilters([
                {
                    property : 'skillCategoryCd',
                    value : newVal
                }
            ]);
        }
    }
});
