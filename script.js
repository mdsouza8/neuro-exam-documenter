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


// Function to copy output to clipboard
function copyToClipboard() {
    let outputTextarea = document.getElementById("output");
    outputTextarea.select();
    document.execCommand("copy");
    alert("Copied!");
}

async function generateChatGPTOutput() {
    // Replace 'YOUR_API_KEY' with your actual OpenAI GPT-3 API key
    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    const examText = document.getElementById('output').value;
    const conversation = [
      {
        role: 'user',
        content: examText,
      },
      {
        role: 'assistant',
        content: 'Please fill out the paragraph below, to be used as part of the Assessment section in a Neurology SOAP clinical documentation note. Using the provided neurologic exam, I want you to fill out the following paragraph, replacing the asterisks with relevant text. You should only use the abnormal exam findings to find a neurologic localization. Examples of neurologic localization include tracts, parts of the brain (ie, left temporal lobe, left precentral gyrus), brainstem (eg, right ventromedial pons), spinal cord and roots, neuromuscular junction, and peripheral nerves amongst others. please state specific locations for localizations. ASSESSMENT: Neurologic exam notable for ***. Neurologic localization includes ***.',
      },
    ];
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: conversation,
          temperature: 0.5,
          max_tokens: 250,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch response from the GPT-3 API.');
      }
  
      const data = await response.json();
      const chatGPTOutput = data.choices[0].message['content'];
      document.getElementById('output').value = chatGPTOutput;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
