/**
 * Courtesy of Trombone.js by @bignimbus on Github ~2016
 * */

import Wad from 'web-audio-daw'

const oscillators = [
  {
    source: 'sawtooth',
    volume: 1.0, // Peak volume can range from 0 to an arbitrarily high number, but you probably shouldn't set it higher than 1.
    detune: 0,
    env: {
      // This is the ADSR envelope.
      attack: 0, // Time in seconds from onset to peak volume.  Common values for oscillators may range from 0.05 to 0.3.
      decay: 0.1, // Time in seconds from peak volume to sustain volume.
      sustain: 0.8, // Sustain volume level. This is a percent of the peak volume, so sensible values are between 0 and 1.
      hold: 120, // Time in seconds to maintain the sustain volume level. If this is not set to a lower value, oscillators must be manually stopped by calling their stop() method.
      release: 0.1, // Time in seconds from the end of the hold period to zero volume, or from calling stop() to zero volume.
    },
  },
  {
    source: 'sawtooth',
    volume: 1.0, // Peak volume can range from 0 to an arbitrarily high number, but you probably shouldn't set it higher than 1.
    detune: 0,
    env: {
      // This is the ADSR envelope.
      attack: 0.05, // Time in seconds from onset to peak volume.  Common values for oscillators may range from 0.05 to 0.3.
      decay: 0.1, // Time in seconds from peak volume to sustain volume.
      sustain: 0.6, // Sustain volume level. This is a percent of the peak volume, so sensible values are between 0 and 1.
      hold: 120, // Time in seconds to maintain the sustain volume level. If this is not set to a lower value, oscillators must be manually stopped by calling their stop() method.
      release: 0.1, // Time in seconds from the end of the hold period to zero volume, or from calling stop() to zero volume.
    },
  },
].map((obj) => new Wad(obj))

Wad.Poly.prototype.setPitch = function (pitch) {
  this.wads = this.wads.map((wad) => {
    if (wad.soundSource) wad.setPitch(pitch)
    return wad
  })
}

const tromboneInstrument = new Wad.Poly({
  pitch: 440, // Set a default pitch on the constuctor if you don't want to set the pitch on play().
  detune: 0, // Set a default detune on the constructor if you don't want to set detune on play(). Detune is measured in cents. 100 cents is equal to 1 semitone.
  filter: [
    {
      type: 'lowpass', // What type of filter is applied.
      frequency: 1200, // The frequency, in hertz, to which the filter is applied.
      q: 0, // Q-factor.  No one knows what this does. The default value is 1. Sensible values are from 0 to 10.
      /*
        env       : {          // Filter envelope.
            frequency : 1200, // If this is set, filter frequency will slide from filter.frequency to filter.env.frequency when a note is triggered.
            attack    : 0.5  // Time in seconds for the filter frequency to slide from filter.frequency to filter.env.frequency
        }
        */
    },
    { type: 'highpass', frequency: 520, q: 0 },
  ],
  /*
    reverb  : {
        wet     : 1,                                            // Volume of the reverberations.
        impulse : 'http://www.myServer.com/path/to/impulse.wav' // A URL for an impulse response file, if you do not want to use the default impulse response.
    },
    delay   : {
        delayTime : .5,  // Time in seconds between each delayed playback.
        wet       : .25, // Relative volume change between the original sound and the first delayed playback.
        feedback  : .25, // Relative volume change between each delayed playback and the next. 
    },
    vibrato : { // A vibrating pitch effect.  Only works for oscillators.
        shape     : 'sine', // shape of the lfo waveform. Possible values are 'sine', 'sawtooth', 'square', and 'triangle'.
        magnitude : 3,      // how much the pitch changes. Sensible values are from 1 to 10.
        speed     : 4,      // How quickly the pitch changes, in cycles per second.  Sensible values are from 0.1 to 10.
        attack    : 0       // Time in seconds for the vibrato effect to reach peak magnitude.
    },
    tremolo : { // A vibrating volume effect.
        shape     : 'sine', // shape of the lfo waveform. Possible values are 'sine', 'sawtooth', 'square', and 'triangle'.
        magnitude : 3,      // how much the volume changes. Sensible values are from 1 to 10.
        speed     : 4,      // How quickly the volume changes, in cycles per second.  Sensible values are from 0.1 to 10.
        attack    : 0       // Time in seconds for the tremolo effect to reach peak magnitude.
    },
    tuna   : {
        Chorus : {
            intensity: 0.3,  //0 to 1
            rate: 4,         //0.001 to 8
            stereoPhase: 0, //0 to 180
            bypass: 0
        }
    }
    */
})

oscillators.forEach((oscillator) => {
  tromboneInstrument.add(oscillator)
})

export default tromboneInstrument