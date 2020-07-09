Ext.define('criterion.consts.Colors', function() {

    // check sync with
    // packages/criterion-theme-classic-default/sass/etc/all.scss
    // and
    // packages/criterion-theme-modern-ess/sass/etc/all.scss

    // base
    const WHITE = '#FFFFFF',
        B_GRAY = '#F9F9FD',
        LIGHT_GRAY = '#E5E8ED',
        GRAY = '#CED3DF',
        DARK_GRAY = '#909AB5',
        BLACK = '#343C4F',
        BLUE = '#0096EB',
        RED = '#FF2741';

    // additional
    const ORANGE = '#FF8D01';

    return {

        singleton : true,

        // base app colors

        WHITE : WHITE,
        B_GRAY : B_GRAY,
        LIGHT_GRAY : LIGHT_GRAY,
        GRAY : GRAY,
        DARK_GRAY : DARK_GRAY,
        BLACK : BLACK,
        BLUE : BLUE,
        RED : RED,

        // additional

        ORANGE : ORANGE,

        // classic specific

        // modern specific
        CHART_COLORS : ['#29CFCF', '#FF4975', '#FFB118', '#3765DC', '#954CF1', '#008C5A', '#43BBFF', '#FF8FF4', '#FFE350']

    }
});
