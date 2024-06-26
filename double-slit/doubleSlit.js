var waveSource;
var num = 0;
var slitWidth = 10;
var slitHeight = window.innerHeight/3;
var slitSpacing = window.innerHeight/3;
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

document.addEventListener("DOMContentLoaded", function(){
    var canvasE = document.createElement("canvas");
    canvasE.className = "canvasE";
    canvasE.width = canvasWidth;
    canvasE.height = canvasHeight;
    document.body.appendChild(canvasE);
    var ctx = canvasE.getContext("2d");

    // Create a wave source that emits particles
    waveSource = new WaveSource();

    // Clear the canvas
    ctx.clearRect(0, 0, canvasE.width, canvasE.height);

    // Draw two slits on the canvas
    drawSlits(ctx);

    // Start the simulation
    var runSimulation = setInterval(function() {

        // Emit a particle from the wave source
        waveSource.emitParticle();
        var newRadius = 0;
        // Update and draw each particle
        for (var i = 0; i < waveSource.particles.length; i++) {
            var particle = waveSource.particles[i];
            newRadius = particle.move();
            if(newRadius > canvasWidth/2){
                clearInterval(runSimulation);
                console.log("Stopped");
                break;
            }
            particle.draw(ctx);
        }
        
    }, 1000 / 60); // Run the simulation at 60 frames per second
});

// Draw two slits on the canvas
function drawSlits(ctx){
    ctx.fillStyle = "black";
    ctx.fillRect(canvasWidth/2-slitWidth/2, 0, slitWidth, slitHeight); // (x,y,width,height)
    ctx.fillRect(canvasWidth/2-slitWidth/2, slitHeight+slitSpacing, slitWidth, slitHeight); // (x,y,width,height)
    ctx.fillRect(canvasWidth/2-slitWidth/2, slitHeight+(slitHeight/10), slitWidth, slitHeight-(slitHeight/5)); // (x,y,width,height)
}

function WaveSource(){
    this.particles = [];

    // Create particles and emit these from source
    this.emitParticle = function() {
        var beamWidth = 50; // Width of the light beam
        for (var i = 0; i < beamWidth; i++) {
            var particle = new Particle();
            particle.y = canvasHeight / 2 - beamWidth / 2 + i; // Position the particles to form a beam
            this.particles.push(particle);
        }
    }
}

function Particle(){
    this.x = 0;
    this.y = canvasHeight / 2; // Start from the middle of the screen

    this.speed = 4; // Speed of the particle
    this.radius = 10; // Radius of the particle
    this.newRadius = 10; // Radius of the semi circles drawn after the slits
    this.angle = 0; // Angle of movement, 0 means the particle is moving to the right
    this.split = false;

    this.move = function() {

        // If the particle reaches the slits and its y-coordinate is within the range of either slit, split it
        if (this.x >= (canvasWidth / 2 - slitWidth/2) && this.newRadius <= canvasWidth/2) {
            var particle1 = new Particle();
            particle1.angle = Math.PI / 15;
            particle1.x = ((canvasWidth / 2 - slitWidth / 2) + slitWidth)  * Math.cos(this.angle);
            particle1.y = slitHeight;

            var particle2 = new Particle();
            particle2.angle = Math.PI / 15;
            particle2.x = ((canvasWidth / 2 - slitWidth / 2) + slitWidth)  * Math.cos(this.angle);
            particle2.y = slitHeight*2;

            // Indicate that the particles should split
            particle1.split = true;
            particle2.split = true;

            // Set the radius of the particles
            this.newRadius += 50;
            if(this.newRadius > 500){
                console.log(this.newRadius);
            }
            particle1.newRadius = this.newRadius;
            particle2.newRadius = this.newRadius;

            waveSource.particles.push(particle1, particle2);

            // Remove the original particle
            var index = waveSource.particles.indexOf(this);
            if (index > -1) {
                waveSource.particles.splice(index, 1);
            }

        }else if(this.x < (canvasWidth / 2 - slitWidth/2)){
            // Move the particle in the direction specified by this.angle
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
        }
        return this.newRadius;
    };

    this.draw = function(ctx) { 
        ctx.beginPath();
        if(this.split){
            // Draw the particle as a 3/4 semi-circle
            ctx.arc(this.x, this.y, this.newRadius, this.angle - Math.PI/3, this.angle + Math.PI/4, false);
            ctx.strokeStyle = "orange";
            ctx.stroke();
        }else if(!this.split){
            // Draw the particle as a full circle
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "yellow";
            ctx.fill();
        }
        
    };
}