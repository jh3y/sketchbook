import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(MotionPathPlugin, ScrollToPlugin)

console.info({ gsap, Observer });

gsap.to('h1', {
	rotate: 360,
	repeat: -1,
	yoyo: true
})

