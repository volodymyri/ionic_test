/**
 * @class criterion.ux.calendar.template.DayHeader
 * @extends Ext.XTemplate
 * <p>This is the template used to render the all-day event container used in {@link criterion.ux.calendar.DayView DayView} and
 * {@link criterion.ux.calendar.WeekView WeekView}. Internally the majority of the layout logic is deferred to an instance of
 * {@link criterion.ux.calendar.BoxLayoutTemplate}.</p>
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link criterion.ux.calendar.EventRecord}.</p>
 * <p>Note that this template would not normally be used directly. Instead you would use the {@link criterion.ux.calendar.DayViewTemplate}
 * that internally creates an instance of this template along with a {@link criterion.ux.calendar.DayBodyTemplate}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('criterion.ux.calendar.template.DayHeader', {
    extend: 'Ext.XTemplate',
    
    requires: ['criterion.ux.calendar.template.BoxLayout'],
    
    constructor: function(config){
        
        Ext.apply(this, config);
        
        this.allDayTpl = new criterion.ux.calendar.template.BoxLayout(config);
        this.allDayTpl.compile();
        
        this.callParent([
            '<div class="ext-cal-hd-ct">',
                '<table class="ext-cal-hd-days-tbl" cellspacing="0" cellpadding="0">',
                    '<tbody>',
                        '<tr>',
                            '<td class="ext-cal-gutter"></td>',
                            '<td class="ext-cal-hd-days-td"><div class="ext-cal-hd-ad-inner">{allDayTpl}</div></td>',
                            '<td class="ext-cal-gutter-rt"></td>',
                        '</tr>',
                    '</tobdy>',
                '</table>',
            '</div>'
        ]);
    },

    applyTemplate : function(o){
        return this.applyOut({
            allDayTpl: this.allDayTpl.apply(o)
        }, []).join('');
    },
    
    apply: function(values) {
        return this.applyTemplate.apply(this, arguments);
    }
});