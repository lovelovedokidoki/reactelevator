export default class Elevator {
    constructor(floorcount, speed) {
        this.position = 1;
        this.doorsopen = true;
        this.busy = false;
        this.speed = speed;
    }

    moveup() {
        return new Promise((resolve, reject) => {
            if (this.busy) {
                reject('elevator is busy');
            }
            else if (this.doorsopen) {
                reject('doors still open');
            }
            else if (this.position >= this.floorcount) {
                reject('already on top floor');
            }
            else {
                this.busy = true;
                setTimeout(() => {
                    this.busy = false;
                    this.position++;
                    resolve(this.position);
                }, 2000 / this.speed);
            }
        });
    }

    movedown() {
        return new Promise((resolve, reject) => {
            if (this.busy) {
                reject('elevator is busy');
            }
            else if (this.doorsopen) {
                reject('doors still open');
            }
            else if (this.position <= 1) {
                reject('already on bottom floor');
            }
            else {
                this.busy = true;
                setTimeout(() => {
                    this.busy = false;
                    this.position--;
                    resolve(this.position);
                }, 2000 / this.speed);
            }
        });
    }

    closedoors() {
        return new Promise((resolve, reject) => {
            if (this.busy) {
                reject('elevator is busy');
            }
            else if (!this.doorsopen) {
                reject('doors already closed');
            }
            else {
                this.busy = true;
                setTimeout(() => {
                    this.busy = false;
                    this.doorsopen = false;
                    resolve(this.position);
                }, 1000 / this.speed);
            }
        });
    }

    opendoors() {
        return new Promise((resolve, reject) => {
            if (this.busy) {
                reject('elevator is busy');
            }
            else if (this.doorsopen) {
                reject('doors already open');
            }
            else {
                this.busy = true;
                setTimeout(() => {
                    this.busy = false;
                    this.doorsopen = true;
                    resolve(this.position);
                }, 1000 / this.speed);
            }
        });
    }
}