class Mesh {
    constructor(num_nodes) {
        this.nodes = [];
        for (var i = 0; i < num_nodes; i++) {
            var p = [];
            var p_length = random([3, 4, 5, 6, 7]);
            for (var c = 0; c < p_length; c++) {
                p[c] = [random(-.05, .05), random(-.05, .05), random(-.5, 0)];
                //push out of center
                p[c][0] += 0.95*Math.sign(p[c][0]);
                p[c][1] += 0.95*Math.sign(p[c][1]);
                //p[c][2] += Math.sign(p[c][2]);
            }
            this.nodes[i] = new Node(25, 500, p);
        }
    }
    
    update(speed) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].step(speed);
        }
    }
    
    draw(isPlaying) {
        pointLight(100, 100, 100, 0, 0, 0);
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw();
            if (true) {
                for (var j = i; j < this.nodes.length;j++) {
                    var s = .9; //threshold for size of center square
                    if ((this.nodes[i].pos[0]>s && this.nodes[j].pos[0]>s) || (this.nodes[i].pos[1]>s && this.nodes[j].pos[1]>s) || (this.nodes[i].pos[0]<(-1*s) && this.nodes[j].pos[0]<(-1*s)) || (this.nodes[i].pos[1]<(-1*s) && this.nodes[j].pos[1]<(-1*s))) {
                        stroke(255);
                        beginShape(LINES);
                        var jp = this.nodes[j].cpos();
                        var ip = this.nodes[i].cpos();
                        vertex(ip[0], ip[1], ip[2]);
                        vertex(jp[0], jp[1], jp[2]);
                        endShape();
                    }
                }
            }

        }
    }
    
    update_nodesize(new_size) {
        for (var i = 0; i < this.nodes.length; i ++) {
            this.nodes[i].size = new_size;
        }
    }
}

