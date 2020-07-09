Ext.define('criterion.ux.form.field.ToggleSlide', {

    extend : 'Ext.form.field.Checkbox',
    alias : 'widget.toggleslidefield',

    cls : 'criterion-toggle',
    boxLabelAlign : 'before',
    afterBoxLabelTpl : ['<div class="toggler"></div>'],

    // not need
    appendRequiredMark(cfg) {
    }

});
