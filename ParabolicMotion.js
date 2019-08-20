var ParabolicMotion = pc.createScript('parabolicMotion');
ParabolicMotion.attributes.add('g', { type: 'number', default: 9.8 });
ParabolicMotion.attributes.add('timeScale', { type: 'number', default: 1 });

ParabolicMotion.attributes.add('setV', { type: 'number', default: 10 });
ParabolicMotion.attributes.add('setAngle', { type: 'number', default: 60 });

ParabolicMotion.attributes.add('setTime', { type: 'number', default: 1 });
ParabolicMotion.attributes.add('setP1', { type: 'vec3' });
ParabolicMotion.attributes.add('setP2', { type: 'vec3' });


// initialize code called once per entity
ParabolicMotion.prototype.initialize = function () {

    this.time = 0;

    this.lerp = new pc.Vec3();
    this.isPlay = false;

    this.init = this.entity.getPosition();

    this.entity.on('key.0', function (v, angle) {
        this.v = v;
        this.angle = angle;
        this.radian = this.angle * Math.PI / 180;
        this.sin = Math.sin(this.radian);
        this.cos = Math.cos(this.radian);
        this.tan = Math.tan(this.radian);

        this.vx = this.v * this.cos;
        this.vy = this.v * this.sin;

        this.t = 2 * (this.vy / this.g);
        this.h = Math.pow(this.vy, 2) / (2 * this.g);

        this.isPlay = true;
    }, this);

    this.entity.on('key.1', function (time, p1, p2) {
        this.lerp.lerp(p1, p2, 1);
        var len = this.lerp.length();

        var gt1 = this.g * Math.pow(time, 2);

        this.radian = Math.atan(gt1 / (2 * len));
        this.sin = Math.sin(this.radian);
        this.cos = Math.cos(this.radian);
        this.tan = Math.tan(this.radian);

        var lt = Math.pow(len / time, 2);
        var gt = Math.pow((this.g * time) / 2, 2);
        this.v = Math.sqrt(lt + gt);
        this.t = time;

        this.vx = this.v * this.cos;
        this.vy = this.v * this.sin;

        this.h = 0.5 * this.g * Math.pow(time / 2, 2);

        this.isPlay = true;
    }, this);
};

// update code called every frame
ParabolicMotion.prototype.update = function (dt) {

    if (this.app.keyboard.isPressed(pc.KEY_SPACE)) {
        this.time = 0;
    }

    if (this.app.keyboard.isPressed(pc.KEY_0)) {
        this.entity.fire('key.0', this.setV, this.setAngle);
        this.time = 0;
    }
    else if (this.app.keyboard.isPressed(pc.KEY_1)) {
        this.entity.fire('key.1', this.setTime, this.setP1, this.setP2);
        this.time = 0;
    }

    if (!this.isPlay) {
        return;
    }


    this.time += (dt * this.timeScale);

    this.proc(this.time);

};


ParabolicMotion.prototype.proc = function (time) {
    var gt = this.g * time;
    this.vy = -gt;

    var x = this.vx * time;
    var g1 = this.g / (2 * Math.pow(this.v, 2) * Math.pow(this.cos, 2));
    var y = (x * this.tan) - g1 * Math.pow(x, 2);

    console.log('x:' + x);
    console.log('y:' + y);
    console.log('t:' + this.t);
    console.log('time:' + time);

    this.entity.setPosition(this.init.x, this.init.y + y, this.init.z - x);
};

// swap method called for script hot-reloading
// inherit your script state here
// ParabolicMotion.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/