class Node {
    constructor(size, depth_of_field, path) {
        this.pos = path[0]; //3d vector
        this.dir = random([0, 1, 2]);
        // direction is 0, 1, or 2 and corresponds to an axis
        this.size = size;
        this.depth = depth_of_field;
        this.path = path;
        this.path_position = 0;
    }
    
    step(speed) {
        var goal = this.path[this.path_position];
        var direction = Math.sign(goal[this.dir] - this.pos[this.dir]);
        if (direction == 0) {
            direction = 1;
        }
        if (direction == (Math.sign(goal[this.dir] - (this.pos[this.dir] + speed*direction)))) {
            //update position
            this.pos[this.dir] += speed*direction;
        }
        else if (JSON.stringify(this.pos) != JSON.stringify(goal)) {
            //update position direction and speed
            var exhaust = (goal[this.dir] - this.pos[this.dir]);
            this.pos[this.dir] = goal[this.dir];
            this.dir = (this.dir + 1) % 3;
            this.step(speed - exhaust);
        }
        else {
            //update goal
            this.path_position = (this.path_position + 1) % this.path.length;
            this.dir = (this.dir + 1) % 3;
        }
    }
    
    
    draw() {
        noStroke();
        specularMaterial(255);
        push();
        var p = this.cpos();
        translate(p[0], p[1], p[2]);
        sphere(this.size);
        pop();
    }
    
    cpos() {
        //returns position on canvas
        return [this.pos[0]*((width/2)-this.size), this.pos[1]*((height/2)-this.size), this.pos[2]*this.depth];
    }
}