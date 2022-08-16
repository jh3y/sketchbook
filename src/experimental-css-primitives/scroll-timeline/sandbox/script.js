const HATCH = document.querySelector('#escape-hatch')

const insertStyles = styles => HATCH.innerHTML += styles

const STYLES_TO_INSERT = `
	@scroll-timeline first-timeline {
		source: auto;
		scroll-offsets: 0, 100px;
	}
`

insertStyles(STYLES_TO_INSERT)

var elem = document.getElementById("container");
var st = new ScrollTimeline();
var a = document
  .querySelector("#test")
  .animate({
    rotate: ['0deg', '360deg', '360deg'],
    offset: [0, 0.8, 1]
  },
    // [
    //   { rotate: '0deg', offset: 0 },
    //   { rotate: '360deg', offset: [0.8, 1] }
    // ],
    {
      // duration: 50,
      // rotate: ['0deg', '360deg'],
      fillMode: 'forwards',
      timeline: st
    }
  );



// Use the scroll-timeline polyfills

  "use strict";

  const progressBars = document.querySelectorAll('.progress-bar-progress');
  const createProgressAnimation = (bar, range, orientation) => {
    const target = document.getElementById('target');
    const viewTimeline = new ViewTimeline({
      'subject': target,
      'axis': orientation
    });
    bar.animate( { width: ['0px', '200px' ] }, {
      timeline: viewTimeline,
      timeRange: `${range}`,
      fill: 'both'
    });
  }
  const createAnimations = (selection) => {
    const orientation = selection == 'vertical-tb' ? 'block' : 'inline';
    document.getAnimations().forEach(anim => {
      anim.cancel();
    });
    createProgressAnimation(progressBars[0], 'cover', orientation);
    createProgressAnimation(progressBars[1], 'contain', orientation);
    createProgressAnimation(progressBars[2], 'enter', orientation);
    createProgressAnimation(progressBars[3], 'exit', orientation);
    createProgressAnimation(progressBars[4], 'contain 25% 75%', orientation);
    createProgressAnimation(progressBars[5], 'enter 150% exit -50%',
                            orientation);
  };

  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', (evt) => {
      document.getAnimations().forEach(anim => {
        anim.cancel();
      });
      const selection = event.target.id;
      switch(selection) {
        case 'vertical-tb':
          container.classList.remove('rtl');
          container.classList.remove('ltr');
          overlay.classList.remove('rtl');
          break;

        case 'horizontal-ltr':
          container.classList.remove('rtl');
          container.classList.add('ltr');
          overlay.classList.remove('rtl');
          break;

        case 'horizontal-rtl':
          container.classList.add('rtl');
          container.classList.remove('ltr');
          overlay.classList.add('rtl');
      }
      createAnimations(evt.target.id);
    });
  });

  createAnimations('vertical-tb');

var elem = document.getElementById("container");
var st = new ScrollTimeline();
var a = document
  .querySelector("#test")
  .animate(
    [
      { rotate: '0deg' },
      { rotate: '360deg' }
    ],
    {
      // duration: 50,
      timeline: st
    }
  );
