/**!
 * Copyright (c) 2018 Dreamist Labs, Johnny Hu
 * License: MIT
 **/

// TODO: allow users to user data- attributes?

class Navi {
  constructor(opts = {}) {
    this.jqueryCheck(),
    this.optionsCheck(opts),
    this.opts                   = opts,
    this.activeTickClass        = this.opts['activeTickClass'] || 'navi--current',
    this.animationName          = this.opts['animationName']   || null,
    this.customAnimation        = this.opts['customAnimation'] || null,
    this.endingValue            = this.opts['endingValue']     || 50,
    this.startingValue          = this.opts['startingValue']   || 0,
    this.sectionClass           = this.opts['sections']        || 'navi-section',
    this.tickClass              = this.opts['ticks']           || 'navi-item',

    this.tickCollection         = this.getCollection(this.tickClass);
    this.sectionCollection      = this.getCollection(this.sectionClass);

    this.sectionStartPositions  = this.sectionCollection.map((i, section) => $( section ).offset().top ),
    this.sectionHeights         = this.sectionCollection.map((i, section) => $( section ).outerHeight());
    this.executeScript();
  }

  /*
   * Check if jQuery is present.
   */
  jqueryCheck() {
    if (!window.jQuery) {
      throw new Error('Missing Library! In order for Navi to work, you need jQuery');
    }
  }

  /*
   * Validate the data type of various properties passed into the options argument.
   */
  optionsCheck(options) {
    if (!(options instanceof Object)) {
      throw new TypeError('Type Error! The options argument must be an object');
    }
    if (options['animation'] && !(options['animation'] instanceof String)) {
      throw new TypeError('Type Error! The animation property must be an string');
    }
    if (options['customAnimation']) {
      if(!(options['customAnimation'] instanceof Object)) {
        throw new TypeError('Type Error! The customAnimation property must be an object');
      } else {
        const keys = Object.keys(options['customAnimation']);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== 'start' && keys[i] !== 'finish') {
            throw new ReferenceError('Unrecognized Key! ' + keys[i] + ' is not a valid customAnimation key. Did you mean "start" or "finish"?');
          }
        }
      }
    }
  }

  /*!
   * Collect elements with the given class name. Throw an error if the collection comes back empty.
   */
  getCollection(name) {
    var className = '.' + name;
    if ( $( className ).length === 0 ) {
      throw new Error('Missing Collection! Navi was unable to collect elements with class ' + name );
    } else {
      return $( className );
    }
  }

  executeScript() {
    let windowPosition = window.pageYOffset;

    $( document ).ready(() => {
      this.setActiveTick(windowPosition);
    });

    $( document ).scroll(() => {
      windowPosition = window.pageYOffset;
      this.setActiveTick(windowPosition);
    });
  }

  setActiveTick(scrollPosition) {
    for (let i = 0; i < this.sectionStartPositions.length; i++) {
      const sectionStart = this.sectionStartPositions[i];
      const sectionHeight = this.sectionHeights[i];
      const nextSectionStart = this.sectionStartPositions[i+1] || sectionStart + sectionHeight;
      const sectionIsActive = sectionStart <= scrollPosition && scrollPosition < nextSectionStart;

      if (sectionIsActive) {
        const correspondingTickElement = $( this.tickCollection[i] );
        if( !correspondingTickElement.hasClass(this.activeTickClass) ) {
          this.tickCollection.removeClass(this.activeTickClass);
          correspondingTickElement.addClass(this.activeTickClass);
          break;
        }
      }
    }
  }

  initialize() {
    if (false) {
      const startEndValueRange = this.endingValue - this.startingValue;
      const percentageOfDistanceScrolled = (scrollPosition - this.sectionStartPositions[i]) / sectionHeight;

     // change border radius
      const radius =  this.startingValue + startEndValueRange * percentageOfDistanceScrolled;
      $( el ).css('border-radius', radius + '%');
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
  }
}

// module.exports = Navi;
