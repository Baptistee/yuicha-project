/**
 * Timeline.
 * - Recupere les boutons avec la classe ".js-stepButton" de l'élément passé en paramètre
 * - Au clic :
 *      - ajoute ".js-active" au bouton 
 *      - déclenche un evenement "TriggerStep" sur la timeline avec l'index de la scène sous timeline.stepNumber
 *      - rend inactif le bouton précédent
 */
export default class Timeline extends EventTarget {
    /**
     * @param {HTMLElement} element l'element html correspondant à la timeline
     */
    constructor(element) {
        super()

        this.element = element

        this.currentButton = null

        this.buttons = Array.from(this.element.querySelectorAll(".js-stepButton"))
        if (this.buttons.length < 1) {
            throw new Error("Timeline: there are no stepbuttons. Timeline not initialized.")
            return false
        }
        this.registerButtonsListeners()

        // active la premiere scene
        this.handleClick(this.buttons[0], 0);
    }


    /**
     * Ajoute l'event au clic pour chaque bouton de la timeline
     */
    registerButtonsListeners() {
        this.buttons.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                if (btn !== this.currentButton)
                    this.handleClick(btn, index)
            })
        })
    }


    /**
     * Callback au clic sur un bouton. 
     * Rend inactif tous les boutons sauf le bouton cliqué.
     * Déclenche l'event de changement d'étape.
     * @param {HTMLButtonElement} btn 
     * @param {number} index 
     */
    handleClick(btn, index) {
        // rend inactif le bouton actif précédent
        if (this.currentButton) this.currentButton.classList.remove("js-active")
        
        // active le bouton cliqué
        btn.classList.add("js-active")

        // définit bouton cliqué comme le bouton actif  
        this.currentButton = btn

        this.triggerStep(index)
    }

   
    /**
     * Declenche un event correspondant à l'étape
     * @param {number} stepNumber 
     */
    triggerStep(stepNumber) {
        const event = new Event("TriggerStep")
        event.stepNumber = stepNumber

        this.dispatchEvent(event)
    }
}
