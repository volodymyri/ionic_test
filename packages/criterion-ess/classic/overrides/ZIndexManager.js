// Part of solution D2-8. "!Ext.supports.Touch" check added to allow mask scrolling on mobile device
Ext.define('criterion.overrides.ZIndexManager', {

    override : 'Ext.ZIndexManager',

    privates : {
        onMaskMousedown : function(e) {
            // Focus frontmost modal, do not allow mousedown to focus mask.
            if (!Ext.supports.Touch && this.topModal) {
                this.topModal.focus();
                e.preventDefault();
            }
        }
    }
});