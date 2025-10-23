const form = document.getElementById("partyForm");
const errorDiv = document.getElementById("formError");
const partyList = document.getElementById("partyList");
function isValidDateTime(str) {
	const date = new Date(str);
	return !isNaN(date.getTime()) && date.getTime() > Date.now();
}

form.addEventListener("submit", async e => {
	e.preventDefault();
	errorDiv.textContent = "";

	const partySize = document.getElementById("partySize").value;
	const creatorId = document.getElementById("creatorId").value.trim();
	const levelCap = parseInt(document.getElementById("levelCap").value);
	const ilvlCap = parseInt(document.getElementById("ilvlCap").value);
	const partyRole = document.getElementById("partyRole").value;
	const plannedStart = document.getElementById("plannedStart").value.trim();

	if (
		!partySize ||
		!creatorId ||
		!levelCap ||
		!ilvlCap ||
		!partyRole ||
		!plannedStart
	) {
		errorDiv.textContent = "Todos los campos son obligatorios.";
		return;
	}

	if (!isValidDateTime(plannedStart)) {
		errorDiv.textContent =
			"Planned Start debe ser una fecha futura con formato DD/MM/YYYY_HH:mm.";
		return;
	}

	if (levelCap <= 0 || ilvlCap <= 0) {
		errorDiv.textContent =
			"Level Cap e Item Level Cap deben ser números positivos.";
		return;
	}

	const partyData = {
		partySize,
		creatorId,
		levelCap,
		ilvlCap,
		partyRole,
		plannedStart
	};

	try {
		const response = await fetch("/api/parties", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(partyData)
		});
		if (!response.ok) throw new Error("Error creando la party");

		const createdParty = await response.json();
		const partyItem = document.createElement("div");
		partyItem.className = "party-item";
		partyItem.innerHTML = `
<span>Party ${createdParty.id} - ${createdParty.partySize} jugadores</span>
<span class="party-role">${createdParty.partyRole}</span>
`;
		partyList.appendChild(partyItem);

		form.reset();
	} catch (err) {
		errorDiv.textContent = err.message;
	}
});
