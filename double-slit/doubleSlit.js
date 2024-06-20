var waveSource;
var num = 0;
document.addEventListener("DOMContentLoaded", function(){
    var canvasE = document.createElement("canvas");
    canvasE.className = "canvasE";
    canvasE.width = window.innerWidth;
    canvasE.height = window.innerHeight;
    document.body.appendChild(canvasE);
    var ctx = canvasE.getContext("2d");

    // Create a wave source that emits particles
    waveSource = new WaveSource();

    // Start the simulation
    setInterval(function() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvasE.width, canvasE.height);

        // Draw two slits on the canvas
        drawSlits(ctx, canvasE.width, canvasE.height);

        // Emit a particle from the wave source
        waveSource.emitParticle();
        var canvasWidth = window.innerWidth;
        var slitWidth = 10;
        // Update and draw each particle
        for (var i = 0; i < waveSource.particles.length; i++) {
            var particle = waveSource.particles[i];
            particle.move();
            particle.draw(ctx);
        }
    }, 1000 / 60); // Run the simulation at 60 frames per second
});

// Draw two slits on the canvas
function drawSlits(ctx, canvasWidth, canvasHeight){
    var slitWidth = 10;
    var slitHeight = canvasHeight/3;
    var slitSpacing = canvasHeight/3;

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
            particle.y = window.innerHeight / 2 - beamWidth / 2 + i; // Position the particles to form a beam
            this.particles.push(particle);
        }
    }
}

function Particle(){
    this.x = 0;
    this.y = window.innerHeight / 2; // Start from the middle of the screen

    this.speed = 4; // Speed of the particle
    this.radius = 5; // Radius of the particle
    this.newRadius = 10;
    this.angle = 0; // Angle of movement, 0 means the particle is moving to the right
    this.split = false;

    this.move = function() {
        var slit1Y = window.innerHeight * 2;
        var slit2Y = window.innerHeight * 2;
        var slitHeight = 10;
        var canvasWidth = window.innerWidth;
        var slitWidth = 10;

        // If the particle reaches the slits and its y-coordinate is within the range of either slit, split it
        if (this.x >= (canvasWidth / 2 - slitWidth / 2) && this.newRadius <= canvasWidth/2) {
            //if ((this.y >= slit1Y && this.y <= slit1Y + slitHeight) || (this.y >= slit2Y && this.y <= slit2Y + slitHeight)) {
            var particle1 = new Particle();
            particle1.angle = -Math.PI / 15; // Particle moves at an angle of -45 degrees
            particle1.x = ((canvasWidth / 2 - slitWidth / 2) + slitWidth)  * Math.cos(this.angle);
            particle1.y = slit1Y * Math.sin(this.angle);

            var particle2 = new Particle();
            particle2.angle = Math.PI / 15; // Particle moves at an angle of 45 degrees
            particle2.x = ((canvasWidth / 2 - slitWidth / 2) + slitWidth)  * Math.cos(this.angle);
            particle2.y = slit1Y * 2 * Math.sin(this.angle);

            // Indicate that the particles should split
            particle1.split = true;
            particle2.split = true;

            // Set the radius of the particles
            particle1.newRadius += this.newRadius + 10;
            particle2.newRadius += this.newRadius + 10;

            waveSource.particles.push(particle1, particle2);
            num++;
            console.log(": "+num);
            console.log(waveSource.particles.length);

            this.hasSplit = true;

            // Remove the original particle
            var index = waveSource.particles.indexOf(this);
            if (index > -1) {
                waveSource.particles.splice(index, 1);
            }
            //}

        }else if(this.x < (canvasWidth / 2 - slitWidth / 2)){
            // Move the particle in the direction specified by this.angle
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
        }
    };

    this.draw = function(ctx) { 
        ctx.beginPath();

        if(this.split){
            // Draw the particle as a semi-circle
            ctx.arc(this.x, this.y, this.newRadius, this.angle - Math.PI / 2, this.angle + Math.PI / 2, false);
            ctx.stroke();
        }else if(!this.split){
            // Draw the particle as a full circle
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "yellow";
            ctx.fill();
        }
        
    };
}