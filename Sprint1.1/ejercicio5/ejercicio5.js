function getXPath(element) {
	if (element.id) {
		return `//*[@id="${element.id}"]`;
	}
	const parts = [];
	while (element && element.nodeType === Node.ELEMENT_NODE) {
		let index = 1;
		let sibling = element.previousElementSibling;
		while (sibling) {
			if (sibling.nodeName === element.nodeName) {
				index++;
			}
			sibling = sibling.previousElementSibling;
		}
		const tag = element.nodeName.toLowerCase();
		const part = `${tag}${index > 1 ? `[${index}]` : ""}`;
		parts.unshift(part);
		element = element.parentElement;
	}
	return "/" + parts.join("/");
}
function handleClick(event) {
	event.stopPropagation();
	const xpath = getXPath(event.target);
	const output = document.getElementById("xpathConsole");
	if (output) {
		output.textContent = `El xpath es -> ${xpath}`;
	} else {
		alert(`XPath: ${xpath}`);
	}
}
document.addEventListener("DOMContentLoaded", () => {
	document.addEventListener("click", handleClick);
	const iframe = document.getElementById("myIframe");
	iframe.addEventListener("load", () => {
		try {
			const iframeDoc =
				iframe.contentDocument || iframe.contentWindow.document;
			iframeDoc.addEventListener("click", function (event) {
				const xpath = getXPath(event.target);
				const output = document.getElementById("xpathConsole");
				if (output) {
					output.textContent = `El xpath es -> ${xpath}`;
				} else {
					alert(`XPath: ${xpath}`);
				}
			});
		} catch (error) {
			console.error("No se pudo acceder al iframe:", error);
		}
	});
});
