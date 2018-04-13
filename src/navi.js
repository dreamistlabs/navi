/**!
 * Copyright (c) 2018 Dreamist Labs, Johnny Hu
 * License: MIT
 **/

// TODO: allow users to user data- attributes?
// TODO: incorporate custom animations?
// TODO: fix test that applies activeTickClass on load

export class Navi {
  constructor(opts = {}) {
    this.optionsCheck(opts),
      this.opts = opts,
      this.activeTickClass = this.opts['activeTickClass'] || 'navi--current',
      this.animationName = this.opts['animationName'] || null,
      this.customAnimation = this.opts['customAnimation'] || null,
      this.listClass = this.opts['listClass'] || 'navi-list',
      this.sectionClass = this.opts['sectionClass'] || 'navi-section',
      this.tickClass = this.opts['tickClass'] || 'navi-item',

      this.tickCollection = this.getCollection(this.tickClass);
    this.sectionCollection = this.getCollection(this.sectionClass);

    this.sectionStartPositions = Array.from(this.sectionCollection).map((section, i) => section.offsetTop);
    this.sectionHeights = Array.from(this.sectionCollection).map((section, i) => section.offsetHeight);
    this.executeScript();
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
    // if (options['customAnimation']) {
    //   if(!(options['customAnimation'] instanceof Object)) {
    //     throw new TypeError('Type Error! The customAnimation property must be an object');
    //   } else {
    //     const keys = Object.keys(options['customAnimation']);
    //     for (let i = 0; i < keys.length; i++) {
    //       if (keys[i] !== 'border-radius' && keys[i] !== 'background-color') {
    //         throw new ReferenceError('Unrecognized Key! ' + keys[i] + ' is not a valid customAnimation key. Did you mean "start" or "finish"?');
    //       }
    //     }
    //   }
    // }
  }

  /*!
   * Collect elements with the given class name. Throw an error if the collection comes back empty.
   */
  getCollection(name) {
    const collection = document.getElementsByClassName(name);

    if (collection.length === 0) {
      throw new Error('Missing Collection! Navi was unable to collect elements with class ' + name);
    } else {
      return collection;
    }
  }

  executeScript() {
    if (!document.querySelector('.' + this.listClass)) {
      throw new Error('Element Not Found! Navi was unable to find an element with class ' + this.listClass);
    }

    document.addEventListener('DCMContentLoaded', function () {
      this.setActiveTick();
    }.bind(this));

    document.addEventListener('scroll', function () {
      this.setActiveTick();
    }.bind(this));

    if (this.animationName) {
      document.getElementsByClassName(this.listClass)[0].classList.add(this.animationName);
    }
  }

  setActiveTick() {
    const scrollPosition = window.pageYOffset;
    
    for (let i = 0; i < this.sectionStartPositions.length; i++) {
      const sectionStart      = this.sectionStartPositions[i],
            sectionHeight     = this.sectionHeights[i],
            nextSectionStart  = this.sectionStartPositions[i + 1] || sectionStart + sectionHeight,
            sectionIsActive   = sectionStart <= scrollPosition && scrollPosition < nextSectionStart,
            startingValue = 0,
            endingValue   = 50,
            correspondingTickElement = this.tickCollection[i];

      if (sectionIsActive) {
        // need a way to properly calculate the last navi section if
        // it's the last section on the page because then the bottom
        // of the section will never reach the top of the page/window.
        const portionOfSectionScrolled = (scrollPosition - sectionStart) / sectionHeight;

        /*!
         * Add active tick class.
         */
        if (!correspondingTickElement.classList.contains(this.activeTickClass)) {
          for (let i = 0; i < this.tickCollection.length; i++) {
            this.tickCollection[i].classList.remove(this.activeTickClass);
          }
          correspondingTickElement.classList.add(this.activeTickClass);
        }

        // execute animation on current nav tick
        console.log(correspondingTickElement);
        if (this.animationName) {
          const startEndValueRange = endingValue - startingValue,
          radius =  startingValue + startEndValueRange * portionOfSectionScrolled;
          correspondingTickElement.setAttribute('style', `border-radius: ${radius}%`);
        }
      }
      
      if (this.animationName && correspondingTickElement) {
        // ensures that the starting and ending radius values are
        // properly set when scrolling out of a section in cases
        // where a user might scroll faster than the script can keep up.
        if (!sectionIsActive && scrollPosition < sectionStart) {
          console.log(correspondingTickElement);
          correspondingTickElement.setAttribute('style', `border-radius: ${startingValue}%`);
        }
        if (!sectionIsActive && scrollPosition > nextSectionStart) {
          correspondingTickElement.setAttribute('style', `border-radius: ${endingValue}%`);
        }
      }
    }
  }
  // executeCustomAnimation(customData, multiplier) {
  //   console.log('yay if!', multiplier);
  //   for (var prop in customData) {
  //     console.log(prop, customData[prop]);
  //     customData[prop].map(function(value) {
  //       // console.log(value.match(/(\D)/));
  //       // console.log(parseInt(value));
  //     })

  //   }
}