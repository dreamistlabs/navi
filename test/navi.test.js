var assert = chai.assert;
var expect = chai.expect;

function generateElements(type, className, parentContainer) {
  var parent = document.getElementsByClassName(parentContainer)[0];
  var el = type === 'section' ? 'section' : 'li';
  var collection = [];

  for (var i = 0; i < 7; i++) {
    var element = document.createElement(el);

    element.classList.add(className);
    parent.appendChild(element);
  }
}
function removeElements(className) {
  var items = document.getElementsByClassName(className);
  for (var i = items.length; i--;) {
    items[i].remove();
  }
}

describe('Navi', function() {
  var defaultActiveTickClass = 'navi--current';
  var defaultTickClass       = 'navi-item';
  var defaultSectionClass    = 'navi-section';

  var acceptableKeys = ['start', 'finish'];

  describe('checks if jquery is loaded', function() {
    before(function() {
      window.jQuery = null;
    });

    it('and throws an error if it isn\'t', function() {
      expect(function() {
        new Navi();
      }).to.throw(Error, 'Missing Library');
    });

    after(function() {
      window.jQuery = $;
    });
  });

  describe('Properties', function() {
    describe('with no options argument', function() {
      var navi;

      before(function() {
        generateElements('indicators', defaultTickClass, 'navi-list');
        generateElements('section', defaultSectionClass, 'main');
        navi = new Navi();
      });

      it('has activeTickClass default to ' + defaultActiveTickClass, function() {
        assert.strictEqual(navi.activeTickClass, defaultActiveTickClass);
      });
      it('has animationName default to null', function() {
        assert.strictEqual(navi.animationName, null);
      });
      it('has customAnimation default to null', function() {
        assert.strictEqual(navi.customAnimation, null);
      });
      it('has sectionClass default to ' + defaultSectionClass, function() {
        assert.strictEqual(navi.sectionClass, defaultSectionClass);
      });
      it('has tickClass default to ' + defaultTickClass, function() {
        assert.strictEqual(navi.tickClass, defaultTickClass);
      });
      it('the collection of navi ticks should not be empty', function() {
        assert.notStrictEqual(navi.tickCollection.length, 0);
      });
      it('the collection of navi sections collection should not be empty', function() {
        assert.notStrictEqual(navi.sectionCollection.length, 0);
      });
      it('the collection of navi section start positions should not be empty', function() {
        assert.notStrictEqual(navi.sectionStartPositions.length, 0);
      });
      it('the collection of navi section heights should not be empty', function() {
        assert.notStrictEqual(navi.sectionHeights.length, 0);
      });

      after(function() {
        removeElements(defaultTickClass);
        removeElements(defaultSectionClass);
      });
    });

    describe('with options argument containing properties that exist in the DOM', function() {
      var customActiveTickClass = 'custom-tick--current';
      var customAnimationName   = 'custom-animation';
      var customTickClass       = 'custom-item';
      var customSectionClass    = 'custom-section';

      before(function() {
        generateElements('section', customSectionClass, 'main');
        generateElements('indicators', customTickClass, 'navi-list');
        navi = new Navi({
          activeTickClass: customActiveTickClass,
          animationName: customAnimationName,
          customAnimation: {
            start: {},
            finish: {}
          },
          ticks: customTickClass,
          sections: customSectionClass
        });
      });

      it('the activeTickClass property should equal the given custom class: ' + customActiveTickClass, function() {
        assert.strictEqual(navi.activeTickClass, customActiveTickClass);
      });
      it('the animationName property should equal the given custom class: ' + customAnimationName, function() {
        assert.strictEqual(navi.animationName, customAnimationName);
      });
      it('the tickClass property should equal the given custom class: ' + customTickClass, function() {
        assert.strictEqual(navi.tickClass, customTickClass);
      });
      it('the tickCollection property should not be empty', function() {
        assert.notStrictEqual(navi.tickCollection.length, 0);
      });
      it('the sectionClass property should equal the given custom class: ' + customSectionClass, function() {
        assert.strictEqual(navi.sectionClass, customSectionClass);
      });
      it('the sectionCollection should not be empty', function() {
        assert.notStrictEqual(navi.sectionCollection.length, 0);
      });
      it('the sectionStartPositions property should not be empty', function() {
        assert.notStrictEqual(navi.sectionStartPositions.length, 0);
      });
      it('the sectionHeights should not be empty', function() {
        assert.notStrictEqual(navi.sectionHeights.length, 0);
      });
      describe('and a valid customAnimation property', function() {
        it('should include a "' + acceptableKeys[0] + '" property/key', function() {
          expect(Object.keys(navi['customAnimation'])).to.include(acceptableKeys[0]);
        });
        it('should include a "' + acceptableKeys[1] + '" property/key', function() {
          expect(Object.keys(navi['customAnimation'])).to.include(acceptableKeys[1]);
        });
      });

      after(function() {
        removeElements(customTickClass);
        removeElements(customSectionClass);
      });
    });
  });

  describe('with options argument containing properties that DO NOT exist in the DOM', function() {
    var customTickClass       = 'invalid-item';
    var customSectionClass    = 'invalid-section';

    before(function() {
      generateElements('section', defaultSectionClass, 'main');
      generateElements('indicators', defaultTickClass, 'navi-list');
    });

    describe('given a custom tick class, ' + customTickClass + ', if the tickCollection property is empty', function() {
      it('throws a Missing Collection error', function() {
        var regex = new RegExp('\\bMissing Collection\\b.*\\b' + customTickClass + '\\b');
        expect(function() {
          navi = new Navi({
            ticks: customTickClass
          });
        }).to.throw(Error, regex);
      });
    });
    describe('given a custom section class, ' + customTickClass + ', if the sectionCollection property is empty', function() {
      it('throws a Missing Collection error', function() {
        var regex = new RegExp('\\bMissing Collection\\b.*\\b' + customSectionClass + '\\b');
      expect(function() {
        navi = new Navi({
          sections: customSectionClass
        });
      }).to.throw(Error, regex);
      });
    });

    after(function() {
      removeElements(defaultTickClass);
      removeElements(defaultSectionClass);
    });
  });

  describe('Behavior', function() {
    describe('when browser window is scrolled to a navi section', function() {
      var index = Math.floor(Math.random() * 7);

      before(async function() {
        generateElements('section', defaultSectionClass, 'main');
        generateElements('indicators', defaultTickClass, 'navi-list');
        navi = await new Navi();
        var sectionStartPosition = await navi.sectionStartPositions[index];
        await window.scrollTo(0, sectionStartPosition);
      });

      it('the corresponding nav indicator should have the active tick class', async function() {
        const ticks = await document.getElementsByClassName(defaultTickClass);
        assert.isTrue(ticks[index].classList.contains(defaultActiveTickClass));
      });

      it('only one nav indicator should have the active tick class', async function() {
        const ticks = await document.getElementsByClassName(defaultTickClass);
        const results = await Array.from(ticks).filter(function(tick) {
          return tick.classList.contains(defaultActiveTickClass);
        });
        assert.strictEqual(results.length, 1, 'Only one indicator should have the active class');
      });
    });
  });

  describe('Error Handling', function() {
    it('throws an error if options argument isn\'t an object', function() {
      expect(function() {
        new Navi(50)
      }).to.throw(TypeError, 'must be an object');
    });
    it('throws an error if the customAnimation property\'s value isn\'t an object', function() {
      expect(function() {
        new Navi({ customAnimation: 'notAnObject' });
      }).to.throw(TypeError, 'must be an object');
    });
    it('throws an error if the customAnimation property\'s keys don\'t include: ' + acceptableKeys[0] + ', ' + acceptableKeys[1], function() {
      expect(function() {
        new Navi({ customAnimation: { notStart: {}, notFinish: {}} });
      }).to.throw(TypeError, 'must be an object');
    });
  });
});
