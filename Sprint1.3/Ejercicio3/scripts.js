const baseUrl = "http://localhost:3000";

// Forms and error divs
const partyForm = document.getElementById("partyForm");
const partyErrorDiv = document.getElementById("partyFormError");
const partyList = document.getElementById("partyList");

const memberForm = document.getElementById("memberForm");
const memberErrorDiv = document.getElementById("memberFormError");
const memberList = document.getElementById("memberList");

// Validar fecha futura y válida
function isValidDateTime(str) {
	const date = new Date(str);
	return !isNaN(date.getTime()) && date.getTime() > Date.now();
}

// --- FUNCIONES PARTY ---

async function fetchAndDisplayParties() {
	try {
		// Asumo que hay un endpoint GET /partyfinder/all para obtener todas las parties
		const response = await fetch(`${baseUrl}/partyfinder/all`);
		if (!response.ok) throw new Error("Error obteniendo las parties");
		const parties = await response.json();

		partyList.querySelectorAll(".party-item").forEach(el => el.remove());

		parties.forEach(party => {
			const partyItem = document.createElement("div");
			partyItem.className = "party-item";
			partyItem.innerHTML = `
				<span>Party ${party.id} - ${party.partySize} jugadores</span>
			`;
			partyList.appendChild(partyItem);
		});
	} catch (err) {
		partyErrorDiv.textContent = err.message;
	}
}

partyForm.addEventListener("submit", async e => {
	e.preventDefault();
	partyErrorDiv.textContent = "";

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
		partyErrorDiv.textContent = "Todos los campos son obligatorios.";
		return;
	}

	if (!isValidDateTime(plannedStart)) {
		partyErrorDiv.textContent =
			"Planned Start debe ser una fecha futura con formato válido.";
		return;
	}

	if (levelCap <= 0 || ilvlCap <= 0) {
		partyErrorDiv.textContent =
			"Level Cap e Item Level Cap deben ser números positivos.";
		return;
	}

	const partyData = {
		creator_id: creatorId,
		level_cap: levelCap,
		ilvl_cap: ilvlCap,
		party_role_creator: partyRole,
		planned_start: plannedStart,
	};

	try {
		const response = await fetch(`${baseUrl}/partyfinder/${partySize}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(partyData),
		});
		if (!response.ok) throw new Error("Error creando la party");

		const createdParty = await response.json();

		const partyItem = document.createElement("div");
		partyItem.className = "party-item";
		partyItem.innerHTML = `
			<span>Party ${createdParty.id} - ${partySize} jugadores</span>
		`;
		partyList.appendChild(partyItem);

		partyForm.reset();
	} catch (err) {
		partyErrorDiv.textContent = err.message;
	}
});

// --- FUNCIONES MEMBERS ---

async function fetchAndDisplayMembers() {
	try {
		const response = await fetch(`${baseUrl}/guildmembers`);
		if (!response.ok) throw new Error("Error obteniendo los miembros");
		const members = await response.json();

		memberList.querySelectorAll(".member-item").forEach(el => el.remove());

		members.forEach(member => {
			const memberItem = document.createElement("div");
			memberItem.className = "member-item";
			memberItem.innerHTML = `
				<span>ID: ${member.id} - Nombre: ${member.name || 'N/A'}</span><br/>
				<span>Nivel: ${member.level} - iLvl: ${member.ilvl}</span><br/>
				<span>Rol: ${member.character_role}</span>
			`;
			memberList.appendChild(memberItem);
		});
	} catch (err) {
		memberErrorDiv.textContent = err.message;
	}
}

memberForm.addEventListener("submit", async e => {
	e.preventDefault();
	memberErrorDiv.textContent = "";

	const name = document.getElementById("memberName").value.trim();
	const level = parseInt(document.getElementById("memberLevel").value);
	const ilvl = parseInt(document.getElementById("memberIlvl").value);
	const character_role = document.getElementById("memberRole").value;

	if (!name || !level || !ilvl || !character_role) {
		memberErrorDiv.textContent = "Todos los campos son obligatorios.";
		return;
	}

	if (level <= 0 || ilvl <= 0) {
		memberErrorDiv.textContent =
			"Level e Item Level deben ser números positivos.";
		return;
	}

	const memberData = {
		name,
		level,
		ilvl,
		character_role,
	};

	try {
		const response = await fetch(`${baseUrl}/guildmembers`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(memberData),
		});
		if (!response.ok) throw new Error("Error creando el miembro");

		const createdMember = await response.json();

		const memberItem = document.createElement("div");
		memberItem.className = "member-item";
		memberItem.innerHTML = `
			<span>ID: ${createdMember.id} - Nombre: ${createdMember.name || 'N/A'}</span><br/>
			<span>Nivel: ${createdMember.level} - iLvl: ${createdMember.ilvl}</span><br/>
			<span>Rol: ${createdMember.character_role}</span>
		`;
		memberList.appendChild(memberItem);

		memberForm.reset();
	} catch (err) {
		memberErrorDiv.textContent = err.message;
	}
});

// --- INICIALIZAR LISTAS AL CARGAR ---

window.addEventListener("DOMContentLoaded", () => {
	fetchAndDisplayParties();
	fetchAndDisplayMembers();
});
