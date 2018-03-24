class Navi {
  constructor(opts = {}) {
    this.jqueryCheck(),
    this.opts = opts,
    this.currentTickClass = 'navi--current',
    this.endingValue = this.opts.endingValue || 50,
    this.startingValue = this.opts.startingValue || 0,
    this.tickCollection = $( '.navi-item' ),
    this.sections = $( '.navi-section' ),
    this.sectionStartPositions = this.sections.map((i, section) => $( section ).offset().top ),
    this.sectionHeights = this.sections.map((i, section) => $( section ).outerHeight()),
    this.executeScript();
  }

  jqueryCheck() {
    if (!window.jQuery) {
      throw new Error('Missing Library! In order for Navi to work, you need jQuery.');
    }
  }

  executeScript() {
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

           // change border radius
            const radius =  this.startingValue + (this.endingValue - this.startingValue) * ((scrollPosition - this.sectionStartPositions[i] )  / sectionHeight);
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

// module.exports = Navi;
