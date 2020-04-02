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
class DangerCalculator {
    constructor(timeOut, numInf, numPop) {
        this.time = timeOut;
        this.numInf = numInf;
        this.numPop = numPop;
    }; 
    calcDangerIndex() {
        var contactRate = 10;
        var sigma = 1.0/7.0;
        var percentInfected = this.numInf / this.numPop;
        return 1 - Math.exp(-1 * sigma * percentInfected * contactRate * this.time);
    };
};
// March 30 Data, calculate the probability of being infected 
// if not staying at home for 1440 minutes (24 hours)
let calc = new DangerCalculator(1440, 3000,10000000); 
console.log(calc.calcDangerIndex());


