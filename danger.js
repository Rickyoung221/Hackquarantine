/* this calculates the danger of being infected based on number of infected people and population
 * model: exponential distribution exp(lambda) with parameter lambda = contactRate * sigma * percentInfected
 * and CDF: 1-e^(-lambda * timeOut)
 * source: http://www.aimspress.com/fileOther/PDF/MBE/mbe-17-04-153.pdf
*/


/* parameter: 
 * timeOut: the total time the user has been outside
 * numInf: number of infected people in the current county
 * numPop: number of population of the current county
 * 
*/


const contactRate = 10;
const sigma = 1.0/7.0;
class DangerCalculator {
    constructor(timeOut, numInf, numPop) {
        this.time = timeOut;
        // always assume there is at least one person infected to make sense of the mode
        if (numInf == 0) {
            this.numInf = numInf + 1;
        }
        else {
            this.numInf = numInf;
        }
        this.numPop = numPop;
    }; 
    // 0-4: different level of danger
    calcRange() {
        let prob = 1 - Math.exp(-1 * sigma * this.numInf / this.numPop * contactRate * this.time);
        if (prob < 0.2) {
            return 0;
        } else if (prob < 0.4) {
            return 1;
        } else if (prob < 0.6) {
            return 2;
        } else if (prob < 0.8) {
            return 3;
        } else {
            return 4;
        }
    }
    
};


// March 30 Data, calculate the probability of being infected 
// if not staying at home for 1440 minutes (24 hours)

/*
//========test=========//
let calc = new DangerCalculator(1440, 3000,10000000); 
console.log(calc.calcDangerIndex());
//========test=========//
*/