let examFindings = {
    mentalStatus: "Awake, alert, attentive, conversational. Intact to recent and remote medical history. Fluent language with intact naming, repetition, and comprehension. No neglect noted.",
    cranialNerves: "Pupils round and bilaterally reactive to light. Visual fields full to confrontation. Conjugate gaze. EOM full bilaterally with intact smooth pursuit. No diplopia, ptosis, nystagmus. Facial sensation symmetric to light touch bilaterally. Face symmetric at rest and with activation (smile, eyebrow raise, eye closure). Hearing intact to conversation.",
    motor: "No extraneous movements noted. Muscle bulk normal and symmetric. No pronator drift, clamshelling, or satteliting. 5/5 strength to confrontational testing of bilateral shoulder abduction, elbow flexion/extension, wrist flexion/extension, thumb abduction, hip flexion, knee flexion/extension, ankle plantar flexion/dorsiflexion.",
    reflexes: "No Hoffman's or ankle clonus.",
    sensory: "Intact and symmetric to light touch in the proximal and distal upper and lower extremities.",
    cerebellar: "No dysmetria on FNF bilaterally. Intact fine finger movements bilaterally.",
    gait: "Normal.",
};

let modified = new Set();

function getInput(category) {
    let sentences = examFindings[category].split(". ");
    let modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = '';

    sentences.forEach((sentence, index) => {
        if (sentence.trim() !== '') {
            modalContent.innerHTML += `<p id="${category}${index}" contenteditable="true">${sentence.trim()}</p>`;
        }
    });

    document.getElementById("myModal").style.display = "block";
}

function saveChanges() {
    let modalContent = document.getElementById("modalContent");
    let category = modalContent.firstChild.id.slice(0, -1);
    let newFindings = "";

    for (let i = 0; i < modalContent.childNodes.length; i++) {
        let child = modalContent.childNodes[i];
        if (child.textContent !== examFindings[category].split(". ")[parseInt(child.id.slice(-1))].trim()) {
            modified.add(category);
        }
        newFindings += child.textContent + ((i !== modalContent.childNodes.length - 1) ? ". " : ".");
    }

    examFindings[category] = newFindings;
    document.getElementById(category).style.backgroundColor = modified.has(category) ? "red" : "blue";

    document.getElementById("myModal").style.display = "none";
    
}

function generateReport() {
    let output = "";

    for (let category in examFindings) {
        let formattedCategory = category.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
        output += `${formattedCategory}: ${examFindings[category]}\n`;
    }

    document.getElementById("output").value = output;
}

window.onclick = function(event) {
    let modal = document.getElementById("myModal");

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

// Add event listener to the close button
document.getElementById("closeModalButton").addEventListener("click", closeModal);

// Function to copy output to clipboard
function copyToClipboard() {
    let outputTextarea = document.getElementById("output");
    outputTextarea.select();
    document.execCommand("copy");
    alert("Copied!");
}