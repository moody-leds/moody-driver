'use strict';

const Utils = require('./Utils.js');

module.exports = class Animations {
    const black = Color("#000000");
    
    static randomPixelIteration(light) {
        for(var i = 0; i < light.length; i++){
            light.setPixel(i, Utils.getRandomColor());
            Utils.sleep(200);
            light.setPixel(i, black);
        }
    }
    
    static fade(light, to, from) {
        const range = 20;
        for(var i = 1; i <= range; i++){
            light.solid(Color(from).mix(Color(to), i / range));
        }
    }
    
    static christmas(light) {
        const red = Color('#ff003d');
        const green = Color('#00ab4c');
        
        for(var i = 0; i < 2; i++) {
            for(var j = 0; j < light.length; j++) {
                light.setPixel(j, i % 2 ? red : green);
            }
            
            Utils.sleep(350);
        }
    }
}