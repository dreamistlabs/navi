var assert = chai.assert;
var expect = chai.expect;

function generateElements(type, className, parentContainer) {
  if (type === 'section') {
    var el = 'section';    
    var parent = document.querySelector(parentContainer);
  } else {
    var el = 'li';
    var container = document.querySelector('.navi-nav');
    var parent = document.createElement('ul');
    parent.classList.add(parentContainer);
    container.appendChild(parent);
  }
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
  var defaultListClass       = 'navi-list';
  var defaultSectionClass    = 'navi-section';
  var defaultTickClass       = 'navi-item';

  describe('Properties', function() {
    describe('with no options argument', function() {
      var navi;

      before(function() {
        generateElements('section', defaultSectionClass, 'main');
        generateElements('indicators', defaultTickClass, defaultListClass);
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
      it('has listClass default to ' + defaultListClass, function() {
        assert.strictEqual(navi.listClass, defaultListClass);
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
        removeElements(defaultListClass);
        removeElements(defaultSectionClass);
      });
    });

    describe('with options argument containing properties that exist in the DOM', function() {
      var customActiveTickClass = 'custom-tick--current';
      var customAnimationName   = 'custom--animation';
      var customListClass       = 'custom-list';
      var customSectionClass    = 'custom-section';
      var customTickClass       = 'custom-item';

      before(function() {
        generateElements('section', customSectionClass, 'main');
        generateElements('indicators', customTickClass, customListClass);
        navi = new Navi({
          activeTickClass: customActiveTickClass,
          animationName: customAnimationName,
          listClass: customListClass,
          sectionClass: customSectionClass,
          tickClass: customTickClass
        });
      });

      it('the activeTickClass property should equal the given custom class: ' + customActiveTickClass, function() {
        assert.strictEqual(navi.activeTickClass, customActiveTickClass);
      });
      it('the animationName property should equal the given custom class: ' + customAnimationName, function() {
        assert.strictEqual(navi.animationName, customAnimationName);
      });
      it('the animationName should be applied to the list element', function() {
        let listElement = document.getElementsByClassName(navi.listClass)[0];
        assert.isTrue(listElement.classList.contains(navi.animationName), `${listElement.classList} should include ${navi.animationName}`);
      });
      it('the listClass property should equal the given custom class: ' + customListClass, function() {
        assert.strictEqual(navi.listClass, customListClass);
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
      it('the tickClass property should equal the given custom class: ' + customTickClass, function() {
        assert.strictEqual(navi.tickClass, customTickClass);
      });
      it('the tickCollection property should not be empty', function() {
        assert.notStrictEqual(navi.tickCollection.length, 0);
      });

      after(function() {
        removeElements(customListClass);
        removeElements(customSectionClass);
      });
    });
  });

  describe('with options argument containing properties that DO NOT exist in the DOM', function() {
    var customListClass       = 'invalid-list';
    var customSectionClass    = 'invalid-section';
    var customTickClass       = 'invalid-item';

    before(function() {
      generateElements('section', defaultSectionClass, 'main');
      generateElements('indicators', defaultTickClass, 'navi-list');
    });

    describe('given a custom list class, ' + customListClass + ', if the element doesn\'t exist', function() {
      it('throws an Element Not Found error', function() {
        var regex = new RegExp('\\bElement Not Found\\b.*\\b' + customListClass + '\\b');
        expect(function() {
          navi = new Navi({
            listClass: customListClass
          });
        }).to.throw(Error, regex);
      });
    });
    describe('given a custom tick class, ' + customTickClass + ', if the tickCollection property is empty', function() {
      it('throws a Missing Collection error', function() {
        var regex = new RegExp('\\bMissing Collection\\b.*\\b' + customTickClass + '\\b');
        expect(function() {
          navi = new Navi({
            tickClass: customTickClass
          });
        }).to.throw(Error, regex);
      });
    });
    describe('given a custom section class, ' + customTickClass + ', if the sectionCollection property is empty', function() {
      it('throws a Missing Collection error', function() {
        var regex = new RegExp('\\bMissing Collection\\b.*\\b' + customSectionClass + '\\b');
      expect(function() {
        navi = new Navi({
          sectionClass: customSectionClass
        });
      }).to.throw(Error, regex);
      });
    });

    after(function() {
      removeElements(defaultListClass);
      removeElements(defaultSectionClass);
    });
  });

  describe('Behavior', function() {
    var customAnimationName   = 'custom--animation';

    describe('when browser window is scrolled to a navi section', function() {
      var index = Math.floor(Math.random() * 7);

      before(async function() {
        generateElements('section', defaultSectionClass, 'main');
        generateElements('indicators', defaultTickClass, 'navi-list');
        navi = await new Navi({
          animationName: customAnimationName
        });
        var sectionStartPosition = await navi.sectionStartPositions[index];
        window.scrollTo(0, 100);
        window.scrollTo(0, sectionStartPosition);
      });

      it('the corresponding nav indicator should have the active tick class', async function() {
        var ticks = await document.getElementsByClassName(defaultTickClass);
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
    // it('throws an error if the customAnimation property\'s value isn\'t an object', function() {
    //   expect(function() {
    //     new Navi({ customAnimation: 'notAnObject' });
    //   }).to.throw(TypeError, 'must be an object');
    // });
    // it('throws an error if the customAnimation property\'s keys don\'t include: ' + acceptableKeys[0] + ', ' + acceptableKeys[1], function() {
    //   expect(function() {
    //     new Navi({ customAnimation: { notStart: {}, finish: {}} });
    //   }).to.throw(ReferenceError, 'Unrecognized Key!');
    // });
  });
});
