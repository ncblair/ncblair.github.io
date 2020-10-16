class Mesh {
    constructor(num_nodes) {
        this.nodes = [];
        for (var i = 0; i < num_nodes; i++) {
            var p = [];
            var p_length = random([3, 4, 5, 6, 7]);
            for (var c = 0; c < p_length; c++) {
                p[c] = [random(-1, 1), random(-1, 1), random(-2, 0)];
            }
            this.nodes[i] = new Node(40, 500, p);
        }
    }
    
    update(speed) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].step(speed);
        }
    }
    
    draw(isPlaying) {
//        if (do_ortho) {
//            ortho(-width/2, width/2, -height/2, height/2, 0, 5000);
//        }
        pointLight(100, 100, 100, 0, 0, 0);
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw();
            if (true) {
                for (var j = i; j < this.nodes.length;j++) {
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

