class Navi {
  constructor(opts = {}) {
    this.jqueryCheck(),
    this.optionsCheck(opts),
    this.opts                   = opts,
    this.currentTickClass       = 'navi--current',
    this.endingValue            = this.opts['endingValue']   || 50,
    this.startingValue          = this.opts['startingValue'] || 0;
    this.tickClass              = this.opts['ticks']         || 'navi-item',
    this.sectionClass           = this.opts['sections']      || 'navi-section',

    this.tickCollection         = this.getCollection(this.tickClass);
    this.sectionCollection      = this.getCollection(this.sectionClass);

    this.sectionStartPositions  = this.sectionCollection.map((i, section) => $( section ).offset().top ),
    this.sectionHeights         = this.sectionCollection.map((i, section) => $( section ).outerHeight());
    this.executeScript();
  }

  jqueryCheck() {
    if (!window.jQuery) {
      throw new Error('Missing Library! In order for Navi to work, you need jQuery');
    }
  }

  optionsCheck(options) {
    if (!(options instanceof Object)) {
      throw new TypeError('Type Error! Argument must be an object');
    }
  }

  getCollection(name) {
    var className = '.' + name;
    if ( $( className ).length === 0 ) {
      throw new Error('Missing Collection! Navi was unable to collect elements with class ' + name );
    } else {
      return $( className );
    }
  }

  executeScript() {

    // need to figure out how to set active class on load. keep it dry!

    $( document ).scroll(() => {
      const scrollPosition = $( window ).scrollTop();

      this.tickCollection.each((i, el) => {
          const sectionStart = this.sectionStartPositions[i],
                sectionHeight = this.sectionHeights[i],
                nextSectionStart = sectionStart + sectionHeight,
                inCurrentSection = sectionStart <= scrollPosition && scrollPosition < nextSectionStart,
                tickShouldBeActive = inCurrentSection && !$( el ).hasClass(this.currentTickClass),
                tickShouldntHaveClass = !inCurrentSection && $( el ).hasClass(this.currentTickClass);

          // console.log(
          //   'idx:', idx,
          //   'isCurrent:', inCurrentSection
          // );

          if (inCurrentSection) {
            // console.log(
            //   'currentStart:', sectionStart,
            //   'scrollPos:', scrollPosition,
            //   'nextStart:', nextSectionStart
            // );
            const startEndValueRange = this.endingValue - this.startingValue;
            const percentageOfDistanceScrolled = (scrollPosition - this.sectionStartPositions[i]) / sectionHeight;

           // change border radius
            const radius =  this.startingValue + startEndValueRange * percentageOfDistanceScrolled;
            $( el ).css('border-radius', radius + '%');
          }

          // add and remove active tick class
          if (tickShouldBeActive) {
            $( el ).addClass(this.currentTickClass);
          } else if (tickShouldntHaveClass) {
            $( el ).removeClass(this.currentTickClass);
          }

          // ensures that the starting and ending radius values are
          // properly set when scrolling out of a section in cases
          // where a user might scroll faster than the script can keep up.
          if (!inCurrentSection && scrollPosition < sectionStart) {
            $( el ).css('border-radius', this.startingValue+'%');
          }
          if (!inCurrentSection && scrollPosition > nextSectionStart) {
            $( el ).css('border-radius', this.endingValue+'%');
          }

      });
    });
  }
}

module.exports = Navi;
