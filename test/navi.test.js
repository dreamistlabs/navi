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

  describe('a new Navi instance with no options argument', function() {
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

  describe('with options argument', function() {
    var customTickClass       = 'custom-item';
    var customSectionClass    = 'custom-section';

    describe('and a custom tick and section class that exist in the DOM', function() {
      before(function() {
        generateElements('section', customSectionClass, 'main');
        generateElements('indicators', customTickClass, 'navi-list');
        navi = new Navi({
          ticks: customTickClass,
          sections: customSectionClass
        });
      });

      it('tick class should equal custom class: ' + customTickClass, function() {
        assert.strictEqual(navi.tickClass, customTickClass);
      });
      it('section class should equal custom class: ' + customSectionClass, function() {
        assert.strictEqual(navi.sectionClass, customSectionClass);
      });
      it('tick collection should not be empty', function() {
        assert.notStrictEqual(navi.tickCollection.length, 0);
      });
      it('section collection should not be empty', function() {
        assert.notStrictEqual(navi.sectionCollection.length, 0);
      });
      it('collection of section start positions should not be empty', function() {
        assert.notStrictEqual(navi.sectionStartPositions.length, 0);
      });
      it('collection of section heights should not be empty', function() {
        assert.notStrictEqual(navi.sectionHeights.length, 0);
      });

      after(function() {
        removeElements(customTickClass);
        removeElements(customSectionClass);
      });
    });

    describe('and a custom tick and section class that DOES NOT exist in the DOM', function() {
      before(function() {
        generateElements('section', defaultSectionClass, 'main');
        generateElements('indicators', defaultTickClass, 'navi-list');
      });

      it('throws an error if unable to collect elements with custom ticks class', function() {
        var regex = new RegExp('\\bMissing Collection\\b.*\\b' + customTickClass + '\\b');
        expect(function() {
          navi = new Navi({
            ticks: customTickClass
          });
        }).to.throw(Error, regex);
      });
      it('throws an error if unable to collect elements with custom sections class', function() {
        var regex = new RegExp('\\bMissing Collection\\b.*\\b' + customSectionClass + '\\b');
        expect(function() {
          navi = new Navi({
            sections: customSectionClass
          });
        }).to.throw(Error, regex);
      });

      after(function() {
        removeElements(defaultTickClass);
        removeElements(defaultSectionClass);
      });
    });

    describe('and a custom active tick class', function() {
      var navi;
      var customActiveTickClass = 'navi--active';

      before(function() {
        generateElements('section', defaultSectionClass, 'main');
        generateElements('indicators', defaultTickClass, 'navi-list');
        navi = new Navi({
          activeTickClass: customActiveTickClass
        });
      });

      it('active tick class should custom class, ' + customActiveTickClass, function() {
        assert.strictEqual(navi.activeTickClass, customActiveTickClass);
      });

      after(function() {
        removeElements(defaultTickClass);
        removeElements(defaultSectionClass);
      });
    });
  });

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

  describe('Error Handling', function() {
    describe('an options argument that isn\'t an object', function() {
      it('throws an Argument Error', function() {
        expect(function() {
          new Navi(50);
        }).to.throw(TypeError, 'must be an object');
      });
    });

    describe('a customAnimation value that isn\'t an object', function() {
      it('throws an Argument Error', function() {
        expect(function() {
          new Navi({ customAnimation: 'notAnObject' });
        }).to.throw(TypeError, 'must be an object');
      });
    });
  });
});
