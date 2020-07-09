Ext.define('criterion.view.employee.timesheet.IncomeCombo', {

    extend : 'Ext.form.field.ComboBox',

    alias : 'widget.criterion_employee_timesheet_income_combo',

    displayField : 'name',
    valueField : 'id',
    queryMode : 'local',
    editable : false,
    forceSelection : true,
    valueNotFoundText : i18n.gettext('Not found'),

    tpl : Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item {[values.isFirstInGroup ? "combo-group-wrapper" : ""]}">',
            '{name}',
        '</li>',
        '</tpl></ul>'
    )
});