'use strict';

const os = require('os');
const socketClient = require('socket.io-client');
const Color = require('color');
const Animations = require('./Animations.js');
const Animation = require('./Animation.js');
const Settings = require('./Settings.js');

module.exports = class Connection {
    constructor(length, uri, light) {
        this.container = {
            id: os.hostname(),
            length: length,
            color: Color('#000000')
        };

        this.uri = uri;
        this.io = socketClient.connect(this.uri, {reconnect: true});
        this.light = light;
        this.animation = null;
        this.lastResponse = null;
        const lastSettings = (() => {
            try {
                return Settings.load();
            } catch (err) {
                return null;
            }
        })();
        lastSettings && this.handleSet(lastSettings);
        this.initHandlers();
    }

    getResponse() {
        return this.lastResponse;
    }

    handleSet (response) {
        if(JSON.stringify(this.container.id) !== JSON.stringify(response.id)){
            return;
        }

        this.lastResponse = response;

        if(this.animation){
            this.animation.stop();
            this.animation = null;
        }

        switch(response.type) {
            case 'solid':
                Animations.fade(this.light, this.container.color, response.value[0]);

                this.container = Object.assign({}, this.container, {
                    color: response.value[0]
                });

                break;
            case 'animation':
                this.animation = new Animation(
                    this.light,
                    response.value.value,
                    response.value.duration ? response.value.duration : 100
                );
                this.animation.start();
                break;
            case 'single': // seems like legacy
                for(var i = 0; i < this.container.length; i++){
                    this.light.setPixel(i, Color(response.color[i] ? response.color[i] : "#000000"));
                }
                break;
        }
    }

    initHandlers() {
        this.io.on('connect', () => {
            console.log('Connected to server: ' + this.uri + '\n...');
        });

        this.io.on('getLights', () => { this.io.emit('initSuccess', this.container) });

        this.io.on('set', response => {
            Settings.save(JSON.stringify(response));
            this.handleSet(response);
        });
    }
}
