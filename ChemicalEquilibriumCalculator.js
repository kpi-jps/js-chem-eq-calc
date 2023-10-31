
/**
 * @class
 * Class that represents a Chemical Equilibrium calculator
 */
class ChemicalEquilibriumCalculator {

    /**
     * @static
     * Flag for private constructing for ChemicalEquilibriumCalculator class and its yours anonymous classes 
     */
    static #privateConstructing = true;

    /**
     * @class
     * Anounymous class that represents a chemical coumpound in chemical reaction
     */
    static Chemical = class {
        #stoichiometry;
        #activity;
        #isParticipant;
        #isReactant;
        /**
          * @constructor
          * Creates a ChemicalEquilibriumCalculator.Chemical object
          * @param {Number} stoichiometry
          * Stoichiometry of ChemicalEquilibriumCalculator.Chemical object in a chemical rection
          * @param {Number} activity
          * Activity/concentration of ChemicalEquilibriumCalculator.Chemical object in a chemical reaction
          * @param {boolean} isParticipant
          * A flag that indicates if the ChemicalEquilibriumCalculator.Chemical object needs to be considered in chemical equilibrium calculation,
          * set "true" to yes and "false" to not.
          * @param {boolean} isReactant
          * A flag that indicates if the ChemicalEquilibriumCalculator.Chemical object is a reactant, set "true" if the chemical is a product set "false".  
          */
        constructor(stoichiometry, activity, isParticipant, isReactant) {
            if (!ChemicalEquilibriumCalculator.#privateConstructing)
                throw new Error(`${ChemicalEquilibriumCalculator.Chemical.name} is not constructible!`);
            this.#stoichiometry = stoichiometry;
            this.#activity = activity;
            this.#isParticipant = isParticipant;
            this.#isReactant = isReactant;
        }
        /**
         * @method
         * Updates the values of activity/concentration of chemical object, if it's considered in chemical equilibrium calculation
         * @param {Number} variation
         * Increment/Decrement applied on activity/concentration of chemical object
         * */
        updateActivity(variation) {
            if (this.#isParticipant) this.#activity += variation * this.#stoichiometry;
        }
        /**
         * @method
         * Return the value of activity/concentration of chemical object, if it's considered in chemical equilibrium calculation
         * */
        getActivity() {
            if (!this.#isParticipant) return 1
            return this.#activity;
        }
        /**
         * @method
         * Returns the value setted on isReactant property
         * @returns {boolean}
         * The boolean value of isReactant property
         */
        isReactant() {
            return this.#isReactant;
        }
        /**
         * @method
         * Return the value of activity/concentration of chemical object, if it's considered in chemical equilibrium calculation
         * */
        getStoichiometry() {
            return this.#stoichiometry;
        }
    }

    /** 
    * @class
    * Anonymous class of ChemicalEquilibriumCalculator that creates a Result object
    */
    static Result = class {
        /** 
         * @class
         * Anonymous class of ChemicalEquilibriumCalculator that creates a Result object
         * @param {Array<ChemicalEquilibriumCalculator.Chemical>}chemicals 
         * All the chemicals of chemical reaction, products and reactants
         * @param {Number}equilibriumConstant 
         * Equilibrium constant of chemical reaction
         * @param {Number}reactionQuotient 
         * Reactional quotient of chemical reaction
         * @param {Number} calculateCycles
         * Number of cycles used for calculates the Chemical Equilibrium
         * @param @param {boolean} calculateSuccess
         * A boolean flag for success of the calculus where true means success
         */
        constructor(
            calculateSuccess, calculateCycles,
            chemicals, equilibriumConstant, reactionQuotient
        ) {
            if (!ChemicalEquilibriumCalculator.#privateConstructing)
                throw new Error(`${ChemicalEquilibriumCalculator.Result.name} is not constructible!`);
            this.calculateSuccess = calculateSuccess;
            this.calculateCycles = calculateCycles;
            this.chemicals = chemicals;
            this.equilibriumConstant = equilibriumConstant;
            this.reactionQuotient = reactionQuotient;
        }
    }

    #chemicals;
    #equilibriumConstant;

    /**
     * @param {Number} calculateCycles
     * Number of cycles used for calculates the Chemical Equilibrium
     */
    #calculateCycles = 5000;
    /**
    * @param {Number} variationFraction
    * Fraction of variation applied on decrement/increment of activities/concentration during the calculation
    */
    #variationFraction = 0.01;
    /**
    * @param {Number} variation
    * Number applied as decrement/increment of activities/concentration during the calculation, must be always a positive number.
    */
    #variation;
    /**
    * @param {Number} variationOfMatch
    * Fraction of variation allowed for the match between chemical equilibrium constant and reaction quotient
    */
    #variationOfMatch = 0.005;
    /**
    * @param {boolean} forwardReaction
    * A flag for way of chemical reaction, is equal true if is forward reaction
    */
    #forwardReaction;


    /** 
     * @class
     * Creates a Chemical Equilibrium Calculator 
     * @param {Array<ChemicalEquilibriumCalculator.Chemical>}chemicals 
     * All the chemicals of chemical reaction, products and reactants
     * @param {Number}equilibriumConstant 
     * Equilibrium constant of chemical reaction
    */
    constructor(chemicals, equilibriumConstant) {
        this.#chemicals = chemicals;
        this.#equilibriumConstant = equilibriumConstant;
    }




    /**
     * @method
     * Calculates the variation used as decrement/increment in the activities/concentration of reactants and products
     */
    #calculateAndSetVariation() {
        let minimumValue = Infinity;
        for (let c of this.#chemicals)
            if (c.getActivity() != 0) minimumValue = Math.min(minimumValue, c.getActivity());
        this.#variation = minimumValue * this.#variationFraction;
    }

    /**
     * @method
     * Updates the values of activities/concentration of reactants and products during the calculation
     */
    #updateActivities() {
        if (this.#forwardReaction) {
            for (let c of this.#chemicals) {
                if (c.isReactant()) c.updateActivity(-1 * this.#variation);
                else c.updateActivity(this.#variation);

            }
            return;
        }
        for (let c of this.#chemicals) {
            if (c.isReactant()) c.updateActivity(this.#variation);
            else c.updateActivity(-1 * this.#variation);
        }
    }

    /**
     * @method
     * Calculates the reaction quotient between products and reactants
     * @returns {Number}
     * The reaction quotient
     */
    #calculateReactionQuotient() {
        let products = 1, reactants = 1;
        for (let c of this.#chemicals) {
            if (c.isReactant()) reactants *= Math.pow(c.getActivity(), c.getStoichiometry());
            else products *= Math.pow(c.getActivity(), c.getStoichiometry());
        }
        return products / reactants;
    }

    /**
     * @method
     * Static contructor for ChemicalEquilibriumCalculator.Result objects
     * @param {Array<Chemical>}chemicals 
     * All the chemicals of a chemical reaction, products and reactants
     * @param {Number}equilibriumConstant 
     * Equilibrium constant of a chemical reaction
     * @param {Number}reactionQuotient 
     * Reactional quotient of a chemical reaction
     * @param {Number} calculateCycles
     * Number of cycles used for calculates the Chemical Equilibrium
     * @param @param {boolean} calculateSuccess
     * A boolean flag for success of the calculus where true means success
     */
    static #resultOf(
        calculateSuccess, calculateCycles,
        chemicals, equilibriumConstant, reactionQuotient
    ) {
        this.#privateConstructing = true;
        return new ChemicalEquilibriumCalculator.Result(
            calculateSuccess, calculateCycles,
            chemicals, equilibriumConstant, reactionQuotient
        );
    }

    /**
     * @method
     * Static contructor for ChemicalEquilibriumCalculator.Chemical objects
     * @param {Number} stoichiometry
     * Stoichiometry of ChemicalEquilibriumCalculator.Chemical object in a chemical rection
     * @param {Number} activity
     * Activity/concentration of ChemicalEquilibriumCalculator.Chemical object in a chemical reaction
     * @param {boolean} isParticipant
     * A flag that indicates if the ChemicalEquilibriumCalculator.Chemical object needs to be considered in chemical equilibrium calculation,
     * set "true" to yes and "false" to not.
     * @param {boolean} isReactant
     * A flag that indicates if the ChemicalEquilibriumCalculator.Chemical object is a reactant, set "true" if the chemical is a product set "false".  
     */
    static createChemical(stoichiometry, activity, isParticipant, isReactant) {
        if (typeof (stoichiometry) != "number" || isNaN(stoichiometry))
            throw new Error("stoichiometry must be a number!");
        if (typeof (activity) != "number" || isNaN(activity))
            throw new Error("activity must be a number!");
        if (typeof (isParticipant) != "boolean")
            throw new Error("isParticipant must be a boolean!");
        if (typeof (isReactant) != "boolean")
            throw new Error("isReactant must be a boolean!");
        this.#privateConstructing = true;
        return new ChemicalEquilibriumCalculator.Chemical(stoichiometry, activity, isParticipant, isReactant)
    }


    /**
     * @method
     * Perform the calculate to find the situation of chemical equilibrium
     * @returns {ChemicalEquilibriumCalculator.Result}
     * Result object containg informations about chemical equilibrium calculations
     */
    calculate() {
        let calculateCheking = false;
        let reactionQuotient = this.#calculateReactionQuotient();
        let equilibiumRatio = reactionQuotient / this.#equilibriumConstant
        let cycleCount = 0;
        while (!calculateCheking && cycleCount < this.#calculateCycles) {
            this.#forwardReaction = reactionQuotient < this.#equilibriumConstant;
            this.#calculateAndSetVariation();
            this.#updateActivities();
            reactionQuotient = this.#calculateReactionQuotient();
            equilibiumRatio = reactionQuotient / this.#equilibriumConstant;
            if (equilibiumRatio >= 1 - this.#variationOfMatch && equilibiumRatio <= 1 + this.#variationOfMatch) calculateCheking = true;
            cycleCount++;
        }

        return ChemicalEquilibriumCalculator.#resultOf(
            calculateCheking, cycleCount, this.#chemicals, this.#equilibriumConstant, reactionQuotient
        )
    }
}
